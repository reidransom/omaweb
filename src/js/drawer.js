function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;

  if (target.closest("input, textarea, select")) return true;

  const editable = target.closest("[contenteditable]");
  return editable?.getAttribute("contenteditable") !== "false";
}

export function initDrawer() {
  const opener = document.querySelector("[data-drawer-open]");
  const drawer = document.querySelector("[data-drawer]");
  const close = drawer?.querySelector("[data-drawer-close]");
  const fallback = document.querySelector("[data-drawer-fallback]");
  const mobileNavigation = window.matchMedia("(max-width: 47.999rem)");

  if (
    !opener ||
    !drawer ||
    !close ||
    !("HTMLDialogElement" in window) ||
    typeof drawer.showModal !== "function" ||
    typeof drawer.close !== "function"
  ) return null;

  const returnFocus = () => {
    opener.setAttribute("aria-expanded", "false");
    if (mobileNavigation.matches) opener.focus();
  };

  const openDrawer = () => {
    if (!mobileNavigation.matches || drawer.open) return;

    drawer.showModal();
    opener.setAttribute("aria-expanded", "true");
    close.focus();
  };

  const closeDrawer = () => {
    if (drawer.open) drawer.close();
  };

  const setNavigationTreatment = () => {
    if (mobileNavigation.matches) {
      opener.hidden = false;
      opener.setAttribute("aria-controls", drawer.id);
      opener.setAttribute("aria-expanded", drawer.open ? "true" : "false");
      if (fallback) fallback.hidden = true;
      return;
    }

    closeDrawer();
  };

  opener.addEventListener("click", openDrawer);
  close.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) closeDrawer();
  });
  drawer.addEventListener("close", returnFocus);
  document.addEventListener("keydown", (event) => {
    if (
      !mobileNavigation.matches ||
      isEditableTarget(event.target) ||
      !event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      event.code !== "Backquote"
    ) {
      return;
    }

    event.preventDefault();
    if (drawer.open) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  mobileNavigation.addEventListener("change", setNavigationTreatment);
  setNavigationTreatment();

  return { close: closeDrawer, open: openDrawer };
}
