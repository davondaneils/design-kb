# Research 07: Measured build quality

Researcher notes for brief `kb/briefs/frontend/07-measured-build-quality.md`. Accessed 2026-10-10 unless noted. Tiers per `.claude/agents/researcher.md`. Measurements were made in this environment (Chromium 141 headless via playwright-core 1.56.1, 4 vCPU Xeon 2.8 GHz) with the scripts in `skills/design-frontend/assets/`; every measured claim names its script and output file.

Network limit: every exemplar host (linear.app, vercel.com, stripe.com, and the rest) was refused by the egress proxy on 2026-10-10 (HTTP 403 on CONNECT), so exemplar page weight and font loading could not be measured. The exemplar teardowns on branch `claude/exemplar-library-xfa3bl` (`kb/teardowns/*.md`, read, not copied) record families and type values but not bytes or loading strategy.

## Key findings

1. **Lab method.** Lighthouse's mobile default is 150 ms RTT, 1.6 Mbps down, 750 Kbps up and a 4x CPU slowdown on a 412x823 viewport at DPR 1.75. `vitals.mjs` applies the CPU and bandwidth parts with CDP and adds the latency in its own server, because CDP's latency setting was not applied to 127.0.0.1 in this Chromium (measured: TTFB 18.5 ms with 150 ms latency set; `scratchpad dbg.mjs`). Lab LCP from this method is a regression check, not a field p75.
2. **INP proxy.** INP is the longest interaction, ignoring one per 50; only clicks, taps and key presses count. Event Timing entries share an `interactionId` per interaction; the observer threshold can go down to 16 ms. The proxy is the longest scripted interaction.
3. **Inline SVG is never an LCP candidate.** Both test pages draw their hero art as inline SVG, so their LCP element is text (coffee: the `h1`; dashboard: the answer paragraph). Measured with `vitals.mjs`: LCP element `h1#hero-title` and `p.answer`. Consequence: the hero's LCP depends on HTML bytes and font delivery, not on image optimisation.
4. **Font delivery is the critical path on a self-contained page.** `weight.mjs` on the combined coffee page: 53.1 KB gzip must arrive before the end of `<head>`, of which 43.8 KB is the two inlined Newsreader files (base64). The first round trip carries about 14 KB (MDN).
   Experiments (`vitals.mjs`, mobile, 7 runs first view, 5 runs repeat view, medians; files in the scratchpad, summarised in `kb/tests/design-frontend.md`):

   | Variant | Coffee first view LCP | Coffee repeat view LCP | Dashboard first view LCP | Dashboard repeat view LCP |
   |---|---|---|---|---|
   | Fonts inlined in `<head>` (as built) | 1036 ms | 832 ms | 968 ms | 912 ms |
   | Inline font data moved to the end of `<body>` | 792 ms | not run | not run | not run |
   | External hashed woff2 files with `preload`, cached a year | 1160 ms | 612 ms | 1020 ms | 624 ms |

   Wire bytes on the repeat view: dashboard 46.3 KB inlined against 17.7 KB external (fonts served from cache). Reading: inlining wins the first view by 50 to 120 ms (one fewer request), external files win every repeat view by 220 to 290 ms and 62 percent of the bytes. Moving inline font data out of the head paints 244 ms sooner but shows the fallback face first, a visible swap of the 96px display headline (metric fallbacks keep CLS at 0).
