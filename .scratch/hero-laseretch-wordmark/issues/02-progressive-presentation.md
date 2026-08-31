# Prepare progressive wordmark presentation

Status: ready-for-agent
Type: task
Blocked by:

## Scope

Implement the markup, pre-paint capability, and CSS parts of `.scratch/hero-laseretch-wordmark/spec.md`.

- Update `_includes/head.html`, `_includes/wordmark.html`, and `src/css/home.css` without changing the ASCII art, home composition, or the one existing Canvas.
- Expose runtime and WASM paths via Liquid `relative_url` data attributes.
- Make the static Green `<pre>` the default; use the pre-paint capability class and two-second CSS recovery to hide it only while a normal-motion enhancement is pending.
- Implement overlay, native-size scaling, enhanced/static/reduced-motion/print styling and preserve intrinsic fallback layout size.

Do not vendor artifacts, modify production or browser verifiers, or replace `src/js/wordmark.js`.

## Acceptance

Markup and styles provide the exact progressive-enhancement state contract required by the spec.
