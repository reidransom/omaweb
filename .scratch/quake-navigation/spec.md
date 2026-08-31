# Quake navigation and Spotlight search

Status: ready-for-agent

## Problem Statement

The current desktop header exposes four large navigation groups and five utility destinations at once. It works, but it does not match the desired compact, keyboard-first Omarchy experience. Visitors cannot summon navigation with a shortcut, and the site has no general search interface even though Pagefind already indexes the rendered site.

The proposed navigation also needs a different information hierarchy. Foundation, Manual, Shop, News, and Community should become the permanent top-level destinations. Shop is intentionally aspirational. It must make room for future hardware categories without claiming that Omarchy currently sells laptops, desktops, phones, or accessories.

Search has a second problem. The current interface calls itself News search, but its backing index covers the whole site. Visitors need one site-wide Spotlight search that finds curated destinations first, then pages and News articles.

## Solution

Replace the wide desktop mega-navigation with a compact header plus a Quake-style navigation panel. At wide desktop sizes, the five top-level destinations remain directly clickable. A dedicated Menu control and `Ctrl+\`` reveal the full five-column panel. The panel drops from the sticky header over the page, uses Omarchy's terminal visual grammar, and never opens on hover.

Add a separate Spotlight search. Search and `Ctrl+K` open a centered modal with site-wide results. It ranks matching curated destinations before Pagefind content. The Quake panel and Spotlight never remain open together.

Reorganize primary navigation around Foundation, Manual, Shop, News, and Community. Shop links to a new New Releases page and carries a visible exploratory marker. Its Laptops, Desktops, Mobile, and Accessories links carry the same marker. A nearby note explains that these areas are not products or release promises. Merch remains the only available Shop destination.

Keep the existing mobile drawer below the mobile breakpoint. Add Search beside it rather than forcing the Quake presentation onto a phone.

The highest test seam is the production build and its rendered-site Chromium verification. That seam already builds CSS and JavaScript, renders Jigyll, creates the Pagefind index, checks routes and links, and exercises the real site at contracted viewport sizes. Extend it to cover the complete navigation and search behavior instead of adding lower-level tests for markup or module internals.

## User Stories

