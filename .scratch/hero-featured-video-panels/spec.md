# Five-poster homepage hero choreography

Status: ready-for-agent

## Problem Statement

The homepage hero currently uses one vertically scrubbed transition: the OMARCHY primary panel contracts while a single featured-video panel enters from the right. That panel shows only the first three featured-video posters in a clipped vertical list. It never presents all five posters as one deliberate composition, and its panel movement does not build through the staged left/right sequence the user wants.

The result feels like one secondary panel being exposed rather than a designed visual progression. Posters 4 and 5 are absent, posters 2 and 3 are partially clipped, and the final state does not create a clear handoff from the branded introduction to the rest of the homepage.

## Solution

Turn the enhanced desktop hero into a reversible, vertical-scroll-driven sequence with three stages. Begin with the existing OMARCHY primary panel. Replace it with featured-video poster 1 entering from the right. Then introduce a panel containing posters 2 and 3 from the left while poster 1 contracts and shifts into the center column. Introduce posters 4 and 5 from the right to complete three equal-width columns. Release the sticky stage immediately when the third panel lands so ordinary downward scrolling continues into the News section without a completed-state pause.

The completed composition is:

1. First column: posters 2 and 3 stacked in equal-height cells.
2. Center column: poster 1 in the flexible media area, with **View all** directly below it.
3. Third column: posters 4 and 5 stacked in equal-height cells.

Each poster remains a link to its existing YouTube destination. Titles and creator names are always visible over the poster artwork. This feature does not add inline video playback or YouTube embeds.

On narrow screens, with reduced motion, or without JavaScript, preserve the OMARCHY introduction and render all five posters afterward in ordinary document flow. The animated replacement applies only to the enhanced desktop experience.

## User Stories

