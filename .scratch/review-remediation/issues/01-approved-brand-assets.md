# Restore approved Omarchy identity assets

Status: ready-for-agent

## Problem

The footer renders a `[mark]` placeholder, while the favicon and social-card treatment recreate identity assets rather than use approved artwork. The navigation also visually turns ordinary prose into a substitute display wordmark.

## Supplied-asset decision

The user has already added the favicon and Open Graph artwork from the original first-party Omarchy site. Retain those supplied assets; validate and manifest their provenance during implementation rather than replacing or regenerating them.

## Scope

- Replace every placeholder or recreated compact mark with the cleared supplied compact artwork.
- Use the approved static social wordmark and canonical descriptor for share metadata.
- Keep the full block wordmark only in its approved homepage/fallback treatment.
- Render ordinary navigation prose as `Omarchy`, not as a substitute display wordmark.
- Record every newly rendered local identity asset in the asset manifest with its provenance and clearance.

## Acceptance Criteria

- The footer contains a Green compact mark with an accessible name of “Omarchy,” never placeholder text.
- The favicon is the approved compact mark and contains no recreated geometry or unapproved gradient.
- The social share surface uses approved static artwork and the canonical homepage descriptor.
- No arbitrary all-caps text treatment is presented as the Omarchy display wordmark.
- Rendered asset verification accepts all identity media and catches an absent or uncleared mark.

## References

- Review findings: Standards 1–4; Spec 8.
- Authority: brand logo-system and color rules; implementation plan asset and metadata gates.
