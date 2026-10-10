---
name: design-conversion
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing for pricing, product, subscription and checkout sections; design-playbook-dashboard for upgrade, trial and usage-limit prompts); do not trigger on its own for a page, screen or brand job. Covers the design side of conversion on premium sites and SaaS products - CTA hierarchy and placement, proof and trust (ratings, reviews, logos, guarantees, payment security cues) without looking cheap, price blocks and plan presentation, subscription terms at consent, checkout and sign-up friction and form field budgets, in-product upgrade prompts, and which practices Baymard, NN/g, standards, regulators and published A/B tests actually support. Includes an advisory audit script. Funnel strategy goes to sales-funnels; direct response copy to copywriting. Load it directly only when the user names it or asks a narrow conversion design question ("why is nobody subscribing", "review our pricing section", "fix our checkout form").
---

# design-conversion

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill, after layout, type, color and art direction are set and before design-polish. Token names and values: `kb/FOUNDATIONS.md`. Accessibility floor: design-foundations `references/accessibility.md`. General form mechanics: design-ux `references/03-forms.md` (this skill adds only what is specific to conversion).

Conversion design on a premium site is removing doubt at the moment of decision, not adding pressure. Every rule below answers one question a careful buyer asks just before they click: what exactly happens, what does it cost in total, can I trust it, and how do I get out. The brand's restraint is part of the offer; pressure tactics spend it.

**Reuse, do not duplicate:** funnel architecture, offer stacks, upsells and order bumps: **sales-funnels**. Long-form persuasive copy for sales pages, VSLs, ads: **copywriting**. Positioning and what the offer is: **website-strategy**. Premium and UI copy: **design-copy**.

## 1. Fundamentals (non-negotiable, check first)
One miss fails the page, however good the rest is. Evidence tags: [law], [standard], [benchmark] (Baymard), [lab] (NN/g, peer-reviewed), [experiment], [opinion].

1. **Every number is correct.** Recompute every saving, total, per-unit price and date before hand-over; keep the script. The combined coffee page said "15% under shop price" for $18 vs $21 (14.29%): it passed every lint and both reviews. [judged]
2. **One filled primary per screen**, one verb per action everywhere it appears, label naming the next step ("Start a subscription", not "Get started") [lab: NN/g]. The primary is in the first screen at 390 and 1440 [lab: 57% of viewing time above the fold]. [judged; audit `primary-per-screen`, `cta-label`]
3. **Total cost before commitment.** Shipping (or the free threshold), tax treatment and mandatory fees on the price block and the product card [benchmark: 40% abandon over extra costs, 12% over not seeing the total, 64% look for shipping on the product page] [law: UK DMCC drip pricing ban from 6 April 2025]. [judged; audit `cart-shipping`]
4. **Subscription terms at the point of consent, in body size, beside the button**: amount, cadence, next charge date, how to cancel online [law: California ARL express affirmative consent, July 2025; ROSCA]. Never a 12px grey footnote. [judged; audit `sub-terms`]
5. **Proof is real, attributable, and a rating shows its count** ("4.7 from 1,284 reviews") [law: FTC fake reviews rule, 2024] [benchmark: averages without counts are distrusted]. [judged; audit `rating-count`]
6. **Forms**: visible labels, `autocomplete` tokens on personal fields [standard: WCAG 1.3.5], nothing asked twice [3.3.7], paste and password managers allowed [3.3.8], card fields `type="text" inputmode="numeric"`, guest checkout with the account offered after payment [benchmark: 18% abandon over forced accounts]. [judged; audit `form-label`, `autocomplete`, `card-number-type`, `paste-block`]
7. **The pay button states the amount**, and the total plus term line sit beside it at every width. [judged; audit `pay-total`]
8. **No dark patterns**: fake countdowns or scarcity, preticked add-ons, drip-fed costs, hard cancellation, confirmshaming, fake reviews [lab: 1,818 instances on 11K shopping sites] [law: FTC, state ARLs, DMCC]. [judged; audit `preticked`, `urgency`]
9. **In product, no modal for something unrelated to the user's goal**; upgrade prompts are secondary, numeric and role-aware [lab: NN/g modal dialogs] [standard: Apple 3.1.2(c), describe what the price buys]. [judged]
10. **Label every recommendation** in the hand-over as evidence (tier, source) or opinion. [judged]

## 2. Principles
- **Doubt, then proof, then action**: map the buyer's doubts at the decision point and answer each one where it arises, in that order on the page.
- **The price block is a sentence**: amount, unit, what is included, how often, when charged, how to stop. A missing part gets filled with a worse guess.
- **Defaults over decoys.** Default effects replicate [lab]; decoy tiers mostly vanish once people experience the product [lab: Frederick, Lee and Baskin 2014].
- **First-party proof over borrowed badges.** Specific facts only this company could state (lot number, roast date, price paid, uptime) are the premium proof. Badges belong at the card field only [benchmark: perceived security]. (Opinion on the "cheap" half.)
- **Base rates before button colors.** About a third of ideas move their metric at Microsoft, nearer 10% elsewhere; at a 10% success rate about 22% of "significant" wins are false [experiment: Kohavi et al.]. Spend effort on the price block, proof and checkout, not on hue.

