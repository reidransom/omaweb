# Cut commands over to mise-selected Jigyll

Type: task
Status: resolved
Blocked by: 01, 02

## Context

Implement the command, deployment, and contributor-interface portion of [the mise toolchain specification](../spec.md). Tickets 01 and 02 provide the pinned tools and native stylesheet graph.

## Ownership

- `scripts/build`
- `scripts/serve`
- `scripts/deploy`
- `Justfile`
- `.servd.toml`
- `README.md`

Do not edit package metadata, mise configuration, Sass sources, templates, or verification scripts.

## Contract

- Every repository-owned Jigyll invocation runs through `mise exec --` and therefore exposes the pinned Sass executable to Jigyll.
- `just serve` and Servd each start exactly one Jigyll process with current unpublished-content, host, port, watch, and on-request serving behavior.
- Remove the obsolete two-process supervisor and standalone focused CSS build/watch interfaces.
- Complete builds retain content and asset checks, JavaScript compilation, native Jigyll rendering including Sass, Pagefind, and production verification in the established order.
- Deployment installs the committed mise toolchain before the existing npm and production build path without publishing during acceptance.
- Contributor documentation accurately distinguishes mise-owned Jigyll/Sass, npm-owned browser tooling, serving, focused JavaScript/asset commands, complete builds, and production-equivalent builds.

## Acceptance

- Repository commands cannot select ambient Jigyll or Sass executables ahead of the project pins.
- Development starts no standalone Sass, JavaScript, or Pagefind process.
- Stopping or restarting development leaves no old Jigyll process.
- `just build` and `scripts/build` produce current CSS, JavaScript, rendered pages, and Pagefind output through their documented seams.
- Deployment preparation succeeds from installed mise and npm dependencies without calling Cloudflare.
- Commit only owned repository changes. Skip project-wide builds, linters, and browser tests; integration verification belongs to ticket 04.

## Answer

Cut every owned Jigyll command over to `mise exec --`, removed the standalone Sass build/watch interface and deleted the obsolete two-process `scripts/serve` supervisor. `just serve` and Servd now each launch one Jigyll process with the established source, watch, unpublished-content, host, and port behavior.

Preserved complete-build ordering: content and asset checks precede JavaScript, native Jigyll rendering (including Sass), Pagefind, and production verification. Deployment keeps its clean-branch and credential gates, installs the committed mise tools before `npm ci`, and uses the same production-equivalent build before Wrangler.

Updated contributor commands to distinguish mise-owned Jigyll/Sass from npm-owned browser tooling, document focused asset and JavaScript paths, remove focused Sass commands, and explain serving, complete builds, production-equivalent builds, deployment preparation, and explicit tool upgrades. Integration verification remains assigned to ticket 04.
