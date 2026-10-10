# Tests: design-layout

## Run 2: rendered slice, v0.2 (2026-10-10)

Briefs and rubric: `kb/briefs/layout/06-pacing-signature-and-phone-editing.md` (editor-in-chief). Pages, lint JSON, state sheets and screenshots: `kb/tests/design-layout/`. Build: `node kb/tests/design-layout/build.mjs`. Metrics: `node kb/tests/design-layout/measure-layout.mjs <pages>`.

**Baseline and clean context.** The task was to improve the current best pages, so the baseline is not a without-skill page: it is `kb/tests/combined/coffee.html` and `dashboard.html`, which already had every other domain applied and won Davon's round 2 ranking 3 of 3. The with-layout pages started as byte copies of their sources and changed only layout (grid, order, proportion, phone and tablet edits) plus the smallest content moves those required (one new dashboard pane, one table column, one shortened sentence). The same agent wrote the skill and the pages; no subagent tool was available. Treat the judging below as the builder's opinion.

**Network.** Exemplar hosts still blocked; comparisons are from memory. Google Fonts and npm now work (coordinator note), but this run changed no type: Newsreader and Inter stay as shipped by the typography wave. Photo hosts blocked; no photography.

### What changed (design-director > playbook > design-layout 06)
**Coffee.** Flatplan before: hero L, band L, cards M, statement Q, chart M, steps Q, ledger Q, footer Q. After: hero L, ruled index M, band L (moved after the prices it undercuts), statement Q, chart L (paper bleeds right, axis labels hang in the gutter), steps Q (numerals hang in the margin column on a subgrid), ledger L (2.3x numeral beside a table whose rules are drawn to scale), footer Q. One 12-column grid with a margin column (1 to 3) and body (4 to 12) in every section; the hero, band and ledger share the 7 + 5 split. Phone: action moved before the art in source order, logistics line hidden as a duplicate, art cropped to 1:1, cards to index rows with 96px thumbnails, chart 240px, footer lists side by side. Tablet: art at half width with facts stacked beside it. Container query on the art drops only repeated annotations.
**Dashboard.** Alerts as one-line rows in one panel; chart 2fr plus a new "Active users by platform" pane 1fr (the evidence for the iOS warning, beside the trend) from 1280, stacked below; table full width with a Change column (arrow, sign, and the word "down"); content capped at 1600px; phone chips shortened to one line; average time deferred to "All pages" on phone rows.

### Lint (`node tools/lint.mjs`), before and after
| Target | Before (combined) | After (design-layout) |
|---|---|---|
| coffee.html | PASS, 0 fail, 21 warn | PASS, 0 fail, 21 warn |
| coffee.html `?state=` added, subscribed, error, sending | PASS, 0 fail each (combined.md) | PASS, 0 fail, 21 warn each |
| coffee-states.html | PASS, 0 fail, 14 warn | PASS, 0 fail, 12 warn |
| dashboard.html | PASS, 0 fail, 27 warn | PASS, 0 fail, 29 warn |
| dashboard.html `?state=` loading, empty, partial, viewer, `?density=compact`, `?open=` palette, sheet | PASS, 0 fail each (combined.md) | PASS, 0 fail each (9, 9, 13, 30, 29, 31, 34 warn) |
| dashboard-states.html | PASS, 0 fail, 35 warn | PASS, 0 fail, 35 warn |
Warnings are the same families as before: touch targets between 24 and 44px at 390 and fluid display sizes (allowed by FOUNDATIONS). The two extra dashboard warnings (diffed from the JSON): the new Change sort button, and the table's "All pages" link, which the lint now reports under a new selector because the table moved out of the split row.

Fails caught during the build and fixed (the loop working):
1. `measure`: the ledger's statement ran 35 characters per line over three lines. Shortened to two lines ("the Fairtrade minimum, for every pound of green coffee").
2. `targets`: alert links at 22px tall after a density squeeze (padding 4 to 2px), failing WCAG 2.5.8 on all 8 dashboard URLs. Padding restored; the lesson is now a decision rule.
3. Judged, not linted: the container query first hid "60 bags this season", a fact stated nowhere else (critic catch). Now hides only the repeated lot number.

### Measure (52ch), confirmed
`kb/research/typography/measure-cpl.mjs` re-run: `52ch` = 63 to 68 characters in all eight faces, `66ch` = 81 to 86. Every body paragraph on both pages passes the lint's 45 to 75 band at 1440 and stays under 75 at 390. FOUNDATIONS v0.3 is right; no change proposed.

