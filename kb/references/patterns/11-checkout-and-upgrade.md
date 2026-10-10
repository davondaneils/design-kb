# Checkout and upgrade

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-ux/references/03-forms.md](../../../skills/design-ux/references/03-forms.md) (checkout field counts, guest checkout) and [../../../skills/design-layout/references/05-page-composition-and-density.md](../../../skills/design-layout/references/05-page-composition-and-density.md) (pricing page layout). Offers, plan naming, price framing, upsells and order bumps belong to the `sales-funnels` and `copywriting` skills; button labels to [../../../skills/design-copy/references/02-ux-microcopy.md](../../../skills/design-copy/references/02-ux-microcopy.md). This file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Prompt at the limit, not at login.** Apple HIG: "Prompt people to subscribe at relevant times, like when they near their monthly limit of free content." Figma Starter caps a team at 3 Design, 3 FigJam and 3 Slides files; a Figma staff answer reports that creating one more file "a modal will appear prompting you to upgrade." [HIG: In-app purchase](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase), [Figma: Starter plan](https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview), [Figma Forum](https://forum.figma.com/ask-the-community-7/starter-plan-1785) [live page]
2. **Make the limit a number and promise nothing is lost.** Linear's free plan states "250 issues" on the pricing card; past it "you will no longer be able to create new issues" and "Nothing will be deleted." Slack free keeps 90 days visible; "When you upgrade, your messages and files beyond the 90-day limit will be revealed." [Linear: Billing and plans](https://linear.app/docs/billing-and-plans), [Slack: Free limitations](https://slack.com/help/articles/27204752526611-Feature-limitations-on-the-free-version-of-Slack) [live page]
3. **Plan picker: deltas, not repeats, and one quiet recommendation.** Linear's 4 columns open with "All Free features +", "All Basic features +" and list only what is new; the recommended Business plan is marked only by a filled light "Get started" button (others are 5% white), no badge. Billing interval is a toggle inside each paid card ("Billed yearly"). [Linear pricing, rendered](https://linear.app/pricing) [live page]
4. **Cap the choice set.** Stripe's embeddable pricing table allows "a maximum of four products, with up to three prices per product" and "three unique pricing intervals", with one product highlightable. [Stripe: Pricing table](https://docs.stripe.com/payments/checkout/pricing-table) [live page]
5. **Total first, then the math.** Stripe Checkout (demo set to one-time payment) opens with the amount due as the largest text (36px, weight 600), then line items, subtotal, the applied promo as a removable chip ("SAVE10", "10% off", "-$3.20"), tax as "Enter address to calculate" until known, and "Total due". Wallet button (Apple Pay) sits above the card form with an "OR" divider. [Stripe Checkout demo, rendered](https://checkout.stripe.dev/) [live page]
6. **Show the trial as a dated timeline.** Duolingo: "Today: Unlock full access", "Day 5: Get reminded when your trial is about to end", "Day 7: Your account is charged, cancel anytime 24 hours before." Blinkist prints real dates computed from today ("Oct 15: email reminder", "Oct 17: Subscription starts") plus "$0.00 today" as the big number. [Duolingo Super](https://www.duolingo.com/super), [Blinkist offer page](https://www.blinkist.com/pricing/secret-deal) [live page]
7. **Disclose the renewal in one sentence under the button.** Blinkist: "$139.99 is processed as an intro offer, then $174.99 will be billed every 12 months automatically. You can cancel anytime in your Settings." Google Play requires the cost, billing frequency, renewal terms and "how a user can cancel", with no extra action to see them. Apple 3.1.2(c): "clearly describe what the user will get for the price." [Blinkist](https://www.blinkist.com/pricing/secret-deal), [Play Console: Subscriptions](https://support.google.com/googleplay/android-developer/answer/9900533), [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) [live page]
8. **Mobile paywall anatomy is specified by the platform.** Apple's sign-up screen must show subscription name, duration and what each period includes, the localized billing amount, and "A way for existing subscribers to sign in or restore purchases"; HIG's Forest Explorer example puts billing totals "in the most prominent positions" and per-period breakdowns subordinate. Display "the total billing price" for every purchase. [HIG: In-app purchase](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase) [live page]
9. **Always an exit to the free product.** HIG (stated in its watchOS section, a sound rule on every platform (opinion)): a custom sign-up view should "include a Close or Cancel button that lets people return to your free content." Blinkist offers "Continue with Basic" under the trial button. [HIG: In-app purchase](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase), [Blinkist](https://www.blinkist.com/pricing/secret-deal) [live page]
10. **Upgrades bill now, downgrades wait.** Google Play recommends `CHARGE_PRORATED_PRICE` for upgrades ("access immediately while keeping the same billing period") and `DEFERRED` for downgrades ("keep access until the next billing date"). Apple 3.1.2(b): users "should not be able to inadvertently subscribe to multiple variations of the same thing." Linear prorates added seats to the next monthly cycle. [Android: About subscriptions](https://developer.android.com/google/play/billing/subscriptions), [Linear: Billing](https://linear.app/docs/billing-and-plans) [live page]
11. **Remind before the charge, by default.** Stripe sends a trial-ending reminder "7 days before a trial ends" (at trial start if the trial is shorter) with a cancel URL, to meet card network rules; Duolingo promises a day 5 reminder on a 7 day trial. [Stripe: Trial compliance](https://docs.stripe.com/billing/subscriptions/trials/manage-trial-compliance), [Duolingo Super](https://www.duolingo.com/super) [live page]
12. **Cancel and payment recovery live inside the app.** Apple: "Always make it easy for customers to cancel" and show "the upcoming renewal date"; Play requires a Subscription Center link or direct cancel in account settings, and its in-app message for a failed payment is shown "once per day" during grace period and account hold. Stripe's customer portal handles update, cancel now or at period end, and an optional coupon on cancel. [HIG](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase), [Android: About subscriptions](https://developer.android.com/google/play/billing/subscriptions), [Stripe: Customer portal](https://docs.stripe.com/customer-management) [live page]

## Common structure

Dashboard upgrade path:
```
Limit hit (create file / issue / seat)  ->  modal: what limit, what plan lifts it, price, [Upgrade] [Not now]
Plan picker:  [Plan name 24px]  [Price + unit]  [interval toggle]  ["All <lower> features +" deltas]  [CTA pinned to card bottom]
Checkout:     amount due (largest) / line items / promo chip / tax / Total due  |  wallet button / OR / email / card / address / [Pay or Subscribe]
After:        proration on next invoice, plan visible in Settings > Billing with renewal date and cancel
```
Mobile paywall (top to bottom):
1. Close (X) or "Not now" always visible.
2. Value headline and 3 to 4 checkmarked benefits.
3. Plan options, total price prominent, per-period breakdown smaller, default selected.
4. Trial timeline (Today, reminder day, charge day) when a trial exists.
5. One primary CTA ("Start free trial", "Start my 1 week free").
6. Renewal sentence, Restore purchases, Redeem code, terms and privacy.

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Linear pricing (1440px) | Plan name | 24px, weight 590, letter-spacing -0.288px | measured with getComputedStyle | https://linear.app/pricing |
| Linear pricing | Feature list item | 13px / 19.5px, rgb(208,214,224) | measured with getComputedStyle | same |
| Linear pricing | Column width and pitch | 271px columns, 337px pitch (about 66px gap with divider) | measured with getComputedStyle | same |
| Linear pricing | CTA | 40px tall, 13px weight 510, 14px side padding, 9999px radius; non-recommended bg rgba(255,255,255,0.05) | measured with getComputedStyle | same |
| Stripe Checkout demo | Amount due | 36px / 46.8px, weight 600 | measured with getComputedStyle (inside iframe) | https://checkout.stripe.dev/ |
| Stripe Checkout demo | Line item and "Total due" | 14px / 18.2px, weight 500 | measured with getComputedStyle | same |
| Stripe Checkout demo | Field label ("Email") | 13px, weight 500, 70% opacity text | measured with getComputedStyle | same |
| Stripe Checkout demo | Section heading ("Payment method") | 16px, weight 500 | measured with getComputedStyle | same |
| Duolingo Super (390px) | Primary CTA | 50px tall, 358px wide (16px side margins), 16px radius, 15px weight 700 uppercase, 0.8px tracking | measured with getComputedStyle | https://www.duolingo.com/super |
| Duolingo Super (390px) | Trial step title / body | 19px weight 700 / 17px weight 500 at 80% white | measured with getComputedStyle | same |
| Blinkist (390px) | Primary CTA | about 40px tall, full card width, green fill | estimated from screenshot | https://www.blinkist.com/pricing/secret-deal |
| Stripe pricing table | Products, prices, intervals | max 4 products, 3 prices each, 3 intervals | stated in docs | https://docs.stripe.com/payments/checkout/pricing-table |
| Stripe Billing | Trial reminder lead time | 7 days before end | stated in docs | https://docs.stripe.com/billing/subscriptions/trials/manage-trial-compliance |
| Apple | Minimum auto-renew period | 7 days | stated in docs | https://developer.apple.com/app-store/review/guidelines/ |

## Mistakes they avoid

- **Paywall on first launch before any value.** HIG: "Let people experience your app before making a purchase." Linear, Slack and Figma all gate on a usage number instead. [HIG](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase)
- **Hiding the post-trial price.** Play and Apple both require it up front; Duolingo and Blinkist put the charge day on the timeline. [Play Console](https://support.google.com/googleplay/android-developer/answer/9900533)
- **Per-week price as the hero while billing yearly.** Apple says the total billing amount goes in the most prominent position, breakdowns subordinate. [HIG](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase)
- **Threatening data loss to force an upgrade.** Linear says "Nothing will be deleted"; Slack says hidden history is "revealed" on upgrade. [Linear](https://linear.app/docs/billing-and-plans), [Slack](https://slack.com/help/articles/27204752526611-Feature-limitations-on-the-free-version-of-Slack)
- **Repeating every feature in every plan card.** Linear lists deltas only. [Linear pricing](https://linear.app/pricing)
- **No Restore purchases on mobile.** Required by HIG for existing subscribers. [HIG](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase)
- **Cancel buried deep.** Apple: subscribers "can feel they're being discouraged or prevented from canceling." [HIG](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase)
- **Showing the store when payments are blocked.** HIG: hide it or explain why when `canMakePayments` is false (for example parental restrictions). [HIG](https://developer.apple.com/design/human-interface-guidelines/in-app-purchase)
- **Countdown urgency timers** (opinion). Blinkist's offer page runs a "20% discount reserved for 09:58" timer; it is not prohibited by the sources above, but Apple removes apps that "trick users into purchasing a subscription under false pretenses", so a timer that resets is a review risk. Prefer Duolingo's plain timeline. [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Products to look at

- Linear: plan picker with deltas, quiet recommendation, stated free limit, proration rules. https://linear.app/pricing and https://linear.app/docs/billing-and-plans
- Stripe Checkout: summary-first checkout, promo chip, wallet first. https://checkout.stripe.dev/
- Stripe pricing table and customer portal: limits on choice, cancel and update flows. https://docs.stripe.com/payments/checkout/pricing-table and https://docs.stripe.com/customer-management
- Slack: history-limit upgrade that reveals instead of deletes. https://slack.com/help/articles/27204752526611-Feature-limitations-on-the-free-version-of-Slack
- Figma: file-count limit and upgrade modal; seat requests as an upgrade path. https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview
- Duolingo Super: trial timeline, family plan in the same picker. https://www.duolingo.com/super
- Blinkist: dated trial timeline, renewal sentence, "Continue with Basic" exit. https://www.blinkist.com/pricing/secret-deal
- Apple HIG and StoreKit `SubscriptionStoreView` (WWDC24: compact picker, controls in bottom bar, marketing content per plan group). https://developer.apple.com/design/human-interface-guidelines/in-app-purchase and https://developer.apple.com/videos/play/wwdc2024/10061
- Google Play: disclosure policy and upgrade or downgrade replacement modes. https://support.google.com/googleplay/android-developer/answer/9900533 and https://developer.android.com/google/play/billing/subscriptions
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product shows an upgrade wall on login, a three-card pricing page that repeats 30 features per card with a loud "Most popular" badge, a checkout that hides the renewal price in fine print, and a cancel link buried in support docs. The best trigger the prompt at a stated numeric limit, promise nothing is lost, show only plan deltas, lead checkout with the total, draw the trial as a dated timeline with a reminder they actually send, and keep restore, cancel and payment-fix one tap away. Gap score: 3 of 5 (opinion): platform rules and Stripe defaults now force much of the floor, so the gap is mostly in prompt timing and honesty of the trial copy.

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/11-checkout-and-upgrade/linear-plan-picker.jpg | 4-plan picker at 1440px: delta lists, per-card yearly toggle, recommended plan marked only by filled CTA | https://linear.app/pricing | Linear | 2026-10-10 |
| shots/11-checkout-and-upgrade/stripe-checkout-summary-and-form.jpg | Checkout demo: amount due on top, line item, promo chip, tax pending, total, Apple Pay then form | https://checkout.stripe.dev/ | Stripe | 2026-10-10 |
| shots/11-checkout-and-upgrade/duolingo-trial-timeline-mobile.jpg | "How your free trial works" timeline at 390px: Today, Day 5 reminder, Day 7 charge | https://www.duolingo.com/super | Duolingo | 2026-10-10 |
| shots/11-checkout-and-upgrade/blinkist-paywall-mobile.jpg | Mobile offer paywall: "$0.00 today", struck original price, single CTA, benefits, countdown timer | https://www.blinkist.com/pricing/secret-deal | Blinkist | 2026-10-10 |

Images are (c) their owners, kept for internal reference and critique.
