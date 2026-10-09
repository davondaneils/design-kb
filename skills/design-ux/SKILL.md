---
name: design-ux
description: UX and interaction design for websites, web apps and iOS/Android apps. Use when designing, specifying, reviewing or critiquing user flows, screens, navigation, information architecture, forms, sign-up, checkout, onboarding, first-run, empty/loading/error/success states, toasts, modals, dialogs, confirmations, undo, mobile and touch patterns, gestures, Apple HIG or Material conventions, design system components and their states, or AI and long-running task UX. Triggers on phrases like "UX review", "usability", "user flow", "wireframe", "how should this screen work", "navigation for", "hamburger or tabs", "filters", "infinite scroll or pagination", "form design", "validation", "onboarding", "empty state", "loading state", "error message placement", "is this accessible to use", "port to Android", "component spec". Not for pure visual styling (design-color, design-typography, design-layout) or persuasion copy (copywriting).
---

# design-ux

Make interfaces that people understand on first sight, operate without error, and trust. Standard: what the Apple HIG authors, GOV.UK, Linear or Stripe would ship. Generic, safe or merely competent fails.

Work in this order: **gate first, then patterns, then expert moves.** Never present advanced ideas on top of a fundamentals miss.

## 1. The gate (non-negotiable, check first)

Run these 12 checks on every screen or flow, in order. Any fail is reported first, with severity (Nielsen scale: 4 catastrophe, 3 major, 2 minor, 1 cosmetic).

1. **Status:** every action shows feedback within 100 ms; anything over 1 s shows progress (NN/g).
2. **Location:** the current page/section is marked; the page title matches the view.
3. **Targets:** pointer targets at least 24x24 CSS px (WCAG 2.5.8 AA). Touch: 44x44 pt iOS, 48x48 dp Android, 44x44 px web. Hit area may extend past the visual.
4. **Keyboard:** every action works by keyboard in logical order. Modals trap focus, close on Escape, return focus to the trigger (WAI-ARIA APG).
5. **Focus:** always visible, 3:1 against neighbors, never fully hidden behind sticky bars, cookie banners or chat bubbles (WCAG 2.4.11).
6. **Labels:** every control has a visible label; icon-only buttons have an accessible name.
7. **Color:** no meaning by color alone; 4.5:1 text, 3:1 UI parts (FOUNDATIONS; design-color).
8. **Errors:** say what happened and how to fix it, next to the cause, keeping the user's input.
9. **No dead ends:** every screen has a way back and a next step; browser/system Back works and restores scroll.
10. **Destructive safety:** undo for frequent destructive actions; confirm only rare, irreversible, costly ones.
11. **Semantics:** links navigate (`<a>`), buttons act (`<button>`); shareable state (filters, tabs, pages) lives in the URL.
12. **Input freedom:** never block paste, zoom or password managers; no drag-only actions (2.5.7); never make people retype what they gave (3.3.7); no memory or puzzle tests at login without an alternative (3.3.8).

Gate details, numbers and examples: `references/01-fundamentals.md`.

## 2. Core numbers (defaults; match FOUNDATIONS)

| Thing | Default | Source |
|---|---|---|
| Feels instant / keeps flow / loses attention | 0.1 s / 1 s / 10 s | NN/g |
| Loader show delay, then minimum visible | 150 to 300 ms, then 300 to 500 ms | Vercel guidelines (practitioner) |
| Spinner vs progress bar | spinner 2 to 10 s; determinate bar plus estimate over 10 s | NN/g |
| Skeleton | full-page loads 1 to 10 s, mirrors final layout exactly | NN/g; Vercel |
| UI transition | fast 150 ms, base 200 to 250 ms; none on keyboard-driven or very frequent actions; slow and page durations only for large spatial transitions | FOUNDATIONS; Kowalski |
| Undo toast | at least 5 s, pauses on hover/focus (opinion; WCAG 2.2.1) | |
| iOS tabs / Android nav bar | 3 to 5 destinations | Apple HIG; Android |
| Breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 | FOUNDATIONS |
| Mobile input text | 16 px minimum (`--text-base`) to stop iOS zoom | Vercel; FOUNDATIONS |
| Ideal checkout | 7 to 8 fields (12 to 14 elements); US average 14.88 | Baymard |

