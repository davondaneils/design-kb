---
name: design-product-ui
description: Domain reference loaded by design-director or a design playbook (mainly design-playbook-dashboard); do not trigger on its own for a page, screen or brand job. Covers dense app and tool UI at the level of Linear, Stripe Dashboard, Vercel Dashboard, Superhuman and Things: data tables (alignment, tabular numerals, units, sorting, sticky headers, row actions, responsive strategies that do not scroll the page), filters and structured search, command palettes and keyboard layers, settings pages and save models, navigation shells and density modes, empty, loading, partial failure and permission states, bulk actions, and dashboards that answer a question. Load it directly only when the user names it or asks a narrow question inside this domain alone.
---

# design-product-ui

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or `design-playbook-dashboard`. Accessibility floor: design-foundations `references/accessibility.md`. Usability floor: design-ux SKILL.md section 1.

Product UI is used for hours, by people who know it. Every choice favors scanning speed, predictable behavior and keyboard reach over first impressions. Standard: what the Linear, Stripe Dashboard and Vercel teams would ship. Work in this order: **fundamentals first, then decision rules, then the expert moves.**

## 1. Fundamentals (non-negotiable, check first)

Tables
1. Native `<table>` with a caption or labelled region, `th scope`; ARIA `grid` only when cells are editable or interactive.
2. Numbers right aligned in `tabular-nums`, header aligned with its data, one precision per column, unit in the header, true minus (U+2212).
3. Sortable headers are buttons; `aria-sort` on the one sorted `th`; one column sorted by default.
4. Row actions keyboard reachable and visible on focus; hover reveal only inside `@media (hover: hover)`.
5. No page-level sideways scroll at 390px. WCAG 1.4.10 excepts the table, never the page around it.
6. Unknown values are a muted dash with a hidden "No value", never blank.

Find and command
7. Every shortcut has a clickable twin; single-character shortcuts (including `/` and `?`) can be turned off (WCAG 2.1.4); none fire while typing; platform shortcuts are never repurposed.
8. The palette is a modal dialog with an APG combobox; Escape returns focus to the trigger.
9. Filter, sort and search state lives in the URL; active filters are visible chips with "Clear all".

Forms and settings
10. One save model per form; save state visible and announced; dirty forms show Save and Discard.
11. A control people cannot use says why in visible text and who can change it. Never disable a control because a service is down.
12. Destructive settings live apart, last, with a confirmation that names the loss, or with undo.

Shell and density
13. Same page header on every screen: title left, one primary action right, view options below.
14. Location marked with `aria-current` plus a non-color cue; sidebar at most two levels; skip link.
15. Density changes row height and padding only; UI text stays 14px or more, targets 24px or more; coarse pointers never get compact.

States and bulk
16. Every panel has designed ready, loading, empty, no-results, partial failure, stale and no-permission states that keep its size.
17. No loader under 1 s; delay loaders 150 to 300 ms, then show at least 300 to 500 ms; loading never says "No results".
18. Status changes ("12 selected", "Top pages didn't load") announced by a live region that exists before it changes.

Dashboards
19. One question per dashboard; position and length encodings; deltas with sign, arrow and the word when bad; comparison period and freshness visible.

## 2. Core numbers (match FOUNDATIONS)

| Thing | Default | Source |
|---|---|---|
| Row height | 32 compact, 40 default, 48 comfortable | design-layout 05; Carbon |
| Cell padding inline | 12 compact, 16 default; outer cells match panel padding | design-layout 05 |
| UI text | `--text-sm` 14; headers and meta `--text-xs` 12 at 4.5:1 | FOUNDATIONS |
| Selection column | 40px wide, 24px checkbox target | WCAG 2.5.8 |
| Sidebar | 240px at lg+, 56px icon rail md to lg, drawer under md | opinion; design-ux 02 |
| Top bar | 56px (48 compact): 8 or 12 padding around 40 (32) controls | opinion |
| Palette | 560 to 640px wide, 12 to 20vh from top, 40px rows, under 100 ms per keystroke (aim 50) | Superhuman; opinion |
| Loading | none under 1 s; skeleton first load; determinate from 3 s with known size | Primer; Vercel |
| Undo toast | 5 s minimum, pauses on hover and focus | design-ux 04 |
| KPIs | 3 to 5 per row; value 31 to 39px weight 600; tiles abbreviate to 3 significant figures (full value in an sr-only span, never `aria-label` on a span), tables never | design-layout 05; opinion |
| Bulk actions | bar on first selection; hide on phones only under 490px and only if non-essential | Carbon; Polaris |

