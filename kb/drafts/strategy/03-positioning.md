# 03 Positioning, the one true fact and the claim it can carry

Research notes: `kb/research/strategy/03-positioning.md` (C-numbers). Opinion is marked (opinion).

Positioning, in Dunford's words, "defines how our product is different and better than alternatives for a particular set of customers" (aprildunford.com). It is built from components in a fixed order, starting with what the customer would do if the product did not exist [C1][C3]. This file adds three things the positioning books leave to others: the one true fact that carries the position onto a page, the legal line between a position and a public claim, and the split between being different (what you say) and being distinctive (what you look like).

website-strategy stage 4 holds the long method (Ries and Trout's one word, category design, Hormozi's niche test, tagline territory). Use it at full depth. This file is the short path and the checks.

## Floor: fundamentals (non-negotiable)
1. **Competitive alternatives come first and include the status quo** (spreadsheet, agency, doing nothing) [C3][C4]. [lint: `brief_lint.mjs` checks the field lists at least one alternative that is not a named company; judged for truth]
2. **Three competitors are named** for the swap tests: the ones the best-fit customer actually shortlists, not every company on the internet [C4]. [lint: field present]
3. **The positioning passes the name-swap test**: put each named competitor's name in the onlyness sentence and the hero line; if either still reads true, it fails [C10]. [judged; result recorded, `brief_lint.mjs` checks a result is written]
4. **One true fact is stated with its source**: specific, checkable, owned by this brand. [lint: field present with a source]
5. **No public claim without evidence held before publishing.** "Only", "first", "fastest", "#1", "perfect", numbers and comparisons are objective claims; the FTC requires "a reasonable basis ... before they are disseminated" and CAP 3.7 requires "documentary evidence" [C12][C13]. The onlyness statement is internal until the evidence is in the claims ledger. [judged; `claims_inventory.mjs` for numbers and dates]

## Principles
1. **Alternatives define difference.** Features are "only 'differentiated' when you compare them to competitive alternatives" [C3].
2. **The category is a frame you choose.** The best category is "the context you position your product in such that your unique value is obvious" [C3]. The category word in the hero is a positioning decision, not a description.
3. **Positioning is present tense** [C7]. It claims what wins today, not the vision.
4. **Different in words, distinctive in looks.** Buyers perceive "a low level of perceived differentiation across competing brands" [C11], yet in-market comparers still need a reason to choose. The words carry the reason (this file); the look carries recognition (05).
5. **If you cannot say it, change the company, not the sentence** (Neumeier) [C9].

