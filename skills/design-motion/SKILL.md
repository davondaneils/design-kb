---
name: design-motion
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand); do not trigger on its own for a page, screen or brand job. Covers the motion plan, the duration ladder, product scenes (mock-ups that act out the product on scripted beats), shot plans and the moment kit (swap, stack, event shot), the blind side-by-side gate, the depth tier (springs, layout, WebGL, Rive), purpose and restraint, timing and easing, choreography, micro-interactions, reduced motion that keeps end states, performance, implementation in CSS, WAAPI and Motion, motion on data and live numbers, and measuring motion on a built page (motion-plan-check, motion-audit, scene.js, moments.js, blind-gate). Load it directly only when the user names it or asks a narrow question inside this domain alone.
---

# design-motion

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill. Accessibility floor for every rule here: design-foundations `references/accessibility.md`. Numbers match `kb/FOUNDATIONS.md` v0.6 (Motion).

Motion is information about change: what happened, where it came from, where it went. On a product page it is also the product's best demo: Stripe's longest timelines all run inside product mock-ups that act out a payment, not on the page around them (`kb/teardowns/motion-imagery.md` section 2). This skill makes Claude decide what moves, plan it as a ladder of jobs, and build it to that standard, safely for everyone.

Why this version exists: v0.3 made motion present (a ladder, a scene with holds) and the fresh brief passed every check, yet the filmed result was "not anything special" (Davon, 2026-10-15; `kb/tests/fresh/RESULTS.md`). Presence is not quality. v0.4 adds what the remembered moments do, measured frame by frame on nine exemplar moments (`kb/moments/STUDY.md`): a **shot plan** per scene that the check reads (one owner per beat, reading holds counted from legibility, an event with a press), a **moment kit** rebuilt from Stripe, Sonner and the event shot (`assets/moments.js`), a **blind gate** where a fresh critic must fail to tell our moment from an exemplar's (`assets/blind-gate.mjs`), and a **depth tier** with limits (reference 10). Sections 2 to 4b are required and measured.

## 1. Fundamentals gate (non-negotiable, check first)

A motion proposal that misses any one of these fails, however polished the rest is.

