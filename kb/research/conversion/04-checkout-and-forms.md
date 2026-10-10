# Research: 04 Checkout, sign-up and forms

Researcher, 2026-10-10. Method as in note 01.

## Key findings
1. Baseline: average documented cart abandonment 70.22% across 50 studies (C1). Reasons (excluding "just browsing"): extra costs 40%, card trust 19%, forced account 18%, too long or complicated 17%, returns 13%, total not visible 12% (C2 to C7).
2. Upside: Baymard estimates a 35.26% conversion gain for the average large site from fixing documented checkout usability issues (C8). This is Baymard's model, not a measured experiment; cite as an estimate.
3. Field budget: average checkout 11.3 fields in 2024 (11.8 in 2021, 12.7 in 2019); most sites need only 8 (C9, C10). Common waste: 89% have more than one name field; 75% show Address Line 2 open; 35% show the coupon field open; 24% show billing address fields instead of hiding them; 84% do not delay account creation (C11).
4. Inline validation: 31% of sites have none; never validate before the user has finished (on blur, or once the input reaches its full length) (C13). Wroblewski's 2009 test (22 participants): best inline variant vs control, success +22%, errors -22%, satisfaction +31%, completion time -42% (C14). Small sample; direction agrees with Baymard.
5. Form layout: single column, labels above, no placeholder labels, at most one or two optional fields marked optional, specific visible errors that keep the input (C15, C33).
6. Standards: 1.3.5 Identify Input Purpose AA (autocomplete tokens) (C32); 3.3.7 Redundant Entry A (no re-typing within a process) (C30); 3.3.8 Accessible Authentication AA (allow paste and password managers) (C31).
7. web.dev (Google): use autocomplete values; a single name field; `inputmode="numeric"` with `type="text"` for card numbers; show full order details (C33).
8. Express pay: Stripe's holdback test reports Apple Pay where offered +22.3% conversion and +22.5% revenue; adding one relevant non-card method +7.4% conversion, +12% revenue (C44). Vendor data, statistically significant by its own report, sample not published. Tier: vendor measurement, treat as direction and size estimate, not fact.

## Numbers
- 70.22% (C1); 40 / 19 / 18 / 17 / 13 / 12% (C2 to C7); 35.26% estimate (C8).
- 11.3 fields average, 8 needed (C9, C10).
- 31% no inline validation (C13); +22% / -42% (C14).
- +22.3% Apple Pay (C44).

## Conflicting views
- One page vs multi-step checkout: no current tier 1 to 3 source found in this pass. Baymard's position (paywalled) is that step count matters less than field count. Opinion here: one page for a single-item subscription; steps when shipping options branch.

## Claim table
| ID | Claim | Quote | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| C1 | Average abandonment | "70.22% – average documented online shopping cart abandonment rate" | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C3 | Forced account | "The site wanted me to create an account" (18%) | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C4 | Too long | "Too long / complicated checkout process" (17%) | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C5 | Card trust | "I didn't trust the site with my credit card information" (19%) | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C7 | Returns policy | "Returns policy wasn't satisfactory" (13%) | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C8 | Checkout design gain (estimate) | "the average large-sized ecommerce site can gain a 35.26% increase in conversion rate though better checkout design" | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | estimate |
| C9 | Average field count | "the average in 2024 was 11.3 form fields" | https://baymard.com/blog/checkout-flow-average-form-fields | 2026-10-10 | 3 | consensus |
| C10 | Fields needed | "most sites need only 8 form fields in total for a checkout flow" | https://baymard.com/blog/checkout-flow-average-form-fields | 2026-10-10 | 3 | consensus |
| C11 | Common field waste | "89% of sites in our e-commerce UX benchmark have more than one 'name' field." | https://baymard.com/blog/checkout-flow-average-form-fields | 2026-10-10 | 3 | consensus |
| C13 | Inline validation timing | "31% of sites don't have any inline validation at all" | https://baymard.com/blog/inline-form-validation | 2026-10-10 | 3 | consensus |
| C14 | Inline validation lab result | 22% success increase, 42% completion time decrease, 22 participants (figures as reported) | https://alistapart.com/article/inline-validation-in-web-forms/ | 2026-10-10 | 4 (study with data) | small sample |
| C15 | Form usability | "Multiple columns interrupt the vertical momentum of moving down the form." ; "placeholder text causes many usability problems, and is best avoided." | https://www.nngroup.com/articles/web-form-design/ | 2026-10-10 | 3 | consensus |
| C30 | WCAG 3.3.7 | "auto-populated, or" "available for the user to select." | https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html | 2026-10-10 | 1 | standard |
| C31 | WCAG 3.3.8 | "support for password entry by password managers to reduce memory need" | https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html | 2026-10-10 | 1 | standard |
| C32 | WCAG 1.3.5 | "The purpose of each input field collecting information about the user can be programmatically determined" | https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html | 2026-10-10 | 1 | standard |
| C33 | web.dev payment forms | "Using a single name input makes forms less complex, enables cut-and-paste, and makes autofill simpler." | https://web.dev/articles/payment-and-address-form-best-practices | 2026-10-10 | 1 | standard (Google) |
| C44 | Express pay lift (vendor) | "global businesses that offered Apple Pay saw an average 22.3% increase in conversion" | https://stripe.com/blog/testing-the-conversion-impact-of-50-plus-global-payment-methods | 2026-10-10 | 2 (exemplar, vendor data) | vendor |
