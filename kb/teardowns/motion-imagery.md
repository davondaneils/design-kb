# Motion and imagery across the exemplars (live, 2026-10-13)

Why this file exists: the exemplar benchmark (`kb/tests/benchmark/RESULTS.md`) rated imagery and motion "clearly below" Stripe and Linear in both rounds. The per-site teardowns only list declared `transition` values, which hide what actually happens. This file records what the pages **do** when they run.

- **Method:** `node kb/teardowns/choreo-probe.mjs <url> <out.json> [--width 390] [--reduce]` (Playwright Chromium, 1440x900 and 390x844, light). An init script polls `document.getAnimations()` every frame and logs each animation once with its trigger phase (load, scroll in 60%-of-screen steps every 450ms, hover over 24 controls), target, duration, delay, curve, keyframes and position. It then derives the duration ladder, curves, start values, stagger gaps and an imagery map (share of each screen-height slice covered by photos, video, canvas, illustrations and product mock-ups; mock-ups found as 240x160+ blocks whose text is 60%+ at 13.5px or less, or labelled `data-visual`). Raw: `data/choreo/<slug>-<width>.json`.
- **Measured:** stripe.com, linear.app, vercel.com, ramp.com, mercury.com, raycast.com, apple.com/macbook-air, framer.com, cash.app at 1440; Stripe, Linear and Apple at 390; Stripe, Linear and Raycast again with `prefers-reduced-motion: reduce`; and the benchmark's round 2 Ferry page for comparison.
- Everything is measured unless marked **opinion**. Mock-up counts are a heuristic: read them as "about".

## 1. The headline numbers

| Page (1440) | Animations run | Distinct durations | Curves | Scroll-triggered | Product mock-ups | Photos | Screens with 15%+ visual | Median visual cover per screen |
|---|---|---|---|---|---|---|---|---|
| Stripe | 721 | 20 | 12 | 229 | 12 | 9 | 14 of 17 | 63% |
| Linear | 610 (85 loops) | 13 | 8 | 48 | 5 | 1 | 10 of 12 | 69% |
| Raycast | 727 | 12 | 6 | 260 | 4 | 6 | 13 of 18 | 30% |
| Mercury | 413 | 8 | 10 | 173 | 1 | 16 | 11 of 13 | 29% |
| Framer | 175 (17 loops) | 6 | 7 | 0 | 10 (+7 video) | 11 | 12 of 12 | 61% |
| Apple MacBook Air | 50 | 9 | 6 | 11 | 2 (+2 video) | 46 | 32 of 37 | 31% |
| Ramp | 80 | 5 | 4 | 12 | 1 (+9 canvas) | 5 | 11 of 16 | 43% |
| Vercel | 3 | 3 | 2 | 1 | 0 | 3 | 5 of 7 | 34% |
| **Ferry, benchmark round 2** | 51 | **3** | **2** | **0** | **0 detected (1 card)** | 0 | **1 of 7** | **0%** |

Stripe at 390: 13 durations, 14 mock-ups, 19 of 25 screens with visual, median cover 81%: the phone page is **more** visual per screen, not less. Linear at 390: 4 mock-ups, 5 of 7 screens.

