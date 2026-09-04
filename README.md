# omaweb

The source for the [Omarchy](https://omaweb.r2ware.dev/) website.

## Local development and builds

Install [mise](https://mise.jdx.dev/) before bootstrapping the repository. Mise installs the exact Node, Jigyll, and Dart Sass versions locked by this repository; npm installs the browser and build tools, including esbuild, Pagefind, subset-font, Motion, and Wrangler.

```sh
mise install
mise exec -- npm ci
```

Use the smallest command that covers the change:

```sh
npm run assets         # rebuild committed generated image derivatives
npm run assets:check   # reproduce those derivatives byte-for-byte
npm run js:build       # compile the JavaScript bundle once
mise run serve         # watch and serve Jigyll pages with the existing development Pagefind index
mise run build         # compile, render, and rebuild the source-root Pagefind index
scripts/build          # build a fresh production artifact
```

`scripts/build` builds JavaScript, renders the site and stylesheet with mise-selected Jigyll and Dart Sass, and replaces the copied development index with a fresh `_site/pagefind` production index.

`mise run serve` runs Jigyll directly into the isolated `.site-dev/` directory. Jigyll watches pages and the native Sass graph under `_sass/`, compiles `assets/css/site.scss`, and serves the existing source-root `pagefind/` directory at `/pagefind/`. Watch mode does not regenerate the search index. Run `mise run build` before starting or restarting the server when searchable content changes.

[servd](https://github.com/reidransom/servd) runs the same mise-selected Jigyll server through `.servd.toml`; use `servd status` to see whether it is already serving this site.

## Local release checks

Run these checks after changes that affect source content, generated assets, or rendered output. They exercise the same source, asset, rendered-site, and Chromium checks used by `mise run ship`, without uploading a deployment:

```sh
sh scripts/check-content
npm run assets:check
scripts/build
sh scripts/verify-production
```

To upgrade Jigyll or Sass, change its exact entry in `mise.toml`, refresh `mise.lock` with `mise lock`, run `mise install`, then run the local release checks.

Asset sources are discovered from the supported source trees and `npm run assets` generates their committed derivatives; `npm run assets:check` verifies the complete generated inventory byte-for-byte. Do not add a remote media, font, script, or frame dependency. The sole frame exception is the disclosed Luma calendar on `/meetups/`, constrained by the document CSP to `https://luma.com`.

The local favicon and OpenGraph artwork are required local assets. The OpenGraph artwork is the site-wide OpenGraph and Twitter fallback; individual page images may replace it only with another local asset.

The release gate requires the configured Plugin Competition Winners feature to retain its real local Radio Atlas lead image and truthful alternative text.

## Deployment

Cloudflare Pages hosts two deployments from one Pages project:

- `rev` publishes the review site at <https://omaweb-rev.pages.dev/>.
- `main` publishes production at <https://omaweb.pages.dev/>.

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
