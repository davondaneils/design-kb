# Brief 06: Page pacing, signature layout moves, phone editing, dashboard grids

Editor-in-chief, 2026-10-10. Wave 2 for design-layout (v0.1 was text-tested only). Trigger: the combined test (`kb/tests/combined.md`) passed the gate and won Davon's blind ranking 3 of 3, but the judge wrote that the coffee page's middle "is competent but quieter than the hero; nothing there would make a Pentagram partner stop", and Davon called the earlier pages "not super special". Layout owns the part of that gap that is composition, not imagery or type.

## Question
How does a page keep its energy from the hero to the footer, what layout move makes it recognisable, how does it change between 390 and 1440 without becoming a squashed desktop, and how is a dashboard's grid proportioned and made dense without becoming cramped?

## Audience
Claude, running design-director with a landing or dashboard playbook, after copy and before color.

## Decisions the reader must be able to make
1. The loudness of each section (loud, medium, quiet) and their order, so no two loud sections of the same kind sit together and no run of quiet sections follows the hero.
2. One signature layout move for the page, and where the grid is broken on purpose (once or twice, never everywhere).
3. Cards versus a ruled index for a short product list.
4. What a phone layout keeps, reorders, crops, collapses, defers or merges, and what it never cuts.
5. The fold: what must sit in the first phone screen, and what must peek at 1440 x 900.
6. A dashboard's row structure and column split (primary pane and supporting pane), when panels stack, and how rows reach equal heights without holes.
7. Where the measure is set (`52ch` on the text element) and how to confirm it.

## Fundamentals (gate, checked first)
- FOUNDATIONS checklist items 5 (measure), 7 (spacing scale), 8 (no horizontal scroll), 11, 12 (one primary action, scan path), 13 (aligned edges), 15 (states without layout shift).
- DOM order equals reading order at every width (WCAG 1.3.2). Reordering by CSS for the phone is a fail.
- Phone first screen (390 x 844): what it is, for whom, and the primary action, all visible (playbook-landing non-negotiable 2).
- No unique content removed at any width (Google mobile-first indexing; research 06).

## Expert layer (what a top practitioner adds)
- Section pacing as a flatplan: alternate loud and quiet, vary the kind of loudness (type, color, data), never alternate by flipping media sides (NN/g zigzag).
- A page grid with a margin column that carries labels, captions, hanging numerals and axis labels, so the body edge repeats down the page.
- Breaking the grid toward one edge only, for the one artifact that deserves it.
- Proof next to claim as a layout rule (the offer next to the prices it beats; the platform breakdown next to the alert it explains).
- Data drawn into the layout's own furniture (rules to scale), so a section gets a picture without an image.
- Phone editing as an explicit list per section, not "it stacks".
- Supporting pane proportions for dashboards; rows stretch, short panels pin a footnote.

## Must cover
- Pacing, signature moves, phone editing, dashboard grid and density.
- Confirm `52ch` against the lint and the measuring script.
- Measured before and after numbers (page height at 390, CTA position, edge counts, fold peeks).

## Out of scope or reuse
- Imagery, photography and art concepts: design-art-direction. Type choice and the display ramp: design-typography. Table internals and states: design-product-ui. Chart form: dataviz. Section copy order: design-copy reference 01.

## Test briefs (rendered, run through design-director)
1. **Specialty coffee roaster landing page**, light and dark, 390 to 1440. Playbook: design-playbook-landing. Start from `kb/tests/combined/coffee.html` (the current best, Davon 3 of 3) and improve it with this reference only. Closest exemplars: apple.com product pages (pacing, one idea per screen), family.co and mercury.com (restraint, editorial grid). Target: the middle of the page carries a signature move; the phone page is edited, not shrunk.
2. **SaaS analytics overview dashboard**, light and dark, 390 to 1440, every `?state=`. Playbook: design-playbook-dashboard. Start from `kb/tests/combined/dashboard.html`. Closest exemplars: Stripe Dashboard home, Vercel Dashboard, Linear app. Target: primary trend and its explanation in the first screen at 1440 x 900, supporting pane proportions, equal-height rows, phone toolbar in one line.

## Rubric
**Gate (pass or fail, first):** `node tools/lint.mjs` 0 fails on both pages, every state URL and both state sheets; the `[judged]` rows of the FOUNDATIONS checklist hold on the screenshots; DOM order = reading order; no unique content cut at 390.

**Then, against the closest exemplar (close, clearly below, far below):**
| Criterion | Close means |
|---|---|
| Pacing | You can name each section's loudness and the sequence alternates; no two adjacent sections are loud in the same way |
| Signature | One layout move a viewer would remember and could not lift onto a competitor without it looking borrowed |
| Grid | Few left edges, each reused many times (measured); deliberate breaks only |
| Phone | First screen holds the offer and action; page measurably shorter than a straight stack without losing a fact |
| Dashboard | Answer, KPIs, alerts, primary trend and its explainer in the first 900px; panel proportions follow primary/supporting; no holes in rows |
| Honesty | The report names what still separates the page from the exemplar, including what layout cannot fix |