1. As a desktop visitor, I want Foundation, Manual, Shop, News, and Community visible in the header, so that I can open a major destination directly.
2. As a desktop visitor, I want a dedicated Menu control, so that opening the larger navigation panel is deliberate.
3. As a pointer user, I want ordinary clicks on top-level links to navigate, so that links do not have surprising menu behavior.
4. As a pointer user, I want the Quake panel to stay closed while I move across the navbar, so that casual hover does not cover the page.
5. As a keyboard user, I want `Ctrl+\`` to open the Quake panel, so that I can reach navigation without tabbing through the header.
6. As a keyboard user, I want the Menu control to show `Ctrl+\``, so that I can discover the shortcut.
7. As a keyboard user, I want `Ctrl+K` to open Spotlight search, so that I can search without reaching for the pointer.
8. As a keyboard user, I want the Search control to show `Ctrl+K`, so that the second shortcut is discoverable.
9. As a visitor entering text, I want navigation shortcuts ignored inside editable controls, so that typing cannot open or replace an overlay.
10. As a visitor, I want only one navigation or search overlay open at a time, so that controls and focus never compete.
11. As a visitor, I want the Quake panel to drop from the bottom edge of the sticky header, so that the effect has a clear physical origin.
12. As a visitor, I want the panel to cover rather than move page content, so that opening it does not change my scroll position.
13. As a visitor on a short display, I want the panel capped at 60 percent of the viewport height, so that I can still dismiss it and reach every link.
14. As a visitor on a tall display, I want the panel to use only the height its links need, so that it does not leave a large empty slab.
15. As a visitor, I want long panel content to scroll inside the panel, so that links never extend beyond the viewport.
16. As a keyboard user, I want focus moved to the first section link whenever the panel opens, so that I can navigate immediately.
17. As a keyboard user, I want Escape to close the panel and return focus to Menu, so that I can leave without losing my place.
18. As a pointer user, I want an outside click to close the panel, so that dismissal matches other temporary overlays.
19. As a visitor, I want clicking Menu or pressing `Ctrl+\`` again to close the panel, so that both opening mechanisms also work as toggles.
20. As a keyboard user, I want Tab to continue past the panel into the page, so that navigation remains a non-modal disclosure rather than a focus trap.
21. As a visitor, I want page scrolling to remain available while the Quake panel is open, so that navigation does not behave like a dialog.
22. As a visitor who prefers reduced motion, I want the panel revealed without translation, so that the navigation remains complete without animation.
23. As a visitor who accepts motion, I want a direct 150 millisecond drop with no bounce, so that the interaction feels fast rather than theatrical.
24. As a visitor, I want a visible current-page treatment in the header and panel, so that I know where I am.
25. As a screen-reader user, I want the current destination exposed semantically, so that the visual treatment is not the only indication.
26. As a prospective foundation supporter, I want direct links to Patrons, Sponsorships, Artists in Residence, and Security, so that I can reach the Foundation's concrete programs.
27. As a new Omarchy user, I want Manual links for the ISO, Getting Started, Hotkeys, Omarchy CLI, Troubleshooting, and FAQ, so that installation and common tasks are close at hand.
28. As a visitor, I want the Manual heading to open the established external Manual, so that the label and destination agree.
29. As a visitor interested in future hardware, I want Shop to lead to New Releases, so that I can see what this area may contain.
30. As a visitor interested in hardware, I want Shop links for Laptops, Desktops, Mobile, Merch, and Accessories, so that the aspirational categories are explicit.
31. As a visitor, I want Shop, Laptops, Desktops, Mobile, and Accessories marked with an asterisk, so that I notice their exploratory status before navigating.
32. As a screen-reader user, I want every exploratory asterisk tied to its explanation, so that status is not conveyed by punctuation alone.
33. As a visitor, I want the Shop note to say these areas are exploratory and not products or release promises, so that aspiration is not mistaken for inventory.
34. As a visitor, I want Merch left unmarked, so that the navigation distinguishes the available store collection from future ideas.
35. As a visitor opening New Releases, I want an honest explanation that the page may later highlight releases, so that an empty catalog does not imply hidden products.
36. As a visitor opening Desktops, I want aspirational desktop hardware content, so that the plural hardware label matches its destination.
37. As a visitor, I want old references to `/desktop/` updated for its new hardware meaning, so that no part of the site still calls that route the current desktop OS.
38. As a current Omarchy user, I want ISO and Manual actions retained outside the repurposed Desktop page, so that installation and operating-system guidance remain reachable.
39. As a visitor opening Accessories, I want the page framed around future third-party hardware recommendations, so that it does not invent Omarchy-branded peripherals.
40. As a visitor, I want an Accessories empty state to admit that no recommendations exist yet, so that the site makes no unsupported endorsement.
41. As a News reader, I want Product, Releases, Events, Editorial, and Atom feed links, so that I can enter the parts of News with distinct jobs.
42. As a community member, I want Discord, Meetups, Workstations, Plugins, Teams, and Code links, so that participation routes stay together.
43. As a visitor, I want Platforms, Hardware, Software, Project, Server, Apps, Cloud, and Labs removed from primary navigation but still searchable, so that the header can be curated without deleting useful pages.
44. As a desktop visitor between 48rem and 64rem, I want only Omarchy, Menu, and Search in the closed header, so that the controls fit without wrapping or shrinking.
45. As a mobile visitor, I want the existing drawer retained below 48rem, so that navigation uses a familiar touch interaction.
46. As a mobile visitor, I want Search beside Menu, so that site search does not require opening the drawer first.
47. As a mobile visitor with a physical keyboard, I want the menu shortcut to open the active mobile navigation, so that keyboard access still works at the small breakpoint.
48. As a visitor, I want Search to open a centered Spotlight modal, so that search is visually and behaviorally distinct from navigation.
49. As a keyboard user, I want Spotlight to focus its search field on open, so that I can type immediately.
50. As a keyboard user, I want Spotlight to trap focus until dismissed, so that focus cannot move behind the modal.
51. As a keyboard user, I want Escape to close Spotlight and restore focus to Search, so that modal dismissal is predictable.
52. As a pointer user, I want Spotlight's backdrop to dismiss it, so that I do not need to find a small close control.
53. As a visitor, I want Spotlight centered at about 42rem wide and capped near 70 percent of viewport height, so that results have room without becoming a search page.
54. As a mobile visitor, I want Spotlight to use the available width with safe viewport margins, so that the input and results remain usable on a phone.
55. As a visitor who has not typed a query, I want Spotlight to show only its search field, so that the initial state stays quiet.
56. As a search user, I want results to update after I type two characters, so that broad one-character searches do not fill the panel with noise.
57. As a search user, I want a short delay before each live query, so that fast typing does not launch needless searches.
58. As a fast typist, I want an older query result ignored when a newer query finishes first, so that the result list always matches the current input.
59. As a search user, I want up and down arrows to select results, so that I can inspect the list without leaving the keyboard.
60. As a search user, I want Enter to open the selected result, so that keyboard search completes without Tab traversal.
61. As a search user, I want up to five matching curated destinations shown first, so that common navigation remains fast.
62. As a search user, I want up to eight matching Pages & News results shown second, so that I can search the full rendered site without an unbounded result list.
63. As a search user, I want destination and content results under separate labels, so that I understand why two similarly named results may appear.
64. As a search user, I want each content result to show a title and concise context, so that I can choose without opening several pages.
65. As a search user, I want external destinations marked, so that I know when a result leaves the site.
66. As a search user, I want clear loading, no-results, and unavailable states, so that a quiet panel is never mistaken for a stalled query.
67. As a visitor with JavaScript disabled, I want the navigation disclosure and its links to remain usable, so that primary navigation does not depend on enhancement.
68. As a visitor with JavaScript disabled, I want Search to lead to a site-wide search page with useful navigation fallback content, so that the control is not dead.
69. As a visitor using the full search page, I want the same query and result rules as Spotlight, so that the two search presentations do not drift.
70. As a maintainer, I want one site-wide search implementation instead of separate News and Spotlight search modules, so that query and result behavior has one owner.
71. As a maintainer, I want navigation labels, URLs, children, external status, and exploratory status defined authoritatively, so that the header, panel, drawer, fallback, and search destinations agree.
72. As a release reviewer, I want the production build to verify all navigation and search behavior in real Chromium, so that rendered behavior rather than source spelling decides acceptance.

