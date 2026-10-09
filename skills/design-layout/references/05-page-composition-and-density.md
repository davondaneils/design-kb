# Page composition and density

Sources: research/layout/05, plus 01 to 04. Copy, offer and funnel logic are out of scope: see copywriting, sales-funnels and website-strategy.

## Principles
1. **Every page type has a job and a skeleton that already works.** Start from the proven skeleton, then earn each deviation.
2. **Density follows task frequency and expertise, not taste.** Daily expert tools go dense; first-visit marketing pages go airy. A whitespace-heavy redesign of a call center panel was retired after a month because it slowed users (practitioner report, opinion).
3. **Collections choose their container by task.** Browse heterogeneous items: cards. Search or compare: list or table. Single-type visuals: regular grid (NN/g).

## Landing page

Skeleton (top to bottom), with section spacing `--space-9` (64) mobile to `--space-10` or `--space-11` (96 to 128) desktop:
1. Header: logo, 3 to 5 links, one primary CTA. 64 to 72px tall (opinion).
2. Hero: headline (about 20ch cap), one supporting line, primary CTA plus at most one secondary, product proof (screenshot, demo, outcome). Show the top of the next section above the fold to avoid a false floor (NN/g).
3. Proof strip: logos or a single strong metric, quiet tone.
4. Problem and outcome, then 3 to 6 features or a how-it-works sequence.
5. Deep proof: case study, testimonial with face, name and role.
6. Pricing teaser or pricing, then FAQ.
7. Closing CTA that repeats the hero action, then footer.

Rules:
- One primary action per page, repeated, never competing with a second filled button (opinion, consistent with hierarchy rules).
- Copy column on a consistent left edge; images alternate sides if needed, text edge does not.
- Message order and offer: hand to copywriting and website-strategy. Funnel step logic: sales-funnels.

## Dashboard

- One dashboard, one job (NN/g). Name the decision it supports before placing anything.
- Top-left gets the most important information (Few). Layout reads: KPI row, then primary trend chart, then breakdowns, then detail tables.
- KPI row: 3 to 5 tiles (opinion). Each tile: label (muted), value (largest text on the page), delta with direction and comparison period. Equal widths per row.
- Charts: bars and lines first; avoid pies, donuts, gauges and 3D (NN/g). Chart design itself: design-data.
- Grid: 12 columns, cards span 3, 4, 6 or 12. Cards in one row share a height (subgrid or `align-items: stretch`). Gap 16 to 24.
- Global filters (date range, segment) sit in one toolbar above the content, applied to everything; per-card controls only when a card is independent.
- Empty, loading and error states keep card size so the layout does not jump.
- Responsive: KPI row 4 across at lg and up, 2x2 at md (768 to 1023), and under 640 a single column of compact horizontal tiles (label leading, value trailing) so all KPIs stay in one screen. Chart cards use `repeat(auto-fit, minmax(min(20rem, 100%), 1fr))` so a chart never drops below about 320px wide.
- Stacked order keeps the desktop priority: top-left first becomes top first (KPIs, primary trend, breakdowns, tables).
- Touch tablets: compact tables switch to default density (40px rows) under `@media (pointer: coarse)`; targets stay at least 24px, 44 preferred.

## Article and docs

- Content grid with named lines (01-grids): body 66ch, popout for figures, full bleed for heroes and wide charts.
- Headings that stand out and front-load key words to produce layer-cake scanning (NN/g).
- Space above a heading is larger than below it, so the heading binds to its section: about 2:1, for example 48 above and 16 to 24 below (opinion, consistent with the proximity ratio).
- Table of contents: sticky in a right column on xl and up; collapsible at the top below lg.
- Images and code blocks may exceed the measure; paragraphs never do.

## Pricing page

- 3 to 4 plans side by side on desktop. More than 4: group (by audience or billing), tab, or wrap into rows; never squeeze 6 columns (Smashing).
- Recommended plan in the middle with the only filled CTA and a label; others get outline CTAs.
- Plan cards share one structure via subgrid: name, price, one-line who-it's-for, CTA, top 4 to 6 differentiators. CTA position identical across cards.
- Billing toggle above the cards with savings stated (for example "2 months free").
- Full comparison table below: grouped rows in collapsible sections, sticky plan header with CTA, check marks or text values, "show differences only" option for long tables. No hover-only tooltips (inaccessible).
- Mobile: plans stack as cards with the recommended plan first or tab-switching between plans; no horizontal scrolling; let people pick two plans to compare (Smashing).
- FAQ and enterprise contact below the table.

## Tables and collections

- Numbers right-aligned in tabular figures (`font-variant-numeric: tabular-nums`); text left-aligned; never center. Header aligns with its column's data (Strom).
- Rules: light horizontal only, or none if alignment carries the structure. Zebra striping optional (opinion contested).
- Sticky header row; sticky first column when the table scrolls horizontally.
- Row heights by density: 32 compact, 40 default, 48 comfortable. Cell padding 8 to 12 horizontally (`--space-3` to `--space-4`) at compact, 16 at default.

## Density

| Mode | Use when | Control and row height | Inside padding | Between groups |
|---|---|---|---|---|
| Comfortable | consumer, first-time, touch | 48 | 16 to 24 | 32 to 48 |
| Default | most product UI | 40 | 12 to 16 | 24 to 32 |
| Compact | expert, daily, desktop, data-heavy | 32 | 8 to 12 | 16 to 24 |

Rules:
- Change vertical padding and row height first; keep font size at 14 or more for compact UI (opinion; 14 is `--text-sm`) and keep 16 for body reading.
- Compact must still meet 24x24 targets (WCAG 2.5.8); on touch devices fall back to comfortable or default via `@media (pointer: coarse)`.
- Before densifying, reduce: remove redundant columns, merge fields, cut decorative rules and boxes (practitioner report).
- Offer a density switch only in tools people use daily; default to the mode that fits the majority task.

## Worked examples
**3-tier SaaS pricing with 30 features.** Three subgrid cards, middle "Team" recommended. Each card lists 5 differentiators, not 30. Below: comparison table in 5 collapsible groups of about 6 rows, sticky header with plan names, prices and CTAs, "differences only" toggle on by default (opinion). Mobile: cards stack Team first; the table becomes a plan tab bar with one plan's features shown at a time.

**Support team lead ops dashboard.** Job: decide where to move agents this hour. KPI row: open tickets, median first response, SLA breaches, CSAT today. Primary chart: ticket volume vs staffed agents by hour (line). Breakdown: queue by channel (bar). Detail: breached tickets table, compact density, sortable, breach age right-aligned in tabular figures. Global filter: team and time range in one toolbar.

## Hand-offs
- Chart choice and encoding: design-data.
- Navigation and flows: design-ux. Copy and microcopy: design-copy.
- Funnel structure and offers: sales-funnels, copywriting, website-strategy.

## Sources
- NN/g Dashboards: https://www.nngroup.com/articles/dashboards-preattentive/
- Stephen Few, Information Dashboard Design (book)
- NN/g Cards component: https://www.nngroup.com/articles/cards-component/
- Matt Strom, Design better data tables (practitioner): https://mattstromawn.com/writing/tables/
- Smashing, Designing better pricing pages: https://smashingmagazine.com/2022/07/designing-better-pricing-page
- How white space killed an enterprise app (practitioner, anecdotal): https://uxdesign.cc/how-white-space-killed-an-enterprise-app-and-why-data-density-matters-b3afad6a5f2a
- Linear redesign (practitioner): https://linear.app/now/how-we-redesigned-the-linear-ui
- NN/g Scrolling and attention: https://www.nngroup.com/articles/scrolling-and-attention/