1. **Purpose.** Each animation does one named job: feedback, state change, spatial orientation, signifier, attention (NN/g), or, inside a product mock-up, **explaining the product**. No job, no motion.
2. **Frequency.** Actions done 100+ times a day, keyboard shortcuts and keyboard navigation do not animate. Enter on a button that opens a dialog is not a shortcut. Tooltips after the first open instantly (Kowalski, practitioner; Apple HIG).
3. **Never block.** Input stays live during every animation; any animation can be interrupted and retargeted (Apple HIG).
4. **Tokens only, in CSS and in scripts.** Durations, curves, stagger and travel come from the tokens (section 5); scripts read them with `getComputedStyle`; no millisecond literals in JS. Scene beats are the one exception and live in `data-beats` (FOUNDATIONS Token schema). Every `transition` list entry names a curve: an entry without one runs on `ease` (MDN), even `visibility`.
5. **Within the band.** Anything a person triggers stays at 100 to 400ms and never over 600ms; nothing repeated exceeds 500ms (NN/g). Above that only three things exist: a reveal on scroll at `--duration-reveal` 600ms (text that blurs in may run to 1000ms), the one hero reveal per page up to 800ms, and product scenes on their own beats of 1200 to 4500ms, inside a mock-up, never on a control (FOUNDATIONS v0.5). Exits are one token shorter than entrances.
6. **Right curve.** Enter decelerates, permanent exit accelerates, on-screen moves and in-place swaps use standard, continuous motion and time axes are `linear`, digital things (carets, pixel grids) are `steps(1)`, anything dragged or flicked is a spring. Never `linear` on an object that starts and stops.
7. **Reduced motion keeps every end state.** Under `prefers-reduced-motion: reduce` nothing moves, scales, rotates, blurs or resizes; opacity and color may stay at 150ms or less, once; loops stop (FOUNDATIONS Motion). **Only the transition is removed, never the state it leads to**: an open accordion's icon stays rotated (or swaps plus for minus), a selected tab keeps its indicator, a scene shows its most informative frame as a still. Round 2 set `transform: none !important` on the FAQ icon under reduce, so open answers looked closed: a gate fail (`kb/reviews/benchmark-round2-landing.md` item 15c).
8. **WCAG floor.** Anything that starts by itself, lasts over 5 seconds and sits beside other content has a visible pause control (2.2.2, A): every looping scene, marquee and live KPI. Never more than 3 flashes per second (2.3.1). Hover or focus content stays dismissible and hoverable (1.4.13). Drag has a non-drag alternative (2.5.7). Motion is never the only carrier of meaning.
9. **Compositor only.** Animate `transform` and `opacity`. Never `width`, `height`, `top`, `left`, `margin`, `padding` or `box-shadow`. One exception: `filter: blur()` of 10px or less on a text block as it enters (Linear, measured), removed under reduce.
10. **First paint is sacred.** Never fade or mask in the headline, the LCP element or other first-screen text (Chromium ignores opacity 0 elements as LCP candidates, web.dev). The one hero reveal moves the supporting artifact by transform. Content is visible if JS or the animation never runs. Numbers and charts never animate on arrival.
11. **Measured, not assumed.** Before hand-over: `assets/motion-plan-check.mjs` exits 0 at 1440 and 390 (ladder, scene, shot plan, reading holds, quiet, event, stagger, travel, reduce, end states, depth), and `assets/motion-audit.mjs` films every user action in both settings and passes (tokens, curves, properties, keyboard paths). Then look at every strip.
12. **Judged blind.** On a product or landing page the motion verdict is `assets/blind-gate.mjs`: a fresh critic sees our moments beside exemplar moments, unlabeled, and the build passes only when the critic cannot reliably tell them apart and names a memorable moment in every one of ours (reference 09 section 5). Self-review and passing checks are not the verdict.

## 2. The motion plan (required, written before any motion code)

One row per moving thing. A builder who cannot fill a cell has not decided yet.

| Moving thing | Job | Band | Duration (token or beat) | Curve | Trigger | Reduced-motion end state |
|---|---|---|---|---|---|---|
| CTA, links, summaries | feedback | press/hover | `--duration-instant` | `--ease-standard` | hover, press | same color change, kept |
| Run scene (mock-up) | explain the product | scene | beats 1600 / 2400 / 3200, rest 4000 | per part | in view, loops | still frame: "Paid", total $16,460.00 |
| ... | | | | | | |

Rules: three to five bands, one per job (section 3); a product page has at least one scene row (section 4); every row names its reduced-motion **end state**, not "none"; the plan sits in the build note or a comment beside the CSS. Worked plan for a full page: reference 08.

## 3. The ladder (three to five bands, one per job)

| Band | Duration | Typical jobs | Measured |
|---|---|---|---|
| Press and hover | `--duration-instant` 100 or `--duration-fast` 150: one choice per page, held everywhere | color, press scale, underline | Linear 100 (187 declared), Stripe 150 (92 runs), Raycast 250 |
| UI change | `--duration-base` to `--duration-slow`, 200 to 400 | menu, accordion, tab, label swap, masked word rise | Stripe 240 to 400; Mercury accordion 300 |
| Entrance | `--duration-page` 400; the one hero reveal up to 800 | route change, hero artifact | Stripe hero reveal 800 |
| Reveal on scroll | `--duration-reveal` 600; text blur-in to 1000 | a block entering once | Mercury 670; Linear 1000 blur-in |
| Product scene | beats 1200 to 4500, loop 12s or less, rest 2s or more | the product acting out its state change | Stripe 1.42, 2.26, 4.48 and 11.95s timelines, 4s rest |

