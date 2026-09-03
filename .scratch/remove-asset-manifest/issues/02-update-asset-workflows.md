# Update asset policy and image workflows

Type: task
Status: ready-for-agent
Blocked by: 01

## Context

Implement the documentation, skill, and evaluation cutover in [the asset-manifest removal specification](../spec.md). Ticket 01 removes the registry and its build consumers.

## Ownership

- `README.md`
- `.agents/skills/news-article-images/SKILL.md`
- `.agents/skills/news-article-images/evals/evals.json`

Do not edit build scripts, assets, templates, content, `_plans/`, or resolved `.scratch/` efforts.

## Contract

- Remove current instructions and evaluation requirements for `_data/assets.yml`, asset provenance, rights ownership, clearance, publication status, third-party marks, manifest checksums, and manifest dimensions.
- Do not introduce a replacement registry, sidecar format, or generated checksum catalog.
- Keep deterministic source discovery, derivative generation/checking, useful alt text, illustration disclosure, desktop/mobile rendered verification, and cleanup instructions.
- Keep the local-resource policy and Luma frame exception.
- Describe the favicon and OpenGraph files as required local assets without approval or clearance claims.
- Preserve valid JSON in the skill evaluation file and keep each evaluation focused on observable workflow results.

## Acceptance

- Current contributor documentation and the News image workflow no longer tell maintainers to create provenance or clearance records.
- Skill evaluations no longer reward or require the removed manifest contract.
- Documentation still identifies `npm run assets:check` and the complete production build as the relevant asset verification seams.
- Historical plans and resolved issue answers remain unchanged.
- Skip project-wide builds and browser tests; integration verification belongs to ticket 03.

## Answer
