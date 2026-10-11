# Tests: design-frontend v0.2 (tester, Run 2, rendered)

Run 2026-10-10. Brief: `kb/briefs/frontend/07-measured-build-quality.md`. Run 1 (2026-10-09, text-only A/B on four written briefs) is in git history; this run replaces it with renders and measurements.

Task: take the two combined pages Davon picked (3 of 3, `kb/tests/combined.md`), refactor their code to the design-frontend standard **without changing their look**, and prove it. Starting files are copied unchanged into `kb/tests/design-frontend/before/`. Sources are `coffee.src.html` and `dashboard.src.html`; `build.mjs` inlines the fonts and writes `coffee.html`, `dashboard.html` and both `-states.html` sheets. Every number below comes from `sh kb/tests/design-frontend/run.sh` (outputs in `results/`), except the two experiments, which have their own folders.

Environment: Chromium 141 headless (playwright-core 1.56.1), 4 vCPU, shared with other agents. All exemplar hosts were refused by the proxy (403), so exemplar numbers come from the teardown files on `claude/exemplar-library-xfa3bl` (read, not copied), which record families and type values but not bytes.

## Verdict
**Pass**, with the gaps listed at the end. The gate holds on both pages. The build rubric scores 8 of 8 on both pages. The look is unchanged, so the exemplar rating stays where the combined test left it.

## 1. Gate

### Lint (`tools/lint.mjs`, every state; fails / warnings)
| Target | Before | After | Note |
|---|---|---|---|
| coffee, and its 4 `?state=` URLs | 0 / 21 each | 0 / 22 each | +1 sticky-focus: a false positive on the new skip link (below) |
| coffee-states sheet | 0 / 14 | 0 / 15 | +1 dark shadow: a false positive (a transparent shadow layer) |
| dashboard (default, compact) | 0 / 27 | 0 / 27 | |
| dashboard open=palette, open=sheet | 0 / 28, 0 / 34 | 0 / 28, 0 / 34 | |
| dashboard loading, empty, partial, viewer | 0 / 8, 8, 12, 28 | same | |
| dashboard-states sheet | 0 / 35 | 0 / 35 | |

0 fails before and after on all 19 targets (`results/lint-before.txt`, `results/lint-after.txt`). The two new warnings are lint limits, not page faults:
- sticky-focus: the skip link overlaps the sticky header box but sits on top of it (z-index 20). `elementFromPoint` at its centre returns the skip link, and a screenshot of it focused at 390 dark shows it fully visible.
- dark shadows: the check counts a layer whose color is transparent.

Both are proposed as lint fixes in `kb/reviews/design-frontend-pipeline-notes.md`.

### Markup gate (read)
Both pages hold items 1 to 7 and 20 to 22 of the skill's gate.
- Fixed on coffee:
  - **no skip link** (a gate miss the lint passed); added, with `main tabindex="-1"`;
  - the newsletter form had no `action`, `method` or `name`; it now works without JavaScript;
  - no `theme-color` or favicon; both added, the favicon as an inline SVG data URL.
- Dashboard already had a skip link.

### No visual change (`assets/pixel-diff.mjs`, tolerance 0)
Widths 390, 768, 1024 and 1440, light and dark, plus every review state.

| Target | Screenshots | Identical |
|---|---|---|
| coffee: page and 4 states | 40 | 40 |
| dashboard: page, loading, empty, partial, viewer, compact, palette, sheet | 64 | 64 |
| coffee-states sheet | 8 | 8 |
| dashboard-states sheet | 8 | 8 |
| **Total** | **120** | **120** |

These diffs run with one intended change switched off on the after page (`--inject-after`, the dark button fix below). Three intended changes are shown on their own in `diffs/intended/`:
1. **Dark primary-button highlight now renders.**
   - Before: FOUNDATIONS' dark `--shadow-1: none`, composed into `box-shadow: var(--highlight), var(--shadow-1)`, made the whole declaration compute to `none`.
   - After: a transparent shadow keeps the list valid.
   - Diff size: coffee 1440 dark, 704 pixels (max channel delta 20, every primary button); dashboard 1440 dark, 165 pixels (Share report).
