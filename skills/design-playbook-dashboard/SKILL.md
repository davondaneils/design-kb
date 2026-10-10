---
name: design-playbook-dashboard
description: Job playbook for SaaS app screens, dashboards and internal tools at the level of the Linear app, Stripe Dashboard and Vercel Dashboard. Use for "make a dashboard", "admin panel", "analytics screen", "settings page", "internal tool", "CRUD app", "table view", "data-heavy UI", "back office", "redesign this app screen", "make our app look like Linear". Says which foundations and domain references to load in what order, what done looks like, and the signature moves the product UI exemplars share. Not for marketing pages (design-playbook-landing) or native mobile apps (design-playbook-mobile).
---

# design-playbook-dashboard

Product UI is used for hours, not seconds. Every choice favors scanning speed, density with calm, and predictable behavior over first impressions.

## 1. Load in this order
1. **design-foundations** (always): tokens, the 16-item gate, `references/accessibility.md`.
2. **design-ux**: `references/01-fundamentals.md` (the gate), `02-navigation-ia.md`, `03-forms.md`, `04-states-feedback.md`.
3. **design-product-ui**: SKILL.md, then `references/01-tables.md`, `05-states-bulk.md` and `06-dashboards.md` for every dashboard; `02-find-and-command.md` and `04-shells-density.md` for multi-screen tools; `03-forms-settings.md` for settings and edit screens.
4. **design-layout**: `references/05-page-composition-and-density.md`, `01-grids-and-structure.md`, `04-responsive-and-adaptive.md`, `06-pacing-signature-and-phone-editing.md` (dashboard grids). KPI strips and panels inside a collapsible sidebar shell respond to the **content area**, not the viewport: `container-type: inline-size` on the content area and conditions in `rem` (design-frontend `references/07-measured-build-quality.md` finding 13; FOUNDATIONS Breakpoints).
5. **design-typography**: `references/04-hierarchy-ui-editorial.md`, `05-typographic-detail.md` (tabular numerals), `06-type-without-web-fonts.md` (system stack or one shipped face, so figures align on every OS).
6. **design-color**: `references/ui-tokens-themes.md` (roles, status colors, themes).
7. **dataviz**: every chart, sparkline and KPI tile. **design-art-direction** `references/04-visuals-without-image-hosts.md` recipe 3 (sparklines) and the rule "only counts are pictures": product imagery shows a number or the state of a number, nothing decorative.
8. **design-graphic**: `references/02-icon-systems.md` ("Building a product icon set (code)") for any app with a sidebar or toolbar; never draw icons ad hoc. Run `assets/icon_audit.mjs`.
9. **design-copy**: `references/02-ux-microcopy.md`, `06-copy-in-context.md` (caveats on affected numbers, one clock).
10. **design-motion**: `references/04-micro-interactions.md` and `07-motion-on-real-pages.md` (live numbers, label swaps, the palette rule). Fast, rare, never on keyboard-driven actions.
11. **design-conversion** `references/05-in-product-upgrades.md` when the product has plan limits, trials or usage meters.
12. **design-search** `references/07-page-build.md`, the app-pages-behind-login rules only: `noindex`, no structured data, no private data in a social card. Check with `search-check.mjs --expect private`.
13. **design-frontend**: build.
14. **design-polish** after the lint gate passes: SKILL.md, `references/06-polish-checklist.md` and the references each item names. Then the self-critique loop in design-director.

Copy is always design-copy here; direct response copywriting never applies inside a product.

