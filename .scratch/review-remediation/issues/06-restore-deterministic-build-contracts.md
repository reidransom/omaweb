# Restore deterministic build and font contracts

Status: ready-for-agent

## Problem

The documented CSS and JavaScript build commands are missing. Font records declare that they are not subsetted, and the deterministic asset check does not verify the required font derivatives. Motion is locked without a committed caller.

## Scope

- Expose the documented CSS and JavaScript build interfaces while preserving the single production pipeline.
- Deterministically subset all four required JetBrains Mono faces, preserving the block glyphs needed by the wordmark.
- Extend byte-identical asset checks to font derivatives as well as responsive image families.
- Preserve only the primary Light preload and `font-display: swap` behavior.
- Either add a concrete, local short interaction that imports Motion or remove Motion and its lockfile dependency tree.

## Acceptance Criteria

- `npm run css:build` and `npm run js:build` both produce their contracted local minified outputs.
- The asset check validates every committed generated image and font derivative byte-for-byte without altering originals.
- All four font faces are local subsets, retain required wordmark glyphs, and are represented accurately in the asset manifest.
- Initial JavaScript contains no unused Motion dependency.
- The production build invokes the same contracted steps and continues to support the existing deployment flow.

## References

- Review findings: Spec 5 and 7; Standards 9.
- Authority: implementation-plan build, asset, font, and performance gates.
