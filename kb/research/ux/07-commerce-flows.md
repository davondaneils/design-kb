# Research: Purchase and subscription flows

Researcher, 2026-10-10, for `kb/briefs/ux/07-commerce-flows.md`. Source policy: `.claude/agents/researcher.md`. Tiers: 1 standards and official docs, 2 measured exemplars, 3 canonical books and peer-reviewed research (Baymard's large-sample usability research is treated as tier 3), 4 practitioners, 5 leads only. Quotes are verbatim as fetched with WebFetch on the access date; WebFetch returns a processed page, so quotes were checked against the returned text only.

## Key findings
1. **Options as visible buttons, not dropdowns.** In Baymard testing, people overlooked dropdown size selectors and found out-of-stock sizes only after opening them; 71% of benchmarked sites now use buttons (63% in 2017). Preselecting a size let people buy without choosing. [C1, C2]
2. **Radios up to four options, dropdown above; one-time purchase is the default.** Shopify's storefront subscription guidelines: first load selects one-time purchase; radio inputs for four or fewer options; stacked subscription groups use radios, not buttons, so they do not compete with add to cart; keep the submit button enabled and explain what is missing; use a subscription-specific button label; cart line names match checkout. [C3 to C7]
3. **Price is the subscription buyer's first question.** Baymard's subscription study: users who could not find pricing quickly tended to leave; show pricing sitewide and explain skip, pause and cancel. [C8, C9]
4. **Surprise costs are the top abandonment reason.** Extra costs too high 40%, account required 18%, checkout too long 17%, total not visible upfront 12% (US, excluding "just browsing"). Average documented cart abandonment 70.22% across 50 studies. [C10, C11]
5. **Visible add-to-cart feedback.** For list pages, Baymard recommends the button turn into a quantity control once added, so the change is visible in place. [C12]
6. **Purchases must be reversible, checked or confirmed** (WCAG 3.3.4, AA): a review step before the order is final satisfies it. [C13]
7. **Radio group keyboard:** Tab moves into and out of the group; arrows move and check. [C14]
8. **Speak the user's language; prevent errors before messaging them** (Nielsen heuristics 2 and 5). Basis for asking "how do you brew" instead of "grind size". [C15, C16]
9. **Auto-renewal law (legal context, not advice).** California's amended Automatic Renewal Law (from July 1, 2025) requires express affirmative consent and cancellation through the same medium used to sign up; save offers are allowed only if the buyer is told they can finish cancelling. [C17, C18] The US FTC "click to cancel" rule was vacated by the Eighth Circuit in July 2025 (lead only, tier 5; recheck before citing).
10. **Empty states in complex apps:** communicate system status, give learning cues, give direct pathways to the key task. [C19, C20]
11. **Endowed progress.** Turning an 8-step task into a 10-step task with 2 steps already complete raised completion and sped it up (Nunes and Dreze 2006, car wash loyalty cards). Use only with steps that are truly done. [C21]

## Numbers
| Number | Value | Source |
|---|---|---|
| Sites using buttons for size (desktop benchmark) | 71% (63% in 2017) | C1 |
| Radio vs dropdown threshold for plan options | 4 options | C4 |
| Abandonment: extra costs / account / long checkout / total not visible | 40% / 18% / 17% / 12% | C10 |
| Average cart abandonment | 70.22% (50 studies) | C11 |
| Endowed progress setup | 2 of 10 steps pre-completed vs 0 of 8 | C21 |

## Conflicting views
- **Preselecting options.** Baymard flags preselected sizes as a cause of wrong orders (C2); many shops preselect to cut a click. Resolution (opinion): preselect only when the default is right for most buyers and costly mistakes are impossible; never for an option that changes what physically ships unless it is the buyer's own saved choice.
- **Default plan.** Shopify says one-time by default (C3); many DTC subscription themes default to subscribe-and-save. Resolution: follow Shopify on product pages that offer both; a section that only sells the subscription has no one-time option to default to.
- **Open the cart drawer after adding?** Common in Shopify themes; Baymard's added-to-cart confirmation pages show both drawers and in-page confirmation. No measured winner found. Opinion: open the drawer when it carries information the buyer needs next (shipping threshold, subscription terms); otherwise confirm in place.

## Ceiling: exemplar patterns
Exemplar hosts are blocked from this environment (`kb/exemplars.md`), so no teardown exists for these flows. From memory, labelled opinion: apple.com's buy flow asks one choice at a time with the running price always visible and a plain-language helper next to each choice ("Which model is right for you?"); Stripe and Vercel onboarding put a checklist on the real product UI and mark test data visibly (Stripe's test mode banner). Recheck with teardowns when hosts open.