## Implementation Decisions

- Keep Jigyll, Liquid includes, YAML-authored navigation data, the current CSS build, the bundled ES-module entry point, and Pagefind. Do not add a client framework, router, search service, or command-palette dependency.
- Replace the current desktop group model with five authoritative primary sections: Foundation, Manual, Shop, News, and Community. Each section has one flat child list. Nested navigation is not supported.
- Render each top-level section label as a normal link. It always navigates. It never acts as the Quake-panel trigger.
- Add a separate Menu button with `aria-expanded` and `aria-controls`. Click, Enter, Space, and `Ctrl+\`` toggle the panel. Hover and focus alone do nothing.
- At 64rem and wider, render the brand, five top-level links, Search, and Menu. From 48rem through 63.999rem, render the brand, Search, and Menu. Below 48rem, preserve the native-dialog mobile drawer and render Search beside it.
- Below 48rem, `Ctrl+\`` opens the mobile drawer when a physical keyboard is present. At larger sizes it opens the Quake panel.
- Render the Quake panel as a full-width non-modal navigation overlay attached to the lower edge of the sticky header. Its natural content height is capped at 60vh. Overflow scrolls inside the panel.
- Do not lock document scrolling or trap focus while the Quake panel is open. Move focus to the first section link on every open. Restore focus to Menu after explicit dismissal.
- Close the panel on Menu toggle, `Ctrl+\`` toggle, Escape, outside click, or successful link activation. Opening Spotlight closes it first.
- Preserve the homepage's transparent-to-opaque header behavior. An open Quake panel forces an opaque header. Closing it restores the state dictated by the current scroll position.
- Use the existing 150 millisecond interaction timing. Animate a direct downward translation and backdrop fade without bounce. Under reduced motion, reveal and hide the panel without translation.
- Use the existing Night, Storm, Terminal Black, Terminal Blue, Cyan, Turquoise, Green, and Terminal White tokens. The panel uses terminal grammar, not a simulated shell. Do not add scanlines, fake window controls, fake command output, glow, or a second display typeface.
- Mark the current route visually and with `aria-current`. Preserve visible focus styling for the Menu button, Search control, section links, child links, modal controls, and results.
- Foundation links to `/foundation/` and contains Patrons, Sponsorships, Artists in Residence, and Security.
- Manual links to the authoritative external Manual and contains Download ISO, Getting Started, Hotkeys, Omarchy CLI, Troubleshooting, and FAQ. Manual chapter URLs remain authoritative external destinations rather than locally copied documents.
- Shop carries an exploratory asterisk and links to `/new-releases/`. It contains Laptops, Desktops, Mobile, Merch, and Accessories. Do not repeat New Releases as a child.
- Laptops links to `/laptops/`, Desktops links to `/desktop/`, Mobile links to `/mobile/`, Merch uses the authoritative external store destination, and Accessories links to `/accessories/`.
- Mark Laptops, Desktops, Mobile, and Accessories as exploratory. Do not mark Merch. Connect every visible asterisk to the same explanatory text through accessible description semantics.
- Use this status meaning after the Shop column: `Exploratory. These are areas Omarchy may cover, not products or release promises.` Copy may receive normal editorial punctuation and capitalization, but its factual meaning must not soften.
- News links to `/news/` and contains Product, Releases, Events, Editorial, and Atom feed.
- Community links to `/community/` and contains Discord, Meetups, Workstations, Plugins, Teams, and Code.
- Remove Platforms, Hardware, Software, Project, Server, Apps, Cloud, and Labs from primary navigation. Keep their routes unless another explicit content decision removes them. They remain available to Pagefind and through contextual or footer links where those links still make sense.
- Add `/new-releases/` as an intentional empty-state page. It says the route may later highlight releases. It must not show invented products, dates, waitlists, inventory, or release commitments.
- Repurpose `/desktop/` for aspirational desktop hardware. Migrate every current label, status, card, footer link, and contextual reference that calls this URL the available Omarchy desktop environment. Keep current OS installation and usage actions on the homepage, Manual, or other destinations that still describe the released operating system accurately.
- Add `/accessories/` for possible future third-party hardware recommendations. State that there are no recommendations yet. Name the evaluation intent without endorsing specific untested products or implying that Omarchy will manufacture accessories.
- Replace the News-specific search presentation with one site-wide search contract. Both Spotlight and the full search route use the same query controller and result renderer.
- Add a canonical `/search/` route. Search is a normal link to this route before enhancement. JavaScript intercepts activation and opens Spotlight. The no-JavaScript page retains useful links even though Pagefind itself requires JavaScript.
- Remove the old News-only search route and migrate its callers to `/search/`. Do not keep two search URLs, aliases, or deprecated interfaces.
- Build the Spotlight with the native dialog element. Search activation or `Ctrl+K` opens it, locks page scrolling, moves focus to the query field, and makes the rest of the page inert through native modal behavior. Escape, the close control, or backdrop activation closes it and restores focus to Search.
- Opening the Quake panel closes Spotlight first. Opening Spotlight closes the Quake panel first. A shortcut invoked while its own interface is already open focuses that interface's primary control rather than creating another instance.
- Ignore site shortcuts when focus is in an input, textarea, select, or editable region. Do not override modified key combinations other than the two documented chords.
- Keep Spotlight's empty state blank apart from the labeled search field and visible shortcut treatment.
- Start live search once the trimmed query contains two characters. Debounce briefly. Clear results when the query falls below two characters.
- Give each query a request identity. Only the newest query may update loading, result, empty, or error state. A slow response from an older query must not replace newer results.
- Search the authoritative curated destination set in memory and show at most five matches under Destinations. Search Pagefind for rendered content and load only enough result data to render at most eight entries under Pages & News.
- Keep destination and Pagefind results in separate labeled groups. Each result is a real link. Content results show title and concise context with markup stripped safely. External destination results have a textual or icon-plus-accessible-name indicator.
- Up and down arrows move active selection through both result groups as one ordered list. Enter follows the active result. Pointer movement may update active selection. Standard Tab behavior continues to reach modal controls and result links.
- Announce loading, result count, no-results, and failure changes without stealing focus. Search errors state that search is unavailable and provide the full search page's fallback navigation rather than News-specific archive copy.
- Keep the compressed initial JavaScript within the existing production budget. Lazy-load Pagefind only after the first eligible query.
- Render the Quake navigation from a semantic disclosure fallback so its links remain reachable without JavaScript. Enhancement may add overlay positioning, focus movement, outside-click handling, and hotkeys, but it must not replace the underlying link structure with generated HTML.
- Reuse the same authoritative navigation records for the wide header, Quake panel, intermediate header, mobile drawer, no-JavaScript disclosure, footer references where appropriate, and Spotlight destination matches. Do not maintain parallel hard-coded lists.

