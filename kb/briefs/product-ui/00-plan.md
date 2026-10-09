# Plan: product and tool UI (domain 18)

Editor-in-chief, 2026-10-09. Layer: domain reference. Skill: `design-product-ui`. Loaded by design-playbook-dashboard (slot 3 of its load order) and by design-director for any app screen.

## Why this domain exists
The color pilot dashboard passed every lint check and rated "close on color, clearly below on craft depth" (`kb/tests/design-color.md`). The named misses were product UI misses: no empty or loading states, no density options, no keyboard layer, and a table that scrolled sideways on phones. Davon's blind ranking agreed the pages were "not super special". This domain owns those moves.

## Scope (6 subtopics)
| # | Subtopic | Owns | Reuses (link, do not copy) |
|---|---|---|---|
| 01 | Tables and data grids | alignment, numerals, units, sorting, sticky headers, row actions, responsive strategies | design-layout 05 (row heights), design-typography 05 (figures, minus sign) |
| 02 | Find and command | filter bars, chips, structured search, command palette, keyboard layers | design-ux 02 (faceted filter rules); design-search is SEO, not this |
| 03 | Forms and settings | settings page layout, save models, inline edit, danger zone, disabled-with-reason | design-ux 03 (field rules, validation timing) |
| 04 | Shells and density | app shell, sidebar, page header, tabs vs nav links, breadcrumbs, density modes | design-ux 02 (nav chooser), design-layout 05 (density table) |
| 05 | States and bulk actions | state matrix per view, skeleton geometry, partial failure, permission states, bulk select and actions, undo | design-ux 04 (loading timing, error ladder) |
| 06 | Dashboards that answer a question | the answer line, KPI anatomy, freshness, alert placement, layout order | dataviz (every chart), design-layout 05 (dashboard grid) |

## Not in scope
Chart encoding and palettes (dataviz). Visual identity (design-color, design-typography). Native mobile conventions (design-playbook-mobile). Marketing pages (design-playbook-landing).

## Order and gates
researcher (6 notes) > specialist (6 chapters) > architect > critic (20% citation re-fetch) > tester (rendered pages, `slice-test-briefs.md`) > librarian. Loop cap 3.

## Network note
Exemplar apps sit behind logins, and `curl` to exemplar hosts is denied by the egress policy. The WebFetch tool could read public docs of Linear, Vercel (Geist), Stripe, Things, Superhuman, W3C, NN/g, Primer, Polaris, Carbon and GOV.UK on 2026-10-09. Those docs are the tier 2 evidence. No screenshots of the apps were possible.
