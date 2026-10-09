# 04 Performance and Core Web Vitals

Sources: kb/research/frontend/04-performance.md. Opinion is marked (opinion).

## Principles
1. Users, not lab runs. Core Web Vitals are judged on field data at the 75th percentile of page loads, mobile and desktop separately (web.dev). A fast MacBook Lighthouse score proves nothing about a mid-range Android phone.
2. Diagnose before optimizing. Every metric decomposes into parts; fix the biggest part.
3. The cheapest byte is the one you never send. Budgets are set before design is final, not after launch.
4. Use the platform: priority hints, native lazy loading, bfcache and speculation rules beat custom JS.

## Thresholds (p75)
| Metric | Good | Poor | Measures |
|---|---|---|---|
| LCP | <= 2.5s | > 4.0s | loading of the largest text block or image in view |
| INP | <= 200ms | > 500ms | worst-ish interaction latency across the visit |
| CLS | <= 0.1 | > 0.25 | largest burst of unexpected layout shift |
INP replaced FID in 2024. Do not cite FID.

## LCP: fix by subpart
| Subpart | Target share | If too big, do this |
|---|---|---|
| TTFB | about 40% | CDN and edge caching for HTML, avoid redirects, stream HTML, static or ISR for marketing pages |
| Resource load delay | under 10% | Put the LCP image in the HTML (`<img src srcset>`), not CSS backgrounds or JS. `fetchpriority="high"`. Preload only if it must live in CSS/JS. Never lazy-load it. |
| Resource load duration | about 40% | AVIF/WebP, correct `sizes`, compress (quality 60 to 75 for photos is usually invisible; opinion), serve from the same origin or a preconnected one |
| Element render delay | under 10% | Remove render-blocking CSS and sync JS in head, inline critical CSS, avoid hiding content until JS hydrates (A/B test tools, "fade-in on load" animations) |
- Most slow LCPs on image heroes are load delay, not bytes: the image is discovered late (opinion, consistent with web.dev guidance).
- `fetchpriority="high"` on one, at most two, images per page (web.dev).
- Text LCP is usually blocked by fonts or CSS; see chapter 05 for `font-display`.
- Hero video: use a poster image as the LCP candidate, `preload="none"` or `metadata` on the video, and start playback after load (opinion).

## INP: keep every interaction under 200ms
- INP = input delay + processing + presentation delay (web.dev).
- Input delay: long tasks already running. Split hydration and third-party work; load third parties after interaction or idle.
- Processing: do the visible update first, then yield. Pattern:
```js
async function onFilterChange(value) {
  updateFilterChip(value);           // cheap, visible feedback now
  await yieldToMain();               // let the browser paint
  const rows = filterRows(value);    // heavy work after paint
  renderTable(rows);
}
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise(r => setTimeout(r, 0));
}
```
  `scheduler.yield()` resumes ahead of other queued tasks; Chrome and Edge 129, Firefox 142, not Safari, so keep the fallback (Chrome for Developers).
- Presentation delay: big DOMs and expensive styles. Lighthouse warns above about 800 body nodes and errors above about 1,400. Virtualize long lists; use `content-visibility: auto; contain-intrinsic-size: auto 500px;` on offscreen sections (the `auto` keyword reuses the last rendered size so the scrollbar does not jump; Baseline widely available since September 2023, MDN).
- Never read layout (`offsetHeight`, `getBoundingClientRect`) right after writing styles in the same task.
- React (opinion): wrap non-urgent state updates in `startTransition`, keep input state local to the input, memoize heavy lists. Debouncing hides slow rendering; it does not fix it.

## CLS: reserve space for everything
- Images and video: `width` and `height` attributes, or `aspect-ratio`.
- Ads, embeds, cookie bars, banners: fixed-size slots, or overlay them (position fixed) instead of pushing content.
- Fonts: matched fallback metrics (chapter 05).
- Animate `transform` and `opacity`, never `top`, `left`, `width`, `height`.
- Content inserted after a click is fine within 500ms (`hadRecentInput`); content inserted on scroll or after a fetch with no user input is not.
- Lab tools capture only load shifts. Check field CLS (CrUX, RUM) for shifts during scroll.

