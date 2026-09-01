# Pin Jigyll and standalone Dart Sass with mise

Status: ready-for-agent

## Problem Statement

The repository does not own the Jigyll version that renders and serves the site. Repository commands resolve whichever `jigyll` executable happens to be first on `PATH`, so two contributors can run different renderers against the same commit.

Dart Sass is pinned through `sass-embedded` in the npm dependency graph. Development runs a standalone npm-managed Sass watcher beside Jigyll and requires a custom two-process supervisor. The project should instead source both executables from exact mise pins while npm remains responsible only for JavaScript, Pagefind, font, asset, and deployment tools.

Jigyll’s native Sass path cannot safely replace the standalone compiler. Jigyll 1.8.3 post-processes Dart Sass output with `github.com/tdewolff/minify`, which corrupts valid modern CSS by removing semantically required whitespace. The currently unreleased Jigyll build exhibits the same selector corruption, so broad source workarounds would violate the existing ordinary-CSS and no-redesign contracts.

## Solution

Add a project-scoped mise toolchain that pins `github:reidransom/jigyll` at `1.8.3` and `github:sass/dart-sass` at `1.103.1`. Commit the corresponding mise lockfile so release URLs and checksums are reproducible. Every repository-owned Jigyll and Sass invocation runs through `mise exec --`, preventing ambient executables from replacing either project tool.

Keep the authored stylesheet graph in `src/css/`. The focused `scripts/build css [--watch]` seam invokes mise-managed Dart Sass and writes compressed CSS to the ignored `assets/css/site.css`; Jigyll serves and copies that generated asset without processing Sass. This preserves ordinary Sass/CSS semantics and the browser-facing `/assets/css/site.css` route.

Keep the two-child `scripts/serve` supervisor so one pinned Sass watcher and one pinned Jigyll process share lifecycle handling. Complete builds compile CSS before Jigyll rendering. Remove `sass-embedded` and its transitive platform packages from npm without changing the remaining npm-managed tools.

## User Stories

1. As a contributor, I want one `mise install` command to install the project’s Jigyll and Sass versions, so that no undocumented global compiler or renderer is required.
2. As a contributor, I want repository commands to select the project-pinned tools even when other `jigyll` or `sass` executables exist on my machine.
3. As a site developer, I want `scripts/build css` to compile the stylesheet independently with the pinned Dart Sass release.
4. As a site developer, I want `scripts/build css --watch` to rebuild imported Sass changes without requiring a complete site render.
5. As a site developer, I want `just serve` to supervise the Sass watcher and Jigyll server together so shutdown does not leave obsolete children.
6. As a content editor, I want Jigyll to continue reloading Markdown, Liquid, HTML, YAML, and data changes.
7. As a Servd user, I want host and port forwarding plus browser reload behavior preserved with the pinned Jigyll release.
8. As a release builder, I want complete builds to use the same exact Jigyll and Sass versions used during development.
9. As a release builder, I want generated CSS kept uncommitted while remaining available to Jigyll at `/assets/css/site.css`.
10. As a JavaScript developer, I want esbuild to remain npm-managed and independently runnable.
11. As a search developer, I want Pagefind to remain outside the development server and refreshed by complete builds.
12. As a maintainer, I want `sass-embedded` and its platform packages removed from the npm lockfile, so npm reflects only the tools it still owns.
13. As a maintainer upgrading Jigyll or Sass, I want one exact version declaration and one lockfile update, followed by the existing rendered-site acceptance path.
14. As a deployment operator, I want deployment setup to install the committed mise toolchain before building, so that a clean machine cannot silently use ambient tools.
15. As a site visitor, I want the established valid CSS preserved rather than rewritten around a renderer-specific minifier defect.

## Implementation Decisions