5. **Shadow tokens set to `none` break composed shadows.** FOUNDATIONS sets the dark `--shadow-1` to `none`. Composed as `box-shadow: var(--highlight), var(--shadow-1)`, Chromium computes the whole declaration to `none` (measured with getComputedStyle: light `rgba(255,255,255,0.14) 0 1px 0 0 inset, rgba(39,32,26,0.06) 0 1px 2px 0`; dark `none`). The dark-theme highlight on primary buttons never rendered on either combined page. Fix: a transparent shadow color (`0 1px 2px transparent`) keeps the list valid and paints nothing. MDN's current grammar for `box-shadow` is in flux (it lists `none` inside `<spread-shadow>`), so trust the computed value, not the grammar.
6. **Pointer-driven UI positioned with `left` adds layout shift.** Hovering the dashboard chart moved the tooltip with `style.left`; `vitals.mjs` recorded four shifts of 0.0002 to 0.0021 each (sources `div#tooltip`) during a 0.6 s hover. Only discrete input (tap, click, keypress) sets `hadRecentInput`; continuous input does not. Moving the tooltip with `translate` removes the shifts; web.dev recommends `transform: translate()` over changing `top`, `right`, `bottom` or `left`.
7. **`em` in a container query is the container's font size.** The spec evaluates relative units in container conditions against the query container's computed values. The dashboard's content area has a 14px font, so `@container (width >= 44em)` fired at 616px, not 704px (measured: four KPI columns at a 768px viewport; pixel diff 235,410 differing pixels and a 158px shorter page). Media queries resolve `em` against the initial font size, so the same number means different widths in the two rules. Use `rem` (or px) in container queries.
8. **`:is()` takes its most specific argument's specificity.** Refactoring `.num, td, kbd, time { tabular }` to `:is(.num, td, kbd, time)` gave `kbd` class weight, so it beat the later `kbd { font: ... }` shorthand that had been resetting `font-variant-numeric`; the kbd glyph widths changed and moved two letters by a fraction of a pixel (98 differing pixels per screenshot, found by bisecting with `pixel-diff.mjs --inject`). MDN: `:is()` "takes the specificity of its most specific argument"; `:where()` is 0.
9. **Converting `padding: 0 X` to `padding-inline: X` brings back UA padding.** Buttons have a UA `padding-block` of 1px in Chromium; `padding-inline` alone leaves it, so `.btn` grew by 2px (computed style diff). A symmetric `padding: 0 X` is already writing-mode safe: only asymmetric inline values need logical properties.
10. **Layer order and `!important`.** Unlayered styles beat layered ones; normal declarations follow the declared layer order; important declarations reverse it. So `!important` user-preference overrides (reduced motion, forced colors) belong in the first layer, where they beat everything.
11. **`light-dark()`** returns the first value in a light scheme and the second in dark; it needs `color-scheme: light dark`; it accepts two colors (and, newer, two images); Baseline 2024, newly available since May 2024. Non-color tokens (opacity, blend modes, `none`) cannot use it.
12. **Container queries** (`container-type: inline-size`) are Baseline widely available since February 2023; `inline-size` applies style and inline-size containment, and the element's inline size "can be computed in isolation, ignoring the child elements". `:has()` is Baseline widely available since December 2023; MDN warns that broad anchors (`body`, `:root`, `*`) are costly on DOM mutations.
13. **Viewport breakpoints can invert available width.** On the dashboard, the content area is 934 px wide at a 1023 px viewport (56px rail) and 719 px at 1024 (240px sidebar). A viewport rule showed two KPI columns at 1023 and four at 1024. Measured with `getBoundingClientRect` (`scratchpad dbg2.mjs`).
14. **Placement of the saved-state script (M9).** First measurement was wrong: the combined dashboard never read the saved density, so its CLS of 0 with `--storage tally-density=compact` did not test anything. Re-measured on the refactored dashboard, desktop profile, 7 runs each, interleaved: state script at the end of body, CLS 0.005 to 0.074 in 4 of 7 runs (Chromium painted the default density first; sources: page head, toolbar, search); merged into the top of the app script, 5 of 7; in the head, 0 in 7 of 7. Control: the same end-of-body page without saved state measured 0 to 0.006, and a rerun with saved state 0.008 to 0.074 in 4 of 7, so the larger shifts come from the density switch. LCP, default density: head 236 ms against 184 to 192 ms at the end of body; after `<style>` 272 to 276 ms; at body start 268 to 288 ms. Coffee with its `js` class: head 268 to 288 ms against 240 to 248 ms at the end of body. Mobile medians stayed inside run-to-run noise. Results and builder: `kb/tests/design-frontend/head-script-experiment/`.

## Claim table