## Platform wins that are nearly free
- bfcache: no `unload` listeners (use `pagehide`), no `Cache-Control: no-store` except on sensitive pages, close WebSockets on `pagehide`. Back and forward then become instant, and restored loads reset CLS.
- Speculation rules for multi-page sites (Chromium only, harmless elsewhere):
```html
<script type="speculationrules">
{ "prerender": [{ "where": { "and": [
    { "href_matches": "/*" },
    { "not": { "href_matches": "/account/*" } },
    { "not": { "selector_matches": "[rel~=nofollow]" } } ] },
  "eagerness": "moderate" }] }
</script>
```
  `moderate` triggers after about 200ms hover or on pointerdown. Gate analytics with `document.prerendering` and the `prerenderingchange` event. Do not prerender pages with side effects (logout, add to cart links).
- `<head>` order per capo.js (chapter 01). A sync script above your CSS delays everything.
- `preconnect` to at most 2 or 3 critical third-party origins (opinion: each costs a connection).

## Budgets (starting points, opinion based on Alex Russell 2024)
| Site type | Total compressed, first load | JavaScript, compressed | Target |
|---|---|---|---|
| Marketing, content, e-commerce (markup-centric) | about 1.4 MiB | about 75 KiB | interactive in 3s on a P75 Android (Galaxy A51 / Pixel 4a class) at 7.2 Mbps, 94ms RTT |
| App (JS-heavy) | about 730 KiB | about 365 KiB | same device, 3s |
- Third-party scripts count inside the budget. Tag managers routinely blow it alone (opinion).
- Enforce in CI: Lighthouse CI or bundle-size checks fail the build when a budget is exceeded.

## Measure
- Field: `web-vitals` library (`onLCP`, `onINP`, `onCLS` with attribution build) sent to analytics; CrUX and Search Console for origin data.
- Lab: Chrome DevTools Performance panel with 4x CPU throttle and slow 4G; Lighthouse for regressions, not as the goal.
- Long Animation Frames (LoAF) entries report frames delayed over 50ms with per-script attribution (scripts over 5ms: source URL, function, forced layout time). Chrome and Edge 123+ only; use the web-vitals attribution build to read them (Chrome for Developers).

## Do and don't
| Do | Don't |
|---|---|
| `<img fetchpriority="high">` for the hero | `loading="lazy"` on the hero |
| `pagehide` listener | `unload` listener |
| reserve ad slot height | inject a banner above content after load |
| yield after the visible update | one 300ms click handler |
| budget in CI | "we'll optimize later" |

## Worked examples
1. Marketing site, mobile LCP 4.2s, hero is a CSS background image. Breakdown shows 1.9s resource load delay. Fix: move to `<img>` with `srcset`/`sizes` and `fetchpriority="high"`, remove the fade-in animation on hero text, inline 12 KB critical CSS, defer the tag manager. Expected result: load delay under 0.3s; LCP around 2.2s (estimate, verify in field data).
2. Dashboard, INP 450ms on filter changes, 6,000 DOM nodes. Fix: virtualize the table (render about 40 rows), move filtering into `startTransition`, update the chip immediately and yield, `content-visibility: auto` on off-screen charts.
3. News site with CLS 0.31. Causes: ads without slots, late web font, "subscribe" banner inserted at top. Fix: min-height slots per ad size, metric-matched fallback font with `font-display: optional` for body, banner as a fixed overlay at the bottom.

## Hand-offs
- Image and font specifics: chapter 05.
- Loading states, skeleton timing: design-ux, design-motion.
- Server rendering, caching and API latency (TTFB): design-data.
- Core Web Vitals as a ranking signal and crawlability: design-search.