- Add `mise.toml` at the repository root with exact declarations for `github:reidransom/jigyll = "1.8.3"` and `github:sass/dart-sass = "1.103.1"`. Use exact versions rather than `latest`, prefixes, or fuzzy selectors.
- Commit `mise.lock` with the resolved release artifacts and checksums for the supported build platform. The committed config and lockfile are the toolchain source of truth; do not repeat version numbers in shell scripts or contributor documentation.
- Use mise’s GitHub backend and released binary archives. Do not add a Go compiler or build Jigyll from source as part of this migration.
- Treat mise as the bootstrap prerequisite. Local setup runs `mise install` and `npm ci`. Normal build commands fail clearly when mise or a locked tool is unavailable rather than silently falling back to a global executable.
- Run every repository-owned Jigyll and Dart Sass invocation inside `mise exec --`. This includes focused CSS builds, the Sass watcher, development recipes, Servd, complete local builds, production-equivalent builds, and deployment paths.
- Keep all Sass sources in `src/css/`. Preserve module boundaries, `@use` relationships, shared breakpoint definitions, cascade layers, runtime custom properties, and ordinary valid CSS syntax.
- Keep `scripts/build css` and `scripts/build css --watch` as the focused stylesheet interfaces. They invoke `mise exec -- sass`, use compressed output without source maps, and write `assets/css/site.css`.
- Keep `assets/css/site.css` ignored. It is a generated source-tree asset consumed by Jigyll and copied to `_site/assets/css/site.css`; it must never be committed.
- Keep `scripts/serve` as the lifecycle boundary for development. It starts `scripts/build css --watch` and `mise exec -- jigyll serve` as separate process groups, forwards host and port arguments, and terminates both groups when either child exits or the supervisor is stopped.
- Keep `just serve` and `.servd.toml` pointed at `scripts/serve`. Development starts one Sass watcher and one Jigyll process, with no JavaScript or Pagefind watcher.
- Keep `just build` ordered as focused CSS, focused JavaScript, mise-selected Jigyll rendering, then Pagefind.
- Keep the production-equivalent `scripts/build` ordering: content and committed-asset checks, deterministic assets, standalone Sass, JavaScript, mise-selected Jigyll rendering, Pagefind, then existing production verification.
- Keep npm for esbuild, Pagefind, subset-font, Motion, and deployment tooling. Remove `sass-embedded`, its unreachable dependencies, and the obsolete npm-owned CSS script; the repository-owned focused CSS interface remains `scripts/build css`.
- Update deployment prerequisites from ambient Jigyll to mise. A clean deployment path installs the committed mise tools, runs `npm ci`, and then uses the same production-equivalent build. This migration does not deploy, ship, or push.
- Update contributor documentation to distinguish mise-owned standalone Sass and Jigyll from npm-owned browser tooling and to document focused CSS, JavaScript, serve, complete-build, and production-equivalent interfaces accurately.
- Preserve the browser-facing stylesheet URL, minification, 40 KiB compressed budget, visual system, responsive behavior, accessibility behavior, and production verification contracts.
- Make upgrades explicit: change the exact entry in `mise.toml`, refresh `mise.lock`, install the new tools, and run the complete acceptance path. Never float versions during ordinary setup or builds.

## Testing Decisions

