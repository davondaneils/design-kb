# UX fundamentals: the gate

Read this first on every UX task. Nothing above the gate earns credit until every check here passes. One miss fails the review.

## Principles
1. **The interface answers three questions at all times:** Where am I? What can I do? What just happened? (Nielsen heuristics 1, 4, 6; NN/g.)
2. **Reversibility beats warnings.** People click through warnings by habit; undo protects them without slowing anyone down (Raskin, A List Apart 2007).
3. **Conventions are free usability.** Users spend most of their time in other products, so a pattern they already know costs zero learning (Nielsen heuristic 4, "consistency and standards").
4. **Speed is a feature.** 0.1 s feels instant, 1 s keeps flow, 10 s loses attention (NN/g). Design the perceived wait, not just the real one.
5. **Every state is designed.** Empty, loading, error, partial, success and overflow are part of the screen, not edge cases (see 04-states-feedback).

## The gate: 12 checks (run in this order)
| # | Check | Pass condition | Source |
|---|---|---|---|
| G1 | Status | Every action gets visible feedback within 100 ms (press state at minimum). Anything over 1 s shows progress. | NN/g response times |
| G2 | Location | Current page or section is marked (title plus active nav state). `<title>` reflects the view. | Nielsen H1; Vercel |
| G3 | Targets | Pointer targets at least 24x24 CSS px (WCAG 2.5.8 AA). Touch targets 44x44 pt iOS, 48x48 dp Android, 44x44 px touch web. Hit area may extend past the visual. | W3C; Apple; Android |
| G4 | Keyboard | Every action reachable and operable by keyboard, in a logical order; no traps except inside modals, which wrap and close on Escape. | WCAG 2.1.1; WAI-ARIA APG |
| G5 | Focus | Focus is always visible (`:focus-visible`, 3:1 contrast against adjacent colors) and never fully hidden by sticky headers, cookie bars or chat widgets (WCAG 2.4.11). | W3C |
| G6 | Labels | Every control has a visible label or, for universal icons, an accessible name. Icon-only buttons have `aria-label`. | WCAG 1.3.1, 4.1.2 |
| G7 | Color | No meaning by color alone; text 4.5:1, UI parts 3:1 (see design-color). | WCAG 1.4.1, 1.4.3, 1.4.11 |
| G8 | Errors | Errors say what happened and how to fix it, next to the cause, and keep the user's input. | NN/g error guidelines |
| G9 | Escape hatches | Every screen has a way back and a next step. No dead ends. Back button works and restores scroll. | Nielsen H3; Vercel |
| G10 | Destructive safety | Undo for frequent destructive actions; confirm only rare, irreversible, high-stakes ones. | Raskin; NN/g; Apple HIG |
| G11 | Real semantics | Navigation uses links (`<a>`), actions use `<button>`. State that should survive refresh or share lives in the URL. | Vercel; HTML spec |
| G12 | Input freedom | Never block paste, zoom or password managers. No dragging-only interactions (WCAG 2.5.7). No retyping data already given (3.3.7). | W3C; Vercel |

## Decision rules
- **If an action is frequent and reversible:** do it immediately, show a toast with Undo for at least 5 s (opinion: 5 to 10 s, matching Gmail practice; must pause on hover or focus to respect WCAG 2.2.1).
- **If an action is rare, irreversible and costly (delete account, wipe data, send to 50,000 subscribers):** confirmation dialog. Title states the action and object ("Delete project Atlas?"). Buttons name outcomes ("Delete project" / "Cancel"). No default on the destructive button; initial focus on the least destructive (WAI-ARIA APG). Typed confirmation only for the rarest cases, otherwise it becomes a habit too (NN/g).
- **If it is destructive but the user explicitly chose it (Empty Trash):** do not style the confirming button red; the red style is for destruction they did not ask for (Apple HIG Alerts).
- **If you are tempted by a Yes/No dialog:** rewrite with verb buttons. "OK" only for purely informational alerts (Apple HIG).
- **If a wait is under 1 s:** no spinner. Use pressed state and an instant optimistic result.
- **If an element looks clickable:** it must be clickable. If it is clickable, it must look clickable (no dead zones, Vercel).
- **If brand wants a custom control that replaces a platform one (date picker, select, switch):** only when it beats the native control on a measured task; otherwise style the native control. Custom controls must reproduce full keyboard and screen reader behavior from WAI-ARIA APG.

## Numbers
| Thing | Value | Source |
|---|---|---|
| Instant feedback | 100 ms | NN/g |
| Flow limit | 1 s | NN/g |
| Attention limit | 10 s, then show estimate | NN/g |
| Productivity target | under 400 ms system response | Doherty and Thadani 1982 |
| Server mutation budget | under 500 ms | Vercel (practitioner) |
| WCAG pointer target floor | 24x24 CSS px | WCAG 2.5.8 AA |
| Touch default | 44x44 (Apple pt, web px), 48x48 dp Android | Apple HIG; Android |
| Focus indicator | 3:1 contrast, 2 px thick perimeter (AAA ideal) | WCAG 1.4.11, 2.4.13 |
| UI animation | under 300 ms; foundations: fast 150 ms, base 200 to 250 ms | Kowalski (practitioner); FOUNDATIONS |

## Do and don't
- Do: "Delete 3 invoices? INV-1042, INV-1043, INV-1051. You can restore them from Trash for 30 days." Don't: "Are you sure?" with Yes / No.
- Do: archive with "Archived. Undo" toast. Don't: a modal on every archive.
- Do: `<a href="/projects/atlas">` for a row that opens a page. Don't: `<div onclick>` that breaks Cmd+click.
- Do: `?status=open&sort=due` in the URL. Don't: filters that vanish on refresh.

## Expert moves (above the gate)
- **Frequency inverts polish.** The more often something happens, the less ceremony it gets: no animation on keyboard actions or command palettes, instant menus, motion reserved for rare moments (Kowalski; Freiberg). Generalists animate everything equally.
- **Commit timing on gestures.** Reversible gestures may commit mid-gesture (peek); destructive ones commit only on release, regardless of distance (Freiberg). Gestures track the finger 1:1 and are interruptible; never play a canned animation after a threshold.
- **Severity ladder.** Match interruption to stakes: inline text < banner < toast < modal < full page. Most teams overuse modals; Apple HIG says avoid alerts that are informative but not actionable.
- **Reliability is UX.** Idempotency keys on submit, retries that do not double-charge, drafts that survive a crash. Nobody sees these until they fail.
- **Run the heuristics as a severity-ranked list**, not a recital: 0 not a problem, 1 cosmetic, 2 minor, 3 major, 4 catastrophe (Nielsen severity scale, NN/g "Severity Ratings for Usability Problems"). Report catastrophes first.

## Hand-offs
- Contrast, focus ring color: design-color. Token `--color-focus-ring`.
- Motion durations and reduced motion: design-motion (FOUNDATIONS durations).
- Error and button wording: design-copy.
- Semantic HTML, ARIA implementation, performance budgets: design-frontend.
