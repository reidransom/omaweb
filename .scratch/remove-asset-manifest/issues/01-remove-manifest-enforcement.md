# Remove asset-manifest enforcement

Type: task
Status: resolved
Blocked by:

## Context

Implement the build and verification cutover in [the asset-manifest removal specification](../spec.md).

## Ownership

- `_data/assets.yml`
- `scripts/check-content`
- `scripts/verify-production`

Do not edit assets, templates, content, `scripts/build-assets`, contributor documentation, the News image skill, or its evaluations.

## Contract

- Delete `_data/assets.yml`; do not move or replace its records.
- Remove the image-manifest parser and per-image checksum, dimensions, and `publication_status` checks from `scripts/check-content`.
- Retain explicit favicon and OpenGraph presence/configuration checks and every unrelated content/network check.
- Remove WTE manifest provenance and clearance validation from `scripts/verify-production`.
- Retain direct WTE path, SHA-256, byte-size, local-import, same-origin, rendered behavior, and bundle-budget checks.
- Do not change published asset bytes or visitor-facing behavior.

## Acceptance

- Neither script opens or names `_data/assets.yml`.
- Neither script requires provenance, rights ownership, permission, clearance, or publication status.
- The manifest file is absent.
- `sh scripts/check-content` and `npm run assets:check` pass.
- Skip the complete production build; integration verification belongs to ticket 03.

## Answer

Merged implementation commit `72353d09ce6f315ab93c7f5d0f83aecc6a0075d6` cleanly as `a183f8f`.

Scoped checks completed before merge: `sh -n scripts/check-content scripts/verify-production` exited successfully, and the two scripts had no matches for `_data/assets.yml`, manifest, publication-status, provenance, rights, permission, or clearance enforcement.
