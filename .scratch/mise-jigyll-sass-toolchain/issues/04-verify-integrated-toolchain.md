# Verify the integrated mise toolchain

Type: task
Status: claimed
Blocked by: 03

## Context

Integrate and prove the complete behavior in [the mise toolchain specification](../spec.md). Read the answers and commits for tickets 01–03 before changing code.

## Ownership

All repository files may be corrected when an acceptance failure exposes a specification violation. Do not add abstractions or unrelated cleanup.

## Acceptance

- From a clean project-tool state, `mise install` selects the exact locked Jigyll and Dart Sass releases; conflicting ambient executables cannot replace them in repository commands.
- A clean `npm ci` retains required npm tools and contains no npm-managed Sass implementation or unreachable Sass platform packages.
- An actual non-interactive `just serve` starts one Jigyll process, serves current compressed CSS, rebuilds an imported Sass edit, reloads a content edit, and starts no standalone Sass, JavaScript, or Pagefind process.
- Servd host/port forwarding and browser reload work through its reverse proxy with the pinned Jigyll release. Any `1.8.3` compatibility failure follows the release-selection rule in the spec rather than using an ambient or floating binary.
- Stop and restart leave exactly one current Jigyll process and no obsolete child process.
- A clean render writes CSS only to `_site/assets/css/site.css` while preserving `/assets/css/site.css` in templates and responses.
- The focused JavaScript and asset commands remain usable.
- `just build` refreshes JavaScript, native Jigyll CSS/pages, and Pagefind.
- The production-equivalent `scripts/build` passes existing content, asset, route, metadata, landmark, network, compressed-budget, overflow, navigation, search, focus, reduced-motion, image, roster, and page-error verification.
- Deployment preparation is exercised without publishing, branch mutation, or Cloudflare calls.
- Generated CSS remains uncommitted. Documentation matches verified behavior.
- Commit any integration fixes and append an evidence-based answer. Do not add timing assertions or unrelated work.
