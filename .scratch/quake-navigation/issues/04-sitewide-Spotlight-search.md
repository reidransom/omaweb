# One sitewide Spotlight search

Status: ready-for-agent
Blocked by: 03

## Scope

Replace the News-only search with the one sitewide search contract in `.scratch/quake-navigation/spec.md` §§127–140.

- Remove `/news/search/` and every caller. Add canonical `/search/` with useful no-JavaScript navigation fallback.
- Use one shared query controller/result renderer for the full route and a global native-dialog Spotlight activated by Search or Ctrl+K.
- Implement native modal focus/scroll/inert behavior, Escape/close/backdrop dismissal and focus restoration. Coordinate with Quake so exactly one overlay remains open; a repeated shortcut focuses the active interface. Ignore shortcuts in editable controls.
- Start after trimmed two characters; debounce; clear below threshold; lazy-load Pagefind only after the first eligible query; guard every async update with request identity.
- Search the navigation authority rather than duplicating curated entries. Show at most five destination results first and eight Pagefind results second, with safe concise excerpts, external indicator, labeled groups, live state announcements, unavailable and no-result fallback, combined arrow selection, Enter activation, and ordinary Tab traversal.

## Acceptance

`/search/` and Spotlight expose identical query/result rules and site-wide terminology. The old News-only route/interface is absent. Do not edit production Chromium verification assertions.
