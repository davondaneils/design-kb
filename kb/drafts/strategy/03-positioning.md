# 03 Positioning, the one true fact and the claim it can carry

Research notes: `kb/research/strategy/03-positioning.md` (C-numbers). Opinion is marked (opinion).

Positioning, in Dunford's words, "defines how your product is a leader at delivering something that a well-defined set of customers cares a lot about" [C18]. It is built from components in a fixed order, starting with what the customer would do if the product did not exist [C1][C3]. This file adds three things the positioning books leave to others: the one true fact that carries the position onto a page, the legal line between a position and a public claim, and the split between being different (what you say) and being distinctive (what you look like).

website-strategy stage 4 holds the long method (Ries and Trout's one word, category design, Hormozi's niche test, tagline territory). Use it at full depth. This file is the short path and the checks.

## Floor: fundamentals (non-negotiable)
1. **Competitive alternatives come first and include the status quo** (spreadsheet, agency, doing nothing) [C3][C4]. [lint: `brief_lint.mjs` checks the Alternatives field names the status quo; judged for truth]
2. **Three competitors are named** for the swap tests: the ones the best-fit customer actually shortlists, not every company on the internet [C4]. [lint: field present]
3. **The positioning passes the name-swap test**: put each named competitor's name in the onlyness sentence and the hero line; if either still reads true, it fails [C10]. [judged; result recorded, `brief_lint.mjs` checks a result is written]
4. **One true fact is stated with its source**: specific, checkable, owned by this brand. [lint: field present with a source]
4a. **Check the fact against each named competitor's own page before calling it owned.** Read their published appointment length, guarantee, price or process. In the Halden re-test, "90 minutes" led the skilled hero while Amplifon's UK FAQ gave consultations of up to one and a half hours, and "four years of aftercare" was matched by Specsavers' four-year guarantee (`kb/tests/design-strategy.md`). When a competitor matches the fact, lead with the part they cannot copy (here, the owners see you themselves). [judged; record the competitor page and date in the claims ledger]
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
9. **Trend, if one fits** (optional last layer): a market shift that explains why the value matters *now*. Dunford's book teaches trends "to help buyers understand why making a purchase is important right now" [C20]; her process says to "Layer on a trend (but be careful)" [C21]. Use one only if the product's value genuinely rides it; never rename the category after it (her cautionary case is "Long Island Blockchain" [C22]).
10. Only then write the positioning statement, if website-strategy's template is wanted: it is the summary, never the method [C5][C6].

### From positioning to the page's section order
Dunford's sales pitch is built from the positioning in a fixed order: "the setup and the follow-through"; the setup is "insight, alternatives, and 'the perfect world'", the follow-through is the differentiated value, how you deliver it, and proof [C23]. For a positioning-led landing page (opinion: the pitch order works as a page order when the buyer is comparing, not impulse-buying):

| Page section | Pitch step | From the brief |
|---|---|---|
| Hero | Insight: what the buyer must believe for our value to matter ("Customer service is a growth driver, not a cost center" [C23]) | The insight, said in the primary CEP's words (02), plus the category frame; the category word stays in the first screen (design-playbook-landing non-negotiable 2) |
| Section 2 | Alternatives and their limits, status quo first | Alternatives field |
| Section 3 | The perfect world: the criteria a good answer meets | Value, phrased as criteria the buyer agrees with |
| Section 4 | Our product as the answer, one criterion at a time | Unique attributes and the one true fact |
| Section 5 | Proof | Claims ledger rows marked yes |
| Before the ask | Objections (her pitch takes these from sales experience, not positioning) | Anxieties (02) |

Never list a perfect-world criterion the product does not meet; the page then argues against itself (opinion). Direct-response pages (awareness-led, one offer) take their order from copywriting and design-conversion instead.

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
| Deals lost to "no decision" (enterprise software) | 20 to 30 percent [C17] |
| Trends layered | 0 or 1 (opinion) |

