# 02 Timing, easing and springs

## Principles
1. Duration scales with distance and area, and shrinks with frequency (NN/g; Material 3).
2. Things that arrive decelerate; things that leave accelerate; things that move on screen ease both ends (NN/g; Material).
3. Exits are shorter than entrances, because attention has already moved on (NN/g: 300 ms in, 200 to 250 ms out; Material 1: 225 in, 195 out).
4. Gesture-driven and interruptible motion is a spring, not a bezier, because a spring can start from any velocity (Apple WWDC18).

## Shared tokens (design-kb foundation, use these names and values)
```css
:root {
  --duration-instant: 100ms;  /* 0 to 100ms band: press, hover color, toggle thumb */
  --duration-fast: 150ms;     /* tooltips, small popovers, fades, dropdowns */
  --duration-base: 200ms;     /* 200 to 250ms band: menus, modals, accordions, toasts */
  --duration-slow: 300ms;     /* 300 to 400ms band: drawers, sheets, shared-element moves */
  --duration-page: 400ms;     /* 400 to 600ms band: route and page transitions */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1); /* on-screen moves, resizes */
  --ease-enter: cubic-bezier(0, 0, 0, 1);      /* decelerate: arriving */
  --ease-exit: cubic-bezier(0.3, 0, 1, 1);     /* accelerate: leaving for good */
}
```
The three curves are the Material 3 standard set (material-components-android Motion.md). Use the low end of each band by default; move up the band only for larger surfaces, longer travel or larger screens.

## Decision rules
**Pick duration**
| Element | Token | Notes |
|---|---|---|
| Press, hover color, checkbox, toggle thumb | `--duration-instant` | NN/g: simple feedback about 100 ms; Carbon fast-01 70 ms |
| Tooltip, small popover, fade, dropdown | `--duration-fast` | Practitioner range 125 to 250 ms (Kowalski) |
| Menu, dialog, accordion, toast, card expand | `--duration-base` | NN/g modal-size changes 200 to 300 ms |
| Drawer, bottom sheet, side panel, shared element | `--duration-slow` | NN/g large moves up to 400 ms |
| Route or page change, full-screen takeover | `--duration-page` at 400 ms | 600 ms only for marketing storytelling (see conflicts) |

- Exit: about 20 to 30 percent shorter than its entrance, or one token lower (NN/g; Material 1). A `--duration-base` dialog exits at `--duration-fast`.
- Device: tablets about 30 percent longer than phones, watches about 30 percent shorter, desktop pointer UIs shorter and simpler (Material 1). Implement as a multiplier on tokens, not new tokens.
- Never exceed 500 ms for UI the person triggers repeatedly (NN/g: about 500 ms "feels like a drag").
- If an animation feels slow, shorten it before changing the curve; if it feels abrupt, change the curve before lengthening it (opinion).

**Pick easing**
| Situation | Token |
|---|---|
| Element enters the view (menu, toast, dialog) | `--ease-enter` |
| Element leaves the view for good (drawer closes off-screen, toast flies out) | `--ease-exit`, one token shorter than its entrance (drawer: slow in, base out; toast: base in, fast out). The accelerate curve has a slow start, so never use it above `--duration-base` |
| Element closes in place (menu, popover, tooltip) | Opacity with `--ease-standard` at `--duration-fast` or less (opinion: an accelerate curve on an in-place close reads as lag; Kowalski: "ease-in is discouraged for UI") |
| Element moves or resizes while staying on screen | `--ease-standard` |
| Hover color or background shift | `--ease-standard` (or CSS `ease`) |
| Continuous motion: progress bars, spinners, marquees, hold-to-confirm fill | `linear` |
| Anything the user drags, flicks or can interrupt mid-flight | Spring (below) |

Never use `linear` for a moving object that starts or stops (NN/g). Never use the browser default `ease` as an unexamined default for entrances; it starts slower than `--ease-enter` (opinion, Kowalski).

**Pick a spring**
- Default: no bounce. Apple: "Most animations should use a damping value of 1." Material 3 spatial springs use damping ratio 0.9 (tiny overshoot); effects springs use 1.
- Spatial vs effects (Material 3, the non-obvious rule): position, size, rotation and shape may overshoot slightly; opacity and color must never overshoot. Use separate springs for the two in one transition.
- Bounce (Motion `bounce` 0.1 to 0.3, or damping ratio 0.7 to 0.85) only where a physical object was thrown or snapped, such as a sheet released with velocity or a playful brand moment (Kowalski: avoided in most UI).
- Material 3 spring tokens (damping ratio / stiffness, mass 1):

