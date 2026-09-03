import { createServer } from "node:http";
import { access, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { delimiter, extname, resolve, sep } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"], [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"], [".wasm", "application/wasm"], [".xml", "application/xml"],
  [".png", "image/png"], [".webp", "image/webp"], [".woff", "font/woff"], [".woff2", "font/woff2"],
]);

export class BrowserError extends Error {}

function fail(message) { throw new BrowserError(message); }

async function serve(root, request, response) {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) return response.writeHead(403).end();
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": MIME_TYPES.get(extname(file)) ?? "application/octet-stream" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404).end();
  }
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(server.address().port);
    });
  });
}

async function findCommand(names) {
  for (const directory of (process.env.PATH ?? "").split(delimiter)) {
    for (const name of names) {
      const candidate = resolve(directory, name);
      try { await access(candidate, constants.X_OK); return candidate; } catch {}
    }
  }
  return null;
}

async function json(url, options) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(2_000) });
  if (!response.ok) fail(`Chromium DevTools request failed: ${response.status} ${response.statusText}.`);
  return response.json();
}

class DevToolsSocket {
  #socket;
  #nextId = 0;
  #pending = new Map();
  #events = [];
  #waiters = [];

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new BrowserError("Chromium DevTools WebSocket handshake timed out.")), 10_000);
      socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener("error", () => { clearTimeout(timer); reject(new BrowserError("Chromium DevTools WebSocket handshake failed.")); }, { once: true });
    });
    return new DevToolsSocket(socket);
  }

  constructor(socket) {
    this.#socket = socket;
    socket.addEventListener("message", event => this.#receive(JSON.parse(event.data)));
    socket.addEventListener("close", () => this.#closePending());
    socket.addEventListener("error", () => this.#closePending());
  }

  #closePending() {
    for (const { reject, timer } of this.#pending.values()) {
      clearTimeout(timer);
      reject(new BrowserError("Chromium closed the DevTools connection before responding."));
    }
    this.#pending.clear();
    for (const { reject, timer } of this.#waiters.splice(0)) {
      clearTimeout(timer);
      reject(new BrowserError("Chromium closed the DevTools connection before emitting an event."));
    }
  }

  #receive(message) {
    if ("id" in message) {
      const pending = this.#pending.get(message.id);
      if (!pending) return;
      this.#pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) pending.reject(new BrowserError(`Chromium command ${pending.method} failed: ${message.error.message ?? JSON.stringify(message.error)}`));
      else pending.resolve(message.result ?? {});
      return;
    }
    if (!message.method) return;
    const index = this.#waiters.findIndex(waiter => waiter.method === message.method);
    if (index >= 0) {
      const [{ resolve, timer }] = this.#waiters.splice(index, 1);
      clearTimeout(timer);
      resolve(message.params ?? {});
    } else this.#events.push(message);
  }

  command(method, params) {
    const id = ++this.#nextId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id);
        reject(new BrowserError(`Timed out waiting for Chromium command ${method}.`));
      }, 15_000);
      this.#pending.set(id, { method, resolve, reject, timer });
      this.#socket.send(JSON.stringify(params ? { id, method, params } : { id, method }));
    });
  }

  waitForEvent(method, timeout = 15_000) {
    const index = this.#events.findIndex(event => event.method === method);
    if (index >= 0) return Promise.resolve(this.#events.splice(index, 1)[0].params ?? {});
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const index = this.#waiters.findIndex(waiter => waiter.resolve === resolve);
        if (index >= 0) this.#waiters.splice(index, 1);
        reject(new BrowserError(`Timed out waiting for Chromium event ${method}.`));
      }, timeout);
      this.#waiters.push({ method, resolve, reject, timer });
    });
  }

  close() { this.#socket.close(); }
}

export async function evaluate(browser, expression) {
  const result = await browser.command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) fail(`Browser evaluation failed: ${result.exceptionDetails.text ?? "unknown exception"}`);
  return result.result?.value;
}

export async function waitForComplete(browser, route, label = route) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (JSON.stringify(await evaluate(browser, "[document.readyState, location.pathname]")) === JSON.stringify(["complete", route])) {
      await sleep(150);
      return;
    }
    await sleep(50);
  }
  fail(`Timed out rendering ${label} in Chromium.`);
}

export function setViewport(browser, width, height) {
  return browser.command("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
}

export class ChromiumSession {
  constructor(documentRoot) { this.documentRoot = documentRoot; }

  async open() {
    try { await stat(this.documentRoot); } catch { fail(`Missing site directory: ${this.documentRoot}`); }
    const chromium = await findCommand(["chromium", "chromium-browser", "google-chrome"]);
    if (!chromium) fail("Missing Chromium; install chromium to run browser acceptance checks.");
    this.server = createServer((request, response) => { void serve(this.documentRoot, request, response); });
    const port = await listen(this.server);
    this.origin = `http://127.0.0.1:${port}`;
    this.profile = await mkdtemp(resolve(tmpdir(), "chromium-"));
    const debugServer = createServer();
    const debugPort = await listen(debugServer);
    await new Promise(resolve => debugServer.close(resolve));
    this.process = spawn(chromium, [
      "--headless=new", `--remote-debugging-port=${debugPort}`, "--remote-debugging-address=127.0.0.1",
      `--user-data-dir=${this.profile}`, "--no-first-run", "--no-default-browser-check",
      "--disable-background-networking", "--disable-component-update", "--disable-sync", "--metrics-recording-only", "about:blank",
    ], { detached: true, stdio: "ignore" });
    this.debugUrl = `http://127.0.0.1:${debugPort}`;
    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline) {
      try { await json(this.debugUrl + "/json/version"); return this; } catch { await sleep(50); }
    }
    await this.close();
    fail("Chromium did not expose its DevTools endpoint within 15 seconds.");
  }

  async openPage(route) {
    try {
      const target = await json(this.debugUrl + "/json/new?" + encodeURIComponent(this.origin + route), { method: "PUT" });
      return DevToolsSocket.connect(target.webSocketDebuggerUrl);
    } catch (error) {
      throw new BrowserError(`Could not open ${route} in Chromium: ${error.message ?? error}`);
    }
  }

  async close() {
    if (this.process && this.process.exitCode === null) {
      try { process.kill(-this.process.pid, "SIGTERM"); } catch {}
      await Promise.race([new Promise(resolve => this.process.once("exit", resolve)), sleep(5_000)]);
      if (this.process.exitCode === null) { try { process.kill(-this.process.pid, "SIGKILL"); } catch {} }
    }
    if (this.profile) await rm(this.profile, { recursive: true, force: true });
    if (this.server) await new Promise(resolve => this.server.close(resolve));
  }
}