## Ceiling: expert moves
1. **Run the swap test twice: on the words and on the first screen.** The onlyness sentence can pass while the hero section (headline, image, layout) is interchangeable with a competitor's. Swap names in the sentence; swap logos on the screenshot (06) (opinion).
2. **Translate onlyness into the fact, not the boast.** The public line is the evidence ("the only one that logs every roast" becomes "every bag shows its roast curve"). It survives CAP 3.7 and FTC review, it is more specific, and it gives art direction something to draw [C12][C13] (application is opinion).
3. **Choose the category for its default assumptions.** Calling an invoicing tool "accounting software" imports QuickBooks as the reference and its feature checklist; calling it "getting paid on time" imports a different comparison. Pick the frame where your strengths are the assumed criteria [C3] (example is opinion).
4. **Position against the status quo before the competitor.** "The first competitive alternative we need to beat is the status quo" [C4]; on the same page Dunford reports enterprise software companies "lose between 20% and 30% of deals" to "no decision" [C17]. That is about one deal in four lost to nobody; a hero that beats the spreadsheet wins deals a feature comparison never reaches (opinion).
5. **Keep difference in the words and distinctiveness in the look.** Do not ask a logo or a color to "communicate" the positioning; evidence shows weak perceived differentiation [C11] and shape associations are overridden by a headline that says something else (05, Jiang 2016). Assign the job: words differentiate, assets identify.
6. **When nothing is only, narrow the who or the where.** Neumeier's what, how, who, where, why, when lets a commodity win a specific audience in a specific place ("the only same-day denture repair in Tacoma") [C10]. If even that fails, say so in the brief (fix the company [C9]).
7. **Make the page argue in Dunford's order.** Most landing pages open on the product; a comparer needs the insight and the alternatives first, so the product arrives as the answer to criteria they already agreed with [C23]. The hero carries the insight, not the feature (opinion on the page mapping).
8. **A trend explains "why now", never "what we are".** Layer one only when the product's value rides it, keep the category frame you chose for its assumptions, and drop the trend before it dates the hero [C20][C21][C22] (opinion on the dating).

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
- Swap test on the first hero draft "Beautiful invoices in seconds": still true with each competitor's name in it, so the test fails. Rewrite: "Know when each client will actually pay." False with each competitor's name in it: the test passes.
- One true fact: the median days-late figure from the product's own data, with its scope and date, held in the claims ledger.

## Where this domain is usually wrong
1. **"Fill in the positioning statement."** Dunford calls the exercise as a method "not only pointless but potentially dangerous" because it assumes one answer per blank [C5]. Correction: components in order; the statement last.
2. **"Our competitors are the other vendors."** The first alternative to beat is the status quo [C4].
3. **"Customers see us as different."** Perceived differentiation is low across brands in many categories [C11] (contested by positioning practitioners). Correction: differentiate in words for the comparer, be distinctive in looks for everyone.
4. **"'Only' is just positioning language."** In public it is an objective claim: the ASA treated even "the perfect network" as objective in context [C14]; CAP 3.7 and the FTC require evidence held first [C12][C13].
5. **"A great position can be advertised into being."** Neumeier: "you can't advertise your way to onlyness" [C19]; if it is not true, fix the company [C9].
6. **"Ride the hot trend in the headline."** Dunford's advice is the reverse: trends are a careful last layer, and forcing one onto an unrelated product is her cautionary tale [C21][C22]. Correction: position first, add a trend only if the value genuinely rides it.

## Hand-offs
- website-strategy stage 4: the long method, tagline territory, what the position rules out.
- design-copy: hero line from the position and the moment; `claims_inventory.mjs` for numbers.
- design-conversion 02: proof beside the claim it proves.
- design-art-direction: the one true fact becomes the concept sentence.
- 05 (identity): distinctiveness, not differentiation, is the identity's job.
- website-strategy stage 4 step 3 argues for category design (Ramadan). For a design brief, choose a frame the buyer already uses and searches (design-search) unless the brief funds the education a new category needs; a coined category in the hero fails the five-second test (06) (opinion).
- Legal: substantiation rules differ by market (FTC in the US, ASA and CAP in the UK); for regulated claims (health, finance, environment) the client's lawyer decides (opinion).

## Sources
- Dunford, A., "An Introduction to Positioning", https://www.aprildunford.com/post/an-introduction-to-positioning; "A Quickstart Guide to Positioning", https://www.aprildunford.com/post/a-quickstart-guide-to-positioning; "Positioning and Competition", https://www.aprildunford.com/post/positioning-and-competition; "Positioning vs Strategy vs Vision", https://www.aprildunford.com/post/positioning-vs-strategy-vs-vision; "A Product Positioning Exercise", https://www.aprildunford.com/post/a-product-positioning-exercise; https://www.aprildunford.com/ (all accessed 2026-10-13).
- Dunford, A., "How to build a killer sales pitch", Lenny's Newsletter, https://www.lennysnewsletter.com/p/how-to-build-a-killer-sales-pitch; Obviously Awesome, Google Books record, https://books.google.com/books/about/Obviously_Awesome.html?id=UAKCwwEACAAJ; "Using Trends To Enhance Your Positioning", https://www.positioning.show/using-trends-to-enhance-your-positioning (all accessed 2026-10-13).
- Neumeier, M., The Onlyness Test, https://www.martyneumeier.com/the-onlyness-test; interview, https://www.peachpit.com/articles/article.aspx?p=2437847 (accessed 2026-10-13).
- Mall, D., "The Only-ness Statement", https://danmall.com/learn/the-business-of-design/onlyness (accessed 2026-10-13).
- Romaniuk, J., Sharp, B., Ehrenberg, A. (2007), "Evidence concerning the importance of perceived brand differentiation", Australasian Marketing Journal 15(2), https://www.sciencedirect.com/science/article/abs/pii/S1441358207700423 (accessed 2026-10-13).
- FTC Policy Statement Regarding Advertising Substantiation, https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation (accessed 2026-10-13).
- ASA, Substantiation (CAP Code rule 3.7), https://www.asa.org.uk/advice-online/substantiation.html (accessed 2026-10-13).
- Davon's skills: website-strategy `references/stage2-factsheet.md`, `stage4-positioning.md`.
