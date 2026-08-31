# Render generated content semantically without viewport overflow

Status: ready-for-agent

## Problem

Generated workflow items on the Desktop route render as escaped preformatted code and make the 1440px page 189px wider than the viewport. The Workstations empty-state action is also emitted as generated code. These are Markdown/Liquid boundary failures, not intended page content.

## Scope

- Move generated structured content behind a rendering boundary that produces semantic HTML lists, figures, paragraphs, and controls.
- Preserve route-authored prose while preventing indentation-sensitive Markdown interpretation of generated markup.
- Apply the same boundary to current and future generated page primitives that are inserted into Markdown routes.
- Make the rendered-site verifier reject horizontal overflow and escaped structural HTML on required routes.

## Acceptance Criteria

- Desktop workflows render as an ordered list with headings and paragraphs, never as `<pre><code>`.
- Workstations renders its empty-state action as a usable button/link, never escaped markup.
- Desktop, Workstations, and all contracted representative routes have `scrollWidth <= clientWidth` at 390×844, 768×1024, and 1440×900.
- The existing layout, content order, and accessibility names remain intact.

## References

- Browser finding: Desktop `scrollWidth` 1629px at a 1440px viewport.
- Authority: implementation-plan responsive gates and semantic layout contracts.