2. **KPI strip, alerts and the chart/table split follow the content width.** These are container queries on `.content`, where they used to be viewport media queries.
   - At 793 to 1023 px the sidebar is a 56 px rail and the content is wider than at 1024. Before, the page showed 2 KPI columns there, then 4 at 1024 in less space. After, it shows 4.
   - 900 px light: 278,947 pixels differ and the page is 179 px shorter (1616 to 1437). Renders: `shots/before-dashboard-900-900-light.jpg` and `shots/dashboard-900-900-light.jpg`. This is the stress brief's answer: a container query.
3. **The chart tooltip moves with `translate`.** Before, it moved with `left`. No pixel change at rest; the CLS change is below.

Getting the diff to 0 found three bugs that design review could not see:
- **Container query `em`.** The content area has a 14 px font, so `44em` meant 616 px, and 4 KPI columns appeared at a 768 px viewport. Fixed with rem.
- **`:is(.num, td, kbd, time)`.** It gave `kbd` class weight, which beat the later `kbd` font reset. 98 pixels per shot; found by bisecting with `--inject`; fixed with a plain selector list.
- **`padding-inline` brought back the UA button padding-block.** Buttons grew 2 px; found with a computed-style diff. Fixed by keeping the symmetric shorthand.

Two more were found in the dark dialog diffs, at 11 to 62 pixels with a delta up to 7:
- A transparent blurred shadow layer still changes how a rounded corner is rasterised. Fixed by swapping the whole dark overlay recipe in the scheme block.
- The first bug-fix mask (`.btn-primary { box-shadow: none }`) also hid the pressed state's valid highlight. Fixed by narrowing it to `:not(:active):not(.is-active)`.

### Lab vitals (`assets/vitals.mjs`, median of 7 runs)
Mobile profile: Lighthouse defaults, 412x823 at DPR 1.75, 4x CPU, 150 ms RTT, 1.6/0.75 Mbps. The INP proxy uses scripted interactions:
- coffee: add 3 items, type an email, press Enter;
- dashboard: sort every column, switch density twice, Ctrl K, type, Esc, hover the chart.

| Page, profile | LCP (range) | LCP element | CLS | INP proxy | TBT | Wire |
|---|---|---|---|---|---|---|
| coffee mobile, before | 912 ms (884 to 936) | h1 | 0 | 56 ms | 26 ms | 94.0 KB |
| coffee mobile, after | 884 ms (868 to 944) | h1 | 0 | 48 ms | 41 ms | 93.1 KB |
| dashboard mobile, before | 856 ms (776 to 896) | answer paragraph | 0.023 | 80 ms | 116 ms | 46.3 KB |
| dashboard mobile, after | 816 ms (756 to 900) | answer paragraph | **0** | 88 ms | 122 ms | 46.4 KB |
| dashboard desktop, before | 200 ms (188 to 208) | answer paragraph | 0.009 | 56 ms | 0 | 46.3 KB |
| dashboard desktop, after | 228 ms (216 to 252) | answer paragraph | 0.004 | 48 ms | 0 | 46.4 KB |
| dashboard desktop, saved compact, before | 200 ms | answer paragraph | 0 to 0.074 per run | | | |
| dashboard desktop, saved compact, after | 236 ms | answer paragraph | 0.003 | | | |

