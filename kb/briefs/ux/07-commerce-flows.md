# Brief: Purchase and subscription flows (choose, configure, cart, checkout entry)

Editor-in-chief, 2026-10-10. Wave 2 of design-ux. Layer: domain reference. Loaded by design-playbook-landing when the page sells something, and by design-playbook-mobile for shop apps.

## Question
How does a visitor go from "that looks good" to a correct order with no surprises: picking a product and its options, choosing one-time or subscription and a cadence, seeing it land in the cart, and reaching checkout with the total already known?

## Audience
Claude building a direct-to-consumer shop page or a homepage that sells (coffee, cosmetics, pet food, any consumable), web first, phone and desktop.

## Decisions the reader must be able to make
- Buttons, radios or a dropdown for each option (grind, size, cadence), and whether to preselect.
- How to label options so a buyer can answer them (their words, not the catalogue's).
- One-time or subscription as the default, and what the subscription must disclose before the buyer commits.
- What happens on "Add to cart": in place, a toast, or the cart drawer; how it is announced.
- Cart contents and checkout entry: totals, shipping, guest checkout, removal with undo, quantity.
- Where quick-add from a product card must stop and ask (an option with no safe default).
- Navigation for a small shop: what stays visible on a phone.

## Fundamentals (the gate for this subtopic)
- Every option is a native control with a visible group label (`fieldset` and `legend`), keyboard per the APG radio pattern.
- No preselected option that ships the wrong product if the buyer misses it.
- The add button stays enabled; a missing choice gets an inline error at the group, focus moves there.
- The price on the button, the drawer and the checkout agree; shipping and the total are visible before checkout.
- Subscription terms (price, cadence, renewal, how to cancel) are visible next to the button that starts it.
- The cart is reachable and never a dead end; removing is immediate with undo.
- WCAG 3.3.4: a purchase is reviewable before it is final.

## Expert layer (what a top practitioner adds)
- Ask in the buyer's vocabulary (their brewer, not a grind number).
- Remember the answer and preselect it next time, labelled as theirs.
- Translate cadence into consumption (cups a day) so the buyer can pick it.
- One-time as the default where both exist (Shopify guidance; the honest default).
- The add button names the outcome and price ("Add subscription, $18 every 2 weeks").
- Show the free-shipping threshold as plain information, not a countdown.
- Cancel paths as easy as sign-up (California ARL, DSA Article 25).

## Must cover
- Baymard: buttons over dropdowns for variations; abandonment reasons (extra costs 40%, forced account 18%, total not visible 12%); subscription pricing findability; add-to-cart feedback.
- Shopify storefront subscription guidelines (radio vs dropdown at 4 options, default one-time, labels, cart line names, keep submit enabled).
- WCAG 3.3.4, APG radio group, Nielsen heuristics 2 and 5.
- California Automatic Renewal Law as amended (AB 2863, July 2025): consent, online cancellation. Mark as legal context, not legal advice.

## Out of scope or reuse
- Persuasion copy, offer stacks, order bumps, upsells: copywriting and sales-funnels.
- The checkout form fields themselves: `03-forms.md` (Baymard 7 to 8 fields) and design-foundations accessibility worked example 1.
- Dense app tables, command palettes, settings save models: design-product-ui.
- Platform navigation conventions (tab bars, back): design-playbook-mobile.

## Test briefs
Rendered tests are in `slice-test-briefs.md` (Brief UX-A coffee purchase flow, Brief UX-B dashboard first run). Text briefs this file must also answer:
1. "Product page for a dog food brand: 3 sizes, 2 recipes, subscribe or buy once." Playbook: landing. Exemplar: apple.com product pages (buy flow).
2. "Mobile cart for a cosmetics shop with a free-shipping threshold." Playbook: mobile. Exemplar: Cash App (single clear action).

## Rubric
Gate: the FOUNDATIONS fundamentals checklist (15 items) plus the design-ux gate (12 checks) on every state. Close to the exemplar means: the buyer can configure and add in one view without reading help; every state the flow has is designed and reachable; nothing about price or renewal is discovered late; the flow feels calm (no countdowns, no fake scarcity), the way apple.com's buy flow feels.
