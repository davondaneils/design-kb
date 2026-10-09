# Critic review: design-layout v0.1 (pre-release)

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
