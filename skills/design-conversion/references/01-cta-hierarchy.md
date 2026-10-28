# 01 CTA hierarchy and placement

How many actions a view offers, how loud each one is, where it sits and what it says. Sources: `kb/research/conversion/01-cta-hierarchy.md` (claim IDs in brackets).

## Floor: fundamentals (non-negotiable)
1. **One filled primary per view.** A "view" is one screen at the width you are judging. Everything else is outlined (secondary) or a text link (tertiary). [judged] (FOUNDATIONS item 12)
2. **One verb for one action.** The hero, the band and the sticky bar all say "Start a subscription", not three phrasings. [judged]
3. **The label predicts the next screen.** Verb plus object. "Get started" fails when the next step is a quiz, a form or a payment (C17). [judged]
4. **The primary is in the first screen** at 390 and 1440 (C16: 57% of viewing time is above the fold). [judged]
5. **Primary target at least 44x44 at 390**, focus ring, 4.5:1 label contrast (FOUNDATIONS items 1, 4, 9). [lint]
6. **A button that commits money says so.** If the click charges or starts a renewal, the amount and term are in the button or in body text directly beside it (see 03). [judged]

## Principles
- A CTA is the answer to "what now?" at the moment a visitor has enough to decide. Placement follows decisions, not sections.
- Emphasis is a budget. Each extra filled button halves the signal of the first (opinion).
- The secondary action is a different, smaller commitment, never the same action styled down.

## Decision rules
| If | Then |
|---|---|
| The primary commits money or a renewal | Put the amount and cadence in the label ("Start for $18 a bag") or one line under it in body size |
| The primary is a big commitment (subscription, annual plan, demo call) | Pair it with a smaller secondary path (one bag, monthly, watch the tour) |
| A long page has more than one decision point | Repeat the primary after the price and after the main proof; nowhere else |
| A section ends at the fold as a full-bleed band | Let the next section peek 48 to 96px above the fold, or the page looks finished (C18) |
| A phone product page's inline CTA scrolls out of view | A sticky bottom bar may appear with the same label and price; hide it while any input has focus, and while the inline CTA is visible (opinion) |
| Dashboard header | One primary in the same place on every screen (playbook-dashboard non-negotiable 1). Upgrade is never that primary unless the user is blocked (see 05) |
| An email capture (newsletter, discount for signup) | Inline, after the reader has seen the product (footer, end of an article). Never a modal on load: NN/g criticises one that "appears within the first 3 seconds" (C36). Exit-intent popups on a premium site: avoid (opinion) |
| Two actions of equal weight seem needed | They are not; pick by the business goal for this view and demote the other |

## Numbers
- Emphasis tokens: primary = `--color-primary` fill, `--color-on-primary` label; secondary = transparent fill, 1px `--color-border-strong`; tertiary = `--color-accent` text link with underline.
- Sizes: primary `min-height: 48px` (56px in a feature band), label `--text-base` 600 or `--text-lg` 600; secondary `min-height: 48px` beside a primary (same height so the row aligns) or 40px in a card.
- Gap between primary and secondary: `--space-4` (12px).
- Repeat count on a landing page: 2 to 3 placements of the primary (hero, after price, page end). Opinion.

## Ceiling: exemplar patterns
Measured (exemplar library teardowns, 2026-10-10, C51 to C55):
- **Price and button as one object, first screen.** Apple's MacBook Air page sets "From $1299 or $108.25/mo. for 12 mo." and a single "Buy" pill inside one rounded panel under the headline (C51). The price is not a section; it is the button's caption.
- **The zero-field path beside the primary.** Stripe puts a filled "Get started" next to an outlined "Sign up with Google", and the logo strip at the fold before any feature (C52). Vercel pairs "Deploy now" with "Talk to sales" (C53).
- **The objection line under the button.** Raycast has one button and, under it, the system requirements and install alternatives in small mono: the first objection answered before it is asked (C54). This is the same move as the term line (03).
- **One hero button.** Linear and Raycast each show one (C54, C55). Stripe is the exception: a filled "Contact sales" in the nav and a filled "Get started" in the hero share the first screen (C52). This knowledge base's gate counts both (FOUNDATIONS item 12), so set a nav CTA outlined, or tonal: a tinted fill under 2:1 against the bar (for example blue-50 behind blue-700 text) still reads as the phone or book button without counting as a second filled primary (VGC homepage, round 7).

