# Changelog: design-strategy

## v0.1.2 (2026-10-13, gaps from the Halden test, `kb/tests/design-strategy.md`; not yet re-tested)
- 06 reading results: a viewer reading a device as an error fails playbook-brand 2a; with no fresh viewer, the device stays off the first screen and the hand-over says "concept legibility not tested".
- 05 expert moves 12 and 13: show what the true fact buys; the weakest field still gets the strongest verifiable fact.
- design-playbook-brand done item 4: brand color fields checked in dark mode.

## v0.1.1 (2026-10-13, researcher fixes and strategist gaps from `kb/reviews/design-strategy.md`)
- Research fixes: Tropicana figures credited to Information Resources Inc. via Ad Age (BusinessWeek relay, 2009-04-02), not Nielsen; Binet and Field chart title corrected to "effectiveness" (`pdftotext -raw`); Dawes 95:5 quote replaced with the paper's own wording on marketingscience.info, plus his caveat ("a heuristic") and the interpurchase method. New rows for Dunford's 20 to 30 percent "no decision" and definition, Neumeier, the services finding, the 2026 benchmark's authors (Phua, Bali, Anesbury, Sharp) and its full-text numbers (12,249 category buyers, HHI values, "Reliance on color alone", the Caruso relay), and Caruso et al. 2025 as its own row (227 redesigns, 86 percent researched, no more success).
- Grid quadrants renamed to Romaniuk 2018 as cited in the benchmark: "Invest" is now "Investment potential"; "Avoid" is "Avoid solo use".
- New: brand architecture (Aaker's spectrum and three questions, least distance by default) and a naming route (USPTO mark strength, route to specialists) in ref 01; Dunford's trend layer and the sales-pitch order as page order in ref 03; residual, dominant and emergent code states, brand behaviors, portfolio cohesion (Ward et al. 2025) and tracking after launch in ref 05; checks 9 (tracking) and 10 (behaviors) in ref 06; "pick a contender, not a meaning" (Romaniuk 2025).
- Brief length: 600 words (lint warns above 600, fails above 800), down from 700 and 900, matching the research's 400 to 600 range. Example trimmed to 598 words by the linter's count; it still prints on two A4 sides at 10pt and 9pt (ReportLab render, Helvetica, 15mm margins), so "one page" stays a word discipline. Template gains optional Architecture and Behaviors lines.
- `brief_lint.mjs`: Architecture field must name a position when present; full depth warns without Behaviors; self-test 15 of 15 (three new cases).
- SKILL.md description cut from 1,242 to 901 characters (spec cap 1,024).
- Drafts `kb/drafts/strategy/01` to `06` re-synced with the references.
- Second critic pass (`kb/reviews/design-strategy.md`, "v0.1.1 second pass"): parent asset carried across the range except in a house of brands; descriptive names sit one step above generic, not at the bottom; page spill stated as a renderer range (150 to 210 words at 10pt); the hero states the insight in the primary CEP's words; tracking cadence held between 3 and 12 months; Caruso worded as "no evidence of more success"; in-market formula limited to cycles of a year or more; residual codes allowed when heritage is the fact; example curve mapped to `--color-illustration-accent` (still 598 words). Research: Aaker spectrum labels and a reachable copy, USPTO weak-mark wording, Wynter F4 quote, A7 marked superseded.

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
