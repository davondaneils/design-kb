# Brief: 04 Checkout, sign-up and forms for conversion

**Question:** What does a checkout or sign-up need, in what order, with how few fields, so people finish it?

**Audience:** Claude building a checkout, subscription sign-up, trial sign-up or newsletter form.

**Decisions the reader must be able to make**
- The field budget and which fields to cut, merge, hide or defer.
- Order: express pay, contact, delivery, payment, review; one page or steps.
- Guest checkout and when to offer an account.
- Payment field design that feels secure.
- Validation timing, autofill, keyboard types, error recovery.
- Where the order summary and total sit at 390 and 1440.

**Fundamentals (gate)**
- Visible labels; placeholder never the label (NN/g forms; web.dev).
- `autocomplete` tokens on every personal field (WCAG 1.3.5 AA).
- No re-entry of data already given (WCAG 3.3.7 A); paste and password managers allowed (3.3.8 AA).
- Errors in text plus icon, on blur not on keystroke (Baymard inline validation; design-ux 03).
- Guest checkout; account creation deferred to after purchase (Baymard: 18% abandoned over forced accounts).
- Total visible at every step.

**Expert layer**
- Field budget: Baymard's average checkout has 11.3 fields, most need 8; one name field, address line 2 and coupon collapsed, billing same as delivery by default.
- Express pay first (Stripe holdback test: Apple Pay +22.3% conversion where offered).
- Encapsulate card fields with a distinct surface and a lock (Baymard perceived security).
- The CTA restates the amount and term ("Pay $18, then every 2 weeks").

**Must cover:** field budget table, checkout order, autocomplete map, payment block spec, summary placement, newsletter and trial sign-up minimal forms.

**Out of scope or reuse:** general form rules (design-ux 03), product settings forms (design-product-ui 03), payment integration code (design-frontend).

**Test briefs**
1. Coffee subscription checkout as a dialog from the subscription CTA. Playbook landing. Exemplar: apple.com/shop checkout, Stripe Checkout.
2. SaaS trial sign-up, email first. Playbook landing. Exemplar: linear.app sign-up, vercel.com.

**Rubric:** gate first, then: field count at or under 8 for delivery plus contact; every field has a label and an autocomplete token; total and term visible beside the pay button; express pay before the card form.
