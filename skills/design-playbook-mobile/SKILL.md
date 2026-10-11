---
name: design-playbook-mobile
description: Job playbook for mobile app screens and flows on iOS, Android and mobile web, at the level of Things 3, Cash App, Monzo, Copilot Money and Linear mobile. Use for "design an app screen", "iOS app", "Android app", "mobile onboarding", "tab bar or hamburger", "port this iOS design to Android", "make it feel native", "React Native or SwiftUI screen", "mobile web app". Holds the platform conventions (Apple HIG, Material) and says which foundations and domain references to load in what order and what done looks like. Not for responsive marketing pages (design-playbook-landing) or desktop dashboards (design-playbook-dashboard).
---

# design-playbook-mobile

On a phone, the platform is half the design. People bring the habits of their system apps; break them only when the brand gains something measurable.

## 1. Load in this order
1. **design-foundations** (always): tokens, the 16-item gate, `references/accessibility.md`.
2. **This playbook's** `references/platform-conventions.md`: touch numbers, the iOS vs Android vs web table, modality, porting rules. Decide the platform first.
3. **design-ux**: `references/01-fundamentals.md`, `02-navigation-ia.md`, `04-states-feedback.md` (notifications: ask after the first useful moment, one channel per event), `05-onboarding.md` (real product first, per-platform permission primers), `03-forms.md`, `06-platforms-touch-systems.md` (component specs). Shipped examples: `kb/references/patterns/01-onboarding.md`, `09-notifications.md`, `10-permission-and-error-states.md`.
4. **design-layout**: `references/04-responsive-and-adaptive.md` (safe areas, width classes), `03-hierarchy-and-gestalt.md`.
5. **design-typography**: `references/04-hierarchy-ui-editorial.md`; support Dynamic Type and Android font scale up to 200%.
6. **design-color**: `references/ui-tokens-themes.md`; dark mode is expected on both platforms.
7. **design-motion**: `references/02-timing-easing.md` (springs), `03-choreography-transitions.md`, `04-micro-interactions.md`.
8. **design-graphic**: `references/02-icon-systems.md` (app icon, system symbols vs custom icons). **design-art-direction** `references/01-concept-and-consistency.md` when the app has illustration or onboarding art.
9. **design-copy**: `references/02-ux-microcopy.md` (alerts, permission prompts, notifications).
10. **design-frontend** for mobile web or a web mock; native code follows the platform's own toolkit.
11. **design-polish** after the lint gate passes (`references/06-polish-checklist.md`, state sheet for every control), then the self-critique loop in design-director. App screens with lists, settings or command layers also load design-product-ui `references/03-forms-settings.md` and `05-states-bulk.md`.

## 2. Non-negotiables for this job
1. Touch targets 44x44 pt on iOS, 48x48 dp on Android, 44x44 CSS px on mobile web.
2. Platform navigation and back behavior exactly as the table in `references/platform-conventions.md` says. No iOS chevrons or switches on Android, and the reverse.
3. Content clears safe areas and floating bars (`env(safe-area-inset-*)` on the web).
4. Every gesture has a visible alternative (WCAG 2.5.1, 2.5.7).
5. Text survives 200% system text size without clipping.

## 2a. Home screens: anti-generic rules
The held-out budgeting app home passed every gate and still "looked like a careful template, not a signature" (`kb/tests/heldout.md` section 5). A home screen earns its place by answering one question fast.
1. **Write the user's main question first,** in their words ("How much can I spend this month?", "What do I do today?", "What needs me?"). Everything on the first screen serves that question or moves below it.
2. **One hero number (or one list) that answers it,** stated as the answer with its basis: "$1,380 left this month", not "Balance" over a figure. It is the largest thing on screen, display size, tabular figures, and carries a pace or comparison that gives it meaning (Copilot's "Free to Spend" with an ideal-pace line; Cash App's balance; Things' Today list). `references/exemplars.md`.
3. **Real data, with honest edges.** Sample or seeded data is labelled "Sample" (design-ux `references/05-onboarding.md`); numbers sum (`truth` lint, claims inventory); amounts and dates follow the locale on `<html lang>` (FOUNDATIONS Content mechanics). Never round placeholder figures ("$1,000", "$500") on a screen that will be compared with an exemplar.
4. **No dashboard-tile grid by default.** A 2x2 or 2x3 grid of equal cards ("Income", "Expenses", "Savings", "Taxes") gives every number the same weight, so none answers the question. Use the hero, then one ordered stream or list (Monzo's single activity stream; Copilot's To Review queue). Monzo's research found its early busier home "overwhelming and confusing" (monzo.com/blog/how-we-built-the-new-home-screen). Tiles are allowed only when the user's job is comparing peers of equal weight, and then say why in the hand-over (opinion).
5. **The second block is the next action, not more totals:** the queue to review, the next bill, the next task. One filled action per screen (FOUNDATIONS item 12).
6. **Brand in the number and one control,** not in chrome: the face, tracking and color of the hero figure, and one signature control (Things' Magic Plus, Cash App's keypad). Platform navigation stays standard (section 2).
7. **First-screen check at 390x844:** the question's answer, its basis and the primary action are all visible without scrolling; nothing above the hero but the title and status bar.

## 3. Done means
1. The screen is built as a 390px HTML mock (or native code with screenshots). For HTML: `node tools/lint.mjs page.html` exits 0, `node tools/render.mjs page.html out/ --widths 390,768` renders light and dark (768 for tablet layouts), and `claims_inventory.mjs` exits 0.
2. Every `[judged]` row holds on the screenshots, plus the platform conventions table.
3. Compared with the closest exemplar in `references/exemplars.md`: Cash App (money, one number and one action), Copilot Money (budgeting, the hero number as an answer), Monzo (UK banking, ordered home, en-GB), Things 3 (calm task and list apps), Linear mobile (work tools away from the keyboard); Arc (navigation-heavy tools) and Family (wallets and onboarding warmth) from `references/signature-moves.md`. Rated on the specific moves listed there, not on overall impression. The exemplar set has no Android-first app yet; propose one to Davon when the job is Android-first.
4. Home screens pass section 2a, item by item, in the hand-over.
5. The hand-over names what is still short of the exemplar.

## 4. Reference map
| Need | Read |
|---|---|
| Touch numbers, iOS vs Android vs web conventions, modality, porting | `references/platform-conventions.md` |
| Moves the mobile exemplars share | `references/signature-moves.md` |
| Cash App, Things 3, Monzo, Copilot Money, Linear mobile: what to take from each, with evidence | `references/exemplars.md` |
