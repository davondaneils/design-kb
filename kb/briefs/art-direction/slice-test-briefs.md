# Art direction: rendered slice test briefs

Editor-in-chief, 2026-10-09. The tester runs these and does not change them.

The baseline is the pair of with-skill pages from the color pilot, unchanged: `kb/tests/design-color/coffee-with.html` and `dashboard-with.html`. They passed the gate (0 lint fails) and Davon ranked them better but "not super special". The tester copies them into `kb/tests/design-art-direction/` and improves them through design-director, the playbook and design-art-direction, so before and after differ by this domain (plus any layout or type change the art direction forces, which the report must name).

## Brief A: Ember and Oak coffee roaster landing page
Same facts as `kb/briefs/color/slice-test-briefs.md` brief A. New requirement: give the site a real art direction concept, stated in one sentence, and carry it through hero, subscription, shop cards, story, footer and dark mode. No photos can load; build every visual from SVG, CSS and code, and include the photo request the roaster would receive.
- Playbook: design-playbook-landing. Exemplars: apple.com product pages (product presentation), family.co (warmth, craft), teenage.engineering (an object-led brand with a strict system).

## Brief B: Tally analytics dashboard
Same facts as color brief B. New requirement: imagery in product UI only where it carries data or state. Add KPI sparklines, an empty or loading state, and a brand moment that does not compete with the data.
- Playbook: design-playbook-dashboard. Exemplars: Linear app, Stripe Dashboard, Vercel Dashboard.

## Rubric
Gate (any miss fails the page):
1. `node tools/lint.mjs` exits 0.
2. Every `[judged]` row of the FOUNDATIONS checklist holds on the screenshots, plus: text over any image or texture measured at the worst pixel; decorative art hidden from assistive tech, meaningful art named.

Art direction (rated close / clearly below / far below the exemplars):
3. Concept: one sentence, visible in at least three places, derived from a true brand fact.
4. Specificity: with the logo hidden, the visuals could only belong to this brand.
5. Finish: no visual reads as a placeholder or clip art; one drawing language (stroke, radius, palette).
6. Restraint: imagery supports hierarchy; the eye still lands on the headline (A) or KPI row (B) first.
7. Dark theme carries the concept (recolored, not dimmed).

Pass = gate 100 percent, rated close on 3 to 7, and clearly better than the baseline.
