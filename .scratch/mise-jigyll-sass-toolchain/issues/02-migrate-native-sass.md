# Migrate the stylesheet graph to native Jigyll Sass

Type: task
Status: ready-for-agent
Blocked by: none

## Context

Implement the authored-stylesheet portion of [the mise toolchain specification](../spec.md). Jigyll will own Sass conversion after the command cutover.

## Ownership

- `src/css/**`
- `_sass/**`
- `assets/css/site.scss`
- `.gitignore`

Do not edit package metadata, mise configuration, shell scripts, Just recipes, Servd configuration, contributor documentation, templates, or verification scripts.

## Contract

- Move all Sass partials into Jigyll’s `_sass/` load path without changing module boundaries or emitted CSS.
- Move the entry module to `assets/css/site.scss` and add the empty front matter required by Jigyll conversion.
- Preserve `@use` relationships, cascade-layer ordering, runtime custom properties, compile-time breakpoints, minified output behavior, and the `/assets/css/site.css` route.
- Remove the obsolete source-tree generated stylesheet and make future `assets/css/site.css` files visible to Git.

## Acceptance

- Native Jigyll rendering can resolve every Sass module from the new graph.
- The rendered stylesheet is emitted at `_site/assets/css/site.css`; no generated stylesheet remains under source `assets/`.
- The stylesheet’s visitor-facing output remains within the existing visual, responsive, accessibility, and compressed-budget contracts.
- `src/css/` contains no obsolete duplicate stylesheet graph after cutover.
- Commit only owned repository changes. Skip project-wide builds, linters, and browser tests; integration verification belongs to ticket 04.
