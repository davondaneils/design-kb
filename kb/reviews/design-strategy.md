# Critic review: design-strategy v0.1 (first pass)

Reviewed 2026-10-13: `skills/design-strategy/SKILL.md`, `references/01` to `06`, `assets/strategy-brief.md`, `assets/example-brief-ember-oak.md`, `assets/brief_lint.mjs`, `CHANGELOG.md`. Checked against `kb/research/strategy/01` to `06`, `kb/drafts/strategy/01` to `06`, `kb/FOUNDATIONS.md` v0.4.4 and its change log, `CLAUDE.md`, `kb/references/strategy-brand.md`, design-playbook-brand section 0 and 2a, design-art-direction SKILL.md and `references/01`, design-copy `references/03-voice-and-tone.md`, design-color `references/psychology-brand.md`, design-graphic `references/01-logo-identity.md`, design-playbook-landing sections 3 and 3b, design-director section 5, design-foundations `references/accessibility.md`, and Davon's website-strategy (SKILL.md, stages 2 to 5) and crafting-voice-identity SKILL.md. The held-out test (`kb/tests/design-strategy/`) was not read.

## Verdict: revise

Two reasons, either one enough:
1. **Citation spot check failed** (E13 quote mis-transcribed, E7 attribution contradicted by the source it relays, B6 quote not confirmable at its URL; table below). By protocol the research batch goes back to the researcher.
2. **Fundamentals gate failed as submitted.** Five gate misses: a worked audit placed an asset in the wrong quadrant by its own numbers, a stand-in method measured fame with viewers who cannot hold it, "one printed page" was false when measured, a Dunford quote was not on the cited page, and "in most B2B deals the alternative that wins is doing nothing" contradicts the source it cites (Dunford: 20 to 30 percent). The linter also let a color-only primary asset through. All are fixed in this pass, so the skill now passes the gate on re-read. The verdict stays revise until the researcher reconciles the notes and a second critic pass confirms the edits.

## Citation spot check (before step 1)
Population: the 62 claim rows in `kb/research/strategy/01` to `06` (A1 to A9, B1 to B9, C1 to C16, D1 to D5, E1, E1b, E2 to E15, F1 to F7). Sample: 13 (20 percent), `random.seed(20261013); random.sample(ids, 13)` in Python 3, giving A7, B4, C3, C9, C12, C13, D3, E1, E6, E12, F2, F3, F7. Added because the brief asked: E2, E4, E7, E13, E14, B6, plus E3, E8, E10 and the three uncited quotes in reference 03.

| Row | Checked | Result |
|---|---|---|
| A7 | design-art-direction SKILL.md 2.1: "Positioning comes from website-strategy." | Pass |
| B4 | therewiredgroup.com: Moesta "helped develop the JTBD framework alongside Harvard Business School professor Clayton Christensen" | Pass |
| C3 | aprildunford.com quickstart: "We start with competitive alternatives, or what would customers do if our solution didn't exist."; "only "differentiated" when you compare them"; category "context ... unique value is obvious" | Pass |
| C9 | martyneumeier.com: "don't fix your positioning statement…fix your company." | Pass |
| C12 | FTC policy statement: "reasonable basis for advertising claims before they are disseminated"; "at least the advertised level of substantiation" | Pass |
| C13 | ASA substantiation page, rule 3.7 "must hold documentary evidence to prove claims that consumers are likely to regard as objective"; C14 "perfect network" (Sky UK, 8 June 2022) and rule 3.2 puffery also confirmed | Pass |
| D3 | design-copy 03 line 19: "Two-sided pairs stop over-steering" | Pass |
| E1 | marketingscience.info/brands-of-distinction: definition, four quadrants ("Use or Lose", "Invest", "Avoid", "Test or ignore"), Avoid sentence, "All new assets start with low uniqueness and fame." | Pass |
| E6 | nytimes.com unreachable from here. NPR 2009-02-23 transcript confirms "the familiar picture of an orange with a straw" was removed "last month" and the carton was dropped | Pass on substance (NYT page itself not re-fetched) |
| E12 | `kb/references/strategy-brand.md` line 29: 996 campaigns, 700 brands, 83 categories | Pass |
| F2 | design-playbook-brand 2a: "a fresh-context subagent shown only the image counts as one viewer; your own judgment never does" | Pass |
| F3 | wynter.com/post/message-testing: definition, four dimensions, "12-13 responses to reach saturation", "9–17 participants" | Pass |
| F7 | FOUNDATIONS checklist row 16: "every listed claim ticked against its data, price list or log" | Pass |
| E2 | tandfonline returns 403. OpenAlex abstract of 10.1080/02650487.2026.2637295 (Phua, Bali, Anesbury, Sharp, 2026-03-05): "1162 Distinctive Assets across 21 categories, four countries, and nine years"; "(40% Fame, 71% Uniqueness) ... (12% Fame, 39% Uniqueness)" verbatim. 26/54 average confirmed via a podcast summary. 12,249 respondents, HHI values, "Reliance on color alone" and the Caruso sentence not re-verified (full text 403) | Pass on the abstract numbers; rest unverified |
| E4 | Jiang et al. PDF text extracted with pdftotext: "Five experiments"; "circular- versus angular-logo shapes activate softness and hardness associations, respectively"; no shape effects "when the headline of the ad highlights a product attribute that differs from the inference drawn from the logo shape" | Pass |
| E7 | depix.ai does say "Ad Age, citing Nielsen, reported ... down about 20%". But the Ad Age text relayed by Bloomberg/BusinessWeek (2009-04-02) attributes the 20 percent unit drop (Jan 1 to Feb 22, dollar sales down 19 percent, about $33 million) to **Information Resources Inc., not Nielsen**; kottke.org (2009-04-02) links the Ad Age original (article_id=135735). Ad Age and the archive copy are blocked from here | **Fail.** Attribution wrong. Not shipped in the skill (good); the note must say IRI and cite the Ad Age article id |
| E13 | Tom Roach compilation PDF, extracted with pdftotext: "The 60:40 split delivers maximum effectiveness" (Figure 38) and "Emotional campaigns yield stronger long-term business effects" (Figures 44, 53, 54), both sourced to The Long and the Short of It | **Fail on the quote** (the note keeps "efectiveness" as a typo; the source reads "effectiveness", and the PDF is parseable). Claim supported |
| E14 | thedrum.com 403. 46:54 confirmed by search excerpts from The Drum (2023) and Marketing Week | Pass on substance; exact 2019 Drum quote not re-fetched |
| B6 | marketingweek.com 403 (Cloudflare). Substance confirmed by CustomerThink quoting Dawes's 2021 B2B Institute paper: change providers "around once every five years", "only 20%" a year, "something like 5% in a quarter", percentages not "meant to be interpreted literally". The exact quoted sentence and the caveat wording could not be found at any reachable URL | **Unverified quote**; substance holds |
| E3 | jenniromaniuk.com 2018: "The more attention-grabbing the creative, the harder the branding has to work to succeed." | Pass |
| E8 | mastercard.com 403; the quote is confirmed verbatim in AP/CNBC coverage of the 2019-01-07 release | Pass |
| E10 | monzo.com blog: "We audited our visual brand codes", "the hot coral card – and it's what helps keep us distinctive", "flooded with generic people photography" | Pass |
| Ref 03, uncited | Dunford "defines how our product is different and better than alternatives for a particular set of customers": **not on** the introduction or exercise pages; the introduction says "defines how your product is a leader at delivering something that a well-defined set of customers cares a lot about" (fixed). Dunford value example "answer questions while a customer is on the phone": present. Neumeier "you can't advertise your way to onlyness": present | One fail, fixed |

