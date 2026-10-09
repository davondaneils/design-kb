# Research: 04 Micro-interactions

Status key: C = consensus, P = practitioner opinion, S = single source.

| Claim | Source | Status |
|---|---|---|
| Microinteraction anatomy: trigger, rules, feedback, loops and modes. | Dan Saffer, Microinteractions (O'Reilly, 2013) | C (canonical book) |
| Simple feedback (checkbox, toggle) about 100 ms. Hover previews slightly delayed; hover feedback on a key button must be very fast. | NN/g Animation Duration | C |
| Button press: `transform: scale(0.97)` on `:active`, range 0.95 to 0.98, `transition: transform 160ms ease-out`. | Kowalski skill | P |
| Never enter from `scale(0)`; start at 0.95 plus opacity 0 (0.9 or higher). | Kowalski skill; kylezantos compilation | P |
| Tooltips: delay first open to prevent accidental triggers; once one is open, neighbors open instantly with no animation. Radix defaults: delayDuration 700 ms, skipDelayDuration 300 ms. | Kowalski; Radix docs | P + C |
| Gate hover effects with `@media (hover: hover) and (pointer: fine)`. | Kowalski skill (media features documented on MDN) | P |
| Gestures: apply input immediately, animate past a threshold; light actions can trigger mid-swipe, destructive ones on release; keep momentum and angle on throw. | Rauno Freiberg | P |
| Momentum projection: projected distance = (v / 1000) x r / (1 - r), with UIScrollView normal deceleration r = 0.998 (so roughly v x 0.5 px for v in px/s); snap to nearest valid target; pass gesture velocity to the spring. | WWDC18 via Gitter; UIKit DecelerationRate (value from UIKit; docs page not machine readable) | C |
| Rubber banding: diminishing offset such as offset^0.7 (Gitter) or the iOS-like f(x) = (1 - 1 / (x c / d + 1)) d with c = 0.55. | Gitter; c = 0.55 is a widely shared reverse-engineered constant | P |
| Flick-to-dismiss on velocity above about 0.11 px/ms regardless of distance (Vaul). | Kowalski skill | P |
| Hold-to-confirm: fill over 2 s linear while held; release reverts in 200 ms ease-out. | Kowalski skill | P |
| Skeleton screens communicate that the system is not ready. | NN/g Role of Animation | C |
| Exits faster than enters; "slow when the user is deciding, fast when the system responds". | Kowalski; NN/g | P + C |
| Crossfade blur: `filter: blur(2px)` with opacity during swaps; keep blur under 20 px (expensive, especially in Safari). | Kowalski skill | P |
| Apple: supplement motion feedback with haptics and audio; feedback motion must match the gesture (slide down to reveal, slide up to dismiss). | Apple HIG Motion | C |

## Sources
- Dan Saffer, Microinteractions: Designing with Details, O'Reilly 2013
- https://www.nngroup.com/articles/animation-duration/
- https://rauno.me/craft/interaction-design
- https://tessl.io/registry/skills/github/emilkowalski/skill/emil-design-eng
- https://www.radix-ui.com/primitives/docs/components/tooltip
- https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5
- https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate
- https://developer.apple.com/design/human-interface-guidelines/motion
