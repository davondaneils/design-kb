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
