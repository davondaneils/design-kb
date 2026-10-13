# Tables and data grids

People use tables for four jobs: find records, compare them, view or edit one, and act on several (NN/g, research T24). Every decision below serves one of those four. Sources are the claim IDs in `kb/research/product-ui/01-tables.md`. Opinion is marked (opinion).

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Native table first.** `<table>` with `<caption>` (or a region labelled by the panel heading), `<th scope="col">`, and `<th scope="row">` on the primary cell when rows have a name (T2, T3, T43). [judged]
2. **Numbers right, text left, headers follow their data.** Numeric `th` is right aligned too, so header and figures share one edge (T1, T6, T38). Never center data. [judged]
3. **Tabular figures on every numeric column**: `font-variant-numeric: tabular-nums lining-nums` (T4, T41, T42). [judged]
4. **One precision per column.** 24,180 and 8,733, never 24.2k next to 8,733; 1m 42s and 0m 58s, never 1m 42s next to 58s (T7). [judged]
5. **Sortable headers are buttons** that fill the header cell; `aria-sort="ascending|descending"` sits on the sorted `th` only; one column is sorted by default (T11 to T13). [judged]
6. **Row actions are keyboard reachable and visible on focus.** Hover-only reveal is allowed only inside `@media (hover: hover)` and must also show on `:focus-within` (T26). [lint for focus, judged for reveal]
7. **No page-level horizontal scroll at 390px.** WCAG 1.4.10 excepts the data table itself, not the page around it, and not the content of a cell (T18 to T20). If the table scrolls, it scrolls inside its own labelled, focusable region. [lint]
8. **Targets at least 24x24**, row links included; on coarse pointers rows fall back to the 40px default height (FOUNDATIONS; design-layout 05). [lint]
9. **Unknown or empty values are explicit**: a muted dash with a hidden "No value" label, never a blank cell and never "null" (T40). [judged]

### Standards
| Standard | What it requires here |
|---|---|
| WCAG 1.3.1 | Header cells marked up as `th` with scope; caption or accessible name |
| WCAG 1.4.10 | Table may scroll in 2D; everything else reflows at 320 CSS px |
| WCAG 2.4.11 | A sticky header must not fully cover a focused row: set `scroll-padding-top` on the scroll container to the header height |
| WCAG 4.1.2 | Sort buttons have names that include the column label; sort state exposed by `aria-sort` |
| APG grid | Use `role="grid"` only when cells are editable or interactive; a grid has one tab stop and arrow-key navigation (T15 to T17) |

