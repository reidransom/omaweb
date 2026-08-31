# Rendered production navigation acceptance

Status: completed
Blocked by: 01, 02, 03, 04

## Scope

Extend the existing production build and rendered-site Chromium verifier for the complete observable contract in `.scratch/quake-navigation/spec.md` §§144–164.

- Update route presence and absence expectations for `/new-releases/`, `/desktop/`, `/accessories/`, `/search/`, and removed `/news/search/`.
- Extend the existing Chromium seam at 1440x900, 768x1024, and 390x844. Cover closed/open responsive navigation, direct links, hints, current route, exploratory semantics, no-hover, toggle/dismiss/focus/scroll/Tab behavior, overlay exclusivity, opacity restoration, reduced motion, no-JavaScript fallback, and preserved mobile drawer.
- Exercise generated Pagefind through Spotlight and `/search/`: blank state, threshold, stale-query safety, no-results/unavailable states, result group order/caps, keyboard selection and Enter, focus trap, backdrop/Escape/focus restoration.
- Preserve existing route, link, metadata, budget, local-asset, landmark, overflow, News, header, and drawer contracts while replacing obsolete Desktop proof and News-search expectations.

## Acceptance

`scripts/build` is the sole acceptance command and proves all specified behavior against the rendered production site. Do not add unit-level markup/module tests or a second browser framework.
