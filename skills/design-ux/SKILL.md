---
name: design-ux
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand); do not trigger on its own for a page, screen or brand job. Covers the usability gate, navigation and information architecture, forms and validation, states and feedback, onboarding and first run, purchase and subscription flows (options, cadence, cart, checkout entry), component specs and UX reviews. Dense app UI (tables, command palettes, settings, shells) lives in design-product-ui; platform conventions live in design-playbook-mobile. Load it directly only when the user names it or asks a narrow question inside this domain alone.
---

# design-ux

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill. Accessibility floor for every rule here: design-foundations `references/accessibility.md`.

Make interfaces people understand on first sight, operate without error, and trust. Standard: what the Apple HIG authors, GOV.UK, Linear or Stripe would ship. Generic, safe or merely competent fails.

Work in this order: **gate first, then patterns, then expert moves.** Never present advanced ideas on top of a fundamentals miss.

**What lives elsewhere (do not duplicate):**
| Topic | Owner |
|---|---|
| Tables, filters bars, command palette, shortcut tiers, settings save models, app shells, density, bulk actions, dashboard states | design-product-ui |
| iOS, Android and mobile web conventions: tab bars, back, sheets, touch numbers, porting | design-playbook-mobile `references/platform-conventions.md` |
| Focus ring shape, state sheets, pressed vs hover | design-polish |
| Words on buttons, errors, empty states | design-copy |

## 1. The gate (non-negotiable, check first)

Run these 12 checks on every screen, flow and state, in order. Any fail is reported first, with severity (Nielsen scale: 4 catastrophe, 3 major, 2 minor, 1 cosmetic).

1. **Status:** every action shows feedback within 100 ms; anything over 1 s shows progress (NN/g).
2. **Location:** the current page or section is marked; the page title matches the view.
3. **Targets:** at least 24x24 CSS px (WCAG 2.5.8 AA); 44x44 on touch (FOUNDATIONS). Hit area may extend past the visual.
4. **Keyboard:** every action works by keyboard in logical order. Modals trap focus, close on Escape, return focus to the trigger (WAI-ARIA APG).
5. **Focus:** always visible, 3:1 against neighbors, never hidden behind sticky bars or drawers (WCAG 2.4.11).
6. **Labels:** every control has a visible label; option groups have a `legend`; icon-only buttons have an accessible name.
7. **Color:** no meaning by color alone; 4.5:1 text, 3:1 UI parts (FOUNDATIONS; design-color).
8. **Errors:** say what happened and how to fix it, next to the cause, keeping the user's input.
9. **No dead ends:** every screen and every state has a way back and a next step; nav items never vanish at a breakpoint without another route to them; Back restores scroll.
10. **Destructive safety:** undo for frequent destructive actions; confirm only rare, irreversible, costly ones.
11. **Semantics:** links navigate (`<a>`), buttons act (`<button>`); shareable state lives in the URL.
12. **Input freedom:** never block paste, zoom or password managers; no drag-only actions (2.5.7); never make people retype what they gave (3.3.7); no puzzle tests at login (3.3.8).

Gate details, numbers and examples: `references/01-fundamentals.md`.

## 2. Core numbers (defaults; match FOUNDATIONS)

| Thing | Default | Source |
|---|---|---|
| Feels instant / keeps flow / loses attention | 0.1 s / 1 s / 10 s | NN/g |
| Loader show delay, then minimum visible | 150 to 300 ms, then 300 to 500 ms | Vercel (practitioner) |
| Spinner vs progress bar | spinner 2 to 10 s; determinate bar plus estimate over 10 s | NN/g |
| Undo toast | at least 5 s, pauses on hover and focus (WCAG 2.2.1) | opinion on length |
| Visible options before a select | 4 | Shopify storefront guidelines |
| Mobile input text | 16 px (`--text-base`) so iOS does not zoom | Vercel; FOUNDATIONS |
| Ideal checkout | 7 to 8 fields (12 to 14 elements); average 11.3 fields in 2024 | Baymard (`references/03-forms.md`) |
| Abandonment to design against | extra costs 40%, forced account 18%, total not shown upfront 12% | Baymard |
| Setup checklist | 3 to 5 steps, count only steps truly done | opinion; Nunes and Dreze 2006 |

## 3. Decision rules by area