## 3. Decision rules

### Tables (`references/01-tables.md`)
- Table or grid: read-only cells plus a link and a menu per row is a table; spreadsheet-like editing is a grid with one tab stop.
- Row actions: 1 or 2 inline as labelled icon buttons in the last column; 3 or more in a "More" menu with at most one pulled out.
- The primary cell is the real link; whole-row click only forwards to it.
- Responsive, in this order: (1) cut columns by priority; (2) collapse rows to two-line list items, primary cell and the sorted measure on line 1, restoring ARIA table roles because Safari drops table semantics on `display` changes; (3) scroll inside a focusable, labelled box with a locked first column and a visible cut-off cue, only for true multi-measure comparison.
- Sticky header whenever the table is taller than its viewport, with `scroll-padding-top` so focus is never hidden (WCAG 2.4.11).
- Pagination with counts for lookup tables; virtualize past about 500 rows; no infinite scroll.

### Find and command (`references/02-find-and-command.md`)
- Page-scope filters once in the page toolbar; table-only filters on the table header; never both.
- Plain search by default; add structured syntax (`status:failed amount:>100 -country:US`) for daily expert users, taught by suggestions in the field.
- Shortcut tiers: (1) Tab, Enter, Escape, arrows; (2) Cmd/Ctrl+K, `/`, `?`; (3) single keys and sequences (`C`, `X`, `G` then `D`). Tier 3 only when 1 and 2 exist.
- Show "⌘K" on macOS, "Ctrl K" elsewhere; tooltips show name plus shortcut.

### Forms and settings (`references/03-forms-settings.md`)
- Start with explicit save; autosave imperative controls (theme, notification switches, density).
- Switch means applied now; checkbox and text field mean "press Save".
- Annotated two columns at md and up (group title and description left about 1/3, card of controls right); one column below.
- Settings split by scope: personal, workspace, project.
- Confirm strength: reversible gets undo; irreversible gets a dialog with the consequence in the button; irreversible and wide blast radius also types the object's name (opinion).

### Shells and density (`references/04-shells-density.md`)
- Route "tabs" are a `nav` of links with `aria-current`; only in-place panel switches use the APG tab pattern.
- Breadcrumbs at 3 or more levels; hierarchy not history; last crumb not a link.
- Default density for mixed audiences; compact default only for daily expert tools; offer a switch only in tools used daily.

### States and bulk (`references/05-states-bulk.md`)
- Refreshing data on screen keeps it and shows "Updating..." in the panel header (`aria-busy`), not a second skeleton.
- Load panels in parts, most important first.
- Partial failure: replace only the failing panel's body with icon, cause and Retry; do not imply data loss.
- Permission: show the frame and who can grant access, with "Request access"; hide only if the panel's existence is sensitive.
- Notifications inbox: two tabs, "needs you" (assigned, mentioned, review requested) and everything else, each with a count; every row names its reason; triage by keyboard (Done, snooze, read toggle) with a way back. One channel per event: an item read in the inbox never also arrives by email. Push permission is asked after the first useful moment, not on first sign-in. Examples: `kb/references/patterns/09-notifications.md` (Linear Priority and Other, GitHub reason labels and Done).
- First run: the real product with labelled sample data, not a tour; permissions (notifications, integrations) are asked when the feature that needs them is first used (design-ux `references/05-onboarding.md`; examples in `kb/references/patterns/01-onboarding.md`).
- Bulk: tri-state header checkbox (native `indeterminate`), Shift range, `X` toggle, "Select all N matching", verb plus noun actions with the count, row menus disabled while selecting; undo for reversible, confirm with count for irreversible.

### Dashboards (`references/06-dashboards.md`)
- Operational (on-call): status and alerts first, compact, auto refresh, freshness prominent. Analytical (weekly review): answer line, KPIs, trend with benchmark, breakdowns, detail table.
- Alerts needing action today go before the charts.
- Benchmark as a dashed gray line, not another color. Every chart through dataviz.

