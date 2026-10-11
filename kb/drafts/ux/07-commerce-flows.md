# Purchase and subscription flows

From "that looks good" to a correct order with no surprises: choose, configure, add, review the cart, enter checkout. Research: `kb/research/ux/07-commerce-flows.md` (claims C1 to C21). Rendered test: `kb/tests/design-ux/coffee.html`. Opinion is marked (opinion).

## Floor: fundamentals (non-negotiable)
1. **Every option is a native control in a labelled group.** `fieldset` plus `legend`, radios for single choice, keyboard per the APG radio pattern: Tab into the group, arrows move and check (C14). Styled cards and pills are fine; the input underneath stays a real radio. [lint: axe names and roles] [judged: arrows work]
2. **Four options or fewer show as visible choices; more than four may use a select** (Shopify C4; Baymard C1 for sizes). Never hide two or three choices in a dropdown. [judged]
3. **No preselected option that ships the wrong thing if missed.** Grind, size and color that change what physically ships start unselected unless the value is the buyer's own saved choice (Baymard C2). [judged]
4. **The add button stays enabled.** A missing choice produces an inline error on the group (icon plus text, the error linked with `aria-describedby` on the `fieldset`, a non-color cue on the group border), and focus moves to the first option in that group (Shopify C6; WCAG 3.3.1). [lint: state-shift, focus] [judged]
5. **One price, everywhere.** The button, the drawer line and the checkout show the same number for the same thing; cadence is part of the price ("$18 every 2 weeks") (Shopify C5, C7). [judged]
6. **Costs before checkout.** Shipping (or the free-shipping rule) and the estimated total are visible in the cart, before the checkout button (Baymard C10: 40% abandon over extra costs, 12% over a total not shown upfront). [judged]
7. **Subscription terms sit next to the button that starts it:** price per delivery, cadence, when the first one ships, that it renews, and how to skip or cancel (online, the same way they signed up) (Baymard C8, C9; California ARL C17, C18, legal context). [judged]
8. **Feedback within 100 ms, announced.** After add, something visible changes where the buyer is looking (the button, the cart count, or the drawer opening), and a polite live region says what was added and the cart's new state (design-ux gate G1; WCAG 4.1.3; Baymard C12). [judged]
9. **Removing is immediate with undo**; quantity steppers have 44px targets, a visible number and a remove path that is not only "minus to zero" (design-ux gate G10, G3). [lint: targets] [judged]
10. **Guest checkout is the default path**; accounts are offered after the order (Baymard C10: 18% abandon when forced). [judged]
11. **The order is reviewable before it is final** (WCAG 3.3.4 AA, C13): checkout ends on a review step, or the order is cancellable. [judged]
12. **The cart is never a dead end.** The cart link opens a cart (drawer or page) from every page; an empty cart says so and offers the next step. [judged]

## Standards
| Rule | Source |
|---|---|
| Radio group keyboard, group label | WAI-ARIA APG radio pattern (C14); WCAG 1.3.1 |
| Error identified in text, with fix | WCAG 3.3.1, 3.3.3 |
| Status messages without focus | WCAG 4.1.3 |
| Purchase reversible, checked or confirmed | WCAG 3.3.4 (C13) |
| No re-entry of known data | WCAG 3.3.7 (design-foundations accessibility) |
| Auto-renewal: express consent, cancel the same way you joined | California Bus. and Prof. Code 17600 ff. as amended July 2025 (C17, C18); EU DSA Article 25 on deceptive design (design-ux 01). Legal context, check with counsel. |

## Decision rules
- **If an option changes what ships (grind, size, color):** visible radios, no default, error on submit if missing. If the buyer has bought before, preselect their last choice and say so ("Your usual").
- **If an option only changes how it ships (gift wrap, delivery speed):** preselect the common, free choice.
- **If both one-time and subscription exist on one product:** two stacked radios, one-time selected first (C3); the subscription radio carries its saving ("Subscribe, 15% off"); cadence appears only once subscription is chosen (progressive disclosure).
- **If the section only sells the subscription:** no one-time option to default to; preselect the most common cadence (it ships nothing wrong, it changes timing) and show what it means in use.
- **If quick add happens from a product card and an option has no safe default:** the button opens a small dialog with that one question and the add button; never add with a guessed grind. Label the card button with an ellipsis ("Add to cart…") because it asks one more thing (design-ux 04 ellipsis grammar).
- **If the next thing the buyer needs is in the cart (shipping threshold, subscription terms, a second line):** open the cart drawer after add, with focus on the drawer's heading (opinion). Otherwise confirm in place (the button turns to "Added" for 2 s) and update the count.
- **If a cart has a subscription and one-time items:** one checkout, lines grouped "Every 2 weeks" and "Once", each with its own price wording; totals say what is charged today.
- **The cart drawer is a modal dialog:** native `<dialog>` opened with `showModal()`, a visible heading that takes focus on open, Escape and a labelled Close button close it, focus returns to whatever opened it (the cart link or the add button). On phones it fills the screen; on desktop it is a right-hand panel about 400 to 480px wide (opinion).
- **Free-shipping threshold:** state it as information in the cart ("Free shipping over $40. You are $1 away."). No countdowns, timers or fake stock (opinion; DSA Article 25 and design-copy).
- **Checkout button:** names the action and today's total ("Check out, $39.00"); on press it shows progress and keeps its label until the checkout page loads.
- **Phone navigation for a shop:** keep Shop and Cart (with count) visible, put the rest behind a labelled "Menu" button; never let sections vanish at a breakpoint with no way to reach them (design-ux 02, combo nav).

