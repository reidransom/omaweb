# Replace Tailwind with Dart Sass

Status: ready-for-agent

## Problem Statement

The development server should be one simple, fast command. Jigyll already watches site content and renders pages on request, but the browser consumes a generated stylesheet rather than the authored CSS modules. The current development command therefore keeps Tailwind running beside Jigyll.

Tailwind is a broad compiler for this site’s actual CSS needs. It scans Markdown, Liquid, HTML, YAML, and CSS sources so that it can generate utilities, even though the site is primarily 2,054 lines of semantic, hand-authored CSS. The Tailwind-specific surface is limited to one breakpoint theme, six responsive variant blocks, and utility classes concentrated in the people grid. This makes content changes part of the CSS build graph and keeps a comparatively heavy Node-based tool in the edit loop.

Moving CSS compilation only to deployment would make local styles stale. Moving to Dart Sass would not remove compilation, but it would narrow the watched graph to stylesheets, keep a resident fast compiler, and preserve one generated production stylesheet. The migration must not alter the site’s visual system, responsive behavior, accessibility, asset URL, or production guarantees.

## Solution

Replace Tailwind with project-pinned Dart Sass Embedded as the sole CSS compiler. Convert the small Tailwind-specific surface to Sass modules, ordinary media queries, semantic classes, and explicit base normalization. Preserve the current cascade layers, design tokens, breakpoints, minified stylesheet output, and browser-facing asset location.

Keep the command interface small. `just serve` starts exactly the Sass watcher and Jigyll server. Sass performs one initial compile and then rebuilds only when a stylesheet dependency changes. Jigyll continues to watch content and render pages on request. JavaScript and Pagefind do not build during development-server startup or CSS edits.

Keep `just build` as the explicit full local rebuild. It compiles CSS and JavaScript, renders the complete Jigyll site, and generates Pagefind. The production build remains the authoritative release path and continues to run all existing content, asset, route, budget, and rendered-site verification.

Use two acceptance seams because one cannot exercise both contracts. The primary seam is the existing production build and rendered-site Chromium verifier, which proves the generated site still looks and behaves correctly. The second seam is an actual development-server smoke scenario, which proves the Sass watcher, Jigyll server, failure handling, and process cleanup work together without invoking JavaScript or Pagefind.

## User Stories

1. As a site developer, I want one `just serve` command, so that I can begin editing without remembering separate watcher commands.
2. As a site developer, I want the initial stylesheet compiled when the development server starts, so that the browser never receives stale CSS from a prior session.
3. As a site developer, I want edits to any imported stylesheet rebuilt automatically, so that visual feedback follows the saved source.
4. As a site developer, I want Sass to watch only stylesheet dependencies, so that Markdown, Liquid, HTML, and YAML edits do not perform unnecessary CSS compilation.
5. As a content editor, I want Jigyll to reload content without invoking Sass, so that prose iteration remains fast.
6. As a JavaScript developer, I want development-server startup to leave the JavaScript bundle alone, so that unrelated JavaScript work is not rebuilt.
7. As a JavaScript developer, I want the focused JavaScript build command retained, so that I can rebuild the browser bundle deliberately when needed.
8. As a search developer, I want Pagefind excluded from the development watch loop, so that ordinary page and stylesheet edits never reindex the site.
9. As a search developer, I want the full build to refresh Pagefind, so that search acceptance still uses current rendered content.
10. As a developer using Servd, I want the Sass watcher to remain alive when standard input is closed, so that non-interactive serving behaves like an interactive terminal.
11. As a developer restarting Servd, I want old Sass and Jigyll processes terminated, so that duplicate watchers do not accumulate.
12. As a developer stopping the server, I want all supervised child processes terminated, so that no background compiler continues modifying generated assets.
13. As a developer, I want a compiler or server failure to stop the supervised development command with a failure status, so that broken tooling is visible rather than silently ignored.
14. As a new contributor, I want the repository to install a pinned CSS compiler through its existing toolchain, so that I do not need an undocumented global Sass installation.
15. As a new contributor, I want development documentation to distinguish `just serve`, focused asset builds, and `just build`, so that I choose the smallest correct command.
16. As a maintainer, I want Tailwind packages and transitive platform binaries removed, so that the dependency graph reflects the CSS implementation actually in use.
17. As a maintainer, I want no Tailwind directives or source-scanning configuration left behind, so that there is one authoritative CSS compilation model.
18. As a maintainer, I want breakpoints defined once for Sass compilation, so that responsive rules do not drift across modules.
19. As a visitor on a small viewport, I want the existing mobile layout preserved, so that the compiler migration does not change navigation or content usability.
20. As a visitor on an intermediate viewport, I want the existing 48rem layout behavior preserved, so that header and content transitions remain stable.
21. As a visitor on a wide viewport, I want the existing 64rem and 90rem layout behavior preserved, so that grids, navigation, and page spacing remain stable.
22. As a visitor viewing a people roster, I want the same responsive column counts, spacing, borders, colors, and typography, so that replacing utility classes produces no visible redesign.
23. As a visitor, I want headings, paragraphs, lists, links, images, and media to retain their current normalization, so that removing Tailwind Preflight does not expose browser-default regressions.
24. As a visitor using forms and buttons, I want typography, borders, backgrounds, and focus treatment preserved, so that controls remain consistent and accessible without Preflight.
25. As a keyboard user, I want the existing visible focus treatment preserved, so that compiler changes do not weaken navigation cues.
26. As a visitor who prefers reduced motion, I want the existing reduced-motion behavior preserved, so that the migration does not re-enable transitions or animation.
27. As a print user, I want the existing print treatment preserved, so that compiler changes do not alter printable pages.
28. As a visitor, I want the stylesheet served from the same URL, so that templates, caching behavior, and deployed routes do not change.
29. As a release reviewer, I want the generated stylesheet minified and within the existing compressed budget, so that replacing Tailwind does not increase production weight beyond the accepted limit.
30. As a release reviewer, I want all current rendered routes free of horizontal overflow at contracted viewport sizes, so that subtle responsive regressions fail acceptance.
31. As a release reviewer, I want the existing Chromium interaction checks to pass against the Sass output, so that navigation, search, focus, motion, and layout contracts remain intact.
32. As a maintainer, I want runtime design tokens to remain CSS custom properties, so that Sass does not hide values that the browser or JavaScript may need.
33. As a maintainer, I want Sass used only where it earns its keep through modules and compile-time breakpoints, so that the stylesheet architecture stays understandable as ordinary CSS.
34. As a maintainer, I want the same CSS compiler used for focused builds, development watching, full local builds, and production builds, so that environments cannot drift.
35. As a maintainer, I want generated CSS to remain uncommitted, so that source stylesheets remain authoritative and build artifacts do not create review noise.
36. As a maintainer evaluating the migration, I want before-and-after compile measurements from the same machine, so that the claimed development-speed improvement is grounded.

