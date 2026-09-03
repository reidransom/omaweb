import { isEditableTarget } from "./editable-target.js";

const minimumQueryLength = 2;
const debounceDuration = 150;
const destinationLimit = 5;
const pagefindLimit = 8;

function conciseText(value) {
  const documentFragment = new DOMParser().parseFromString(value ?? "", "text/html");
  const text = documentFragment.body.textContent.replace(/\s+/g, " ").trim();
  const limit = 220;

  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

function searchData() {
  const navigationData = document.querySelector("[data-search-navigation]");
  const destinationData = document.querySelector("[data-search-destinations]");
  const productData = document.querySelector("[data-search-products]");

  if (!navigationData || !destinationData || !productData) return null;

  try {
    return {
      navigation: JSON.parse(navigationData.textContent),
      destinations: JSON.parse(destinationData.textContent).items,
      products: JSON.parse(productData.textContent).items,
    };
  } catch {
    return null;
  }
}

function navigationDestinations(data) {
  if (!data) return [];

  const { navigation, destinations, products } = data;
  const seenUrls = new Set();

  return navigation.section_order.flatMap((sectionKey) => {
    const section = navigation.sections[sectionKey];
    const entries = [section, ...section.links.map((linkKey) => navigation.links[linkKey])];

    return entries.flatMap((entry) => {
      const product = entry.product ? products[entry.product] : null;
      const destinationKey = entry.destination ?? product?.destination;
      const destination = destinationKey ? destinations[destinationKey] : null;
      const url = destination?.url ?? product?.url ?? entry.url;
      const title = entry.label ?? product?.label ?? destination?.label;
      const external = destination?.external ?? product?.external ?? entry.external ?? false;

      if (!url || !title || seenUrls.has(url)) return [];
      seenUrls.add(url);

      return [{ title, url, external, sectionKey }];
    });
  });
}

function matchingDestinations(destinations, term, sectionKey) {
  const normalizedTerm = term.toLocaleLowerCase();

  return destinations
    .filter(
      (destination) =>
        (!sectionKey || destination.sectionKey === sectionKey) &&
        (!sectionKey || !destination.external) &&
        destination.title.toLocaleLowerCase().includes(normalizedTerm),
    )
    .slice(0, destinationLimit);
}

function resultLink({ url, title, excerpt, external = false }, index) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const heading = document.createElement("h3");

  link.href = url;
  link.dataset.searchResult = "";
  link.dataset.searchResultIndex = index;
  link.textContent = title;
  heading.append(link);
  item.append(heading);

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

function sectionFromSearchParams(searchParams, sectionKeys) {
  const section = searchParams.get("section");

  return sectionKeys.has(section) ? section : null;
}

export function initSiteSearch({ quake } = {}) {
  const surfaces = [...document.querySelectorAll("[data-site-search]")].map((root) => ({
    root,
    form: root.querySelector("[data-site-search-form]"),
    input: root.querySelector("input[name='q']"),
    status: root.querySelector("[data-site-search-status]"),
    results: root.querySelector("[data-site-search-results]"),
    fallback: root.querySelector("[data-site-search-fallback]"),
    menu: root.querySelector("[data-search-menu]"),
    staticMenu: root.querySelector("[data-search-menu-static]"),
    isSpotlight: root.closest("dialog") !== null,
    section: null,
    debounceTimer: null,
    requestIdentity: 0,
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

  surfaces.forEach(({ menu, staticMenu }) => {
    if (menu) menu.hidden = false;
    if (staticMenu) staticMenu.hidden = true;
  });

  const data = searchData();
  const destinations = navigationDestinations(data);
  const sectionLabels = new Map(
    (data?.navigation.section_order ?? []).map((sectionKey) => [
      sectionKey,
      data.navigation.sections[sectionKey].label,
    ]),
  );
  const sectionKeys = new Set(sectionLabels.keys());
  const pagefindUrl = surfaces.find(({ form }) => form)?.form.dataset.pagefindUrl;
  let pagefindPromise;
  let searchTrigger = searchTriggers[0] ?? null;
  let scrollLock = null;
  const surfaceResults = new Map();

  const lockDocumentScroll = () => {
    if (scrollLock) return;

    const root = document.documentElement;
    scrollLock = {
      rootOverflow: root.style.overflow,
      rootScrollbarGutter: root.style.scrollbarGutter,
      rootOverflowAnchor: root.style.overflowAnchor,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    };
    root.style.overflowAnchor = "none";
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
  };

  const unlockDocumentScroll = () => {
    if (!scrollLock) return;

    document.documentElement.style.overflow = scrollLock.rootOverflow;
    document.documentElement.style.scrollbarGutter = scrollLock.rootScrollbarGutter;
    document.documentElement.style.overflowAnchor = scrollLock.rootOverflowAnchor;
    window.scrollTo({
      left: scrollLock.scrollX,
      top: scrollLock.scrollY,
      behavior: "instant",
    });
    scrollLock = null;
  };

  const setSelection = (surface, index) => {
    const resultState = surfaceResults.get(surface);
    if (!resultState || resultState.links.length === 0) return;

    resultState.selectedIndex =
      (index + resultState.links.length) % resultState.links.length;
    resultState.links.forEach((link, linkIndex) => {
      link.classList.toggle("is-active", linkIndex === resultState.selectedIndex);
    });
  };

  const showMenu = (surface) => {
    if (!surface.menu) return;

    const menuRoot = surface.menu.querySelector("[data-search-menu-root]");
    menuRoot.hidden = surface.section !== null;
    menuRoot.inert = surface.section !== null;

    surface.menu.querySelectorAll("[data-search-menu-panel]").forEach((panel) => {
      const active = panel.dataset.searchMenuSection === surface.section;
      panel.hidden = !active;
      panel.inert = !active;
    });
    surface.menu.querySelectorAll("[data-search-menu-select]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.searchMenuSection === surface.section),
      );
    });
  };

  const updateSearchUrl = (surface, mode = "replace") => {
    if (surface.isSpotlight) return;

    const url = new URL(window.location.href);
    const query = surface.input.value.trim();

    if (surface.section) {
      url.searchParams.set("section", surface.section);
    } else {
      url.searchParams.delete("section");
    }
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }

    window.history[mode === "push" ? "pushState" : "replaceState"](null, "", url);
  };

  const render = (surface, { state, term = "", destinationResults = [], pageResults = [] }) => {
    const fragment = document.createDocumentFragment();
    const index = { next: 0 };
    const destinationGroup = resultGroup("Destinations", destinationResults, index);
    const pageGroup = resultGroup(
      surface.section ? sectionLabels.get(surface.section) : "Pages & News",
      pageResults,
      index,
    );

    if (destinationGroup) fragment.append(destinationGroup);
    if (pageGroup) fragment.append(pageGroup);
    surface.results.replaceChildren(fragment);
    surface.status.textContent =
      state === "loading"
        ? "Searching…"
        : state === "empty"
          ? surface.section
            ? `No results in ${sectionLabels.get(surface.section)} for “${term}”.`
            : `No results for “${term}”.`
          : state === "error"
            ? "Search is unavailable."
            : state === "results"
              ? `${destinationResults.length + pageResults.length} result${destinationResults.length + pageResults.length === 1 ? "" : "s"} for “${term}”.`
              : "";

    if (state === "idle") showMenu(surface);
    if (surface.fallback) surface.fallback.hidden = state !== "idle" && state !== "error";

    const links = [...surface.results.querySelectorAll("[data-search-result]")];
    const resultState = { links, selectedIndex: -1 };
    surfaceResults.set(surface, resultState);
    setSelection(surface, 0);
    links.forEach((link, index) => {
      link.addEventListener("pointermove", () => setSelection(surface, index));
      link.addEventListener("focus", () => setSelection(surface, index));
      link.addEventListener("click", () => {
        if (surface.isSpotlight && dialog.open) dialog.close();
      });
    });
  };

  const clearSearch = (surface) => {
    window.clearTimeout(surface.debounceTimer);
    surface.requestIdentity += 1;
    render(surface, { state: "idle" });
  };

  const selectSection = (surface, section, { history = "push" } = {}) => {
    surface.section = section;
    surface.input.value = "";
    clearSearch(surface);
    updateSearchUrl(surface, history);
    surface.input.focus({ preventScroll: true });
  };

  const clearSection = (surface, { history = "push", focusMenu = false } = {}) => {
    surface.section = null;
    surface.input.value = "";
    clearSearch(surface);
    updateSearchUrl(surface, history);

    if (focusMenu) surface.menu?.querySelector("[data-search-menu-select]")?.focus();
  };

  const runSearch = async (surface, term, identity) => {
    if (identity !== surface.requestIdentity) return;

    const destinationResults = matchingDestinations(destinations, term, surface.section);
    render(surface, { state: "loading" });

    try {
      pagefindPromise ??= import(pagefindUrl);
      const pagefind = await pagefindPromise;
      const response = await pagefind.search(
        term,
        surface.section ? { filters: { section: surface.section } } : undefined,
      );
      const documents = await Promise.all(
        response.results.slice(0, pagefindLimit).map((result) => result.data()),
      );

      if (identity !== surface.requestIdentity) return;

      const pageResults = documents.map(pagefindResult);
      render(surface, {
        state: destinationResults.length + pageResults.length === 0 ? "empty" : "results",
        term,
        destinationResults,
        pageResults,
      });
    } catch {
      if (identity !== surface.requestIdentity) return;
      render(surface, { state: "error", term, destinationResults });
    }
  };

  const scheduleSearch = (surface, value, { updateUrl = true } = {}) => {
    const term = value.trim();
    surface.input.value = value;
    if (updateUrl) updateSearchUrl(surface);

    if (term.length < minimumQueryLength) {
      clearSearch(surface);
      return;
    }

    window.clearTimeout(surface.debounceTimer);
    const identity = ++surface.requestIdentity;
    render(surface, {
      state: "loading",
      term,
      destinationResults: matchingDestinations(destinations, term, surface.section),
    });
    surface.debounceTimer = window.setTimeout(
      () => runSearch(surface, term, identity),
      debounceDuration,
    );
  };

  const moveMenuFocus = (surface, event) => {
    if (
      (event.key !== "ArrowDown" && event.key !== "ArrowUp") ||
      !surface.fallback ||
      surface.fallback.hidden
    ) {
      return false;
    }

    const activeElement = document.activeElement;
    const topLevelItems = [
      ...surface.fallback.querySelectorAll(
        "[data-search-menu-root] > li > a[href], [data-search-menu-root] > li > [data-search-menu-select]",
      ),
    ];
    const visiblePanel = surface.fallback.querySelector("[data-search-menu-panel]:not([hidden])");
    const panel = activeElement?.closest("[data-search-menu-panel]") ?? visiblePanel;
    const items =
      activeElement === surface.input
        ? [...(panel?.querySelectorAll("a[href]") ?? topLevelItems)]
        : topLevelItems.includes(activeElement)
          ? topLevelItems
          : [...(panel?.querySelectorAll("a[href]") ?? [])];
    if (items.length === 0) return false;

    const currentIndex = items.indexOf(activeElement);
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      currentIndex === -1
        ? direction === 1
          ? 0
          : items.length - 1
        : (currentIndex + direction + items.length) % items.length;
    items[nextIndex].focus();
    return true;
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

    const spotlightSurface = surfaces.find(({ isSpotlight }) => isSpotlight);
    clearSection(spotlightSurface, { history: "replace" });
    dialog.showModal();
    lockDocumentScroll();
    dialog.querySelector("input[name='q']")?.focus();
  };

  const restoreStandaloneSearch = (surface) => {
    const searchParams = new URLSearchParams(window.location.search);
    surface.section = sectionFromSearchParams(searchParams, sectionKeys);
    surface.input.value = searchParams.get("q") ?? "";

    if (surface.input.value.trim().length < minimumQueryLength) {
      clearSearch(surface);
    } else {
      scheduleSearch(surface, surface.input.value, { updateUrl: false });
    }
  };

  surfaces.forEach((surface) => {
    surface.input.addEventListener("input", () => scheduleSearch(surface, surface.input.value));
    surface.form.addEventListener("submit", (event) => {
      event.preventDefault();
      scheduleSearch(surface, surface.input.value);
    });
    surface.menu?.querySelectorAll("[data-search-menu-select]").forEach((button) => {
      button.addEventListener("click", () => {
        selectSection(surface, button.dataset.searchMenuSection);
      });
    });
    surface.menu?.querySelectorAll("[data-search-menu-clear]").forEach((button) => {
      button.addEventListener("click", () => clearSection(surface, { focusMenu: true }));
    });
    surface.fallback?.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowLeft" &&
        document.activeElement?.closest("[data-search-menu-panel]")
      ) {
        event.preventDefault();
        clearSection(surface, { focusMenu: true });
        return;
      }

      moveMenuFocus(surface, event);
    });
    surface.form.addEventListener("keydown", (event) => {
      if (moveMenuFocus(surface, event)) return;

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
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const focusable = [...dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => element.getClientRects().length > 0);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("close", () => {
    const spotlightSurface = surfaces.find(({ isSpotlight }) => isSpotlight);
    clearSection(spotlightSurface, { history: "replace" });
    unlockDocumentScroll();
    window.requestAnimationFrame(() => searchTrigger?.focus());
  });
  document.addEventListener("omarchy:quake-open", closeSpotlight);
  document.addEventListener("keydown", (event) => {
    if (isEditableTarget(event.target)) return;

    const isSearchShortcut =
      (!event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        event.key === "/") ||
      (event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        !event.metaKey &&
        event.key === " ");

    if (isSearchShortcut) {
      event.preventDefault();
      openSpotlight(searchTriggers[0]);
    }
  });
  window.addEventListener("popstate", () => {
    surfaces.filter(({ isSpotlight }) => !isSpotlight).forEach(restoreStandaloneSearch);
  });

  surfaces.filter(({ isSpotlight }) => isSpotlight).forEach((surface) => render(surface, { state: "idle" }));
  surfaces.filter(({ isSpotlight }) => !isSpotlight).forEach(restoreStandaloneSearch);

  return { close: closeSpotlight, open: openSpotlight };
}
