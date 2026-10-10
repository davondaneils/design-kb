# Research: 03 Pricing and plan presentation

Researcher, 2026-10-10. Method as in note 01. Derived numbers: `scripts/price-math.mjs`.

## Key findings
1. Hidden and late costs are the top abandonment reason: 40% extra costs too high, 12% could not see or calculate the total up front (C2, C6). 64% of users looked for shipping on the product page; 43% of sites showed none (C12).
2. Hiding prices loses the shortlist: missing prices were "the #1 Web design mistake of 2002" on B2B sites; if exact prices are impractical, show representative cases (C34).
3. Law now requires totals and subscription terms up front in key markets:
   - UK DMCC Act: from 6 April 2025 headline prices must include mandatory fees; delivery that cannot be calculated must be flagged (C29).
   - US: the FTC click-to-cancel rule was vacated on July 8, 2025, but ROSCA and state auto-renewal laws still apply; more than half of states have them (C27). California, for contracts from July 1, 2025: express affirmative consent to the auto-renewal, annual reminders, and a "click to cancel" link if a save offer is shown during cancellation (C28).
   - Apps: describe what the user gets for the price before asking them to subscribe (C37).
4. Decoys are weaker than their fame: the attraction effect "do[es] not typically occur when consumers experience the product" and may be limited to all-numeric descriptions (C38). Defaults are robust: Johnson and Goldstein's default effect replicated (C40).
5. Charm prices work only across a left digit: the left-digit effect appears when the leftmost digits differ ($2.99 vs $3.00) (C39). $18 vs $17.99 changes nothing a premium buyer notices except tone (opinion).
6. Comparison tables: static tables suit 5 offerings or fewer; keep headers fixed; let users show only differences (C35).
7. Exemplars: Linear shows per-user monthly price with "Billed yearly" beneath (C45); Raycast lists monthly and annual side by side ($10 a month, $96 a year) with no "Most popular" badge (C48); Vercel marks Pro "Popular", lists usage as included allowance then rate, and states prices exclude tax (C46); Stripe is one line, "2.9% + 30¢" (C47).

## Derived numbers (coffee test page)
- $18 subscription vs $21 shop: $3 a bag, 14.29% off. The baseline page says "15% under shop price": wrong.
- Against one-off with $6 shipping ($27): $9 a bag, 33.33%.
- 340 g at 17 g a cup: 20 cups; $0.90 a cup subscribed.
- Every 2 weeks: 26 bags, $468 a year; every 4 weeks: 13 bags, $234 a year.

## Conflicting views
- "Most popular" badges: Vercel uses one, Raycast and Linear (in the text read) do not. No tier 1 to 3 evidence either way found; opinion.
- Annual-first vs monthly-first headline price: no independent evidence found; exemplars differ. Opinion: show the price that will be charged, with the period.

## Claim table
| ID | Claim | Quote | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| C2 | Extra costs top reason | "Extra costs too high (shipping, tax, fees)" (40%) | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C6 | Total not visible | "I couldn't see / calculate total order cost up-front" (12%) | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C12 | Shipping looked for on product page | "64% of users looked for shipping costs on the product page, before deciding to add a product to the cart." | https://baymard.com/blog/show-shipping-costs-on-product-pages | 2026-10-10 | 3 | consensus |
| C27 | Click-to-cancel vacated; ROSCA and state laws remain | "On July 8, 2025, the U.S. Court of Appeals for the Eighth Circuit vacated the Federal Trade Commission's "Click-to-Cancel" Rule." | https://www.gtlaw.com/en/insights/2025/7/eighth-circuit-vacates-ftcs-click-to-cancel-rule | 2026-10-10 | 1 (law, via law firm) | law |
| C28 | California ARL amendments | "express affirmative consent to the automatic renewal or continuous service offer" | https://ktslaw.com/insights/alert/2024/10/california-latest-automatic-renewal-law-amendments-take-effect-in-july-2025 | 2026-10-10 | 1 (law, via law firm) | law |
| C29 | UK drip pricing ban | "Since the 6th April 2025" ; "sums that are unavoidable to purchase, receive or use the product" | https://www.boyesturner.com/insights/drip-pricing-ban-new-rules-now-force | 2026-10-10 | 1 (law, via law firm) | law |
| C34 | Show prices | "the lack of prices on many B2B sites was the #1 Web design mistake of 2002" | https://www.nngroup.com/articles/show-prices-for-common-scenarios/ | 2026-10-10 | 3 | consensus |
| C35 | Comparison tables | "A good rule of thumb is to take this approach if you have 5 offerings or fewer." ; "Keep column headers fixed as users scroll." | https://www.nngroup.com/articles/comparison-tables/ | 2026-10-10 | 3 | consensus |
| C37 | Describe what the price buys | "Before asking a customer to subscribe, you should clearly describe what the user will get for the price." | https://developer.apple.com/app-store/review/guidelines/ | 2026-10-10 | 1 | standard |
| C38 | Decoy limits | "Such effects do not typically occur when consumers experience the product" | https://marketing.wharton.upenn.edu/wp-content/uploads/2016/10/The-Limits-of-Attraction.pdf | 2026-10-10 | 3 | contested (decoy literature) |
| C39 | Left-digit effect only across a left digit | "occurs only when the leftmost digits of the prices differ" | https://ideas.repec.org/a/oup/jconrs/v32y2005i1p54-64.html | 2026-10-10 | 3 | consensus |
| C40 | Default effect replicated | "We successfully replicated Johnson and Goldstein (2003)." | https://forrt.org/flora-replication-atlas/doi/10.1126/science.1091721/ | 2026-10-10 | 3 | consensus |
| C48 | Raycast pricing: monthly and annual listed, no popular badge | "$10 / month" ; "$96 / year" ; "Monthly Subscription" | https://www.raycast.com/pricing | 2026-10-10 | 2 (text only) | measured |