## Implementation Decisions

- Replace the Tailwind CLI and Tailwind package with the project-pinned Dart Sass Embedded package. Use its `sass` executable through the existing package toolchain; do not depend on an unversioned global installation.
- Preserve the existing CSS build interface: a focused one-shot CSS command and a focused CSS watch mode. Callers should not need to know compiler arguments or module layout.
- Keep `just serve` as the external development interface. It supervises exactly two long-running children: the Sass watcher and Jigyll server.
- Keep JavaScript compilation out of `just serve`. The focused JavaScript command remains one-shot.
- Keep Pagefind and the complete Jigyll render out of `just serve`. They remain part of `just build` and the production build.
- Preserve the existing production build order: validate content and committed assets, compile CSS and JavaScript, render Jigyll, build Pagefind, then run production and rendered-site verification.
- Compile one minified browser-facing stylesheet at the existing URL. Do not introduce separate development and production stylesheet graphs.
- Preserve the current cascade-layer order for theme, base, components, and utilities. Each Sass module emits its rules into its assigned layer, and the entry module owns the authoritative layer ordering.
- Keep the Night, Storm, Terminal Black, Blue, Cyan, Green, Turquoise, Terminal White, typography, spacing, radius, transition, and shadow values as runtime CSS custom properties.
- Replace the Tailwind breakpoint theme with compile-time Sass breakpoint values matching the existing 40rem, 48rem, 64rem, and 90rem contracts. Do not change breakpoint behavior as part of the migration.
- Replace all responsive Tailwind variants with explicit media queries driven by the authoritative Sass breakpoint values. Existing ordinary media queries should use the same values where doing so removes duplication without changing their inclusive or exclusive edges.
- Replace the people-grid utility classes with semantic roster and person-card classes. Preserve the existing one-column base layout, two-column small layout, three-column large layout, list reset, spacing, border, background, padding, heading size, margins, and secondary text color.
- Remove Tailwind utility generation and all content-source scanning. Template and content files are not CSS compiler inputs after the cutover.
- Replace Tailwind Preflight with explicit normalization only for behavior the site relies on. Consolidate it with the authored base styles rather than copying the complete Tailwind reset wholesale.
- Preserve box sizing, body margin, inherited form typography, media sizing, heading/list margins, link treatment, selection, focus visibility, reduced motion, view transitions, and print behavior.
- Use Sass modules rather than deprecated Sass imports. Keep module dependencies explicit and avoid global mixin or variable namespaces beyond the shared breakpoint definitions.
- Do not convert runtime custom properties into Sass variables merely because Sass is present. Sass variables are limited to compile-time concerns such as breakpoints and module composition.
- Keep compressed output and disable production source maps unless the current production contract is deliberately changed in a separate effort.
- The watch mode performs an initial compile, remains alive without standard input, and rebuilds when the entry module or any loaded Sass module changes.
- The development supervisor terminates every child on exit or signal. If either Sass or Jigyll exits unexpectedly, it terminates the other child and returns the failing status.
- Remove Tailwind dependencies, Tailwind-specific lockfile entries, Tailwind directives, and obsolete watcher branches in one clean cutover. Do not retain compatibility aliases or dual CSS pipelines.
- Update contributor-facing command descriptions so `just serve` means Sass watch plus on-request Jigyll rendering, while `just build` means the complete rendered site and Pagefind refresh.
- Capture comparable cold and watched compile timings before removing Tailwind and after enabling Sass. Use repeated samples on the same machine and report the median; this is implementation evidence, not a permanent timing test.