## 4. Expert moves (above the gate)
1. **Shared column edge.** Right-aligned numeric headers with the sort arrow on the inner side, so header and figures end on one line.
2. **Units in the header, figures in the cells.** The column reads as one shape.
3. **The row has one door.** Primary cell link plus row hover tint: a big target, one tab stop per row, clean screen reader output.
4. **Collapse that keeps the comparison.** On phones the sorted measure stays right aligned on line 1 of each item; secondary measures drop to a muted line 2.
5. **Restore table roles after restyling** rows as grid or flex, or Safari stops announcing a table.
6. **Middle truncation** for paths and IDs, whose ends differ (opinion).
7. **The palette teaches.** Every command shows its shortcut; 2 to 4 synonyms per command; context-first groups (Superhuman). Rank prefix and word-start matches above typo-tolerant ones.
8. **Instant, not animated.** Palette and keyboard navigation do not animate; Superhuman aims under 50 ms.
9. **The control's shape tells the save model.** Switch applied, checkbox pending; save bar appears only when dirty.
10. **Say who can change it.** Read-only values with a lock and "Ask Priya Shah", never a silent gray field.
11. **Density as one attribute.** `[data-density=compact]` remaps three tokens; components never special-case it.
12. **Chrome one step from the canvas.** Sidebar and top bar on `--color-bg`, work area on `--color-surface`, a hairline between; no dark slab.
13. **The skeleton is the layout.** Same rows, widths and text heights; the swap to ready does not move a pixel.
14. **Header-only refresh** with "Updated 2 min ago"; content never blanks twice.
15. **The answer line.** One computed sentence above the KPIs that states the finding and links to its panels (opinion).
16. **Bad news gets words.** "+0.4 pts, worse" because a red up arrow is ambiguous for churn.
17. **States are reviewable.** A `?state=` parameter or a state switcher renders every state for review.

## 5. How to apply it to a screen
1. Name the screen's job and the question it answers, the audience (daily expert or occasional) and the device mix. That sets density and the keyboard tier.
2. Draw the shell and page header once; reuse on every screen.
3. For each panel, write its state matrix before styling it.
4. Build tables with the fundamentals, then pick the responsive strategy.
5. Add the keyboard layer: entry points, palette, `?` sheet, the 2.1.4 setting.
6. Render every state at 390 and 1440, light and dark, and lint each (`node tools/lint.mjs`). Compare to the closest exemplar in design-playbook-dashboard `references/signature-moves.md`.

## 6. Reference map
| Need | Read |
|---|---|
| Alignment, numerals, sorting, sticky, row actions, responsive strategies, pagination | `references/01-tables.md` |
| Filter bars, structured search, command palette, shortcut tiers, WCAG 2.1.4 | `references/02-find-and-command.md` |
| Settings layout, save models, inline edit, danger zone, disabled with reason | `references/03-forms-settings.md` |
| Shell anatomy, tabs vs links, breadcrumbs, scope switcher, density modes | `references/04-shells-density.md` |
| State matrix, skeletons, partial failure, permission states, bulk selection and actions | `references/05-states-bulk.md` |
| Answer line, KPI anatomy, operational vs analytical, freshness, alerts | `references/06-dashboards.md` |
| What the best shipped products do, observed and linked: tables, filters, command palettes, settings, notifications, onboarding, empty, permission and error states | `kb/references/patterns/` (README lists the 11 files and the floor each one extends) |

## 7. Hand-offs
- Usability gate, nav chooser, field rules, loading timing, error ladder: design-ux.
- Row heights, dashboard grid, KPI reflow: design-layout `references/05-page-composition-and-density.md`.
- Figures and minus sign: design-typography `references/05-typographic-detail.md`.
- Status and theme tokens: design-color `references/ui-tokens-themes.md`.
- Charts, sparklines, KPI visuals: dataviz.
- Microcopy for states, commands, confirmations: design-copy `references/02-ux-microcopy.md`.
- Data condition and response field behind each panel state, capability flags with reasons (fundamental 11), server totals: design-data `references/07-data-shapes-the-ui.md`.
- Markup and build: design-frontend.

## 8. Where defaults may change
Safari table semantics under CSS `display` changes (Roselli, last checked Dec 2022): recheck yearly. Apple keyboard guidance moves with each OS. Exemplar values here come from the teams' public docs; the apps themselves were not screenshotted (login walls and blocked hosts, 2026-10-09).
