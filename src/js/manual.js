const INDEX_URL = "/manual/search-index.json";
const MAX_RESULTS = 8;
const PREVIEW_LENGTH = 160;
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

const escapeHtml = (text) => text.replace(/[&<>"]/g, (character) => ESCAPES[character]);

const quote = (term) =>
  [...term]
    .map((character) => character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("-?");

const compile = (query) => {
  const sources = query.toLowerCase().split(/[^\p{L}\p{N}+#_-]+/u).filter(Boolean).map(quote);
  if (sources.length === 0) return null;

  return {
    terms: sources.map((source) => ({
      anywhere: new RegExp(`(?<![\\p{L}\\p{N}])${source}`, "giu"),
      whole: new RegExp(`(?<![\\p{L}\\p{N}])${source}(?![\\p{L}\\p{N}])`, "iu"),
    })),
    phrase: query.toLowerCase(),
    first: new RegExp(`(?<![\\p{L}\\p{N}])(?:${sources.join("|")})`, "iu"),
    words: new RegExp(`(${sources.map((source) => `${source}[\\p{L}\\p{N}]*`).join("|")})`, "giu"),
  };
};

const occurrences = (text, term) => (text.match(term) || []).length;

const score = (entry, pattern) => {
  let total = 0;
  for (const term of pattern.terms) {
    const inTitle = occurrences(entry.title, term.anywhere);
    const inText = occurrences(entry.text, term.anywhere);
    if (inTitle === 0 && inText === 0) return 0;

    total += inTitle * 30 + Math.min(inText, 5) * 2 + occurrences(entry.chapter, term.anywhere) * 10;
    if (term.whole.test(entry.title)) total += 20;
  }

  if (
    pattern.terms.length > 1 &&
    `${entry.title} ${entry.chapter} ${entry.text}`.toLowerCase().includes(pattern.phrase)
  ) {
    total += 40;
  }
  return total;
};

const lookup = (entries, query) => {
  const pattern = compile(query);
  if (!pattern) return [];

  return entries
    .map((entry) => ({ entry, pattern, score: score(entry, pattern) }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score || left.entry.url.localeCompare(right.entry.url));
};

const highlight = (text, pattern) =>
  text
    .split(pattern.words)
    .map((part, index) => (index % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join("");

const preview = (text, pattern) => {
  const at = text.search(pattern.first);
  const start = Math.max(0, at - PREVIEW_LENGTH / 3);
  let snippet = text.slice(start, start + PREVIEW_LENGTH);
  if (start > 0) snippet = `…${snippet.replace(/^\S*\s/, "")}`;
  if (start + PREVIEW_LENGTH < text.length) snippet = `${snippet.replace(/\s\S*$/, "")}…`;
  return highlight(snippet, pattern);
};


export function initManual() {
  const manual = document.querySelector("[data-manual]");
  if (!manual) return;

  const search = manual.querySelector("[data-manual-search]");
  const input = search?.querySelector(".manual-search__input");
  const results = search?.querySelector(".manual-search__results");
  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement)) return;

  let entries = null;
  let loading = null;
  let query = "";
  let matches = [];
  let active = -1;

  search.hidden = false;

  const close = () => {
    results.hidden = true;
    matches = [];
    active = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  };

  const open = () => {
    results.hidden = false;
    input.setAttribute("aria-expanded", "true");
    input.removeAttribute("aria-activedescendant");
  };

  const render = () => {
    results.innerHTML = matches.length
      ? matches
          .map(({ entry, pattern }, index) => {
            const chapter = entry.title === entry.chapter
              ? ""
              : `<span class="manual-search__result-chapter">${escapeHtml(entry.chapter)}</span>`;
            return `<a class="manual-search__result" href="${escapeHtml(entry.url)}" role="option" id="manual-search-result-${index}" aria-selected="false" tabindex="-1">
              <span class="manual-search__result-heading">
                <span class="manual-search__result-title">${highlight(entry.title, pattern)}</span>
                ${chapter}
              </span>
              <span class="manual-search__result-preview">${preview(entry.text, pattern)}</span>
            </a>`;
          })
          .join("")
      : `<p class="manual-search__empty">No results for “${escapeHtml(query)}”</p>`;
    open();
  };

  const unavailable = () => {
    matches = [];
    active = -1;
    results.innerHTML = '<p class="manual-search__empty">Manual search is unavailable right now</p>';
    open();
  };

  const load = () => {
    loading ||= fetch(INDEX_URL)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((index) => {
        entries = index;
      })
      .catch(() => {
        loading = null;
      });
    return loading;
  };

  const run = (value) => {
    query = value.trim();
    if (!query) {
      close();
      return;
    }
    if (!entries) {
      load().then(() => {
        if (query !== input.value.trim()) return;
        if (entries) run(input.value);
        else unavailable();
      });
      return;
    }

    matches = lookup(entries, query).slice(0, MAX_RESULTS);
    active = -1;
    render();
  };

  const select = (index) => {
    const options = [...results.querySelectorAll(".manual-search__result")];
    if (options.length === 0) return;

    active = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const selected = optionIndex === active;
      option.classList.toggle("manual-search__result--active", selected);
      option.setAttribute("aria-selected", String(selected));
    });
    options[active].scrollIntoView({ block: "nearest" });
    input.setAttribute("aria-activedescendant", options[active].id);
  };

  input.addEventListener("focus", load);
  input.addEventListener("input", () => run(input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.hidden) run(input.value);
      else select(active + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" && !results.hidden) {
      const chosen = matches[active >= 0 ? active : 0];
      if (chosen) {
        event.preventDefault();
        window.location.assign(chosen.entry.url);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (results.hidden) {
        input.value = "";
        input.blur();
      } else {
        close();
      }
    } else if (event.key === "Tab") {
      close();
    }
  });

  results.addEventListener("mousedown", (event) => {
    if (event.target.closest(".manual-search__result")) event.preventDefault();
  });
  search.addEventListener("focusout", (event) => {
    if (!search.contains(event.relatedTarget)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (
      !event.defaultPrevented &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey &&
      event.target === document.body &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      const link = manual.querySelector(event.key === "ArrowLeft" ? 'a[rel="prev"]' : 'a[rel="next"]');
      if (link instanceof HTMLAnchorElement) {
        event.preventDefault();
        window.location.assign(link.href);
      }
    }
  });
}
