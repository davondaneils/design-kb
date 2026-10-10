# 04 Micro-interactions

## Principles
1. Every micro-interaction has a trigger, rules, feedback, and loops or modes (Saffer, Microinteractions). Specify all four, not just the animation.
2. Respond in under 100 ms, then animate. The first frame of feedback must land within the 0.1 s instant limit (Nielsen); the animation can finish later.
3. Feedback follows the input. A finger-driven element tracks the finger 1:1 with no easing; easing only begins on release (Freiberg; Apple WWDC18).
4. Small, near and quick. Feedback motion stays within the element's own bounds unless it is telling the person where something went.

## Component specs (shared tokens)
| Component | Spec | Source |
|---|---|---|
| Button press | `:active { transform: scale(0.97) }`, `transition: transform var(--duration-instant) var(--ease-standard)`. Range 0.95 to 0.98; larger buttons use values nearer 0.98. | Kowalski (P) |
| Hover (pointer only) | Color or background at `--duration-instant`; gate with `@media (hover: hover) and (pointer: fine)` so touch devices do not get stuck hover states. No hover scale on dense lists. | Kowalski (P) |
| Toggle switch | Thumb translate and track color together at `--duration-instant`, `--ease-standard`. State also shown by position and label, not color alone. | NN/g ~100 ms (C); foundation a11y |
| Checkbox | Check mark stroke draw at `--duration-instant`, or instant. | NN/g (C) |
| Tooltip | Open delay 300 to 700 ms on hover (Radix default 700), instant on keyboard focus; once one tooltip is open, neighbors open with no delay and no animation for 300 ms (Radix skipDelayDuration). Enter: opacity 0 to 1, scale 0.97 to 1 at `--duration-fast`, `--ease-enter`, origin at the trigger. Must stay open while hovered, dismiss with Esc, and persist until moved away (WCAG 1.4.13, AA). | Radix (C), Kowalski (P), W3C (C) |
| Popover, menu, select | Opacity 0 to 1, scale 0.95 to 1 from the trigger origin, `--duration-fast` to `--duration-base`, `--ease-enter`. Exit: opacity only, `--duration-fast` or less. Never scale from 0. | Kowalski (P) |
| Dialog | See 02 worked example; the overlay fades at the same time; focus moves at the start, not the end, of the animation. | Foundation a11y; opinion on focus timing |
| Toast | Enter translateY(100%) or from the stack edge plus opacity, `--duration-base`, `--ease-enter`; exit in the swipe direction at `--duration-fast`, `--ease-exit`; auto-dismiss pauses on hover and focus; content announced with `role="status"` (or `alert` for errors). | Kowalski (Sonner) (P); WCAG 2.2.1 Timing Adjustable for the pause rule (C) |
| Accordion | Height via `grid-template-rows: 0fr` to `1fr` at `--duration-base`, `--ease-standard`; chevron rotates in the same time. | Opinion; technique in 06 |
| Tabs indicator | Underline slides (shared layout) at `--duration-base`, `--ease-standard`; content swaps instantly or with a `--duration-fast` fade, never slides when tabs have no order. | Material fade through (C) |
| Loading under 1 s | Show nothing for the first 300 to 400 ms, then a spinner or skeleton, so fast responses do not flash a loader (opinion; NN/g 1 s limit). |  |
| Loading 1 to 10 s | Skeleton matching the final layout, with a shimmer at `linear` 1.5 to 2 s per cycle, or static under reduced motion. | NN/g (C); values opinion |
| Loading over 10 s | Determinate progress with percent or steps, plus a way to leave. | Nielsen 10 s limit (C) |
| Success | Checkmark draw plus color, `--duration-base`; announce with `role="status"` text. | Foundation a11y |
| Error on submit | Field border and message appear instantly; an optional horizontal shake of about 3 decaying oscillations (6, 4, 2 px) over 300 to 400 ms. No shake under reduced motion. Focus moves to the first invalid field. | Opinion; message carries the meaning |
| Number change (price, count) | Roll only the changed digits: old out at `--duration-fast` (`--ease-exit`), new in at `--duration-base` (`--ease-enter`), up for a rise and down for a fall, each digit in its own slot, with `font-variant-numeric: tabular-nums` so the width does not jitter. Never on first load. Reduced motion: changed digits crossfade at `--duration-instant`. Detail in 07. | MDN font-variant-numeric (C); opinion on motion, tested in kb/tests/design-motion.md |
| Icon swap (copy to check, play to pause) | Crossfade plus scale 0.8 to 1 and `filter: blur(2px)` to 0 at `--duration-fast`. Keep blur at or below 20 px. | Kowalski (P) |
| Hold to confirm (destructive) | Fill via `clip-path: inset(0 100% 0 0)` to `inset(0 0 0 0)` over 1.5 to 2 s `linear` while held; release reverts at `--duration-base`, `--ease-enter`. Show the remaining time in text for screen readers, and offer a non-hold alternative (confirm dialog) reachable by keyboard. | Kowalski (P); WCAG 2.1.1 Keyboard (C) |
| Drag to reorder | Picked item lifts (scale 1.02, raised shadow) instantly; siblings move at `--duration-base` with `--ease-standard`; drop settles with a spring. Keyboard alternative required (WCAG 2.5.7). | Opinion; WCAG 2.2 (C) |

