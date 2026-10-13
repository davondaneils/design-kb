# Changelog: design-strategy

## v0.1, critic pass (2026-10-13, `kb/reviews/design-strategy.md`)
- Fixed: rebrand audit worked example (navy and gold was low fame, not "Avoid solo use"; stand-in now allows several brands per answer and computes fame and uniqueness); fame cannot be measured with fresh-context viewers; new assets are tested for misattribution and learnability, not recognition.
- Fixed: "one printed page" claim (measured: the example fills about 1.3 A4 sides at 10pt); Dunford definition misquote; "most B2B deals" lost to the status quo replaced by Dunford's 20 to 30 percent; Caruso stated as association, not prediction; bouba/kiki brand use marked as inference; services exception from the 2026 benchmark abstract added.
- Fixed: `--radius-md` versus `--radius-lg` for "warm" made consistent; "low-contrast grotesque" now "low stroke contrast"; ledger "yes or cut" everywhere; the example's orange curve measured against 1.4.11.
- `brief_lint.mjs`: color names ("brand orange") now count as color for the primary-asset rule (it passed before); self-test grows to 12 cases with six one-page cases built from the example.

## v0.1 (2026-10-13)
- First version. Replaces the pointer to website-strategy with a skill woven into the team: design-director loads it after design-foundations and before the playbook for every page, screen or brand job, at the depth the brief needs (inherit, three lines, one page, full, proposal).
- SKILL.md plus references 01 strategy brief and depth, 02 audience moment, 03 positioning, 04 voice, 05 strategy to visual identity, 06 checking a strategy.
- Assets: `strategy-brief.md` (the one-page template), `example-brief-ember-oak.md` (filled one-page example), `brief_lint.mjs` (brief checker with `--self-test`; run on the template: 5 fails as expected; on the example: pass at 700 words by the linter's count; self-test: 6 of 6).
- Builds on Davon's website-strategy (stages 2 to 6 for full depth and proposals) and crafting-voice-identity (full voice guide); restates neither.
- Research: `kb/research/strategy/01` to `06` (Dunford, Neumeier, Romaniuk, Sharp and Ehrenberg, the 2026 International Journal of Advertising distinctive asset benchmark, Jiang et al. 2016, Ćwiek et al. 2022, Moesta and Spiek, Dawes, Binet and Field, FTC substantiation, CAP Code 3.7, Wynter, Perfetti; Monzo, Mastercard and Tropicana cases).
- Not yet reviewed by the critic or run by the tester. Test briefs in `kb/tests/design-strategy/` were not read by the builder.
- Shared-file edits proposed, not applied: `kb/reviews/design-strategy-pipeline-notes.md`.