All good (LCP 2.5 s or less, CLS 0.1 or less, INP 200 ms or less).
- **Mobile:** every change is inside run-to-run noise; the ranges overlap.
- **Dashboard CLS:** the tooltip shifts are gone. Mobile went from 0.023 to 0, desktop from 0.009 to 0.004. The 0.004 left is a font swap on the search field's `/` key hint.
- **Desktop LCP: +28 ms, and this is a measured trade, not noise.**
  - Cause: the dashboard's saved-density script now sits in `<head>` before the stylesheet.
  - Head-script experiment (`head-script-experiment/`, 7 runs each, interleaved):
    - in the head: CLS 0 in 7 of 7 runs with a saved compact density;
    - at the end of body: Chromium painted the default density first in 4 of 7 runs and then shifted the page head (CLS 0.008 to 0.074);
    - the same page without saved state: 0 to 0.006.
  - Price: about 40 ms later first paint for everyone; the dashboard paid 192 against 236 ms in the interleaved runs.
  - Coffee's `js` class only gates an off-screen animation, so it stayed at the end of body, where a head copy had cost 20 to 50 ms.
  - The combined dashboard never read the saved density at all. Its "before, saved compact" row therefore measures nothing; the per-run spread there (0 to 0.074) is first-paint timing noise.

### Bugs found and fixed (summary)
1. The dark primary-button highlight never rendered (a FOUNDATIONS token bug).
2. Coffee had no skip link.
3. The tooltip moved with `left`, adding layout shift.
4. The dashboard showed fewer KPI columns at 793 to 1023 px than at 1024.
5. The saved density was not persisted.

## 2. Build rubric (pass or fail)
| # | Item | Coffee | Dashboard | Evidence |
|---|---|---|---|---|
| 1 | Layers | pass | pass | `@layer reset, tokens, base, layout, components, (states,) utilities`; unlayered rules 0 (`results/audit-*.json`); reduced-motion and forced-colors `!important` in `reset` |
| 2 | Tokens | pass | pass | css-audit 0 fails. Before: coffee raw-color 1, primitive-in-component 9, raw-space 1; dashboard raw-color 1, primitives 3, raw-space 3, px font-size 2, px type tokens 7 |
| 3 | Theming | pass | pass | `light-dark()` on every color token; coffee keeps 3 non-color values (grain opacity, blend, smoothing), the dashboard 2 elevation recipes, in one scheme block |
| 4 | Responsiveness | pass | pass | range syntax in em (before: 4 and 7 min/max queries); dashboard 4 container queries on 2 containers |
| 5 | Input | pass | pass | hover-unguarded 0 (dashboard before: 14) |
| 6 | Critical path | pass | pass | reported below; CSS cut by 1.2 and 0.9 KB gzip; font delivery kept inline, with the reason |
| 7 | Fonts | pass | pass | lint `fallback` passes; CLS 0 (coffee), 0.004 (dashboard, a key-hint swap) |
| 8 | Runtime | pass | pass | tooltip on `translate` in a rAF; saved density applied before paint (CLS 0.003 with saved compact) |

Remaining css-audit warnings:
- coffee: 7 physical properties, all art and chart coordinates (`left: 27%` on the bag label and the like), kept physical on purpose;
- dashboard: 0 (before: 18 physical, 2 `100vh`, 1 id selector, 1 unguarded motion).

## 3. Weight and critical path (`assets/weight.mjs`, KB = 1024 bytes, gzip)
| | Total raw | Total gzip | Before first paint | Before LCP | Fonts | CSS | SVG | Script |
|---|---|---|---|---|---|---|---|---|
| coffee before | 197.9 | 93.8 | 53.1 | 53.5 | 43.8 | 7.8 | 35.0 | 1.3 |
| coffee after | 197.5 | 92.9 | 52.0 | 52.4 | 43.8 | 6.6 | 35.0 | 1.3 |
| dashboard before | 108.3 | 46.1 | 36.5 | 38.1 | 27.6 | 7.9 | 1.3 | 5.4 |
| dashboard after | 109.9 | 46.2 | 36.3 | 37.9 | 27.6 | 7.0 | 1.3 | 5.9 |

