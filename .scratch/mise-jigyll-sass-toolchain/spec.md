# Pin Jigyll and Dart Sass with mise

Status: ready-for-agent

## Problem Statement

The repository does not own the Jigyll version that renders and serves the site. Repository commands resolve whichever `jigyll` executable happens to be first on `PATH`, so two contributors can run different renderers against the same commit.

Dart Sass is pinned, but through `sass-embedded` in the npm dependency graph. Development therefore runs a standalone npm-managed Sass watcher beside Jigyll even though Jigyll can compile Sass itself when a compatible `sass` executable is available on `PATH`. This duplicates compiler orchestration, requires a custom two-process supervisor, and keeps the stylesheet source outside Jigyll’s native Sass layout.

The toolchain should have one project-owned source of truth. Mise can install released Jigyll and Dart Sass artifacts at exact versions, expose both inside one command environment, and let Jigyll use the pinned Sass executable for development and production rendering. npm remains necessary for the JavaScript, Pagefind, font, and deployment tools, but it should no longer own Sass.

## Solution

Add a project-scoped mise toolchain that pins `github:reidransom/jigyll` at `1.8.3` and `github:sass/dart-sass` at `1.103.1`. Commit the corresponding mise lockfile so release URLs and checksums are reproducible. Repository-owned commands run Jigyll through `mise exec --`; this places both pinned tools on `PATH`, so Jigyll’s native Sass renderer resolves the project’s Dart Sass rather than an ambient executable.

Move the stylesheet graph into Jigyll’s native convention. Put partials in `_sass/` and make `assets/css/site.scss` the front-matter-bearing entrypoint. Jigyll then compiles the stylesheet during `serve` and `build`, preserving `/assets/css/site.css`, compressed output, cascade layers, design tokens, breakpoints, and rendered behavior.

Remove the standalone Sass build/watch path and its process supervisor. `just serve` starts one mise-selected Jigyll process. `just build` and the production-equivalent build render CSS through the same pinned Jigyll and Dart Sass pair. Remove `sass-embedded` and its transitive platform packages from npm without changing the remaining npm-managed tools.

## User Stories

1. As a contributor, I want one `mise install` command to install the project’s Jigyll and Sass versions, so that no undocumented global compiler or renderer is required.
2. As a contributor, I want repository commands to select the project-pinned tools even when other `jigyll` or `sass` executables exist on my machine.
3. As a contributor with mise shell activation, I want `jigyll serve` to use the versions declared by this repository.
4. As a site developer, I want `just serve` to start one Jigyll process, so that development does not need a custom two-child supervisor.
5. As a site developer, I want Sass compiled during Jigyll’s initial serve render, so that the browser never receives a stale stylesheet from a prior standalone build.
6. As a site developer, I want edits to any Sass partial to update the served stylesheet and trigger the normal development reload path.
7. As a content editor, I want Jigyll to continue reloading Markdown, Liquid, HTML, YAML, and data changes.
8. As a Servd user, I want host and port forwarding plus browser reload behavior preserved with the pinned Jigyll release.
9. As a release builder, I want the complete build to use the same Jigyll and Sass versions used during development.
10. As a release builder, I want generated CSS written only under the rendered destination, so that source assets cannot become stale and generated CSS stays uncommitted.
11. As a JavaScript developer, I want esbuild to remain npm-managed and independently runnable.
12. As a search developer, I want Pagefind to remain outside the development server and refreshed by complete builds.
13. As a maintainer, I want `sass-embedded` and its platform packages removed from the npm lockfile, so that npm reflects only the tools it still owns.
14. As a maintainer upgrading Jigyll or Sass, I want one exact version declaration and one lockfile update, followed by the existing rendered-site acceptance path.
15. As a deployment operator, I want deployment setup to install the committed mise toolchain before building, so that a clean machine cannot silently use ambient tools.

## Implementation Decisions

