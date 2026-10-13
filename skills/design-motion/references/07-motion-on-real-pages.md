# 07 Motion on real pages: data, numbers and verification

What changes when motion leaves the spec table and lands on a page that carries data, and how to prove it on pixels. Built from the rendered slice test (`kb/tests/design-motion.md`): every rule below was either broken by a first draft of the test pages and caught by filming it, or held up on the strips. Research: `kb/research/motion/07-motion-on-real-pages.md`.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Tokens, also in scripts.** CSS uses `--duration-*`, `--ease-*` and `--motion-*`; scripts read the same tokens with `getComputedStyle` and never type a millisecond value. [judged; `motion-audit.mjs` checks the result]
2. **Every transition list entry names a token curve.** An entry without a curve runs on `ease` (the initial value), including discrete ones like `visibility`. Write `visibility var(--duration-instant) linear`. [audit]
3. **No movement under reduced motion; designed, not deleted.** Movement lives inside `@media (prefers-reduced-motion: no-preference)`; reduce gets the end state at first paint or a fade of 150 ms or less. No global `animation: none !important` reset: it also deletes the fades that carry meaning. [lint `motion`; audit reduce row]
4. **First paint never hides.** Headline, KPIs and chart data are visible and final at load. A marketing page may add the one hero reveal FOUNDATIONS allows (up to 800ms on `--ease-enter`, played once on load, removed under reduced motion; Stripe reveals `.8s`, `kb/teardowns/stripe-home.md`), on the hero's supporting artifact (a product card, the drawn motif) by `transform` or `clip-path`, never by fading the headline or the LCP element from opacity 0. Every other reveal is below the fold, once, after the person scrolls to it. [judged]
5. **Numbers never animate on arrival.** A KPI or price is shown, not counted up. Motion is for a change while the number is on screen. [judged]
6. **Auto-updating values can be paused.** A number that updates on a timer beside other content needs a pause, stop, hide or frequency control (WCAG 2.2.2, Level A, which covers auto-updating information, not only moving content). [judged]
7. **Keyboard paths are instant.** Shortcuts (Ctrl K, `?`, Esc, Enter in a palette) open and close without transition; the same dialog may animate from a pointer. [audit `expect: 'none'`]
8. **Movement on transform and opacity only.** Shadows, layout properties, `clip-path` and blur do not animate; a hover shadow fades on a pseudo-element's opacity. [audit]
9. **Film it before hand-over.** Every animation the page has is filmed in both motion settings and its real timings read from the browser. A screenshot proves nothing about motion. [audit]

### Standards
| Rule | Source |
|---|---|
| Auto-updating content beside other content: pause, stop, hide or control frequency | WCAG 2.2.2 Pause, Stop, Hide (A), W3C Understanding |
| Interaction-triggered motion can be disabled unless essential | WCAG 2.3.3 (AAA) |
| `transition-timing-function` initial value `ease`; lists repeat to match properties | MDN |
| Exit from the top layer needs `display` and `overlay` with `allow-discrete`; entry needs `@starting-style` | MDN `transition-behavior` |
| `getAnimations()` includes CSS transitions; `currentTime` seeks running or paused animations | MDN |
| Restrict animation to transform and opacity; blurs and shadows are expensive to paint | web.dev |

