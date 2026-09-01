# omaweb

Jigyll site for [Omarchy](https://omaweb.r2ware.dev/).

## Build and review

This site is built with [`jigyll`](https://github.com/reidransom/jigyll), the Go implementation of Jekyll. Bootstrap the locked local toolchain and npm dependencies first:

```sh
mise install
npm ci
```

Mise owns the exact Jigyll and Dart Sass releases declared by this repository. npm continues to own the browser and build tools, including esbuild, Pagefind, subset-font, Motion, and Wrangler.

Use the focused commands when iterating, and choose the smallest command that covers the work:

```sh
npm run assets         # rebuild committed generated image derivatives
npm run assets:check   # reproduce those derivatives byte-for-byte
scripts/build css      # compile the stylesheet once with mise-managed Sass
scripts/build css --watch # watch and compile the stylesheet with mise-managed Sass
scripts/build js       # compile the JavaScript bundle once
mise run serve         # watch Sass and serve Jigyll pages; skips JavaScript and Pagefind
mise run build         # compile CSS and JavaScript, render Jigyll, and refresh Pagefind
scripts/build          # run the production-equivalent build and verification path
```

`scripts/build` checks source content and asset clearance, verifies deterministic image derivatives, builds compressed CSS with mise-selected Dart Sass, builds JavaScript, renders the site with mise-selected Jigyll, creates the local Pagefind index, and validates the rendered `_site` routes, metadata, landmarks, local links, network policy, and compressed CSS/JavaScript budgets.

`mise run serve` runs the two-child `scripts/serve` supervisor: one mise-managed Sass watcher writes the ignored `assets/css/site.css`, while one mise-managed Jigyll process watches and serves the site. Jigyll’s native Sass path remains unused so focused builds, watch mode, full local builds, and production builds share the same compiler and stylesheet graph.

[servd](https://github.com/reidransom/servd) uses the same supervisor through `.servd.toml`.

To upgrade Jigyll or Sass, change its exact entry in `mise.toml`, refresh `mise.lock` with `mise lock`, run `mise install`, and exercise the production-equivalent acceptance path.

Every file below `assets/images/` must have a checksum, intrinsic dimensions, provenance, and `publication_status: cleared` in `_data/assets.yml`. Do not add a remote media, font, script, or frame dependency. The sole frame exception is the disclosed Luma calendar on `/meetups/`, constrained by the document CSP to `https://luma.com`.

The local favicon and OpenGraph artwork are approved first-party assets published on omarchy.org and recorded in the asset manifest. The OpenGraph artwork is the site-wide OpenGraph and Twitter fallback; individual page images may replace it only with another cleared local asset.

The release gate requires the configured Plugin Competition Winners feature to retain its cleared, real local Radio Atlas lead image and truthful alternative text.

## Deployment

Cloudflare Pages hosts two deployments from one Pages project:

- `rev` publishes the review site at <https://omaweb-rev.r2ware.dev/>.
- `main` publishes production at <https://omaweb.r2ware.dev/>.

Configure those domains in Cloudflare before the first release. Export `PAGES_PROJECT_NAME`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` for Wrangler.

`mise run deploy` accepts only a clean `rev` or `main` worktree. It installs the committed mise toolchain, runs `npm ci`, and executes the full `scripts/build` pipeline with a temporary deployment URL configuration before invoking Wrangler, so canonical and social URLs match the selected review or production domain.

The release flow expects `main` and `rev` branches. When bootstrapping a repository that still uses `master`, rename it and create the review branch:

```sh
git branch -m main
git branch rev
```

```sh
mise run deploy  # deploy the current clean rev or main branch
mise run ship    # deploy rev, pause for review, then fast-forward and deploy main
```

`mise run ship` must start on a clean `rev` branch in an interactive terminal. It switches the worktree to `main` after approval and fast-forwards `main` to `rev`; it does not push either branch.
