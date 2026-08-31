#!/usr/bin/env node

import { spawn } from "node:child_process";
import { watch } from "node:fs";

const siteDirectory = process.argv[2] ?? "_site";
const outputDirectory = process.argv[3] ?? `${siteDirectory}/pagefind`;
const debounceMilliseconds = 250;

let debounceTimer;
let pagefindProcess;
let reindexQueued = false;
let stopping = false;

function stop(exitCode) {
  if (stopping) return;

  stopping = true;
  clearTimeout(debounceTimer);
  siteWatcher.close();

  if (pagefindProcess) {
    pagefindProcess.once("close", () => process.exit(exitCode));
    pagefindProcess.kill("SIGTERM");
  } else {
    process.exit(exitCode);
  }
}

function runPagefind() {
  debounceTimer = undefined;
  if (pagefindProcess) {
    reindexQueued = true;
    return;
  }

  reindexQueued = false;
  pagefindProcess = spawn(
    "npx",
    [
      "--no-install",
      "pagefind",
      "--site",
      siteDirectory,
      "--output-path",
      outputDirectory,
    ],
    { stdio: "inherit" },
  );

  pagefindProcess.once("error", (error) => {
    console.error(`Unable to start Pagefind: ${error.message}`);
  });
  pagefindProcess.once("close", (code, signal) => {
    pagefindProcess = undefined;
    if (stopping) return;

    if (code !== 0) {
      console.error(`Pagefind exited with ${signal ?? `status ${code}`}.`);
      stop(code ?? 1);
      return;
    }

    if (reindexQueued) schedulePagefind();
  });
}

function schedulePagefind() {
  reindexQueued = true;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runPagefind, debounceMilliseconds);
}

const siteWatcher = watch(siteDirectory, { recursive: true }, (_event, filename) => {
  if (!filename) return;

  const path = filename.replaceAll("\\", "/");
  if (path.startsWith("pagefind/") || !path.endsWith(".html")) return;

  schedulePagefind();
});

siteWatcher.once("error", (error) => {
  console.error(`Unable to watch ${siteDirectory}: ${error.message}`);
  stop(1);
});

process.once("SIGHUP", () => stop(129));
process.once("SIGINT", () => stop(130));
process.once("SIGTERM", () => stop(143));