## 3. Decision rules by area

### Navigation and IA (`references/02-navigation-ia.md`)
- Visible beats hidden. No hamburger on desktop (hidden nav: used 27% vs 48%, tasks 39%+ slower; NN/g). On mobile prefer a bottom bar or visible key links plus menu (combo nav used in 89% of tasks).
- Tabs and sidebars are for places, never actions. Never hide or disable a tab; explain an empty section inside it (Apple HIG).
- iOS: tab bar, 5 or fewer. Android: nav bar under 600 dp, rail at 600 dp+, optional drawer at 840 dp+. Web app: sidebar at lg 1024+, icon rail below.
- Over 5 primary items: regroup by usage data; overflow into "More"; priority+ on the web.
- Lists: infinite scroll only for goal-less feeds. Shops, search and docs use "Load more" or pagination (Baymard: categories 10 to 30 lazy-loaded to 50 to 100 then "Load more"; mobile 15 to 30). Always restore list position on Back.
- Filters: live update if results return in under 1 s; otherwise batch with Apply labelled by count ("Show 128 results"). Mobile: right-side tray over dimmed results, entry labelled "Filter". Applied filters as removable chips; all in the URL (NN/g).
- Over about 20 destinations or power users: add Cmd/Ctrl+K as an accelerator, not the only path.

### Forms (`references/03-forms.md`)
- Delete fields first: each question needs a reason, a user of the answer and a check (GOV.UK question protocol).
- Single column, labels above, never placeholder-as-label. Mark required and optional (or only "(optional)" when most are required).
- Validate on blur; fixed-length fields at full length; passwords live after first blur. Remove an error on the keystroke that fixes it (Baymard).
- On submit: error summary at top with links, focus to it, inline messages with identical wording, "Error: " prefix on the page title (GOV.UK).
- Submit stays enabled; label states the outcome ("Pay $48.00"); after press: disabled, spinner, label kept, idempotency key.
- Right `type`, `inputmode`, `autocomplete` on every field; avoid `type="number"`; one full-name field; memorable dates as 3 fields; OTP as one paste-friendly field.
- Passwords follow NIST 800-63B Rev 4: length over composition (15+ single-factor), no forced rotation, paste and managers allowed, show toggle, blocklist with reason.
- One thing per page for infrequent or branching public flows; one page for short frequent forms.

### States and feedback (`references/04-states-feedback.md`)
- Design all states before handoff: ideal, first-use empty, no-results empty, cleared, loading, partial, error, overflow (very long names, 0 and 10,000 items).
- Loading never shows "No results"; empty never shows a spinner forever.
- Error severity ladder: inline < section banner < page banner < toast < dialog < full page. Use the lowest that works. Partial failure stays partial.
- Optimistic UI for high-success reversible actions; never for payments or sends to others.
- AI and long tasks: preview plan and cost, stream progress, allow cancel and leave, summarize what changed and what can be undone, flag low confidence (Nielsen).

### Onboarding (`references/05-onboarding.md`)
- Default is no tour. Tutorials did not raise success and made tasks feel harder (NN/g, 70 users). Make the first screen the tutorial.
- Defer account, settings, permissions, ratings and payment until after first value.
- Ask permissions in context when the feature is first used, with a specific purpose sentence (Apple HIG Privacy).
- Data products: honest, labeled sample data plus a 3 to 5 step skippable checklist.
- Define one activation event and measure time to reach it (practitioner consensus).