### Decision rules
- **Table or grid?** If cells hold read-only data plus a link and a menu per row, use a table. If people edit cells in place or move cell to cell like a spreadsheet, use an ARIA grid with roving tabindex. (T15, T16)
- **Where does the unit go?** In the header ("Revenue, USD", "Avg. time"), or on the first data row only (T8). Never repeat "$" or "%" in every cell of a long column unless the column mixes units.
- **Abbreviate?** No, inside tables. Abbreviate in KPI tiles and chart labels; tables are for comparison and lookup, so they carry the precision the reader compares at (opinion, consistent with T7).
- **Negative numbers** use the true minus U+2212 (`&minus;`), which matches the plus width in tabular figures (design-typography 05). Parentheses only in accounting contexts.
- **Row actions**: one or two actions, inline as labelled icon buttons in the last column; three or more, a "More" menu in the last column with at most one action pulled out (T33, T34, T37).
- **Whole-row click**: the primary cell is a real `<a>` to the detail page; a row click handler is an enhancement that forwards to it (T39). Never a row that only works with a mouse.
- **Sticky**: header row sticky whenever the table is taller than its viewport; first column sticky whenever the table scrolls sideways (T25, T28, T29). Round 1 scrolled the header of a 38-row, 1,824px table away (`kb/reviews/benchmark-round1-app.md` item 4).
- **Status in rows** is a 12 to 16px glyph plus a word in its own cell; never tint a data row. Tinted rows live only inside an alert panel (design-layout reference 06, "Alerts as rows"), so one fact is painted once (Linear "Status colors", `kb/teardowns/linear-app.md` Borrow: "never on the row").
- **Long tables.** Lookup and admin tables paginate with counts ("21 to 40 of 142") and Previous and Next (Geist, research 01). Over about 500 rows in one scroll, virtualize rows but keep the real row count in the caption and `aria-rowcount`. No infinite scroll on tables people sort, compare or need the footer of (design-ux 02).
- **Long text cells** truncate to one line with an ellipsis at a column max width; the full text stays in the DOM, so screen readers get it, and a hover or focus card shows it. Paths and IDs truncate in the middle (`/blog/retention-...marks`) because their ends differ (opinion).
- **Times** in cells: short relative form ("2m ago", "5h ago") switching to a date ("Mar 14, 2026") after 7 days, with the full timestamp in a `<time datetime>` attribute (T44).
- **Zebra**: off by default; on for tables wider than about 8 columns where the eye must travel far along a row (contested; T9, T10, opinion).
- **Responsive strategy**, pick in this order:
  1. **Cut columns** by priority at each breakpoint; keep the primary cell and the column people sort by. Offer column choice for power users (T27).
  2. **Collapse rows to a list** when people look up one row or compare one measure: each row becomes a two-line item with the primary cell on line 1 and the key measure right aligned on the same line, secondary measures on line 2 as label and value pairs. Restore semantics with ARIA table roles, because `display` changes drop them in Safari (T21 to T23).
  3. **Scroll inside the box with a locked first column** when people must compare many measures across rows (true spreadsheets). Show a cut-off edge or shadow as the scroll cue (T32), and make the region focusable with a name.
  Never: rotate-to-landscape prompts (T31), or the whole page scrolling sideways.

### Numbers
| Thing | Value | Source |
|---|---|---|
| Row height | 32 compact, 40 default, 48 comfortable (header matches row) | design-layout 05; Carbon T36 |
| Cell padding inline | 12 at compact (`--space-4`), 16 at default (`--space-5`); first and last cells match the panel padding so edges align | design-layout 05; opinion for the edge rule |
| Header text | `--text-xs` 12 or `--text-sm` 14, weight medium, `--color-text-muted`; muted at 12px still needs 4.5:1 on the header surface | opinion; WCAG 1.4.3 |
| Body text | `--text-sm` 14; never below 14 in compact | design-layout 05 |
| Sort icon | 12 to 16px, placed on the inside edge (left of a right-aligned label, right of a left-aligned label) | opinion |
| Selection column | 40px wide, checkbox with a 24px target | WCAG 2.5.8; opinion for width |
| Phone list item | 2 lines, at least 48px tall, 16px side padding; line 1 `--text-base` 16 or `--text-sm` 14, line 2 `--text-sm` 14 (status words, rate, counts), never 12 | FOUNDATIONS spacing; lint `reading-size`; `kb/reviews/benchmark-round1-app.md` item 3 |
| Bulk action reveal | when 1 or more rows are selected (Carbon) | T36, research 05 B17 |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (from public docs; no app screenshots possible, see `kb/briefs/product-ui/00-plan.md`)
- **Vercel Geist**: tabular numbers or Geist Mono on numeric columns; a dash for unknown values; Title Case noun headers; "Previous" and "Next" pagination with "21 to 40 of 142" style counts (T40, T41; vercel.com/geist/table).
- **Primer (GitHub)**: one sorted column by default; row actions in the last column; three densities named condensed, normal, spacious (T13, T33, T35).
- **Carbon (IBM)**: five row sizes 24 to 64 with 40 default; batch action bar on selection (T36).
- **Stripe Dashboard**: search results expand to tables "with column headings, some of which provide sorting options" (docs.stripe.com/dashboard/search); filters and export at the table level (docs.stripe.com/dashboard/search, /basics).

