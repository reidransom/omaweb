# Complete featured News media and archive pagination

Status: ready-for-agent

## Problem

The selected winners story lacks its required cleared lead media, so the News index renders fallback art and production verification rejects the site. Archive page one renders all twelve stories while page two starts at offset eight, producing duplicates instead of the contracted 9/3 split.

## Scope

- Research and clear a rights-permitted winners-story lead image, then bind it to that exact article when available.
- Keep deterministic local fallback art only for image-less articles and the explicitly identified illustrative fallback allowed by the media-sourcing decision.
- Derive featured, latest, archive, page two, taxonomy, author, feed, and search ordering from one ordered News collection.
- Partition the twelve migrated articles as nine on page one and three on page two without duplicates.

## Lead-media sourcing decision

Research a rights-clear winners image by web search first. If one cannot be used, render a local OpenAI image-model placeholder that is explicitly identified as illustrative; never describe it as event photography or factual product evidence.

## Acceptance Criteria

- The configured featured winners story renders a cleared real lead image where one is available; otherwise it renders the clearly identified local illustrative placeholder.
- The other image-less articles render the approved local fallback and no fake photo/screenshot.
- Page one contains nine unique archive stories and page two contains the remaining three unique stories.
- Feed, taxonomy, author, search, pinned, and spotlight views retain their required real articles and stable URLs.
- Production verification fails when a featured story has neither cleared real lead media nor its declared local illustrative placeholder, or when archive pages overlap.

## References

- Review findings: Spec 1 and 3.
- Authority: implementation-plan News inventory, feature selection, archive, and production-verification gates.