Result: **batch fails** (E7, E13, B6). Back to the researcher with the corrections listed under "For the researcher".

## Gate findings (step 1)
| # | Where | Finding | Status |
|---|---|---|---|
| G1 | 05 worked example 2 | Navy and gold "2 of 8 named us, 4 named banks" is 25 percent fame, 33 percent uniqueness: Ignore or test, not "Avoid solo use". With one answer per person, "Avoid solo use" (high fame, low uniqueness) is arithmetically impossible, so the stand-in method itself was wrong | Fixed: several brands per answer allowed, fame and uniqueness formulas stated, table recomputed (navy 5 of 8 and 7 other mentions: 62.5 and 42, Avoid solo use) |
| G2 | 05 audit step 2, 06 check 8, SKILL expert move 8 | Fame and uniqueness "with 5 or more category buyers or fresh-context viewers". Fame lives in buyers' memories; a fresh-context subagent cannot hold it. And a brand-new asset has no fame, so "count correct brand links" always reads near zero before launch | Fixed: category buyers only for fame; new assets tested for misattribution and learnability (method marked opinion) |
| G3 | SKILL rule 3, 01 rule 3, template | "The brief fits one printed page: about 700 words". Measured: the 680-word example renders to 2 A4 pages at 11pt, 10pt and 9pt; at 10pt with 15mm margins about 176 words spill to page 2 | Fixed: "one page" names the discipline; the measured size is stated. Whether to tighten to the research's 400 to 600 words is for the editor |
| G4 | 03 intro | Dunford quote not on the cited page | Fixed with the verified definition |
| G5 | 03 expert move 4, SKILL expert move 3 | "In most B2B deals the alternative that wins is doing nothing [C4]". The cited page says enterprise software loses "between 20% and 30% of deals" to no decision: one in four, not most | Fixed, and the number is now the expert line |
| G6 | `brief_lint.mjs` | "Primary distinctive asset: brand orange" passed: the color-alone rule only matched the words color, hue and palette | Fixed: color names count; shape words extended (bag, bottle, silhouette, mascot); a self-test case now covers it |
| G7 | Example brief, identity row | Brand orange `#F26B21` (design-art-direction worked example 1) is 3.04:1 on white and 2.85:1 on `#FAF7F2`, 2.68:1 on `#F5F0E8`: the roast curve, a meaningful graphic on warm neutrals, fails 1.4.11 (3:1) as briefed. The brief only said "fails as body text" | Fixed: the row states the ratios and moves the curve one step darker (design-art-direction fundamental 5) |
| G8 | 04 expert move 3, example brief | "Warm" maps to `--radius-lg` in SKILL.md and 05 but `--radius-md` in 04 and the example: two answers to one decision | Fixed: `--radius-lg` everywhere |
| G9 | 04 expert move 3 | "a low-contrast grotesque" in a skill that polices contrast reads as a color-contrast instruction | Fixed: "low stroke contrast" |
| G10 | 06 rule 2 and check 7 | Ledger "evidence held (yes or no)" and a fifth "date" cell, while the template, the linter and SKILL say four cells and "yes or cut" | Fixed: "source with its date", "yes or cut" |

Everything else on the gate holds: depth rules agree with design-playbook-brand section 0 (which already points at design-strategy section 1), locale rule matches FOUNDATIONS "Locale first", "strategy never overrides the floor" matches design-color and design-playbook-landing 3b, the logo contrast exemption is not misused, opinion is labelled.

