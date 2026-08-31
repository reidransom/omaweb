# Enforce rendered-site acceptance across required viewports

Status: ready-for-agent

## Problem

The current implementation reached a locally served state while several binding rendered-site contracts remained broken: Desktop overflow, absent current proof media, missing featured lead media, omitted homepage action, and missing build commands. Source-only checks did not provide sufficient release evidence.

## Scope

- Strengthen the production verification seam to validate rendered routes, page-level landmarks, authoritative action completeness, cleared rendered media, featured News media, pagination partitioning, and viewport overflow.
- Run real Chromium checks at 390×844, 768×1024, and 1440×900 for the homepage and required representative archetypes.
- Preserve checks for the fixed Winding Road scene, header transition, drawer focus behavior, no-JavaScript navigation, and reduced-motion wordmark.
- Keep deployment and shipping behavior unchanged; verification prepares a reviewable site but never deploys or pushes.

## Acceptance Criteria

- Production verification fails with an actionable error for each reviewed regression class.
- Required browser routes have one page-level `h1`, header/main/footer landmarks, no horizontal overflow, and correct responsive media behavior.
- The homepage’s three reveal beats, mobile drawer, no-JavaScript fallback, and static reduced-motion wordmark remain demonstrably correct.
- The complete production pipeline passes only after the functional remediation tickets are satisfied.

## References

- Browser review and implementation-plan final acceptance matrix.
