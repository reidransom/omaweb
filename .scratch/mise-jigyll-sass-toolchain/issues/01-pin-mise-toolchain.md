# Pin Jigyll and Dart Sass with mise

Type: task
Status: ready-for-agent
Blocked by: none

## Context

Implement the project-tool installation and npm dependency portion of [the mise toolchain specification](../spec.md).

## Ownership

- `mise.toml`
- `mise.lock`
- `package.json`
- `package-lock.json`

Do not edit Sass sources, build or serve commands, deployment scripts, Just recipes, Servd configuration, or contributor documentation.

## Contract

- Pin `github:reidransom/jigyll` at `1.8.3` and `github:sass/dart-sass` at `1.103.1` in project configuration.
- Commit resolved release URLs and checksums in the mise lockfile.
- Remove npm ownership of Sass while retaining every npm-owned JavaScript, search, font, asset, and deployment dependency.
- Remove the obsolete focused CSS npm script; keep all unrelated npm script interfaces unchanged.

## Acceptance

- A clean `mise install` resolves both exact released tools from committed configuration and lock data.
- `mise exec -- jigyll --version` and `mise exec -- sass --version` identify the selected releases.
- A clean `npm ci` succeeds without `sass-embedded` or its now-unreachable platform packages.
- No fuzzy tool version or ambient executable fallback remains.
- Commit only owned repository changes. Skip project-wide builds, linters, and browser tests; integration verification belongs to ticket 04.
