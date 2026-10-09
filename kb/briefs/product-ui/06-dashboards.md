# Brief 06: Dashboards that answer a question

## Question
How do you make a dashboard that answers "what changed and what should I do" in five seconds, instead of a wall of tiles?

## Audience
Claude building analytics and ops dashboards.

## Decisions the reader must be able to make
- The question the dashboard answers, written as a sentence on the page.
- Operational vs analytical layout.
- KPI tile anatomy, comparison period, abbreviation rules.
- Where alerts go by urgency.
- Freshness and time zone display.
- What a first-run dashboard shows with no data.

## Fundamentals
One question per dashboard; position and length encodings first, no pies or color-for-magnitude (NN/g); deltas with sign, arrow and word, never color alone; comparison period stated; freshness stated; every chart labelled and summarised in text.

## Expert layer
An answer line above the KPIs that says the finding in words; abbreviate in tiles and give full precision in tables and tooltips; benchmark line over more series; alerts that need action sit before the charts; customisable home widgets for mixed audiences (Stripe).

## Must cover
NN/g dashboards, Stripe docs (home widgets), Few (book, via design-layout 05), dataviz skill.

## Out of scope or reuse
Chart design: dataviz. Dashboard grid and responsive KPI row: design-layout `references/05-page-composition-and-density.md`.

## Test briefs
1. Slice brief B, rebuilt so the page answers "How is the product doing this week, and what needs me?" Exemplar: Stripe Dashboard home.
2. "On-call ops dashboard for a payments API." Exemplar: Vercel Dashboard observability.

## Rubric
Gate: fundamentals checklist. Close to exemplar: the first 5 seconds give the answer; nothing on the page is decoration; numbers read as typography.
