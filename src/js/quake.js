import { isEditableTarget } from "./editable-target.js";

const desktopNavigation = window.matchMedia("(min-width: 48rem)");
const panelTransitionDuration = 150;

export function initQuake({ header } = {}) {
  const toggle = document.querySelector("[data-quake-toggle]");
  const panel = document.querySelector("[data-quake-fallback]");

  if (!toggle || !panel) return null;

  let isOpen = false;
  let revealFrame = null;
  let hideTimeout = null;

  const clearPendingTransition = () => {
    if (revealFrame !== null) {
      cancelAnimationFrame(revealFrame);
      revealFrame = null;
    }

    if (hideTimeout !== null) {
      window.clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  };

  const focusFirstLink = () => {
    panel.querySelector(".quake-navigation__section-link")?.focus();
  };

  const close = ({ restoreFocus = false, immediate = false } = {}) => {
    if (!isOpen) return;

    isOpen = false;
    clearPendingTransition();
    toggle.setAttribute("aria-expanded", "false");
    header?.setOpaqueOverride(false);

    if (immediate) {
      panel.open = false;
      panel.hidden = true;
      delete panel.dataset.quakeState;
    } else {
      panel.dataset.quakeState = "closing";
      hideTimeout = window.setTimeout(() => {
        hideTimeout = null;
        if (isOpen) return;
        panel.open = false;
        panel.hidden = true;
        delete panel.dataset.quakeState;
      }, panelTransitionDuration);
    }

    if (restoreFocus) toggle.focus();
  };

  const open = () => {
    if (!desktopNavigation.matches) return;

    if (isOpen) {
      focusFirstLink();
      return;
    }

    document.dispatchEvent(new CustomEvent("omarchy:quake-open"));
    isOpen = true;
    clearPendingTransition();
    panel.hidden = false;
    panel.open = true;
    panel.dataset.quakeState = "opening";
    toggle.setAttribute("aria-expanded", "true");
    header?.setOpaqueOverride(true);

    revealFrame = requestAnimationFrame(() => {
      revealFrame = null;
      if (!isOpen) return;
      panel.dataset.quakeState = "open";
    });
    focusFirstLink();
  };

  const togglePanel = () => {
    if (isOpen) {
      close({ restoreFocus: true });
    } else {
      open();
    }
  };

  const setNavigationTreatment = () => {
    clearPendingTransition();

    if (desktopNavigation.matches) {
      panel.dataset.quakeEnhanced = "";
      panel.hidden = true;
      panel.open = false;
      toggle.hidden = false;
      toggle.setAttribute("aria-controls", panel.id);
      toggle.setAttribute("aria-expanded", "false");
      return;
    }

    close();
    delete panel.dataset.quakeEnhanced;
    panel.hidden = true;
  };

  toggle.addEventListener("click", () => {
    if (desktopNavigation.matches) togglePanel();
  });

  toggle.addEventListener("keydown", (event) => {
    if (
      desktopNavigation.matches &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      togglePanel();
    }
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) close();
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      isOpen &&
      !panel.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      close();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (isEditableTarget(event.target)) return;

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      close({ restoreFocus: true });
      return;
    }

    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey &&
      !event.metaKey &&
      event.code === "Backquote"
    ) {
      event.preventDefault();
      togglePanel();
    }
  });

  desktopNavigation.addEventListener("change", setNavigationTreatment);
  setNavigationTreatment();

  return { close, open };
}
