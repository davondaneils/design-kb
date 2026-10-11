# 06 Evidence and testing

What supports which practice, and how to read a published "X% lift". Sources: `kb/research/conversion/06-evidence-and-testing.md` and the claim tables in notes 01 to 05.

## Floor: fundamentals (non-negotiable)
1. **Label every recommendation** as evidence (tier and source) or opinion, in the hand-over and in the skill. [judged]
2. **No dark patterns**: fake urgency or countdowns, false scarcity, sneaking items or preticked add-ons into the cart, hidden or drip-fed costs, hard cancellation, confirmshaming, fake reviews. They are measured at scale (C26), named by the FTC (C25, C24) and banned outright in several places (C28, C29). [judged; the conversion audit flags urgency phrases]
3. **Never cite a lift without its sample and source.** "A red button lifted conversion 21%" with no sample size is a rumor. [judged]

## Evidence ladder
| Tier | What | Use it as |
|---|---|---|
| 1 | Law, WCAG, platform rules (FTC rules, state ARLs, UK DMCC, Apple guidelines) | Must |
| 2 | Large benchmarks with stated method (Baymard 70.22% average from 50 studies, field counts across benchmarked sites) | Strong default |
| 3 | Lab usability and eye tracking (NN/g), peer-reviewed behavioral research (Spiegel, JCR, JMR) | Default; check the context matches |
| 4 | Controlled experiments at scale, reported by the team that ran them (Kohavi et al.; Stripe holdbacks, noting vendor interest) | Size estimates, direction |
| 5 | Case studies, agency lifts, listicles, "growth" threads | Leads to test, never support |

## What the evidence supports (short list)
| Practice | Evidence | Tier |
|---|---|---|
| Show total cost early, including shipping | C2, C6, C12; DMCC C29 | 1, 2 |
| Guest checkout, defer accounts | C3, C11 | 2 |
| Fewer fields (8 vs 11.3) | C9, C10 | 2 |
| Inline validation on blur | C13, C14 | 2, 4 |
| Specific CTA labels | C17 | 3 |
| Primary in the first screen | C16 | 3 |
| Reviews with counts, distributions, negatives visible | C20, C21, C22 | 2, 3 |
| Ratings under 5.0 convert better than 5.0 | C20 | 3 |
| Encapsulated card fields, seal at payment | C23 | 2 |
| Express pay | C44 | 4 (vendor) |
| Defaults shape choice | C40 | 3 |
| Decoy tiers | weak outside numeric lab tasks, C38 | 3 (against) |
| Charm pricing | only across a left digit, C39 | 3 (narrow) |
| Button color | no tier 1 to 4 support found | 5 |
| Sticky CTAs, "Most popular" badges, per-cup reframing | no tier 1 to 4 source found | opinion |

## Reading a test claim
1. **Base rate.** About one in three ideas improves its target metric at Microsoft (C41); at Booking, Google Ads and Netflix the success rate is nearer 10% (C42). A claimed winner is more likely a false positive than the vendor implies.
2. **Twyman's law.** "Any figure that looks interesting or different is usually wrong" (C42). Lifts over about 20% from a cosmetic change deserve suspicion before celebration (opinion on the threshold).
3. **Power.** 80 users per variant gives about 3% power to detect a 10% change (C42). Ask for the sample size and the minimum detectable effect; no number, no claim.
4. **False positive risk.** At a 10% success rate, p < 0.05 two-tailed and 80% power, about 22% of "significant" wins are false (C42). At lower power it is worse: more than half at 20% power.
5. **Transfer.** A result on a discount retailer does not transfer to a premium brand or a B2B SaaS page without a reason it should (opinion).
6. **Exceptions exist.** A Bing headline change raised revenue 12% (C43); it took Bing's traffic to find it.

## When to test vs ship
- Ship without testing: anything on the floor (law, WCAG, correct numbers, visible totals, guest checkout). These are not hypotheses.
- Test: copy angle, which proof to lead with, plan packaging, default cadence, when to show an upgrade notice. Only with enough traffic for 80% power at a realistic effect (2 to 5%); otherwise decide on the evidence ladder and say so.

## Dark patterns and honest swaps
| Dark pattern | Honest equivalent |
|---|---|
| Fake countdown timer | Real cutoff stated once: "Order by 2pm Monday to get Tuesday's roast" |
| "Only 3 left" on a restocking item | Real scarcity only: "60 bags this season, 12 left" if true and live |
| Preticked add-on | Unticked add-on with its price |
| Renewal in a footnote | Term line beside the button (03) |
| Cancel by phone only | Cancel online in the same place you subscribed (C28) |
| "No thanks, I hate saving money" | "No thanks" |
| Hidden shipping until payment | Shipping on the product card (C12) |

## Signature moves
1. **The evidence tag in the hand-over.** Every conversion change in the hand-over carries [law], [benchmark], [lab], [experiment], or [opinion]. Clients trust the designer who says which is which.
2. **Kill the button-color debate with base rates.** Point to C41 and C42; spend the test budget on the price block and the proof.
3. **Real scarcity, set calmly.** The coffee page's "Lot 0412 · 60 bags this season" is true scarcity stated as a fact, not a timer. If the count is live, show it; if not, do not imply it.

## Hand-offs
- Measurement setup and analytics events: design-search 06. Funnel metrics and offer tests: sales-funnels.
