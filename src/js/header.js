export function initHeader() {
  const header = document.querySelector(".site-header");
  const sentinel = document.querySelector("[data-header-sentinel]");

  if (!header) return;

  const updateHeaderState = () => {
    header.dataset.headerState =
      sentinel?.getBoundingClientRect().top > 0 ? "transparent" : "opaque";
  };

  if (!sentinel) {
    updateHeaderState();
    return;
  }

  let scheduledFrame = null;
  const scheduleHeaderStateUpdate = () => {
    if (scheduledFrame !== null) return;

    scheduledFrame = requestAnimationFrame(() => {
      scheduledFrame = null;
      updateHeaderState();
    });
  };

  updateHeaderState();
  window.addEventListener("scroll", scheduleHeaderStateUpdate, { passive: true });
  window.addEventListener("resize", scheduleHeaderStateUpdate, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(scheduleHeaderStateUpdate).observe(sentinel);
  }
}