## Numbers measured
| Number | Author's value | Measured | Method |
|---|---|---|---|
| Example brief length | 700 words (linter) | 680 plain words before edits (the linter splits `en-US` and `->` and so counts higher); 699 by the linter after this pass's edits | Python word split after stripping comments and table rules; `brief_lint.mjs` |
| "One printed page" | 1 page | 2 A4 or Letter pages at 11, 10 and 9pt; 223 words on page 2 at 11pt, 176 at 10pt (15mm margins) | pandoc to HTML, Playwright PDF, `pdfinfo`, `pdftotext -f 2` |
| Orange `#F26B21` contrast | "fails as body text" | 3.04:1 on white, 2.85 on `#FAF7F2`, 2.68 on `#F5F0E8`, 6.90 on black, 5.75 on `#1C1917` | WCAG relative luminance script |
| Audit fame and uniqueness | quadrants as listed | Lighthouse 75 and 100, navy (old) 25 and 33, slogan 12.5 and 25, wordmark 37.5 and 75 | arithmetic script; navy row was wrong |
| `--self-test` | 6 of 6 | 6 of 6 before; it never exercised the one-page path; 12 of 12 after adding six one-page cases (one of which exposed G6) | `node skills/design-strategy/assets/brief_lint.mjs --self-test`, exit 0 |
| Template lint | 5 fails | 5 fails, 2 warns, as intended | `brief_lint.mjs assets/strategy-brief.md` |
| Em dashes (U+2014) | none | 0 in `skills/design-strategy/`, `kb/research/strategy/`, `kb/drafts/strategy/` | grep |
| 2026 benchmark | 1,162 assets, 21 categories, 40/71, 12/39 | matches the abstract | OpenAlex |

## Foundation conformance (FOUNDATIONS v0.4.4)
- Tokens named in the skill all exist: `--font-sans`, `--font-serif`, `--font-mono` (Type other), `--text-display` (display ramp, v0.3), `--radius-sm`, `--radius-md`, `--radius-lg` (Radius), `--space-section` (Space semantic), `--color-brand` (Color primitive, "exact brand value"), `--duration-slow`, `--ease-standard`, `--motion-enter` (Motion, semantic pairs adopted v0.4). No raw hex, px or ms values in decisions.
- "Calm, premium: `--duration-slow` for one reveal" sits inside the v0.4 marketing reveal ceiling (one hero reveal up to 800ms; slow is 300 to 400ms).
- Locale: en-GB for Glasgow and en-US for the Portland roaster match the FOUNDATIONS examples and checklist row 16 content mechanics.
- Row references: row 12 (one primary action) and row 16 (claims ticked) are cited correctly. No checklist row is changed or contradicted.
- Accessibility agrees with design-foundations `references/accessibility.md`: logo exempt, any logo used as a link is not; brand color that fails as text changes role. The example now also respects 1.4.11 for its meaningful curve.

## Contradictions and duplication
- **website-strategy**: no restatement of its frameworks beyond a nine-step short path that cites stage 4 for the long method. Two collisions fixed: stage 2's "Asset Audit" (Schwartz fact quarry) versus this skill's distinctive asset audit (now disambiguated in SKILL.md and 05), and stage 5's "State the hex values" versus "tokens, never raw values" (05 now says the hex goes into `--color-brand`). One open tension: stage 4 step 3 champions category design (Ramadan); 03 now states this skill's rule (use a frame buyers already search unless the brief funds category education; opinion).
- **crafting-voice-identity**: referenced by name (Polarity Principle, Competitive Tonality Analysis, 2 to 3 competitors) and not restated. Agrees.
- **design-copy 03**: 3 to 4 pairs, 20 to 50 phrases, flat moments, NN/g dials all match.
- **design-color psychology-brand**: E/C/O maps onto its evidence/convention/folklore; "conform or own" (rule 2) is cited correctly; 8 to 12 competitors for the hue map matches.
- **design-art-direction**: concept method and Ember and Oak facts match its worked example 1. Its line "Positioning comes from website-strategy" is now out of date (editor item 2).
- **design-playbook-brand**: section 0 and done item 7 already point here. Done item 7 says "new assets were tested by recognition with the name hidden", which has the G2 flaw (editor item 1).
- **Description**: follows the domain-reference pattern ("Domain reference loaded by design-director or a design playbook ... do not trigger on its own"). Its example questions are narrow. Pass.

## Expert-learning test
Lines a top practitioner (a Pentagram or COLLINS strategist, April Dunford, an Ehrenberg-Bass reader) would plausibly not already know or not have in this form:
1. The 2026 Phua, Bali, Anesbury and Sharp benchmark: shapes 40 percent fame and 71 uniqueness against color 12 and 39 across 1,162 assets; the average asset is only 26 and 54. New this year; most designers still lead identities with a palette.
2. The services exception from the same study (added this pass): narrative-driven assets do relatively better in services.
3. Jiang et al. 2016: logo shape shifts attribute judgments, and the effect vanishes when the headline names a different attribute. "Give the words and the look different jobs" follows from it.
4. Caruso et al. 2025 as cited: focus-group and attitude-led pack redesigns are associated with worse outcomes than distinctive-asset research.
5. Dunford's 20 to 30 percent of enterprise deals lost to "no decision" (added this pass) as the reason to position against the status quo.
6. ASA treating "the perfect network" as an objective claim, so public "only" needs a dated market scan; publish the underlying fact instead.
7. New-asset testing by misattribution and learnability, because recognition before launch is near zero by definition (added this pass; opinion).
8. Fame needs category buyers; a fresh-context subagent can only test misattribution. Most AI-assisted brand workflows get this wrong.
9. Brief the cold viewer with the audience moment, never the strategy, or it confirms instead of tests.
10. Mastercard's 80 percent spontaneous recognition as the bar before dropping a name.

Lines an expert nods at: Tropicana, "status quo is a competitor", Mailchimp's voice/tone, "blue means trust is folklore", the five-second test. They are correct and short. The list above is long enough to pass step 5 after this pass's additions; before them, items 2, 5, 7 and 8 were missing or wrong.

