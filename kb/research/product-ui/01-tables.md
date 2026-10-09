# Research 01: Tables and data grids

Researcher, 2026-10-09. All URLs accessed 2026-10-09 with the WebFetch tool (direct `curl` is blocked by the egress policy). Tier per the source policy in `.claude/agents/researcher.md`. Status: C consensus, S standard, P practitioner (opinion unless backed by shipped work), O opinion.

## Key findings
1. Alignment is settled: numbers right, text left, headers carry their column's alignment (GOV.UK, Strom, Primer, Polaris agree).
2. Tabular figures are the mechanism for column alignment; Vercel's Geist requires `tabular-nums` or Geist Mono on numeric columns.
3. Sortable headers: a `button` inside the `th`, `aria-sort` on the sorted `th` only; one column sorted by default (Primer).
4. A static `table` puts every focusable element in the tab order; an ARIA `grid` keeps one tab stop and is for editable or interactive cells (APG). Default to a table.
5. WCAG 1.4.10 excepts the data table, not the page around it, and not the content inside cells.
6. Changing CSS `display` on table elements drops table semantics in Safari (Roselli, last update Dec 2022). Restore with ARIA table roles when collapsing rows on phones.
7. Mobile: NN/g lists locked first column, sticky headers, user-chosen attributes, accordions and refine-before-viewing; it does not recommend cards. Polaris allows a condensed mode below 490px.
8. Row actions: last column, one action pulled out at most (Primer); under three actions keep them inline (Carbon); hover-only actions are hard to discover (NN/g).
9. Unknown values show a dash, not placeholder text (Geist). Units: label once, not on every cell (Strom).
10. Density: Carbon 24/32/40/48/64px rows, 40 default; Primer condensed, normal, spacious. FOUNDATIONS and design-layout use 32/40/48.

## Conflicting views
- Zebra striping: Carbon offers it to help horizontal scanning; Strom calls it bad (his opinion). design-layout already marks it contested. Decision: off by default, on for wide tables with many columns (opinion).
- Mobile cards: common in practice, not in NN/g's list. Decision: collapse rows to a two-line list only when people look up one row rather than compare across rows (follows NN/g "refine before viewing" logic; opinion).

