export function initHeader() {
  const header = document.querySelector(".site-header");
  const sentinel = document.querySelector("[data-header-sentinel]");

  if (!header) return null;

  let forceOpaque = false;
  const updateHeaderState = () => {
    header.dataset.headerState =
      forceOpaque || sentinel?.getBoundingClientRect().top <= 0
        ? "opaque"
        : "transparent";
  };

  const setOpaqueOverride = (active) => {
    forceOpaque = active;
    updateHeaderState();
  };

  if (!sentinel) {
    updateHeaderState();
    return { setOpaqueOverride };
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

  return { setOpaqueOverride };
}
