---
name: design-playbook-dashboard
description: Job playbook for SaaS app screens, dashboards and internal tools at the level of the Linear app, Stripe Dashboard and Vercel Dashboard. Use for "make a dashboard", "admin panel", "analytics screen", "settings page", "internal tool", "CRUD app", "table view", "data-heavy UI", "back office", "redesign this app screen", "make our app look like Linear". Says which foundations and domain references to load in what order, what done looks like, and the signature moves the product UI exemplars share. Not for marketing pages (design-playbook-landing) or native mobile apps (design-playbook-mobile).
---

# design-playbook-dashboard

Product UI is used for hours, not seconds. Every choice favors scanning speed, density with calm, and predictable behavior over first impressions.

## 1. Load in this order
1. **design-foundations** (always): tokens, the 15-item gate, `references/accessibility.md`.
2. **design-ux**: `references/01-fundamentals.md` (the gate), `02-navigation-ia.md`, `03-forms.md`, `04-states-feedback.md`.
3. Product and tool UI (planned): tables, dense forms, command palettes, settings.
4. **design-layout**: `references/05-page-composition-and-density.md`, `01-grids-and-structure.md`, `04-responsive-and-adaptive.md`.
5. **design-typography**: `references/04-hierarchy-ui-editorial.md`, `05-typographic-detail.md` (tabular numerals).
6. **design-color**: `references/ui-tokens-themes.md` (roles, status colors, themes).
7. **dataviz**: every chart, sparkline and KPI tile.
8. **design-copy**: `references/02-ux-microcopy.md`.
9. **design-motion**: `references/04-micro-interactions.md`. Fast, rare, never on keyboard-driven actions.
10. **design-frontend**: build.
11. Visual polish (planned), then the self-critique loop in design-director.

Copy is always design-copy here; direct response copywriting never applies inside a product.

## 2. Non-negotiables for this job
1. The page title and one primary action sit in the same place on every screen.
2. Every view has its empty, loading, error and partial states designed, not just the happy path.
3. Numbers are right aligned in tables, use tabular numerals, and carry units; deltas say up or down in words or icons, not color alone.
4. Status colors (success, warning, danger, info) never reuse the brand color.
5. Keyboard: every action reachable, focus visible, shortcuts never the only way.
6. Tables reflow or switch to a list at 390px; no page level horizontal scroll.

## 3. Done means
1. `node tools/lint.mjs page.html` exits 0.
2. `node tools/render.mjs page.html out/` and every `[judged]` row holds, including state screenshots (empty, loading, error) where the screen has them.
3. Side by side with the closest exemplar (`references/signature-moves.md`), rated close on density, hierarchy, chrome restraint and craft.
4. The hand-over names what is still short of the exemplar.

## 4. Reference map
| Need | Read |
|---|---|
| Closest exemplar by app type, and the moves the product UI exemplars share | `references/signature-moves.md` |
