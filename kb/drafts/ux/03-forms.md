# Forms and input

## Principles
1. **The best field is the one you delete.** Every question needs a reason, an owner and a use (GOV.UK question protocol). Baymard's ideal checkout is 7 to 8 fields; the US average is 14.88.
2. **Labels stay visible.** Placeholder-only labels fail in eight documented ways (NN/g) and caused problems in every Baymard test.
3. **Validate when the person is done, clear errors the moment they are fixed** (Baymard; Etre study via Wroblewski).
4. **Never punish:** keep input after errors, accept paste, accept formats people naturally type (spaces in card numbers, +44 or 0 in phones).
5. **Submit is always available** until it is pressed (Adam Silver; Vercel; GOV.UK practice).

## Gate checks for any form
- Visible `<label>` for every field, programmatically associated; clicking label focuses the field.
- Required and optional both marked (only 14% of sites do; Baymard). Opinion: if most fields are required, mark only "(optional)".
- Correct `type`, `inputmode` and `autocomplete` on every field (`email`, `tel`, `one-time-code`, `street-address`, `postal-code`, `cc-number`, `new-password`, `current-password`).
- Errors: next to the field, text plus icon (not color alone), linked from an error summary on submit, focus moved to the summary or first error.
- Input text at least 16 px on mobile web so iOS Safari does not zoom (Vercel). Foundations `--text-base` = 16 px already satisfies this.
- No paste blocking, no CAPTCHA puzzles without alternative (WCAG 3.3.8).

## Decision rules
- **Layout:** single column. Labels above fields. Multi-column only for tightly related short pairs (City / Postal code, Expiry / CVC). Opinion, consistent with Baymard and GOV.UK practice.
- **Field width signals expected length:** postal code narrow, street full width (GOV.UK width classes).
- **One thing per page** for public, infrequent, high-stakes or branching flows (applications, onboarding, insurance quotes). **One page** for short frequent forms (sign-in, settings, internal tools). GOV.UK.
- **Order:** eligibility and knock-out questions first; easy before hard; branch so people only see what applies (GOV.UK).
- **Validation timing:** on blur for free text; on reaching full length for fixed-length fields (postal code, card, OTP); on keystroke only for rule-checklists like new passwords, and only after the first blur. Remove an error on the keystroke that fixes it (Baymard).
- **Error message formula:** what is wrong + how to fix, in the user's terms. "Enter a date of birth in the past" not "Invalid date". Identical wording in summary and inline (GOV.UK).
- **Dates:** memorable dates (birth, passport) as 3 text fields Day / Month / Year (GOV.UK). Near-future dates (booking) as a calendar picker that also accepts typing.
- **Names:** one "Full name" field unless a downstream system truly needs parts (opinion; GOV.UK and W3C i18n guidance on names).
- **Phone or other sensitive fields:** if required, say why inline ("For delivery updates only"); unexplained required phone causes 14% abandonment (Baymard).
- **Passwords:** show/hide toggle, show rules up front as a live checklist, allow paste and managers, no composition rules beyond length when you control policy (NIST SP 800-63B favors length and blocklists; Baymard: 82% of sites over-complicate).
- **One-time codes:** single field with `autocomplete="one-time-code"` and `inputmode="numeric"`, paste-friendly; avoid six separate boxes unless they behave as one field on paste.
- **Submit button:** label with the outcome ("Create account", "Pay $48.00"), not "Submit". Enabled until pressed; then disabled with spinner, label kept, idempotency key sent (Vercel).
- **Long forms:** save progress automatically; warn before navigating away with unsaved changes.
- **Account creation in checkout:** guest by default, offer account after purchase (18% abandon over forced accounts; Baymard).

## Numbers
| Thing | Value | Source |
|---|---|---|
| Ideal checkout | 12 to 14 elements, 7 to 8 fields | Baymard |
| Average US checkout | 23.48 elements, 14.88 fields | Baymard |
| Inline validation gain | success +22%, time -42%, errors -22% | Etre via Wroblewski (small study) |
| Mobile input font | 16 px minimum | Vercel; FOUNDATIONS `--text-base` |
| Field to label gap | 4 to 8 px; field to next label 16 to 24 px | FOUNDATIONS spacing (opinion on exact pick) |
| Input height | 44 px touch (48 dp Android) | Apple; Android |

## Do and don't
- Do: label "Email" above field, hint "We'll send your receipt here" below label. Don't: placeholder "Email" that disappears.
- Do: "Enter your card number. It's the 16 digits on the front." Don't: "Error 422".
- Do: allow "4242 4242 4242 4242" and strip spaces. Don't: reject spaces.
- Do: "Pay $48.00". Don't: "Submit".

## Worked example: B2B SaaS trial sign-up
1. Question protocol cuts company size, phone and role (sales wants them; product can ask after activation, or enrich from domain).
2. Fields: Work email, Password (or "Continue with Google" / SSO first for B2B). Name collected on the next screen inside the product.
3. Email validated on blur for format only; domain check message: "Use your work email to invite teammates" as hint, not a blocker, unless business rules require it.
4. Button "Start free trial". On error, summary plus inline, focus to summary.
5. Result: 2 fields instead of 7; the qualifying data arrives later in context. Persuasion copy on the page: copywriting skill. Funnel position: sales-funnels.

## Expert moves
- **Question protocol as negotiation tool.** Every field must name who uses the answer and how it is checked; this is how you win the argument with sales or legal (GOV.UK).
- **Fixed-length fields validate at length, not blur.** Saves a tap and catches errors while attention is still there (Baymard).
- **Error removal is live, error appearance is not.** Asymmetric timing is the detail most teams miss (Baymard).
- **Redundant entry is now a WCAG failure (3.3.7 A).** "Billing same as shipping" checked by default, prefill everything known.
- **Keyboard type is a design decision.** `inputmode="decimal"` for money, `numeric` for codes, `email` for email; wrong keyboards cost seconds per field on mobile.
- **Trim trailing whitespace** from autofill and text expansion before validating (Vercel). A trailing space failing email validation is a classic invisible bug.
- **Enter submits single-field forms; Cmd/Ctrl+Enter submits textareas** (Vercel).

## Hand-offs
- Microcopy, hints, error wording: design-copy.
- Checkout persuasion, offers, order bumps: sales-funnels and copywriting.
- Implementation of `autocomplete`, ARIA error linking (`aria-describedby`, `aria-invalid`): design-frontend.
