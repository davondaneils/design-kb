# 01 Purpose and restraint: should this move at all?

## Principles
1. Motion is a carrier of information, not decoration. Every animation must do one of five jobs: confirm an action (feedback), show that state changed, show where something came from or went (spatial orientation), hint how something can be used (signifier), or pull attention to something that matters (NN/g, Role of Animation).
2. The cost of an animation is paid every time it plays. Value is novelty times meaning; cost is duration times frequency. A 300 ms flourish seen 200 times a day costs a minute of waiting a day (arithmetic; opinion on the framing).
3. Motion must never be the only carrier of meaning (Apple HIG: "make motion optional"). Pair it with a static state change, text, haptics or sound.
4. People must never wait for motion. Input stays live while anything animates (Apple HIG: "let people cancel motion").

## Decision rules
**Frequency ladder** (practitioner opinion, Emil Kowalski; consistent with NN/g and Apple HIG):

| How often a person triggers it | Motion budget |
|---|---|
| 100+ times a day (command palette, keyboard shortcuts, list keyboard navigation, tab switching in a pro tool) | None. Instant state change. |
| Tens of times a day (hover, menu open, row expand) | Minimal: opacity or a short transform at `--duration-instant` to `--duration-fast`, or none. |
| A few times a session (modal, drawer, toast, page change) | Standard: tokens from 02. |
| Rare or first time (onboarding, a milestone, empty to first item) | Expressive allowed, once, skippable. |

- If the action is a keyboard shortcut or keyboard navigation (arrowing through a list, switching tabs, opening a palette with Cmd+K), do not animate the result (Kowalski, Freiberg). Activating a button with Enter or Space is not a shortcut: the result animates like a click. Scrolling a focused item into view uses the browser default.
- If you cannot name which of the five jobs the motion does, cut it.
- If the motion serves the brand only, it belongs on a rare moment or a marketing page, never in a task flow (Carbon: expressive "sparingly for significant moments").
- If the motion pulls attention away from the task (pulsing badges, shaking upsell buttons, countdown motion), treat it as a dark pattern and cut it (NN/g).
- If the product is a productivity tool, default to Carbon's "productive" character: short, subtle, ease-out. If it is a consumer brand moment, "expressive" is allowed for that moment only.

**Context lenses** (practitioner opinion, compiled from Kowalski, Krehel, Tompkins): utility and pro tools ask "should this animate at all?"; polished consumer apps ask "is this subtle enough?"; playful or portfolio work asks "what could this become?". Pick one lens per product, not per screen.

## Numbers
- 0.1 s: limit for feeling instantaneous; 1 s: limit for uninterrupted flow; 10 s: limit for attention (Nielsen). Motion that delays a result past 100 ms must earn it.
- INP "good" is 200 ms or less (web.dev). Animation work on the main thread that pushes an interaction past 200 ms is a regression, not polish.

## Do and don't
- Do: open a command palette instantly. Don't: scale it in over 200 ms.
- Do: animate a toast in, because it appears away from the user's focus and needs to be noticed. Don't: animate every list row on mount.
- Do: celebrate the first completed workout once. Don't: play confetti on every save.
- Do: let a click during an opening modal close it immediately. Don't: queue input behind an animation.

## Worked examples
1. **Dev tool command palette (Cmd+K, used 100+ times a day).** Job: none beyond showing it. Decision: no open or close animation; the results list updates instantly; only the selection highlight moves, instantly. Reason: frequency ladder and keyboard rule.
2. **Fitness app, first workout completed.** Job: reward and orientation to the streak feature. Decision: one expressive moment (checkmark draw plus streak counter), under 1.2 s total, tappable to skip, never repeated for later workouts beyond a 150 ms checkmark. Reduced motion: static badge plus haptic. Reason: rare moment, expressive budget, never blocks.
3. **SaaS settings toggle.** Job: feedback and state change. Decision: thumb slides at `--duration-instant` with `--ease-standard`, track color changes in the same time. Reason: tens of times per month, needs only confirmation.

## Hand-offs
- design-ux owns which states exist; this chapter decides whether the change between them moves.
- design-copy owns the words in success and error states; motion supports them, never replaces them.
- Brand personality comes from website-strategy (positioning). Translate "calm" or "energetic" into the expressive budget, not into slower task motion.
