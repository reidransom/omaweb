# Verify the rendered hero choreography

Status: ready-for-agent
Type: task
Blocked by: 01, 02

## Scope

Implement the browser-acceptance portion of `.scratch/hero-featured-video-panels/spec.md` after tickets 01 and 02 are integrated.

- Extend the existing real-Chromium rendered-site verifier at its highest behavioral seam.
- Cover normal-motion milestones and intermediate entry direction at `1440×900` and `768×1024`.
- Cover the stable final hold, sticky release into News, reverse scrolling, the scroll cue, focusability, accessible link contracts, and horizontal overflow.
- Cover the `390×844` static mobile layout.
- Cover desktop and mobile reduced-motion layouts.
- Cover no-JavaScript desktop and mobile layouts if the existing Chromium harness can disable script execution without adding another browser framework.
- Verify that the homepage contains posters rather than embeds or playable media and that the standalone Featured videos destination remains intact.

Do not test source strings, private controller symbols, or exact transform serialization. Do not add a second browser harness or a dependency.

## Acceptance

The production-built site verifier fails on plausible regressions in stage order, entry direction, equal-column geometry, final-hold stability, sticky release, static fallbacks, focus state, accessible destinations, or overflow, while preserving the existing route and broken-image checks.

## Answer