- Add `mise.toml` at the repository root with exact declarations for `github:reidransom/jigyll = "1.8.3"` and `github:sass/dart-sass = "1.103.1"`. Use exact versions rather than `latest`, prefixes, or fuzzy selectors.
- Commit `mise.lock` with the resolved release artifacts and checksums for the supported build platform. The committed config and lockfile are the toolchain source of truth; do not repeat version numbers in shell scripts or contributor documentation.
- Use mise’s GitHub backend and released binary archives. Do not add a Go compiler or build Jigyll from source as part of this migration.
- Treat mise as the bootstrap prerequisite. Local setup runs `mise install` and `npm ci`. Normal build commands fail clearly when mise or a locked tool is unavailable rather than silently falling back to a global executable.
- Run every repository-owned Jigyll invocation inside `mise exec --`. This includes development recipes, Servd configuration, complete local builds, production-equivalent builds, and deployment paths.
- Let `mise exec --` expose the complete configured tool set. Jigyll must resolve the mise-managed `sass` executable from that environment; scripts must not invoke an ambient Sass binary.
- Keep `just serve` as the canonical development interface. It runs one `mise exec -- jigyll serve` command with the existing source, unpublished-content, host, and port behavior required by direct and Servd use.
- Remove `scripts/serve`. One Jigyll process owns serving, watching, Sass compilation, and shutdown, so a process-group supervisor no longer has a second child to coordinate.
- Move `src/css/_*.scss` to `_sass/`. Preserve module boundaries, `@use` relationships, shared breakpoint definitions, cascade layers, and runtime custom properties.
- Move the entry module to `assets/css/site.scss` and add the empty front matter Jigyll requires for Sass conversion. The compiled route remains `/assets/css/site.css`.
- Remove the obsolete source-tree `assets/css/site.css` before exercising the new pipeline. Remove its `.gitignore` entry so a stale standalone compiler output is visible rather than silently accepted. `_site/` remains ignored and owns generated build output.
- Remove `scripts/build css` and `scripts/build css --watch`. Do not retain an alias that performs a full site render while claiming to be a focused CSS build.
- Remove the `css:build` npm script. Retain the focused JavaScript and asset commands because their tool ownership does not change.
- Update `scripts/build` so content and committed-asset checks still run first, JavaScript still builds before rendering, Jigyll performs the complete render including Sass, Pagefind consumes that render, and existing production verification remains last.
- Update `just build` to build JavaScript, run the mise-selected Jigyll render including Sass, and refresh Pagefind. It must not run a separate Sass command.
- Keep npm for esbuild, Pagefind, subset-font, Motion, and deployment tooling. Remove only `sass-embedded` and dependencies no longer reachable after npm regenerates the lockfile.
- Update deployment prerequisites from ambient Jigyll to mise. A clean deployment path installs the committed mise tools, runs `npm ci`, and then uses the same production-equivalent build. This migration does not deploy, ship, or push.
- Update contributor documentation to make `mise install` plus `npm ci` the bootstrap path, distinguish mise-owned Jigyll/Sass from npm-owned browser tooling, remove the focused CSS commands, and document `just serve`, direct `jigyll serve` under mise activation, focused JavaScript builds, and complete builds accurately.
- Preserve the browser-facing stylesheet URL, minification, 40 KiB compressed budget, visual system, responsive behavior, accessibility behavior, and production verification contracts.
- Make upgrades explicit: change the exact entry in `mise.toml`, refresh `mise.lock`, install the new tools, and run the complete acceptance path. Never float versions during ordinary setup or builds.

## Testing Decisions