Read: the two pages the benchmark compared against put a picture on 80%+ of their screens and give each one a job. Ferry put a picture on one screen in seven. Vercel shows the low end is legitimate only when the type and grid are the picture (Vercel's 3 animations, 34% cover).

## 2. Motion: what the timing actually is

Durations sort into five jobs. Every exemplar that moves at all uses three or more of these bands; none uses one duration for everything.

| Job | Stripe | Linear | Raycast | Mercury | Apple |
|---|---|---|---|---|---|
| Hover, press, link color | 150ms (92 runs), 240 to 330ms, curve `(.25,1,.5,1)` ease-out quart on links, `(.45,.05,.55,.95)` on menus | 100ms (187 declared) and 160ms, `(.25,.46,.45,.94)` ease-out quad | 250ms, `ease` | 150 and 300ms, `(0,0,.2,1)` | 100ms linear, 230 to 320ms |
| UI change (menu, tab, accordion) | 240 to 400ms | 200 to 350ms | 230 to 400ms | accordion `grid-template-rows` 300ms; menu `rotateX(-10deg) scale(.9)` 250ms | nav results 320ms, 20ms stagger, 4px travel |
| Entrance on load | headline words rise from `translateY(-100%)` inside a mask, **325ms** `(.33,1,.68,1)`, **50ms stagger, 22 spans, 500ms total** | hero lines from `opacity 0, blur(10px), translateY(20%)` | 17 extension cards, **700ms** `(.215,.61,.355,1)`, **80ms stagger**, 50px travel | 500ms | almost none; video carries the hero |
| Reveal on scroll | 500ms opacity `(.33,1,.68,1)`; cards from `translate3d(0,30px,0)` | **1000ms**, opacity 0 plus `blur(10px)` plus 20% travel, **33ms stagger** across 8 lines | 1000 to 2000ms on `(.23,1,.32,1)` and `(.165,.84,.44,1)`, 100 to 325ms offsets | **670ms**, 50px travel on a slight overshoot `(.28,1.1,.74,1)`, opacity on a separate curve, move delayed 150ms after the fade starts | 500ms |
| **Product scenes** (a mock-up acting out the product) | **1.42s, 2.26s, 4.48s and 11.95s timelines** with holds; scenes repeat after a 4000ms delay; payment summary drops 16px into place; checkout swaps payment methods with a `clip-path: inset(0 0 100%)` wipe plus a 65 to 225px slide | agent label and border sweeps 2000ms linear; dot-grid figures on `steps(1)` 2800ms loops | typed cursor blink 1100ms `steps(1)`; keyboard keys press in sequence at 1000 to 1500ms, 100 to 325ms apart; progress bar `scaleX(0)` to `.95` over 5000ms linear | logo marquee 45s linear | 2 videos |

Patterns the set shares (measured):
1. **The motion budget goes to the product, not to the page.** Stripe's long durations are almost all inside product mock-ups (`payments-graphic__*`, `connect-platform-graphic__*`, `platform-graphic__*`). Raycast's are keys being pressed and a cursor typing. Linear's are an agent working. Generic fade-ups are the minority of runtime.
2. **A product scene is a timeline with holds.** Keyframes repeat values (`opacity: 0, 0, 0, 1, 1`; `translateY(-16px), -16px, -16px, 0, 0`) so a state is held long enough to read, then changes, then holds. Scene beats are 1.4 to 4.5s; a full loop is up to 12s with a 4s rest between plays.
3. **Text enters by line or word, masked, short, tight stagger.** Stripe 325ms at 50ms gaps; Linear 33ms gaps; Apple 20ms. Stagger gaps sit between 20 and 80ms; total spread stays at or under 500ms for text. Cards may stagger at 80ms (Raycast).
4. **Entrances travel a small, fixed distance:** 16px, 20px, 30px, 50px or 20% of a line height, or a full-height mask (`-100%` inside `overflow: hidden`). Nothing slides in from off-screen.
5. **Curves are strong ease-outs** (quart `(.25,1,.5,1)`, cubic `(.33,1,.68,1)` and `(.215,.61,.355,1)`, quint `(.23,1,.32,1)`, expo-like `(.165,.84,.44,1)` and `(.16,1,.3,1)`), plus `steps(1)` for anything that should feel digital (cursors, dot grids) and `linear` for sweeps and marquees. Framer uses CSS `linear()` spring curves. Stripe uses 12 curves; that many is not a goal (**opinion**): three to five, each with a job, is what Linear and Raycast need.
6. **Hover speed is a brand statement.** Linear 100 to 160ms ("fast"), Stripe 150 to 300ms ("smooth"), Raycast 250ms. Pick one and hold it.

### Reduced motion (measured with `--reduce`)
- **Stripe:** product scenes stop (no timeline over 500ms runs; durations 150 to 500ms remain), but the 22-word headline rise still plays. **Do not borrow** the headline: it moves 100% of a line under reduce.
- **Linear:** 25 reduce rules; travel and blur entrances stop; the stepped dot-grid loops keep running (177 loop runs under reduce). **Do not borrow** the loops: WCAG 2.2.2 needs a pause for anything over 5 seconds.
- **Raycast:** almost unchanged under reduce (570 animations, 700ms card stagger still runs). **Do not borrow.**
- The rule the library keeps (FOUNDATIONS, Motion): under reduce, product scenes show their final, most informative frame as a still; text and cards appear in place; only opacity and color under 150ms may remain.

## 3. Imagery: what fills the screens

| Page | What the pictures are | Treatment that makes them one family |
|---|---|---|
| Stripe | 12 HTML product mock-ups (checkout, billing chart, connected accounts, terminal), 9 photos (customers, keynote), one canvas gradient | The hero gradient reappears as the fill behind every mock-up; mock-ups share radius, the below-only shadow `0 30px 45px -30px rgba(50,50,93,.25)` and 9 to 12px UI text |
| Linear | 5 live app fragments, wireframe isometric figures, dot-grid figures | One line weight, near-black surfaces stepped 1 to 3 lightness points, figure captions in mono ("FIG 0.2") |
| Framer | 10 mock-ups plus 7 videos of the editor | Every visual is the product's own canvas |
| Apple | 46 photos, 2 videos | One lighting setup, one background tone per section, product at the same angle family |
| Mercury | 16 photos plus 15 background images | Warm, soft, desaturated; one grade across all |
| Raycast | 4 app windows, 6 photos, gradient glows (31 gradient blocks) | Every window has the same chrome; glow color matches the section's extension |
| Ramp | 9 canvases (animated charts), 5 photos | Product numbers drawn live |

Patterns:
1. **Every screen gets a visual with a job**, except deliberate type-only beats (a quote, pricing). Stripe 14 of 17, Linear 10 of 12, Framer 12 of 12. Vercel's 5 of 7 is the floor among them.
2. **The product appears many times at different scales and crops**, not once. Stripe shows 12 fragments; each section's fragment shows the one feature that section names.
3. **One treatment unifies everything**: a shared fill (Stripe's gradient), a shared chrome (Raycast windows), a shared grade (Mercury), a shared line weight (Linear). The treatment is stated once and applied to every visual.
4. **Mock-ups use plausible, specific data** ("Daybreak Yoga", "$999.00 /year") that adds up, and their UI text is decoration (`aria-hidden`), set at 9 to 12px.
5. **The phone page keeps the pictures.** Stripe at 390 has more mock-ups (14) than at 1440 (12) and a higher cover (81%); pictures are cropped and re-framed, not dropped.

## 4. What this means for the skills (feeds design-motion and design-art-direction)
- A landing page needs a **visual plan**: one visual per screen with a named job, at least three distinct product fragments, one unifying treatment. Measured check: `choreo-probe.mjs` "screens with visual" at or above 70% at 1440 and 390, and product fragments at three or more for a product page.
- Motion needs a **motion plan with at least one product scene**: a timeline that acts out the product's core state change with holds long enough to read (beats 1.2 to 4.5s), plus a duration ladder of three to five bands by job (hover, UI change, entrance, reveal, scene). Measured check: three or more duration bands, a scene timeline present, stagger gaps 20 to 80ms, travel 8 to 50px.
- The probe that measured the exemplars runs on any built page, so a builder compares like with like.