| # | Claim | Quote (under 40 words) | URL | Date | Tier | Status |
|---|---|---|---|---|---|---|
| C1 | Lighthouse mobile network preset | "Latency: 150ms" ... "Throughput: 1.6Mbps down / 750 Kbps up." | https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md | 2026-10-10 | 1 | consensus |
| C2 | Lighthouse CPU default | "a constant 4x CPU multiplier" | https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md | 2026-10-10 | 1 | consensus |
| C3 | Lighthouse mobile viewport 412x823, DPR 1.75 | "width: 412, height: 823, ... deviceScaleFactor: 1.75" | https://raw.githubusercontent.com/GoogleChrome/lighthouse/main/core/config/constants.js | 2026-10-10 | 1 | consensus |
| C4 | CDP CPU throttling | "Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc)." | https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/browser_protocol.json | 2026-10-10 | 1 | consensus |
| C5 | INP thresholds | "An INP below or at 200 milliseconds means a page has good responsiveness." | https://web.dev/articles/inp | 2026-10-10 | 1 | consensus |
| C6 | INP outlier rule | "ignore one highest interaction for every 50 interactions" | https://web.dev/articles/inp | 2026-10-10 | 1 | consensus |
| C7 | INP inputs | "Hovering, zooming, and scrolling ... These interactions are not observed for the purposes of INP." | https://web.dev/articles/inp | 2026-10-10 | 1 | consensus |
| C8 | interactionId groups events | "the events share the same interactionId" | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming/interactionId | 2026-10-10 | 1 | consensus |
| C9 | durationThreshold floor | "Defaults to 104ms and is rounded to the nearest of 8ms. Lowest possible threshold is 16ms." | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe | 2026-10-10 | 1 | consensus |
| C10 | SVG not an LCP candidate | "<svg> elements are not considered LCP candidates at this time" | https://web.dev/articles/lcp | 2026-10-10 | 1 | consensus; may change ("at this time") |
| C11 | LCP stops at input | "The browser will stop reporting new entries as soon as the user interacts with the page" | https://web.dev/articles/lcp | 2026-10-10 | 1 | consensus |
| C12 | LCP thresholds | "2.5 seconds or less" ... "poor values are greater than 4.0 seconds" | https://web.dev/articles/lcp | 2026-10-10 | 1 | consensus |
| C13 | CLS session window | "with less than 1-second in between each shift and a maximum of 5 seconds for the total window duration" | https://web.dev/articles/cls | 2026-10-10 | 1 | consensus |
| C14 | CLS thresholds | "Good CLS values are 0.1 or less. Poor values are greater than 0.25." | https://web.dev/articles/cls | 2026-10-10 | 1 | consensus |
| C15 | Recent input is discrete only | "Continuous interactions such as scrolls, drags, or pinch and zoom gestures are not considered \"recent input\"." | https://web.dev/articles/cls | 2026-10-10 | 1 | consensus |
| C16 | Transform instead of position | "avoid changing the top, right, bottom, or left properties and use transform: translate() instead" | https://web.dev/articles/cls | 2026-10-10 | 1 | consensus |
| C17 | First 14 KB | "it's important ... to include everything the browser needs to start rendering a page ... in the first 14KB" | https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work | 2026-10-10 | 1 | consensus (rule of thumb; depends on initial congestion window) |
| C18 | Do not inline font files | "Inlining the font files themselves is not recommended." | https://web.dev/articles/font-best-practices | 2026-10-10 | 1 | consensus; measured trade-off in finding 4 |
| C19 | Inline font declarations | "Most sites would strongly benefit from inlining font declarations and other critical styling in the <head>." | https://web.dev/articles/font-best-practices | 2026-10-10 | 1 | consensus |
| C20 | swap vs optional | "font-display: swap delays text render the least" ... optional: "text render is delayed for no longer than 100ms" | https://web.dev/articles/font-best-practices | 2026-10-10 | 1 | consensus |
| C21 | light-dark() needs color-scheme | "the color-scheme must have a value of light dark, usually set on the :root pseudo-class" | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark | 2026-10-10 | 1 | consensus |
| C22 | light-dark() Baseline | "Baseline 2024 ... Since May 2024, this feature works across the latest devices and browser versions." | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark | 2026-10-10 | 1 | consensus |
| C23 | Unlayered beats layered | "Styles that are not defined in a layer always override styles declared in named and anonymous layers." | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer | 2026-10-10 | 1 | consensus |
| C24 | Important reverses layer order | "the priority is reversed when the !important flag is used" | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer | 2026-10-10 | 1 | consensus |
| C25 | @layer Baseline | "It's been available across browsers since March 2022." | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer | 2026-10-10 | 1 | consensus |
| C26 | :has() Baseline and cost | "available across browsers since December 2023" ... "complex or poorly constrained selectors can lead to expensive computations" | https://developer.mozilla.org/en-US/docs/Web/CSS/:has | 2026-10-10 | 1 | consensus |
| C27 | container-type inline-size | "The inline size of the element can be computed in isolation, ignoring the child elements" | https://developer.mozilla.org/en-US/docs/Web/CSS/container-type | 2026-10-10 | 1 | consensus |
| C28 | container queries Baseline | "available across browsers since February 2023" | https://developer.mozilla.org/en-US/docs/Web/CSS/container-type | 2026-10-10 | 1 | consensus |
| C29 | Units in container conditions | "are evaluated based on the the computed values of the query container" | https://www.w3.org/TR/css-contain-3/ | 2026-10-10 | 1 | consensus (spec) |
| C30 | Range syntax | "you can either use the inclusive min- and max- prefixes or the more concise range syntax operators <= and >=" | https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries/Using_media_queries | 2026-10-10 | 1 | consensus |
| C31 | Range exclusivity | "The range comparisons above are inclusive. To exclude the comparison value, use < and/or >." | https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries/Using_media_queries | 2026-10-10 | 1 | consensus |
| C32 | :is() specificity | "it takes the specificity of its most specific argument" | https://developer.mozilla.org/en-US/docs/Web/CSS/:is | 2026-10-10 | 1 | consensus |
| C33 | Exemplar families | Linear "Inter Variable for text ... Berkeley Mono"; Vercel "GeistSans ... and Geist Mono. Nothing else."; Stripe "sohne-var ... SourceCodePro" | branch `claude/exemplar-library-xfa3bl`, `kb/teardowns/{linear-home,vercel-home,stripe-home}.md` | 2026-10-10 | 2 | measured by the teardown stream |
| C34 | Linear's hero product shot is HTML | "The hero product shot is real HTML, not an image" | branch `claude/exemplar-library-xfa3bl`, `kb/teardowns/linear-home.md` | 2026-10-10 | 2 | measured |