- Prove bootstrap behavior from a state with neither project tool installed: `mise install` succeeds from the committed files, `mise exec -- jigyll --version` resolves the pinned Jigyll release, and `mise exec -- sass --version` reports `1.103.1`.
- Prove tool isolation with conflicting ambient executables earlier on the original `PATH`. Repository-owned commands must still resolve the mise-installed Jigyll and Sass paths and versions.
- Run `npm ci` from a clean `node_modules/` state and confirm the JavaScript, Pagefind, font, and asset commands remain available while `sass-embedded` and its platform packages are absent from the installed and locked npm graph.
- Exercise an actual non-interactive `just serve` scenario. Wait for Jigyll readiness, request `/assets/css/site.css`, and confirm the response is current, compressed CSS produced from `assets/css/site.scss` and `_sass/`.
- During that serve scenario, change an imported Sass partial temporarily and observe the served stylesheet update. Change a content source separately and observe the served page update.
- Exercise the Servd path with its assigned host and port. Verify page delivery and browser reload behavior through the reverse proxy, not only direct localhost serving.
- Confirm development starts exactly one Jigyll process and no standalone Sass, JavaScript, or Pagefind process. Stop and restart it and confirm no old process remains.
- Build from clean `_site/` and no source-tree `assets/css/site.css`. Confirm Jigyll writes `_site/assets/css/site.css`, templates still reference `/assets/css/site.css`, and no generated stylesheet appears under source `assets/`.
- Run the focused JavaScript build independently. Its bundle must still be created without requiring a Sass build interface.
- Run `just build` and confirm it refreshes JavaScript, the complete Jigyll render including CSS, and Pagefind.
- Run the production-equivalent `scripts/build` path unchanged at its acceptance seam. Existing content, asset, route, metadata, landmark, network, compressed-budget, overflow, navigation, search, focus, reduced-motion, image, roster, and page-error checks must pass against native Jigyll Sass output.
- Exercise the deployment build preparation without publishing: install mise tools in a clean environment, run `npm ci`, and run the configured production build. Do not call Cloudflare or alter branches.
- Do not add permanent tests for TOML text, shell command spelling, Sass module locations, or package names. Tool resolution, process shape, generated output, served behavior, and the existing browser verifier are the observable contracts.

## Acceptance Risks

- The currently installed development binary identifies as `v1.8.3-10-g7bb2706`, ten commits after the pinned `1.8.3` release, and those commits include LiveReload changes. The Servd reverse-proxy smoke is therefore a release-compatibility gate. A regression blocks completion; do not fall back to the ambient development binary or float to `latest`. If `1.8.3` cannot satisfy the contract, select a specific released replacement, update this specification’s pin, and regenerate the lockfile before merging implementation.
- Jigyll requires front matter on the emitted Sass entrypoint and resolves partials from `_sass/`. A successful standalone Sass invocation does not prove the native Jigyll graph is correct.
- Existing ignored `assets/css/site.css` files may survive in older working trees. The implementation must remove the local artifact during cutover and make future source-tree outputs visible to Git.
- `mise install` alone does not guarantee an arbitrary parent shell has mise activation. Repository-owned automation must use `mise exec --`; documentation may describe direct `jigyll serve` only for shells where mise activation is already present.

## Out of Scope

- Removing npm or moving esbuild, Pagefind, subset-font, Motion, or Wrangler to mise.
- Changing JavaScript compilation, Pagefind behavior, asset provenance checks, or deployment topology.
- Redesigning the stylesheet, changing cascade layers, converting runtime custom properties to Sass variables, or changing responsive breakpoints.
- Changing the stylesheet URL, compressed budget, browser support, or rendered-site behavior.
- Adding a general task runner abstraction on top of mise and Just.
- Building Jigyll from source or adding Go to the project toolchain.
- Supporting both native Jigyll Sass and the standalone npm Sass pipeline.
- Retaining compatibility aliases for `scripts/build css`, `scripts/serve`, or `npm run css:build`.
- Deploying, shipping, pushing, or changing Git history.

## Further Notes

- Mise currently resolves both requested GitHub backends and lists Jigyll `1.8.3` and Dart Sass `1.103.1` as available releases.
- Jigyll’s native Sass renderer always emits minified CSS and uses the Dart Sass executable found on `PATH`. Running Jigyll inside the complete mise environment is what joins the two exact tool pins.
- The migration intentionally changes the focused CSS workflow. CSS-only iteration happens through the resident native compiler in `jigyll serve`; production acceptance happens through the complete Jigyll render. JavaScript remains independently buildable because Jigyll does not own it.