### Platforms, touch, components (`references/06-platforms-touch-systems.md`)
- Native first; change visuals, not behavior. Never ship iOS chevrons and switches on Android or vice versa.
- Primary content in the screen center; secondary actions on top and bottom edges; tertiary in corner menus (Hoober 2017).
- Modals: only when they help, short, one at a time, obvious dismissal, confirm before discarding user content (Apple HIG).
- Alerts: verb button titles, "Cancel" exactly, no "Yes/No", no "OK" unless informational; red style only for destruction the user did not deliberately choose.
- Every component spec covers: purpose, anatomy, variants, all states (default, hover, focus-visible, pressed, disabled, loading, selected, error), keyboard, ARIA, content rules, semantic tokens only.
- Hover-only affordances never on touch; scope them with `@media (hover: hover)`.

## 4. Expert moves (above the gate)

These separate top studios from strong generalists. Use them once the gate passes.

1. **Frequency inverts polish.** The more often an interaction happens, the less ceremony it gets: no animation on keyboard actions, command palettes or menus used all day; save motion for rare moments (Kowalski; Freiberg).
2. **Undo instead of "Are you sure?"** People confirm warnings by habit (Raskin). Turn irreversible acts into reversible ones: soft delete with Trash, delayed send with Undo.
3. **Gesture commit timing.** Reversible gestures may commit mid-gesture (peek); destructive ones only on release. Gestures track the finger 1:1 and can be interrupted (Freiberg).
4. **Asymmetric validation timing.** Errors appear late (blur), disappear early (keystroke) (Baymard).
5. **Anti-flicker loading.** Delay, then minimum display; skeletons pixel-identical to final layout.
6. **Restore everything on Back:** scroll position, filters, expanded rows, form drafts. Size the scrollbar to the full list so the footer stays reachable (Baymard).
7. **Partial failure and stale-while-revalidate.** Show cached content with "Updated 2 min ago" and refresh in place; one failed card shows an in-card Retry, not a full-page error.
8. **Hit area is not visual size.** A 20 px icon gets an invisible 44 px target; layouts reserve the room.
9. **Prediction cones** on submenus so diagonal mouse travel does not close them.
10. **Redundant entry is a WCAG failure now.** Prefill everything known; "billing same as shipping" on by default.
11. **Reliability is UX:** idempotent submits, autosaved drafts, offline queues. Invisible until they fail.
12. **Calibrate friction to stakes** in AI and agent flows: drafts are free, external actions need explicit approval and leave a reversible trail (Nielsen).

## 5. How to answer a UX request

1. Restate the user, their goal and context (device, frequency, stakes) in one line. If unknown, state the assumption.
2. Run the gate. List misses first, by severity.
3. Choose patterns with the decision rules above; name the rule and the source.
4. Specify all states and the keyboard, touch and screen reader behavior, not just the happy path.
5. Add the expert moves that apply. Mark opinion as opinion.
6. Give real numbers (ms, px, counts), real labels and real error text, not placeholders.
7. Hand off: visuals to design-color, design-typography, design-layout; motion to design-motion; words to design-copy; build to design-frontend; search UI to design-search; charts to dataviz; tables and dense tool UI to design-product-ui (planned); positioning to website-strategy; persuasion to copywriting; funnel structure to sales-funnels.

## 6. Reference map

| Need | Read |
|---|---|
| Gate checklist, response times, undo vs confirm, severity | `references/01-fundamentals.md` |
| Nav pattern chooser, labels, pagination vs scroll, worked SaaS example | `references/02-navigation-ia.md` |
| Field rules, validation, errors, passwords, checkout, worked sign-up | `references/03-forms.md` |
| Loading table, empty state types, error ladder, toasts, AI tasks | `references/04-states-feedback.md` |
| Onboarding chooser, permissions, sample data, worked data SaaS | `references/05-onboarding.md` |
| Touch numbers, iOS/Android/web convention table, modals, component spec | `references/06-platforms-touch-systems.md` |
| Review output format and worked review | `references/07-review-template.md` |

## 7. Where defaults may change

Platform guidance moves yearly (Apple iOS 26 floating tab bars, Android large and extra-large width classes). Re-check HIG and Android docs before shipping native work. WCAG 2.2 is the floor until WCAG 3 is a Recommendation.
