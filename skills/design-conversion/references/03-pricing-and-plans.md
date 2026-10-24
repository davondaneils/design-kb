# 03 Pricing and plan presentation

How to set a price, a choice and its terms so the right choice is easy and nothing is hidden. Sources: `kb/research/conversion/03-pricing-and-plans.md`; derived numbers `scripts/price-math.mjs`.

## Floor: fundamentals (non-negotiable)
1. **Every number is correct.** Recompute every saving, total and per-unit figure before hand-over and keep the script. The combined coffee page claimed "15% under shop price" for $18 against $21; that is 14.29%. [judged]
2. **Total cost before commitment.** Shipping, tax treatment and mandatory fees are visible on the price block or product card, not discovered at payment (C2: 40% abandon on extra costs; C6; C12; UK DMCC Act from 6 April 2025, C29). [judged]
3. **Subscription terms at the point of consent, in body size.** Price, cadence, when the next charge happens, and how to cancel, beside the button. California requires express affirmative consent to the auto-renewal (C28); ROSCA still applies after the federal click-to-cancel rule was vacated (C27). [judged]
4. **Show prices.** If exact prices depend on usage, show the included allowance and the rate, or representative cases (C34, C46). "Contact us" is for the enterprise column only. [judged]
5. **Prices are set as numbers**: tabular figures, real currency and unit characters, a narrow no-break space before units (design-typography 05). [lint: tabular warning]
6. **The recommended option is preselected only if it is the honest best fit for most buyers**, and the reason is stated. Preticked add-ons are not recommendations (dark pattern, C26). [judged]

## Principles
- The price block is a sentence: amount, unit, what is included, how often, when you are charged, how to stop. If any part is missing the visitor finishes the sentence with a worse guess.
- Defaults are strong and honest; decoys are weak and manipulative. Use defaults (C40), skip decoys (C38).
- Show the price that will be charged, with its period. A per-month figure for an annual plan always carries "billed yearly" and the yearly total.

## Decision rules
| If | Then |
|---|---|
| One product, two or three cadences or sizes | Radio cards (native radios, visible labels), one preselected with a reason; the price block updates live |
| Three or more plans | Plan cards, at most 4 columns plus enterprise; a comparison table below for 5 offerings or fewer (C35); sticky column headers |
| Annual and monthly | Toggle that defaults to the cadence most buyers choose; show "billed yearly" and the yearly total under the per-month price; state the saving in currency |
| A saving under about $10 or under 20% | State it in currency ("$3 less a bag"), not percent (opinion: small percents feel like a coupon) |
| A strike-through price | Only if the higher price is the real current price elsewhere on the site, adjacent, and the reason is stated ("shop price"). Never an invented "was" price (FTC deceptive pricing guides; this pass did not fetch them, so treat as opinion until cited) |
| Shipping varies | Show the flat lowest rate or the free threshold on the card ("Free shipping over $40") (C12) |
| Charm pricing ($17.99) on a premium brand | Use whole numbers; the left-digit effect only works across a left digit (C39), and .99 reads discount (opinion) |
| A free trial | Say beside the trial CTA whether a card is needed. If it is: "Free until Nov 1, then $20 a month. Cancel before then and you pay nothing." The same disclosure Apple requires for trials (C37b) and California requires for auto-renewal consent (C28) |
| The buyer cannot see the total until checkout | Fix the page, not the checkout |

## Price block anatomy (top to bottom)
1. Choice controls (cadence, quantity), if any.
2. Amount, large, tabular: `$18`, currency smaller and raised, unit beside it ("a bag").
3. What is included, one line: "340 g, shipping included."
4. Term line: "Every 2 weeks. Next charge Oct 30. Skip, pause or cancel online any time."
5. Comparison, one line, currency: "$3 less than a single bag, and no $6 shipping."
6. Proof (02), then CTA, then guarantee.

## Numbers
- Price numeral: `--text-numeral` or `--text-5xl`; currency at about 40% of the numeral; unit at `--text-lg`.
- Term line at `--text-sm` or `--text-base`, `--color-text` (not muted below 4.5:1 and not a footnote). Opinion: muted is fine for the comparison line, never for the renewal line.
- Plans: 3 to 4 columns (C35 says static tables work up to 5).
- Per-unit maths for coffee: 20 cups a bag at 17 g; $0.90 a cup subscribed (script).

## Ceiling: exemplar patterns
- Linear: "$10 per user/month" with "Billed yearly" on the next line (C45).
- Raycast: monthly and annual listed together ($10 a month, $96 a year), no "Most popular" badge (C48).
- Vercel: "Popular" badge on Pro; usage as "1M / month included" then "Starting at $0.40 per 1M"; "All prices shown are in USD and exclude value-added tax" (C46).
- Stripe: one price line, "2.9% + 30¢", for the self-serve case (C47).
- Apple: monthly figure first ("from only $108.25 per month") with interest-free financing stated (C49).

## Signature moves
1. **The term line in the button's shadow.** One sentence in body size, directly above or below the CTA, naming next charge date and the cancel path. It is the line law requires (C28) and the line that removes the last doubt. Most templates bury it in a footnote.
2. **Default with a reason.** "Every 2 weeks, recommended: a 340 g bag lasts about 2 weeks at about a cup and a half a day." A default plus a reason is a recommendation; a default alone is a trick.
3. **Currency, not percent, for small savings.** "$3 less a bag, shipping included" against a $21 + $6 one-off is concrete; "14% off" is a coupon.
4. **Per-use price as the second number, never the first.** "About $0.90 a cup" under $18 a bag. Opinion: as a lead it reads as a pitch; as a footnote it reframes calmly.
5. **No decoy tier.** If a plan exists only to make another look good, delete it. Decoy effects rarely survive real product experience (C38); the reputational cost when buyers notice is real (opinion).
6. **The live summary.** Every control in the price block updates one summary sentence and the CTA's adjacent term line in place, without layout shift (reserve the line's height).
7. **The price stays beside the longest read.** On a long sales page the price sentence and the one primary sit in the sticky column of the pinned section (under the figure and its counter, over a hairline), so the deal is on screen through the 2,000 to 3,000px where the buyer is deciding, without a second filled button on the same screen (Apple MacBook Air: price and Buy in the first screen; Stand Firm v4: "$27 until Nov 30, then $37" beside the plan, 2026-10-24).

## Do and don't
| Do | Don't |
|---|---|
| "$18 a bag, shipping included. Every 2 weeks; next charge Oct 30." | "$18*" with "*Auto-renews" in 12px grey |
| "$10 per user a month, billed yearly ($120)" | "$10/mo" alone for an annual plan |
| Preselect the honest best fit, say why | Preselect the most expensive, say "Most popular" without data |
| "Free shipping over $40" on the product card | Shipping revealed at the payment step |

## Worked example: coffee subscription band
Before: "$18", "A bag, shipping included. 15% under shop price. Your first bag ships this Friday." and "Start my subscription". After: radio cards "Every 2 weeks (recommended: a bag lasts about two weeks at about a cup and a half a day)" and "Every 4 weeks"; quantity 1 or 2 bags; price block "$18 a bag, 340 g, shipping included"; comparison "$3 less than a single bag, and no $6 shipping"; term line "Charged $18 every 2 weeks from Friday, Oct 16. Skip, pause or cancel online any time before a bag ships."; CTA "Start a subscription".

## Hand-offs
- What to charge and offer structure: sales-funnels, website-strategy. Dense plan comparison tables: design-product-ui 01. Price typography: design-typography 05.
