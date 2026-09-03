# Remove the asset manifest

Status: ready-for-agent

## Problem Statement

`_data/assets.yml` is a 1,478-line asset provenance and publication-clearance registry. Jigyll loads it as site data, but no template or page reads `site.data.assets`. `scripts/build-assets` also ignores it; source discovery and deterministic derivative generation come from the filesystem and the generator's fixed rules.

The manifest remains mandatory only because two verification scripts parse it:

- `scripts/check-content` rejects every file below `assets/images/` unless the manifest supplies a matching checksum, dimensions, and `publication_status: cleared` record.
- `scripts/verify-production` requires four clearance and provenance records for the vendored Web Text Effects runtime.

This duplicates generated-file facts, makes routine image work require large hand-maintained records, and keeps a provenance/clearance policy the maintainer no longer wants.

## Decision

Delete `_data/assets.yml` and remove all repository checks and active workflow instructions that require asset provenance, rights clearance, publication status, or manifest registration.

Do not replace it with another manifest, sidecar metadata format, generated checksum catalog, or renamed clearance gate.

Preserve checks that establish build reproducibility, required-file presence, local delivery, runtime integrity, and visitor-observable behavior. Those checks serve different contracts and do not depend on provenance or publication approval.

This specification supersedes the asset-manifest, provenance, and publication-clearance requirements in `_plans/initial-plan.md` and previously resolved `.scratch/` specifications. Those historical files remain unchanged as records of earlier decisions.

## Resulting Contract

- `_data/assets.yml` does not exist.
- Jigyll data, templates, pages, build scripts, and production verification do not refer to an asset manifest or `publication_status`.
- Adding a source image to one of the supported `../omaweb-docs/images/{xl,lg,md,copy}` trees is sufficient for `scripts/build-assets` to discover its normal outputs.
- `scripts/build-assets --check` continues to verify the complete generated image/font inventory and byte-identical deterministic renders.
- `scripts/check-content` continues to require the configured favicon and OpenGraph files, enforce the local-media/network policy, validate content front matter, and run its unrelated content checks.
- `scripts/verify-production` continues to pin the four Web Text Effects files by path, SHA-256, and byte size; require same-origin runtime URLs; enforce bundle budgets; and run the remaining rendered-site checks.
- News image guidance continues to require semantic source placement, responsive derivative generation, useful alt text, illustration disclosure, rendered desktop/mobile checks, and scratch cleanup. It no longer asks for provenance, ownership, clearance, publication status, or manifest records.
- Existing image, font, JavaScript, and WebAssembly files are not changed merely because their registry is removed.

## Implementation Plan

### 1. Remove manifest enforcement

In `scripts/check-content`:

- Delete `manifest_entry` and `require_manifested_asset`.
- Delete the loop that applies `require_manifested_asset` to every file under `assets/images/`.
- Keep explicit existence/configuration checks for `assets/images/opengraph.png` and `assets/images/favicon.png`.
- Keep remote-source rejection, the Luma exception, front-matter validation, and all unrelated content checks unchanged.

In `scripts/verify-production`:

- Delete `require_cleared_wte_manifest_record`.
- Delete its four calls for the WTE loader, playback module, bindings, and WebAssembly file.
- Keep `require_pinned_wte_artifact` and its four calls. Exact hashes and byte sizes protect runtime integrity without asserting provenance or permission.
- Keep local import, same-origin URL, rendered wordmark, bundle-budget, and remaining production checks unchanged.

Delete `_data/assets.yml` after both consumers are removed.

### 2. Remove active policy and workflow references

Update `README.md`:

- Stop claiming that `scripts/build` checks asset clearance.
- Remove the rule requiring every image to have manifest provenance, checksums, dimensions, and `publication_status: cleared`.
- Retain the prohibition on remote media, fonts, and scripts and the documented Luma frame exception.
- Describe deterministic generation/checking as the asset maintenance contract.
- Describe the favicon and OpenGraph artwork as required local assets without approval or manifest language.

Update `.agents/skills/news-article-images/SKILL.md`:

- Remove `_data/assets.yml` from required context.
- Rename or rewrite the provenance-registration step so it only attaches the generated image family to the article.
- Remove instructions and completion criteria for provenance, rights owner, clearance, publication status, third-party marks, hashes, and manifest entries.
- Preserve source-tree selection, responsive derivative generation, frontmatter, alt text, illustrative disclosure, browser verification, and cleanup.

Update `.agents/skills/news-article-images/evals/evals.json` so its expected outputs and expectations no longer require provenance, clearance, or `_data/assets.yml`. Keep evaluation coverage for distinct story-derived artwork, correct source placement, responsive derivatives, article metadata, rendered desktop/mobile behavior, and cleanup.

Do not rewrite resolved `.scratch/` issues/specifications. They describe work completed under the previous policy. The superseding decision in this specification prevents those historical requirements from remaining authoritative.

### 3. Verify the clean cutover

Run focused checks in this order:

1. Search active implementation and contributor/workflow documentation for `_data/assets.yml`, `site.data.assets`, `publication_status`, asset-clearance requirements, and instructions to register provenance. Expected: no current dependency or instruction remains. Historical `_plans/` and resolved `.scratch/` records may still contain those terms.
2. Run `sh scripts/check-content`. Expected: content and local-network policy checks pass without opening a manifest.
3. Run `npm run assets:check`. Expected: committed generated images and fonts remain byte-identical and the generated inventory remains complete.
4. Run `scripts/build`. Expected: the complete production build and rendered-site verification pass with `_data/assets.yml` absent.
5. Confirm the change contains no modifications to files below `assets/images/`, `assets/fonts/`, or `assets/js/wte/`.

## Acceptance Criteria

1. `_data/assets.yml` is deleted and no build or runtime path attempts to read it.
2. No active repository policy, image workflow, or skill evaluation requires provenance, rights clearance, `publication_status`, or manifest registration.
3. No substitute asset registry or clearance gate is introduced.
4. Deterministic derivative inventory and byte-comparison checks still pass.
5. WTE runtime hashes, byte sizes, local imports, and same-origin delivery remain enforced.
6. Favicon and OpenGraph presence/configuration checks remain enforced.
7. The production build passes without changing any published asset bytes or rendered behavior.

## Out of Scope

- Replacing, regenerating, recompressing, renaming, or moving existing assets.
- Weakening the remote-resource policy or adding a CDN, remote font, remote image, script, module, or frame source.
- Removing deterministic asset generation, inventory checks, WTE integrity pins, image frontmatter, alt text, or illustration disclosures.
- Reassessing licenses, ownership, or publication rights.
- Rewriting resolved historical specifications and ticket answers.
- Deploying, shipping, pushing, or changing Git history.
