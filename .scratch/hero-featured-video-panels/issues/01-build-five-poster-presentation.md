# Build the five-poster hero presentation

Status: resolved
Type: task
Blocked by:

## Scope

Implement the markup and Sass presentation portion of `.scratch/hero-featured-video-panels/spec.md`.

- Render all five canonical featured-video entries without duplicating their data.
- Preserve the OMARCHY primary panel as the static opening content.
- Replace the clipped video list with three media columns: poster 1 plus **View all**, posters 2–3, and posters 4–5.
- Render always-visible title and creator overlays on every poster.
- Provide the complete mobile, reduced-motion, no-JavaScript, and failed-enhancement layouts in ordinary flow.
- Provide enhanced-state styling hooks for the scroll controller without implementing scroll progress in this ticket.
- Preserve accessible names, image alternatives, decorative play treatment, same-tab links, and the Featured videos destination.

Use this shared DOM contract:

- Hero root: `[data-home-hero]`
- Sticky stage: `[data-home-hero-stage]`
- Primary panel: `[data-home-hero-primary]`
- Media composition: `[data-home-hero-media]`
- Media columns: `[data-home-hero-column="1"]`, `[data-home-hero-column="2"]`, and `[data-home-hero-column="3"]`
- Poster links: `[data-home-hero-poster]`
- View-all link: `[data-home-hero-view-all]`
- JavaScript enhancement state: `data-home-hero-enhanced` on the hero root

Do not edit the scroll controller, browser verifier, featured-video data, poster assets, standalone Featured videos page, homepage copy, header, News section, or dependencies.

## Acceptance

The unenhanced homepage renders the complete intro and five-poster collection in accessible document order. Static desktop uses the final three-column composition after the intro; mobile uses one column. The enhanced-state CSS can represent the specified opening and final states through the shared DOM contract without horizontal document overflow.

## Answer

- `_includes/sections/home-hero.html` now iterates the canonical featured-video collection once, groups posters 1 / 2–3 / 4–5 under the shared column selectors, keeps all five poster links ahead of **View all** in document order, and preserves link labels, image alternatives, same-tab destinations, and decorative play artwork.
- `_sass/_home.scss` replaces the clipped three-item viewport with always-visible gradient overlays, a one-column static mobile flow, an ordinary-flow three-column desktop composition, the centered `50% 50%` poster crop, visible focus treatment, and enhancement-scoped sticky/off-stage geometry. Without `data-home-hero-enhanced`, no sticky or sideways presentation applies.