From the text reads (C45 to C49):
- **Two paths, two commitments.** Linear: "Get started" and "Contact sales" on Business (C45). Vercel: "Start deploying" (free), "Start a free trial" (Pro), "Get a demo" (Enterprise) (C46). The label tells you which door you are using.
- **Money in the CTA zone.** Apple's buy pages put "from only $108.25 per month", financing and returns beside the purchase controls (C49).
- **Few words, specific verbs.** Stripe's pricing page uses "Get started" for self-serve because the next screen really is sign-up, and "Contact sales" for custom (C47). "Get started" is fine when it is literally true.

## Signature moves
1. **The commitment ladder.** Big ask filled, small ask outlined, side by side: "Start a subscription" next to "Buy one bag, $21". Reason: a visitor who is not ready to subscribe still has a way to say yes now instead of leaving to think. Opinion, consistent with exemplar two-path CTAs (C45, C46).
2. **The buy panel.** In the hero, the price sentence and the primary sit together in one quiet panel (surface step, pill or `--radius-xl`), the way Apple does it (C51): "Subscribe from $18 a bag, shipping included" beside "Start a subscription". The visitor sees what it costs without scrolling and without a pricing section.
3. **Price in the button when the action appears once.** On a pricing card or a one-off product, "Start for $18 a bag" removes the last unanswered question at the point of click. Keep it under about 28 characters so it does not wrap at 390. Opinion.
4. **Repeat at decisions, not at sections.** After the price block and after the strongest proof. A CTA after the company story is noise.
5. **Same label, live summary.** The button label stays the same everywhere ("Start a subscription"); the one line of body text directly above it restates the current choice ("$18 every 2 weeks, shipping included. First bag ships Friday, Oct 16.") and updates when the user changes cadence or quantity. The visitor reads exactly what the click does, and the verb never forks. Announce the change politely (`aria-live="polite"` on the summary, not on the button).
6. **Phone sticky bar earns its space.** It appears only once the inline CTA is gone, carries price plus label in one row, and never covers a focused field (WCAG 2.4.11 focus not obscured). Make "once the inline CTA is gone" literal: watch every filled primary and the form with one IntersectionObserver and slide the bar away while any of them is on screen, and while the phone menu is open, so one-filled-per-view holds at every scroll position. Hide it with `visibility` after the slide so its links leave the tab order, pad the footer by the bar height plus a step, and set `scroll-padding-bottom` so anchors land above it (VGC homepage, round 7).

## Do and don't
| Do | Don't |
|---|---|
| "Start a subscription" / "Buy one bag, $21" | "Get started" / "Learn more" |
| One filled button per screen | Filled buttons in every card plus the hero plus the band |
| Same label everywhere for the same action | "Subscribe", "Join", "Start now" for one action |
| Secondary outlined at the same height | A tiny grey text link that looks like an apology |

## Worked example: coffee page
Before: hero primary "Start a subscription", secondary "Buy a bag, $21"; band primary "Start my subscription" (a second verb form); shop cards each with an outlined "Add to cart". After: one label, "Start a subscription", in hero, band and checkout entry; in the band a live summary line above the button states the current choice and price; the band keeps a tertiary "or buy a single bag" link to the shop. Cards keep outlined "Add to cart" (secondary; no filled buttons in the grid).

## Hand-offs
- Button craft and states: design-polish 01. Label voice: design-copy 02. Funnel step order and upsells: sales-funnels.
