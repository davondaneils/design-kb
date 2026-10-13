# design-strategy: suggested changes to shared files

Written by the strategy wave, 2026-10-13. This branch may not edit these files; the owners decide. Each edit gives the exact current text and the replacement. Nothing here changes a FOUNDATIONS token, value or checklist row.

## Why
design-strategy (v0.1, `skills/design-strategy/`) replaces the pointer to website-strategy. Its SKILL.md section 1 says design-director loads it after design-foundations and before the playbook for every page, screen or brand job, at the depth the brief needs (inherit, three lines, one page, full; proposals stay with website-strategy). The spine and the playbooks still route positioning straight to website-strategy, so until these edits land the skill is never loaded.

## skills/design-director/SKILL.md (spine)

1. **Section 1, layer table.** Replace
   `| Domain references | design-color, design-typography, design-layout, design-art-direction, design-graphic, design-ux, design-product-ui, design-conversion, design-polish, design-motion, design-copy, design-frontend, design-search | On demand, in the playbook's order, only the reference files it names. |`
   with
   `| Strategy | design-strategy | Always, second, at the depth the brief needs (its section 1). Its one-page brief is what the playbook and references read. |`
   `| Domain references | design-color, design-typography, design-layout, design-art-direction, design-graphic, design-ux, design-product-ui, design-conversion, design-polish, design-motion, design-copy, design-frontend, design-search | On demand, in the playbook's order, only the reference files it names. |`

2. **Section 1, "What each reference is for" table.** Add a first row:
   `| design-strategy | the strategy brief at the right depth: audience moment, positioning and swap test, one true fact, claims ledger, voice pairs, identity decisions with evidence levels, concept sentence (`assets/brief_lint.mjs`) |`

3. **Section 1, user's skills line.** Replace
   `The user's own skills plug in where a playbook says: website-strategy, copywriting, sales-funnels, dataviz.`
   with
   `The user's own skills plug in where a playbook or design-strategy says: website-strategy (full discovery and client proposals, routed by design-strategy), crafting-voice-identity (a full voice guide), copywriting, sales-funnels, dataviz.`

4. **Section 2, "Always first".** After item 1 (`1. Load **design-foundations**. ...`) insert a new item and renumber the rest (Pick the playbook becomes 3, Name the closest exemplars becomes 4):
   `2. Load **design-strategy** and write its brief at the depth its section 1 sets: inherit for a screen inside an existing product, three lines for a campaign, event or one-off artifact, one page for a new site, full (with website-strategy stages 2 to 5) for a new brand, rebrand or missing positioning. No visual decision before it. Run `node skills/design-strategy/assets/brief_lint.mjs brief.md`; the hand-over leads with its one-line summary (depth, weakest field, swap test).`

5. **Section 4, Art direction bullet.** Replace
   `Write the one-sentence concept and its reject test before any layout.`
   with
   `Write the one-sentence concept and its reject test before any layout, from the one true fact in the strategy brief (design-strategy), and record both in the brief.`

6. **Section 5, step 3 (Fact check).** At the end of step 3, after `round 3 showed numbers in an empty state that it cannot have.`, append:
   `Every public claim also has a row in the strategy brief's claims ledger (design-strategy `references/06-checking-a-strategy.md`): "only", "first" and "fastest" ship only with evidence held (FTC reasonable basis; CAP Code 3.7), otherwise the page says the underlying fact.`

7. **Section 5, step 11.** Replace
   `11. **Concept check** (landing and brand): hide the logo; could the visuals belong to a competitor? If yes, the art direction failed.`
   with
   `11. **Concept and distinctiveness check** (landing and brand): hide the logo; could the visuals belong to a competitor? If yes, the art direction failed. Then the covered competitor wall and the word swap test against the three competitors named in the strategy brief, and a five-second test with a fresh-context viewer briefed only with the audience moment (design-strategy `references/06-checking-a-strategy.md`).`

8. **Description (optional).** Add the trigger phrases "position this brand", "brand strategy for a site", "who is this page for" to the list, since design-director is the entry point and design-strategy is not a broad trigger.

## skills/design-playbook-landing/SKILL.md

9. **Section 1, item 2.** Replace
   `2. **website-strategy** if audience, positioning or competitors are not given. No visual decisions before this.`
   with
   `2. **design-strategy** (always, after foundations): the strategy brief at the depth its section 1 sets; one page for a new site, three lines for an event or campaign page, full (it routes to website-strategy stages 2 to 5) when audience, positioning or competitors are not given. The hero is written from its primary category entry point and category frame. No visual decisions before this.`

