# Brief: Copy in context (render test and v0.2)

**Domain:** copy. **Skill:** design-copy. **Layer:** reference. **Audience:** design-director and the playbooks, writing or reviewing every string on a page that is already laid out. **Editor-in-chief, 2026-10-10.**

## Question
v0.1 was tested on prose. What does copy have to get right once it sits in a real layout, next to real numbers, at 390 and 1440 px, in both themes, in every state?

## Audience
The art director building a premium landing page or a product screen (design-playbook-landing, design-playbook-dashboard). Not a direct response writer: by the design-director copy rule, `copywriting` is for sales pages and funnels only, never for the two pages tested here.

## Decisions the reader must be able to make
- Does every number, date and comparison in the copy match the data, price list or policy it describes?
- Is each promise said one way everywhere it appears (hero, facts, perks, steps, footer)?
- Which verb belongs to the primary action, and which actions must not use it?
- Where does a caveat go: in an alert, on the number it qualifies, or both?
- How do strings break at 390 and 1440 px, and which words must never be split?
- What does a screen reader hear after each action?
- Which mechanics apply (clock, dates, numerals, spelling) and are they the same on every string?

## Fundamentals
- Every number and comparison is true against its source (FTC: truthful, not misleading, substantiated).
- One promise, one wording: no two strings on a page state the same fact differently.
- The fundamentals gate of design-copy v0.1 (14 rules) still applies to every string, including state, error, empty and announcement strings.
- The page still passes the 15-item checklist in `kb/FOUNDATIONS.md` after the copy changes: copy never breaks layout, contrast or targets.

## Expert layer
- Reconciliation: the copy is audited against the chart data, the price list and the batch log, not only read.
- Copy that is set, not typed: no-break spaces inside dates, prices, ranges and number-unit pairs; rag and italic turns judged on the render.
- Caveats live on the number they qualify; the summary sentence adds what the tile cannot show.
- Verb reservation: the money verb belongs to one action.
- Paired price labels let the difference persuade without a savings claim.

## Must cover
Copy-to-data reconciliation, promise consistency, verb reservation, caveat placement, no-break rules, fallback-font wrap, live region strings, mechanics (clock, dates, numerals, spelling), the two v0.2 worked examples left open in the CHANGELOG (pricing feature table, settings screen), and the v0.2 source gaps (Apple HIG Writing, practitioners).

## Out of scope or reuse
Persuasion depth, awareness levels, offers: `copywriting` (not used on these pages). Positioning: `website-strategy`. Plan naming and price framing: `sales-funnels`. Type setting detail: design-typography `references/05-typographic-detail.md`. States and their design: design-ux, design-product-ui.

## Test briefs
Both run through design-director. Start from the pages Davon picked 3 of 3 (`kb/tests/combined/coffee.html`, `dashboard.html`) and change only copy, plus any CSS a copy change strictly needs, so the gain is attributable.
1. **Ember & Oak specialty coffee roaster landing page**, light and dark, 390 and 1440, with its `?state=` variants (added, subscribed, error, sending) and state sheet. Playbook: design-playbook-landing. Copy skill: design-copy (premium brand site, closest exemplars apple.com product pages and family.co; not direct response).
2. **Tally SaaS analytics overview**, light and dark, 390 and 1440, with `?state=` loading, empty, partial, viewer, `?density=compact`, `?open=palette`, `?open=sheet` and the state sheet. Playbook: design-playbook-dashboard. Copy skill: design-copy (product UI). Closest exemplars: Linear app, Stripe Dashboard.

## Rubric
1. **Gate (fail caps the result):** `node tools/lint.mjs` exits 0 on every page, state and state sheet; the `[judged]` checklist rows hold on the renders; every string passes the 14 design-copy fundamentals; the claims inventory (`skills/design-copy/assets/claims_inventory.mjs`) has no flags and every listed claim is ticked against its source.
2. **Close to the exemplar** means: the hero and the answer sentence pass the "only this text" test; no string on the page could be moved to a competitor's page unchanged; numbers are as exact as Stripe's dashboard copy; empty, error and partial states read as calmly and specifically as Linear's; nothing on the page is said twice.
3. **Clearly better than before**: count the gate misses on the before pages (truth, consistency, mechanics) and confirm each is fixed on the after pages without new lint fails.
