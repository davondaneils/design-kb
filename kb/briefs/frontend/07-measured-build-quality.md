# Brief 07: Measured build quality (render test of design-frontend)

Written by the editor-in-chief, 2026-10-10. design-frontend v0.1 was tested on text only, and its accessibility reference moved to design-foundations. This brief turns the skill into something that is proven on rendered pages: every build claim is either linted, measured or diffed.

## Question
How do I prove that a page's code is as good as its pixels: semantic structure, modern token-driven CSS, Core Web Vitals, page weight and font loading, and that a refactor to that standard changed nothing a person can see?

## Audience
Claude, as the last stage of design-director (the build), and anyone reviewing a design-kb test page's code. Assumes design-foundations is loaded.

## Decisions the reader must be able to make
1. Which build fundamentals are already linted by `tools/lint.mjs`, and which the build has to check another way (skip link, landmarks, form names, head order, real HTML before JS).
2. The `@layer` order for a single-file page and where user-preference overrides with `!important` belong (the layer that wins for important declarations).
3. Which theme values go through `light-dark()` and which cannot (only colors and images can).
4. Media query or container query for each layout switch on the two test pages, and what changes at in-between widths when you switch.
5. Where the critical rendering path ends on a self-contained page with inlined fonts, and how to keep the head small without changing the look.
6. Which lab numbers to report (LCP, CLS, INP proxy, TBT, wire bytes) under which throttling profile, and what they can and cannot say about field p75.
7. How to prove "no visual change": which widths, schemes and states to diff, and what to do with a deliberate change.

## Fundamentals (the gate)
- `tools/lint.mjs` exits 0 on the page and every `?state=` URL, before and after.
- The design-frontend markup gate (skill section 1) holds on both pages; each item names how it is checked.
- No visual change: pixel diff of before and after at 390, 768, 1024 and 1440px, light and dark, plus every review state, is identical (0 differing pixels). Any intended difference is listed with its reason and shown.
- Lab vitals on the mobile profile are "good" (LCP 2.5 s or less, CLS 0.1 or less, INP proxy 200 ms or less) and not worse than before on any metric beyond run-to-run noise.

## Expert layer
- The skill must carry measured, non-obvious findings from these two pages, not restated docs. Candidates the researcher should check: inline SVG is never an LCP candidate, so an illustrated hero's LCP is its text and depends on font delivery; pointer-driven tooltips positioned with `left` count as layout shift because hover is not "recent input"; important declarations in the first layer win over every later layer; base64 fonts in the head move the first paint behind tens of KB; a viewport breakpoint can invert a component's available width when a sidebar collapses to a rail.
- Every expert move gets a number from these pages or a source.

## Must cover
Semantic audit of both pages; CSS architecture (layers, tokens only in components, `light-dark()`, logical properties, container queries, `:has()`, range media syntax, hover guarding, `dvh`); CWV method (throttling profile, interactions scripted for the INP proxy, number of runs, median); page weight by part and the critical path; font loading (inline versus external, metric fallbacks, `font-display`); pixel-diff method; tools the skill ships for all of the above.

## Out of scope or reuse
- Accessibility rules themselves: design-foundations `references/accessibility.md`.
- Visual design changes of any kind: this test changes code, not look.
- Image pipelines (no photos on these pages): design-frontend `references/05-images-fonts.md` stays as is.

## Test briefs
Both run through design-director, then design-playbook-landing or design-playbook-dashboard, with design-frontend applied at the build step.

1. **Coffee roaster landing page** (Ember and Oak). Start: `kb/tests/combined/coffee.html` (Davon picked it 3 of 3). Task: refactor its CSS and markup to the design-frontend standard with no visual change; measure vitals, weight and fonts before and after. Closest exemplars: apple.com product pages, family.co (`design-playbook-landing` `references/signature-moves.md`).
2. **Tally analytics dashboard**. Start: `kb/tests/combined/dashboard.html`. Same task, plus the INP proxy over sorting, density switch, command palette and chart hover. Closest exemplars: Linear app, Vercel dashboard.
3. **Stress brief** (judged on code, no new page): the dashboard's KPI strip at a 900px viewport, where the sidebar is a rail and the panel is wider than at 1024px. Decide media or container query and show the render.

## Rubric
**Gate** (all must hold): lint 0 fails on every target; markup gate holds; pixel diff identical at every width, scheme and state (or each difference explained as intended); lab vitals good and not worse.

**Build rubric** (pass or fail each, on the code and the measurements):
1. Layers: one declared order; preference overrides in the first layer; unlayered CSS only where it must beat layers on purpose.
2. Tokens: no raw colors, primitives or raw spacing in component rules (`assets/css-audit.mjs` 0 fails).
3. Theming: colors through `light-dark()`; the non-color remainder in one scheme block; `color-scheme` set.
4. Responsiveness: page layout by media query in range syntax; components that live in variable space by container query; no `max-width: N-1px` pairs.
5. Input: every `:hover` inside `(hover: hover)`; nothing depends on hover.
6. Critical path: what must arrive before first paint is reported, and reduced where possible without a visual change.
7. Fonts: no layout shift on swap (lint `fallback` and vitals CLS); delivery strategy stated.
8. Runtime: no layout shift from pointer-driven UI; persisted UI preferences applied before first paint.

**Exemplar closeness:** judged on the renders as in `kb/tests/combined.md`. This brief cannot move the look, so the rating is expected to stay where combined left it; the report says so rather than claiming a visual gain.

**Pass** = gate 100 percent and build rubric 8 of 8 on both pages, with the gains measured.
