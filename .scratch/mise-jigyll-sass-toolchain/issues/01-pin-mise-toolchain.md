# Pin Jigyll and Dart Sass with mise

Type: task
Status: resolved
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
- Remove npm ownership of Sass while retaining every npm-owned JavaScript, search, font, asset, and deployment dependency; downstream compiler commands use the mise-managed Dart Sass executable.
- Remove the obsolete npm-owned focused CSS script without removing the repository-owned standalone CSS build/watch interface.

## Acceptance

- A clean `mise install` resolves both exact released tools from committed configuration and lock data.
- `mise exec -- jigyll --version` and `mise exec -- sass --version` identify the selected releases.
- A clean `npm ci` succeeds without `sass-embedded` or its now-unreachable platform packages.
- No fuzzy tool version or ambient executable fallback remains.
- Commit only owned repository changes. Skip project-wide builds, linters, and browser tests; integration verification belongs to ticket 04.

## Answer

Added exact project pins for Jigyll 1.8.3 and Dart Sass 1.103.1. `mise lock
--platform linux-x64` resolved each released GitHub artifact to a committed URL
and SHA-256 checksum; the Dart Sass artifact also carries verified GitHub
attestation provenance.

Removed `css:build` and `sass-embedded` from `package.json`, then regenerated
`package-lock.json` with package-lock-only mode. The resulting npm graph keeps
Motion, esbuild, Pagefind, and subset-font while dropping Sass Embedded and its
now-unreachable compiler and platform packages. This changes package ownership
only; ticket 03 retains the standalone CSS build/watch seam and routes it
through the mise-managed Dart Sass executable.

Per this ticket's verification boundary, clean installation, tool-version, and
integration checks remain assigned to ticket 04.
