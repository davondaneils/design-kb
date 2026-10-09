---
name: design-motion
description: Motion and micro-interaction design for web and app UI. Use whenever a task involves animation, transitions, motion specs, easing curves, durations, springs, hover or press effects, micro-interactions (buttons, toggles, tooltips, toasts, loaders, success and error feedback), page or route transitions, View Transitions, scroll animations, parallax or scroll reveals, stagger and choreography, gestures (drag, swipe, flick to dismiss), prefers-reduced-motion and vestibular accessibility, animation performance and jank, or implementation in CSS transitions and keyframes, the Web Animations API, Motion (Framer Motion) or Lottie. Triggers on phrases like "animate this", "add a transition", "make it feel smoother or snappier", "onboarding animation", "motion spec", "easing", "spring", "micro-interaction", "why is this animation janky", "reduced motion". Do not use for static visual styling with no state change.
---

# design-motion

Motion is information about change: what happened, where it came from, where it went, what to do next. This skill makes Claude decide whether something should move, then specify and build it to the standard of the best interface teams (Apple, Linear, Vercel, Material, Carbon), safely for everyone.

Builds on the design-kb shared foundation contract. Tokens, durations and curves below match it; deviate only where this skill says how.

## 1. Fundamentals gate (non-negotiable, check first)

A motion proposal that misses any one of these fails, however polished the rest is.

1. **Purpose.** Each animation does one named job: feedback, state change, spatial orientation, signifier, or attention (NN/g). No job, no motion.
2. **Frequency.** Actions done 100+ times a day, keyboard shortcuts and keyboard navigation (arrowing through lists, tabs, palettes) do not animate. Pressing Enter on a button that opens a dialog is not a shortcut; the dialog animates normally. Tooltips after the first open instantly (Kowalski, practitioner; Apple HIG: avoid motion on frequent interactions).
3. **Never block.** Input stays live during every animation; any animation can be interrupted and retargeted (Apple HIG: "let people cancel motion").
4. **Tokens only.** Durations and easing come from the shared tokens (section 2). No ad hoc `0.35s ease-in-out`.
5. **Within the band.** UI people trigger stays between 100 and 400 ms; nothing repeated exceeds 500 ms (NN/g); only marketing storytelling reaches 600 ms. Exits are one token shorter than entrances.
6. **Right curve.** Enter decelerates, permanent exit accelerates, on-screen moves use standard, continuous motion is linear, anything dragged or flicked is a spring. Never `linear` on an object that starts and stops.
7. **Reduced motion is designed, not deleted.** Under `prefers-reduced-motion: reduce`, movement (translate, scale, rotate, parallax, zoom) is replaced by a crossfade or instant change at the same or shorter token; decorative loops stop; meaning survives (Apple reduced-motion criteria; WCAG 2.3.3).
8. **WCAG floor.** Auto-playing motion over 5 s beside content has a pause control (2.2.2, A). Never more than 3 flashes per second (2.3.1, A). Hover or focus content stays dismissible and hoverable (1.4.13, AA). Drag has a non-drag alternative (2.5.7, AA). Motion is never the only carrier of meaning.
9. **Compositor only.** Animate `transform` and `opacity`. Never `width`, `height`, `top`, `left`, `margin`, `padding` or `box-shadow` directly (web.dev).
10. **First paint is sacred.** Never fade in above-the-fold content or the LCP element from opacity 0; content must be visible if JS or the animation never runs (web.dev LCP).

## 2. Tokens (shared foundation)

```css
--duration-instant: 100ms;  /* 0 to 100: press, hover color, toggle, checkbox */
--duration-fast:    150ms;  /* tooltip, small popover, dropdown, fades, most exits */
--duration-base:    200ms;  /* 200 to 250: menu, dialog, accordion, toast */
--duration-slow:    300ms;  /* 300 to 400: drawer, sheet, shared element */
--duration-page:    400ms;  /* 400 to 600: route change; above 400 only for marketing */
--easing-standard: cubic-bezier(0.2, 0, 0, 1);  /* on-screen move or resize */
--easing-enter:    cubic-bezier(0, 0, 0, 1);    /* decelerate: arriving */
--easing-exit:     cubic-bezier(0.3, 0, 1, 1);  /* accelerate: leaving for good */
```
Ready-to-use file: `assets/motion-tokens.css`. Use the low end of a band by default; move up for larger area, longer travel or larger screens (tablet about x1.3, watch about x0.7, desktop pointer UI at the low end: Material 1).

