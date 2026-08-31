# Authoritative five-section navigation markup

Status: ready-for-agent
Blocked by: 01

## Scope

Implement the authoritative navigation records and semantic fallback in `.scratch/quake-navigation/spec.md` §§102–123 and 141–142.

- Replace the current grouped model with the five flat primary sections: Foundation, Manual, Shop, News, and Community, including exact required children and destinations.
- Add authoritative external Manual chapter destinations; do not invent local chapters.
- Use the same records for header, mobile drawer, no-JavaScript disclosure, footer references where appropriate, and later search destinations. Do not introduce parallel lists.
- Add normal `/search/` links as the pre-enhancement Search control.
- Render desktop top-level sections as ordinary links. Render a semantic Quake disclosure with its real links, dedicated Menu control contract, current-route treatment and `aria-current`, exploratory markers/descriptions, external semantics, and Shop status meaning.
- Update shared link rendering only where needed to support the above.

## Acceptance

All five sections and their exact child links render from one data model. Shop, Laptops, Desktops, Mobile, and Accessories have one accessible exploratory explanation; Merch does not. The fallback remains usable without JavaScript. Do not implement animation, keyboard behavior, modal search, route content, or Chromium assertions.
