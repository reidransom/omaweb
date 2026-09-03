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
scripts/build js       # compile the JavaScript bundle once
mise run serve         # watch and serve Jigyll pages with the existing development Pagefind index
mise run build         # compile, render, and manually refresh the development Pagefind index
scripts/build          # build a fresh production artifact
```

`scripts/build` builds JavaScript, renders the site and its compressed stylesheet with mise-selected Jigyll and Dart Sass, and replaces the copied development index with a fresh `_site/pagefind` production index.

`mise run serve` runs Jigyll directly. Jigyll watches pages and the native Sass graph under `_sass/`, compiles `assets/css/site.scss`, and serves the existing source-root `pagefind/` directory at `/pagefind/`. Watch mode does not regenerate the search index. Run `mise run build` before starting or restarting the server when searchable content changes.

[servd](https://github.com/reidransom/servd) runs the same mise-selected Jigyll server through `.servd.toml`.

To upgrade Jigyll or Sass, change its exact entry in `mise.toml`, refresh `mise.lock` with `mise lock`, run `mise install`, and exercise the production-equivalent acceptance path.

Asset sources are discovered from the supported source trees and `npm run assets` generates their committed derivatives; `npm run assets:check` verifies the complete generated inventory byte-for-byte. Do not add a remote media, font, script, or frame dependency. The sole frame exception is the disclosed Luma calendar on `/meetups/`, constrained by the document CSP to `https://luma.com`.

The local favicon and OpenGraph artwork are required local assets. The OpenGraph artwork is the site-wide OpenGraph and Twitter fallback; individual page images may replace it only with another local asset.

The release gate requires the configured Plugin Competition Winners feature to retain its real local Radio Atlas lead image and truthful alternative text.

## Deployment

Cloudflare Pages hosts two deployments from one Pages project:

- `rev` publishes the review site at <https://omaweb-rev.r2ware.dev/>.
- `main` publishes production at <https://omaweb.r2ware.dev/>.

Configure those domains in Cloudflare before the first release. Export `PAGES_PROJECT_NAME`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` for Wrangler.

`mise run deploy` accepts only a clean `rev` or `main` worktree. It installs the committed mise toolchain, runs `npm ci`, builds the site with a temporary deployment URL configuration, and copies `_site` to Cloudflare with Wrangler. It does not run source, asset, rendered-site, or browser verification.

The release flow expects `main` and `rev` branches. When bootstrapping a repository that still uses `master`, rename it and create the review branch:

```sh
git branch -m main
git branch rev
```

```sh
mise run deploy  # build and deploy the current clean rev or main branch
mise run ship    # build, verify, and deploy the current clean rev or main branch
```

`mise run ship` builds the current deployment artifact, verifies source content, deterministic assets, and rendered output, then copies the verified build to Cloudflare. It does not check out, merge, fast-forward, or otherwise modify branches.