1. As a homepage visitor, I want to encounter the OMARCHY introduction first, so that I understand the product before the visual showcase begins.
2. As a homepage visitor, I want poster 1 to enter from the right and completely replace the OMARCHY panel, so that the transition has a clear first act.
3. As a homepage visitor, I want the introductory wordmark, product copy, ISO action, and Manual action to be absent after the first replacement completes, so that the media composition is not competing with stale hero content.
4. As a homepage visitor, I want posters 2 and 3 to arrive together from the left, so that the second act visibly differs from the first.
5. As a homepage visitor, I want poster 1 to contract continuously while posters 2 and 3 arrive, so that the two-column state forms without a layout snap.
6. As a homepage visitor, I want posters 4 and 5 to arrive together from the right, so that the final act balances the preceding leftward entrance.
7. As a homepage visitor, I want the first two columns to contract continuously while the third column arrives, so that the final three-column composition forms as one coherent movement.
8. As a homepage visitor, I want posters 2 and 3 to finish in the left column, poster 1 in the center column, and posters 4 and 5 in the right column, so that each panel lands on the side from which it entered.
9. As a homepage visitor, I want all three final columns to have equal width, so that no group appears arbitrarily more important than another.
10. As a homepage visitor, I want posters 2 and 3 to divide their column evenly, so that both recommendations receive equal visual weight.
11. As a homepage visitor, I want posters 4 and 5 to divide their column evenly, so that both recommendations receive equal visual weight.
12. As a homepage visitor, I want the final panel to keep moving until the sticky stage releases, so that the completed composition does not pause before the page moves on.
13. As a homepage visitor, I want ordinary downward scrolling to resume the moment the final panel lands, so that the News section follows immediately.
14. As a visitor scrolling upward, I want the choreography to reverse continuously, so that the page never jumps between unrelated states.
15. As a visitor scrolling upward, I want the right panel to leave rightward, the center panel to leave leftward, poster 1 to expand, and the OMARCHY panel to return, so that the reverse motion explains the original sequence.
16. As a visitor, I want each stage to dominate a distinct scroll interval, so that all three entrances do not blur into one simultaneous animation.
17. As a visitor, I want slight overlap between adjacent transitions, so that the sequence feels continuous rather than stopping mechanically at each boundary.
18. As a visitor, I want the third entrance to consume the remaining pinned scroll interval, so that there is no separate beat after all five posters are in place.
19. As a visitor, I want every poster title and creator name visible without hovering, so that I can identify each recommendation on touch, pointer, or keyboard devices.
20. As a visitor, I want long poster titles limited to two lines, so that text does not consume or obscure the media cells.
21. As a visitor, I want the overlaid text supported by a dark lower gradient, so that it remains legible over all five poster images.
22. As a visitor, I want the entire poster cell to activate its YouTube destination, so that the interaction target is obvious and generous.
23. As a visitor, I want poster links to retain the current same-tab navigation, so that the redesign does not silently change link behavior.
24. As a keyboard user, I want each visible poster link and the **View all** link to have a clear focus state, so that I can identify the active control.
25. As a keyboard user, I want off-stage poster links excluded from sequential focus, so that focus never moves into clipped or invisible content.
26. As a screen-reader user, I want each poster link to retain its descriptive video-and-creator label, so that the visual text overlay is not my only source of context.
27. As a screen-reader user, I want decorative play artwork ignored, so that each poster produces one concise announcement.
28. As a visitor, I want **View all** directly below poster 1 in the final center column, so that the complete collection remains discoverable without adding a fourth panel or sixth media cell.
29. As a visitor, I want **View all** to appear after the third panel settles, so that it does not compete with the staged poster entrances.
30. As a visitor selecting **View all**, I want to reach the existing Featured videos collection, so that the hero remains connected to the complete destination.
31. As a visitor, I want poster 1 to fill its available media area with the rally car centered at 50% horizontally, so that the tall center-column crop has an intentional focal subject.
32. As a visitor, I want the crop of poster 1 to remain stable through its width transitions, so that its subject does not visibly jump while the columns form.
33. As a visitor on a narrow screen, I want the OMARCHY introduction followed by all five posters in one vertical sequence, so that none of the content is compressed into unreadable columns.
34. As a visitor on a narrow screen, I want **View all** available after the poster collection, so that the static layout retains the same destination as desktop.
35. As a visitor who prefers reduced motion, I want the OMARCHY introduction followed by the completed responsive poster layout without fly-ins, width compression, or sticky choreography, so that I receive all content without scroll-driven movement.
36. As a visitor without JavaScript, I want the OMARCHY introduction and all five posters in ordinary document flow, so that progressive enhancement never removes essential content.
37. As a visitor using a browser that cannot initialize the scroll enhancement, I want the same complete static layout, so that a runtime failure does not leave blank or clipped content.
38. As a visitor using the hero’s existing scroll cue, I want to reach the News section, so that the new pinned interval does not break skip navigation.
39. As a visitor at supported desktop widths, I want the stage and columns to remain inside the viewport without horizontal overflow, so that the sideways visual motion never becomes actual page overflow.
40. As a visitor resizing the browser across the enhancement breakpoint, I want the page to reset cleanly between animated and static layouts, so that stale transforms, widths, or interaction states do not remain.
41. As a visitor, I want the posters to remain static images until I activate one, so that the hero does not autoplay five videos or load embedded players.
42. As a maintainer, I want the hero to consume the canonical ordered featured-video collection, so that poster metadata and destinations are not duplicated in presentation code.
43. As a maintainer, I want all five canonical featured-video items rendered in the hero, so that a presentation-only item limit cannot silently omit posters 4 and 5.
44. As a maintainer, I want one scroll controller to own the complete choreography, so that panel widths, directions, visibility, and sticky release cannot drift between independent listeners.
45. As a maintainer, I want the current two-element reveal replaced cleanly, so that obsolete clipping and progress logic do not remain as a competing implementation path.

## Implementation Decisions

### Content and data

