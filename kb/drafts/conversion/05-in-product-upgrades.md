# 05 In-product upgrade and trial prompts

When and how a SaaS product asks for money without breaking the work people came to do. Sources: `kb/research/conversion/05-in-product-upgrades.md`. **Evidence warning:** no tier 1 to 3 study of upgrade prompt timing was found. The floor rests on NN/g (C36), Apple's rules (C37) and the foundations; the timing rules are opinion and labelled so.

## Floor: fundamentals (non-negotiable)
1. **No modal for something unrelated to the user's current goal** (C36). An upgrade modal on load or mid-task fails. A modal is allowed only when the user's own action is blocked by the limit, and then it explains and offers a way out. [judged]
2. **Describe what the user gets for the price before asking**: units, not adjectives ("50M events a month, 2 years of history") (C37). [judged]
3. **The screen keeps one primary action.** Upgrade is secondary (outlined or text) unless the user is blocked. [judged]
4. **Numbers, not color alone.** A usage meter shows the count and the limit in text ("8.6M of 10M events"); warning states carry an icon and a word (FOUNDATIONS item 11). [judged]
5. **Say what happens if they do nothing**: what stops, when, and what is kept (C37b for trials). [judged]
6. **Right person, right button.** A member without billing rights never gets a "Buy" button; they get the admin's name and a way to ask. [judged]

## Principles
- The best upgrade prompt is a meter the user already trusts. Surprise at 100% feels like a trap; a number seen weekly feels like a plan (opinion).
- Ask at the moment of value: when the user reaches for something the next plan does, not when the product wants revenue (opinion).
- Never hold the user's own data hostage. Keep it readable; limit new intake or new features instead (opinion; also a trust fundamental, C19 "up-front disclosure").

## Trigger table (opinion, built on C36)
| Moment | Prompt | Form |
|---|---|---|
| Usage under 75% | None beyond the quiet meter | Sidebar or settings meter |
| 75 to 99% | Meter turns warning, one inline notice with the projected date | Inline banner in context, dismissible for 7 days |
| 100%, intake paused or overage starts | Notice in the "Needs attention" area with exact consequence | Inline, persistent until resolved |
| User clicks a gated feature | Explain in place: what it does, which plan, price | Popover or inline panel at the control |
| User's action blocked (cannot save, cannot invite) | Dialog that names the block, keeps their work, offers upgrade and a non-paying path | Modal, only here |
| Trial ending | Banner 7 days and 1 day before, with the date and what changes | Inline, top of content |
| On load, unrelated to any limit | Nothing | |

## Prompt anatomy
1. Icon plus label word ("Warning:" or "Limit:").
2. The fact in numbers: "You have used 9.2M of 10M events this month."
3. Projection: "At this rate you reach the limit on Oct 24."
4. Consequence of doing nothing: "After that, new events are dropped until Nov 1. Your reports stay."
5. The offer in units and price: "Growth: 50M events, $149 a month."
6. Actions: secondary "Compare plans" or "Upgrade to Growth"; tertiary "Dismiss for 7 days". For members: "Ask Priya Shah (billing admin)".

## Numbers
- Meter: 4 to 8px track, `--radius-full`, fill `--color-text` under 75%, `--color-warning` at 75% and up, `--color-danger` at 100%. The fill meets 3:1 against the track and the surface (WCAG 1.4.11); the track has a ring so its end is visible. Count and limit always in text beside it, tabular. Use `<meter>` or `role="meter"` with `aria-valuetext` ("6.1 million of 10 million events").
- Banner padding `--space-4` / `--space-5`, inside the content column, never above the global header.

## Ceiling: exemplar patterns
- Vercel publishes allowance then rate ("1M / month included", "Starting at $0.40 per 1M") and states the free tier's caps plainly (C46). The in-product mirror is a usage page with the same units.
- The Tally dashboard already routes a restricted member to "Ask Priya Shah" for revenue (combined page `?state=viewer`); the same pattern applies to billing.

## Signature moves
1. **Meter before wall.** A small, always-present usage line in the sidebar foot, in numbers. When the warning comes, the user already knows the scale.
2. **Projection, not percent.** "Reaches the limit Oct 24" is a plan; "92% used" is an alarm (opinion).
3. **Consequence and safety in one line.** "New events pause on Oct 24; nothing you have is deleted." It removes the fear that drives angry churn.
4. **Upgrade in the user's units.** The offer names the unit they are short of ("50M events"), not the plan's feature list.
5. **Role routing.** For members: the admin's name and a prefilled request, not a dead button.
6. **The ask lives in "Needs attention".** If the dashboard has an alerts area, the limit notice is one alert among them, styled as a warning, ranked below data errors. It does not get its own colored hero.

## Do and don't
| Do | Don't |
|---|---|
| "9.2M of 10M events, reaches limit Oct 24" | "You're almost out! Upgrade now" |
| Inline notice with dismiss for 7 days | Modal on every load |
| Keep reports readable after the cap | Lock the dashboard |
| "Ask Priya Shah" for members | "Upgrade" button that errors for members |

## Worked example: Tally dashboard
Sidebar foot gains a meter: "Events this month, 6.1M of 10M, Starter plan". `?state=limit`: meter at 92% in warning; a warning alert in "Needs attention": "Warning: 9.2M of 10M events used. At this rate you reach the limit on Oct 24; new events pause until Nov 1 and every report stays." Actions: outlined "Compare plans", ghost "Dismiss for 7 days". "Share report" stays the only filled button.

## Hand-offs
- Alerts and states: design-ux 04, design-product-ui 05. Billing settings: design-product-ui 03. Onboarding to the aha moment: design-ux 05. Lifecycle email is not a design-kb job.
