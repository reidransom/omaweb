## Project references

For brand, visual-system, or messaging changes, read `../omaweb-docs/BRAND.md` before editing.

For substantial marketing copy, also read `../omaweb-docs/dhh-writing-style-profile.md`.

## Local development

Check `servd status` for the site being live-reloaded and served on the fly.

Use `servd which omaweb` for its path and command, or run `just serve` directly.

## Deployments

Cloudflare Pages deployment is manual. `scripts/deploy` accepts only a clean `rev` or `main` worktree: `rev` targets <https://omaweb-rev.r2ware.dev/> and `main` targets <https://omaweb.r2ware.dev/>.

Use `scripts/ship` for a release. It deploys `rev`, pauses for review, fast-forwards `main`, and deploys production. It never pushes. Run deployment, shipping, or pushes only when the user explicitly requests them.

## Copywriting

Lead with a specific fact, action, or outcome. Name the actor and avoid claims that could apply to any product, service, or business.

Use plain, active language and short sentences. Prefer concrete details, examples, numbers, and mechanisms over jargon, hype, or filler.

Write with a point of view. Vary sentence rhythm, acknowledge real tradeoffs, and make direct claims instead of sounding neutral or promotional.

## Agent skills

### Issue tracker

Issues and specs are tracked as local Markdown under `.scratch/`. See `_docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary. See `_docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain-doc layout. See `_docs/agents/domain.md`.