## Testing Decisions

- A good test proves behavior a visitor can observe. It opens the rendered site, activates controls, follows focus, checks URLs and visible states, and exercises real Pagefind output. It does not assert JavaScript function names, Liquid include names, CSS selector spelling, internal timers, or incidental DOM nesting.
- Use the production build as the primary and preferably only acceptance seam. It already compiles assets, renders Jigyll, builds Pagefind, checks routes and links, and runs Chromium against the finished site.
- Extend the existing rendered-site Chromium verifier rather than introducing a separate browser-test framework. Existing checks for the mobile drawer, header opacity, reduced motion, no-JavaScript navigation, horizontal overflow, and focus restoration are direct prior art.
- At 1440 by 900, verify the complete closed header, direct top-level navigation, Menu and Search shortcut hints, five-column panel, Shop status note, current-route state, and absence of hover activation.
- At 1440 by 900, open the panel by pointer and keyboard. Verify initial focus, toggle behavior, Escape, outside-click dismissal, focus restoration, continued document scrolling, ordinary Tab progression, and the 60vh cap on a short-height variant.
- At 768 by 1024, verify the intermediate header contains only Omarchy, Menu, and Search while the same Quake panel remains available.
- At 390 by 844, verify the existing mobile drawer still opens, traps and restores focus as before, Search remains directly available, and Spotlight fits within viewport margins without horizontal overflow.
- Verify `Ctrl+\`` opens the active navigation treatment at each responsive state. Verify `Ctrl+K` opens Spotlight. Verify both shortcuts are ignored while typing in editable controls.
- Verify opening one interface closes the other and leaves exactly one active overlay and one valid focus owner.
- Verify the homepage header becomes opaque while the Quake panel is open and returns to the correct transparent or opaque state after closing.
- Under reduced motion, verify the panel reaches the same open and closed states without translated animation.
- With JavaScript blocked, verify the navigation disclosure is visible and usable, the enhanced controls do not replace it, and Search navigates to the full search route.
- Exercise Spotlight against the real generated Pagefind index. Verify the blank initial state, the two-character threshold, current-query-wins behavior, no-results copy, unavailable copy, keyboard selection, Enter navigation, focus trap, backdrop dismissal, Escape dismissal, and focus restoration.
- Use queries that match both a curated destination and rendered content. Verify Destinations appears first with no more than five entries and Pages & News appears second with no more than eight entries.
- Verify route and link integrity for `/new-releases/`, `/desktop/`, `/accessories/`, and `/search/`. Verify the removed News-only search URL is absent from generated navigation and callers.
- Verify rendered `/desktop/` content, metadata, labels, and incoming site links no longer describe that URL as the current Omarchy desktop environment.
- Verify every aspirational navigation item has the explanatory relationship and Merch does not receive exploratory status.
- Keep production checks for duplicate metadata, broken internal links, bundle budgets, local assets, required landmarks, and viewport overflow. The feature is incomplete if it passes interaction checks but breaks those existing contracts.
- Do not add unit tests for debounce helpers, string matching, class toggles, or focus plumbing. Add a lower seam only if a deterministic ordering rule cannot be exercised through rendered Chromium. Any such test must assert public result order, not private functions.

