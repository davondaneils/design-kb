# Pipeline notes from the design-layout build

## Conflicts between the foundation contract and layout best practice
1. **No sizing tokens.** The contract defines spacing but not control or row heights. Layout needs 32 / 40 / 48 heights for density modes; 40 is not on the spacing scale. Suggest adding `--size-control-sm/md/lg` (32, 40, 48) to the contract.
2. **Scale tops out at 128.** Premium landing pages often use 160 or more between hero and first section on 2xl screens (Carbon has a 160 token). The skill caps at 128 and uses fluid `clamp()` up to 128. Suggest adding 160 and 192 as `--space-12`, `--space-13`, or blessing fluid section tokens explicitly.
3. **40 and 80 missing.** Carbon and Atlassian both use 40 and 80; designers bringing those systems will hit off-scale values. The skill tells them to snap to 32/48 and 64/96. No change needed, but the contract could say so.
4. **Container width not defined.** The contract has breakpoints but no max content width. The skill uses a 1280px content box with `min(1280px, 100% - 2 * var(--space-7))`. Suggest adding `--size-container` (1280) and `--size-measure` (66ch) to the contract so other skills reuse them.
5. **Breakpoints vs Material window classes.** The web set (640, 768, 1024, 1280, 1536) differs from Material (600, 840, 1200, 1600 dp). Fine for web; native Android work should follow Material. The skill notes this.
6. **Color roles.** The contract has `text` and `text-muted` only. Layout hierarchy often wants a third tone; the skill allows it only if design-color defines it and it passes 4.5:1.

## Suggested agent improvements
- **researcher.md:** add the practitioner tier explicitly, and note that x.com is robots-blocked for fetching; search for studio blogs, newsletters and books by the same practitioners instead. Also note the shared per-turn web search budget (this build hit it), so researchers should prefer WebFetch on known primary URLs over broad searches.
- **critic.md:** add "fundamentals gate first, one miss fails" and the expert test ("would the best practitioner learn something?") to the checklist, plus a foundation-contract conformance check.
- **tester.md:** add a scoring rubric with a gate cap (gate miss caps at 5/10) so scores are comparable across skills, and require a re-run after gap fixes.
- **skill-architect.md:** require a Sources section at the end of every reference file so references stand alone.
- **domain-specialist.md:** require token names from the foundation contract in every example and code block.

## Wave 2 (2026-10-10): suggested changes to shared files
Proposals only; this branch did not edit these files.

1. **design-director `SKILL.md`, section 5 step 1**: render at 768 and 1024 as well as 390 and 1440 (`--widths 390,768,1024,1440`). The tablet failure in this run (a 700px-tall square bag at 768) and the crowded art at 1024 were invisible at the two default widths.
2. **design-director, section 4 build rules**: add "write the flatplan (each section's job, loudness and kind) before layout for any page over four sections" and "write the phone edit list (keep, reorder, crop, thumbnail, merge duplicate, shorten label, collapse, defer; never cut a unique fact)". Both come from design-layout reference 06.
3. **design-playbook-landing, section 4 Done means**: add "the primary action is in the first 844px at 390" and "the next section peeks above 900px at 1440", both measurable with `kb/tests/design-layout/measure-layout.mjs`.
4. **design-playbook-dashboard, section 2 non-negotiables**: add "a panel that explains another sits beside it at 2:1 from 1280 and stacks below" and "alerts are rows, not cards".
5. **FOUNDATIONS** (editor-in-chief): consider a `--size-container` token (the pages use 1232 with 48 padding = 1136 content) and a page-grid note (12 columns from lg, gap 32). Still open from wave 1 notes, item 4. Measure: no change; 52ch confirmed.
6. **tools/** (owner: whoever owns lint): promote `measure-layout.mjs` checks into an advisory lint row: primary action position at 390, peek at 1440, left-edge count. Also, the `fallback` and `targets` checks do not know about container queries; nothing failed here, but a container-query-hidden element is invisible to width-only reasoning.
7. **tester.md**: when the brief is "improve the current best page", say so and use that page as the baseline instead of a without-skill page; record a metric table (height, action position, edges) so gains are numbers.
