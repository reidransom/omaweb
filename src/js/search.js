const minimumQueryLength = 2;
const debounceDuration = 150;
const destinationLimit = 5;
const pagefindLimit = 8;

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;

  if (target.closest("input, textarea, select")) return true;

  const editable = target.closest("[contenteditable]");
  return editable !== null && editable.getAttribute("contenteditable") !== "false";
}

function conciseText(value) {
  const documentFragment = new DOMParser().parseFromString(value ?? "", "text/html");
  const text = documentFragment.body.textContent.replace(/\s+/g, " ").trim();
  const limit = 220;

  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

function navigationDestinations() {
  const navigationData = document.querySelector("[data-search-navigation]");
  const destinationData = document.querySelector("[data-search-destinations]");

  if (!navigationData || !destinationData) return [];

  try {
    const navigation = JSON.parse(navigationData.textContent);
    const destinations = new Map(
      JSON.parse(destinationData.textContent).items.map((destination) => [
        destination.slug,
        destination,
      ]),
    );
    const seenUrls = new Set();

    return navigation.sections.flatMap((section) => {
      const entries = [section, ...(section.links?.items ?? [])];

      return entries.flatMap((entry) => {
        const destination = entry.destination ? destinations.get(entry.destination) : null;
        const url = destination?.url ?? entry.url;
        const label = entry.label ?? destination?.label;
        const external = destination?.external ?? entry.external ?? false;

        if (!url || !label || seenUrls.has(url)) return [];
        seenUrls.add(url);

        return [{ label, url, external, section: section.label }];
      });
    });
  } catch {
    return [];
  }
}

function matchingDestinations(destinations, term) {
  const normalizedTerm = term.toLocaleLowerCase();

  return destinations
    .filter(({ label, section }) =>
      `${label} ${section}`.toLocaleLowerCase().includes(normalizedTerm),
    )
    .slice(0, destinationLimit);
}

function resultLink({ url, title, excerpt, external = false, section }, index) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const heading = document.createElement("h3");

  link.href = url;
  link.dataset.searchResult = "";
  link.dataset.searchResultIndex = index;
  link.textContent = title;
  heading.append(link);
  item.append(heading);

  if (section) {
    const location = document.createElement("p");
    location.className = "site-search__result-context";
    location.textContent = section;
    item.append(location);
  }

  if (excerpt) {
    const summary = document.createElement("p");
    summary.className = "site-search__result-excerpt";
    summary.textContent = conciseText(excerpt);
    item.append(summary);
  }

  if (external) {
    const indicator = document.createElement("span");
    indicator.className = "site-search__external";
    indicator.textContent = "External";
    item.append(indicator);
  }

  return item;
}

function resultGroup(title, items, index) {
  if (items.length === 0) return null;

  const group = document.createElement("section");
  const heading = document.createElement("h2");
  const list = document.createElement("ol");

  group.className = "site-search__group";
  heading.textContent = title;
  list.setAttribute("role", "list");
  items.forEach((item) => list.append(resultLink(item, index.next++)));
  group.append(heading, list);

  return group;
}

function pagefindResult(documentResult) {
  return {
    url: documentResult.url,
    title: documentResult.meta?.title ?? documentResult.title ?? documentResult.url,
    excerpt: documentResult.excerpt,
  };
}