### Decision rules
- **If a chart is on an analytic screen** (dashboard, report, anything read daily): no draw-on, no load animation. Animate only a change of state the person caused (new range, new filter), once, so they can follow it. Animation is the least effective form for analysis (Robertson et al.) but helps perception of a change (Heer and Robertson).
- **If a chart is evidence on a marketing page:** one reveal on first view, `--duration-page` (400 ms) up to the 600 ms ceiling (a long time axis earns the 600: round 1 drew a two-hour story in 400 ms, `kb/reviews/benchmark-round1-landing.md` scorecard Motion), then it is static forever.
- **If the reveal's x axis is time** (a log, a price history, a roast curve): `linear`. A decelerating curve shows the early data racing and the late data crawling, and markers can no longer be synced by a simple delay. Marker delay = its share of the x axis x duration.
- **If a drawing must be revealed:** a two-transform wipe (outer box `overflow: hidden` slides in, inner box slides out by the same amount, so the drawing stays still and only the edge moves). Not `clip-path`, not `stroke-dashoffset` on a large path.
- **If a number changes while visible:** roll only the changed digits, each in its own slot clipped top and bottom (`clip-path: inset(0 -0.25em)`, not `overflow: hidden`, which cuts side bearings under negative tracking), with `tabular-nums`. Up from below for a rise, down from above for a fall. Old digit `--duration-fast` exit, new digit `--duration-base` enter. Reduce: the changed digits crossfade at `--duration-instant`.
- **If two labels share one box** (Add to cart and Added): fade-through, not crossfade. Outgoing `--duration-instant` exit, incoming `--duration-base` enter delayed by `--duration-instant`. Same sequence under reduce, without the movement.
- **If a dialog can open from the keyboard and a pointer:** track input modality (`keydown` and `pointerdown` in the capture phase), set `data-via` on the dialog before `showModal()` and before `close()` (and on `cancel` for Esc), and turn transitions off for `data-via=key`.
- **If the palette is the app's most used control:** no open animation from the keyboard; from a pointer a `--duration-instant` fade, no scale.
- **If a state is reachable by URL for review** (`?open=sheet`): open it without its entrance, or the lint measures mid-scale (a 24 px switch measured 23 px).
- **If a set appears for the first time after an action** (Retry): stagger opacity 30 ms per item, last item starting within 150 to 300 ms. Never on re-sort or filter.
- **If a contour field or other line art reveals line by line:** opacity per line, step = min(40, 300 / (lines - 1)) ms, so the whole rise starts within 300 ms. The levels read as one wave, so a step under 30 ms is fine here (opinion).
- **If a loader might show:** delay it 300 ms (`animation-delay` on an opacity entrance), so fast answers never flash it.

### Numbers
| Move | Spec |
|---|---|
| Curve or line reveal (marketing) | 400 to 600 ms (`--duration-page` 400 ms, the ceiling 600 ms), linear; markers `--duration-fast`, `--ease-enter`; labels one `--duration-instant` after their marker |
| Digit roll | out `--duration-fast` `--ease-exit` to 100% away; in `--duration-base` `--ease-enter` from 100% |
| Badge bump with a count change | scale 1, 1.15, 1 over `--duration-base`, `--ease-standard`, once |
| Label fade-through in a button | 100 ms out, 200 ms in after it; 6 px travel along the direction of change |
| Check draw | `stroke-dashoffset` 1 to 0 with `pathLength="1"`, `--duration-base`, delayed one instant; icons 16 px only |
| Row menu | opacity plus scale 0.95, origin at the trigger corner, `--duration-fast` enter, `--duration-instant` exit |
| Dialog from pointer | opacity plus scale 0.96, `--duration-base` enter; exit `--duration-fast` to scale 0.98 |
| Phone drawer | translateX(-100%) to 0 at `--duration-slow` enter; out at `--duration-base` exit; scrim with it |
| Card hover | translateY(-2px) `--duration-fast`; shadow on `::before`, opacity only |
| Loader delay | 300 ms before a skeleton or spinner shows |
| Stagger, first appearance | 30 ms per item (rows), last start within 300 ms |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns
Exemplar hosts are blocked from this environment, so no exemplar motion was filmed. Transition values were read from each site's shipped CSS in the exemplar teardowns (`kb/teardowns/*.md`, branch `claude/exemplar-library-xfa3bl`, measured 2026-10); values below come from there, not from memory.

| Exemplar | Measured | Reading |
|---|---|---|
| Linear | hover color 100 ms `cubic-bezier(.25,.46,.45,.94)`; buttons 160 ms; 14 reduced-motion rules | Product hover sits at `--duration-instant`. |
| Vercel | hover 100 ms `cubic-bezier(.4,0,.2,1)`; opacity 300 ms; 16 reduced-motion rules | Same 100 ms hover; fades at `--duration-slow`. |
| Stripe | links 300 ms `cubic-bezier(.25,1,.5,1)`; reveals 800 ms `cubic-bezier(.165,.84,.44,1)`; heading color fades 1.2 s | Marketing reveals run past the 600 ms page ceiling, on a strong ease-out. |
| Raycast | keys 200 and 400 ms; card slides 700 ms `cubic-bezier(.215,.61,.355,1)`; caret `steps(1)` | Also past 600 ms on marketing reveals. |
| Apple | 300 and 320 ms; 40 reduced-motion rules | The most reduced-motion rules of the set. |

Reading (opinion): product UI from the best teams sits inside the token set (100 ms hovers, 150 to 300 ms state changes). Marketing reveals at Stripe and Raycast run 700 to 800 ms, above the 600 ms ceiling; FOUNDATIONS allows that once per page as the hero reveal (800 ms), sets `--duration-page` at 400 ms and keeps 600 ms as the ceiling for everything else (v0.4.5). All five ship explicit reduced-motion rules. Raycast ships its palette with no open animation, which Kowalski (practitioner, tier 4) calls "the optimal experience". Recheck by pointing `motion-audit.mjs` at the live exemplars when hosts open.

