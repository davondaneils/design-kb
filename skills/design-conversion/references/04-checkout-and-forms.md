# 04 Checkout, sign-up and forms for conversion

What a checkout or sign-up needs, in what order, with how few fields. General form rules (labels, error text, validation states) live in design-ux `references/03-forms.md`; this chapter adds only what is specific to conversion. Sources: `kb/research/conversion/04-checkout-and-forms.md`.

## Floor: fundamentals (non-negotiable)
1. **Visible label on every field**; placeholder is an example, never the label (C15, C33). [lint: axe label rules] [judged]
2. **`autocomplete` token on every personal field** (`email`, `name`, `street-address` or `address-line1`, `postal-code`, `cc-number`, `cc-exp`, `cc-csc`, `tel`) (WCAG 1.3.5 AA, C32). [judged; the conversion audit checks it]
3. **Never ask twice.** Billing defaults to "same as delivery"; data from a previous step is prefilled (WCAG 3.3.7 A, C30). [judged]
4. **Paste and password managers allowed** on every field, including card and one-time codes (WCAG 3.3.8 AA, C31). [judged]
5. **Guest checkout.** Account creation is offered after payment, from the data already given (C3: 18% abandon over forced accounts; C11: 84% of sites do not delay it). [judged]
6. **Errors on blur, not on keystroke**, in text plus icon, input kept (C13, design-ux 03). [judged]
7. **The total and the term are visible beside the pay button** at every width, not only in a summary that scrolls away at 390. [judged]
8. **Card numbers**: `type="text"` with `inputmode="numeric"`, never `type="number"` (C33). [judged]

## Principles
- Every field is a cost the visitor pays before they get anything. Cut, merge, defer, or prefill before you style.
- The order follows effort: the cheapest commitment first (express pay, email), the costliest last (card).
- Trust at the card is a design problem even when security is perfect (C23).

## Field budget
Baymard: average 11.3 in 2024 (11.8 in 2021, 12.7 in 2019), most checkouts need 8 (C9, C10).
| Field | Rule |
|---|---|
| Email | Required, first. Used for receipt and account later |
| Full name | One field (C33; 89% of sites split it, C11) |
| Address | One street line; "Apartment, suite (optional)" collapsed behind a link (75% of sites show it open, C11); city, postal code; country as a select defaulted by locale |
| Phone | Only if the carrier needs it; mark optional and say why |
| Billing address | Hidden behind a checked "Same as delivery" box (24% of sites show it, C11) |
| Coupon | Collapsed "Have a code?" link near the total (35% show it open, C11) |
| Card | Number, expiry, CVC in one encapsulated block |
| Account | Not a field. After payment: "Save your details for next time? Set a password." |

That is 7 to 8 visible fields for a delivered subscription: email, name, street, city, postal code, card number, expiry, CVC (country preset).

## Order
1. Express pay row (Apple Pay, Google Pay, Shop Pay, Link as the market supports) above everything, with "or pay with card" divider. Stripe's holdback test: Apple Pay +22.3% conversion where offered (C44, vendor data).
2. Contact (email).
3. Delivery.
4. Payment (encapsulated block).
5. Summary and pay button: line items, shipping, tax, total, term line, button with the amount.

One page for a single product or subscription; a stepped flow when shipping methods branch (opinion; no current tier 1 to 3 source either way).

## Numbers
- Field height 48px, label `--text-sm` 600 above with `--space-3` gap, field gap `--space-5` (16) within a group, `--space-7` (32) between groups.
- Single column, max about 480px for the form column (C15). On 1024 and up, the summary sits in a second column, sticky; at 390 it collapses to a one-line total bar that expands, and the pay button repeats the total.
- Pay button: full width of the form column, `min-height: 56px`, label "Pay $18 and subscribe" (amount in label).

## Ceiling: exemplar patterns
- Apple's buy pages state financing, delivery fee and returns before checkout (C49), so checkout holds no surprises.
- Stripe Checkout (the product) puts express pay first, then email, then card with the processor's own trust surface; the vendor reports conversion gains from payment-method coverage (C44).

## Signature moves
1. **Pay button restates the deal.** "Pay $18 and subscribe" with the term line directly above: "Then $18 every 2 weeks. Cancel online any time." The click and the consent read as one. Satisfies the express-consent intent (C28) without a pre-ticked box.
2. **Encapsulated card block.** Card fields share one bordered group on `--color-surface-sunken` with a lock icon and "Payments by [processor]". Unique to the card fields, as Baymard specifies ("distinct and unique") (C23).
3. **Optional is the exception you name.** Mark the one or two optional fields "(optional)"; mark nothing as required with asterisks when everything else is required (C15).
4. **The summary never leaves.** On phones a sticky one-line "Total $18, every 2 weeks" bar opens the full summary; the pay button repeats the amount.
5. **Defer every question that can wait.** Grind preference, brew method and delivery day can be asked on the confirmation page with defaults applied. Each one moved out of checkout is a field the buyer does not pay for. Opinion built on C9 and C10.
6. **Sign-up is one field.** Trials and newsletters ask for email only, with the next step stated ("We will email a sign-in link"). Every extra field needs a reason the user would accept.
7. **The lead page's result is drawn into the checkout.** When a quiz or calculator feeds the sale, pass its result as data (wall name and four scores in the query string, validated as 0 to 100 on arrival) and redraw it where the buyer decides: the Stand Firm checkout shows the dad's own four-wall plan, low wall dashed, beside "Mark, your plan starts with your Brothers wall. The other three are already standing." The same data writes one line under the hero lede and tags the matching chapter. A banner that restates the result is the floor; a figure the buyer watched himself build, back on the page that sells the fix, is the move (Stand Firm v4, 2026-10-24).

## Do and don't
| Do | Don't |
|---|---|
| One "Full name" field | First, middle, last |
| "Same as delivery" checked | A second address form |
| Account offer after payment | "Create an account to continue" |
| `inputmode="numeric"` text field for card | `type="number"` (spinners, lost leading zeros) |
| Errors on blur, text plus icon | Red border while typing the first character |

## Worked example: coffee subscription checkout
Dialog opened by "Start a subscription". Header: "Ethiopia Guji, every 2 weeks". Express row: "Apple Pay", "Google Pay" (neutral buttons in tests; real ones use the providers' official assets). Divider "or pay with card". Fields: email, full name, street address, city, postal code, card block (number, expiry, CVC), country preset to United States. Collapsed: "Apartment, suite (optional)", "Have a code?". Summary: "1 bag every 2 weeks $18.00 / Shipping Free / Tax calculated from your address: $0.00 in Oregon / Today $18.00". Term line and "Pay $18 and subscribe". Below: guarantee sentence. Account offered on the confirmation screen.

## Hand-offs
- Form mechanics and error copy: design-ux 03, design-copy 02. Dialog behavior: design-ux 04, design-frontend (native `<dialog>`). Payment integration and PCI: design-frontend; never build card fields yourself in production, use the processor's hosted fields.