export function initSiteSearch({ quake } = {}) {
  const surfaces = [...document.querySelectorAll("[data-site-search]")].map((root) => ({
    root,
    form: root.querySelector("[data-site-search-form]"),
    input: root.querySelector("input[name='q']"),
    status: root.querySelector("[data-site-search-status]"),
    results: root.querySelector("[data-site-search-results]"),
    fallback: root.querySelector("[data-site-search-fallback]"),
    isSpotlight: root.closest("dialog") !== null,
  }));
  const dialog = document.querySelector("[data-spotlight]");
  const searchTriggers = [...document.querySelectorAll("[data-spotlight-open]")];

  if (
    surfaces.length === 0 ||
    !dialog ||
    !("HTMLDialogElement" in window) ||
    typeof dialog.showModal !== "function"
  ) {
    return null;
  }

  const destinations = navigationDestinations();
  const pagefindUrl = surfaces.find(({ form }) => form)?.form.dataset.pagefindUrl;
  let pagefindPromise;
  let requestIdentity = 0;
  let debounceTimer;
  const surfaceResults = new Map();
  let searchTrigger = searchTriggers[0] ?? null;

  const setSelection = (surface, index) => {
    const resultState = surfaceResults.get(surface);
    if (!resultState || resultState.links.length === 0) return;

    resultState.selectedIndex =
      (index + resultState.links.length) % resultState.links.length;
    resultState.links.forEach((link, linkIndex) => {
      link.classList.toggle("is-active", linkIndex === resultState.selectedIndex);
    });
  };

  const render = ({ state, term = "", destinationResults = [], pageResults = [] }) => {
    surfaces.forEach((surface) => {
      const fragment = document.createDocumentFragment();
      const index = { next: 0 };
      const destinationGroup = resultGroup("Destinations", destinationResults, index);
      const pageGroup = resultGroup("Pages & News", pageResults, index);

      if (destinationGroup) fragment.append(destinationGroup);
      if (pageGroup) fragment.append(pageGroup);
      surface.results.replaceChildren(fragment);
      surface.status.textContent =
        state === "loading"
          ? "Searching…"
          : state === "empty"
            ? `No results for “${term}”.`
            : state === "error"
              ? "Search is unavailable."
              : state === "results"
                ? `${destinationResults.length + pageResults.length} result${destinationResults.length + pageResults.length === 1 ? "" : "s"} for “${term}”.`
                : "";

      if (surface.fallback) {
        surface.fallback.hidden = state !== "error";
      }
      const links = [...surface.results.querySelectorAll("[data-search-result]")];
      const resultState = { links, selectedIndex: -1 };
      surfaceResults.set(surface, resultState);
      links.forEach((link, index) => {
        link.addEventListener("pointermove", () => setSelection(surface, index));
        link.addEventListener("focus", () => setSelection(surface, index));
        link.addEventListener("click", () => {
          if (surface.isSpotlight && dialog.open) dialog.close();
        });
      });
    });
  };

  const clearSearch = () => {
    window.clearTimeout(debounceTimer);
    requestIdentity += 1;
    render({ state: "idle" });
  };

  const runSearch = async (term, identity) => {
    if (identity !== requestIdentity) return;

    const destinationResults = matchingDestinations(destinations, term);
    render({ state: "loading" });

    try {
      pagefindPromise ??= import(pagefindUrl);
      const pagefind = await pagefindPromise;
      const response = await pagefind.search(term);
      const documents = await Promise.all(
        response.results.slice(0, pagefindLimit).map((result) => result.data()),
      );

      if (identity !== requestIdentity) return;

      const pageResults = documents.map(pagefindResult);
      render({
        state: destinationResults.length + pageResults.length === 0 ? "empty" : "results",
        term,
        destinationResults,
        pageResults,
      });
    } catch {
      if (identity !== requestIdentity) return;
      render({ state: "error", term, destinationResults });
    }
  };

  const scheduleSearch = (value) => {
    const term = value.trim();

    surfaces.forEach((surface) => {
      if (surface.input.value !== value) surface.input.value = value;
    });

    if (term.length < minimumQueryLength) {
      clearSearch();
      return;
    }

    window.clearTimeout(debounceTimer);
    const identity = ++requestIdentity;
    render({ state: "loading", term, destinationResults: matchingDestinations(destinations, term) });
    debounceTimer = window.setTimeout(() => runSearch(term, identity), debounceDuration);
  };

  const closeSpotlight = () => {
    if (dialog.open) dialog.close();
  };

  const openSpotlight = (trigger = searchTriggers[0]) => {
    searchTrigger = trigger ?? searchTriggers[0] ?? null;
    quake?.close({ immediate: true });

    if (dialog.open) {
      dialog.querySelector("input[name='q']")?.focus();
      return;
    }

    dialog.showModal();
    dialog.querySelector("input[name='q']")?.focus();
  };

  surfaces.forEach((surface) => {
    surface.input.addEventListener("input", () => scheduleSearch(surface.input.value));
    surface.form.addEventListener("submit", (event) => {
      event.preventDefault();
      scheduleSearch(surface.input.value);
    });
    surface.form.addEventListener("keydown", (event) => {
      const resultState = surfaceResults.get(surface);
      if (!resultState) return;

      if (event.key === "ArrowDown" && resultState.links.length > 0) {
        event.preventDefault();
        setSelection(surface, resultState.selectedIndex + 1);
      } else if (event.key === "ArrowUp" && resultState.links.length > 0) {
        event.preventDefault();
        setSelection(surface, resultState.selectedIndex - 1);
      } else if (event.key === "Enter" && resultState.selectedIndex >= 0) {
        event.preventDefault();
        resultState.links[resultState.selectedIndex].click();
      }
    });
  });

  searchTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openSpotlight(trigger);
    });
  });

  dialog.querySelector("[data-spotlight-close]")?.addEventListener("click", closeSpotlight);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeSpotlight();
  });
  dialog.addEventListener("close", () => {
    window.requestAnimationFrame(() => searchTrigger?.focus());
  });
  document.addEventListener("omarchy:quake-open", closeSpotlight);
  document.addEventListener("keydown", (event) => {
    if (isEditableTarget(event.target)) return;

    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey &&
      !event.metaKey &&
      event.code === "KeyK"
    ) {
      event.preventDefault();
      openSpotlight(searchTriggers[0]);
    }
  });

  render({ state: "idle" });

  const initialQuery = new URLSearchParams(window.location.search).get("q");
  if (initialQuery) scheduleSearch(initialQuery);

  return { close: closeSpotlight, open: openSpotlight };
}