### Measured layout (`measure-layout.mjs`, light, 900px viewport)
| Metric | Before | After |
|---|---|---|
| Coffee height at 390 | 6,738px | 5,574px (17 percent shorter, no unique fact removed) |
| Coffee primary action bottom at 390 | 1,078px (second screen) | 476px (first screen) |
| Coffee primary action bottom at 768 | 1,471px | 591px |
| Coffee height at 768 | 5,924px | 5,169px |
| Coffee: next section top at 1440 | 954px (band, below the fold: false floor) | 766px (shop label at about 866px and heading at about 880px peek above 900) |
| Coffee distinct left text edges at 1440 | 11 (6 used 3+ times) | 8 (5 used 3+ times) |
| Dashboard 1440: chart row top | 593px, chart only (5fr) next to the table (6fr) | 591px, chart (2fr) plus its explainer pane (1fr) |
| Dashboard 1440: in the first 900px | answer, KPIs, alerts, top of chart and table | answer, KPIs, alerts, chart and the platforms pane nearly whole |
| Dashboard height at 390 | 1,954px | 2,236px (one new pane; toolbar one line instead of two) |

### Judged items (fundamentals first)
- Not color alone: Change column and platform deltas carry an arrow, a sign and, when falling, the word "down"; the iOS row carries a warning icon with sr-only text. Holds.
- One primary action per view: coffee hero "Start a subscription" (band CTA is its own view); dashboard "Share report". Holds.
- Reading order: DOM order unchanged in meaning at every width; the hero's source order now puts the actions before the art at every width. Holds.
- Consistency: one grid, one radius family (lint), edges measured above. Holds.
- Both themes: dark renders checked (coffee 390 and 1440, dashboard 390 and compact 1440). Rules to scale, the right-bleeding chart paper and pane tints remap correctly. Holds.
- States: state sheets rebuilt; the coffee sheet now shows index rows in rest, hover and focus. No state shifts layout (lint). Holds.

### Exemplar comparison (from memory; hosts blocked)
| Page | Closest exemplars | Rating | Why, in the pixels |
|---|---|---|---|
| Coffee | apple.com product pages; family.co | **Clearly below, closer than before** | The middle now has three moments a viewer remembers (the ruled index, the right-bleeding roast curve, the 2.3x ledger with rules to scale) and alternates loud and quiet instead of fading. The grid is visible: labels, captions and numerals in one margin. What still separates it from Apple: no photograph of the bag, the roaster or the farm (layout can frame a photo, not replace one); the index rows still look like a well-set list rather than product photography; the band's orange field is still the only color moment. Against family.co the restraint is close; the craft of motion between sections is absent. |
| Dashboard | Stripe Dashboard home, Vercel overview | **Close** | Answer first, KPI strip, alert rows, a 2:1 trend-plus-explainer row and a full-width table is the exemplar skeleton. The pane turns the iOS warning from a claim into evidence on the same screen. Still short: generic 1.5px icons, no product-specific chart interaction, the pane leaves about 60px of air above its footnote at 1440 (rows stretch to the chart), and the wide table's Page column still holds more white space than data. |

### Verdict
- **Fundamentals: pass** (lint 0 fails on 2 pages, 11 state URLs and 2 state sheets; judged rows hold).
- **Layout rubric (brief 06): pass on pacing, signature, grid, phone and dashboard criteria; measurably better than the combined baseline** on every layout metric except dashboard phone length, which grew by the new pane.
- **Against the exemplar bar: dashboard close; coffee still clearly below,** now for reasons outside layout (photography first, then motion). Ship decision for design-layout v0.2: cleared as a component, pending Davon's blind ranking of `kb/tests/design-layout/blind/` (key: `kb/tests/design-layout-blind-key.md`).