- Preserve the current OMARCHY primary panel as the opening state, including its wordmark, descriptor, promise, detail, ISO action, and Manual action.
- Render all five entries from the canonical featured-video collection. Remove the current three-item hero limit rather than duplicating or separately configuring posters 4 and 5.
- Continue using the existing 1280×720 WebP posters and existing YouTube destinations. Do not add local video files, players, iframes, autoplay, playback controls, or third-party runtime requests.
- Keep each poster as one same-tab link. The poster image, overlay text, and decorative play treatment are one click target.
- Retain the existing descriptive accessible label and image alternative text derived from title and creator. Decorative play artwork remains hidden from assistive technology.
- Keep the **View all** destination pointed at the existing Featured videos collection.

### Enhanced desktop choreography

- Progressive enhancement remains limited to viewports at or above the existing `40rem` breakpoint when `prefers-reduced-motion` is `no-preference`.
- Use one normalized scroll progress value and one controller for the entire sequence. The controller owns panel transforms, widths, opacity/visibility, focusability, breakpoint cleanup, and sticky-header coordination.
- Divide scroll progress into three logical intervals:
  1. `0%–33⅓%`: the OMARCHY primary panel exits left and fades while poster 1 enters from the right and becomes the sole full-stage poster panel.
  2. `33⅓%–66⅔%`: the panel containing posters 2 and 3 travels in from the left and settles to the left of poster 1 while poster 1 contracts to half width and shifts right.
  3. `66⅔%–100%`: the panel containing posters 4 and 5 enters from the right while the first two panels contract to three equal-width columns. The stage releases immediately at completion.
- Adjacent transitions may overlap slightly at their boundaries to avoid dead pauses, but no completed-state hold follows the third interval.
- Poster 1 shifts right during the second interval so the left-origin panel settles on its left. During the third interval poster 1 contracts into the center while the new right-origin panel settles on its right. The DOM and reading order remain canonical even though visual placement is `2–3`, `1`, `4–5`.
- Entrances are scrubbed by vertical scrolling rather than time-triggered animations. Stopping midway through a phase must leave a stable intermediate frame.
- Upward scrolling applies the exact inverse progress. No one-way classes, delayed exit timers, or snap-to-end recovery paths are permitted.
- The sticky stage remains coordinated with the existing announcement and site header until the third panel lands, then releases immediately within the hero boundary so the News section resumes normal document flow.
- The existing scroll cue continues to target the News section and must bypass the remaining pinned distance correctly when activated.

### Completed composition

- The completed stage contains three equal-width columns separated by the existing responsive hero gap.
- The left column contains posters 2 and 3 in two equal-height media cells.
- The center column occupies the full stage height. Poster 1 uses the flexible media area; **View all** is a separate control row directly below it.
- The right column contains posters 4 and 5 in two equal-height media cells.
- All poster media cells clip their images with `object-fit: cover`. Poster 1 uses an explicit `50% 50%` focal position at every animated width. Its tall final crop intentionally prioritizes the rally car even though the sun and presenter inset cannot both remain visible.
- Do not animate focal position during compression. Poster movement comes from the panel geometry, not from panning inside the image.
- Titles and creator names are always rendered over the bottom of each poster. Use the existing display type system, a dark lower gradient, a maximum of two title lines, and a compact creator line.
- Overlay text must remain legible against each current poster without adding a new color system or large opaque caption card.
- The entire cell retains its hover and focus affordance. Hover-only disclosure is prohibited.
- Reveal **View all** when the third panel lands. It must be at its final position when the stage releases and must not add another pinned interval.

### Static and responsive presentation

