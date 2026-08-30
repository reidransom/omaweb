export function initDrawer() {
  const opener = document.querySelector("[data-drawer-open]");
  const drawer = document.querySelector("[data-drawer]");
  const close = drawer?.querySelector("[data-drawer-close]");
  const fallback = document.querySelector("[data-drawer-fallback]");

  if (
    !opener ||
    !drawer ||
    !close ||
    !("HTMLDialogElement" in window) ||
    typeof drawer.showModal !== "function" ||
    typeof drawer.close !== "function"
  ) return;

  const returnFocus = () => {
    opener.setAttribute("aria-expanded", "false");
    opener.focus();
  };
  opener.hidden = false;
  opener.setAttribute("aria-expanded", "false");
  if (fallback) fallback.hidden = true;

  opener.addEventListener("click", () => {
    if (drawer.open) return;
    drawer.showModal();
    opener.setAttribute("aria-expanded", "true");
    close.focus();
  });
  close.addEventListener("click", () => drawer.close());
  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) drawer.close();
  });
  drawer.addEventListener("close", returnFocus);
}
