# Color pilot: vertical slice test briefs

Written by the editor-in-chief, 2026-10-09. The tester runs these and does not change them. Each brief is built twice (without and with the skills), linted with `tools/lint.mjs`, rendered with `tools/render.mjs`, and judged against the named exemplar.

Skills under test: design-director (routing and self-critique loop) + design-color, with layout, type and spacing taken from `kb/FOUNDATIONS.md` defaults (the layout, typography and copy skills are not on this branch).

## Brief A: Specialty coffee roaster landing page, light and dark

"Ember and Oak is a small-batch specialty coffee roaster in Portland. Brand orange `#F26B21`, used on their bags and van. Build the homepage: hero with the current single-origin, a subscription offer (main conversion), three featured coffees with tasting notes and price, a short 'how we roast' story, and a footer with newsletter signup. It must work in light and dark mode, follow the visitor's system setting, and feel premium and warm, not like a template."

- Closest exemplars: family.co and mercury.com for warmth and restraint, apple.com product pages for product presentation (from `kb/exemplars.md`).
- Color decisions the page must show: what the brand orange can and cannot do (text, button fill, label color), warm neutrals, dark mode remap, link and focus treatment, status color for the newsletter form error.

## Brief B: SaaS analytics dashboard, light and dark

"Tally is a product analytics SaaS. Brand teal `#14B8A6`. Build the main dashboard screen for a logged-in user: left navigation, top bar with date range and search, four KPI tiles (weekly active users, conversion, revenue, churn) with change versus last period, one line chart of active users over 12 weeks, a 'top pages' table, and an alerts panel with one warning and one error. Light and dark."

- Closest exemplars: Linear app, Stripe Dashboard, Vercel Dashboard (product UI, public screenshots only).
- Color decisions the page must show: brand teal in a role where it passes, positive and negative change colors that do not rely on color alone, status colors distinct from brand, chart colors that pass 3:1 against the surface, dense neutral surfaces and borders, dark mode that is not inverted.

## Rubric (both briefs)

**Gate (all must hold, any miss fails the page):**
1. `tools/lint.mjs` exits 0 (all `[lint]` rows of the FOUNDATIONS fundamentals checklist).
2. Every `[judged]` row of the checklist holds on the screenshots: non-text contrast 3:1 (borders on inputs, chart lines, icons, focus ring), nothing by color alone, one clear primary action, consistent tokens and radii, both themes designed, needed states present.

**Exemplar closeness (judged side by side, rated close / clearly below / far below):**
3. Color restraint: neutrals carry the page, the brand color appears where it earns attention, no rainbow.
4. Hierarchy: the eye lands on the headline (A) or the KPI row (B) first, then the primary action.
5. Craft: aligned edges, consistent radius family, borders vs shadows used consistently, dark mode surfaces step up in lightness for elevation.
6. Specificity to the brand: would you know this is a coffee roaster (A) or an analytics product (B) with the logo hidden?

**Pass** = gate 100 percent, rated close to the exemplar on 3 to 6, and clearly better than the without-skill page.
