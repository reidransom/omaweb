# omaweb

Jigyll site for [Omarchy](https://omaweb.r2ware.dev/).

## Build and review

This site is built with [`jigyll`](https://github.com/reidransom/jigyll), the Go implementation of Jekyll. Install the locked local toolchain first:

```sh
npm ci
scripts/build
```

`scripts/build` is the production-equivalent path. It checks source content and asset clearance, verifies deterministic image derivatives, builds minified CSS and JavaScript, runs Jigyll, creates the local Pagefind index, and validates the rendered `_site` routes, metadata, landmarks, local links, network policy, and compressed CSS/JavaScript budgets.

Use the focused commands when iterating:

```sh
npm run assets:check  # reproduce committed generated image derivatives byte-for-byte
npm run css:build
npm run js:build
just serve            # local rebuild, watch, and serve
```

[servd](https://github.com/reidransom/servd) can also serve the repository using `.servd.toml`.

Every file below `assets/images/` must have a checksum, intrinsic dimensions, provenance, and `publication_status: cleared` in `_data/assets.yml`. Do not add a remote media, font, script, or frame dependency. The sole frame exception is the disclosed Luma calendar on `/meetups/`, constrained by the document CSP to `https://luma.com`.

The local favicon and OpenGraph artwork are approved first-party assets published on omarchy.org and recorded in the asset manifest. The OpenGraph artwork is the site-wide OpenGraph and Twitter fallback; individual page images may replace it only with another cleared local asset.

The release gate requires the configured Plugin Competition Winners feature to retain its cleared, real local Radio Atlas lead image and truthful alternative text.

## Deployment

Cloudflare Pages hosts two deployments from one Pages project:

- `rev` publishes the review site at <https://omaweb-rev.r2ware.dev/>.
- `main` publishes production at <https://omaweb.r2ware.dev/>.

Configure those domains in Cloudflare before the first release. Export `PAGES_PROJECT_NAME`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` for Wrangler.

`just deploy` accepts only a clean `rev` or `main` worktree. It runs `npm ci` and the full `scripts/build` pipeline with a temporary deployment URL configuration before invoking Wrangler, so canonical and social URLs match the selected review or production domain.

The release flow expects `main` and `rev` branches. When bootstrapping a repository that still uses `master`, rename it and create the review branch:

```sh
git branch -m main
git branch rev
```

```sh
just deploy  # deploy the current clean rev or main branch
just ship    # deploy rev, pause for review, then fast-forward and deploy main
```

`just ship` must start on a clean `rev` branch in an interactive terminal. It switches the worktree to `main` after approval and fast-forwards `main` to `rev`; it does not push either branch.