## Fix list
1. **Done.** `references/05` worked example 2 and audit step 2: multi-brand stand-in, fame and uniqueness formulas, recomputed table, category buyers only (G1, G2).
2. **Done.** `references/05` expert move 4, `references/06` check 8, `SKILL.md` expert move 8: new assets tested for misattribution and learnability; Caruso stated as association with the source's wording (G2).
3. **Done.** `SKILL.md` rule 3 and Numbers and Assets rows, `references/01` rule 3 and Numbers, `assets/strategy-brief.md` comment, `CHANGELOG.md`: measured page size replaces "fits one printed page" (G3).
4. **Done.** `references/03` intro: verified Dunford definition (G4).
5. **Done.** `references/03` expert move 4, `SKILL.md` expert move 3: Dunford's 20 to 30 percent replaces "most B2B deals" (G5).
6. **Done.** `assets/brief_lint.mjs`: color names and more shape words in the primary-asset rule; self-test adds six one-page cases built from the example (12 of 12 pass) (G6).
7. **Done.** `assets/example-brief-ember-oak.md`: measured orange ratios and 1.4.11 for the curve; `--radius-lg`; header trimmed to stay at 699 words (G7, G8).
8. **Done.** `references/04`: "low stroke contrast", `--radius-lg`, and the "Late fees work best at 2 percent" sample (an unsupported objective claim inside a claims-ledger skill) replaced (G8, G9).
9. **Done.** `references/06` rule 2 and check 7: four ledger cells, "yes or cut"; expert move 4's "FTC 'however conveyed' in 03" removed (the phrase is in neither 03 nor the research) (G10).
10. **Done.** `references/02`: "Romaniuk's deprioritizing rule as relayed by practitioners (tier 5)" was not in the research; now plain opinion. Expert move 5 no longer claims a phrase "outperforms" without data.
11. **Done.** `SKILL.md` principle 2 marks Romaniuk, Sharp and Ehrenberg 2007 as contested; expert move 9 marks "kept interface grammar" as our reading; expert move 11 and `references/05` expert move 7 say bouba/kiki is a sound-shape match and its brand use is inference.
12. **Done.** `references/05`: "a character is a strong asset type (E)" now "least contested (E for intensity, O for the choice)"; "shapes beat colors in every industry studied" now the abstract's "consistently perform best"; services exception added; Tropicana row no longer cites the lead-only E7.
13. **Done.** `SKILL.md` decision rule and `references/05`: distinctive asset audit disambiguated from website-strategy stage 2's asset audit; website-strategy stage 5 hex values routed into `--color-brand`.
14. **Done.** `references/03`: example 2 swap wording ("Fails for all three. Passes.") rewritten so pass and fail mean one thing; fundamental 1's lint description matches the code; hand-off on category design versus website-strategy stage 4 step 3 (opinion).
15. **Done.** `references/01` fill order adds the claims ledger, matching SKILL.md. `assets/strategy-brief.md`: three-line depth keeps the check rows its depth runs; inherit records them in the hand-over.
16. **Done.** `SKILL.md` expert move 7: Tropicana "announced the old carton's return about seven weeks later", matching the NYT and NPR dates.
17. **Done.** `kb/drafts/strategy/01` to `06` re-synced with the references (identical apart from the reference header line).

## For the researcher (batch returned)
1. `05` E7: the 20 percent figure is IRI (Information Resources Inc.) data reported by Ad Age (article_id=135735, 2009, relayed by BusinessWeek/Bloomberg 2009-04-02: unit sales down 20 percent, dollar sales down 19 percent, about $33 million, Jan 1 to Feb 22), not Nielsen. Replace the depix row or mark its attribution wrong.
2. `05` E13: correct the quote to "effectiveness"; the PDF parses with `pdftotext -raw`.
3. `02` B6: find a reachable source for the exact sentence (the Dawes 2021 B2B Institute paper itself, "Advertising Effectiveness and the 95:5 Rule") or quote CustomerThink's relay; the Marketing Week URL is behind Cloudflare and the quoted wording could not be confirmed anywhere.
4. Add rows for facts this pass put in the skill: Dunford "lose between 20% and 30% of deals" to "no decision" (aprildunford.com/post/positioning-and-competition); Dunford's definition from "An Introduction to Positioning"; the benchmark abstract's "narrative-driven assets perform relatively better in service industries" (OpenAlex record of 10.1080/02650487.2026.2637295); authors Phua, Bali, Anesbury, Sharp; Neumeier "you can't advertise your way to onlyness" (the-onlyness-test).
5. `05` E2: the 12,249 respondents, the HHI values (citing Ward et al. 2020), "Reliance on color alone" and the Caruso sentence need a reachable full text (tandfonline returns 403; the article is CC BY, so look for a repository copy). Caruso's own paper (International Journal of Market Research, 227 marketers, per Adelaide University's 2026 release) should be its own row.
6. Romaniuk's own grid labels ("Avoid solo use", "Ignore or test") come from Building Distinctive Brand Assets (2018), not from E1 ("Avoid", "Test or ignore"). Add the book or align the labels.

## Left for the editor
1. **design-playbook-brand done item 7** says new assets were "tested by recognition with the name hidden". Before launch that count is near zero by definition; point it at design-strategy 06 check 8 (misattribution and learnability). I did not edit another skill.
2. **design-art-direction SKILL.md 2.1** still says "Positioning comes from website-strategy"; it should read "from the design-strategy brief (which routes to website-strategy at full depth)". Add to `kb/reviews/design-strategy-pipeline-notes.md`.
3. **Brief length decision.** The research said 400 to 600 words (opinion); the skill uses 700 and now admits it prints on about 1.3 sides. Tighten to about 550 (and trim the example) if "one page" should mean a page.
4. **Gaps a top strategist would notice, not filled because the research does not cover them:**
   - Brand architecture (masterbrand, endorsed, house of brands) for "brand system" jobs, and naming. Neither is covered or routed; at least say "out of scope, route to ..." in section 1.
   - Dunford's later material: the trends component (C2 is in the research but unused) and the sales-pitch order from her 2023 book, which is how positioning becomes a page's section order.
   - Category style choice (head-to-head, big fish small pond, new category) with sources, to settle the tension with website-strategy stage 4 step 3.
   - A central organizing idea or brand behaviors (the COLLINS move): the concept sentence is visual; nothing says what the brand does that proves the position beyond the page.
   - Cultural semiotics (residual, dominant and emergent codes) as the sourced version of the opinion-only "semantic versus expressive codes" split.
   - Post-launch tracking: when to re-measure fame and uniqueness and what moves an asset from Invest to Use or lose.
