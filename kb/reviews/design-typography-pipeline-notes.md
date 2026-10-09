# Pipeline notes from the design-typography wave (2026-10-09)

Suggested changes to shared files. Not edited on this branch; the editor-in-chief decides.

## kb/FOUNDATIONS.md (editor-in-chief)
1. **Measure in CSS: change the default from `32em` to `52ch`.** Measured with `kb/research/typography/measure-cpl.mjs` (same counting as the lint): `32em` gives 66 characters in Inter but 77 in Times, Calibri and Cambria widths (over the 75 ceiling) and 61 in a Verdana width; `52ch` gives 63 to 68 in all eight text faces tested; `66ch` gives 81 to 86 everywhere. Proposed text: "Measure in CSS: `max-inline-size: 52ch` (63 to 68 characters in any text face, measured); keep body between about 40ch and 56ch; never 66ch (81 to 86). Confirm with the lint." Also mirror in `skills/design-foundations/SKILL.md` rule 6 and `references/tokens.md` (librarian).
2. **Name the display ramp.** The token schema allows `--text-display` (fluid). Add `--text-display-2` and say display tokens may exceed `--text-5xl` when fluid, max no more than 2.5x min. The lint already allows it.
3. **Heading leading:** "headings 1.1 to 1.25" should add "display lines of 100px and up may go to 0.95".
4. Optional token: `--size-measure: 52ch` (design-layout proposed `--size-measure: 66ch`; the measurement says 52ch).

## skills/design-layout (domain owner)
5. `SKILL.md` line 18 and references 01, 04, 05 use `max-inline-size: 66ch` and the content grid `min(66ch, ...)`. That renders 81 to 86 characters in every face measured: a fundamentals fail the lint only misses when lines are short. Change to `52ch` everywhere.

## skills/design-director and the playbooks
6. design-director section 4, build rules: replace "pick a system font stack that suits the brand when web fonts cannot load" with "follow design-typography reference 06: system stack, self-hosted, or mixed (one pinned display face plus the system sans); say which in the hand-over".
7. design-playbook-landing load order step 5: add `references/07-type-led-pages.md` and `06-type-without-web-fonts.md`; signature move 2 ("display type set big and tight") can point to reference 07 for the numbers (49 to 112px, leading 0.95, optical margin).
8. design-playbook-dashboard step 5: add reference 06 for the "system stack or one shipped face" decision.

## tools/lint.mjs (suggested checks, warn level first)
9. **Straight quotes and apostrophes** in visible text (`'` or `"` between letters or at word edges). The baseline coffee page shipped "This week's" and "can't" and passed.
10. **Hyphen between digits** (`10-20`, `3-2`) where an en dash is meant; `x` between digits where `×` is meant.
11. **Uppercased units:** a `text-transform: uppercase` ancestor over a number followed by `g`, `kg`, `m`, `ml`, `h`, `s`.
12. **Synthesized styles:** compare `getComputedStyle` weight and style with the faces in `document.fonts` that loaded; flag bold or italic text whose family has no matching face.
13. **Visible list markers next to manual numbers:** an `ol` whose `li` shows a marker and also starts with digits (the baseline's "1. 01").
14. **Fallback reflow:** optional mode that renders the page with `@font-face` rules removed and reports section offset changes (the logic is in `kb/tests/design-typography/fonts/swap-shift.mjs`).

## Agents
15. **tester.md:** a type gain is invisible to the lint (both pages passed before and after). Ask the tester to diff typographic detail on the source too (characters, units, features), not only screenshots.
16. **researcher.md:** add "measure, do not estimate, when a number can be measured in the browser here" with the CPL script as the example; the v0.1 skill shipped an estimate ("66ch often holds 72 to 80") that was wrong in both directions.
17. **researcher.md:** x.com refused fetches (robots) again; X posts can never be the support for a claim, only leads (design-layout notes said the same).
18. **README or design-director:** the npm registry is reachable when font CDNs are not; `npm pack @fontsource-variable/<family>` is the standard way to get OFL fonts into a sandbox. Worth one line where the director talks about blocked hosts.