10. **Section 4 (Done means).** Insert before item 7 (renumber 7 and 8 to 8 and 9):
   `7. The strategy brief exists at the right depth and `node skills/design-strategy/assets/brief_lint.mjs` passes; the word swap test, covered competitor wall and five-second test are recorded; every public claim has a ledger row with evidence held.`

## skills/design-playbook-brand/SKILL.md

11. **Section 0, item 2.** Replace
   `2. **Strategy depth follows the brief.** Run website-strategy only when positioning, audience or competitors are missing and the brief is an identity job (new brand, rebrand, "brand system"). For a campaign, event or one-off artifact, write three lines instead (audience, the one true fact the idea comes from, the competitor wall you checked) and move on.`
   with
   `2. **Strategy depth follows the brief** (design-strategy section 1). For a campaign, event or one-off artifact, the three-line brief (audience, the one true fact the idea comes from, the competitor wall you checked) and move on. For a new brand, rebrand or "brand system" with positioning, audience or competitors missing, the full brief: website-strategy stages 2 to 5 as inputs, the one-page design-strategy brief as the summary. A rebrand starts with design-strategy's asset audit (fame and uniqueness) before any sketch.`
   (Same rule as today; it now points at the shared version so every playbook uses one depth table.)

12. **Section 1, item 2.** Replace
   `2. **website-strategy** when section 0 says so (identity job with positioning missing); otherwise the three-line brief from section 0. No mark before one of the two.`
   with
   `2. **design-strategy** at the depth section 0 sets (it routes to website-strategy for full depth); `references/05-strategy-to-visual-identity.md` for the identity decision table, distinctive assets, category codes and the asset audit. No mark before the brief.`

13. **Section 3 (Done means).** Append an item:
   `7. The strategy brief passes `brief_lint.mjs`; its primary distinctive asset is a shape, not a color alone; new assets were tested by recognition with the name hidden (design-strategy `references/06`), not by liking.`

## skills/design-playbook-dashboard/SKILL.md

14. **Section 1.** After item 1 (`1. **design-foundations** (always): ...`) insert, and renumber the rest by one:
   `2. **design-strategy** at inherit depth (its section 1): the user's moment for this screen, the brand source inherited (tokens, voice), and what the screen must not change. Never rebrand inside a screen job. A new product with no brand on file gets the one-page brief.`

## skills/design-playbook-mobile/SKILL.md

15. **Section 1.** After item 1 (`1. **design-foundations** (always): ...`) insert, and renumber the rest by one:
   `2. **design-strategy** at inherit depth for a screen in an existing app, one page for a new app: the user's moment (section 2a's "main question" comes from it), the brand source, what must not change. Brand lives in the hero number and one control (section 2a item 6), never in rebuilt platform chrome.`

## CLAUDE.md

16. **House rules, reuse line.** Replace
   `- Reuse before writing: link to the existing website-strategy, copywriting and sales-funnels skills instead of duplicating them.`
   with
   `- Reuse before writing: link to the existing website-strategy, crafting-voice-identity, copywriting and sales-funnels skills instead of duplicating them.`

17. **Structure, layer 3.** Replace
   `3. **Domain references** (`design-color`, `-typography`, `-layout`, `-graphic`, `-ux`, `-motion`, `-copy`, `-frontend`, `-search`): depth loaded on demand.`
   with
   `3. **Domain references** (`design-strategy`, `design-color`, `-typography`, `-layout`, `-graphic`, `-ux`, `-motion`, `-copy`, `-frontend`, `-search`): depth loaded on demand; design-strategy is the exception that loads on every job, second, at the depth the brief needs.`

18. **Structure, spine sentence.** Replace
   `` `design-director` is the spine: foundations, then the playbook, then references, then the self-critique loop ``
   with
   `` `design-director` is the spine: foundations, then the strategy brief (design-strategy, at the depth the brief needs), then the playbook, then references, then the self-critique loop ``

## kb/INDEX.md and kb/TOPIC_MAP.md (librarian)
19. After review: add design-strategy v0.1 (reference layer, loads second on every job). Next review 2027-04 for the fast-moving parts: the distinctive-asset benchmarks (new papers yearly), Binet and Field budget ratios, and advertising substantiation rules (FTC, CAP); the positioning method itself is stable.

## Pipeline
20. This wave had no subagent tool, so there is no critic or tester run yet. The test briefs in `kb/tests/design-strategy/` were not read by the builder; run them from a clean context.
21. Research notes: Parallel Search hit its free-tier limit midway; the Tom Roach Binet and Field compilation PDF did not parse through WebFetch, so its chart titles come from the search engine's text extraction (marked in `kb/research/strategy/05`). The Tropicana 20 percent figure is a tier 5 relay of Ad Age; the original was not fetched. The critic should re-fetch both.
