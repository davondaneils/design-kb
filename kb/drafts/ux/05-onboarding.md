# Onboarding and first run

## Principles
1. **The product is the tutorial.** Deck-of-cards tutorials did not improve task success (91% vs 94% for skippers) and made tasks feel harder (NN/g, 70 users). Spend the effort on the UI.
2. **Value before investment.** Let people do the core thing before asking for accounts, settings, permissions, ratings or payment (Apple HIG Onboarding; Baymard 18% abandon on forced accounts).
3. **Teach in context, one thing at a time** (Apple HIG: context-specific tips beat one flow).
4. **Onboarding has a finish line:** a defined activation event, measured by time to value (practitioner consensus, opinion).

## Pattern chooser
| Situation | Pattern |
|---|---|
| Simple app, familiar patterns | No onboarding. Good empty states and defaults. |
| One core action people must learn (gesture, novel interaction) | Interactive first task: do it for real, with safe sample content |
| Product needs setup before value (connect data, invite team) | Setup checklist of 3 to 5 steps with progress, skippable steps, sample data shown meanwhile |
| Personalization genuinely changes the product | 1 to 3 preference questions, each visibly changing the result; skippable |
| Complex pro tool | Contextual tips on first encounter, help center, optional tour findable later |

## Decision rules
- **If you are writing more than 3 intro slides:** delete them. Put the value proposition on the store page or sign-up page instead.
- **If a tutorial exists:** make it optional; if skipped, do not show again but keep it findable in Help or Settings (Apple HIG).
- **If a permission is needed:** ask when the person first uses the feature that needs it, with a specific purpose string. Only ask at launch if the app cannot work without it (navigation needs location) (Apple HIG Privacy). An explanatory screen before the system prompt is allowed; incentives, fake alerts or pictures of the alert are not (App Review).
- **If a permission is denied:** the feature degrades gracefully and shows how to enable it in Settings when the person next tries it. Never nag on every launch.
- **If sign-up is required:** collect the minimum (email or SSO), defer profile details to the moment they are used.
- **If the product is empty until data arrives:** show realistic sample data, clearly labeled, that is replaced when real data arrives (NN/g suggests demo data in empty states).
- **Ratings and upsells:** only after a success moment, never during first session (Apple HIG).

## Numbers
- Setup checklist: 3 to 5 items (opinion; beyond 5 completion visibly drops in practitioner reports, unverified).
- Preference questions: 1 to 3 (opinion).
- Time to first value target: under 60 s for consumer apps (opinion, practitioner benchmark).

## Do and don't
- Do: a habit app opens straight into "What do you want to do daily?" with 6 suggestions and a custom option, and the first habit appears on the home screen. Don't: 4 swipe-through slides about "building better habits".
- Do: ask notification permission after the first habit is created: "Want a reminder at 8:00 for 'Read 10 pages'?" then the system prompt. Don't: system prompt on first launch.

## Worked example: team analytics SaaS that needs a data connection
1. Activation event: first dashboard with the team's own data viewed by 2 or more people.
2. After SSO sign-up, land in a dashboard filled with labeled sample data ("Sample data. Connect your source to see yours.") so value is visible in seconds.
3. Checklist in a side panel: Connect a source (with the 3 most common sources as one-click buttons), Pick a template, Invite a teammate. Each step skippable; progress persists.
4. Connection takes 2 to 15 minutes: progress with estimate, "We'll email you when it's ready", let them explore sample data meanwhile (NN/g progress; Apple HIG loading).
5. When real data arrives, swap in place and celebrate once, briefly.

## Expert moves
- **Sample data with an honest label** is the strongest empty-state move for data products: it shows the payoff before the work.
- **Pre-permission context in the flow**, triggered by intent, roughly doubles the chance the request makes sense to the person (Apple guidance; the "doubling" is practitioner lore, unverified, do not quote as fact).
- **Progressive disclosure across sessions**, not in session one: tip 2 appears on the second relevant encounter, not in a tour.
- **Measure tutorial cost in total time**, including the tutorial itself (NN/g excluded it from task times, so real burden is higher).

## Hand-offs
- Positioning and the promise onboarding must deliver on: website-strategy.
- Onboarding emails and lifecycle sequences: behavioral-email-sequencing (user skill) and copywriting.
- Motion for tips and checklists: design-motion.

## First run as states (data products)
Rendered in `kb/tests/design-ux/dashboard.html` (`?state=first-run`, `listening`, `check-failed`, `first-data`). Research: NN/g empty states (C19, C20 in `kb/research/ux/07-commerce-flows.md`), Nunes and Dreze 2006 (C21).

| State | What the screen shows | Primary action | Announced |
|---|---|---|---|
| First run | Setup guide panel above the KPIs; every panel filled with sample data, each marked "Sample" in text, not color alone | Install snippet | nothing (page load) |
| Listening | The install step shows "Waiting for the first event from acme.com" with the time it started; troubleshooting appears after a stated delay | Copy snippet (already done), then Check installation | "Listening for events" once, politely |
| Check failed | The cause, named ("Snippet found, but blocked by your Content-Security-Policy"), the exact fix, and who can do it | Copy the fix, or Send to a developer | the cause, politely, not as an alert |
| First data | One-line success in the guide ("First events arrived: 38 page views from 12 visitors"), real numbers replace sample, metrics that need more data say when they will compute | Next step in the guide | the success line |

Rules
- **Sample data is labelled where it is read**, on every panel ("Sample data" chip plus an answer line that says so), and never mixed with real numbers in one panel.
- **"Not enough data yet" is not zero.** A metric that cannot compute shows a muted dash and the condition ("Needs 7 days of data, Oct 17"), never 0 or 0% (opinion; NN/g C19 system status).
- **The guide has a finish line and a count** ("1 of 4 done"), each step skippable, the guide hideable and findable again from the sidebar. Count only steps that are truly done (workspace created counts; endowed progress, C21). Never fake progress.
- **The person who signs up is often not the one who installs** (opinion, common in B2B analytics): every technical step offers "Send to a developer" with a prefilled email, not only a code block.
- **The wait is live and bounded.** Say what is being waited for and since when, and when troubleshooting will appear; never a spinner without words (NN/g progress indicators in 04).
- **Success swaps in place, once.** The KPI row changes from sample to real without a page reload, the guide ticks the step, and nothing celebrates again on later visits.
