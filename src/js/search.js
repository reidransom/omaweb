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

function navigationDestinations() {
  const navigationData = document.querySelector("[data-search-navigation]");
  const destinationData = document.querySelector("[data-search-destinations]");
  const productData = document.querySelector("[data-search-products]");

  if (!navigationData || !destinationData || !productData) return [];

  try {
    const navigation = JSON.parse(navigationData.textContent);
    const destinations = JSON.parse(destinationData.textContent).items;
    const products = JSON.parse(productData.textContent).items;
    const seenUrls = new Set();

    return navigation.section_order.flatMap((sectionKey) => {
      const section = navigation.sections[sectionKey];
      const entries = [
        section,
        ...section.links.map((linkKey) => navigation.links[linkKey]),
      ];

      return entries.flatMap((entry) => {
        const product = entry.product ? products[entry.product] : null;
        const destinationKey = entry.destination ?? product?.destination;
        const destination = destinationKey ? destinations[destinationKey] : null;
        const url = destination?.url ?? product?.url ?? entry.url;
        const label = entry.label ?? product?.label ?? destination?.label;
        const external =
          destination?.external ?? product?.external ?? entry.external ?? false;

        if (!url || !label || seenUrls.has(url)) return [];
        seenUrls.add(url);

        return [{ title: label, url, external, section: section.label }];
      });
    });
  } catch {
    return [];
  }
}

function matchingDestinations(destinations, term) {
  const normalizedTerm = term.toLocaleLowerCase();

  return destinations
    .filter(({ title }) => title.toLocaleLowerCase().includes(normalizedTerm))
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
    menu: root.querySelector("[data-search-menu]"),
    staticMenu: root.querySelector("[data-search-menu-static]"),
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

  surfaces.forEach(({ menu, staticMenu }) => {
    if (menu) menu.hidden = false;
    if (staticMenu) staticMenu.hidden = true;
  });

  const destinations = navigationDestinations();
  const pagefindUrl = surfaces.find(({ form }) => form)?.form.dataset.pagefindUrl;
  let pagefindPromise;
  let requestIdentity = 0;
  let debounceTimer;
  const surfaceResults = new Map();
  let searchTrigger = searchTriggers[0] ?? null;
  let scrollLock = null;

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

  const afterMenuAnimation = (element, callback) => {
    const animations = element.getAnimations();

    if (animations.length === 0) {
      callback();
      return;
    }

    Promise.allSettled(animations.map((animation) => animation.finished)).then(callback);
  };

  const resetMenu = (surface, { animate = false, restoreFocus = false } = {}) => {
    if (!surface?.menu) return;

    const menuRoot = surface.menu.querySelector("[data-search-menu-root]");
    const activePanel = surface.menu.querySelector("[data-search-menu-panel]:not([hidden])");
    const activeSectionId = activePanel?.dataset.searchMenuSection;
    const activeOpener = [...surface.menu.querySelectorAll("[data-search-menu-open]")].find(
      (opener) => opener.dataset.searchMenuSection === activeSectionId,
    );

    surface.menu.querySelectorAll("[data-search-menu-open]").forEach((opener) => {
      opener.setAttribute("aria-expanded", "false");
    });
    menuRoot.hidden = false;
    menuRoot.inert = false;

    if (animate && activePanel) {
      activePanel.inert = true;
      surface.menu.dataset.searchMenuDirection = "back";
      if (restoreFocus) activeOpener?.focus();

      afterMenuAnimation(activePanel, () => {
        if (surface.menu.dataset.searchMenuDirection !== "back") return;

        activePanel.hidden = true;
        delete surface.menu.dataset.searchMenuDirection;
        delete surface.menu.dataset.searchMenuSection;
      });
      return;
    }

    delete surface.menu.dataset.searchMenuDirection;
    delete surface.menu.dataset.searchMenuSection;
    surface.menu.querySelectorAll("[data-search-menu-panel]").forEach((panel) => {
      panel.hidden = true;
      panel.inert = true;
    });
    if (restoreFocus) activeOpener?.focus();
  };

  const openMenuPanel = (surface, opener) => {
    if (!surface.menu) return;

    const menuRoot = surface.menu.querySelector("[data-search-menu-root]");
    const sectionId = opener.dataset.searchMenuSection;
    const panel = [...surface.menu.querySelectorAll("[data-search-menu-panel]")].find(
      (candidate) => candidate.dataset.searchMenuSection === sectionId,
    );
    if (!panel) return;

    menuRoot.hidden = false;
    menuRoot.inert = true;
    surface.menu.dataset.searchMenuSection = sectionId;
    surface.menu.dataset.searchMenuDirection = "forward";
    surface.menu.querySelectorAll("[data-search-menu-panel]").forEach((candidate) => {
      candidate.hidden = candidate !== panel;
      candidate.inert = candidate !== panel;
    });
    surface.menu.querySelectorAll("[data-search-menu-open]").forEach((candidate) => {
      candidate.setAttribute("aria-expanded", candidate === opener ? "true" : "false");
    });

    afterMenuAnimation(panel, () => {
      if (
        surface.menu.dataset.searchMenuDirection === "forward" &&
        surface.menu.dataset.searchMenuSection === sectionId
      ) {
        menuRoot.hidden = true;
      }
    });
    panel.querySelector("a[href]")?.focus({ preventScroll: true });
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
        "[data-search-menu-root] > li > a[href], [data-search-menu-root] > li > [data-search-menu-open]",
      ),
    ];
    const panel = activeElement?.closest("[data-search-menu-panel]");
    const items =
      activeElement === surface.input || topLevelItems.includes(activeElement)
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

      if (state === "idle" || state === "loading") resetMenu(surface);

      if (surface.fallback) {
        surface.fallback.hidden = state !== "idle" && state !== "error";
      }
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

    const spotlightSurface = surfaces.find(({ isSpotlight }) => isSpotlight);
    resetMenu(spotlightSurface);

    dialog.showModal();
    lockDocumentScroll();
    dialog.querySelector("input[name='q']")?.focus();
  };

  surfaces.forEach((surface) => {
    surface.input.addEventListener("input", () => scheduleSearch(surface.input.value));
    surface.form.addEventListener("submit", (event) => {
      event.preventDefault();
      scheduleSearch(surface.input.value);
    });
    surface.menu?.querySelectorAll("[data-search-menu-open]").forEach((opener) => {
      opener.addEventListener("click", () => openMenuPanel(surface, opener));
    });
    surface.menu?.querySelectorAll("[data-search-menu-back]").forEach((back) => {
      back.addEventListener("click", () => {
        resetMenu(surface, { animate: true, restoreFocus: true });
      });
    });
    surface.fallback?.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowLeft" &&
        document.activeElement?.closest("[data-search-menu-panel]")
      ) {
        event.preventDefault();
        resetMenu(surface, { animate: true, restoreFocus: true });
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

  render({ state: "idle" });

  const initialQuery = new URLSearchParams(window.location.search).get("q");
  if (initialQuery) scheduleSearch(initialQuery);

  return { close: closeSpotlight, open: openSpotlight };
}
