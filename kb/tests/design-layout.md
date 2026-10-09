# Tester report: design-layout v0.1

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
