const DEBOUNCE_DURATION = 150;
const FOCUS_STORAGE_KEY = "omarchy.manual-search.focus";
const MAX_RESULTS = 8;
const PAGEFIND_FILTERS = { section: "manual" };

function conciseText(value) {
  const documentFragment = new DOMParser().parseFromString(value ?? "", "text/html");
  const text = documentFragment.body.textContent.replace(/\s+/g, " ").trim();
  const limit = 160;

  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

function pagefindResult(documentResult) {
  return {
    excerpt: documentResult.excerpt,
    title: documentResult.meta?.title ?? documentResult.title ?? documentResult.url,
    url: documentResult.url,
  };
}

export function initManual() {
  const manual = document.querySelector("[data-manual]");
  if (!manual) return;

  const search = manual.querySelector("[data-manual-search]");
  const input = search?.querySelector(".manual-search__input");
  const results = search?.querySelector(".manual-search__results");
  const pagefindUrl = search?.dataset.pagefindUrl;
  if (
    !(input instanceof HTMLInputElement) ||
    !(results instanceof HTMLElement) ||
    !pagefindUrl
  ) {
    return;
  }

  let active = -1;
  let debounceTimer;
  let matches = [];
  let pagefindPromise;
  let query = "";
  let requestIdentity = 0;

  search.hidden = false;

  const close = () => {
    window.clearTimeout(debounceTimer);
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
    const fragment = document.createDocumentFragment();

    if (matches.length === 0) {
      const empty = document.createElement("p");
      empty.className = "manual-search__empty";
      empty.textContent = `No results for “${query}”`;
      fragment.append(empty);
    } else {
      matches.forEach(({ excerpt, title, url }, index) => {
        const result = document.createElement("a");
        const heading = document.createElement("span");
        const resultTitle = document.createElement("span");
        const preview = document.createElement("span");

        result.className = "manual-search__result";
        result.href = url;
        result.id = `manual-search-result-${index}`;
        result.setAttribute("role", "option");
        result.setAttribute("aria-selected", "false");
        result.tabIndex = -1;

        heading.className = "manual-search__result-heading";
        resultTitle.className = "manual-search__result-title";
        resultTitle.textContent = title;
        heading.append(resultTitle);
        preview.className = "manual-search__result-preview";
        preview.textContent = conciseText(excerpt);
        result.append(heading, preview);
        fragment.append(result);
      });
    }

    results.replaceChildren(fragment);
    open();
  };

  const unavailable = () => {
    matches = [];
    active = -1;
    results.textContent = "";
    const empty = document.createElement("p");
    empty.className = "manual-search__empty";
    empty.textContent = "Manual search is unavailable right now";
    results.append(empty);
    open();
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

  const run = async (identity) => {
    try {
      pagefindPromise ??= import(pagefindUrl);
      const pagefind = await pagefindPromise;
      const response = await pagefind.search(query, { filters: PAGEFIND_FILTERS });
      const documents = await Promise.all(
        response.results.slice(0, MAX_RESULTS).map((result) => result.data()),
      );

      if (identity !== requestIdentity) return;
      matches = documents.map(pagefindResult);
      active = -1;
      render();
    } catch {
      if (identity !== requestIdentity) return;
      unavailable();
    }
  };

  const scheduleSearch = (value) => {
    query = value.trim();
    requestIdentity += 1;
    const identity = requestIdentity;
    window.clearTimeout(debounceTimer);

    if (!query) {
      close();
      return;
    }

    results.textContent = "";
    const loading = document.createElement("p");
    loading.className = "manual-search__empty";
    loading.textContent = "Searching…";
    results.append(loading);
    open();
    debounceTimer = window.setTimeout(() => run(identity), DEBOUNCE_DURATION);
  };

  input.addEventListener("input", () => scheduleSearch(input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!results.hidden) select(active + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" && !results.hidden) {
      const chosen = matches[active >= 0 ? active : 0];
      if (chosen) {
        event.preventDefault();
        window.location.assign(chosen.url);
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

  try {
    if (window.sessionStorage.getItem(FOCUS_STORAGE_KEY)) {
      window.sessionStorage.removeItem(FOCUS_STORAGE_KEY);
      window.requestAnimationFrame(() => input.focus({ preventScroll: true }));
    }
  } catch {}

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
