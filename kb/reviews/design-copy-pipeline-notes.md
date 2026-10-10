# Pipeline notes from the design-copy run

## Suggested agent improvements
1. **researcher:** shared WebSearch budget (200 per turn across all parallel agents) ran out mid-run. Give each domain worker a search quota (about 15 to 20) and tell it to spend WebFetch on known canonical URLs first; searching is the scarce resource, fetching is not.
2. **researcher:** add a status column convention to the agent file (C consensus, R research, P practitioner, X contested). It made the critic's job mechanical.
3. **researcher:** X.com pages rarely fetch. Add a rule: find practitioner material through their own sites (marketingexamples.com, julian.com, copyhackers.com, wynter.com) and cite the X post URL only for direct quotes.
4. **critic:** add a required check "measure any number you wrote yourself" (word counts, reading grades). The draft's guessed grade levels were wrong.
5. **tester:** make "gate fail caps the score" part of the agent file rubric; it separates competent from shippable cleanly.
6. **skill-architect:** require a "deliverable format" section in every SKILL.md (here: slot tables), so outputs drop straight into a design.
7. **design-director (future):** "landing page" triggers both design-copy and copywriting. Routing rule proposal: design-copy for structure, slots, microcopy and review; copywriting for long-form persuasion; both when writing a sales landing page from scratch.

## Foundation contract conflicts
- None blocking. The contract sets measure (45 to 75, 66 ideal), `--color-danger`, target sizes and WCAG 2.2 AA; copy defaults match.
- Note: the contract has no content tokens. Suggest adding mechanics defaults to FOUNDATIONS so every skill's examples agree: sentence case for UI, numerals for numbers, absolute dates for money and deadlines, no em dashes, US vs UK spelling choice (this skill used US spelling in examples and UK-style GOV.UK quotes verbatim).
- Slot budgets in this skill assume the contract's type scale; if design-typography changes display sizes, revisit the H1 character budget (20 to 60).

## v0.2 render run (2026-10-10): suggested changes to shared files
Proposals only; this branch does not edit these files.

1. **design-director, section 5 (self-critique loop):** add a step between 2 (lint) and 3 (polish): "Fact check: run `node skills/design-copy/assets/claims_inventory.mjs page.html --year <year>` and tick every listed claim against its source (chart data, price list, log). Fluent copy is not checked copy." Reason: the combined pages carried three false numbers ("+12.4%" against data showing +8.1%, "third rise" against eight, "15% under shop price" against 0 to 14%) through the critic, the tester and Davon's blind rank. No visual check can catch them.
2. **design-foundations fundamentals checklist (FOUNDATIONS item 12 or a new item 16):** "Copy is true and consistent: every number matches its source; each promise has one wording; one verb per action." `[judged]`, with the claims inventory as the aid. Editor-in-chief decision.
3. **FOUNDATIONS, content mechanics (repeat of the v0.1 note, now with sources):** one clock (US: 12-hour "2:05 pm", Polaris and Mailchimp), dates "Tue, Oct 13" with the weekday checked, numerals except at sentence start (Mailchimp), US spelling for US brands, no-break spaces inside dates, prices, ranges and number-unit pairs. Today each skill's examples choose for themselves: the combined dashboard used "14:05" and the coffee page "metres" on a US site.
4. **design-playbook-landing, section 3 non-negotiable 2:** "the hero says what it is ... in the visible first screen at 390px" should name the failure mode found here: a lead paragraph that does the clarity job can fall below the first phone screen when an image sits between it and the H1. Check the 390 first screen (844px) for the category word.
5. **design-playbook-dashboard, section 2:** add "A data-quality problem is marked on every number it affects, not only in an alert."
6. **tester agent:** when a test changes only one domain (copy here), build the after page from the before page's source with scripted, asserted replacements (`kb/tests/design-copy/rewrite.py`) so the gain is attributable and reviewable as a table. Also: a blind visual rank cannot judge truth; for copy, the measurable gain is the count of gate misses fixed.
7. **lint (tools/lint.mjs), for design-frontend:** the `fallback` check fires when copy near a wrap boundary changes line count under the fallback face. Consider reporting which element's line count changed, so copy and font fixes can be told apart.
8. **researcher agent:** add Shopify Polaris (`polaris-react.shopify.com/content/...`) and Mailchimp (`styleguide.mailchimp.com`) as tier 1 content style sources that fetch reliably when NN/g, GOV.UK and Microsoft are blocked.