## Testing Decisions

- A good test proves observable output or workflow behavior. It should inspect rendered layout, computed presentation, generated asset availability, command exit status, process lifetime, and browser behavior. It should not assert Sass module names, shell function names, compiler flag spelling, or source-file text.
- Use the existing production build and rendered-site Chromium verifier as the primary acceptance seam. This is the highest existing seam: it compiles real assets, renders the complete site, creates the real Pagefind index, serves the rendered output, and exercises the browser at 390×844, 768×1024, and 1440×900.
- Require the complete existing production verification to pass unchanged, including route integrity, metadata, local assets, network policy, landmarks, compressed CSS and JavaScript budgets, and horizontal-overflow checks.
- Preserve all existing Chromium behavior checks for navigation, search, focus, reduced motion, responsive presentation, images, and page errors. A compiler migration that renders successfully but changes those visitor contracts is incomplete.
- Extend the rendered-site verifier only where existing coverage cannot detect the Tailwind removal risk. The targeted addition should verify the people roster’s observable column count and card presentation at small and large contracted viewports, not its class names.
- Cover Preflight-sensitive behavior through rendered pages that contain headings, unclassed lists, links, images, buttons, and form controls. Assert visible/computed behavior only where a plausible reset regression would be visitor-visible.
- Use an actual `just serve` smoke scenario as the second acceptance seam. Start the command non-interactively, wait for both Sass and Jigyll readiness, change a stylesheet dependency temporarily, and observe the generated stylesheet and served response update without a full Jigyll build, JavaScript build, or Pagefind run.
- In the development smoke scenario, change a content source and confirm Jigyll reloads it without a Sass rebuild. This proves the CSS dependency graph no longer includes content files.
- Stop and restart the development command, then confirm exactly one Sass watcher and one Jigyll server remain and no JavaScript, Tailwind, or Pagefind watcher survives.
- Exercise the focused one-shot CSS command independently and confirm it creates the expected minified stylesheet from a clean generated-output state.
- Exercise the focused JavaScript command independently to confirm removing it from the server did not remove deliberate JavaScript compilation.
- Run the full `just build` command and confirm it compiles CSS and JavaScript, renders Jigyll, and creates a usable Pagefind index.
- Before deleting Tailwind, record repeated cold one-shot and resident watched-rebuild timings. Repeat with Sass under the same conditions and compare medians. Do not add a flaky wall-clock assertion to the permanent suite.
- Do not add unit tests for Sass variables, media-query helpers, shell argument assembly, or dependency names. The production build and actual development process are the correct seams.

## Out of Scope

- A visual redesign, new color palette, new typography, changed spacing scale, or changed animation language.
- Changing responsive breakpoints or the navigation’s small, intermediate, wide, and extra-wide behavior.
- Rewriting unrelated semantic CSS merely to demonstrate Sass features.
- Introducing a general-purpose Sass framework, utility generator, mixin library, or replacement design system.
- Retaining Tailwind beside Sass or supporting two CSS compilers.
- Switching the development site to browser-native multi-file CSS imports.
- Adding JavaScript watch mode to the development server.
- Changing the JavaScript bundle, Pagefind behavior, Jigyll rendering model, Servd routing, or deployment topology.
- Changing the browser-facing stylesheet URL, cache policy, or compressed CSS budget.
- Committing generated CSS.
- Deploying, shipping, pushing, or changing Git history.

## Further Notes

- The current authored CSS totals 2,054 lines. Tailwind-specific authoring consists of one breakpoint theme, six responsive variant blocks, content-source declarations, Tailwind theme/preflight/utility imports, and utility classes concentrated in the people roster.
- The current stylesheet already uses ordinary media queries for several responsive and accessibility cases. The migration should converge on that existing CSS vocabulary rather than invent a Sass-heavy abstraction layer.
- Tailwind Preflight is the broadest migration risk because its effects are implicit. Review the rendered site rather than assuming the authored base normalization covers every element.
- Dart Sass does not eliminate the CSS build step. Its value here is a narrower dependency graph, a faster resident compiler, fewer content-triggered rebuilds, and a smaller project dependency surface.
- Browser-native imports were considered but rejected for this effort because they would give development and production different stylesheet graphs. One Sass output keeps the development and release paths aligned.
- The existing compressed stylesheet limit remains 40 KiB. The migration should normally reduce or preserve output size because unused Tailwind theme, utility, and Preflight output will disappear, but the established budget remains the authority.
