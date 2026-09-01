# Supervise the development server

Type: task
Status: ready-for-agent
Blocked by: none

## Context

Implement the development-command and contributor-documentation portion of [the Dart Sass specification](../spec.md). The compiler ticket preserves `scripts/build css [--watch]` and `scripts/build js`.

## Ownership

- `scripts/serve`
- `Justfile`
- `README.md`

Do not edit package metadata, stylesheets, templates, or verification scripts.

## Contract

- `just serve` starts exactly `scripts/build css --watch` and Jigyll serve.
- `just build` remains the explicit complete local rebuild: CSS, JavaScript, full Jigyll render, and Pagefind.
- The supervisor must not depend on stdin remaining open.

## Acceptance

- The supervisor terminates every child on normal exit and HUP/INT/TERM.
- If either child exits unexpectedly, the other is terminated and the command returns the failing child status.
- Restarting cannot leave duplicate Sass or Jigyll processes.
- JavaScript and Pagefind are absent from development startup and watch behavior; the focused JavaScript command remains documented.
- Contributor docs distinguish `just serve`, focused asset builds, `just build`, and the production-equivalent `scripts/build` path.
- Commit only repository changes. Skip project-wide builds, linters, and tests; integration verification belongs to ticket 04.
