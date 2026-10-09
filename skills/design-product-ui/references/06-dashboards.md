# Dashboards that answer a question

A dashboard is "at-a-glance information" people "can act on quickly" and focuses on one task (NN/g, D1, D2). Most dashboards fail by answering nothing: a grid of equal tiles where the reader must do the analysis. Grid and responsive KPI rules are in design-layout `references/05-page-composition-and-density.md`; every chart goes through the dataviz skill. Sources are claim IDs in `kb/research/product-ui/06-dashboards.md`. Opinion is marked (opinion).

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Name the question before placing anything** ("How is the product doing this week, and what needs me?"). One dashboard, one question (D2). [judged]
2. **Encodings: position and length first**; no pies, donuts, gauges, 3D; color never encodes magnitude (D5 to D7). [judged]
3. **Every number has its unit and comparison period**: "+12.4% vs last week". [judged]
4. **Deltas carry sign, arrow and, when the direction is bad, the word** ("worse"), never color alone (design-playbook-dashboard non-negotiable 3). Note that "up" is not always good (churn, latency). [judged]
5. **Freshness and time zone are visible**: "Updated 2 min ago, times in PT". [judged]
6. **Every chart has a title that states what it shows and a text summary** (`desc` or adjacent text) for screen readers (dataviz). [judged]
7. **States per panel** per chapter 05. [judged]

### Standards
| Standard | Applies to |
|---|---|
| WCAG 1.1.1 | Chart text alternatives |
| WCAG 1.4.1 | Delta direction not by color alone |
| WCAG 1.4.11 | Chart lines and bars 3:1 against the surface (design-color) |
| WCAG 1.3.1 | KPI tiles as `dl` (term and value) or headings plus values |

### Decision rules
- **Operational or analytical?** Operational (on-call, support, trading floor): alerts and live status first, compact density, auto refresh, freshness prominent (D3). Analytical (weekly product review): the answer line, KPIs, trend with benchmark, breakdowns, then detail tables; default density (D4).
- **Order (analytical):** answer line, KPI row, primary trend, alerts or breakdowns, detail table. Alerts that need action today move above the trend (D8; opinion on placement).
- **KPI count.** 3 to 5 per row (design-layout 05). More: the dashboard is answering two questions; split it.
- **KPI anatomy:** label (muted, `--text-sm`), value (largest text on the page, `--text-2xl` 31 or `--text-3xl` 39 weight 600, tabular figures), delta line (`--text-xs` or `--text-sm`: arrow, signed value, period), optional sparkline (dataviz).
- **Abbreviation.** Tiles abbreviate to 3 significant figures ($184.2k, 48.2k); tables keep full precision (chapter 01). Give screen readers the full value as `<span aria-hidden="true">48.2k</span><span class="sr-only">48,210</span>`. Do not put `aria-label` on a plain `span` or `div`: ARIA prohibits naming generic elements, and axe fails it (`aria-prohibited-attr`; found in the product UI test, `kb/tests/design-product-ui.md`). The same applies to a "no data" dash.
- **Benchmark over more series.** Compare to the previous period or a target as a dashed gray line; do not add a third color (design-color G5; dataviz).
- **Customisation.** Mixed audiences (finance, support, founders): let people add and remove widgets, like Stripe Home (D9). Single-role tools: fixed layout.
- **First-run.** No data: panel frames with empty states and one shared action, or labelled sample data (chapter 05; design-ux 05).

### Numbers
| Thing | Value | Source |
|---|---|---|
| KPIs per row | 3 to 5 | design-layout 05 |
| Answer line | one sentence, `--text-base` 16 or `--text-lg` 20, max about 32em | opinion; FOUNDATIONS measure |
| Tile value | 31 to 39px, weight 600, `tabular-nums`, letter-spacing about -0.01 to -0.02em | design-typography; opinion |
| Abbreviate | 3 significant figures in tiles | opinion, consistent with research 01 T7 |
| Stale warning | operational 5 to 15 min; analytical 24 h | opinion |
| Chart min width | about 320px (`minmax(min(20rem, 100%), 1fr)`) | design-layout 05 |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (public docs)
- **Stripe Dashboard Home**: analytics and charts plus "important notifications, like unresolved disputes"; widgets people add or remove (D8, D9).
- **Vercel Dashboard overview**: every project regardless of status, scoped by team (D10).
- **NN/g**: operational vs analytical split; position and length encodings (D3 to D6).

### Signature moves
1. **The answer line.** One sentence above the KPIs that states the finding: "Active users are up 12% for the third week running; checkout tracking has been down since 14:05." It is computed from the same data, links each claim to its panel, and turns a dashboard into a briefing (opinion, derived from D1, D2).
2. **Bad news gets words.** A delta that is bad says so ("+0.4 pts, worse"), because a red arrow pointing up is ambiguous for churn (opinion; design-color pilot).
3. **The number is typography.** One size for all tile values, tabular figures, muted units and periods; the value is the largest text on the page, larger than the page title (opinion; design-playbook-dashboard move 6).
4. **Alerts are actions, not decoration.** Each alert names what broke, since when, and one action ("View tracking plan"); alerts needing action today sit before the charts (D8).
5. **Freshness in the header.** "Updated 2 min ago" next to the date range, so trust is answered before the reader looks at a number (opinion).
6. **Tables end the story.** The detail table answers "which ones?" for the trend above it, sorted by the same measure (opinion).

### Do and don't
| Do | Don't |
|---|---|
| "Churn 2.9%, +0.4 pts, worse vs last week" | "Churn 2.9% ▲" in red |
| A dashed previous-period line | Five colored series |
| One question per dashboard | A tile for every metric the database has |
| "Updated 2 min ago, times in PT" | No freshness at all |

### Worked examples
**Tally weekly overview (slice brief B).** Question: "How is the product doing this week, and what needs me?" Answer line computed from KPIs and alerts. KPIs: weekly active users, conversion, revenue, churn, each with delta vs last week. Alerts panel moves beside the trend because one alert is an error affecting conversion. Trend: weekly active users, 12 weeks, previous period dashed. Table: top pages, sortable. Header: date range, "Updated 2 min ago", Share report.

**On-call payments API dashboard.** Operational: status strip first (error rate, p95 latency, success rate) with thresholds as text ("p95 412 ms, above 300 ms target"), then incidents list, then charts of the last hour with 1 min resolution, compact density, auto refresh every 30 s with "Paused" when the tab is hidden, freshness in the header.

## Hand-offs
- Every chart, sparkline and KPI tile visual: dataviz.
- Dashboard grid, KPI row reflow: design-layout `references/05-page-composition-and-density.md`.
- Status colors and delta colors: design-color `references/ui-tokens-themes.md`.
- Answer line and alert wording: design-copy `references/02-ux-microcopy.md`.
