# States and bulk actions in product UI

A dashboard spends most of its life in states other than the screenshot: loading, half loaded, empty on day one, partly broken, out of date, or off-limits to this user. Timing tables, the error ladder and toast rules are in design-ux `references/04-states-feedback.md`; this chapter maps them onto panels, tables and bulk work. Sources are claim IDs in `kb/research/product-ui/05-states-bulk.md`. Opinion is marked (opinion).

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Every panel has a state matrix** and each state is designed: ready, loading, empty (first use), empty (no results), partial failure, stale, no permission (B25). [judged]
2. **States keep the panel's size.** Skeletons and empty states occupy the same box as the ready state, so nothing jumps (design-layout 05). [judged]
3. **Loading never says "No results"**, and an empty state never spins forever (design-ux 04). [judged]
4. **No indicator for waits under 1 s; delay any loader 150 to 300 ms and keep it at least 300 to 500 ms** once shown (B1, B2, B26). [judged]
5. **Failure stays local.** One failed panel shows an error in that panel with a retry; the rest of the page works (B13). [judged]
6. **Status changes are announced** through a live region that exists in the DOM before it changes: "Loading top pages", "12 rows selected", "3 issues archived. Undo" (WCAG 4.1.3). [judged]
7. **Selection and bulk actions are keyboard operable**, with the count visible and announced. [judged]
8. **Shimmer stops under `prefers-reduced-motion`** (FOUNDATIONS). [lint]

### Standards
| Standard | Applies to |
|---|---|
| WCAG 4.1.3 | Live region announcements for load, select, bulk results |
| WCAG 2.2.1 | Undo toasts give enough time (at least 5 s, pause on hover and focus; design-ux 04) |
| WCAG 1.4.1 | Error and warning states use icon plus text, not color alone |
| WCAG 3.3.4 | Bulk delete of data: reversible, or confirmed |
| `aria-busy="true"` | On a region while it reloads, removed when done |

### Decision rules
- **Which loading treatment?** Under 1 s: none. Panels on first load: skeleton that mirrors the final geometry (B6). Refreshing data already on screen: keep the old data, show a small inline spinner or "Updating..." in the panel header, set `aria-busy` (stale-while-revalidate). 3 s and up with a known size: determinate progress (B3).
- **Load in parts.** Render each panel as its data arrives, most important first: KPIs, then the main chart, then tables (B4, B5).
- **Which empty state?**
  - First use (new workspace): what this panel will show, one primary action, optional labelled sample data (B8, B9, B12).
  - No results (filters): name the filter, offer "Clear filters" (design-ux 04).
  - Truly zero (no errors this week): a positive line, not an illustration ("No failed checkouts in the last 7 days").
