# Verify rendered laseretch behavior

Status: ready-for-agent
Type: task
Blocked by: 01, 02, 03

## Scope

Extend `scripts/verify-rendered-site` according to `.scratch/hero-laseretch-wordmark/spec.md`.

At the real Chromium seam cover normal-motion layout and enhanced Canvas state at the three contracted viewports, changing-then-stable playback output, no replay after scroll/resize/visibility changes, blocked-site-bundle fallback, reduced-motion no-WTE-request fallback, blocked WASM and playback-module recovery within two seconds without uncaught errors, and print fallback. Extend current checks rather than duplicate them.

Do not alter application code, styles, vendored assets, provenance, or the production verifier.

## Acceptance

The rendered-site verifier proves visitor-observable normal and fallback wordmark behavior while tolerating the random effect seed.
