# Implement reversible hero scroll choreography

Status: resolved
Type: task
Blocked by:

## Scope

Implement the JavaScript controller portion of `.scratch/hero-featured-video-panels/spec.md` against the shared DOM contract in ticket 01.

- Replace the current two-element reveal with one controller covering the primary panel, three media columns, and **View all**.
- Map normalized scroll progress to three intervals: primary replacement, left-origin second-column entrance, and right-origin third-column entrance that completes at sticky release.
- Continuously interpolate panel geometry and transforms in both scroll directions.
- Shift poster 1 right while the second column enters from the left and settles on its left; keep poster 1 centered when the third column settles on its right.
- Keep the third interval moving through the remaining pinned scroll range and release immediately when it completes.
- Synchronize visibility, pointer interaction, `inert`, and sequential focus with the visible stage.
- If a reversing transition would hide the active element, restore focus to a visible meaningful hero target without changing scroll position.
- Dispose all inline styles, interaction state, body coordination state, and listeners when leaving the enhancement media query; reinitialize exactly once when re-entering.
- Preserve the existing header/announcement animation coordination and scroll cue behavior.

Use this shared DOM contract:

- Hero root: `[data-home-hero]`
- Sticky stage: `[data-home-hero-stage]`
- Primary panel: `[data-home-hero-primary]`
- Media composition: `[data-home-hero-media]`
- Media columns: `[data-home-hero-column="1"]`, `[data-home-hero-column="2"]`, and `[data-home-hero-column="3"]`
- Poster links: `[data-home-hero-poster]`
- View-all link: `[data-home-hero-view-all]`
- JavaScript enhancement state: `data-home-hero-enhanced` on the hero root

Do not edit hero markup, Sass, browser verification, data, assets, homepage copy, or dependencies.

## Acceptance


At the existing desktop/no-reduced-motion query, one reversible scroll controller produces every milestone and releases as soon as the third panel lands. Static, reduced-motion, mobile, and failed-initialization states retain no stale enhancement styles or hidden controls. No second controller or obsolete reveal path remains.

## Answer

`src/js/home-hero.js` now uses one Motion scroll observer for the three reversible intervals. It measures the media width and responsive gap, continuously sizes and positions all three columns through the end boundary, and preserves the existing body/header coordination until immediate sticky release.

The controller synchronizes `inert`, pointer visibility, and tab stops; moves focus with `preventScroll` before hiding its active region; and restores all owned styles and interaction attributes on media-query exit or initialization failure. A `ResizeObserver`, guarded enhancement lifecycle, and module-level disposer prevent stale geometry, listeners, or duplicate controllers on resize and reentry.

## Comments

- Follow-up correction: the resolved choreography now places posters 2–3 left of poster 1 rather than crossing the left-origin panel to its right.
- Follow-up correction: the resolved choreography no longer holds the completed five-poster composition; the third entrance runs through the end boundary and downward scroll resumes immediately.