## Claim table
| # | Claim | Quote (under 40 words) | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| C1 | Visible buttons beat dropdowns for size; adoption 71% | "users during testing were prone to overlook the size selector entirely." | https://baymard.com/blog/use-buttons-for-size-selection | 2026-10-10 | 3 | consensus |
| C2 | Dropdowns are a legacy pattern | "Drop-down menus, broadly speaking, are oftentimes a relic of early web design." | https://baymard.com/blog/use-buttons-for-size-selection | 2026-10-10 | 3 | consensus |
| C3 | Default to one-time purchase | "On the first page load, select the one-time subscription by default." | https://shopify.dev/tutorials/storefront-ux-guidelines-for-subscriptions | 2026-10-10 | 1 (platform docs) | consensus |
| C4 | Radios for 4 or fewer options, dropdown above | (paraphrase; page lists "radio buttons for four or fewer options") | same | 2026-10-10 | 1 | consensus |
| C5 | Subscription price must be clear | "Customers should be able to clearly identify the price of a subscription." | same | 2026-10-10 | 1 | consensus |
| C6 | Keep submit enabled; explain the problem and scroll to it | (paraphrase) | same | 2026-10-10 | 1 | consensus |
| C7 | Cart line shows the plan name, matching checkout | (paraphrase) | same | 2026-10-10 | 1 | consensus |
| C8 | Subscription buyers check price first | "Thus, users are keen to ensure that the price of the service is within their budget." | https://baymard.com/blog/new-research-consumables-subscription-services | 2026-10-10 | 3 | consensus |
| C9 | Unfindable information is as bad as missing | "Otherwise, if the information can’t be found it’s as bad as not having it at all." | same | 2026-10-10 | 3 | consensus |
| C10 | Abandonment reasons | "Extra costs too high (shipping, tax, fees)" | https://baymard.com/lists/cart-abandonment-rate | 2026-10-10 | 3 | consensus |
| C11 | Average abandonment 70.22% | (number as listed) | same | 2026-10-10 | 3 | consensus |
| C12 | Visible in-place add feedback | "Seeing list items change as they are added to the cart will make users feel that the site is responsive to their actions" | https://baymard.com/research-articles/grocery-add-to-cart-buttons | 2026-10-10 | 3 | consensus |
| C13 | WCAG 3.3.4 | "A mechanism is available for reviewing, confirming, and correcting information before finalizing the submission." | https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html | 2026-10-10 | 1 | standard |
| C14 | APG radio keyboard | "Move focus into and out of the radio group." | https://www.w3.org/WAI/ARIA/apg/patterns/radio/ | 2026-10-10 | 1 | standard |
| C15 | Nielsen H2 | "The design should speak the users' language." | https://www.nngroup.com/articles/ten-usability-heuristics/ | 2026-10-10 | 3 | consensus |
| C16 | Nielsen H5 | "the best designs carefully prevent problems from occurring in the first place." | same | 2026-10-10 | 3 | consensus |
| C17 | California ARL amendments, consent | "The law will require "express affirmative consent" for all automatic renewal and continuous service offers." | https://www.venable.com/insights/publications/2024/09/california-amends-autorenewal-law-with-stricter | 2026-10-10 | 4 (law firm summary of statute) | consensus |
| C18 | Prompt cancellation after a request | "Once a consumer indicates a request to cancel, the company must promptly process the cancellation." | same | 2026-10-10 | 4 | consensus |
| C19 | Empty states: status | "Totally empty states cause confusion about how and whether the system is working." | https://www.nngroup.com/articles/empty-state-interface-design/ | 2026-10-10 | 3 | consensus |
| C20 | Empty states: pathways | "Provide direct pathways (i.e., links) to getting started with key tasks related to populating the empty state." | same | 2026-10-10 | 3 | consensus |
| C21 | Endowed progress effect | "This research documents a phenomenon we call the endowed progress effect." | https://academic.oup.com/jcr/article-abstract/32/4/504/1787425 | 2026-10-10 | 3 (peer reviewed) | consensus |

Likely to change: auto-renewal law (state by state, federal rule status), Baymard benchmark percentages (refreshed yearly), Shopify guideline wording.