Measured: every exemplar that moves uses three or more bands; the benchmark pages used one (`kb/teardowns/motion-imagery.md` section 2). Stagger gaps 20 to 80ms (`--stagger` 40ms; Stripe 50, Linear 33, Apple 20, Raycast 80 on cards); one group spreads at most 500ms for text, 800ms for cards. Entrance travel 8 to 50px (`--travel` 16px) or a 100% rise inside a clipping mask; nothing slides in from off-screen. Twelve curves is not a goal (Stripe uses 12): three to five, each with a job (opinion).

## 4. The product scene (the signature move for product pages)

A scene is a mock-up that acts out the product's core state change on a scripted timeline: a payroll line going Queued, Sending, Paid while the paid total re-foots; a booking going Held, Confirmed, Ticket issued; a deploy going Building, Checks, Live. It is the page's argument made visible.

1. **Pick the one state change that is the product.** Write it as three to five states, each a sentence a buyer would recognise. If the states would fit any competitor, the scene fails the concept test (design-art-direction).
2. **Beats with holds.** Each beat 1200 to 4500ms; the change itself takes a UI-band transition (200 to 400ms) and the rest of the beat is a hold, so each state is still for 1000ms or more and can be read. A scene is mostly stillness (FOUNDATIONS; Stripe's keyframes repeat values to hold: `translateY(-16px), -16px, -16px, 0, 0`).
3. **Loop rules.** Whole loop 12s or less; rest 2s or more on the last, most informative frame (Stripe rests 4s); replay through a seam (fade out at `--duration-fast`, reset, fade in), never by playing the story backwards.
4. **Runs only when seen, stops when asked.** Starts when a third of it is on screen; pauses on hover, on focus inside, when the tab is hidden, and from a visible pause button (WCAG 2.2.2: a loop always lasts over 5s). Never on a control, never blocking input.
5. **Reduced motion: the still frame.** The final state, rendered in place, and no pause button. Author the HTML on that frame so it is also right without JS and in screenshots.
6. **Numbers in the scene are true.** Totals re-foot from the lines as displayed, after every beat; mark them `data-sum-of` so the lint re-adds them (the round 2 hero total was $0.69 off).
7. **Build it with `assets/scene.js`** (steps `data-state` from `data-beats`; CSS owns all motion) and check it with `assets/motion-plan-check.mjs`. Full code: reference 08.

## 4b. Direct the scene: the shot plan and the moment kit (v0.4)

A scene that only steps states is a slideshow. Direct it (full method: reference 09; study: `kb/moments/STUDY.md`):
1. **Write a shot plan inside the scene** (`<script type="application/json" data-shot-plan>`): one shot per beat naming its `owner`, the text to `read`, and for the event the `aim`, `press` and result. `motion-plan-check.mjs` fails a scene without one, a beat with no single owner, a product page with no event (`plan`, `event`).
2. **One owner at a time.** Once a beat's change settles, nothing outside the owner starts moving (`quiet`). Followers start within an `--offset` (100ms; Stripe's browser follows its phone by 150 to 250ms).
3. **Reading hold from legibility:** after the change settles, `max(1000ms, 300ms + 330ms per visible word)` (reading aloud, Brysbaert 2019) (`read`).
4. **Act out an event:** start state, cursor on the action, the press, the result owning the screen with the longest beat. Optional camera push 1.00 to 1.03 over the result's beat.
5. **Change in place; start from the kit.** `assets/moments.css` and `assets/moments.js`: **swap** (values roll in masks on `--ease-swap` `(.78,0,.22,1)`, `--duration-swap` 800ms, cascading by `--stagger`, a second group `--offset` x 1.5 behind: Stripe's checkout), **stack** (items rise from 100% of their height, older ones step back scale .95 and -14px per level: Sonner), **event shot** (cursor on a sampled spring, press scale .97, push). Fixtures: `assets/fixtures/moments-demo.html` (passes), `moments-bad.html` (five fails).
6. **Three stills before timing.** Opening, result, ending (`blind-gate.mjs prepare` writes them): if they do not tell the story with motion off, timing will not save it.
7. **Depth only through the tier.** Springs with velocity, layout, globes, 3D and Rive follow reference 10: lazy, a poster, a still under reduce, off-screen stop, budgets (`depth`).

## 5. Tokens (shared foundation)

```css
--duration-instant: 100ms;  /* press, hover color, toggle */
--duration-fast:    150ms;  /* tooltip, exits, the scene seam, the move delay in a split reveal */
--duration-base:    200ms;  /* menu, dialog, accordion, toast, digit roll in */
--duration-slow:    300ms;  /* drawer, sheet, value-stack swap, masked word rise */
--duration-page:    400ms;  /* route change, first-screen entrance */
--duration-reveal:  600ms;  /* a block entering on scroll, once */
--stagger: 40ms;            /* 20 to 80ms */
--travel:  16px;            /* 8 to 50px, or a 100% masked rise */
--ease-standard: cubic-bezier(0.2, 0, 0, 1);  /* on-screen move, swap in place, opacity of a split reveal */
--ease-enter:    cubic-bezier(0, 0, 0, 1);    /* arriving */
--ease-exit:     cubic-bezier(0.3, 0, 1, 1);  /* leaving for good */
--motion-hover: var(--duration-instant) var(--ease-standard);
--motion-enter: var(--duration-base) var(--ease-enter);
--motion-exit:  var(--duration-fast) var(--ease-exit);
/* v0.6, inside scenes and for large surfaces (kb/moments/STUDY.md) */
--duration-swap: 800ms;                         /* an in-place value roll inside a scene (Stripe 833ms) */
--ease-swap:  cubic-bezier(0.78, 0, 0.22, 1);   /* swap of something already on screen (Stripe) */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);  /* sheets, drawers, stacks (Vaul) */
--offset: 100ms;                                /* lead to follower, 80 to 250ms */
/* --ease-spring, --duration-spring: written by assets/moments.js from spring(300, 26), about 520ms */
```
Keywords, not tokens: `linear` (loops, scroll-linked, progress fills, time axes) and `steps(1)` (carets, pixel grids). Scene beats live in `data-beats`. Drop-in file: `assets/motion-tokens.css`. Use the low end of a band by default; tablet about x1.3, watch about x0.7 (Material 1).

## 6. Decision rules

**Should it move?**
| Frequency | Budget |
|---|---|
| 100+ a day, keyboard shortcuts, keyboard navigation | None |
| Tens a day (hover, menus, rows) | Opacity or tiny transform at instant to fast, or none |
| A few per session (dialog, drawer, toast, page) | Standard tokens |
| Rare or first time (onboarding, milestones) | Expressive allowed, once, skippable |
| A product mock-up on a marketing page | A scene: the page's largest motion budget |

**Duration and easing at a glance**
| Element | Enter | Exit |
|---|---|---|
| Button press | scale 0.97, instant, standard | release, instant |
| Tooltip | delay 300 to 700 ms, then opacity plus scale 0.97 to 1, fast, enter | opacity, fast or less |
| Popover, menu, select | opacity plus scale 0.95 to 1, fast to base, enter, from trigger | opacity, fast, standard |
| Dialog | opacity plus scale 0.95 to 1, base, enter; scrim fades in base | opacity plus scale 0.97, fast |
| Toast | translate from edge plus opacity, base, enter | in swipe direction, fast, exit |
| Drawer or sheet | translate 100% to 0, slow, enter (or spring) | base, exit |
| Accordion | `::details-content` with `interpolate-size`, or grid rows 0fr to 1fr; base, standard; icon rotates in the same time and **keeps its rotation under reduce** | same, fast |
| Text label change in a mock-up | value stack: old slides to -100%, new from 100%, inside a clip; slow, standard | (same move) |
| Section heading on scroll | masked word rise from 100%, slow, enter, `--stagger` | none |
| Block or card on scroll | opacity `--duration-reveal` standard; move `--travel` on enter, delayed `--duration-fast`; cards `calc(var(--stagger) * 2)` apart | none |
| Route change | crossfade, base; shared element bounds, slow, standard | outgoing done in first 35% |

**Pick the transition pattern** (Material motion system): one element becomes the next view: container transform. Ordered siblings or steps: shared axis. Unrelated peers: fade through (outgoing gone by 35%, incoming scales 0.92 to 1). In-view overlays: fade plus small scale.

**Springs.** Damping ratio 1 for UI (Apple); Material 3 spatial 0.9, effects 1, never overshoot opacity. Default spatial: Motion `{ type: "spring", stiffness: 700, damping: 48, mass: 1 }`. Bounce only for thrown objects and rare brand moments.

## 7. Expert moves

1. **Velocity first, distance second.** A flick above about 0.11 px/ms dismisses regardless of distance (Vaul); project the landing point with distance = (v / 1000) x 0.998 / (1 - 0.998) and start the spring at the release velocity (Apple WWDC18).
2. **Track 1:1, ease only on release.** No transition on a property the finger moves; destructive actions commit on release (Rauno Freiberg, practitioner).
3. **Spatial vs effects split.** Position and scale may overshoot slightly; opacity and color never (Material 3).
4. **Transitions over keyframes for state.** Transitions retarget when interrupted (Kowalski); keyframes restart. Keyframes for loops and one-shot sequences.
5. **Origin follows cause.** Popovers grow from their trigger (Radix `--radix-*-content-transform-origin`); modals from center; scale from 0.95, never 0.
6. **Asymmetric timing.** Slow where the person decides, fast where the system responds.
7. **Fade through without double exposure.** Outgoing gone by 35% before incoming fades in (Material).
8. **Stagger cap.** `--stagger` 40ms; last item starts within 300ms for UI lists; first appearance only, never on re-sort or filter (Kowalski range 30 to 80ms).
9. **The LCP trap.** A hero fade-in quietly worsens LCP (web.dev). The one hero reveal moves the artifact by transform; other reveals sit below the fold, once.
10. **Scroll is the clock.** Scroll-driven animation is `linear`; easing fights the reader's own speed (opinion).
11. **Reduce means replace, and keep the end state.** Swap movement for an instant change or a short fade; show a Lottie's or scene's most meaningful frame, not frame 0 (Val Head; Apple). Blur counts as motion (WCAG 2.3.3 erratum).
12. **SSR-safe reduced motion.** A reduced-motion hook starts `true` on the server (Josh Comeau); `<MotionConfig reducedMotion="user">` keeps opacity and color.
13. **Cheap shadows and heights.** Fade a pseudo-element's shadow; animate unknown heights with grid rows or `interpolate-size`.
14. **Tabular numbers** on anything that changes digits.
15. **Delay the loader** 300 to 400ms (opinion, on Nielsen's limits).
16. **Review slowed down, then fresh.** 10 to 25% speed in DevTools, throttled phone, again the next day (Kowalski).
17. **Linear for time axes.** A reveal whose x axis is time runs linear; marker delay = its share of the axis x duration.
18. **The two-transform wipe.** Outer clip slides in, inner content slides out by the same amount; 8px overhang.
19. **Animate the change, not the arrival.** Live digits roll only where they changed, up for a rise; first load is static; pause control.
20. **Fade-through in one box, also under reduce.** Two labels in one cell never crossfade.
21. **Modality-aware dialogs.** `data-via=key` opens instantly; pointer opens animate.
22. **Review hooks open settled.** A state opened by URL skips its entrance.

Learned from the live capture of the exemplars (`kb/teardowns/motion-imagery.md`, raw `kb/teardowns/data/choreo/`):

23. **Spend the motion budget on the product, not the page.** Stripe's long durations sit almost entirely in `payments-graphic__*` and `connect-platform-graphic__*`; Raycast's are keys pressed and a cursor typing; Linear's an agent working. Generic fade-ups are the minority of runtime. A page with ten fade-ups and a static product is upside down.
24. **Hold keyframes.** A state is held by repeating its value (`opacity: 0, 0, 0, 1, 1`), so most of a beat is still. Opinion: the move takes at most about a third of its beat; the rest is reading time.
25. **Value stacks, never text swaps.** Stripe pre-renders every value of a mock-up label in a clipped slot and slides the stack `translateY(0)` to `-100%` (11 `*-values` slots on 1420ms timelines, symmetric in-out `cubic-bezier(.78,0,.22,1)`; raw `data/choreo/stripe-home-1440.json`; frame-traced at 833ms per roll, `kb/moments/data/stripe-checkout.trace.json`). No reflow, no layout jump, and the old value leaves in the direction time flows. Inside a scene: the kit's **swap** (`--duration-swap` on `--ease-swap`). A label a person changes by hand: `--duration-slow` on `--ease-standard`.
26. **Masked rises for text, short and tight.** Stripe's headline: 22 word spans from `translateY(-100%)` inside a mask, 325ms each, 50ms apart, 500ms in all. Ours: `--duration-slow` and `--stagger` on section headings, with the mask padded by `--space-2` (and pulled back by the same negative margin) so descenders are not cut. Not on the h1 (fundamental 10).
27. **Blur-in for text on dark.** Linear brings 8 lines in from `opacity 0, blur(10px), translateY(20%)` over 1000ms, 33ms apart. Blur reads as focus being pulled and hides the shimmer of thin light text moving on dark (opinion). Text blocks only, 10px at most, never under reduce.
28. **Split the fade from the move.** Mercury fades over 670ms on a near-linear curve and moves 50px on a slight overshoot, the move starting 150ms after the fade. The element is present before it lands, so nothing ghosts across the screen at low opacity (opinion). Ours: opacity on `--ease-standard`, transform on `--ease-enter` delayed `--duration-fast`.
29. **`steps(1)` for anything digital.** Raycast's caret blinks 1100ms `steps(1)`; Linear's dot-grid figures run 2800ms `steps(1)`. An eased blink looks like breathing; digital things snap.
30. **Hover speed is a brand statement.** Linear 100 to 160ms reads "fast tool", Stripe 150 to 300ms reads "smooth". Pick 100 or 150 for the page and hold it on every control; two hover speeds read as two products.
31. **Progress fills end before the beat does.** A fill runs `linear` over the beat minus `--duration-reveal`, so the full bar is held before the state changes (Raycast's bar runs to `.95` over 5000ms, never quite done, which reads as working).
32. **Author the still frame, then jump.** The HTML ships on the final state (right without JS, under reduce and in screenshots); the runner jumps to the first state with transitions finished, so nothing plays backwards on load.
33. **Do not borrow the exemplars' reduced motion.** Stripe keeps its 22-word headline rise under reduce (100% of a line moves); Linear keeps its stepped loops running (177 loop runs); Raycast barely changes (570 animations, the 700ms card stagger still plays). The house rule is stricter (fundamental 7).

## 8. Review checklist

- [ ] Motion plan written first; three to five bands; every row names its reduced-motion end state
- [ ] Product page: a scene that acts out the core state change, beats 1200 to 4500ms, holds, rest, seam, pause button, in view only, still frame under reduce
- [ ] Only tokens; one hover speed; exits shorter than entrances; stagger 20 to 80ms; travel 8 to 50px or a masked 100%
- [ ] Curves per fundamental 6; `steps(1)` for digital things; springs for gestures
- [ ] Interruptible; keyboard actions instant; focus moves at the start of a dialog animation
- [ ] Reduce: nothing moves or blurs; every end state kept; scenes still; loops stopped
- [ ] Pause control on anything over 5 s; no flashing; tooltips meet 1.4.13; drag alternative
- [ ] Only transform and opacity (plus text blur-in); no fade on the LCP element
- [ ] Every scene has a shot plan: one owner per beat, reading holds from legibility, an event (aim, press, result), nothing else moving during a hold
- [ ] Depth-tier uses (reference 10): lazy, poster, still under reduce, stopped off screen, within budget
- [ ] `motion-plan-check.mjs` exits 0 at 1440 and 390; `motion-audit.mjs` passes every scenario; every strip looked at
- [ ] Product or landing page: `blind-gate.mjs grade` exits 0 with a fresh critic (hero plus every scene)

## 9. Reference map

| Read | When |
|---|---|
| `references/08-product-scenes-and-choreography.md` | Always on a product or landing page: scene code (ledger with re-footing total), masked heading rise, split card reveal, a full worked motion plan |
| `references/09-moments-and-directing.md` | Always on a product or landing page: the shot plan, the moment kit, the nine studied moments as decisions, the blind gate, the review loop (three stills, four-field corrections) |
| `references/10-depth-tier.md` | A moment that needs velocity springs, layout animation, a globe, 3D or Rive: which tool, measured sizes, budgets, lazy loading, reduced motion |
| `references/01-purpose-restraint.md` | Deciding whether to animate; brand vs task motion |
| `references/02-timing-easing.md` | The ladder in detail, durations, easing, springs, device scaling |
| `references/03-choreography-transitions.md` | Sequences, stagger, page and route transitions, View Transitions, scroll reveals, parallax |
| `references/04-micro-interactions.md` | Component specs (press, hover, toggle, tooltip, popover, toast, accordion, loaders, drag), gesture physics |
| `references/05-accessibility-performance.md` | Reduced-motion matrix, WCAG detail, vestibular triggers, performance |
| `references/06-implementation.md` | Code: CSS, `@starting-style`, WAAPI, View Transitions, Motion (React), Lottie |
| `references/07-motion-on-real-pages.md` | Charts, live numbers, label swaps, modality-aware dialogs, filming |
| `assets/motion-tokens.css` | Drop-in tokens, including `--duration-reveal`, `--stagger`, `--travel` |
| `assets/scene.js` | Scene runner: `data-beats`, holds, rest, seam, pause on hover, focus, hidden tab, off screen and button; still frame under reduce |
| `assets/moments.css`, `assets/moments.js` | The moment kit: swap, stack, event shot (cursor, press, push), shot-plan runner, sampled spring. Load after `scene.js` |
| `assets/blind-gate.mjs` | `prepare <page> --out dir --moment hero:top --moment event:#scene`, then a fresh critic answers `QUESTIONS.md`, then `grade --out dir`. Exemplars: `assets/exemplar-moments.json` |
| `assets/motion-plan-check.mjs` | `node skills/design-motion/assets/motion-plan-check.mjs page.html [--width 390] [--no-scene]`: ladder, scene, shot plan, read, quiet, event, behavior, stagger, travel, reduce, end states, depth. Fixtures: `scene-good.html`, `moments-demo.html` (pass); `moments-bad.html`, `depth-bad.html` (fail) |
| `assets/motion-audit.mjs` | `node skills/design-motion/assets/motion-audit.mjs <scenarios.mjs> <outdir>`: films each action in both settings and checks tokens, curves, properties, reduce, keyboard paths |

## 10. Related skills

- design-art-direction: the visual plan and the concept a scene must act out. design-ux: states and flows. design-layout: the spatial model motion expresses. design-color: scrim, state and hover colors. design-typography: tabular figures and text reveals. design-graphic: icon and Lottie art. design-frontend: bundling, SSR, CI tests for reduced motion. design-search: Core Web Vitals. design-copy: status text and the scene's state labels.
- website-strategy: brand personality, which sets the hover speed and expressive budget. copywriting and sales-funnels: motion supports a clear CTA, never replaces one or adds pressure (no shaking or pulsing urgency).
