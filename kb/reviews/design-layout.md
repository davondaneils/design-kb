# Critic review: design-layout

## Run 2: v0.2, reference 06 and the rendered slice (2026-10-10)

Reviewed: `skills/design-layout/SKILL.md` (gate rules 18 and 19, workflow 2b, expert moves 14 to 20), `references/06-pacing-signature-and-phone-editing.md`, its draft and research note, and the two test pages in `kb/tests/design-layout/`. Same agent as the specialist and tester (no subagent tool in this session); treat this as a self-review with a written trail, not an independent one.

### Citation spot check (before the gate)
Method: research 06 has 15 sourced claims (1 to 15; 16 and 17 are derived and were re-run instead). 20 percent is 3, minimum 5, so 5 were drawn with `random.seed(20261010); random.sample(range(1, 16), 5)` = claims 1, 4, 5, 6, 11. Each URL re-fetched on 2026-10-10 and the quote checked verbatim.
| Claim | URL | Result |
|---|---|---|
| 1 | developers.google.com mobile-first indexing | Pass, verbatim |
| 4 | bigmedium.com, Clark quoting Nielsen | Pass, verbatim (a bullet in the post) |
| 5 | bigmedium.com, Clark | **Fail**: the quote ended at "paperback." but the sentence continues "just because it's smaller." A truncated sentence presented as complete. |
| 6 | nngroup.com accordions on mobile | Pass, both fragments verbatim |
| 11 | developer.android.com canonical layouts | Pass, verbatim |

The batch failed on claim 5 and went back to the researcher. Fix: quote completed in the claim table. Round 2 re-fetch: claim 5 now verbatim (pass); two extra claims checked for good measure, 7 (NN/g zigzag, pass) and 9 (Offscreen, pass; the quote is a fragment and is shown without a closing period). Derived claims: `measure-cpl.mjs` re-run (52ch = 63 to 68, 66ch = 81 to 86, matches FOUNDATIONS v0.3); `measure-layout.mjs` run on both before and after pages.

### Verdict
**Revise, then approve** (round 1 of 3). The gate held on numbers and standards; one rule in the test page broke the skill's own new gate rule 18, and one fact was missing. Both fixed; second pass: **approve** for testing.

### Gate (fundamentals first)
- Measure: `52ch` matches FOUNDATIONS v0.3; the new note that `ch` resolves on the element's own font is correct (MDN: `ch` is the advance of "0" "in the element's font", research 06 claim 18, added during this review) and is a real failure mode. Pass.
- Spacing, breakpoints, radius: every value in the reference's Numbers table is on the FOUNDATIONS scales; 1232, 1136 and 1600 are container sizes, not spacing. Pass.
- Accessibility: DOM order = reading order is restated as gate rule 18 and agrees with design-foundations `references/accessibility.md` (1.3.2). Supporting-pane stacking keeps reflow (1.4.10). Pass.
- **Fail, fixed:** the test page's container query hid the whole "Lot 0412 · 60 bags this season" chip on small stages. "60 bags this season" appears nowhere else on the page, so the page cut a unique fact, against the reference's own rule 3. Fix: hide only the repeated "Lot 0412 ·" span; the reference's phone table now records this as the example.
- **Fail, fixed:** round 1 of the dashboard shaved alert link padding from 4 to 2px for density; the lint failed it at 22px tall (WCAG 2.5.8). Fixed in the page; the lesson became a decision rule ("compress rows, then re-run the lint") and expert move 13 now says so.

### Claims versus research
- "Pages die in the middle" and the alternation rule are opinion; both are labelled as resting on editorial practice (Offscreen) plus the tested page, not on a controlled study. Correct strength.
- Exemplar patterns are from memory (hosts blocked) and say so. Correct strength.
- "844px phone height" is labelled a working assumption. Correct.

### Contradictions
- None with FOUNDATIONS. SKILL.md page skeleton for dashboards updated to the new row order so SKILL.md and reference 06 agree. design-playbook-dashboard non-negotiable 6 (tables reflow at 390) is honoured: rows reflow and one column is deferred to "All pages", which the new phone-editing rule allows (defer, never cut).
- design-product-ui owns table internals; reference 06 only adds which column a phone row defers. Hand-off stated. No conflict.

### Gaps
- Tablet (640 to 1023) had no rule in v0.1; added (art at half width, facts beside it) after the tester's 768 render showed a 700px-tall square bag.
- Container queries for annotations on art: added after the 1024 render showed chips crowding the bag label.
- Still open: a print or poster equivalent of pacing (reference 03 covers poster composition, not multi-page pacing). Low priority.