- Static markup is the source of truth. Before enhancement, it contains the complete OMARCHY primary panel, all five poster links, and **View all** in meaningful document order.
- Below `40rem`, render the intro first, followed by posters 1–5 as one vertical collection and then **View all**. Do not use sticky positioning, sideways entrances, clipped lists, or horizontal scrolling.
- At supported desktop widths with reduced motion, render the intro first and the completed three-column poster composition afterward in ordinary flow. Do not pin the stage or animate transforms, widths, opacity, or the call to action.
- Without JavaScript or after enhancement initialization failure, use the same complete static behavior appropriate to the viewport.
- Crossing the breakpoint or changing the motion preference must dispose the scroll controller and remove every inline style and animation-only state before the static layout becomes active.
- Re-entering the enhancement query may initialize one fresh controller from the current document scroll position. Multiple controllers must never coexist.

### Accessibility and interaction state

- Only visible controls participate in pointer interaction and sequential keyboard focus during the enhanced sequence. Panels that have not entered or have fully exited must be hidden from hit testing and focus without removing their semantic static markup.
- The implementation must not leave the active element hidden if reverse scrolling removes its panel. Focus-state cleanup must be explicit and must return the page to a visible, meaningful focus target.
- The completed state exposes poster links in canonical order followed by **View all**. Visual grid placement must not change reading order.
- Preserve a visible focus indicator above poster artwork, overlays, and gradients.
- Do not communicate the current stage through motion or opacity alone when that state affects interaction. Visibility and focusability must agree with what is visibly present.
- The enhanced stage must not introduce horizontal document overflow at any tested viewport or intermediate progress value.

### Clean cutover

- Replace the current two-panel reveal and clipped three-poster viewport. Do not keep the old reveal as an alternate desktop mode.
- Remove presentation assumptions that the hero has only one secondary panel or only three featured-video entries.
- Reuse the existing scroll-motion library, responsive breakpoint, featured-video data, poster assets, header coordination, and Featured videos destination. Add no dependency.
- Keep unrelated homepage copy, the winding-road background, the News section, global navigation, and the standalone Featured videos page unchanged.

## Testing Decisions

The highest and preferred seam is the production-built homepage exercised in real Chromium through the existing rendered-site verifier. Extend that verifier with one focused hero-choreography scenario rather than creating unit tests for progress arithmetic, CSS declarations, or private controller helpers. The observable contract spans rendered markup, compiled styles, real scroll geometry, media-query behavior, focusability, and sticky release; lower seams would duplicate implementation details without proving the experience works.

A good test asserts what a visitor can observe: which panel is visible, where it entered from, its bounding geometry, whether links can receive focus, whether scrolling reverses the state, and whether normal document flow resumes. It must not assert source strings, internal variable names, exact transform serialization, or private function calls.

### Browser verification

- At `1440×900` with normal motion, confirm the initial viewport contains the OMARCHY primary panel and its ISO and Manual actions while all poster panels are off-stage and excluded from sequential focus.
- Scroll through the first interval and sample an intermediate frame to prove poster 1 moves from the right while the primary panel moves left. At the first milestone, confirm poster 1 is the sole visible media panel and occupies the full stage width.
- Scroll through the second interval and sample an intermediate frame to prove the posters 2–3 panel moves left-to-right from outside the stage while poster 1 contracts and shifts right. At the second milestone, confirm equal half-width columns with posters 2–3 on the left and poster 1 on the right.
- Scroll through the third interval and sample an intermediate frame to prove the posters 4–5 panel moves in from the right. At the third milestone, confirm three equal-width columns in the visual order `2–3`, `1`, `4–5`.
- At the completed milestone, confirm the left and right stacked cells are equal height, poster 1 occupies the center column above **View all**, all five overlays are visible, and long titles occupy no more than two lines.
- Confirm poster 1 uses a stable centered crop before, during, and after compression. Geometry changes must not change its effective focal position.
- Sample late points in the final third and confirm the first two columns continue compressing and the right panel continues entering while the stage remains pinned.
- Cross the end boundary and confirm the completed composition releases immediately into ordinary News flow without an unchanged pinned interval.
- Scroll backward through every milestone and confirm the direction, dimensions, visibility, and focusability reverse without jumps. The OMARCHY primary panel must be fully restored at progress zero.
- Activate the existing scroll cue from the opening state and confirm focus/scroll reaches the News section without trapping the viewport in an intermediate animation state.
- Confirm each poster cell exposes the canonical YouTube URL, navigates in the same tab, and has one descriptive accessible name. Confirm **View all** exposes the existing Featured videos route.
- Confirm off-stage links cannot be clicked or reached by Tab, while every visible poster and **View all** has a visible focus indicator.
- Confirm the homepage has no horizontal overflow at the beginning, at each intermediate sample, at each milestone, and after release.
- Repeat the desktop choreography geometry checks at `768×1024`, the smallest existing rendered-site viewport above the enhancement breakpoint.

