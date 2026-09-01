# Migrate the CSS compiler and stylesheet graph

Type: task
Status: ready-for-agent
Blocked by: none

## Context

Implement the compiler and authored-stylesheet portion of [the Dart Sass specification](../spec.md). Record comparable before/after timing evidence at `/tmp/omaweb-dart-sass/timings.md`; do not commit timing artifacts.

## Ownership

- `package.json`
- `package-lock.json`
- `scripts/build`
- `src/css/**`

Do not edit templates, `scripts/serve`, `Justfile`, `README.md`, or rendered-site verification.

## Contract

- Keep `scripts/build css` and `scripts/build css --watch` as the focused public CSS interfaces.
- Compile `src/css/site.scss` to the ignored `assets/css/site.css` with project-pinned Dart Sass Embedded, compressed output, and no source map.
- The entry module owns `@layer theme, base, components, utilities` ordering.
- Sass variables are limited to shared compile-time breakpoints: `40rem`, `48rem`, `64rem`, and `90rem`.
- Roster markup will use `.people-roster`, `.person-card`, `.person-card__name`, `.person-card__detail`, and `.person-card__location`.

## Acceptance

- Tailwind packages, lockfile entries, directives, source scanning, and generated utilities are removed in one clean cutover.
- Sass modules use `@use`, preserve cascade layers and all current visual/accessibility contracts, and explicitly normalize the Preflight behavior this site relies on.
- One-shot CSS compilation creates the minified stylesheet at the existing URL; watch mode performs an initial compile and survives closed stdin.
- Repeated cold and resident-rebuild samples for Tailwind and Sass are captured on the same machine with medians.
- Commit only repository changes. Skip project-wide builds, linters, and tests; integration verification belongs to ticket 04.