### Expert bar
Would the best person in the field learn something? The flatplan with kinds of loudness, the zigzag evidence as the reason rhythm must not come from side-flipping, rules drawn to scale, the `gap` shorthand overriding a utility's `column-gap`, `ch` resolving on the element's font, and the supporting-pane 70/30 with a 320px floor are each specific and non-obvious. The margin column itself is classic Swiss practice and a strong practitioner would nod; it stays because the measured edge count makes it testable. Pass.

### Fix list (all done)
1. Research 06 claim 5: complete the quote. Done (researcher).
2. Test page: container query hides only the repeated span. Done (tester), reference 06 phone table updated.
3. Test page: alert link padding back to 4px. Done; reference 06 decision rule and SKILL.md expert move 13 updated.
4. SKILL.md: dashboard skeleton row order matches reference 06. Done.
5. Em dash grep on every changed file: none found.

---

## Run 1: v0.1 (2026-10-09)


Reviewed: skills/design-layout/SKILL.md and references/01 to 05, against kb/research/layout/01 to 05 and the shared foundation contract.

## Verdict
**Revise** (first pass). Fundamentals gate had one hole (muted text contrast), three claims were stronger than the research, and two decision areas were missing. All fixes below were applied; second pass verdict: **approve**.

## Gate check (fundamentals first)
- Spacing, breakpoints, measure, radius and target sizes match the foundation contract. Pass.
- Hierarchy rules relied on a "lighter tertiary" text tone with no contrast floor. Refactoring UI's light grey ancillary text often fails 4.5:1. Fail until fixed (fix 1).
- Accessibility: reflow, targets, focus not obscured, text spacing, meaningful sequence all present with correct SC numbers. Pass.

## Fix list
1. **SKILL.md section 1 and references/03**: add a gate rule that muted and tertiary text still meet 4.5:1 (3:1 only for large text), and that a tertiary tone exists only if design-color defines one. Hierarchy may never be bought with failing contrast.
2. **references/04**: "48dp on Android is the Material convention" is not in the research notes. Remove the claim; keep the researched 24px (WCAG) and 44pt (HIG) values.
3. **references/04**: "bottom bar (3 to 5 destinations)" is unsourced. Label it as a common platform convention (opinion) rather than a cited fact.
4. **references/01**: hanging-punctuation support claim ("Safari only") is unverified. Replace with "limited browser support; check before relying on it" and keep the negative text-indent fallback.
5. **references/01 and SKILL.md**: a 1280px content box with 32px margins overflows between 1280 and 1343px viewports. Specify `inline-size: min(1280px, 100% - 2 * var(--space-7))` so margins never collapse to zero.
6. **references/02**: the fluid section gap was named `--section-gap`, which breaks the contract's `--{category}-{role}` naming. Rename to `--space-section`.
7. **Gap, references/01**: no widths for dialogs, drawers and forms in apps. Add a short widths table (opinion-labeled).
8. **Gap, references/01 and SKILL output standard**: no mention of logical properties and right-to-left layouts, although Apple HIG asks for leading/trailing thinking. Add: use `margin-inline`, `padding-block`, `inset-inline-start`; mirror layouts for RTL; do not mirror media controls and numbers.
9. **Gap, references/03**: graphic and print composition (posters, social images, book pages) was missing although the domain covers graphic design. Add a short composition section: focal point, asymmetric balance, classical page margins (Tschichold's 2:3:4:6 inner:top:outer:bottom), safe margins for social crops. Mark taste rules as opinion.
10. **Filler check**: SKILL.md section 5 repeats references/05. Keep, because skeletons are needed on every page brief, but cap at one line each (already done).
11. **Em dash scan**: none found (grep U+2014 across skill and kb files).

## Expert-level check (would a top practitioner learn something?)
Yes, on: glyph-measured padding with `text-box-trim`, concentric radii, named-line content grid with popout track, subgrid card rows, false floor and left-weighted attention numbers, un-sticking headers on short viewports, density by subtraction, groups surviving reflow. A generalist would nod at the 12-column grid table and the 8px idea; those are there because the gate needs them, not as the value.

## Contradiction check with other design-kb skills
None shipped yet. Hand-offs name design-color, design-typography, design-ux, design-frontend, design-data, design-graphic, design-copy, design-motion without writing their content. Foundation conflicts are logged in kb/reviews/design-layout-pipeline-notes.md.
