# Verify the rendered hero choreography

Status: resolved
Type: task
Blocked by: 01, 02

## Scope

Implement the browser-acceptance portion of `.scratch/hero-featured-video-panels/spec.md` after tickets 01 and 02 are integrated.

- Extend the existing real-Chromium rendered-site verifier at its highest behavioral seam.
- Cover normal-motion milestones and intermediate entry direction at `1440×900` and `768×1024`.
- Cover late-third movement, scroll-linked announcement/header departure, immediate sticky release into News, reverse scrolling, the scroll cue, focusability, accessible link contracts, and horizontal overflow.
- Cover the `390×844` static mobile layout.
- Cover desktop and mobile reduced-motion layouts.
- Cover no-JavaScript desktop and mobile layouts if the existing Chromium harness can disable script execution without adding another browser framework.
- Verify that the homepage contains posters rather than embeds or playable media and that the standalone Featured videos destination remains intact.

Do not test source strings, private controller symbols, or exact transform serialization. Do not add a second browser harness or a dependency.

## Acceptance

The production-built site verifier fails on plausible regressions in stage order, entry direction, equal-column geometry, an unwanted completed-state hold, sticky release, static fallbacks, focus state, accessible destinations, or overflow, while preserving the existing route and broken-image checks.

## Answer

- Extended `scripts/verify-rendered-site` without replacing its route and broken-image sweep; the standalone Featured videos route is now also part of that generic sweep.
- Added rendered homepage scenarios at `1440×900` and `768×1024` that sample the opening, all three transition midpoints, all three milestones, two late points in the final entrance, and three points during announcement release. The checks cover entry direction, continuous width contraction through the end boundary, smooth banner/header movement, canonical DOM order, the `2–3 / 1 / 4–5` visual column order, full/half/third widths, equal stacked-cell heights, stable centered poster-1 crop, overlay visibility, two-line title bounds, View all placement, immediate release, focusability, and horizontal overflow.
- The normal-motion scenario advances past the hero boundary to verify sticky release into visible News content, then scrolls back through equivalent progress samples to verify reversible geometry and focus cleanup as panels become hidden. At `1440×900` it also exercises the scroll cue and requires the News target to enter the viewport without leaving an intermediate animation state.
- Hero destinations, same-tab behavior, names, image alternatives, and decorative play semantics are compared with the five rendered canonical links on `/community/featured-videos/`; the completed hero is also inspected through Chromium's accessibility tree. Every poster and View all must expose a visible keyboard focus indicator.
- Added ordinary-flow checks for `390×844`, reduced-motion checks at `1440×900` and `390×844`, and raw-DevTools no-JavaScript checks at both sizes. A live `768→390→768` resize additionally proves animation-owned inline state is removed and a clean opening state is restored.
- Added a small reusable DevTools event wait so script-disabled navigation can wait for the matching document lifecycle event without another browser framework.

Deliberately omitted: the verifier does not assert focus transfer to `#home-news` because that section is not a focusable target; it asserts the deterministic cue contract of the News hash, visible News geometry, and cleared animation state instead. Live motion-preference switching is not asserted because DevTools emulation is deterministic only when applied before navigation; both reduced-motion layouts are covered that way. Overlay readability and baked-in thumbnail composition remain visual-review judgments rather than brittle pixel assertions.
