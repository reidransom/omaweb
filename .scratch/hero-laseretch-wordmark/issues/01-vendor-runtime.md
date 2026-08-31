# Vendor pinned laseretch runtime

Status: resolved
Type: task
Blocked by:

## Scope

Implement the vendored-runtime, provenance, and production-verifier portion of `.scratch/hero-laseretch-wordmark/spec.md`.

- Download the four pinned WTE artifacts to the specified `assets/js/wte/` paths and verify their hashes and byte sizes.
- Add cleared provenance records to `_data/assets.yml` with the fields required by the specification.
- Extend `scripts/verify-production` to require the files, pinned hashes, valid cleared manifest records, same-origin runtime URLs, and preserve the existing initial-JavaScript budget.

Do not edit markup, CSS, the wordmark application loader, or rendered-site browser checks.

## Acceptance

The exact four assets are local and their pinned checks pass in the production verifier.

## Answer

- Vendored the pinned loader, playback runtime, WebAssembly bindings, and `laseretch.wasm` under `assets/js/wte/`.
- Recorded source URLs, inspection date, hashes, byte sizes, and first-party clearance records in `_data/assets.yml`.
- Added deterministic production checks for source/output presence, fingerprints, clearance records, local loader import, same-origin runtime URLs, and the unchanged initial-JavaScript gzip budget.