### Navigation and IA (`references/02-navigation-ia.md`)
- Visible beats hidden. No hamburger on desktop (hidden nav used 27% vs 48%, tasks 39%+ slower; NN/g). On phones keep the two or three most used links visible plus a labelled "Menu" (combo nav used in 89% of tasks).
- Places, not actions, in navigation. Never hide or disable a section; explain an empty one inside it.
- Lists: infinite scroll only for goal-less feeds; shops, search and docs use "Load more" or pagination; restore position on Back (Baymard).
- Filters on shop and content pages: live under 1 s, otherwise batch with "Show 128 results"; mobile tray; removable chips; all in the URL. Filter bars inside apps: design-product-ui `02-find-and-command.md`.
- App shells, sidebars and rails: design-product-ui `04-shells-density.md`. Native tab bars and back: design-playbook-mobile.

### Forms (`references/03-forms.md`)
- Delete fields first (GOV.UK question protocol). Single column, labels above, never placeholder-as-label.
- Validate on blur, clear on the fixing keystroke; fixed-length fields at full length.
- On submit: error summary with links, focus to it, identical inline wording.
- Submit stays enabled; label states the outcome ("Pay $48.00"); after press: busy, label kept, idempotency key.
- Right `type`, `inputmode`, `autocomplete`; passwords per NIST 800-63B Rev 4.

### States and feedback (`references/04-states-feedback.md`)
- Design every state before handoff: ideal, first-use empty, no-results, cleared, loading, partial, error, overflow.
- Loading never shows "No results"; empty never spins forever.
- Error ladder: inline < section banner < page banner < toast < dialog < full page. Use the lowest that works.
- Optimistic UI for high-success reversible actions; never for payments or sends to others.
- Panel-level states inside dashboards (skeletons, partial failure, stale data, permissions): design-product-ui `05-states-bulk.md`.

### Notifications (`references/04-states-feedback.md`; examples in `kb/references/patterns/09-notifications.md`)
- Ask for push permission after the first useful moment, never at first launch: after the person schedules a first task (Apple), taps a bell or places an order (Android), through a pre-prompt so a "no" does not burn the system dialog.
- One channel per event: if the person read it in the inbox, skip the email (Linear digests); hold mobile push while they are active on desktop (Slack, 1 min after lock or 10 min idle). Apple: "Avoid sending multiple notifications for the same thing."
- Split the inbox into what needs the person and everything else, with counts (Linear "Priority 4", "Other 12"); each row says why it arrived ("Lena mentioned you", GitHub reason labels). Triage is Done, snooze or save, with a way back, not delete only.
- Never put an error in a toast (Polaris); action toasts stay at least 10 s (Polaris) or until dismissed (Material, Carbon).

### Onboarding and first run (`references/05-onboarding.md`)
- Default is no tour (NN/g, 70 users: tutorials did not help). The first screen is the tutorial.
- Let people use the real product first: a demo or sample workspace before sign-up (Linear `linear.app/demo`), a lesson before the account (Duolingo), a test mode the minute the account exists (Stripe). Fold sign-up into the first real action (Vercel `/new`). Examples and links: `kb/references/patterns/01-onboarding.md`.
- Defer account, settings, permissions, ratings and payment until after first value.
- Ask for a permission only when a feature needs it, at the moment the person reaches for that feature ("only prompt for microphone access when a user clicks on the microphone button", Android). iOS primer: one "Continue" button, no exit; Android primer: always a cancel. One cross-platform primer breaks one of the two rules (`kb/references/patterns/01-onboarding.md` items 10 and 11).
- Data products: labelled sample data, a 3 to 5 step guide with a count, a live and bounded wait for the first data, a named cause and fix on failure, metrics that cannot compute yet say when they will. Each is a designed state (table in reference 05).

### Purchase and subscription flows (`references/07-commerce-flows.md`)
- Options that change what ships are visible radios in a `fieldset`, unselected unless it is the buyer's saved choice. Four or fewer stay visible; more may use a select.
- One-time purchase is the default where both exist; a subscription-only section preselects the common cadence.
- The add button stays enabled; a missing choice errors on its group and takes focus.
- The button names outcome, price and cadence; terms (renews, how to cancel online) sit right under it.
- Feedback in 100 ms and announced; open the cart drawer when the next thing the buyer needs is in it.
- Cart: shipping and total before checkout, remove with undo, guest checkout first, review before the order is final (WCAG 3.3.4).
- Quick add from a card asks the one question with no safe default in a small dialog ("Add to cart…"); never guess.

### Components (`references/06-platforms-touch-systems.md`)
- Every component spec covers purpose, anatomy, variants, all states, keyboard, ARIA, content rules, semantic tokens only.
- Hover-only affordances never on touch: scope them with `@media (hover: hover)`.