- **Partial failure.** Replace only the failing panel's body with a warning icon, a one-line cause, and "Retry". Do not imply data loss; name what is missing; avoid stacking several error banners (B13 to B16).
- **Never disable a control because of an outage**; explain in place (research 03 S10).
- **Permission state.** Show the panel frame and a line naming who can grant access, with "Request access". Hide the panel only when its existence is itself sensitive (opinion; design-ux 04 "no permission" empty state).
- **Stale data.** Show "Updated 2 min ago" in the page header or panel header; past a freshness threshold (for example 15 min on an operational dashboard), tint it as a warning with an icon and "Refresh" (opinion).
- **Bulk selection model.**
  - Checkbox column, 40px wide, 24px targets. Header checkbox is tri-state: unchecked, checked, mixed (`aria-checked="mixed"` or the input's `indeterminate`).
  - Shift click selects a range; keyboard `X` (or Space on a focused row) toggles; Cmd/Ctrl+A selects all visible (B23, B24).
  - After selecting a full page, offer "Select all 2,400 matching" in the bulk bar (opinion; common pattern, Polaris has the props).
  - The bulk bar appears on first selection: count, verb plus noun actions ("Archive 12 pages"), and "Clear selection" (B17, B20). Top of the table (Carbon) or a floating bar at the bottom (Linear); pick one per product (B22).
  - While rows are selected, per-row action menus are disabled (B18).
- **Undo or confirm for bulk?** Reversible actions (archive, move, label): act immediately, toast "12 pages archived. Undo". Irreversible (delete forever, send to customers): confirm with the count in the button ("Delete 12 pages") (design-ux expert move 2).

### Numbers
| Thing | Value | Source |
|---|---|---|
| Show no loader under | 1 s | B1 |
| Loader show delay, minimum visible | 150 to 300 ms, 300 to 500 ms | B26 |
| Determinate progress from | 3 s with known size; always over 10 s | B3; Primer |
| Skeleton bar heights | text line height of the real text (for 14/1.5 text, a 12px bar in a 21px line) | opinion; geometry rule |
| Skeleton shimmer | 1.2 to 1.6 s loop, off under reduced motion | opinion; FOUNDATIONS |
| Undo toast | at least 5 s, pause on hover and focus | design-ux 04 |
| Hide bulk actions | never on desktop; on phones only under 490px and only when non-essential | B21 |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (public docs)
- **Vercel (Geist)**: four empty state variants: blank slate, informational, educational, guide with starter content (B11, B12). Guidelines: design empty, sparse, dense and error states (B25).
- **GitHub Primer**: no loader under 1 s, load collections item by item, most important first; degraded experiences replace only affected content (B1 to B6, B13 to B16).
- **Linear**: X to select, Shift for ranges, Cmd/Ctrl+A for all; common bulk actions in a bar at the bottom, the full set in Cmd/Ctrl+K and the context menu (B22 to B24).
- **Carbon (IBM)**: batch bar at the top of the table on selection; row actions disabled in batch mode (B17, B18).

### Signature moves
1. **The skeleton is the layout.** Same card, same header, same row count and column widths, bars at text height; the only difference is gray bars instead of glyphs. The switch to ready is a swap with no movement (B6; design-ux expert move 5).
2. **Header-only refresh.** When data refreshes, the panel keeps its content and the header shows "Updating..." then "Updated just now". Content never blanks to a skeleton twice (opinion; stale-while-revalidate).
3. **Partial failure reads as calm.** One panel says "Top pages didn't load. The analytics API timed out. Retry"; KPIs and chart still render. One message, one action (B13 to B16).
4. **Empty states that act.** A new workspace's overview shows each panel's frame with "No events yet" and one shared primary action ("Install the tracking snippet"), plus a "View with sample data" toggle that labels every number "Sample". Not a full-page illustration (B8, B12; design-ux 05 sample data).
5. **Permission state names a person.** "Revenue is visible to Finance admins. Ask Priya Shah for access" with "Request access". A lock icon plus text, not a blurred chart (opinion).
6. **Selection count is the bulk bar's title.** "12 selected" in tabular figures, then actions, then "Select all 2,400 matching", then "Clear". The bar replaces the table's toolbar instead of stacking on it, so the table does not jump (Carbon B17; opinion on replacement).
7. **The page tells you it is a state.** A state switcher in test builds (and a `?state=` URL parameter) lets reviewers render every state; the states are part of the design file, not a later ticket (opinion).

### Do and don't
| Do | Don't |
|---|---|
| Skeleton with the real row count and column widths | A centered spinner in an empty box |
| "Updated 2 min ago" and in-place refresh | Blank the page on every refresh |
| One failing card shows Retry | A full-page error because one API failed |
| "Ask Priya Shah for access" | A disabled panel with no explanation |
| "Archive 12 pages" then Undo | "Are you sure?" on every bulk archive |

### Worked examples
**Tally overview states (slice brief B).**
- Loading: KPI tiles with a 12px label bar and a 31px-tall value bar; chart card with axis lines and no line; table with 5 skeleton rows. `aria-busy` on main; live region "Loading overview".
- New workspace: KPIs show a muted dash and "No data yet"; chart card says "Your first events will appear here within a minute of installing the snippet" and one "Install snippet" primary; table empty state "No pages tracked yet".
- Partial failure: the table panel body says "Top pages didn't load. The query timed out after 30 s." with "Retry"; warning icon; KPIs and chart intact.
- Permission (viewer role): Revenue tile reads "Restricted" with a lock icon and "Ask Priya Shah"; the rest renders.

**Bulk archive 300 issues.** X selects, Shift+click to row 50, "Select all 300 matching", "Archive 300 issues"; toast "300 issues archived. Undo" for 8 s with pause on hover; the archive runs as a background job with a progress line in the toast if it exceeds 1 s.

## Hand-offs
- Timing, error ladder, toasts, optimistic UI: design-ux `references/04-states-feedback.md`.
- Sample data and first-run checklists: design-ux `references/05-onboarding.md`.
- State wording: design-copy `references/02-ux-microcopy.md`.
- Shimmer motion: design-motion `references/04-micro-interactions.md`.
- Chart empty and error states: dataviz.