### Static fallback verification

- At `390×844`, confirm the OMARCHY intro, posters 1–5, and **View all** appear in that document order with no sticky stage, clipping, sideways transforms, or horizontal overflow.
- At `1440×900` with reduced motion emulated before navigation, confirm the intro and completed three-column poster layout both render in ordinary flow; no scroll-driven transforms or sticky hold occur.
- At `390×844` with reduced motion, confirm the same one-column flow as the ordinary mobile layout.
- With JavaScript disabled, verify the complete intro and all five poster links remain visible and usable at both a mobile and desktop viewport.
- Change the viewport across `40rem` after initialization and confirm stale inline widths, transforms, visibility states, and body animation state are removed before the static layout appears.
- Change the emulated motion preference where the harness permits and confirm only one enhancement controller is active after each transition.

### Regression and visual checks

- Keep the existing production build, route, broken-image, asset, JavaScript-budget, and rendered-site checks passing.
- Confirm no iframe, video element, remote player script, or new media request is introduced before a visitor activates a poster link.
- Confirm the Featured videos destination still renders its complete collection independently of the hero redesign.
- Perform browser review at `1440×900`, `768×1024`, and `390×844`. Review entry direction, continuous compression, poster crop, overlay readability, focus visibility, immediate release timing, and the transition into News against the actual rendered surface.
- Treat final visual review as a required acceptance step because element geometry alone cannot prove that baked-in thumbnail text and the new title overlays remain legible together.

## Out of Scope

- Playing videos inside the homepage hero.
- Adding YouTube embeds, local MP4/WebM files, autoplay, mute controls, playback controls, consent UI, or video analytics.
- Changing the five featured-video titles, creators, order, posters, or YouTube destinations.
- Changing the standalone Featured videos page or creating another media destination.
- Rewriting the OMARCHY descriptor, promise, detail, ISO action, or Manual action.
- Changing the winding-road background, site header, announcement behavior beyond required sticky-stage coordination, News content, or later homepage sections.
- Adding swipe, drag, scroll snapping, or actual horizontal page scrolling.
- Reproducing the three-column choreography on narrow screens or for reduced-motion users.
- Making poster metadata hover-only.
- Opening poster links in new tabs.
- Introducing new breakpoints, animation dependencies, poster derivatives, or a second choreography controller.
- Preserving the old clipped three-poster panel as an alternate mode.

## Further Notes

- The current hero is a vertical-scroll scrub that creates sideways visual motion; it is not an actual horizontal scroller. Preserve that interaction model.
- All five current media assets are poster images. “Video” in the requested layout refers to the featured-video entry represented by its poster and YouTube link.
- Poster 1 cannot preserve the rally car, sun, and DHH inset in the requested tall first-column crop. The approved focal position is exactly `50%` horizontally, with the rally car as the intentional subject.
- Posters 2 and 3 are visually safest near their centered source composition. Posters 4 and 5 contain split subjects and baked-in text, so final browser review must validate their crop and overlay readability rather than assuming a generic center crop is sufficient.
- There is no project domain glossary or relevant ADR defining alternate vocabulary for this area. This spec therefore uses the existing codebase terms: homepage hero, primary panel, featured videos, poster, and News section.