## 2. Non-negotiables for this job
1. The page title and one primary action sit in the same place on every screen.
2. Every view has its empty, loading, error and partial states designed, not just the happy path.
3. Numbers are right aligned in tables, use tabular numerals, and carry units; deltas say up or down in words or icons, not color alone.
4. Status colors (success, warning, danger, info) never reuse the brand color.
5. Keyboard: every action reachable, focus visible, shortcuts never the only way.
6. Tables reflow or switch to a list at 390px; no page level horizontal scroll.
7. A data-quality problem is marked on every number it affects ("Partial since 2:05 pm" on the tile), not only in an alert. The alert explains; the caveat stops the misread where the number is read.
8. Alerts are rows, not cards. A panel that explains another sits beside it at 2:1 from 1280px and stacks below it under that.
9. Upgrade is never the header primary unless the user is blocked by a limit (design-conversion `references/05-in-product-upgrades.md`).
10. **State truth.** Every number is true in every state and after every live update: empty and setup states show no number they cannot have (the sidebar usage meter and footnote totals included); a live update recomputes the delta, the answer sentence and every total that contains the number in the same frame; a source the page says stopped does not tick; a distinct count over an open window never falls. Mark the relations with the lint's data-attribute contract (design-director section 4, "State truth contract"; `tools/lint-truth.mjs`).
11. **Proportion honesty.** A share column is a share of all items, or its header says "share of rows shown"; shares of 6 rows of 214 never sum to 100 under a label that reads as share of all. Bars that encode a percent run 0 to 100 of the track; scaling them to the maximum makes 64 percent look like all (`kb/reviews/round3-critic.md`, dashboard fix 5; a full-row fill is the Vercel pattern, `kb/teardowns/vercel-dashboard.md`).
12. **One comparison basis, named where it is read.** The "Compared to" control drives every delta, chart and table column, or each names its own basis ("Change vs prev. 12 weeks"). Stripe's Dashboard pairs every delta with its period (`kb/reviews/round3-critic.md`, dashboard fix 4). `claims_inventory.mjs --render` warns `PERIOD` when a page carries two bases.
13. **The page header responds to the content container** and stays one row at every width, or `scroll-padding-top` covers it; under about 64rem of content width the search field folds into the command button (Linear has no standing search box; opinion, `kb/reviews/round3-critic.md`, dashboard fix 1).
14. Notifications and first run follow design-ux: an inbox split into needs-you and everything else, one channel per event, permissions asked when a feature needs them, the real product with labelled sample data instead of a tour (`kb/references/patterns/09-notifications.md`, `01-onboarding.md`).

## 3. Done means
1. `node tools/lint.mjs page.html` exits 0.
2. Every state is rendered and linted, not only the ready page: expose states through a `?state=` parameter (or equivalent), run `node tools/lint.mjs page.html --states state=loading,state=empty,...` and render each state URL. Build a state sheet (every control in every state; empty, loading, error and partial panels). Every `[judged]` row holds on those screenshots.
3. `search-check.mjs --expect private` exits 0 (the page carries `noindex`); `claims_inventory.mjs --render` exits 0, every `PERIOD` warning is fixed, and every number in copy matches the data on screen in every state and after one live update; the lint's `truth` and `proportion` checks pass with the data-attribute contract in place; renders at 390, 768, 1024 and 1440, and the 768 and 1024 shots are read, not only taken.
4. Side by side with the closest exemplar, rated close on density, hierarchy, chrome restraint and craft: the Linear app first, then the Stripe and Vercel dashboards (`kb/teardowns/INDEX.md`, `linear-app.md`, `stripe-dashboard.md`, `vercel-dashboard.md`; `references/signature-moves.md`).
5. A fresh-context critic has judged the gate (design-director section 5, step 13).
6. The hand-over names what is still short of the exemplar.

## 4. Reference map
| Need | Read |
|---|---|
| Closest exemplar by app type, and the moves the product UI exemplars share | `references/signature-moves.md` |
| Measured exemplar values (row heights, type steps, status colors) | `kb/teardowns/linear-app.md`, `stripe-dashboard.md`, `vercel-dashboard.md` |
| What the best shipped products do, pattern by pattern (tables, filters, palettes, settings, notifications, onboarding, empty and error states) | `kb/references/patterns/` |