| Speed | Spatial | Effects |
|---|---|---|
| Fast (small components) | 0.9 / 1400 | 1 / 3800 |
| Default (most UI) | 0.9 / 700 | 1 / 1600 |
| Slow (full screen) | 0.9 / 300 | 1 / 800 |

- Conversions (standard damped oscillator physics): damping coefficient = 2 x ratio x sqrt(stiffness x mass). Default spatial in Motion: `{ type: "spring", stiffness: 700, damping: 48, mass: 1 }` (2 x 0.9 x sqrt(700) = 47.6). Apple's response form: stiffness = (2 pi / response)^2, so response 0.3 s gives stiffness about 439.
- Motion's designer-friendly form: `{ type: "spring", visualDuration: 0.3, bounce: 0 }`. `visualDuration` is the time to visually reach the target; the tail settles after (motion.dev).
- Pure CSS spring: generate a `linear()` easing with Jake Archibald's linear() generator and use it with a fixed duration (MDN linear(), Baseline since Dec 2023). This loses velocity hand-off, so use it only for non-interruptible moments.

## Numbers summary
- Shared tokens: 100, 150, 200 (to 250), 300 (to 400), 400 (to 600) ms.
- Reference systems: Material 3 durations 50 to 1000 ms in 50 ms steps; Carbon 70, 110, 150, 240, 400, 700 ms.
- Carbon productive easing (0.2,0,0.38,0.9) and expressive (0.4,0.14,0.3,1) are useful when a client is on Carbon; otherwise stay on the shared set.
- Practitioner extension curves (opinion, Kowalski): strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for snappy UI entrances; drawer `cubic-bezier(0.32, 0.72, 0, 1)` for iOS-like sheets. If a project adopts them, add them as `--ease-enter-strong` and `--ease-drawer`; do not redefine the shared tokens.

## Native platform mapping
- SwiftUI: `.spring(response: 0.35, dampingFraction: 1)` is the no-bounce default; use `.spring(response: 0.3, dampingFraction: 0.8)` only for a thrown sheet (Apple WWDC18 demo values). Gate with `@Environment(\.accessibilityReduceMotion)` and swap to `.easeInOut(duration: 0.15)` opacity changes.
- Jetpack Compose: `spring(dampingRatio = 0.9f, stiffness = 700f)` takes the Material 3 token values directly (spatial default); effects use `dampingRatio = 1f, stiffness = 1600f`. Material Components for Android exposes the same values as `motionSpring*` theme attributes (MDC Motion.md).
- Durations and cubic-bezier curves are the same numbers on every platform; only the API differs. Keep one token source and generate platform files (design-frontend owns the pipeline).

## Do and don't
- Do: dialog enters at 200 ms `--ease-enter`, exits at 150 ms with opacity. Don't: same 300 ms ease-in-out both ways.
- Do: a bottom sheet flicked closed keeps the finger's velocity in a spring. Don't: restart a 300 ms bezier from zero speed after release.
- Do: opacity on a spring with ratio 1. Don't: let opacity overshoot (it clamps and looks like a stall).

## Worked examples
1. **Modal and drawer spec for a B2B dashboard (desktop first).** Dialog: overlay opacity 0 to 1 at `--duration-base`, `--ease-standard`; panel opacity 0 to 1 and scale 0.95 to 1 at `--duration-base`, `--ease-enter`; exit opacity to 0 and scale to 0.97 at `--duration-fast`, `--ease-standard`. Drawer from right: translateX(100%) to 0 at `--duration-slow`, `--ease-enter`; exit at `--duration-base`, `--ease-exit`. Reason: desktop wants the low end; drawer travels further than the dialog so it gets the next token.
2. **Drag-to-dismiss bottom sheet (mobile web).** While dragging: transform follows the finger 1:1, no transition. On release: if velocity above about 0.11 px/ms downward or more than 40 percent dragged (opinion threshold; Vaul uses the velocity rule), dismiss with a spring carrying release velocity; otherwise return with `{ stiffness: 700, damping: 48 }`. Reduced motion: dismiss with a 150 ms opacity fade.

## Hand-offs
- design-frontend owns where tokens live (CSS custom properties, token JSON) and the build.
- design-ux owns gesture vocabulary; this chapter supplies the physics.