## Gesture physics (expert layer)
- Track 1:1 while the pointer is down. Never apply a CSS transition to the property being dragged.
- Commit light actions during the gesture (show an overlay); commit destructive ones only on release so a change of mind costs nothing (Freiberg).
- Decide on release by velocity first, distance second: a flick above about 0.11 px/ms dismisses regardless of distance (Vaul, via Kowalski).
- Project where a throw lands: distance = (v / 1000) x r / (1 - r) with iOS normal deceleration r = 0.998, roughly half the release velocity in px/s. Snap to the nearest valid resting point to that projection, then animate there with a spring that starts at the release velocity (Apple WWDC18).
- Past a boundary, rubber-band: the element moves less the further you pull, for example offset = d x (1 - 1 / (x x 0.55 / d + 1)) where d is the container dimension (practitioner reverse-engineering of iOS; opinion).

## Do and don't
- Do: add-to-cart button morphs to "Added" with a check, cart count bumps once. Don't: fly a product image across the screen into the cart on every add.
- Do: tooltips appear instantly for neighbors. Don't: replay the delay and fade for each one as the cursor slides along a toolbar.
- Do: scale from 0.95. Don't: scale from 0 (it reads as appearing from nowhere and travels too far).

## Worked examples
1. **Add to cart on a product page.** Trigger: tap or click. Feedback within 100 ms: button press scale 0.97, the label fades through to "Added" (out at `--duration-instant`, in at `--duration-base` after it, both labels stacked in one grid cell so the width never changes) while the check draws itself, cart badge count rolls and the badge scales 1 to 1.15 to 1 over `--duration-base` once. Rules: double tap does not add twice. Loop: after 2 s the button fades through back to "Add to cart". Reduced motion: no scale or travel; the label still fades through (a plain crossfade double-exposes two labels in one box), the count crossfades at `--duration-instant`. Screen reader: `role="status"` announces "Added to cart, 3 items".
2. **Settings toggle in a mobile app.** Thumb slides at `--duration-instant`; haptic light impact on iOS (Apple HIG supports haptic pairing); state label "On" or "Off" updates. If the setting saves to a server, the toggle flips optimistically and reverts with a short shake plus an error message if saving fails.

## Hand-offs
- design-ux decides the states and error recovery; design-copy writes "Added", errors and status announcements.
- design-graphic owns icon drawing for animated icons and Lottie art.
- Conversion copy for the CTA itself belongs to the copywriting skill; motion never replaces a clear label.
