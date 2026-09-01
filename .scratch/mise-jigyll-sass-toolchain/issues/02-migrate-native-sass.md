# Preserve the standalone Sass stylesheet graph

Type: task
Status: resolved
Blocked by: none

## Context

Implement the authored-stylesheet portion of [the mise toolchain specification](../spec.md). Integration evidence established that Jigyll 1.8.3’s native Sass post-render minifier corrupts valid modern CSS, so Dart Sass remains a standalone mise-managed compiler.

## Ownership

- `src/css/**`
- `assets/css/site.css`
- `.gitignore`

Do not edit package metadata, mise configuration, shell scripts, Just recipes, Servd configuration, contributor documentation, templates, or verification scripts.

## Contract

- Keep the complete Sass graph in `src/css/` without changing module boundaries or authored CSS semantics.
- Keep `src/css/site.scss` as the entry module without Jigyll front matter; do not create `_sass/` or a native Jigyll Sass entrypoint.
- Preserve `@use` relationships, cascade-layer ordering, runtime custom properties, compile-time breakpoints, minified output behavior, and the `/assets/css/site.css` route.
- Keep generated `assets/css/site.css` ignored and uncommitted so standalone Dart Sass remains its sole producer.

## Acceptance

- Standalone Dart Sass can resolve every module from `src/css/site.scss`.
- The generated stylesheet is written to `assets/css/site.css`, copied by Jigyll to `_site/assets/css/site.css`, and remains ignored at the source location.
- The stylesheet’s visitor-facing output remains within the existing visual, responsive, accessibility, ordinary-CSS, and compressed-budget contracts.
- `_sass/` and `assets/css/site.scss` contain no duplicate native Jigyll graph.
- Commit only owned repository changes. Skip project-wide builds, linters, and browser tests; integration verification belongs to ticket 04.

## Answer

Kept all nine Sass partials and the unchanged entry module in `src/css/`, preserving their filenames, `@use` relationships, cascade-layer order, and ordinary CSS semantics. Kept `assets/css/site.css` ignored as the standalone compiler’s generated output and did not retain `_sass/` or a front-matter-bearing native entrypoint. Ticket 04 recorded that Jigyll 1.8.3’s post-render minifier joins semantically required whitespace in descendant selectors, shorthands, spacing values, and transitions; avoiding the native path preserves the established stylesheet rather than encoding broad renderer-specific workarounds. Compiler invocation and rendered behavior remain assigned to tickets 03 and 04.
