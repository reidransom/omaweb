# Establish single ownership for destinations and product identity

Status: ready-for-agent

## Problem

The homepage action renderer cannot find Plugins because authoritative URLs are split between utility and grouped navigation. Other routes hard-code authoritative destinations, and product identity/status fields are duplicated between product and project-area data.

## Scope

- Define one authoritative registry for Manual, ISO, Plugins, Code, Discord, and Merch.
- Make grouped navigation, homepage actions, route CTAs, footer links, and no-JavaScript navigation consume that registry.
- Make each product’s label, URL, status, and external flag have one canonical owner; relationships use stable slugs.
- Replace repeated external-link conditional branches with one controlled link-rendering primitive.

## Acceptance Criteria

- Homepage actions visibly contain Manual, ISO, Plugins, and Code using their verified absolute destinations.
- Every authoritative destination is updated in one data record and renders consistently in navigation, cards, CTAs, and footer.
- All six exploratory products retain literal Exploratory status in homepage/group cards and route heroes.
- Product and project-area data validates stable slug references rather than duplicated identity fields.
- External links preserve correct escaping and `rel` behavior through one renderer.

## References

- Review findings: Spec 2 and 9; Standards 6–7.
- Authority: implementation-plan navigation, data, and shared-include contracts.