### Signature moves
1. **Shared column edge.** Right-aligned numeric header, sort arrow on its inner side, so header text and every figure end on one vertical line. Generalists put the arrow after the label and break the edge. Reason: the eye scans the edge, not the label (T6; opinion on arrow placement).
2. **Units live in the header.** "Views", "Avg. time", "Share" with "%" once. Cells become pure figures and the column reads as one shape (T8).
3. **The row is a link with one door.** The primary cell is the only link; other cells are text; the link is stretched over the row (`tr { position: relative }` and `td a::after { content: ""; position: absolute; inset: 0 }`; row menus sit above it with `position: relative; z-index: 1`), so the row *is* the target, 44px or more on touch, while the tab order stays one stop per row plus its menu. A hover tint without the stretch promises a target that does not exist: round 1's phone row was 89px tall with a 109x24 link (`kb/reviews/benchmark-round1-app.md` item 5). Reason: avoids five tab stops per row and keeps screen reader output clean (T17, T39).
4. **Inline magnitude.** A thin bar (8px, `--radius-full`) beside a share or percentage column gives length encoding without a chart (NN/g dashboards research 06 D5). The figure stays as text; the bar is `aria-hidden`.
5. **Collapse that keeps the comparison.** On phones the primary cell and the sorted measure stay on line 1, right aligned, so a vertical scan still compares the measure people sorted by. Secondary measures drop to a muted line 2. Generalists either scroll sideways or stack every cell as label and value, which destroys comparison.
6. **Restore semantics after restyling.** When rows become grid or flex items at phone width, add `role="table|rowgroup|row|columnheader|rowheader|cell"` so Safari still announces a table (T21 to T23).
7. **Sticky header without hiding focus.** `scroll-padding-top` on the scroll container equals the sticky header height, so a focused row never sits under it (WCAG 2.4.11).

### Do and don't
| Do | Don't |
|---|---|
| "Views" header right aligned over 24,180 | Centered "Views" over right-aligned numbers |
| 1m 42s, 0m 58s | 1m 42s, 58s |
| Unit once in the header | "$" in all 400 cells |
| Primary cell link stretched over the row | Whole row `onclick` with no link; a row hover tint over a 24px link |
| Phone: two-line list item, sorted measure on line 1 | Phone: whole page scrolls sideways |
| `aria-sort` on one `th` | Sort arrows on every column with no state |

### Worked examples
**Top pages table on an analytics dashboard (slice brief B).** Jobs: compare pages by views and spot outliers. Columns: Page (link, `th scope=row`), Views, Avg. time, Share. Sorted by Views descending by default. Header buttons sort; the sorted `th` carries `aria-sort`; a polite live region says "Sorted by Avg. time, descending". Share gets an inline bar. At 390px the rows become two-line items: page path left and views right on line 1; "Avg. time 1m 42s" and "Share 34%" muted on line 2; ARIA roles restored. Result: one vertical scroll, comparison intact.

**Invoices list, 8 columns, 2,400 rows.** Find, compare and act. Compact density by default for finance staff (daily use), with a density switch. Selection column with header tri-state checkbox; bulk bar on selection ("Mark 12 invoices paid"); "Select all 2,400 matching" link after the page is selected (research 05). Amount right aligned in tabular figures with currency in the header; status as text plus icon, not color alone. Phone: cut to Customer, Amount, Status; collapse rows to list items; bulk actions stay (Polaris hides them only under 490px when non-essential, B21).

## Hand-offs
- Row heights and density bands: design-layout `references/05-page-composition-and-density.md`.
- Figures, minus sign, OpenType: design-typography `references/05-typographic-detail.md`.
- Charts inside or next to tables: dataviz.
- Filter bars and search above the table: chapter 02. Empty, loading and bulk states: chapter 05.
- Semantic markup details: design-frontend `references/01-semantic-html.md`.
