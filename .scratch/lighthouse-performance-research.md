# Omaweb homepage Lighthouse performance research

## Scope and method

This note follows the homepage render path from `index.html:1-11` through `_layouts/landing.html:1-6`, `_layouts/default.html:1-30`, and `_includes/pages/home.html:1-29`. It inspects only the head, homepage sections, shared media/search markup, compiled asset entry points, fonts, images, and JavaScript that affect loading or rendering. Repository byte counts below are raw file sizes; transfer sizes and timings come from one separate production Lighthouse run.

The user-reported score of 91 is the subject of this note. The detailed Lighthouse JSON for that run was not available, so its missing nine points cannot be attributed to a specific metric. Lighthouse calls 90–100 “Good,” but the performance score is a weighted aggregate of lab metrics, not “91% fast”; Opportunities and Diagnostics affect it only indirectly through those metrics ([Chrome, Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)). Current Lighthouse source weights TBT at 30%, LCP and CLS at 25% each, and FCP and Speed Index at 10% each ([Lighthouse current default configuration](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js#L424-L449)).

## Measurement evidence: one noisy production run

These numbers are **one lab run, not the stable 91 result**:

- The normal-motion run scored 55. `site.js` accounted for 6,745 ms total CPU and 2,566 ms script evaluation; page TBT was 1,500 ms.
- A reduced-motion run reduced reported JavaScript execution from about 2.6 s to 0.4 s and raised that run from 55 to 75.
- “Improve image delivery” estimated 396 KiB of savings. The five 1280×720 video thumbnails rendered at roughly 346 px wide. Examples from the audit were about 104 KiB wasted for `networkchuck.webp`, 98 KiB for `linuxbtw.webp`, 47 KiB for `alex-finn.webp`, and 35 KiB for `typecraft.webp`.
- The response payload grouped as 582 KiB images, 152 KiB fonts, 18 KiB HTML, 16 KiB scripts, and 10 KiB stylesheet.
- The LCP candidate was `p.home-hero__detail`, with 2,271 ms of element-render delay.
- Production HTML, `site.js`, `site.css`, and thumbnail responses all returned `Cache-Control: public, max-age=0, must-revalidate`.

This run is useful directionally: JavaScript execution and oversized images are measured costs. It does **not** prove that the same costs explain the 91, nor that the wordmark alone caused the motion/no-motion delta. Lighthouse warns that network, hardware, resource contention, browser behavior, and the page itself vary between runs; it recommends aggregate results and says the median of five runs is twice as stable as one ([official Lighthouse variability guide](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md#run-lighthouse-multiple-times)).

## Repository observations

### Loading path and existing good choices

- `_includes/head.html:9-12` preloads one same-origin JetBrains Mono WOFF2 face, loads one stylesheet, and marks the small Umami script `defer`. `_includes/scripts.html:1` loads the main bundle as a module at the end of the body.
- `_includes/pages/home.html:1-16` makes the fixed hero scene discoverable in initial HTML, supplies landscape and portrait WebP candidates, sets dimensions, loads it eagerly, and gives it `fetchpriority="high"`. Those are the right primitives **if the scene is the image that needs early priority**: an LCP resource should be discoverable in HTML, should not be lazy-loaded, and may benefit from high fetch priority ([Chrome LCP discovery insight](https://developer.chrome.com/docs/performance/insights/lcp-discovery)). The observed LCP was text, however, so the scene’s priority should be checked in the actual waterfall rather than assumed necessary.
- Homepage images have explicit `width` and `height`, which lets the browser reserve space and reduces image-driven layout shift risk ([web.dev browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading#give_your_images_dimension_attributes)).
- `_sass/_tokens.scss:5-90` uses `font-display: swap` and WOFF2 for all faces. `scripts/build-assets:242-268` subsets the fonts. These already follow the main delivery recommendations; preloading additional faces without a waterfall is not justified because font preload takes priority/bandwidth from other resources ([web.dev font best practices](https://web.dev/articles/font-best-practices#be_cautious_when_using_preload_to_load_fonts)).
- The homepage embeds no `<video>` or YouTube `<iframe>`. `_includes/sections/home-hero.html:70-89` links local thumbnails to YouTube, so video media bytes and third-party player JavaScript are not part of initial load.

### 1. Motion-enabled JavaScript is the leading measured CPU opportunity

`src/js/site.js:1-17` statically imports and initializes the drawer, header, homepage hero, language selector, quake UI, wordmark, and search in one bundle. `scripts/build:19-30` bundles and minifies that graph into a single `assets/js/site.js` (40,133 raw bytes in the inspected build). The small transferred script payload therefore hides a much larger execution cost in the measured run. JavaScript parsing and execution occupy the main thread, and Lighthouse recommends code splitting and sending only needed code ([Chrome, Reduce JavaScript execution time](https://developer.chrome.com/docs/lighthouse/performance/bootup-time)).

The source contains two costly-looking wordmark paths:

- The laseretch path starts WASM/canvas playback at `src/js/wordmark.js:198-236` and requests 240 frames per second at line 223.
- The fallback canvas path at `src/js/wordmark.js:247-374` runs a continuing `requestAnimationFrame` loop while visible; each draw reads bounds/computed font metrics and redraws the ASCII-art glyphs.

Reduced motion also disables the enhanced scroll hero (`src/js/home-hero.js:3`, `:311-342`) as well as wordmark animation, so the 2.2 s execution delta does not isolate one function. Current `_config.yml:36-37` sets `laseretch_wordmark: false`, and the deployed homepage contains no laseretch data attributes or WTE requests, confirming that the continuing fallback canvas path ran during this measurement.

### 2. Video thumbnails now use responsive derivatives

The measured audit found that five 1280×720 thumbnails rendered at roughly 346 px wide and downloaded substantially more pixels than their slots needed. The working tree now moves those sources into `../omaweb-docs/images/lg/wide/video/`; `scripts/build-assets` generates 480, 768, and 1152 px WebP derivatives. `_data/featured_videos.yml` describes those candidates with the shared responsive-media schema, while `_includes/sections/home-hero.html` and `_includes/pages/featured-videos.html` provide context-specific `sizes`. Browser verification selected the 480 px derivative for a 346 px mobile slot. This follows Chrome’s current recommendation to provide multiple renditions with `srcset`/`sizes` rather than serving images larger than their rendered version ([Chrome image-delivery insight](https://developer.chrome.com/docs/performance/insights/image-delivery)).

Loading priority also needs correction by context:

- `_includes/sections/home-hero.html:80` makes the first poster eager and the other four lazy. In the enhanced desktop layout, the poster composition is staged behind/off to the side of the initial primary panel (`_sass/_home.scss:640-735`); on narrow layouts it follows the primary panel. Only images actually in the initial viewport should be eager; offscreen images should use native lazy loading ([web.dev lazy-loading guidance](https://web.dev/articles/browser-level-image-lazy-loading#always_eager-load_images_visible_in_the_first_viewport)).
- A news article’s page-level LCP settings leak into its homepage card. `_news/2026-08-28-the-first-plugin-competition-winners.md:14-31` declares `loading: eager` and `fetchpriority: high`; `_includes/news-card.html:1-10` passes that object unchanged to `_includes/media.html:4-24`. The resulting news image is well below the long hero but still loads eagerly at high priority. Homepage-card loading policy should override article-page policy.

### 3. Static assets cannot get fresh-cache reuse

The measured `max-age=0, must-revalidate` policy forces repeat visits to revalidate every asset. Current Chrome guidance expects cacheable subresources to have at least a 30-day lifetime ([Chrome cache-lifetime insight](https://developer.chrome.com/docs/performance/insights/cache)). The repository currently emits stable names such as `/assets/js/site.js`, `/assets/css/site.css`, and `/assets/images/video/networkchuck.webp`; giving these changing URLs a one-year immutable lifetime would risk stale content. The safe sequence is to fingerprint/version generated URLs first, then give those content-addressed assets a long lifetime; web.dev recommends a one-year `max-age` specifically for versioned URLs whose contents do not change ([web.dev HTTP caching](https://web.dev/articles/http-cache#long-lived-caching-for-versioned-urls)). Keep HTML revalidated so deployments remain discoverable.

Production responses for HTML, CSS, and JavaScript were verified with `Content-Encoding: br`; compression is already active. Brotli or gzip is appropriate for HTML, CSS, and JavaScript, not already-compressed images ([web.dev encoding and transfer size](https://web.dev/articles/optimizing-content-efficiency-optimize-encoding-and-transfer#text-compression-with-compression-algorithms)). Compression is therefore not an improvement target.

### 4. CSS, fonts, DOM size, and the text LCP need traces before changes

- `assets/css/site.scss:5-14` combines base/components plus homepage, legacy, manual, news, and search styles into the one render-blocking stylesheet. The inspected CSS is minified (56,562 raw bytes; 10 KiB transferred in the lab run). Stylesheets block first rendering, and Chrome recommends deferring noncritical styles and reducing first-paint CSS ([Chrome render-blocking insight](https://developer.chrome.com/docs/performance/insights/render-blocking)). However, no CSS-coverage or render-blocking finding was captured, so splitting or inlining CSS is lower priority than the measured CPU and image work.
- The lab run transferred 152 KiB of fonts. CSS declares eleven faces, but `@font-face` declarations alone do not fetch a font; only faces used by page styling are downloaded ([web.dev font best practices](https://web.dev/articles/font-best-practices#understand_font-face)). Record the actual requested faces before removing weights or changing the existing preload.
- The generated `_site/index.html` is 116,474 raw bytes and a simple static tag count found 940 elements inside `<body>`. Hidden search markup is emitted on every page by `_layouts/default.html:20-23`; `_includes/site-search.html:4-22` includes a full navigation fallback and three JSON data blocks before search is opened. Lighthouse warns above roughly 800 body nodes and recommends creating undisplayed nodes when needed ([Chrome DOM-size guidance](https://developer.chrome.com/docs/lighthouse/performance/dom-size)). Confirm the browser’s actual DOM audit before replacing the no-JavaScript fallback or moving markup to runtime.
- A 2,271 ms element-render delay for the text LCP is important but not diagnostic by itself. It may involve main-thread contention, stylesheet/font timing, or paint gating. Use the LCP phase breakdown and a Performance trace before changing font preload or critical CSS; Chrome explicitly recommends identifying the LCP resource and its subparts first ([web.dev Optimize LCP](https://web.dev/articles/optimize-lcp)).

## Prioritized actions

1. **Reduce and isolate motion CPU first.** Capture a function-level Performance trace, then test the wordmark and enhanced scroll hero independently. Remove the 240 fps request; make wordmark work finite or substantially lower-rate, stop it when complete/offscreen, and avoid repeated per-frame measurement. Preserve the static/reduced-motion fallback. Split page/feature modules so nonqualifying paths are not parsed and initialized. Accept only changes that lower median JS execution and TBT across five equivalent runs without breaking the intended motion.
2. **Re-measure responsive video thumbnails.** The working tree now generates and renders 480, 768, and 1152 px candidates. Re-run “Improve image delivery” against the deployed revision and confirm the expected candidate at mobile and desktop DPRs; do not claim the prior 396 KiB estimate as realized savings until that audit passes. Separately override article-level eager/high metadata when an image is rendered in a homepage news card.
3. **Fingerprint assets, then enable long caching.** Version generated CSS, JS, font, and image URLs in markup and serve those immutable URLs with a long cache lifetime. On Cloudflare Pages, emit a `_headers` file in the built output to set those response headers ([Cloudflare Pages custom headers](https://developers.cloudflare.com/pages/configuration/headers/)). Continue revalidating HTML. Confirm repeat-visit behavior and that each content change produces a new URL. This improves repeat loads but does not directly raise a cold-load Lighthouse score.
4. **Trace the text LCP and request waterfall.** Determine what filled its 2,271 ms render-delay phase. Only then decide whether to change the hero image’s high priority, preload a different font, alter paint gating, or extract small critical CSS.
5. **Use coverage and the DOM audit for a second pass.** If CSS coverage shows substantial unused first-load CSS, split layout-specific styles while retaining a small critical path. If the actual DOM audit flags the homepage, reduce duplicated hidden navigation/search markup or experiment with `content-visibility: auto` plus a measured intrinsic size on below-fold homepage sections; this can skip offscreen layout/paint while retaining DOM content ([web.dev `content-visibility`](https://web.dev/articles/content-visibility)).

## Lab/field caveats

The score and run comparisons above are synthetic measurements from particular device, network, browser, cache, and motion settings. Lab tests are valuable for diagnosis and regression checks; field data covers real devices, networks, locations, cache states, and user behavior and is a distribution ([web.dev lab versus field data](https://web.dev/articles/lab-and-field-data-differences)). Current Core Web Vitals are field LCP, INP, and CLS, with “Good” thresholds of 2.5 s, 200 ms, and 0.1 respectively at the 75th percentile, separated by mobile and desktop; Lighthouse uses TBT as a lab proxy and cannot directly measure field INP in a normal load audit ([web.dev Web Vitals](https://web.dev/articles/vitals#core_web_vitals)).

For decisions, capture the same deployed revision, viewport, throttling, cache state, and motion preference; use the median of at least five runs; compare metric values and traces rather than score alone; and check URL-level CrUX or first-party real-user data before claiming a user-experience improvement.

## Direct primary sources

- [Chrome: Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Lighthouse source: current score weights](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js#L424-L449)
- [Lighthouse: score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)
- [web.dev: Web Vitals](https://web.dev/articles/vitals)
- [web.dev: lab and field data differences](https://web.dev/articles/lab-and-field-data-differences)
- [Chrome: Reduce JavaScript execution time](https://developer.chrome.com/docs/lighthouse/performance/bootup-time)
- [Chrome: Improve image delivery](https://developer.chrome.com/docs/performance/insights/image-delivery)
- [Chrome: LCP request discovery](https://developer.chrome.com/docs/performance/insights/lcp-discovery)
- [web.dev: browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading)
- [web.dev: Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- [web.dev: font best practices](https://web.dev/articles/font-best-practices)
- [Chrome: render-blocking requests](https://developer.chrome.com/docs/performance/insights/render-blocking)
- [Chrome: cache lifetimes](https://developer.chrome.com/docs/performance/insights/cache)
- [web.dev: HTTP caching](https://web.dev/articles/http-cache)
- [Cloudflare Pages: custom response headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [web.dev: encoding and transfer size](https://web.dev/articles/optimizing-content-efficiency-optimize-encoding-and-transfer)
- [Chrome: DOM size](https://developer.chrome.com/docs/lighthouse/performance/dom-size)
- [web.dev: `content-visibility`](https://web.dev/articles/content-visibility)
