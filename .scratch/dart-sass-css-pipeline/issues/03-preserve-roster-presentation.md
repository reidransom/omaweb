# Preserve roster presentation and browser acceptance

Type: task
Status: resolved
Blocked by: none

## Context

Implement the roster-markup and rendered-browser acceptance portion of [the Dart Sass specification](../spec.md). The compiler ticket will provide styles for the semantic class contract below.

## Ownership

- `_includes/people-grid.html`
- `scripts/verify-rendered-site`

Do not edit package metadata, build/serve scripts, contributor docs, or stylesheets.

## Contract

Replace Tailwind utility classes with `.people-roster`, `.person-card`, `.person-card__name`, `.person-card__detail`, and `.person-card__location`. Assert computed visitor behavior, never source class names or Sass internals.

## Acceptance

- Roster markup is semantic and utility-free while preserving its accessible label and data rendering.
- Chromium acceptance covers one-column base, two-column small, and three-column large roster layout plus card spacing, border, background, padding, heading sizing/margins, detail margins, and secondary color at contracted viewports.
- Add only coverage needed to detect the Tailwind-removal risk; preserve all existing interaction checks.
- Commit only repository changes. Skip project-wide builds, linters, and tests; integration verification belongs to ticket 04.

## Answer

Merged `65f7cb5` through `72f7671`. The roster template now uses the agreed semantic selectors, and the Chromium verifier checks computed columns and card presentation at 390px, 768px, and 1440px.
