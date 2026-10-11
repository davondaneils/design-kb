# Brief 01: Tables and data grids

## Question
How do you build a data table in a product that people scan, compare and act on all day, and that still works on a 390px phone without page-level sideways scroll?

## Audience
Claude building an app screen through design-playbook-dashboard; a strong generalist who knows "right-align numbers" and little else.

## Decisions the reader must be able to make
- Alignment, numeral style, precision and unit placement per column.
- Static `<table>` or ARIA `grid`.
- Sort affordance and default sort, and how it is announced.
- Where row actions live (inline, last-column menu, hover reveal) and when.
- Sticky header and first column, and how they interact with focus.
- Which responsive strategy fits: cut columns, collapse rows to a list, scroll inside a box with a locked first column.
- Row height for each density.

## Fundamentals
Native table semantics with `<caption>` or a labelled region; `th scope`; numbers right aligned in tabular figures with header aligned to its data; sortable headers are buttons with `aria-sort` on the sorted `th`; row actions keyboard reachable; no page-level horizontal scroll at 390px (WCAG 1.4.10 excepts the table itself, not the page around it).

## Expert layer
Unit in the header not every cell; one precision per column; true minus sign; sort arrow on the inner side of right-aligned headers; the primary cell is a real link and row click is the enhancement; table vs grid decided by whether cells are interactive; `display` changes on table elements drop semantics in Safari unless ARIA roles are restored; responsive collapse that keeps the comparison the table exists for.

## Must cover
W3C APG sortable table and grid, WCAG 1.4.10 Understanding, W3C tables tutorial (caption), MDN `font-variant-numeric`, GOV.UK table, Strom on tables, Primer data table, Carbon data table, Polaris index table, NN/g data tables and mobile tables, Roselli on CSS display and table semantics, Vercel Geist table.

## Out of scope or reuse
Row height table and density bands: design-layout `references/05-page-composition-and-density.md`. Figures and minus sign: design-typography `references/05-typographic-detail.md`. Charts inside cells: dataviz.

## Test briefs
1. Slice brief B (Tally dashboard) "top pages" table, improved: reflow at 390px, sort, row actions. Playbook: dashboard. Exemplar: Stripe Dashboard, Vercel Dashboard.
2. "Invoices list for a billing admin: 8 columns, 2,400 rows, bulk mark paid." Playbook: dashboard. Exemplar: Stripe Dashboard.

## Rubric
Gate: the FOUNDATIONS fundamentals checklist (lint exits 0, every judged row holds). Then close to exemplar means: numbers read as one column edge; header and data share an edge; nothing on the row competes with the primary cell; phone view shows the same comparison in one vertical scroll; no decoration a Stripe or Vercel table would not carry.
