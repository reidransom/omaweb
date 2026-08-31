const COLORS = ["#7dcfff", "#7aa2f7", "#bb9af7"];

export function initWordmark() {
  const root = document.querySelector("[data-wordmark]");
  const canvas = root?.querySelector("[data-wordmark-canvas]");
  const fallback = root?.querySelector("[data-wordmark-fallback]");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const printMedia = window.matchMedia?.("print");

  if (!root || !canvas || !fallback) return;

  if (
    reducedMotion?.matches ||
    printMedia?.matches ||
    !("IntersectionObserver" in window)
  ) {
    root.dataset.wordmarkEnhanced = "false";
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    root.dataset.wordmarkEnhanced = "false";
    return;
  }

  const rows = fallback.textContent.split("\n");
  let intersecting = false;
  let frame = 0;
  let hasDrawn = false;
  let printing = false;

  const stop = () => {
    if (!frame) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const draw = (time) => {
    const bounds = root.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(bounds.width * dpr);
    const height = Math.round(bounds.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, bounds.width, bounds.height);

    const style = window.getComputedStyle(fallback);
    context.font = style.font;
    context.textBaseline = "top";
    const cellWidth = context.measureText(" ").width;
    const lineHeight = Number.parseFloat(style.lineHeight);
    if (!cellWidth || !lineHeight) return false;

    rows.forEach((row, rowIndex) => {
      for (let column = 0; column < row.length; column += 1) {
        const glyph = row[column];
        if (glyph === " ") continue;
        context.fillStyle = COLORS[(rowIndex * 3 + column + Math.floor(time / 180)) % COLORS.length];
        context.fillText(glyph, column * cellWidth, rowIndex * lineHeight);
      }
    });

    if (!hasDrawn) {
      hasDrawn = true;
      root.dataset.wordmarkEnhanced = "true";
    }
    return true;
  };

  const animate = (time) => {
    frame = 0;
    if (reducedMotion?.matches || printing || !intersecting || document.hidden) return;
    try {
      if (draw(time)) frame = window.requestAnimationFrame(animate);
    } catch {
      restoreStaticFallback();
    }
  };

  const start = () => {
    if (reducedMotion?.matches || printing || !intersecting || document.hidden || frame) return;
    frame = window.requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver(([entry]) => {
    intersecting = entry.isIntersecting;
    if (intersecting) start();
    else stop();
  });
  observer.observe(root);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  const restoreStaticFallback = () => {
    stop();
    context.clearRect(0, 0, canvas.width, canvas.height);
    root.dataset.wordmarkEnhanced = "false";
    hasDrawn = false;
  };

  reducedMotion?.addEventListener("change", () => {
    if (reducedMotion.matches) restoreStaticFallback();
    else start();
  });

  window.addEventListener("beforeprint", () => {
    printing = true;
    stop();
  });
  window.addEventListener("afterprint", () => {
    printing = false;
    start();
  });

  const resize = () => {
    if (!intersecting || document.hidden) return;
    stop();
    start();
  };
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(root);
  else window.addEventListener("resize", resize, { passive: true });
}