- Prove bootstrap behavior from a state with neither project tool installed: `mise install` succeeds from the committed files, `mise exec -- jigyll --version` resolves the pinned Jigyll release, and `mise exec -- sass --version` reports `1.103.1`.
- Prove tool isolation with conflicting ambient executables earlier on the original `PATH`. Repository-owned commands must still resolve the mise-installed Jigyll and Sass paths and versions.
- Run `npm ci` from a clean `node_modules/` state and confirm the JavaScript, Pagefind, font, and asset commands remain available while `sass-embedded` and its platform packages are absent from the installed and locked npm graph.
- Run `scripts/build css` from no generated stylesheet and confirm it writes current compressed CSS only to `assets/css/site.css`.
- Run `scripts/build css --watch`, change an imported Sass partial temporarily, and observe the generated stylesheet update and return to its original output after source restoration.
- Exercise an actual non-interactive `just serve` scenario. Wait for both children, request `/assets/css/site.css`, and confirm the response is current compressed CSS generated by the standalone mise-managed Sass process.
- During that serve scenario, change an imported Sass partial temporarily and observe the served stylesheet update. Change a content source separately and observe the served page update.
- Confirm development starts one Sass watcher and one Jigyll process and no JavaScript or Pagefind process. Stop and restart it and confirm no old process remains.
- Exercise the Servd path with its assigned host and port. Verify page delivery and browser reload behavior through the reverse proxy, not only direct localhost serving.
- Build from clean `_site/` and no `assets/css/site.css`. Confirm standalone Sass creates the ignored source asset, Jigyll writes `_site/assets/css/site.css`, templates still reference `/assets/css/site.css`, and generated CSS remains uncommitted.
- Run the focused JavaScript build independently. Its bundle must still be created without requiring a CSS build.
- Run `just build` and confirm it refreshes CSS, JavaScript, the complete Jigyll render, and Pagefind in the documented order.
- Run the production-equivalent `scripts/build` path at its established acceptance seam. Existing content, asset, route, metadata, landmark, network, compressed-budget, overflow, navigation, search, focus, reduced-motion, image, roster, and page-error checks must pass against standalone Dart Sass output.
- Exercise deployment build preparation without publishing: install mise tools in a clean environment, run `npm ci`, and run the configured production build. Do not call Cloudflare or alter branches.
- Do not add permanent tests for TOML text, shell command spelling, Sass source locations, or package names. Tool resolution, process shape, generated output, served behavior, and the existing browser verifier are the observable contracts.

## Acceptance Risks

- Jigyll 1.8.3 passes expanded Dart Sass output through `github.com/tdewolff/minify` and removes semantically required whitespace. Recorded output joined descendant selectors, `border` shorthand values, multi-value margin and padding values, and transition properties with their values. The unreleased `v1.8.3-10-g7bb2706` build exhibits the same selector corruption.
- Do not encode Jigyll-specific source workarounds for each corruptible selector or declaration. The standalone Dart Sass output is the behavioral baseline until a released Jigyll version proves native Sass can preserve the complete rendered-site contract.
- The ignored `assets/css/site.css` can become stale if focused or complete build commands are bypassed. Production builds always compile CSS before Jigyll, and development uses the resident Sass watcher.
- `mise install` alone does not guarantee an arbitrary parent shell has mise activation. Repository-owned automation must use `mise exec --` for both Jigyll and Sass.
- The two-child supervisor must terminate both process groups when either child exits or development stops; otherwise a Sass watcher or Jigyll server can survive a restart.

## Out of Scope

- Native Jigyll Sass compilation until a released Jigyll version fixes the post-render minifier and passes the complete acceptance path.
- Moving the authored graph from `src/css/` to `_sass/` or adding a front-matter-bearing Sass entrypoint.
- Rewriting valid selectors, shorthands, spacing values, or transitions around Jigyll-specific minification defects.
- Removing npm or moving esbuild, Pagefind, subset-font, Motion, or Wrangler to mise.
- Changing JavaScript compilation, Pagefind behavior, asset provenance checks, or deployment topology.
- Redesigning the stylesheet, changing cascade layers, converting runtime custom properties to Sass variables, or changing responsive breakpoints.
- Changing the stylesheet URL, compressed budget, browser support, or rendered-site behavior.
- Adding a general task runner abstraction on top of mise and Just.
- Building Jigyll from source or adding Go to the project toolchain.
- Deploying, shipping, pushing, or changing Git history.

## Further Notes

- Mise resolves both requested GitHub backends and locks Jigyll `1.8.3` and Dart Sass `1.103.1` as released artifacts.
- Direct Dart Sass compilation preserves the project’s ordinary valid CSS semantics. Jigyll consumes the generated `assets/css/site.css` as a static asset and does not post-process it through the faulty native Sass minifier.
- Removing `sass-embedded` changes package ownership, not the established standalone compiler seam: `scripts/build css` now invokes the exact mise-managed `sass` executable.
- Reconsidering native Sass requires a specific released Jigyll replacement, an updated exact pin and lockfile, and the complete serve, build, browser, and production-verification acceptance path.