## 3. Decision rules

**Should it move?**
| Frequency | Budget |
|---|---|
| 100+ a day, keyboard shortcuts, keyboard navigation | None |
| Tens a day (hover, menus, rows) | Opacity or tiny transform at instant to fast, or none |
| A few per session (dialog, drawer, toast, page) | Standard tokens |
| Rare or first time (onboarding, milestones) | Expressive allowed, once, skippable |

**Duration and easing at a glance**
| Element | Enter | Exit |
|---|---|---|
| Button press | scale 0.97, instant, standard | release, instant |
| Tooltip | delay 300 to 700 ms, then opacity plus scale 0.97 to 1, fast, enter, from trigger | opacity, fast or less |
| Popover, menu, select | opacity plus scale 0.95 to 1, fast to base, enter, from trigger | opacity, fast, standard |
| Dialog | opacity plus scale 0.95 to 1, base, enter, centered; scrim fades in base | opacity plus scale 0.97, fast |
| Toast | translate from edge plus opacity, base, enter | in swipe direction, fast, exit |
| Drawer or sheet | translate 100% to 0, slow, enter (or spring) | base, exit (or spring with release velocity) |
| Accordion | grid rows 0fr to 1fr, base, standard | same, fast |
| Route change | crossfade, base; shared element bounds, slow, standard | outgoing done in first 35% |

**Pick the transition pattern** (Material motion system): one element becomes the next view: container transform. Ordered siblings or steps: shared axis (slide on X or Y, or scale on Z). Unrelated peers such as bottom nav: fade through (outgoing gone by 35 percent of the duration, incoming scales 0.92 to 1). In-view overlays: fade plus small scale.

**Springs.** Default damping ratio 1 (no bounce) for UI (Apple). Material 3: spatial springs ratio 0.9, effects (opacity, color) ratio 1, never overshoot. Default spatial: stiffness 700, ratio 0.9, which is Motion `{ type: "spring", stiffness: 700, damping: 48, mass: 1 }`. Bounce (Motion `bounce` 0.1 to 0.3) only for thrown objects and rare brand moments.

## 4. Expert moves (what separates top studios)