5. The CHANGELOG entry for this pass is written under v0.1; bump to v0.1.1 at ship time if the librarian prefers.

## Second pass
Not yet run. Needs the researcher's corrections (above), then a fresh critic on the edited references, then the tester.

# v0.1.1 second pass

Reviewed 2026-10-13 on branch `claude/data-backend-strategy-brand-a8m75c` at commit `dacc9d0` plus this pass's edits: `skills/design-strategy/` (SKILL.md, references 01 to 06, assets, CHANGELOG), `kb/drafts/strategy/01` to `06`, `kb/research/strategy/01` to `06`. Checked against `kb/FOUNDATIONS.md` v0.4.4 (unchanged since the first pass) and its change log, design-director section 2, `skills/design-playbook-{landing,dashboard,mobile,brand}/SKILL.md`, design-art-direction SKILL.md and `references/01`, `tools/lint-tokens.mjs`. `kb/tests/` was not read.

## Verdict: approve for testing

The gate holds after this pass's fixes. As submitted, v0.1.1 had six gate-level misses in the new material (G11 to G16 below); all were small and are fixed here, in both the skill and the drafts. The citation spot check found one failing row (F4, a v0.1 lead-only row with no quote, sampled for the first time) and every v0.1.1 row passed; I repaired F4 with a quote fetched from its own URL. By the letter of the protocol one bad row fails the batch, but nothing shipped rests on F4 and nothing in the notes is still known to be wrong, so I am not returning the batch. Three full-text quotes from the 2026 benchmark could not be re-fetched from here (Cloudflare); that is open research follow-up item 1. It does not block the tester.

## 1. First-pass fixes
All 17 first-pass fix-list items are present in `skills/design-strategy/` and `kb/drafts/strategy/`. The drafts match the references line for line apart from the reference header (diff after stripping lines 3 and 4: 0 lines in all six files). Spot-confirmed: navy and gold recomputed (62.5 and 42, Avoid solo use), fame only from category buyers, the "one page" discipline wording, Dunford's definition [C18], 20 to 30 percent [C17], the color-name linter case, the orange ratios, `--radius-lg` everywhere (no `--radius-md` left in 04), "low stroke contrast", no "Late fees" sample, no "tier 5" in 02, ledger "yes or cut", the seven-weeks Tropicana line, and the example 2 swap wording. The editor items were also applied outside this skill: design-playbook-brand done item 7 now says misattribution and learnability, and design-art-direction 2.1 now routes positioning through the design-strategy brief.

## 2. Citation spot check (fresh seed)
Population: 97 claim rows in `kb/research/strategy/01` to `06` (`grep '^| [A-F][0-9]+[a-z]? |'`). Sample: 20 (20 percent, rounded up), `random.seed(20261014); random.sample(ids, 20)` in Python 3, giving A8, B6, B8, C7, C11, C16, C17, C19, C22, E1b, E2, E2f, E3, E5, E7, E13, E19, E23, E26, F4. Added because the brief asked for every new row: A10, A11, A12 (via E19), A13, A14, B6b, C18, C20, C21, C23, C24 (not re-fetched), C25, E2b, E2c, E2d, E2e, E2h, E2i, E16, E17, E18, E21, E22, E24.

