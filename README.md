# omaweb

Jigyll site for [Omarchy](https://omaweb.r2ware.dev/).

## Build

This site is built with [`jigyll`](https://github.com/reidransom/jigyll), the Go implementation of Jekyll.

```sh
jigyll build     # build to _site/
jigyll serve     # build, watch, and serve at http://127.0.0.1:4000
```

Use `just serve` for the local server. [servd](https://github.com/reidransom/servd) can also serve the repository using `.servd.toml`.

## Deployment

Cloudflare Pages hosts two deployments from one Pages project:

- `rev` publishes the review site at <https://omaweb-rev.r2ware.dev/>.
- `main` publishes production at <https://omaweb.r2ware.dev/>.

Configure those domains in Cloudflare before the first release. Export `PAGES_PROJECT_NAME`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` for Wrangler.

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