### Signature moves
1. **Linear for time axes.** Ease is for objects; a pen drawing a time series is a clock. Reason: honest speed, and marker sync by multiplication. Shipped example: the coffee roast curve (`kb/tests/design-motion/strips/coffee-1-roast-curve.png`).
2. **The two-transform wipe.** Compositor-only reveal of any drawing, with an 8 px overhang so round caps are not cut. Measured: 3 frames over 25 ms at 4x throttle versus 10 for the old `clip-path` draw (headless, relative).
3. **Animate the change, not the arrival.** Live digits roll; first load is static. Direction encodes the sign of the change.
4. **Fade-through in one box, also under reduce.** The reduced-motion strip of a plain crossfade showed "Add to cartAdded" for 60 ms; the fix applies to both settings.
5. **Modality-aware dialogs.** One dialog, two budgets: keyboard instant, pointer animated. Strips `dash-3` and `dash-4`.
6. **Pause control as part of motion design.** The roll is only acceptable because "Pause updates" exists (WCAG 2.2.2). Paused also mutes the live dot, with the text saying "Resume".
7. **Film with frozen time.** Freeze every new animation in its first frame from inside the page (a `requestAnimationFrame` loop, not a round trip from the test script: a 100 ms fade was over before a polled check saw it), then seek all of them together with `currentTime`. Deterministic frames, no video.
8. **Read timings from the browser, not the source.** The audit found `ease` on two visibility entries that reading the CSS had missed, because the default curve is invisible in the source.

### Do and don't
- Do: draw the roast curve once, linear, in 600 ms. Don't: draw it over 1800 ms with an ease (the previous page): off the token set and the curve appears to roast fastest at the start.
- Do: fade a hover shadow on `::before`. Don't: `transition: box-shadow`.
- Do: roll the changed digit of 48,210 to 48,236. Don't: count every KPI up from 0 on load.
- Do: open the palette instantly on Ctrl K. Don't: scale it in on every keystroke.
- Do: write a reduced-motion matrix as a comment next to the motion. Don't: `* { animation: none !important }`.

### Worked examples
1. **Coffee roast curve.** Job: orientation (time runs left to right) and attention (the page's one piece of evidence). Below the fold, so it may reveal. Trigger: 40 percent in view, once. Wipe at 600 ms linear; turning point (share 0.15) pops at 90 ms, yellowing (0.53) at 318 ms, first crack (0.83) at 498 ms; labels 100 ms after each. Reduce: drawn at first paint.
2. **Tally live KPI.** Job: feedback that data changed. Poll every 60 s; WAU 48,210 to 48,236: digits 1 and 0 roll up, "48,2" never moves. Revenue 184.2 to 184.6: one digit. No announcement (a polite update every minute is noise); the sr-only value is current when read. "Pause updates" in the header; on phones it shows "Pause" with "Pause updates" as the accessible name.
3. **Shortcut sheet.** From the sidebar button: fade plus scale 0.96 over 200 ms, backdrop with it; close button: 150 ms exit. From `?`: instant open; Esc: instant close.

## Hand-offs
- dataviz owns chart design; this chapter only decides whether and how a chart moves.
- design-product-ui owns the live-update model and where the pause control lives; design-copy writes "Pause updates" and "Resume".
- design-frontend owns the test harness; `motion-audit.mjs` is the motion half of it.
- Lint (`tools/lint.mjs`) owns the gate; the audit is evidence alongside it. Suggested lint changes are in `kb/reviews/design-motion-pipeline-notes.md`.

## Running the audit
```bash
cd tools && npm ci && cd ..          # once; Playwright Chromium from /opt/pw-browsers
node skills/design-motion/assets/motion-audit.mjs kb/tests/design-motion/scenarios.mjs out/strips
node skills/design-motion/assets/motion-audit.mjs my-scenarios.mjs out/strips --only menu,drawer --frames 8
```
A scenario is one user action: `{ name, url, width, scheme, setup, trigger, clip, expect: 'motion' | 'none' }` (example file: `kb/tests/design-motion/scenarios.mjs`). Output per scenario: a PNG strip (no-preference row, reduce row, timing table) and `motion-audit.json`. Exit 1 on any off-token duration or curve, any layout or shadow property animating, any movement under reduce, or a keyboard path that animates. It does not judge purpose, choreography or taste: look at every strip.
