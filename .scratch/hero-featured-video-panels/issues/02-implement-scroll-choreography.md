# Implement reversible hero scroll choreography

Status: resolved
Type: task
Blocked by:

## Scope

Implement the JavaScript controller portion of `.scratch/hero-featured-video-panels/spec.md` against the shared DOM contract in ticket 01.

- Replace the current two-element reveal with one controller covering the primary panel, three media columns, and **View all**.
- Map normalized scroll progress to the four specified intervals: primary replacement, left-origin second-column entrance, right-origin third-column entrance, and stable final hold.
- Continuously interpolate panel geometry and transforms in both scroll directions.
- Keep poster 1 leftmost while the second column enters from the left and settles to its right.
- Keep the final quarter geometrically stable before sticky release.
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

At the existing desktop/no-reduced-motion query, one reversible scroll controller produces every milestone and the final hold from the spec. Static, reduced-motion, mobile, and failed-initialization states retain no stale enhancement styles or hidden controls. No second controller or obsolete reveal path remains.

## Answer

`src/js/home-hero.js` now uses one Motion scroll observer for the four reversible intervals. It measures the media width and responsive gap, continuously sizes and positions all three columns, holds the completed geometry for the final quarter, and preserves the existing body/header coordination through the end boundary.

The controller synchronizes `inert`, pointer visibility, and tab stops; moves focus with `preventScroll` before hiding its active region; and restores all owned styles and interaction attributes on media-query exit or initialization failure. A `ResizeObserver`, guarded enhancement lifecycle, and module-level disposer prevent stale geometry, listeners, or duplicate controllers on resize and reentry.
