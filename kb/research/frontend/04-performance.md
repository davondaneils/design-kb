# Research 04: Performance and Core Web Vitals

Researched 2026-10-09. Status key: C = consensus or standard, P = practitioner opinion, V = verify (fast moving).

## Key findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Assessed at the 75th percentile of page loads, mobile and desktop separately. LCP good at or under 2.5s, poor over 4s. INP good at or under 200ms, poor over 500ms. CLS good at or under 0.1, poor over 0.25. INP replaced FID as a Core Web Vital in 2024. | web.dev Web Vitals; Defining the thresholds | C |
| 2 | LCP subparts and target share: TTFB about 40%, resource load delay under 10%, resource load duration about 40%, element render delay under 10%. Fixing one can shift time to another. | web.dev Optimize LCP | C |
| 3 | LCP image must be discoverable in the HTML (`src`/`srcset` in markup, preload if referenced from CSS or JS), `fetchpriority="high"` on one or two images at most, never `loading="lazy"`, no sync scripts in head, inline small critical CSS. | web.dev Optimize LCP | C |
| 4 | INP = input delay + processing duration + presentation delay. Yield to the main thread; do the render-critical update first and defer the rest; avoid forced synchronous layout; large DOMs cost; `content-visibility` lazily renders. | web.dev Optimize INP | C |
| 5 | `scheduler.yield()` continuations run ahead of other queued tasks. Support: Chrome 129, Edge 129, Firefox 142; not Safari. Fallback: `setTimeout`. | Chrome for Developers, Use scheduler.yield | V |
| 6 | Lighthouse DOM size: warning above about 800 body nodes, error above about 1,400. | Chrome for Developers, Lighthouse dom-size | C |
| 7 | CLS = largest session window (shifts under 1s apart, window max 5s). Shifts within 500ms of a discrete input are excluded. bfcache restores reset CLS. Lab tools under-report vs field. | web.dev CLS | C |
| 8 | bfcache: never use `unload` (use `pagehide`); reserve `Cache-Control: no-store` for sensitive pages; close open connections on `pagehide`. | web.dev bfcache | C |
| 9 | Speculation rules: prefetch vs prerender; eagerness conservative (pointer or touch down), moderate (about 200ms hover on desktop), eager, immediate; Chromium only, Firefox no, Safari behind a flag; gate analytics on `document.prerendering`. | Chrome for Developers, Prerender pages | V |
| 10 | 2024 budgets at a P75 device (Galaxy A51 / Pixel 4a class) and network (7.2Mbps down, 94ms RTT): markup-centric site at a 3s target, about 1.4MiB total with about 75KiB JS; JS-heavy site at a 3s target, about 730KiB total with about 365KiB JS. | Alex Russell, The performance inequality gap, 2024 | P (expert, widely cited) |
| 11 | Delay spinners and skeletons by 150 to 300ms and keep them visible 300 to 500ms to avoid flicker; mutations should complete under 500ms; virtualize large lists or use `content-visibility: auto`. | Vercel Web Interface Guidelines | P |
| 12 | Head order affects render start; see capo.js weights. | capo.js | C |
| 13 | Long Animation Frames API: reports frames whose rendering update is delayed over 50ms, with script attribution for scripts over 5ms (source URL, function, forced style and layout duration). Chrome and Edge 123+; not Firefox or Safari. | Chrome for Developers, Long Animation Frames | C (Chromium only) |
| 14 | `contain-intrinsic-size: auto <length>` reuses the last rendered size while content is skipped (for example with `content-visibility: auto`). Baseline widely available since September 2023. | MDN contain-intrinsic-size | C |

## Sources
- https://web.dev/articles/vitals
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://web.dev/articles/optimize-lcp
- https://web.dev/articles/optimize-inp
- https://developer.chrome.com/blog/use-scheduler-yield
- https://developer.chrome.com/docs/lighthouse/performance/dom-size
- https://web.dev/articles/cls
- https://web.dev/articles/bfcache
- https://developer.chrome.com/docs/web-platform/prerender-pages
- https://infrequently.org/2024/01/performance-inequality-gap-2024/
- https://vercel.com/design/guidelines
- https://rviscomi.github.io/capo.js/user/rules/
- https://developer.chrome.com/docs/web-platform/long-animation-frames
- https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size
