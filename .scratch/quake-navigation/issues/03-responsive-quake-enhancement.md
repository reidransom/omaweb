# Responsive Quake enhancement and drawer preservation

Status: completed
Blocked by: 02

## Scope

Implement Quake behavior and responsive presentation from `.scratch/quake-navigation/spec.md` §§104–114 and 127–132, excluding the search implementation.

- Add a dedicated Quake controller and wire it through the existing ES-module entry point.
- At >=64rem show brand, five direct section links, Search, and Menu; at 48–63.999rem show brand, Search, and Menu; below 48rem retain the native-dialog drawer and Search beside Menu.
- Menu, Enter/Space, and Ctrl+backtick toggle the active navigation treatment. Ignore documented shortcuts in editable controls. Below 48rem Ctrl+backtick opens the native drawer.
- Keep Quake a non-modal, full-width overlay attached under sticky header. Give it natural height capped at 60vh with internal scrolling, no document scroll lock or focus trap, initial first-link focus, explicit dismissal focus restoration, outside click/link close, current state, direct 150ms motion, and reduced-motion parity.
- Preserve homepage header opacity behavior, forcing opaque while Quake is open and restoring scroll-derived state on close.

## Acceptance

Existing drawer ownership and behavior remain intact. Quake is only a deliberate click/shortcut disclosure; hover/focus does nothing. Do not create or modify Spotlight/full-search content or production Chromium assertions.
