export function initHeader() {
  const header = document.querySelector(".site-header");
  const sentinel = document.querySelector("[data-header-sentinel]");

  if (!header || !sentinel || !("IntersectionObserver" in window)) return;

  new IntersectionObserver(([entry]) => {
    header.dataset.headerState = entry.boundingClientRect.top > 0 ? "transparent" : "opaque";
  }).observe(sentinel);
}