- Fonts are 82 percent of coffee's and 76 percent of the dashboard's bytes before first paint. The refactor cannot move them without a visible change (next section).
- The dashboard's script grew 0.5 KB: density persistence, the ResizeObserver redraw and the rAF tooltip.

## 4. Font delivery experiment (`font-experiment/`, mobile, 7 runs first view, 5 repeat view)
| Variant | Coffee first / repeat LCP | Dashboard first / repeat LCP |
|---|---|---|
| Inline base64 in the head (as shipped) | 1036 / 832 ms | 968 / 912 ms |
| Inline data moved to end of body | 792 ms / not run | not run |
| External hashed WOFF2 + preload, 1-year immutable | 1160 / 612 ms | 1020 / 624 ms |

- Dashboard repeat-view wire: 46.3 KB inline against 17.7 KB external.
- The end-of-body variant paints 244 ms sooner, but swaps the 96 px headline in front of the reader. That is a visible change, so it is out for a "same look" refactor.
- Decision (opinion, from these numbers):
  - the test pages stay self-contained (design-director rule), so inline;
  - production coffee (one visit) keeps inline or same-origin preload;
  - production Tally (daily visits) ships external hashed files.
- Absolute LCPs here are about 130 ms higher than in section 1 because they were measured in an earlier session (machine load). Compare inside a column, not across tables.

## 5. Exemplar comparison (honest)
- **Look:** unchanged by design (120 of 120 identical). Exemplar closeness stays where `kb/tests/combined.md` left it:
  - coffee below apple.com and family.co, mainly for lack of photography;
  - Tally close to Linear and Stripe, short of a drawn icon set and a signature interaction.
  - No claim of visual gain.
- **Fonts against the teardowns** (`kb/teardowns/*.json`, 2026-10-10, families and faces only):

  | Site | Faces loaded |
  |---|---|
  | Linear | Inter Variable plus Berkeley Mono (2) |
  | Vercel | Geist plus Geist Mono (2) |
  | Stripe | sohne-var plus SourceCodePro (2) |
  | Raycast | Inter, GeistMono, JetBrains Mono (3) |
  | Apple MacBook Air | SF Pro Display, Text and Icons (10) |

  Our pages: coffee 2 Newsreader files plus the system sans, dashboard 1 Inter file plus system mono. That is in the exemplars' range of 2 to 3 families, below Apple's 10 faces.
- **Tokens against the teardowns:**
  - Linear and Vercel each expose 160 root custom properties, Raycast 82, Apple 88, Stripe 0 at the root. Ours are 124 and 126.
  - None of the five uses `light-dark()` at the root.
  - Linear also sets two shadow tokens to `none` (`--btn-overlay-shadow: none`), the pattern that broke our dark highlight. Whether it is composed into a list there is unknown.
  - Reduced-motion rules: Apple 40, Vercel 16, Linear 14, Raycast 10, Stripe 0. Ours: one global override in `reset`.
- **Not measured:** exemplar byte weight, font loading strategy and vitals. The hosts were blocked, and the teardowns do not record them. Any claim that we are lighter or faster than an exemplar would be invented, so there is none.

## 6. Gaps
1. The lint misses skip links and reports two false positives (transparent shadows, stacking); proposed fixes in the pipeline notes.
2. The dashboard's 0.004 CLS is a font swap on the `/` key hint; the metric fallback is not exact for that glyph. Not fixed (it would need a fallback-metrics change that alters the look before the swap).
3. Lab only: no field data, one Chromium, a machine shared with other agents. LCP medians moved by about 40 ms between sessions on the same file, so read deltas within one run.
4. Exemplars not measured (403). This needs network access to linear.app, vercel.com, stripe.com, apple.com and raycast.com.
5. No screen reader or forced-colors pass in this run (forced-colors rules exist in `reset`; manual check outstanding).

Shots: `shots/` (390 and 1440, light and dark, both pages and both state sheets; 900 before and after). Copies: `/mnt/project-files/design-kb/wave/frontend/`.