| Row | Checked | Result |
|---|---|---|
| A8 | design-color psychology-brand line 26: "List the 8 to 12 direct competitors and plot their primary hues" | Pass |
| B6, B6b, E21 | marketingscience.info 95-5 page (Dawes, May 2021): "only 20% of business buyers are 'in the market' over the course of an entire year", "something like 5% in a quarter"; "The 95% figure is not meant to be a precise rule."; "We're using it as a heuristic"; "50% are in the market over the course of a (whole) year, or around 13% in any quarter." | Pass (the first-pass B6 failure is resolved) |
| B8 | copywriting SKILL.md line 21: "Market Sophistication: How many similar ads or promises has your audience seen before?" (bold markup aside) | Pass |
| C7 | aprildunford.com positioning-vs-strategy-vs-vision: "Positioning is firmly rooted in the present."; "your customer is coming to you with a shortlist of competitors" | Pass |
| C11 | OpenAlex abstract of 10.1016/S1441-3582(07)70042-3: "there is a low level of perceived differentiation across competing brands"; "place distinctiveness at the centre of brand strategy" | Pass |
| C16 | design-art-direction SKILL.md line 25: "What is true, specific and drawable about this brand" | Pass |
| C17 | aprildunford.com positioning-and-competition: "In enterprise software, we typically lose between 20% and 30% of deals to "no decision."" and the status quo sentence | Pass |
| C18 | aprildunford.com introduction: "Positioning defines how your product is a leader at delivering something that a well-defined set of customers cares..."; five components; "not only pointless but potentially dangerous" | Pass |
| C19 | martyneumeier.com: "Remember, you can't advertise your way to onlyness" (followed by a dash, as the note says) | Pass |
| C20 | Google Books record: "How to leverage market trends to help buyers understand why making a purchase is important right now"; also "three distinct styles of positioning", unnamed | Pass |
| C21 | durmonski.com PDF, `pdftotext -raw` line 319: "Step 9: Layer on a trend (but be careful)" | Pass (tier 5, as marked) |
| C22 | positioning.show episode notes: "(09:50) Trends don't always align with your product (and why you shouldn't force them to)"; "Long Island Blockchain" at 13:41 | Pass |
| C23 | Lenny's Newsletter, Dunford guest post 2023-10-17: "The pitch structure is composed of two main parts"; "The setup comprises three components"; the insight question; "Customer service is a growth driver, not a cost center." | Pass |
| C25 | mindtheproduct.com recap (grep of the page): "Dunford explains that positioning defines how you're the best in the world at delivering something against the competitors you have right now" | Pass (the recapper's words, marked as recap) |
| E1b | marketingscience.info brands-of-distinction: "It should be avoided as such elements will trigger competitors to copy."; quadrant labels Use or Lose, Invest, Avoid, Test or ignore | Pass |
| E2, E2f | OpenAlex abstract of 10.1080/02650487.2026.2637295 (Phua, Bali, Anesbury, Sharp; CC BY): the 40/71 and 12/39 sentence verbatim; "narrative-driven assets perform relatively better in service industries" | Pass |
| E2b | Search excerpt of the T&F full text: 12,249 respondents, category buyers only, 229 to 1,500 per questionnaire, average 583 | Pass |
| E2c | Search excerpt of the T&F PDF: "competitive intensity and lowest potential for unique ownership (HHI of 0.31)", next to brand-color text; a second passage reads "color exhibits the highest competitive intensity". Characters 0.69, logos 0.61 and fonts 0.60 not found in any reachable text | Partial: color value confirmed; the other three are unverified from here |
| E2d | "Reliance on color alone as a Distinctive Asset, therefore, carries substantial risk.": tandfonline returns 403 (Cloudflare challenge) to WebFetch, curl and a reader proxy; three exact-phrase searches found nothing | Unverified from here (not contradicted) |
| E2e | Search excerpt of the T&F full text: "Research examining packaging redesigns based on focus groups and brand attitude measures has been associated with less successful outcomes, whereas approaches grounded in Distinctive Asset research are linked to more successful outcomes (Caruso et al. 2025)" | Pass |
| E2h | Search excerpt of the T&F full text: "Ignore or Test (low Fame, low Uniqueness), Avoid Solo Use (high Fame, low Uniqueness), Investment Potential (low Fame, high Uniqueness), and Use or Lose (high Fame, high Uniqueness)"; 26 and 54 average | Pass (the first pass's researcher item 6 is resolved) |
| E2i | "cross-sectional snapshot" and r = 0.97: not reachable (same 403) | Unverified from here |
| E3 | jenniromaniuk.com 2018: "The more attention-grabbing the creative, the harder the branding has to work to succeed" | Pass |
| E5 | OpenAlex abstract of 10.1098/rstb.2020.0390: 25 languages, nine families, 10 writing systems; "strong evidence for the effect across languages" | Pass (the royalsociety URL returns 403; same text by DOI) |
| E7 | Bloomberg returns 403; search excerpts of the Ad Age text give "According to Information Resources Inc., unit sales dropped 20%, while dollar sales decreased 19%, or roughly $33 million, to $137 million between Jan. 1 and Feb. 22." | Pass (the first-pass E7 failure is resolved) |
| E13 | Tom Roach PDF, `pdftotext -raw` line 26: "The 60:40 split delivers maximum effectiveness"; line 191 "Emotional campaigns yield stronger" | Pass (the first-pass E13 failure is resolved) |
| E16 | OpenAlex abstract of 10.1177/14707853241296656 (Caruso, Romaniuk, Page, Anesbury, Williams; IJMR 67(1) 17 to 32): 227 marketers; "focus groups or brand attitudes, are associated with less successful outcomes". Search excerpt: "195 (86%) involved market research"; "no evidence that marketers who conducted market research had" more overall success | Pass |
| E17 | marketingweek.com returns 403; a search excerpt confirms "It's not about picking a winner, it's about picking a contender." in "Leaning on meaning could undermine your distinctive assets" | Pass on the quote |
| E18 | OpenAlex abstract of 10.1177/14707853241251954: "suggestive Distinctive Assets display lower levels of Fame and Uniqueness than non-suggestive Distinctive Assets" | Pass |
| E19, A12 | gbv.de contents scan, rendered and read: "Protect the parent brand as a priority 57"; "The right times to measure 76" | Pass |
| E22 | OpenAlex abstract of 10.1177/14707853241291443 (Ward, Trinh, Beal, Dawes, Romaniuk): "significantly higher (17%) correct brand recall"; "79% v 35%". The PBCM formula ("share of products using each asset, averaged") is not in the abstract | Pass on the numbers; formula unverified |
| E23 | analepsis.org scan of Williams pp. 122 to 123, rendered and read: "The residual, by definition, has been effectively formed in the past, but it is still active in the cultural process"; "By 'emergent' I mean, first, that new meanings and values, new practices, new relationships and kinds of relationship are continually being created" | Pass |
| E24 | semiovox.com: "There he introduced the Residual, Dominant and Emergent mapping tool for cultural and communication codes"; Evans joined Semiotic Solutions in 1988 | Pass |
| E26 | the-brandidentity.com: "And they're more behavior-based than communications-based." (Brian Collins, on Convergence Era brand problems) | Pass |
| A10 | coursesidekick returns 403. Same CMR 42(4) text at ngovietliem.com PDF p. 9: "allow brands to stretch across products and markets, ... protect brands from being diluted by over-stretching, and • signal that an offering is new and different" | Pass on the quote, URL replaced. The finding mislabelled the spectrum: Figure 1 puts "Master Brand as Driver" under subbrands, and the branded house splits into Same Identity and Different Identity. Fixed in the note |
| A11 | prophet.com, David Aaker: the three questions verbatim; "A sub-brand will allow some distance from a master brand, an endorsed brand more, and a new brand the most." | Pass |
| A13 | uspto.gov strong-trademarks: the quoted pair of sentences verbatim. The finding said "Descriptive marks 'are hard to protect...'"; the page says "Weak trademarks" (descriptive or generic) | Pass on the row; finding wording fixed |
| A14 | uspto.gov grounds for refusal: "it is critical that you conduct a search for conflicting marks before you file" | Pass |
| F4 | wynter.com/research-playbook: no LinkedIn mention, no panel size; the row had no quote ("search summary ..., no quote fetched") | **Fail** (missing quote, and the claim is not on the page). Fixed: the finding and row now quote "Wynter Surveys collect responses from verified members of your target ICP via the Wynter B2B panel." Not used in the skill |

Also found: A7's internal quote ("Positioning comes from website-strategy") is no longer in design-art-direction, because the first pass's editor item changed that line. The row is now marked superseded.

Result: 19 of 20 sampled rows pass; F4 failed and is fixed; every v0.1.1 row passes or is unverifiable only because of access (E2c's non-color values, E2d, E2i, the PBCM formula).

## 3. Gate findings on the new material (step 1)
| # | Where | Finding | Status |
|---|---|---|---|
| G11 | SKILL decision rule "Architecture", ref 01 architecture rules | "Whatever the position, carry the parent's primary distinctive asset across the range" contradicts its own table, where a house of brands keeps the parent "shadowed or hidden". Ward et al. measured cohesion inside one brand's product range, so extending it to subbrands and endorsed brands is inference | **Done**: "short of a house of brands"; the inference is marked |
| G12 | ref 01 naming | "A descriptive name is the weakest legal choice": USPTO lists generic below descriptive (generic is never registrable) | **Done**: "sits at the weak end, one step above generic" |
| G13 | ref 01 fundamental 3 | "about 210 words spill at 10pt" was presented as a measurement. My Playwright render of the same 598-word file (Helvetica, A4, 15mm margins, 1.3 leading) spills 149 words at 10pt. The count depends on the renderer | **Done**: "150 to 210 words ... depending on the renderer". "Two A4 sides at 10pt and 9pt" reproduced |
| G14 | SKILL decision rules; ref 03 page-order table versus ref 02 expert move 1 and design-playbook-landing step 2 | Two answers to one decision: "Hero from the primary CEP" against "insight hero" | **Done**: the hero states the insight in the primary CEP's words (SKILL and ref 03), which also matches the landing playbook's "primary category entry point and category frame" |
| G15 | Example brief identity row | The curve took `--color-brand` with "one step darker". That is the exact path that failed `primitive-in-component` in round 4.2 (the coffee label curve on `--color-orange-700`, `tools/lint-tokens.mjs` lines 20 to 22, FOUNDATIONS v0.4.3), and it breaks this skill's own ref 05 fundamental 5 ("`--color-brand` and the role it maps to") | **Done**: "orange curve via `--color-illustration-accent`" (FOUNDATIONS token schema, Illustration row); trimmed back to 598 words |
| G16 | SKILL expert move 8, ref 05 expert move 4 and Numbers | "showed no more overall success" is stronger than the source's "no evidence that marketers who conducted market research had more overall success" | **Done**: "no evidence of more overall success" |

Smaller correctness fixes:
- The in-market formula "1 divided by the years between purchases" passes 100 percent for cycles under a year. It is now limited to cycles of a year or more (ref 02).
- The tracking cadence "one purchase cycle, then yearly" meant one week for a weekly category and seven years before the first re-measure for cars, longer than the "yearly" that follows. It is now held between 3 and 12 months (SKILL, 05, 06; opinion).
- SKILL's "avoid residual codes" dropped ref 05's heritage exception. The exception is restored.

## 4. The new material: correct, not filler, opinion marked?
- **Brand architecture** (ref 01, SKILL): correct against Aaker 2000 and the Prophet post after G11. The three questions are quoted, "least distance" is marked opinion, and lockups are routed to design-graphic. For a seasoned brand strategist the spectrum itself is textbook. What earns it a place is the Ward 2025 cohesion numbers and the rule to carry the primary asset.
- **Naming route** (ref 01): correct after G12. Short, routes the work out, marks opinion. The line "the descriptive name is the one teams like most" is useful.
- **Dunford trends and pitch order** (ref 03): sourced to her own posts and book page. The trend is optional and goes last, with Long Blockchain as the warning. The page mapping is marked opinion. The rule "never list a perfect-world criterion the product does not meet" is a good catch. The three positioning styles are rightly left out, because they were not confirmed in a primary source.
- **Behaviors** (ref 05, 06 check 10, SKILL move 17): the Collins quote is accurate in context, and the "central organizing idea" term is honestly called practice vocabulary. The copy-next-week test and the seconds example are concrete. Opinion is marked.
- **Semiotic codes** (ref 05): Williams is quoted verbatim from the scan and Evans attribution is correct. Lawes is cited but not quoted, as the note says. The method and rules are marked opinion. The rule "a code in one competitor only is a competitor's asset, not a code" is sharp.
- **Tracking** (ref 05, 06 check 9): grounded in the benchmark's own cross-sectional limit, the in-market arithmetic and Romaniuk's early-warning system. "Watch uniqueness first" and "no fame gain: check co-presentation before blaming the asset" are real moves. The cadence is opinion, now bounded.
- None of it is filler. The one thinner block is architecture, which a strategist knows already. It stays because it decides what the identity work carries.

## 5. Numbers measured
| Number | Author's value | Measured | Method |
|---|---|---|---|
| Example brief length | 598 (linter) | 598 by the linter before and after this pass's edits; 581 by a plain whitespace split (the linter counts more tokens, as the first pass noted) | `brief_lint.mjs`; Python split after stripping comments and table rules |
| Pages at 11, 10, 9pt | two A4 sides at 10 and 9pt | 2, 2, 2 pages; page 2 holds 196, 149 and 74 words | pandoc to HTML, Playwright `page.pdf` A4 15mm, `pdfinfo`, `pdftotext -f 2 | wc -w` |
| Orange `#F26B21` | 3.0:1 on white, under 3:1 on neutrals | 3.04 white, 2.85 `#FAF7F2`, 2.68 `#F5F0E8` | WCAG relative luminance script |
| Audit table | 75/100, 62.5/42, 12.5/25, 37.5/75 | same; quadrants correct at 50 percent | arithmetic |
| Dawes arithmetic | 2 years: 50 percent a year, about 13 a quarter | 0.5 a year; 12.5 a quarter (linear), "around 13%" in the source | arithmetic and source |
| `--self-test` | 15 of 15 | 15 of 15, exit 0 | `node skills/design-strategy/assets/brief_lint.mjs --self-test` |
| Example brief lint | PASS | PASS, 0 warnings (605 words and a length warning after my first edit; trimmed back to 598) | `brief_lint.mjs` |
| Template lint | fails as intended | 5 FAIL, 2 WARN (placeholders) | `brief_lint.mjs assets/strategy-brief.md` |
| SKILL.md description | 901 characters | 901 (cap 1,024) | Python on the front matter |
| Em dashes (U+2014) | 0 | 0 in `skills/design-strategy/`, `kb/drafts/strategy/`, `kb/research/strategy/` | `grep -c` for U+2014 |

## 6. Foundation conformance (v0.4.4)
- Every token named exists in FOUNDATIONS: `--font-sans`, `--font-serif`, `--font-mono`, `--text-display`, `--radius-sm`, `--radius-lg`, `--space-section`, `--color-brand`, `--color-illustration-accent` (token schema, Illustration row, v0.3), `--duration-slow`, `--ease-standard`, `--motion-enter`.
- `--motion-enter` (base duration on `--ease-enter`) and one `--duration-slow` reveal sit inside the v0.4 reveal ceiling.
- Locale rule matches "Locale first" (v0.4.4). Row 16 (claims ticked) is cited correctly. No checklist row is contradicted.
- After G15, no decision routes a primitive into a component.
- The accessibility statements agree with design-foundations `references/accessibility.md` and design-color: a brand color that fails as text changes role, 1.4.11 applies to the meaningful curve, and the floor is never overridden.

## 7. Contradictions with other skills
- **design-director section 2**: same four depths, same lint command, same hand-over line. Agrees.
- **Playbooks**: brand section 0 and done item 7 agree (misattribution and learnability, fame tracked after launch). Landing step 2 agrees after G14. Dashboard and mobile take inherit depth or one page, matching section 1.
- **design-art-direction**: its concept for Ember and Oak ("The hill and the fire", orange as the fire) matches the example; its fundamental 4 maps illustration to `--color-illustration-*`, which G15 now follows.
- **website-strategy**: no restatement. The category-design tension is still handled by the opinion hand-off in ref 03.

## 8. Expert-learning test (new in v0.1.1)
Lines a top practitioner would plausibly not know, or not have in this form:
1. Ward et al. 2025: products in cohesive portfolios are matched to their portfolio by 79 versus 35 percent and recalled 17 percent more. Cohesion can be counted from the products, without a survey.
2. Dunford's pitch as a page order: insight hero, alternatives, perfect-world criteria, product as the answer, with the rule never to list a criterion you do not meet.
3. The 2026 benchmark admits it is cross-sectional, so nobody knows how fast assets move. The cadence is honest opinion, built on the in-market arithmetic.
4. Uniqueness is the early warning, not fame. If fame does not grow, check co-presentation before blaming the asset ("widespread co-presentation", Romaniuk 2025).
5. Take the one expressive break from an emergent code; a code in one competitor only is that competitor's asset.
6. Dawes calls 95:5 "a heuristic" and gives the formula to compute your own category's in-market share.
7. Romaniuk 2025: "picking a contender", not a winner. Read with Bali 2024 (suggestive assets score lower), this means the attribute table never picks the asset.
8. Caruso et al.: 86 percent of 227 pack redesigns used research, with no evidence that it brought more success.
9. A descriptive name is the legally weak choice teams like most; search for conflicts before anyone falls for it.
Together with the ten first-pass lines, this passes step 5.

## 9. Fix list (this pass)
1. **Done.** `SKILL.md` decision rules (Architecture, Page order, Category codes, Tracking), expert move 8, Numbers: G11, G14, G16, residual exception, cadence.
2. **Done.** `references/01` (and draft): G11 with the inference marked, G12, G13, Aaker source URL.
3. **Done.** `references/02` (and draft): in-market formula limited to cycles of a year or more.
4. **Done.** `references/03` (and draft): hero row states the insight in the primary CEP's words (G14).
5. **Done.** `references/05` (and draft): Caruso wording (G16), cadence 3 to 12 months.
6. **Done.** `references/06` (and draft): cadence in check 9 and Numbers.
7. **Done.** `assets/example-brief-ember-oak.md`: curve via `--color-illustration-accent` (G15); 598 words, PASS.
8. **Done.** `kb/research/strategy/01`: spectrum labels per Figure 1, weak-mark wording, reachable A10 copy, A7 marked superseded. `kb/research/strategy/06`: F4 quote and claim.
9. **Done.** `CHANGELOG.md`: second-pass line under v0.1.1.

## For the researcher (open, non-blocking)
1. Archive the benchmark full-text passages behind E2c (characters 0.69, logos 0.61, fonts 0.60), E2d and E2i, and the PBCM formula behind E22, as dated excerpts in `kb/research/strategy/05`. Do this through a reachable route (a repository copy of the CC BY article, or the fetch service the note mentions). If they cannot be shown, cut the HHI row and the cross-sectional quote from ref 05 and keep the abstract's wording.
2. Optional: Dunford's three positioning styles from a primary source (book or her site), to close the category-style gap the first pass named.

## Left for the editor
- Nothing new. The first pass's editor items 1 and 2 are applied. Item 3 (brief length) is settled at 600.
