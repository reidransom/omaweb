import { scroll } from "motion";

const ENHANCED_HERO_QUERY = "(min-width: 40rem) and (prefers-reduced-motion: no-preference)";
const SCROLL_OFFSETS = ["start 100px", "end end"];
const STYLE_PROPERTIES = ["inline-size", "opacity", "pointer-events", "transform", "visibility"];
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

let disposeActiveHero;

const clamp = (value) => Math.min(1, Math.max(0, value));
const interpolate = (from, to, progress) => from + ((to - from) * progress);

export function initHomeHero() {
  disposeActiveHero?.();

  const root = document.querySelector("[data-home-hero]");
  const stage = root?.querySelector("[data-home-hero-stage]");
  const primary = root?.querySelector("[data-home-hero-primary]");
  const mediaComposition = root?.querySelector("[data-home-hero-media]");
  const columns = [1, 2, 3].map((column) =>
    root?.querySelector(`[data-home-hero-column="${column}"]`),
  );
  const posterLinks = [...(root?.querySelectorAll("[data-home-hero-poster]") ?? [])];
  const viewAll = root?.querySelector("[data-home-hero-view-all]");

  if (
    !root ||
    !stage ||
    !primary ||
    !mediaComposition ||
    columns.some((column) => !column) ||
    posterLinks.length !== 5 ||
    !viewAll
  ) {
    return;
  }

  const [firstColumn, secondColumn, thirdColumn] = columns;
  const media = window.matchMedia(ENHANCED_HERO_QUERY);
  const regions = [
    { element: primary, controls: [...primary.querySelectorAll(FOCUSABLE_SELECTOR)] },
    {
      element: firstColumn,
      controls: posterLinks.filter((link) => firstColumn.contains(link)),
    },
    {
      element: secondColumn,
      controls: posterLinks.filter((link) => secondColumn.contains(link)),
    },
    {
      element: thirdColumn,
      controls: posterLinks.filter((link) => thirdColumn.contains(link)),
    },
    { element: viewAll, controls: [viewAll] },
  ];
  const originalInert = new Map(
    regions.map(({ element }) => [element, element.hasAttribute("inert")]),
  );
  const originalTabIndexes = new Map(
    regions.flatMap(({ controls }) =>
      controls.map((control) => [control, control.getAttribute("tabindex")]),
    ),
  );
  let disposeEnhancement = () => {};

  const setPanelsAnimating = (active) => {
    document.body.toggleAttribute("data-home-hero-panels-animating", active);
  };

  const setRegionState = ({ element, controls }, visible) => {
    element.toggleAttribute("inert", !visible);
    element.style.visibility = visible ? "visible" : "hidden";
    element.style.pointerEvents = visible ? "auto" : "none";

    controls.forEach((control) => {
      if (!visible) {
        control.setAttribute("tabindex", "-1");
        return;
      }

      const originalTabIndex = originalTabIndexes.get(control);
      if (originalTabIndex === null) {
        control.removeAttribute("tabindex");
      } else {
        control.setAttribute("tabindex", originalTabIndex);
      }
    });
  };

  const syncInteraction = (visibility) => {
    const activeElement = document.activeElement;
    const hiddenFocusedRegion = regions.find(
      (region, index) => !visibility[index] && region.element.contains(activeElement),
    );

    regions.forEach((region, index) => {
      if (visibility[index]) setRegionState(region, true);
    });

    if (hiddenFocusedRegion) {
      const focusTarget = regions
        .filter((region, index) => visibility[index])
        .flatMap(({ controls }) => controls)
        .find((control) => !control.hasAttribute("disabled"));
      focusTarget?.focus({ preventScroll: true });
    }

    regions.forEach((region, index) => {
      if (!visibility[index]) setRegionState(region, false);
    });
  };

  const clearEnhancementState = () => {
    setPanelsAnimating(false);
    root.removeAttribute("data-home-hero-enhanced");

    [primary, ...columns, viewAll].forEach((element) => {
      STYLE_PROPERTIES.forEach((property) => element.style.removeProperty(property));
    });

    regions.forEach(({ element, controls }) => {
      element.toggleAttribute("inert", originalInert.get(element));
      controls.forEach((control) => {
        const originalTabIndex = originalTabIndexes.get(control);
        if (originalTabIndex === null) {
          control.removeAttribute("tabindex");
        } else {
          control.setAttribute("tabindex", originalTabIndex);
        }
      });
    });
  };

  const startEnhancement = () => {
    let stopScroll = () => {};
    let resizeObserver;
    let geometry;
    let progress = 0;

    const measure = () => {
      geometry = undefined;
      const width = mediaComposition.getBoundingClientRect().width;
      const gap = Number.parseFloat(getComputedStyle(mediaComposition).columnGap);

      if (width <= 0 || !Number.isFinite(gap)) return;

      const halfWidth = (width - gap) / 2;
      const thirdWidth = (width - (2 * gap)) / 3;
      if (halfWidth <= 0 || thirdWidth <= 0) return;

      geometry = { width, gap, halfWidth, thirdWidth };
    };

    const render = (nextProgress) => {
      if (!geometry) return;

      progress = clamp(nextProgress);
      const firstInterval = clamp(progress / 0.25);
      const secondInterval = clamp((progress - 0.25) / 0.25);
      const thirdInterval = clamp((progress - 0.5) / 0.25);
      const { width, gap, halfWidth, thirdWidth } = geometry;

      const firstColumnWidth =
        progress < 0.5
          ? interpolate(width, halfWidth, secondInterval)
          : interpolate(halfWidth, thirdWidth, thirdInterval);
      const secondColumnWidth = interpolate(halfWidth, thirdWidth, thirdInterval);
      const secondColumnStart =
        progress < 0.25
          ? -(halfWidth + gap)
          : progress < 0.5
            ? interpolate(-(halfWidth + gap), firstColumnWidth + gap, secondInterval)
            : firstColumnWidth + gap;
      const thirdColumnStart = 2 * (firstColumnWidth + gap);

      primary.style.inlineSize = `${width}px`;
      primary.style.opacity = `${1 - firstInterval}`;
      primary.style.transform = `translate3d(${-((width + gap) * firstInterval)}px, 0, 0)`;

      firstColumn.style.inlineSize = `${firstColumnWidth}px`;
      firstColumn.style.transform = `translate3d(${(width + gap) * (1 - firstInterval)}px, 0, 0)`;

      secondColumn.style.inlineSize = `${secondColumnWidth}px`;
      secondColumn.style.transform = `translate3d(${secondColumnStart}px, 0, 0)`;

      thirdColumn.style.inlineSize = `${thirdWidth}px`;
      thirdColumn.style.transform = `translate3d(${thirdColumnStart}px, 0, 0)`;

      viewAll.style.inlineSize = `${firstColumnWidth}px`;
      viewAll.style.opacity = thirdInterval === 1 ? "1" : "0";

      syncInteraction([
        firstInterval < 1,
        firstInterval > 0,
        secondInterval > 0,
        thirdInterval > 0,
        thirdInterval === 1,
      ]);
      setPanelsAnimating(progress < 1);
    };

    const cleanup = () => {
      stopScroll();
      resizeObserver?.disconnect();
      clearEnhancementState();
    };

    disposeEnhancement = cleanup;
    root.setAttribute("data-home-hero-enhanced", "");
    measure();

    if (!geometry) {
      cleanup();
      return;
    }

    render(0);
    resizeObserver = new ResizeObserver(() => {
      measure();
      if (!geometry) {
        cleanup();
        return;
      }
      render(progress);
    });
    resizeObserver.observe(mediaComposition);
    stopScroll = scroll(render, {
      target: root,
      offset: SCROLL_OFFSETS,
    });
  };

  const setup = () => {
    disposeEnhancement();
    disposeEnhancement = () => {};
    if (!media.matches) return;

    try {
      startEnhancement();
    } catch {
      disposeEnhancement();
      disposeEnhancement = () => {};
    }
  };

  const dispose = () => {
    media.removeEventListener("change", setup);
    disposeEnhancement();
    disposeEnhancement = () => {};
    if (disposeActiveHero === dispose) disposeActiveHero = undefined;
  };

  disposeActiveHero = dispose;
  media.addEventListener("change", setup);
  setup();

  return dispose;
}