## Claim table
| ID | Claim | Quote (under 40 words) | URL | Tier | Status |
|---|---|---|---|---|---|
| T1 | Numbers right aligned | "When comparing columns of numbers, align the numbers to the right in table cells." | https://design-system.service.gov.uk/components/table/ | 1 | C |
| T2 | Caption names a table | "Use the `<caption>` element to describe a table in the same way you would use a heading." | https://design-system.service.gov.uk/components/table/ | 1 | S |
| T3 | Caption helps find and decide | "Captions help users to find a table and understand what it's about and decide if they want to read it." | https://www.w3.org/WAI/tutorials/tables/caption-summary/ | 1 | S |
| T4 | Tabular figures defined | "activating the set of figures where numbers are all of the same size, allowing them to be easily aligned like in tables." | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric | 1 | S |
| T5 | Slashed zero exists for O vs 0 | "this is useful when a clear distinction between O and 0 is needed." | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric | 1 | S |
| T6 | Headers follow their data | "Headers, generally, should carry whatever alignment their data has." | https://mattstromawn.com/writing/tables/ | 4 | P |
| T7 | Consistent precision | "keep the same number of significant figures" | https://mattstromawn.com/writing/tables/ | 4 | P |
| T8 | Label once, not every cell | "Instead of repeating the label, only include it with the first data point in each column." | https://mattstromawn.com/writing/tables/ | 4 | P |
| T9 | Rules redundant when aligned | "If you've properly aligned the data points in your table, rules become redundant." | https://mattstromawn.com/writing/tables/ | 4 | P |
| T10 | Zebra striping (contested) | "One unsubstantiated opinion I have about rules is that zebra striping is bad." | https://mattstromawn.com/writing/tables/ | 4 | O |
| T11 | Sort button in header | "the header text of sortable columns is wrapped in a `button` element." | https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/ | 1 | S |
| T12 | aria-sort on sorted column | "The `aria-sort` attribute is set on the column header of the currently sorted column," | https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/ | 1 | S |
| T13 | One column sorted by default | "If a table is sortable, one column must be sorted by default." | https://primer.style/product/components/data-table/ | 2 | P |
| T14 | Sort toggle behavior | "Clicking a sorted column toggles between ascending and descending; unsorted columns sort in ascending order on first click." | https://primer.style/product/components/data-table/ | 2 | P |
| T15 | Grid for interactive cells | "The `grid` pattern is particularly useful if the tabular information is editable or interactive." | https://www.w3.org/WAI/ARIA/apg/patterns/grid/ | 1 | S |
| T16 | Grid has one tab stop | "Only one of the focusable elements contained by the grid is included in the page tab sequence." | https://www.w3.org/WAI/ARIA/apg/patterns/grid/ | 1 | S |
| T17 | Table tab behavior | "All focusable elements contained in a table are included in the page tab sequence." | https://www.w3.org/WAI/ARIA/apg/patterns/grid/ | 1 | S |
| T18 | Reflow excepts data tables | "data tables (not individual cells)" (Note 2 to SC 1.4.10) | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html | 1 | S |
| T19 | Exception does not spread | "the exception does not automatically extend to other content" | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html | 1 | S |
| T20 | Cells still reflow | "individual cells would still need to meet Reflow" | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html | 1 | S |
| T21 | CSS display drops semantics | "using display: block \| grid \| inline \| … on table elements will also override native semantics." | https://adrianroselli.com/2018/02/tables-css-display-properties-and-aria.html | 4 | P (tested, with browser log) |
| T22 | Fix with ARIA roles | "use ARIA table roles to override / re-insert the table semantics you may lose by using CSS flex or grid." | https://adrianroselli.com/2018/02/tables-css-display-properties-and-aria.html | 4 | P |
| T23 | Safari status | "Safari is still a hot mess after repeated assurances it was being fixed." (Dec 2022 update) | https://adrianroselli.com/2018/02/tables-css-display-properties-and-aria.html | 4 | P; recheck yearly |
| T24 | Four table tasks | "Find record(s) that fit specific criteria" ... "Compare data" ... "View, edit or add a single row's data" ... "Take action(s) on records" | https://www.nngroup.com/articles/data-tables/ | 3 | C |
| T25 | Freeze headers and first column | "Freeze header rows and header columns (if the table is larger than the screen)." | https://www.nngroup.com/articles/data-tables/ | 3 | C |
| T26 | Hover actions hard to discover | "Hidden under a hover gesture or a generic Actions menu, and thus hard to discover." | https://www.nngroup.com/articles/data-tables/ | 3 | C |
| T27 | Columns customisable | "Hiding and reordering columns must be easy to accomplish" | https://www.nngroup.com/articles/data-tables/ | 3 | C |
| T28 | Mobile: sticky headers | "sticky column headers help users know what they are looking at." | https://www.nngroup.com/articles/mobile-tables/ | 3 | C |
| T29 | Mobile: locked left column | "should be locked in place, so users can see the necessary labels at all times." | https://www.nngroup.com/articles/mobile-tables/ | 3 | C |
| T30 | Mobile: refine before viewing | "The first approach works if users need to see data, but don't need to compare it." | https://www.nngroup.com/articles/mobile-tables/ | 3 | C |
| T31 | Mobile: rotation last resort | "Rotating the Phone Is a Last Resort." | https://www.nngroup.com/articles/mobile-tables/ | 3 | C |
| T32 | Scroll cues | "arrows or cut-off elements convey this information best." | https://www.nngroup.com/articles/mobile-tables/ | 3 | C |
| T33 | Row actions in last column | "Actions that affect the item represented in the row are placed in the last column," | https://primer.style/product/components/data-table/ | 2 | P |
| T34 | Pull out at most one action | "Do not pull out more than 1 action." | https://primer.style/product/components/data-table/ | 2 | P |
| T35 | Density names | "Condensed: Maximizes data visibility in a small area." | https://primer.style/product/components/data-table/ | 2 | P |
| T36 | Carbon row sizes | Five sizes: 24, 32, 40 (default), 48, 64px; header matches row size (WebFetch summary of the size table; values, not prose) | https://carbondesignsystem.com/components/data-table/usage/ | 2 | P |
| T37 | Inline when under three actions | Overflow menu rows: with fewer than three options, "keep the actions inline as icon buttons instead." | https://carbondesignsystem.com/components/data-table/usage/ | 2 | P |
| T38 | Numeric cells right aligned (Polaris) | "Numeric cells and titles should be right aligned with the Text component" | https://polaris-react.shopify.com/components/tables/index-table | 2 | P |
| T39 | Row click goes to detail | "The action should navigate to the resource's details page or otherwise provide more detail about the item." | https://polaris-react.shopify.com/components/tables/index-table | 2 | P |
| T40 | Geist: dash for unknown | "Render [dash character] in cells where a value is unknown or not applicable" (dash glyph elided per house rule; exact wording not confirmed) | https://vercel.com/geist/table | 2 | P |
| T41 | Geist: tabular numbers | "Apply `tabular-nums` (or Geist Mono) to numeric columns so digits align across rows for comparison" | https://vercel.com/geist/table | 2 | P |
| T42 | Vercel guideline: tabular nums | "Use `font-variant-numeric: tabular-nums` or a monospace like Geist Mono." | https://vercel.com/design/guidelines | 2 | P |
| T44 | Relative time, then date | "Use the canonical short relative-time form in cells (`2m ago`, `5h ago`); switch to `Mar 14, 2026` past 7 days." | https://vercel.com/geist/table | 2 | P |
| T43 | Prefer native table | "Prefer native elements (`button`, `a`, `label`, `table`), before `aria-*`." | https://vercel.com/design/guidelines | 2 | P |

## Derived and cross-referenced (not re-researched)
- True minus U+2212 aligns with plus in tabular figures: design-typography `references/05-typographic-detail.md` character table.
- Row heights 32/40/48 and density bands: design-layout `references/05-page-composition-and-density.md`.

## Likely to change
Safari table semantics under `display` changes (T23): recheck each year; until fixed, always restore roles.
