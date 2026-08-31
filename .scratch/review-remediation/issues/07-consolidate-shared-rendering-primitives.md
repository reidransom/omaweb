# Consolidate repeated Liquid rendering primitives

Status: ready-for-agent

## Problem

Product-card lookup/rendering, Desktop action rendering, external-link handling, and product/project page shells are duplicated. The copies already disagree in data reachability and will drift further as destinations and status treatments evolve.

## Scope

- Introduce controlled shared primitives for authoritative links, desktop actions, grouped product cards, and the common product/project content shell.
- Keep route-specific composition and factual copy authored at the route level.
- Retain the existing allowed-primitives model; do not introduce an unrestricted page builder or framework abstraction.
- Remove obsolete duplicate branches and layouts after migrating every caller.

## Acceptance Criteria

- Each repeated behavior has one rendering owner and all current callers use it.
- A destination, button treatment, or product-status change needs one behavior/data change rather than parallel template edits.
- Product and project routes preserve their existing `main`, `article`, hero, status-label, and heading semantics.
- Homepage Desktop and final CTA actions remain visually and behaviorally identical after consolidation.

## References

- Review findings: Standards 6, 8, 10, and 11.
- Authority: implementation-plan controlled shared-include and clean-cutover contracts.