## Decision rules
### The short path (one page depth)
1. **Alternatives**: what would the best-fit customer do without this? Status quo plus up to three named shortlisted competitors.
2. **Unique attributes**: what this has that those do not; facts, not adjectives.
3. **Value**: what each attribute lets the customer do (Dunford's example: "Companies can answer questions while a customer is on the phone instead of having to call them back the next day", aprildunford.com/post/a-product-positioning-exercise).
4. **Best-fit customers**: who cares most about that value (02's moment).
5. **Market category**: the frame that makes the value obvious. Try three frames; keep the one whose default assumptions favor you (website-strategy stage 4 step 1).
6. **Onlyness**: "Our [offering] is the only [category] that [benefit], for [who], in [where or when]" [C8][C10].
7. **Swap test** against each named competitor; rewrite until it fails for all three.
8. **One true fact and proof**: the single checkable fact that makes the onlyness believable, and the proof that shows it on the page.
9. Only then write the positioning statement, if website-strategy's template is wanted: it is the summary, never the method [C5][C6].

### What the one true fact must be
| Test | Pass | Fail |
|---|---|---|
| Specific | "Every lot is roasted on a 1962 drum roaster in Portland and logged as a curve" | "Expertly roasted" |
| Checkable | A stranger could verify it | A feeling |
| Owned | Competitors cannot say it of themselves | Category table stakes ("fresh", "secure") |
| Drawable | design-art-direction can make a picture from it | An abstraction |
| Relevant | Linked to the value in step 3 | A trivia fact |

### From position to public claim
| Internal position | Public claim allowed when | Otherwise write |
|---|---|---|
| "the only X that Y" | You hold documentary evidence that no competitor does Y (a market scan dated, kept) | The fact itself: "Every bag carries its roast curve" |
| "the fastest" | A dated test with method | The measured number with its basis: "Payouts in 2 business days" |
| "loved by thousands" | A count with its scope | "4.7 from 1,284 subscriber reviews" (design-playbook-landing non-negotiable 6) |
| A mood ("premium") | Never a claim | Show it; do not say it (website-strategy stage 5 prohibitions) |

## Numbers
| Item | Default |
|---|---|
| Components | 5, alternatives first [C1][C3] |
| Named competitors for swap tests | 3 (opinion) |
| Category frames tried | 3 (website-strategy stage 4) |
| One true fact | 1 (opinion: a second fact goes to proof) |

## Ceiling: expert moves
1. **Run the swap test twice: on the words and on the first screen.** The onlyness sentence can pass while the hero section (headline, image, layout) is interchangeable with a competitor's. Swap names in the sentence; swap logos on the screenshot (06) (opinion).
2. **Translate onlyness into the fact, not the boast.** The public line is the evidence ("the only one that logs every roast" becomes "every bag shows its roast curve"). It survives CAP 3.7 and FTC review, it is more specific, and it gives art direction something to draw [C12][C13] (application is opinion).
3. **Choose the category for its default assumptions.** Calling an invoicing tool "accounting software" imports QuickBooks as the reference and its feature checklist; calling it "getting paid on time" imports a different comparison. Pick the frame where your strengths are the assumed criteria [C3] (example is opinion).
4. **Position against the status quo before the competitor.** In most B2B deals the alternative that wins is doing nothing [C4]; a hero that beats the spreadsheet beats more deals than one that beats the market leader (opinion from [C4]).
5. **Keep difference in the words and distinctiveness in the look.** Do not ask a logo or a color to "communicate" the positioning; evidence shows weak perceived differentiation [C11] and shape associations are overridden by a headline that says something else (05, Jiang 2016). Assign the job: words differentiate, assets identify.
6. **When nothing is only, narrow the who or the where.** Neumeier's what, how, who, where, why, when lets a commodity win a specific audience in a specific place ("the only same-day denture repair in Tacoma") [C10]. If even that fails, say so in the brief (fix the company [C9]).

## Do and don't
| Do | Don't |
|---|---|
| Alternatives: "spreadsheet, an accountant at year end, FreeAgent" | Alternatives: every app in a G2 grid |
| "Every bag shows its roast curve" (fact, provable) | "The only truly artisan roaster" (unprovable) |
| Category frame chosen from three tries | Category copied from the founder's pitch deck |
| Swap test result written in the brief | "Positioning: premium, trusted, innovative" |

## Worked examples
### 1. Ember and Oak, specialty roaster (one page)
- Alternatives: supermarket specialty bags, a local café's beans, two named online roasters.
- Unique attributes: named farm lots with altitude; every batch roasted on a 1962 drum roaster in Portland and logged as a curve.
- Value: you can taste and see why this bag differs from last month's.
- Category frame: "single-origin coffee subscription" (tried: "coffee beans", "specialty roaster"; the subscription frame makes the lot-by-lot change a feature).
- Onlyness (internal): the only Portland roaster that ships every lot with its own roast curve and farm map.
- Swap test: both named roasters print origin but not curves; supermarket bags print neither. Passes.
- One true fact: each batch's roast is logged as a curve on the 1962 roaster. Proof: the curve printed on the bag and page. Public claim: the fact, not "only".
- Hand-off: design-art-direction's concept "The hill and the fire" (its worked example 1) is built from this fact.

### 2. Invoicing tool in a crowded market (one page)
- Alternatives: the status quo (Word template and email), Stripe Invoicing, FreshBooks.
- Attributes: chases late payments with a sequence the freelancer approves; shows "expected by" dates from the client's own history.
- Category frame tries: "invoicing software" (compared on templates, loses), "accounts receivable" (enterprise, wrong buyer), "getting paid on time" (wins: the value is the frame).
- Swap test on the first hero draft "Beautiful invoices in seconds": true of all three named competitors. Fails. Rewrite: "Know when each client will actually pay." Fails for all three. Passes.
- One true fact: the median days-late figure from the product's own data, with its scope and date, held in the claims ledger.

## Where this domain is usually wrong
1. **"Fill in the positioning statement."** Dunford calls the exercise as a method "not only pointless but potentially dangerous" because it assumes one answer per blank [C5]. Correction: components in order; the statement last.
2. **"Our competitors are the other vendors."** The first alternative to beat is the status quo [C4].
3. **"Customers see us as different."** Perceived differentiation is low across brands in many categories [C11] (contested by positioning practitioners). Correction: differentiate in words for the comparer, be distinctive in looks for everyone.
4. **"'Only' is just positioning language."** In public it is an objective claim: the ASA treated even "the perfect network" as objective in context [C14]; CAP 3.7 and the FTC require evidence held first [C12][C13].
5. **"A great position can be advertised into being."** Neumeier: "you can't advertise your way to onlyness" (martyneumeier.com); if it is not true, fix the company [C9].

## Hand-offs
- website-strategy stage 4: the long method, tagline territory, what the position rules out.
- design-copy: hero line from the position and the moment; `claims_inventory.mjs` for numbers.
- design-conversion 02: proof beside the claim it proves.
- design-art-direction: the one true fact becomes the concept sentence.
- 05 (identity): distinctiveness, not differentiation, is the identity's job.
- Legal: substantiation rules differ by market (FTC in the US, ASA and CAP in the UK); for regulated claims (health, finance, environment) the client's lawyer decides (opinion).

## Sources
- Dunford, A., "An Introduction to Positioning", https://www.aprildunford.com/post/an-introduction-to-positioning; "A Quickstart Guide to Positioning", https://www.aprildunford.com/post/a-quickstart-guide-to-positioning; "Positioning and Competition", https://www.aprildunford.com/post/positioning-and-competition; "Positioning vs Strategy vs Vision", https://www.aprildunford.com/post/positioning-vs-strategy-vs-vision; "A Product Positioning Exercise", https://www.aprildunford.com/post/a-product-positioning-exercise; https://www.aprildunford.com/ (all accessed 2026-10-13).
- Neumeier, M., The Onlyness Test, https://www.martyneumeier.com/the-onlyness-test; interview, https://www.peachpit.com/articles/article.aspx?p=2437847 (accessed 2026-10-13).
- Mall, D., "The Only-ness Statement", https://danmall.com/learn/the-business-of-design/onlyness (accessed 2026-10-13).
- Romaniuk, J., Sharp, B., Ehrenberg, A. (2007), "Evidence concerning the importance of perceived brand differentiation", Australasian Marketing Journal 15(2), https://www.sciencedirect.com/science/article/abs/pii/S1441358207700423 (accessed 2026-10-13).
- FTC Policy Statement Regarding Advertising Substantiation, https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation (accessed 2026-10-13).
- ASA, Substantiation (CAP Code rule 3.7), https://www.asa.org.uk/advice-online/substantiation.html (accessed 2026-10-13).
- Davon's skills: website-strategy `references/stage2-factsheet.md`, `stage4-positioning.md`.