## 4. Expert moves (above the gate)

1. **Ask in the user's words.** "How do you brew?" beats "Grind size"; "How much do you drink?" beats "Frequency" (Nielsen H2). Translate system fields into questions the person can answer, and put the system value on a second line.
2. **Ask once, remember, say so.** Preselect a returning user's last answer and label it ("your usual"). The only honest way to default an option that has no safe default.
3. **The button is the summary.** "Add subscription, $18 every 2 weeks"; "Check out, $39.00". The one place everyone reads carries outcome, price and cadence.
4. **Disclose next to commit.** Renewal and cancel terms directly under the button that commits, in one calm sentence. Ethics, law and conversion agree (California ARL; DSA Art. 25; Baymard on hidden costs).
5. **Undo instead of "Are you sure?"** People confirm by habit (Raskin). Remove at once and leave an in-place "Removed X. Undo" row so nothing jumps.
6. **Frequency inverts polish.** The more often something happens, the less ceremony it gets; motion is for rare moments (Kowalski; Freiberg).
7. **Asymmetric validation timing.** Errors appear late (blur or submit), disappear early (the fixing keystroke or choice) (Baymard).
8. **"Not enough data yet" is not zero.** A metric that cannot compute shows a dash and when it will, never 0.
9. **Count only real progress.** Start a setup guide at "1 of 4" only if step 1 is truly done (endowed progress, Nunes and Dreze 2006); faked progress is a deceptive pattern.
10. **The installer is not the buyer.** Every technical setup step offers "Send to a developer" (opinion, B2B practice).
11. **Restore everything on Back:** scroll, filters, expanded rows, drafts (Baymard: over 90% of load-more sites failed).
12. **Gesture commit timing.** Reversible gestures may commit mid-gesture; destructive ones only on release; gestures track the finger 1:1 (Freiberg).
13. **Reliability is UX:** idempotent submits, autosaved drafts, offline queues.
14. **Calibrate friction to stakes** in AI and agent flows: drafts free, external actions need approval and leave a reversible trail (Nielsen).

## 5. How to answer a UX request

1. Restate the user, their goal and context (device, frequency, stakes) in one line. If unknown, state the assumption.
2. Run the gate on every state, not just the happy path. List misses first, by severity.
3. Choose patterns with the decision rules above; name the rule and the source.
4. Write the state list (each with its URL hook `?state=` when building) and the keyboard, touch and screen reader behavior.
5. Add the expert moves that apply. Mark opinion as opinion.
6. Real numbers (ms, px, counts), real labels and real error text, not placeholders.
7. Hand off: visuals to design-color, design-typography, design-layout; motion to design-motion; words to design-copy; build to design-frontend; dense app UI to design-product-ui; platform conventions to design-playbook-mobile; finish to design-polish; charts to dataviz; positioning to website-strategy; persuasion to copywriting; funnels to sales-funnels.

When building: render and lint every state (`node tools/lint.mjs page.html --states state=a,state=b`), then judge the screenshots. Two failures the lint cannot see, found in testing: a section that disappears at a breakpoint with no route to it, and a button that adds a product with a guessed option.

## 6. Reference map

| Need | Read |
|---|---|
| Gate checklist, response times, undo vs confirm, severity | `references/01-fundamentals.md` |
| Nav pattern chooser for sites, labels, pagination vs scroll, faceted filters | `references/02-navigation-ia.md` |
| Field rules, validation, errors, passwords, checkout fields | `references/03-forms.md` |
| Loading table, empty state types, error ladder, toasts, AI tasks | `references/04-states-feedback.md` |
| Onboarding chooser, permissions, sample data, first run as states | `references/05-onboarding.md` |
| What the best shipped onboarding, notifications, empty states, forms and checkout do (observed, linked) | `kb/references/patterns/01-onboarding.md`, `09-notifications.md`, `02-empty-states.md`, `06-forms-and-validation.md`, `11-checkout-and-upgrade.md` |
| Component spec template, touch expert moves | `references/06-platforms-touch-systems.md` |
| Options, one-time vs subscription, cadence, cart, checkout entry | `references/07-commerce-flows.md` |
| Review output format and worked review | `references/08-review-template.md` |

## 7. Where defaults may change
Auto-renewal law moves by jurisdiction (California amended July 2025; the US FTC rule was vacated in 2025): recheck before advising. Baymard benchmarks refresh yearly. WCAG 2.2 is the floor until WCAG 3 is a Recommendation.
