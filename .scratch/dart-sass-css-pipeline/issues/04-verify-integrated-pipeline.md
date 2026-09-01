# Verify the integrated Sass pipeline

Type: task
Status: claimed
Blocked by: 01, 02, 03

## Context

Integrate and prove the complete behavior in [the Dart Sass specification](../spec.md). Read `/tmp/omaweb-dart-sass/exploration.md` and `/tmp/omaweb-dart-sass/timings.md` when present, plus the commits merged for tickets 01–03.

## Ownership

All repository files may be corrected when an acceptance failure exposes a spec violation. Do not add abstractions or unrelated cleanup.

## Acceptance

- From clean generated output, the focused CSS command creates the expected minified stylesheet and the focused JavaScript command creates its bundle.
- An actual non-interactive `just serve` smoke starts Sass and Jigyll, remains alive with stdin closed, serves current CSS/content, rebuilds an imported stylesheet edit, and does not rebuild CSS for Markdown/Liquid/HTML/YAML edits.
- Development startup and edits do not invoke JavaScript or Pagefind.
- Stop/restart leaves exactly one Sass watcher and one Jigyll server; child failure stops the peer and returns failure.
- `just build` refreshes CSS, JavaScript, the complete rendered site, and Pagefind.
- The production-equivalent build and unchanged production/rendered-site verifiers pass, including route, asset, metadata, network, landmark, compressed-budget, overflow, navigation, search, focus, reduced-motion, image, roster, and page-error checks.
- Generated CSS remains ignored and uncommitted; browser-facing stylesheet URL remains unchanged.
- Commit any integration fixes. Do not add timing assertions or unrelated work.