1. **Velocity first, distance second.** On release of a drag, a flick above about 0.11 px/ms dismisses regardless of distance (Vaul). Project the landing point with distance = (v / 1000) x 0.998 / (1 - 0.998), about half the px/s velocity, snap to the nearest valid target, and start the spring at the release velocity (Apple WWDC18 "Designing Fluid Interfaces").
2. **Track 1:1, ease only on release.** No CSS transition on a property the finger is moving. Light actions commit mid-gesture; destructive ones commit on release (Rauno Freiberg, practitioner).
3. **Spatial vs effects split.** In one transition, position and scale may use a spring with slight overshoot while opacity and color use a ratio-1 spring or tween. Overshooting opacity clamps and reads as a stall (Material 3 tokens).
4. **Transitions over keyframes for state.** CSS transitions retarget from the current value when interrupted; keyframes restart from frame 0. Use keyframes only for loops and one-shot sequences (Kowalski, practitioner).
5. **Origin follows cause.** Popovers and menus grow from their trigger via the library's origin variable (Radix `--radix-*-content-transform-origin`); centered modals grow from center. Enter from scale 0.95, never 0.
6. **Asymmetric timing.** Slow where the person is deciding, fast where the system is responding. A dialog enters at base and leaves at fast; a toast arrives at base and flies out at fast.
7. **Fade through without double exposure.** Outgoing content is fully gone by 35 percent of the duration before incoming fades in from 0.92 scale, so two full-opacity layers never overlap (Material source code).
8. **Stagger cap.** Step 30 to 50 ms, and the last item starts within 300 ms: at 40 ms, stagger at most 8 items and bring the rest together. Stagger first appearance only, never re-sorts or filters (practitioner, Kowalski range 30 to 80 ms).
9. **The LCP trap.** Chromium ignores opacity 0 elements as LCP candidates, so a hero fade-in quietly worsens Core Web Vitals. Reveal only below the fold, once, guarded by `@supports (animation-timeline: view())` (web.dev).
10. **Scroll is the clock.** Scroll-driven animations use `linear` timing because the person's scroll speed is the easing; add easing and it fights them (opinion).
11. **Reduce means replace.** Swap `transform` for `opacity` and keep the timing; show the most meaningful still frame of a Lottie or GIF, not frame 0 (Val Head, Smashing; Apple). Since the WCAG 2.3.3 erratum, blur counts as motion too.
12. **SSR-safe reduced motion.** A reduced-motion hook starts `true` on the server so first paint never animates for someone who opted out (Josh Comeau). In Motion, `<MotionConfig reducedMotion="user">` turns off transform and layout animation and keeps opacity and color automatically.
13. **Cheap shadows and heights.** Animate the opacity of a pseudo-element that holds the bigger shadow instead of `box-shadow`; animate unknown heights with `grid-template-rows: 0fr` to `1fr` (or `interpolate-size` where supported, Chromium only).
14. **Tabular numbers.** Animated counts and prices use `font-variant-numeric: tabular-nums` so the width does not jitter while digits change.
15. **Delay the loader.** Show nothing for the first 300 to 400 ms of a wait, then a skeleton; fast responses never flash a spinner (opinion, built on Nielsen's 0.1 s and 1 s limits).
16. **Review slowed down, then fresh.** Play at 10 to 25 percent speed in the DevTools Animations panel, step frames, test on a throttled mid-range phone, and look again the next day (Kowalski).

## 5. How to deliver a motion spec

When asked to design motion, deliver a table engineers can build without guessing (NN/g: specify easing in an implementable format):

| Element | Trigger | Property: from to | Duration token | Easing token or spring | Delay | Reduced motion |
|---|---|---|---|---|---|---|

Then: the job each row does (section 1, rule 1), interruption behavior, WCAG notes (pause controls, flashes), and code in the project's stack (reference 06). Mark any number that is opinion as opinion.

## 6. Review checklist (run before shipping any motion)

- [ ] Every animation names its job; frequency ladder applied; keyboard actions instant
- [ ] Only shared tokens; exits shorter than entrances; nothing repeated over 500 ms
- [ ] Correct curve per rule 6; springs for gestures; no overshoot on opacity or color
- [ ] Interruptible; input never blocked; focus moves at the start of a dialog animation
- [ ] Reduced-motion path designed per element (matrix in reference 05) and tested in DevTools emulation and OS setting
- [ ] Pause control on 5 s+ auto motion; no flashing over 3 per second; tooltips meet 1.4.13; drag alternative exists
- [ ] Only transform and opacity animated; `will-change` only where measured
- [ ] No fade-in on the LCP element or above the fold; content visible without JS
- [ ] Tested at 4x CPU throttle; no dropped frames visible at slowed playback

## 7. Reference map

| Read | When |
|---|---|
| `references/01-purpose-restraint.md` | Deciding whether to animate; brand vs task motion; frequency ladder detail |
| `references/02-timing-easing.md` | Durations, easing, springs, spring conversions, device scaling, Carbon and Material values |
| `references/03-choreography-transitions.md` | Multi-element sequences, stagger, page and route transitions, View Transitions, scroll reveals, parallax |
| `references/04-micro-interactions.md` | Component-level specs (press, hover, toggle, tooltip, popover, toast, loaders, success, error, drag), gesture physics |
| `references/05-accessibility-performance.md` | Reduced-motion matrix, WCAG detail, vestibular triggers, performance rules, audits |
| `references/06-implementation.md` | Code: CSS, `@starting-style`, WAAPI, View Transitions, Motion (React), Lottie and dotLottie |
| `assets/motion-tokens.css` | Drop-in token file |

## 8. Related skills

- design-ux: states, flows, gestures and where a motion setting lives. design-layout: the spatial model motion expresses. design-color: scrim, state and hover colors. design-typography: tabular figures and text reveals. design-graphic: icon and Lottie art. design-frontend: bundling, SSR, CI tests for reduced motion. design-search: Core Web Vitals. design-copy: status and error text.
- website-strategy: brand personality, which sets the expressive budget. copywriting and sales-funnels: CTA wording and conversion flow; motion supports a clear CTA, it never replaces one or adds pressure (no shaking or pulsing urgency).
