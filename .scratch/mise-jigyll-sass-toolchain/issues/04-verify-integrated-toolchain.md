# Verify the integrated mise toolchain

Type: task
Status: claimed
Blocked by: 03

## Context

Integrate and prove the complete behavior in [the mise toolchain specification](../spec.md). Read the answers and commits for tickets 01–03 before changing code. Recorded integration evidence established that Jigyll 1.8.3 and the current unreleased build corrupt semantically required CSS whitespace in the native Sass path, so final acceptance retains standalone mise-managed Dart Sass and treats native Jigyll Sass as out of scope.

## Ownership

All repository files may be corrected when an acceptance failure exposes a specification violation. Do not add abstractions or unrelated cleanup.

## Acceptance

- From a clean project-tool state, `mise install` selects the exact locked Jigyll and Dart Sass releases; conflicting ambient executables cannot replace them in repository commands.
- A clean `npm ci` retains required npm tools and contains no npm-managed Sass implementation or unreachable Sass platform packages.
- `scripts/build css` and `scripts/build css --watch` use mise-managed Dart Sass, preserve the unchanged `src/css/` graph and ordinary CSS semantics, and write compressed CSS to ignored `assets/css/site.css`.
- An actual non-interactive `just serve` starts one standalone Sass watcher and one Jigyll process, serves current compressed CSS, rebuilds an imported Sass edit, reloads a content edit, and starts no JavaScript or Pagefind process.
- Servd host/port forwarding and browser reload work through its reverse proxy with the pinned Jigyll release.
- Stop and restart leave exactly one current Sass watcher and one current Jigyll process with no obsolete child process.
- A clean render creates ignored `assets/css/site.css`, copies it to `_site/assets/css/site.css`, and preserves `/assets/css/site.css` in templates and responses.
- Native Jigyll Sass, `_sass/`, and a front-matter-bearing Sass entrypoint are absent; no Jigyll-specific CSS workaround replaces valid authored semantics.
- The focused JavaScript and asset commands remain usable.
- `just build` refreshes standalone CSS, JavaScript, Jigyll pages, and Pagefind in the documented order.
- The production-equivalent `scripts/build` passes existing content, asset, route, metadata, landmark, network, compressed-budget, overflow, navigation, search, focus, reduced-motion, image, roster, and page-error verification.
- Deployment preparation is exercised without publishing, branch mutation, or Cloudflare calls.
- Generated CSS remains uncommitted. Documentation matches verified behavior and records why native Sass is out of scope.
- Commit any integration fixes and append an evidence-based answer. Do not add timing assertions or unrelated work.
