# Verify the manifest-free production build

Type: task
Status: resolved
Blocked by: 01, 02

## Context

Verify the completed clean cutover defined by [the asset-manifest removal specification](../spec.md). Tickets 01 and 02 remove the manifest, its consumers, and its active workflow contract.

## Ownership

- Integration fixes required by failed acceptance checks, limited to files owned by tickets 01 and 02
- Verification evidence in this ticket's `## Answer`

Do not change assets or weaken deterministic generation, WTE integrity pins, local-resource enforcement, rendered-site checks, or bundle budgets to make verification pass.

## Contract

- Active code and workflow documentation have no manifest, provenance, clearance, rights, or publication-status dependency.
- Historical `_plans/` and resolved `.scratch/` records may retain their original language.
- The generated asset inventory remains complete and byte-identical.
- The production artifact builds and passes its existing rendered-site verification without `_data/assets.yml`.
- Published image, font, JavaScript, and WebAssembly bytes remain unchanged.

## Acceptance

1. Search active implementation, `README.md`, and `.agents/skills/news-article-images/` for `_data/assets.yml`, `site.data.assets`, `publication_status`, and asset provenance/clearance instructions; no live dependency remains.
2. Run `sh scripts/check-content` successfully.
3. Run `npm run assets:check` successfully.
4. Run `scripts/build` successfully.
5. Confirm the implementation diff does not modify files under `assets/images/`, `assets/fonts/`, or `assets/js/wte/`.
6. Record exact command outcomes and any intentionally retained historical references under `## Answer`.

## Answer

- Active implementation, `README.md`, and `.agents/skills/news-article-images/` had no live `_data/assets.yml`, `site.data.assets`, `publication_status`, provenance, or clearance dependency. Retained hits are historical `.scratch` records only; no `_plans/` directory exists.
- `sh scripts/check-content` exited 0: `Content, asset, clean-room, and local-network checks passed.`
- In the fresh verification worktree, `npm run assets:check` first exited 1 because `subset-font` was absent; after `npm ci`, it exited 0: `Asset derivatives are byte-identical.`
- `scripts/build` exited 0 and completed production and rendered Chromium checks; the local server emitted nonfatal `BrokenPipe` traces.
- `git diff --name-only 0556ed27c1ab6bb32a29f4e9b131c324af340654...HEAD -- assets/images assets/fonts assets/js/wte` produced no output: no protected asset-path changes.
- The verification worktree was clean; no source fix or implementation commit was required.