## Measured claims (method and output)
| # | Claim | Script | Output |
|---|---|---|---|
| M1 | LCP elements are text on both pages | `assets/vitals.mjs` | `kb/tests/design-frontend/results/vitals-*.json` (`lcpElement`) |
| M2 | Head carries 53.1 KB gzip on coffee, 36.5 on dashboard | `assets/weight.mjs` | `results/weight-before*.json` |
| M3 | Font delivery experiment | `assets/vitals.mjs` (`--repeat`) on variants built by `scratchpad/exp/split.py` | table in finding 4; reproduced in `kb/tests/design-frontend.md` |
| M4 | Dark `none` shadow invalidates the list | `getComputedStyle` (scratchpad `cs.mjs`) | finding 5 |
| M5 | Tooltip shifts | `assets/vitals.mjs` hover step | baseline run, finding 6 |
| M6 | Container query `em` | `assets/pixel-diff.mjs` and `getBoundingClientRect` | finding 7 |
| M7 | `:is()` specificity side effect | `assets/pixel-diff.mjs --inject` bisection | finding 8 |
| M9 | Head state script: CLS 0 instead of up to 0.074 with saved state, about 40 ms later first paint | `assets/vitals.mjs --profile desktop [--storage]` on variants from `head-script-experiment/variants.py` | `kb/tests/design-frontend/head-script-experiment/*.json` |
| M8 | UA button padding | computed-style diff (scratchpad `csdiff.mjs`) | finding 9 |

## Conflicting views
- web.dev says do not inline font files; the self-contained test-page rule in design-director requires it. Measured: inlining is right for a single first visit, wrong for an app with repeat visits (finding 4).
- Logical properties everywhere (skill v0.1 rule 18) against the measured cost of mechanical conversion (finding 9). Opinion: convert inline-axis asymmetric values; leave block axis and symmetric shorthands.

## Likely to change
- LCP candidates ("at this time" for SVG).
- `box-shadow` grammar and `none` in lists (CSS Backgrounds 4).
- CDP network emulation: `Network.emulateNetworkConditions` is marked deprecated in favour of `emulateNetworkConditionsByRule`, which this Chromium does not have yet.