### Gaps sent back (and status)
| # | Gap | Status |
|---|---|---|
| G1 | No tablet rule (768 render: a 700px square bag) | Fixed: reference 06 decision rule, page updated |
| G2 | Viewport media queries for annotations on art that changes size by column | Fixed: container query rule |
| G3 | Density squeeze broke a 24px target | Fixed: decision rule and expert move 13 |
| G4 | Short panel in a stretched row still shows air above its pinned footnote | Open: either distribute rows (`align-content: space-between`) or give the pane a fourth row of real content; judged minor |
| G5 | Wide tables at 1440 keep a white-space-heavy first column | Open, hand-off to design-product-ui (column width policy for wide panels) |
| G6 | Motion between sections (Apple's pacing is partly motion) | Out of scope; design-motion |

### Screenshots
`kb/tests/design-layout/shots/`: `coffee-{390,1440}-{light,dark}.png`, `coffee-state-added-*`, `coffee-states-*`, `dashboard-{390,1440}-{light,dark}.png`, `dashboard-density-compact-*`, `dashboard-state-loading-*`, `dashboard-states-*`. Before: `kb/tests/combined/shots/`. Copies of the four headline shots: `/mnt/project-files/design-kb/wave/layout/`.

---

## Run 1: text-only test (v0.1, 2026-10-09)

Kept for history. Superseded by run 2, which judged rendered pages.


Method: three realistic briefs, each answered once as a strong generic assistant would (no skill loaded) and once following skills/design-layout. Scored on a rubric taken from the skill's own rules. The fundamentals gate is scored first; a gate miss caps the total at 5/10.

Rubric (10 points): Gate pass (required, else cap 5) | Specificity: tokens, real numbers, CSS (3) | Accessibility and responsive (3) | Fit to brief and hierarchy (2) | Expert moves a top studio would apply (2).

---

## Brief 1: "Spacing feels off on our settings page"
Context given: settings page in a SaaS app. Labels 12px above inputs, 16px between fields, 20px card padding, three filled buttons (Save, Reset, Cancel) bottom right, 72px sticky header, sections separated by 1px lines.

### Generic answer (summary of a strong unaided response)
"Use an 8px grid. Increase spacing between fields to 24px and reduce label spacing to 8px. Use consistent card padding of 24px. Consider making Reset and Cancel secondary buttons. Add more white space between sections, perhaps 32px, and you could remove the dividers. Make sure the layout is responsive."

### With-skill answer (summary)
Audit in gate order, current to fixed:
1. Off-scale: card padding 20 to 24 (`--space-6`).
2. Ambiguous grouping: label 12 / field gap 16 are one step apart, so labels float. Fix: label to input 8 (`--space-3`), field to field 24 (`--space-6`), section to section 48 (`--space-8`). Between-group gap is now 3x the inside gap.
3. Lines as grouping: remove the 1px section dividers; the 48 gap plus a section heading (48 above, 16 below, heading binds down) does the job.
4. Hierarchy: one filled button. Save filled (trailing), Cancel as outline, Reset as a text link on the leading side, separated from Save so it is not hit by accident (NN/g: unrelated actions in a routine group are missed or misfired).
5. Accessibility: 72px sticky header hides focused fields when tabbing upward; add `scroll-padding-top: 88px` (header plus 16). Under 500px viewport height, un-stick it. Buttons at least 40px tall (24px WCAG minimum met); 44 on touch.
6. Measure: help text capped at 66ch; form container 560px max rather than spanning the card.
7. Code: `.form { display: grid; gap: var(--space-6); max-inline-size: 560px }`, `.field { display: grid; gap: var(--space-3) }`, `.section + .section { margin-block-start: var(--space-8) }` owned by the parent, not by components.
8. Optical: label text box trimmed (`text-box: trim-both cap alphabetic`) so the 8px reads as 8px.

### Scores
| | Gate | Specificity | A11y and responsive | Fit and hierarchy | Expert | Total |
|---|---|---|---|---|---|---|
| Generic | Fail (sticky header focus not addressed; three filled buttons left only "considered") | 2 | 0 | 1 | 0 | 5 (capped) |
| With skill | Pass | 3 | 3 | 2 | 2 | 10 |

---

## Brief 2: "Pricing page layout for a 3-tier SaaS with 30 features, mobile too"

### Generic answer (summary)
"Three columns side by side with the middle plan highlighted as Most Popular. List features under each plan with check marks. Add a monthly/annual toggle. On mobile, stack the columns. Add an FAQ at the bottom and a comparison table for all features."

### With-skill answer (summary)
- Structure: 12-col grid, 1280 content box with `min(1280px, 100% - 64px)`. Three plan cards spanning 4 cols each, gap 24 (32 at xl).
- Cards share rows with `grid-template-rows: subgrid` (name, price, who-it's-for line, CTA, 5 differentiators), so CTAs align regardless of copy length. Concentric radius: card 16, padding 24, inner elements square or 8 at most.
- Hierarchy: middle "Team" is recommended with the only filled CTA and a label; others outline. Price at the largest size on the card, "/month" muted and smaller. Each card lists 5 differentiators, not 30.
- Billing toggle above the cards, savings stated ("2 months free"); toggle is a real radio group, 44px targets on touch.
- Comparison table below: 30 features in 5 collapsible groups of about 6; sticky header row with plan names, prices and CTAs; `scroll-padding-top` matches it; "differences only" toggle; values as check marks with text alternatives, no hover-only tooltips. Feature names left-aligned; numeric limits right-aligned in `tabular-nums`.
- Mobile (under 768): cards stack with Team first; the comparison becomes plan tabs (one plan's column at a time) or a two-plan picker; no horizontal page scroll (WCAG 1.4.10 and Smashing research).
- Page: FAQ and enterprise contact below; closing CTA. Section gaps 64 mobile, 96 desktop. Offer wording and anchoring: copywriting and sales-funnels.

### Scores
| | Gate | Specificity | A11y and responsive | Fit and hierarchy | Expert | Total |
|---|---|---|---|---|---|---|
| Generic | Pass (borderline: "stack the columns" leaves a 30-row table unresolved on mobile) | 1 | 1 | 2 | 0 | 4 |
| With skill | Pass | 3 | 3 | 2 | 2 | 10 |

---

## Brief 3: "Ops dashboard for a support team lead, works on laptop and tablet"

### Generic answer (summary)
"Put key metrics at the top in cards (open tickets, response time, CSAT, SLA). Below, add charts: a pie chart of tickets by channel and a line chart of volume. Add a table of recent tickets. Use a sidebar for navigation. Use a 12-column grid and make the cards stack on smaller screens."

### With-skill answer (first run, before gap fixes)
Job named: decide where to move agents this hour. KPI row of 4 tiles (open, median first response, SLA breaches, CSAT today), value is the largest text, delta with period. Primary chart: volume vs staffed agents by hour (line). Breakdown by channel as bars (no pie, NN/g). Breached tickets table in compact density, breach age right-aligned, tabular figures, sticky header. Global filters in one toolbar. Sidebar 264 at xl, rail at md to lg, overlay below. Cards span 3 / 6 / 12, rows share height, gap 24.

Gap found: the skill did not say what the KPI row and chart cards do between 768 and 1279 (tablet), so the answer improvised "cards stack". It also did not say how to handle a compact table on a touch tablet.

### With-skill answer (after gap fixes)
Adds: KPI row becomes 2x2 at md (768 to 1023), 4 across at lg and up, and a single column of compact horizontal tiles (label left, value right) under 640. Chart cards have a minimum inline size of about 320px via `auto-fit` so they never squeeze below legibility. On a touch tablet (`pointer: coarse`) the table switches from compact (32) to default density (40) rows and keeps 24px+ targets. Charts and the table share the top-left-first order when stacked: KPIs, trend, breakdown, table.

### Scores
| | Gate | Specificity | A11y and responsive | Fit and hierarchy | Expert | Total |
|---|---|---|---|---|---|---|
| Generic | Fail (pie chart and no density or target rule for tablet; "stack" breaks the KPI comparison) | 1 | 1 | 1 | 0 | 5 (capped) |
| With skill, first run | Pass | 3 | 2 | 2 | 2 | 9 |
| With skill, after fixes | Pass | 3 | 3 | 2 | 2 | 10 |

---

## Trigger check
- Fires on: "spacing feels off", "pricing page layout", "dashboard layout", "make this stand out", "mobile version of this page", "set up the grid". All in the description.
- Stays quiet on: "pick a palette for a fintech brand" (design-color), "pair fonts for a hockey app" (design-typography), "write the hero headline" (design-copy, copywriting). The description names these exclusions.
- Risk: "build a landing page" should load both design-layout and the copy skills; the description includes "landing page structure", which is correct.

## Gap list (sent back to domain-specialist and fixed)
1. Dashboard tablet behavior: KPI row 4 / 2x2 / stacked horizontal tiles, chart card minimum inline size about 320px. Fixed in references/05 and SKILL.md section 5.
2. Density on touch tablets: compact tables switch to default rows under `pointer: coarse`. Already in SKILL density rule; made explicit in references/05 dashboard section.
3. Stacked order for dashboards follows the same priority order as desktop (top-left first becomes top first). Added to references/05.

## Verdict
Pass. The with-skill answer beat a strong generic answer on all three briefs (10 vs 5, 10 vs 4, 10 vs 5 after fixes) and the generic answer failed the gate on two of three. The with-skill outputs specify tokens, CSS and accessibility details a top studio would ship.