## Numbers
| Thing | Value | Source |
|---|---|---|
| Visible options before a select | 4 | C4 |
| Feedback after add | under 100 ms visible; "Added" holds 2 s | NN/g via design-ux 01; opinion |
| Undo after remove | at least 5 s, pauses on hover and focus | design-ux 04 |
| Stepper and option targets | 44 x 44 px on touch | FOUNDATIONS; WCAG 2.5.8 floor 24 |
| Abandonment reasons to design against | extra costs 40%, forced account 18%, long checkout 17%, total not visible 12% | C10 |
| Coffee consumption for cadence copy | about 22 cups per 340 g bag at 15 g a cup (derived, opinion on the dose) | arithmetic |

## Ceiling: exemplar patterns
Exemplar hosts are blocked here (`kb/exemplars.md`); patterns below are from memory and labelled opinion.
- apple.com buy flow: one decision per row, a short plain-language helper beside each ("Which model is right for you?"), the running price always visible, the add button carries the configured result.
- Stripe Checkout and Shop Pay: the total and what is charged today are stated before the pay button; subscription lines say "then $X every month".

## Signature moves
1. **Ask in the buyer's words.** "How do you brew?" with Pour-over, Espresso, Drip machine, French press, Whole bean, each with the grind as a small second line. People know their brewer, not a grind number (Nielsen H2, C15). Generalists copy the catalogue's field name.
2. **Ask once, remember, say so.** The next visit preselects "Pour-over (your usual)". It removes the one question with no safe default without guessing.
3. **Turn cadence into use.** "Every 2 weeks, about 1 to 2 cups a day" next to each cadence option. A buyer cannot answer "how often" but can answer "how much do I drink".
4. **The button is the summary.** "Add subscription, $18 every 2 weeks": the outcome, the price and the cadence in the one place everyone reads (Shopify C6 subscription label; opinion on adding price).
5. **Disclose next to commit, not in a footnote.** "Renews every 2 weeks. Skip, pause or cancel online before the next roast." directly under the button. Calm, specific, and the legal requirement in one line.
6. **Prevent, then explain.** The missing-grind error appears only after a submit attempt, sits on the group, and clears on the first choice (design-ux 03 asymmetric timing; Nielsen H5, C16).
7. **Undo as the remove confirmation.** Remove takes the line out at once and leaves a one-line placeholder in its place ("Removed Colombia Huila. Undo"), so the list does not jump and undo is where the eye is (opinion).
8. **The empty cart sells the next step.** "Your cart is empty. This week's coffee is Ethiopia Guji, roasted Tuesday." with one action, instead of a sad icon (NN/g empty states, C19, C20).

## Do and don't
| Do | Don't |
|---|---|
| Radios labelled "Pour-over, medium-fine" | A select labelled "Grind size" with "Whole bean" preselected |
| "Add subscription, $18 every 2 weeks" | "Subscribe now!" |
| "Renews every 2 weeks. Cancel online any time." under the button | Terms behind a "Details" link in the footer |
| Shipping and total in the cart | "Shipping calculated at checkout" as the first time cost appears |
| Remove with undo | "Are you sure you want to remove this item?" |
| Guest checkout first | "Create an account to continue" |

## Worked examples
1. **Coffee subscription section (rendered in `kb/tests/design-ux/`).** Three questions on an order slip: Coffee (Roaster's choice, Guji, Huila, Espresso blend: four radios with price), How do you brew (five radios, no default), Every (2 or 4 weeks, 2 preselected, each with cups a day). Running summary line, button "Add subscription, $18 every 2 weeks", terms beneath. Submit without a brew method: error on that group, focus on its first radio, summary unchanged. With all chosen: drawer opens with the line "Ethiopia Guji, pour-over, every 2 weeks, $18", shipping included, today's total, "Check out, $18.00".
2. **Quick add from a product card.** "Add to cart…" opens a dialog: name, price, the brew question with the saved answer preselected and marked, a quantity stepper, "Add to cart, $21". Escape closes and returns focus to the card button.
3. **Dog food, 3 sizes and 2 recipes, subscribe or buy once (text brief).** Recipe as two image radios, size as three radios with price per kg, purchase type as two stacked radios with one-time first; cadence select appears under subscribe with "every 4 weeks fits a 12 kg dog on the 6 kg bag" (opinion: the brand supplies the feeding table).

## Hand-offs
- Persuasion, offers, order bumps, upsells: copywriting and sales-funnels.
- Checkout fields, autofill, validation timing: `03-forms.md`; accessible checkout example in design-foundations `references/accessibility.md`.
- Price typography and tabular figures: design-typography `references/05-typographic-detail.md`.
- Drawer and dialog build: design-frontend; motion of the drawer: design-motion (enter at base duration, none under reduced motion).
- Platform sheets and back behavior on native apps: design-playbook-mobile `references/platform-conventions.md`.