## Out of Scope

- A system-wide Hyprland hotkey. Both shortcuts work only while the site has browser focus.
- Hover-triggered navigation.
- Nested navigation beyond one child level.
- A fake shell, command language, aliases, terminal history, scanlines, fake window controls, or command execution.
- Search history, personalization, analytics, recent-query storage, or remote search infrastructure.
- Replacing Pagefind, Jigyll, the current asset pipeline, or the existing mobile drawer.
- Selling or announcing Omarchy laptops, desktops, phones, or accessories.
- Product inventory, checkout, pricing, release dates, preorder forms, waitlists, or unsupported hardware endorsements.
- Writing or restructuring the external Omarchy Manual.
- Removing the pruned Platforms, Hardware, Software, Project, Server, Apps, Cloud, or Labs routes solely because they leave primary navigation.
- Deployment, shipping, pushing, or Git history changes.

## Further Notes

- `Shop*` is intentionally aspirational. The asterisk and note are part of the navigation contract, not optional decoration.
- The Shop parent links directly to New Releases. New Releases does not also appear as a child.
- `Desktops` deliberately implies hardware and points to the repurposed singular `/desktop/` route.
- The existing Pagefind index already covers the rendered site. The work is to provide a site-wide interface, curated destination ranking, bounded result loading, and correct interaction state.
- The current search code submits a News-labeled form and loads every match. Replace that behavior rather than layering Spotlight on top of it.
- The brand guide remains the authority for color, type, motion, focus, contrast, and reduced-motion behavior.
