# design-art-direction: suggested changes to shared files

Written by the art-direction wave, 2026-10-09. This branch may not edit these files; the owners decide.

## kb/FOUNDATIONS.md (editor-in-chief)
1. Add illustration roles to the token schema, owned by design-art-direction with design-color: `--color-illustration-surface`, `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-accent-fill`. design-graphic 04 already uses `--color-illustration-accent`; the schema has no row for it.
2. Fundamentals checklist item 2 says text over images is judged on "needs review" warnings. Make the method concrete: "worst pixel, measured on a render with the text hidden (`overlay-check.mjs`)". The tester's curve labels failed at 1.74:1 with axe only saying "needs review".

## tools/lint.mjs (editor-in-chief, tools owner)
3. Promote `kb/tests/design-art-direction/overlay-check.mjs` into the lint: for every axe "needs review" color-contrast node, hide text, screenshot, and measure the box's worst pixel. Turns judged item 2 into a lint row.
4. Add an overlap check: text boxes intersecting visible SVG or image boxes that are not their own background (caught by eye only: dashboard sparklines over KPI numbers at 390).
5. Add a page-weight warning for inline SVG over about 150 KB (the coffee page hit 308 KB before the `<use>` fix).

## design-director (spine)
6. Section 4 "Planned domains" still lists art direction and imagery as not built. Replace with: load design-art-direction after design-color for every landing and brand job; write the one-sentence concept and its reject test before layout; hand over the stand-in list and the photo request (`references/05`).
7. Self-critique loop step 4: add "Concept check: hide the logo; could the visuals belong to a competitor?"

## design-playbook-landing
8. Load order item 7: replace "art direction and imagery (planned)" with `design-art-direction` SKILL.md, then `references/01` and `04` (always), `02` and `03` when photos exist, `05` at hand-over.
9. Signature move 1 ("the product is the hero image"): add the fallback order when photos are blocked: data-driven art from the brand's own numbers, then the product drawn at full fidelity, never a gradient blob.

## design-playbook-dashboard
10. Add design-art-direction `references/04` recipe 3 (sparklines) and the "only counts are pictures" rule for product UI imagery.

## design-foundations `references/accessibility.md`
11. The routing row "Alt decision tree, text over images, icon contrast: design-graphic" should add "text over images and textures, forced-colors overlays: design-art-direction `references/03`".

## kb/INDEX.md and TOPIC_MAP (librarian)
12. Add design-art-direction v0.1, reviewed 2026-10-09, next review 2027-10 (foundational craft), with the fast-moving parts named: forced-colors behavior and AI imagery rules (via design-graphic 03) every 3 months.
