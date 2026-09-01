# Cut standalone Sass and Jigyll commands over to mise

Type: task
Status: resolved
Blocked by: 01, 02

## Context

Implement the command, deployment, and contributor-interface portion of [the mise toolchain specification](../spec.md). Tickets 01 and 02 provide the pinned tools and preserved standalone stylesheet graph.

## Ownership

- `scripts/build`
- `scripts/serve`
- `scripts/deploy`
- `Justfile`
- `.servd.toml`
- `README.md`

Do not edit package metadata, mise configuration, Sass sources, templates, or verification scripts.

## Contract
- Every repository-owned Jigyll and Dart Sass invocation runs through `mise exec --`; ambient executables and npm Sass cannot replace the exact project pins.
- Restore `scripts/build css` and `scripts/build css --watch` as focused interfaces that compile `src/css/site.scss` to ignored `assets/css/site.css` with mise-managed Dart Sass.
- Keep the two-child `scripts/serve` supervisor. `just serve` and Servd each start one Sass watcher and one Jigyll process with established unpublished-content, host, port, watch, and lifecycle behavior.
- Complete builds retain content and asset checks, standalone CSS compilation, JavaScript compilation, Jigyll rendering, Pagefind, and production verification in the established order.
- Deployment installs the committed mise toolchain before the existing npm and production build path without publishing during acceptance.
- Contributor documentation accurately distinguishes mise-owned standalone Sass and Jigyll, npm-owned browser tooling, focused CSS/JavaScript/asset commands, serving, complete builds, and production-equivalent builds.
- Native Jigyll Sass is not an interface while its post-render minifier corrupts valid modern CSS.

## Acceptance

- Repository commands cannot select ambient Jigyll or Sass executables ahead of the project pins.
- Focused CSS build and watch commands invoke standalone mise-managed Dart Sass and preserve compressed output at the established ignored asset path.
- Development starts exactly one Sass watcher and one Jigyll process and no JavaScript or Pagefind process.
- Stopping or restarting development leaves no old Sass or Jigyll process.
- `just build` and `scripts/build` produce current CSS, JavaScript, rendered pages, and Pagefind output through their documented seams.
- Deployment preparation succeeds from installed mise and npm dependencies without calling Cloudflare.
- Commit only owned repository changes. Skip project-wide builds, linters, and browser tests; integration verification belongs to ticket 04.

## Answer

Routed every owned Jigyll and standalone Dart Sass invocation through `mise exec --`. Restored `scripts/build css [--watch]`, with mise-selected Dart Sass compiling the unchanged `src/css/` graph to ignored `assets/css/site.css`, and restored the two-child `scripts/serve` process-group supervisor. `just serve` and Servd use that supervisor so the Sass watcher and Jigyll server start and stop together.

Restored complete-build ordering: content and asset checks precede standalone CSS, JavaScript, mise-selected Jigyll rendering, Pagefind, and production verification. Deployment retains its clean-branch and credential gates, installs the committed mise tools before `npm ci`, and uses the same production-equivalent build before Wrangler.

Updated contributor commands to distinguish mise-owned standalone Sass and Jigyll from npm-owned browser tooling and to document focused CSS, asset, JavaScript, serve, complete-build, production-equivalent, deployment-preparation, and explicit-upgrade paths. Native Jigyll Sass remains out of scope because recorded integration evidence shows its minifier corrupting ordinary valid CSS.
