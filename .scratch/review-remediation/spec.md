# Review remediation

Status: ready-for-agent

## Problem Statement

Visitors can reach a rendered Omarchy site, but several required surfaces are incomplete or incorrect. The homepage omits Plugins from its authoritative action group. The selected News feature renders generic fallback art instead of cleared lead media. Workstations has no community gallery. The Desktop route can render workflow HTML as a preformatted code block and overflow on wide screens. Required build commands are absent, and the brand shell substitutes placeholders or recreated marks for approved identity assets.

The current state also leaves repeated Liquid renderers and duplicated product identity data likely to drift when destinations, statuses, or page shells change.

## Solution

Finish the proposal as a coherent Jigyll site rather than a partially wired prototype. Restore the approved Omarchy identity assets, make destination and product data single-source, render all authored content as semantic responsive HTML, complete current-product and community proof with cleared local media, and make News, asset generation, and production verification agree on the same contracts.

The highest test seam is the production pipeline's rendered-site verification, supplemented by real Chromium checks at the three contracted viewport sizes. Unit-level checks are unnecessary unless a pure validator becomes too complex to exercise through the build seam.

## User Stories

1. As a prospective Omarchy user, I want the homepage action group to include Manual, ISO, Plugins, and Code, so that I can reach every authoritative starting point.
2. As a prospective installer, I want the Desktop page to show current local product proof, so that I can judge the desktop before downloading the ISO.
3. As a community member, I want Workstations to show approved real community setups, so that the page is evidence rather than an empty invitation.
4. As a News reader, I want the featured winners story to use its cleared real lead image, so that the feature represents a real event accurately.
5. As a News reader, I want page one and page two to partition the twelve-article archive, so that I do not see duplicates or miss stories.
6. As a keyboard user, I want all generated workflow and gallery content to render as ordinary semantic HTML, so that links, lists, and reading order remain usable.
7. As a wide-screen visitor, I want every route to fit its viewport without horizontal scrolling, so that page content remains readable.
8. As a mobile visitor, I want the page to preserve its one-column reading order and usable menu, so that the site works at 390×844.
9. As a tablet visitor, I want the site to remain readable without hover-only controls or an offscreen drawer, so that it works at 768×1024.
10. As a desktop visitor, I want the fixed Quattro scene to appear only at its three intentional beats, so that long-form content remains readable.
11. As a user who disables JavaScript, I want the Green wordmark and grouped navigation fallback, so that core navigation is still available.
12. As a reader using reduced motion, I want a static Green wordmark, so that continuous animation does not run unexpectedly.
13. As a visitor, I want the footer, favicon, and share card to use approved Omarchy marks, so that the site represents the project correctly.
14. As a screen-reader user, I want the compact mark to have a useful name rather than placeholder text, so that the footer has meaningful identity.
15. As an editor, I want external destinations to be defined once, so that a changed ISO, Manual, or Plugins URL cannot leave stale calls to action.
16. As an editor, I want product labels, URLs, and exploratory status to have one authoritative owner, so that cards and News relationships cannot disagree.
17. As a maintainer, I want contracted CSS and JavaScript build commands to exist, so that documented acceptance gates run predictably.
18. As a maintainer, I want fonts and image derivatives generated and checked deterministically, so that committed assets are reproducible and conform to the manifest.
19. As a maintainer, I want unused client dependencies removed unless a concrete interaction uses them, so that the local bundle stays intentional.
20. As a maintainer, I want shared Liquid renderers for recurring links, action controls, cards, and page shells, so that future edits have one owner.
21. As a release reviewer, I want production verification to reject missing media, broken internal routes, duplicate News items, and viewport overflow, so that deployment evidence matches the public site.
22. As a brand steward, I want Labs and other exploratory copy to state only concrete, verified experiments and mechanisms, so that exploratory work does not become unsupported marketing.

## Implementation Decisions

- Preserve Jigyll, Git-authored Markdown/Liquid/YAML, the existing deployment workflow, and the fixed-scene homepage architecture. No router, CMS, remote asset, or reference-site artifact is introduced.
- Treat the approved compact mark, static social wordmark, and full wordmark as first-party identity assets. Do not recreate them with arbitrary glyphs, SVG geometry, fonts, or gradients.
- Use a single destination registry for every authoritative external destination. Internal navigation groups may reference that registry; templates must not retype destination URLs.
- Establish one canonical product record for shared identity fields. Project-area relationships may reference stable product slugs rather than duplicate label, URL, and status values.
- Move recurring Liquid link, action, and product-card rendering behind controlled includes. Keep page-specific copy and composition authored at the route level.
- Render generated HTML through includes/layouts rather than indentation-sensitive Markdown expansion. The output must be semantic elements, never escaped/generated code blocks.
- Populate current proof only with local, manifest-listed, `cleared` media whose source, rights status, dimensions, checksums, and useful alt text are recorded. Do not invent workstation photos or product evidence.
- Make featured-News selection, lead-media requirements, card fallbacks, archive slicing, feed ordering, and pagination operate over one ordered News collection.
- Expose the documented CSS and JavaScript build interfaces. Keep Motion only if a concrete short, interruptible interaction imports it; otherwise remove it from the toolchain.
- Extend deterministic asset generation/checking to all generated responsive images and required font subsets, preserving the primary Light preload and required wordmark glyph coverage.
- Keep the production verifier as the primary integration seam. It must inspect rendered HTML/data rather than source spelling where behavior is what matters.

## Testing Decisions

- A good test proves visitor-observable behavior: valid generated routes, complete action groups, semantic lists, correct News partitioning, present cleared media, absence of horizontal overflow, correct marks, and usable navigation. Do not test Liquid internals, CSS selector text, or incidental markup nesting.
- The production build and rendered-site verifier are the highest existing seam and should cover content/data integrity, local asset manifests, News feature requirements, taxonomy/pagination URLs, metadata, and destination consistency.
- Chromium checks cover the homepage, Desktop, News index/article/search/taxonomy, Workstations, Teams, and Meetups at 390×844, 768×1024, and 1440×900. Verify viewport width, fixed-scene exposure, dialog focus/close behavior, no-JavaScript fallbacks, and reduced-motion wordmark behavior.
- Reuse the existing deterministic asset check for byte-level derivative validation and the existing local-development server for browser checks.
- Add narrow validator coverage only for pure ordering/windowing rules that cannot be observed reliably through the rendered build.

## Out of Scope

- Deploying, shipping, pushing, or modifying Git history.
- New product commitments for Server, Mobile, Laptops, Apps, Cloud, or Labs.
- New remote media, fonts, scripts, framework bundlers, client router, CMS, or Massively-derived material.
- Inventing factual product claims, workstation photographs, approval rights, sponsor marks, News evidence, or a new roadmap.
- Copy/style changes beyond correcting the reviewed Labs grounding and required canonical/brand copy.

## Further Notes

- The remediation follows `_plans/initial-plan.md` as the binding implementation plan and `__docs/BRAND.md` as the identity authority.
- Supplied-asset decision: retain the favicon and Open Graph artwork already added from the original first-party Omarchy site. The Winding Road theme image is the replacement hero source; source its later deterministic derivatives from the exact local theme original. For remaining media, research rights-clear candidates by web search first; only use a local OpenAI image-model placeholder when no suitable cleared candidate exists, clearly identify it as illustrative, and never present it as factual proof.
- Existing browser evidence confirms the homepage, responsive hero art direction, drawer behavior, and no-JavaScript fallback work. It also confirms Desktop overflow, absent Workstations media, and featured-News fallback art.