## 3. Decision rules
| If | Then | Ref |
|---|---|---|
| The CTA commits money or a renewal | Term line (amount, cadence, next charge, cancel) in body size directly beside it | 03 |
| A big commitment is the primary | Pair it with a smaller outlined path (one bag, monthly, tour) | 01 |
| A long landing page | Repeat the primary only after the price and after the main proof | 01 |
| A choice of cadence, size or plan | Native radio cards, honest best fit preselected with a stated reason; one live summary line updates | 03 |
| Annual and monthly prices | Per-month figure with "billed yearly" and the yearly total; saving in currency | 03 |
| A saving under about $10 or 20% | Currency ("$3 less a bag"), not percent (opinion) | 03 |
| Ratings exist | Average, count, five-bar distribution (hide at 5 or fewer reviews), one mixed review with the reply | 02 |
| A guarantee | One sentence under the CTA: mechanism, time, who acts. No seal | 02 |
| Card fields | One encapsulated block on its own surface, lock icon, processor name | 04 |
| Checkout fields | Budget of about 8: email, full name, street, city, postal code, card number, expiry, CVC; line 2, coupon and billing collapsed | 04 |
| Payment methods | Express pay row first, "or pay with card" below | 04 |
| A SaaS limit approaches | Meter in numbers, projection date, consequence and what is kept; inline, dismissible; never a modal on load | 05 |
| A member without billing rights hits a limit | Name the admin and offer "Ask"; no buy button | 05 |
| Someone cites "X% lift" | Ask sample size, power, base rate; under-powered or surprising means unproven | 06 |

## 4. Expert layer (signature moves)
1. **The term line in the button's shadow.** "Charged $18 every 2 weeks from Friday, Oct 16. Skip, pause or cancel online any time." One sentence, body size, beside the CTA. It is what the law asks for and what the buyer needed; templates bury it. Raycast does the same with its requirement line under the one button (measured, C54).
2. **The buy panel.** Price sentence and the only primary share one quiet panel in the first screen at 390 and 1440 ("Subscribe from $18 a bag, shipping included" beside "Start a subscription"), as on Apple's product pages (measured, C51). No pricing section needed to answer "what does it cost?".
3. **Same label, live summary.** The button label never changes ("Start a subscription"); the summary line above it restates the current choice and updates in place, reserved height, `aria-live="polite"`.
4. **Proof with a denominator, and the 3-star review.** Count plus distribution, then one mixed review naming a real trade-off with the company's one-line reply. 53% of users seek negatives [benchmark]; 4.0 to 4.7 outsells 5.0 [lab].
5. **Proof made of your own data, next to the CTA.** "Your first bag: lot 0412, roasted Tuesday." Uncopyable, specific, calm.
6. **Pay button restates the deal.** "Pay $18 and subscribe" under the term line, so click and consent read as one.
7. **Defer every question that can wait.** Grind, brew method, delivery day: ask on the confirmation screen with defaults applied. Each moved question is a field the buyer does not pay for.
8. **Meter before wall.** In product, usage is visible in numbers long before it matters; the warning projects a date and says what is kept.
9. **Evidence tags in the hand-over.** Each conversion change carries [law], [benchmark], [lab], [experiment] or [opinion]. It is how a premium client tells a designer from a growth hacker.

## 5. What reads as cheap (opinion; say so when advising)
Payment and SSL logos in the hero or nav; "As seen in" walls; countdowns and "only 3 left" (also dark patterns when false); 5.0 averages and round "10,000+ happy customers"; testimonials without surnames or places; strike-through "was" prices that were never charged; .99 endings on a premium brand; a filled button in every card.

## 6. Assets
`assets/conversion-audit.mjs`: advisory checks beside `tools/lint.mjs` (needs `npm ci` in `tools/`).
```
node skills/design-conversion/assets/conversion-audit.mjs page.html [--json out.json]
node skills/design-conversion/assets/conversion-audit.mjs "page.html?state=checkout"
```
Checks: primary-per-screen, cta-label, form-label, autocomplete, card-number-type, paste-block, preticked, sub-terms, pay-total, rating-count, cart-shipping, urgency. Exit 1 on any fail. It cannot check that numbers are right, that proof is real, or that the term line is visible enough; those stay judged.

## 7. Reference map
| Need | Read |
|---|---|
| How many actions, emphasis, placement, labels, sticky CTAs | `references/01-cta-hierarchy.md` |
| Ratings, reviews, logos, numbers, guarantees, security cues; what looks cheap | `references/02-proof-and-trust.md` |
| Price blocks, plan cards, cadence choice, annual toggles, savings math, legal floor | `references/03-pricing-and-plans.md` |
| Checkout and sign-up order, field budget, payment block, summary, express pay | `references/04-checkout-and-forms.md` |
| SaaS upgrade, trial and usage-limit prompts | `references/05-in-product-upgrades.md` |
| Evidence ladder, what is supported, reading A/B claims, dark patterns and honest swaps | `references/06-evidence-and-testing.md` |

Sources and claim tables: `kb/research/conversion/` in the design-kb repo. Test pages: `kb/tests/design-conversion/`.
