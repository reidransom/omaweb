# Implement one-shot laseretch loader

Status: resolved
Type: task
Blocked by: 01, 02

## Scope

Replace `src/js/wordmark.js` with the local one-shot WTE loader defined by `.scratch/hero-laseretch-wordmark/spec.md`, adapting the inspected pinned production integration.

Use the runtime and WASM data attributes supplied by ticket 02 and the local artifact relationships supplied by ticket 01. Preserve the complete fallback, sizing, error-recovery, no-replay, accessibility, and one-second font-wait contracts. Remove the sweep, animation loop, visibility lifecycle, and IntersectionObserver cleanly.

Do not alter markup, styles, artifacts, or verification scripts.

## Acceptance

The loader starts a single local `laseretch` playback after font readiness, holds the final frame, and reliably transitions to the static state on every specified failure path.

## Answer

Replaced the sweep with the local one-shot `laseretch` playback loader, including deterministic static recovery for setup, load, and runtime failures.
