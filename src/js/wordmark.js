const EFFECT = "laseretch";
const ART_COLUMNS = 81;
const ART_ROWS = 10;
const CELL_ASPECT = 2;
const FONT_WAIT_MS = 1000;

let wasmBytesPromise;

function localUrl(value) {
  if (!value) throw new Error("Missing local WTE URL");

  const url = new URL(value, document.baseURI);
  if (url.origin !== window.location.origin) {
    throw new Error("WTE URL must be same-origin");
  }

  return url.href;
}

function artFromPre(pre) {
  let text = pre.textContent ?? "";
  if (text.startsWith("\n")) text = text.slice(1);
  return text.replace(/\n+$/, "");
}

function afterFonts() {
  if (document.fonts?.ready == null) return Promise.resolve();

  let timer;
  const timeout = new Promise((resolve) => {
    timer = window.setTimeout(resolve, FONT_WAIT_MS);
  });

  return Promise.race([document.fonts.ready, timeout]).finally(() => {
    window.clearTimeout(timer);
  });
}

function nativeGrid(pre) {
  const box = pre.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return null;

  const cellWidth = Math.max(
    1,
    Math.floor(
      Math.min(box.width / ART_COLUMNS, box.height / (ART_ROWS * CELL_ASPECT)),
    ),
  );

  return {
    width: cellWidth * ART_COLUMNS,
    height: cellWidth * ART_ROWS * CELL_ASPECT,
  };
}

function scaleCanvas(canvas, pre, nativeWidth, nativeHeight) {
  const box = pre.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return false;

  canvas.style.transform = `scale(${box.width / nativeWidth}, ${box.height / nativeHeight})`;
  return true;
}

function watchSize(pre, onChange) {
  if (!("ResizeObserver" in window)) {
    throw new Error("ResizeObserver is unavailable");
  }

  let frame = 0;
  const schedule = () => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      onChange();
    });
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(pre);

  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    observer.disconnect();
  };
}

async function loadWasm(url) {
  wasmBytesPromise ??= fetch(url).then(async (response) => {
    if (!response.ok) throw new Error(`laseretch wasm ${response.status}`);
    return response.arrayBuffer();
  });

  return wasmBytesPromise;
}

async function loadCanvasPlayback(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`wte-canvas ${response.status}`);

  const source = await response.text();
  const spec = source.match(/from["'](\.\/assets\/playback-[A-Za-z0-9_-]+\.js)["']/);
  if (spec == null) throw new Error("WTE playback module not found");

  const module = await import(new URL(spec[1], response.url).href);
  for (const value of Object.values(module)) {
    if (
      typeof value === "function" &&
      value.prototype != null &&
      typeof value.prototype.restart === "function" &&
      typeof value.prototype.stop === "function"
    ) {
      return value;
    }
  }

  throw new Error("CanvasPlayback not found");
}

function isWasmError(error) {
  return /memory access out of bounds|RuntimeError|CompileError|WebAssembly/i.test(
    String(error?.message ?? error ?? ""),
  );
}

export function initWordmark() {
  const root = document.querySelector("[data-wordmark]");
  if (!root) return;

  const canvas = root.querySelector("[data-wordmark-canvas]");
  const fallback = root.querySelector("[data-wordmark-fallback]");
  let stopWatching = null;
  let playback = null;
  let cleanedUp = false;

  const onError = (event) => {
    if (!isWasmError(event.error ?? event.message)) return;
    event.preventDefault?.();
    fail();
  };
  const onUnhandledRejection = (event) => {
    if (!isWasmError(event.reason)) return;
    event.preventDefault();
    fail();
  };

  const fail = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
    stopWatching?.();
    stopWatching = null;

    try {
      playback?.stop();
    } catch {
      // The static fallback must survive a failed playback cleanup.
    }

    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = 0;
      canvas.height = 0;
    }
    root.dataset.wordmarkEnhanced = "false";
  };

  if (!(canvas instanceof HTMLCanvasElement) || !(fallback instanceof HTMLPreElement)) {
    fail();
    return;
  }

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const printMedia = window.matchMedia?.("print");
  if (reducedMotion?.matches || printMedia?.matches) {
    fail();
    return;
  }

  const input = artFromPre(fallback);
  if (input.trim() === "") {
    fail();
    return;
  }

  try {
    if (!canvas.getContext("2d")) throw new Error("Canvas 2D context is unavailable");
  } catch {
    fail();
    return;
  }

  let runtimeUrl;
  let wasmUrl;
  try {
    runtimeUrl = localUrl(root.dataset.wteCanvasUrl);
    wasmUrl = localUrl(root.dataset.wteWasmUrl);
  } catch {
    fail();
    return;
  }

  void (async () => {
    try {
      await afterFonts();
      if (reducedMotion?.matches || printMedia?.matches) throw new Error("Motion is unavailable");

      const [wasmBytes, CanvasPlayback] = await Promise.all([
        loadWasm(wasmUrl),
        loadCanvasPlayback(runtimeUrl),
      ]);
      const native = nativeGrid(fallback);
      if (native == null || !scaleCanvas(canvas, fallback, native.width, native.height)) {
        throw new Error("Wordmark dimensions are unavailable");
      }

      canvas.style.width = `${native.width}px`;
      canvas.style.height = `${native.height}px`;
      playback = new CanvasPlayback({
        canvas,
        width: () => native.width,
        height: () => native.height,
        connected: () => canvas.isConnected,
        input: () => input,
        effect: () => EFFECT,
        wasmUrl: () => wasmBytes,
        onFinished() {},
        frameRate: () => 240,
      });
      stopWatching = watchSize(fallback, () => {
        scaleCanvas(canvas, fallback, native.width, native.height);
      });

      window.addEventListener("error", onError);
      window.addEventListener("unhandledrejection", onUnhandledRejection);
      const restarting = playback.restart();
      if (restarting == null || typeof restarting.then !== "function") {
        throw new Error("Canvas playback did not start");
      }

      await restarting;
      if (cleanedUp) return;
      root.dataset.wordmarkEnhanced = "true";
    } catch {
      fail();
    }
  })();
}
