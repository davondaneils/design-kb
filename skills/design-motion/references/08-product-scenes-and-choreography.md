# 08 Product scenes and choreography

How a product page earns its motion: a mock-up that acts out the product on a scripted timeline, text that rises through a mask, blocks that arrive with the fade split from the move, all planned as a ladder before any code. Every number here is from `kb/FOUNDATIONS.md` v0.5 (Motion) or the live capture of the exemplars (`kb/teardowns/motion-imagery.md`, raw `kb/teardowns/data/choreo/`). Runnable fixture of everything below: `assets/fixtures/scene-good.html` (lint PASS with 0 warnings; `motion-plan-check.mjs` PASS at 1440 and 390).

Why this chapter exists: both benchmark builders shipped one transition duration, one curve and one generic hero reveal; the critic's verdict was "nothing else moves with meaning: no Sending-to-Paid change, no rate tick before approval, and reduced motion deletes the FAQ's open state" (`kb/reviews/benchmark-round2-landing.md`, Motion row). Stripe, measured the same way, ran 721 animations on 20 durations, most of the long ones inside product mock-ups.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Plan first.** The motion plan table (SKILL.md section 2) exists before any motion code: each moving thing, job, band, duration, curve, trigger and reduced-motion end state. [judged]
2. **Three to five bands.** Press and hover, UI change, entrance, reveal, scene; one hover speed per page. [`motion-plan-check` bands]
3. **A product page has a scene** that acts out its core state change: three or more states, beats 1200 to 4500ms, each state still for 1000ms or more, loop 12s or less, rest 2s or more. [`motion-plan-check` scene, beats]
4. **A scene runs only when seen and stops when asked**: starts when a third is on screen; pauses on hover, focus inside, hidden tab and a visible pause button (WCAG 2.2.2, because a loop lasts over 5 seconds). [`motion-plan-check` behavior]
5. **Under reduce a scene is its still frame**, the final and most informative state, with nothing animating inside it; every other end state stays too (open icons rotated, selected indicators in place). [`motion-plan-check` reduce; lint `motion`]
6. **Choreography ranges.** Stagger gaps 20 to 80ms (`--stagger` 40ms); one group spreads at most 500ms for text and 800ms for cards; entrance travel 8 to 50px (`--travel` 16px) or a 100% rise inside a clipping mask. [`motion-plan-check` stagger, travel]
7. **Scene numbers are true at every beat.** A total re-foots from the lines as displayed, before and after the change, marked `data-sum-of` so the lint re-adds it. [lint `truth`]
8. **The first screen's text never waits.** The h1 and lead paint at once; masked rises and reveals are for section headings and blocks below the fold (web.dev LCP; SKILL.md fundamental 10). [judged]

### Standards
| Rule | Source |
|---|---|
| Moving content that starts automatically, lasts over 5 s and sits beside other content: pause, stop or hide | WCAG 2.2.2 (A) |
| Interaction-triggered motion can be turned off; blur counts | WCAG 2.3.3 (AAA), erratum |
| Elements at opacity 0 are not LCP candidates in Chromium | web.dev, LCP |
| `animation-delay` and `transition-delay` accept `calc()` of custom properties | MDN `calc()` |
| A CSS transition interrupted mid-flight reverses from its current value; a reversed transition is shortened in proportion | CSS Transitions Level 1, "reversing shortening factor" |

## Principles
1. **The product is the protagonist.** The page around it is calm so the scene can move (measured: Stripe's long timelines live in `payments-graphic__*`, Raycast's in keys and a typing cursor, Linear's in an agent working; same file, section 2, pattern 1).
2. **A scene is mostly stillness.** States are held long enough to read; the move between them is a UI-band transition (Stripe's keyframes repeat values to hold: `translateY(-16px), -16px, -16px, 0, 0` on a 4480ms timeline).
3. **Time only flows forward.** Values leave in the direction time flows and the story never rewinds step by step; the replay returns to the first state in place, in one change (v0.4.3, below).
4. **Every move has a band.** If two moves share a job they share a duration; if they share a duration they share a job (opinion, from the ladder).

## Decision rules
- **If the page sells a product with a state change** (money moves, a booking confirms, a deploy goes live, a ticket closes): build a scene of that change. **If not** (an agency, an event, a type foundry): no scene; run the check with `--no-scene` and name the reason in the plan.
- **Pick the states** a buyer would say out loud, three to five: Queued, Sending, Paid. Booking: Held, Confirmed, Ticket issued. Deploy: Building, Checks passed, Live. Support: New, Assigned, Resolved. If the labels would fit any competitor, rewrite them with the product's own nouns.
- **Beat length = reading time.** 1200ms for a one-word change, 2400ms when a fill or a count runs, 3200 to 4500ms for the final, most informative state. Opinion: the move takes at most a third of the beat.
- **If a state has a continuous process** (sending, building, uploading): a `linear` fill over the beat minus `--duration-reveal`, so the full bar is held before the next state (Raycast's bar runs `scaleX(0)` to `.95` over 5000ms linear).
- **If text changes inside the mock-up**: a value stack (all values stacked in one clipped grid cell; past at -100%, current at 0, future at 100%), `--duration-slow` on `--ease-standard`. Stripe slides 11 `*-values` slots this way on 1420ms timelines.
- **If a number changes**: a value stack too, old out at `--duration-fast` on `--ease-exit`, new in at `--duration-base` on `--ease-enter` after `--duration-instant`, rising for an increase (reference 07, digit roll).
- **If the page has several mock-ups** (the visual plan asks for three or more fragments): one full scene in the hero or the first feature, and one-beat scenes (a single state change on scroll into view, played once) on the others. Several looping scenes on one screen compete (opinion).
- **At 390** keep the scene and crop the mock-up; never swap it for a static image or cut its numbers (Stripe at 390 shows 14 mock-ups against 12 at 1440, same file section 3; design-layout gate rule 18).
- **Section heading enters on scroll**: masked word rise. **A block or card enters on scroll**: split fade and move. **The h1**: neither.
- **Text on a dark section**: the blur-in may replace the move (opacity plus `blur(10px)` to 0, up to 1000ms, 33 to 40ms apart; Linear).
- **Anything digital** (a caret, a terminal line, a dot-grid figure): `steps(1)`.

## Numbers
| Move | Spec | Measured basis |
|---|---|---|
| Scene beat | 1200 to 4500ms; hold 1000ms or more | Stripe 1420, 2260, 4480ms |
| Scene loop | 12000ms or less; rest 2000ms or more on the last frame | Stripe 11950ms timeline, 4000ms delay before replay |
| Scene replay | in place: the first state returns in one change on its own curves (`data-seam="fade"` for the old fade seam) | gate round v07, 3 of 3 critics |
| Value stack swap | `--duration-slow`, `--ease-standard`, 100% of the slot | Stripe 1420ms timelines, `translateY(0)` to `-100%` |
| Progress fill | `linear`, `calc(var(--beat) - var(--duration-reveal))` | Raycast 5000ms linear to `.95` |
| Masked word rise | `--duration-slow`, `--ease-enter`, `--stagger` apart, from 100% | Stripe 325ms, 50ms apart, 22 words, 500ms |
| Block reveal | opacity `--duration-reveal` on `--ease-standard`; move `--travel` on `--ease-enter`, delayed `--duration-fast` | Mercury 670ms, 50px, move 150ms after fade |
| Card stagger | `calc(var(--stagger) * 2)` (80ms), spread 800ms or less | Raycast 80ms on 17 cards |
| Text blur-in | opacity plus `blur(10px)` to 0, up to 1000ms, `--stagger` apart | Linear 1000ms, 33ms over 8 lines |
| Caret, dot grid | `steps(1)` | Raycast 1100ms caret; Linear 2800ms grid |

## Worked examples

### 1. A ledger row goes Queued, Sending, Paid, and the total re-foots
Brief: payroll product, hero visual. The state change that is the product: a payment leaving and landing. Job: explain the product. Band: scene. States: queued (1600ms, one word changes), sending (2400ms, a fill runs), paid (3200ms, the final frame, also the still), rest 4000ms.

```html
<figure class="visual" data-visual="product">
  <!-- Authored on the still frame: right without JS, under reduce and in screenshots -->
  <div class="mock" id="run-scene" data-scene aria-hidden="true"
       data-beats="queued:1600 sending:2400 paid:3200" data-rest="4000" data-still="paid"
       data-state="paid" data-seen="queued sending paid">
    <div class="mock__head"><span>Payroll run, Oct&nbsp;30</span>
      <span class="slot"><span class="v-before">2 of 3 paid</span><span class="v-after">3 of 3 paid</span></span></div>
    <ol class="ledger">
      <li class="row row-done"><span>Ana Ruiz</span><span class="amt">$6,250.00</span><span class="status">Paid</span></li>
      <li class="row row-done"><span>Kenji Mori</span><span class="amt">$4,800.00</span><span class="status">Paid</span></li>
      <li class="row row-live"><span>Priya Nair</span><span class="amt">$5,410.00</span>
        <span class="slot"><span class="s-queued">Queued</span><span class="s-sending">Sending</span><span class="s-paid">Paid</span></span>
        <span class="bar"></span></li>
    </ol>
    <div class="mock__foot"><span>Paid so far</span>
      <span class="slot mock__total">
        <span class="v-before" data-sum-of="#run-scene .row-done .amt">$11,050.00</span>
        <span class="v-after" data-sum-of="#run-scene .row .amt">$16,460.00</span></span></div>
  </div>
  <div class="visual__foot">
    <figcaption>Sample run: the last payment moves from queued to sending to paid, and the paid total updates.</figcaption>
    <button class="pause" type="button" data-scene-pause aria-controls="run-scene" aria-pressed="false">Pause animation</button>
  </div>
</figure>
<script src="scene.js"></script>
```

```css
.mock { font-size: var(--text-xs); font-variant-numeric: tabular-nums; }
.row { position: relative; display: grid; grid-template-columns: 1fr auto auto; gap: var(--space-4); }
.slot { display: grid; overflow: clip; }          /* the mask every value stack lives in */
.slot > * { grid-area: 1 / 1; visibility: hidden; transform: translateY(100%); }   /* future values wait below */
[data-state="queued"] .s-queued, [data-state="sending"] .s-sending, [data-state="paid"] .s-paid,
[data-scene]:not([data-state="paid"]) .v-before, [data-state="paid"] .v-after { visibility: visible; transform: none; }
[data-seen~="sending"] .s-queued, [data-seen~="paid"] .s-sending, [data-state="paid"] .v-before { transform: translateY(-100%); } /* past values sit above */
.bar { position: absolute; inset-inline: 0; inset-block-end: 0; block-size: var(--space-1);
       background: var(--color-primary); transform: scaleX(0); transform-origin: left; opacity: 0; }
[data-state="sending"] .bar { opacity: 1; transform: scaleX(1); }

/* Motion only when welcome. Under reduce every rule above still applies: the still frame, no transitions. */
@media (prefers-reduced-motion: no-preference) {
  .slot > * { transition: transform var(--duration-slow) var(--ease-standard), visibility var(--duration-slow) linear; }
  .v-before { transition: transform var(--duration-fast) var(--ease-exit), visibility var(--duration-fast) linear; }
  .v-after  { transition: transform var(--duration-base) var(--ease-enter) var(--duration-instant), visibility var(--duration-base) linear; }
  .bar { transition: opacity var(--duration-fast) var(--ease-standard); }
  [data-state="sending"] .bar {
    transition: opacity var(--duration-fast) var(--ease-standard),
                transform calc(var(--beat) - var(--duration-reveal)) linear;   /* fill, then hold */
  }
  .mock { transition: opacity var(--duration-fast) var(--ease-standard); }
  .mock[data-scene-seam] { opacity: 0; }   /* replay through a seam, never backwards */
}
```
Why each choice: the value stacks mean no label ever reflows the row; the total uses two stacked values each marked `data-sum-of` with its own selector, so whichever is visible is re-added by the lint after every beat; `visibility` hides the off values from the lint's text checks and from selection; the fill ends `--duration-reveal` before the beat so "Sending" is read with a full bar; the paid total rises (a rise is an increase). `scene.js` steps `data-state`, writes `data-seen` and `--beat`, and owns pause, in-view, seam and the reduce still; it reads no millisecond literal (beats from `data-beats`, the seam from `--duration-fast`). Filmed: `motion-audit` on this scene passes (300, 200, 150 and 1800ms, all on tokens or inside `[data-scene]`).

A second brief, same pattern: a booking product. States Held (1200ms: seat highlighted), Confirmed (2400ms: the button label stacks from "Confirm seat" to "Confirmed", a check draws at `--duration-base`), Ticket issued (3600ms: the ticket card rises `--travel` from behind the summary, the balance re-foots). Still frame: Ticket issued.

### 2. A masked heading rise
Brief: the "How a run works" section heading. Job: attention, once. Band: UI change. Words rise 100% inside a clip, `--stagger` apart.

```html
<section id="how" data-reveal>
  <h2><span class="w"><span style="--i:0">How</span></span> <span class="w"><span style="--i:1">a</span></span>
      <span class="w"><span style="--i:2">run</span></span> <span class="w"><span style="--i:3">works</span></span></h2>
</section>
```
```css
.w { display: inline-block; overflow: clip; vertical-align: bottom;
     padding-block-end: var(--space-2); margin-block-end: calc(-1 * var(--space-2)); } /* descenders survive the mask */
.w > span { display: inline-block; }
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal]:not([data-in]) .w > span { transform: translateY(100%); }
  .js [data-reveal][data-in] .w > span {
    animation: word-rise var(--duration-slow) var(--ease-enter) calc(var(--i) * var(--stagger)) both;
  }
}
@keyframes word-rise { from { transform: translateY(100%); } to { transform: none; } }
```
```js
document.documentElement.classList.add('js'); // in <head>: hide nothing unless JS runs
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); }
}), { threshold: 0.25 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```
Why: words, not letters (letters at 40ms would spread past 500ms on any real heading); the spaces stay as text nodes between spans so screen readers read words; the 100% travel is allowed because it is a mask, and it is measured as one (`motion-plan-check` reports "masked"). Over eight words, stagger the first eight and bring the rest with the eighth (500ms spread for text). Reduce: the heading is simply there.

### 3. A staggered card reveal, fade split from move
Brief: three step cards under that heading. Job: orientation. Band: reveal.

```css
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal]:not([data-in]) .card { opacity: 0; }
  .js [data-reveal][data-in] .card {
    animation:
      card-fade var(--duration-reveal) var(--ease-standard) calc(var(--i) * var(--stagger) * 2) both,
      card-rise var(--duration-reveal) var(--ease-enter) calc(var(--duration-fast) + var(--i) * var(--stagger) * 2) both;
  }
}
@keyframes card-fade { from { opacity: 0; } }
@keyframes card-rise { from { transform: translateY(var(--travel)); } }
```
Why: two animations, two curves, a `--duration-fast` offset, as Mercury does (fade from 0ms, 50px move from 150ms, 670ms each). The card is visibly present before it settles, so it never slides across the page half-transparent. Cards stagger at twice the text gap (Raycast 80ms) and three cards spread 160ms.

### 4. The motion plan for the whole page
Payroll product landing page, written before the build (a shorter version sits as a comment at the top of the fixture's CSS).

| Moving thing | Job | Band | Duration | Curve | Trigger | Reduced-motion end state |
|---|---|---|---|---|---|---|
| Links, CTA, summaries, pause button | feedback | press/hover | `--duration-instant` (one hover speed) | `--ease-standard` | hover | same color change, kept |
| CTA press | feedback | press/hover | `--duration-instant`, scale 0.97 | `--ease-standard` | press | color only |
| Hero h1 and lead | none | none | none: paint at once | none | none | in place |
| Run scene (hero mock-up) | explain the product | scene | beats 1600 / 2400 / 3200, rest 4000 | per part | a third in view; loops | still: Paid, 3 of 3, $16,460.00; pause button hidden |
| Status label stack | state change | UI change | `--duration-slow` | `--ease-standard` | beat | "Paid" in place |
| Sending fill | state change | scene | beat minus `--duration-reveal` | `linear` | beat | not shown (paid) |
| Total and count stacks | state change | UI change | out `--duration-fast`, in `--duration-base` | exit, enter | beat | final values |
| Rate-lock fragment (feature 2) | explain a feature | scene, one beat | 2400 then still | `--ease-standard` | in view, once | locked rate shown |
| Section headings | attention | UI change | `--duration-slow`, `--stagger` | `--ease-enter` | in view, once | in place |
| Step cards | orientation | reveal | `--duration-reveal`, 80ms apart | fade standard, move enter + `--duration-fast` | in view, once | in place |
| FAQ disclosure and icon | state change | UI change | `--duration-base` | `--ease-standard` | open | open, icon rotated 45deg |
| Menu (phone) | spatial | UI change | `--duration-slow` in, `--duration-base` out | enter, exit | tap; instant from keyboard | open, no slide |

Bands used: press/hover, UI change, reveal, scene (four). Not used: entrance (the hero has no reveal; the scene is the hero's motion). Check output on the fixture:

```
motion-plan-check skills/design-motion/assets/fixtures/scene-good.html at 1440px
  animations 57 (reduce 6); ladder 100/150/200/300/600/1800 ms
  bands 4: UI change 200/300; reveal 600; press/hover 100/150; scene 1800
  scenes #run-scene [queued:1600 sending:2400 paid:3200] seen queued>sending>paid
  staggers 4@41ms over 122ms, 3@80ms over 160ms, 3@80ms over 160ms; entrances 7 (4 masked)
PASS: ladder, scene, stagger, travel and reduced motion meet FOUNDATIONS v0.5
```
(The 150 in the press/hover band is the seam and the total's exit, not a second hover speed; hover runs at 100 only.)

The benchmark's Ferry page through the same check: three bands (100, 200, 400), no scene, and five FAQ items whose open state differs under reduce. Exit 1.

## Ceiling: expert moves
1. **Value stacks over text swaps** (Stripe, 11 slots on 1420ms timelines): no reflow, direction carries meaning.
2. **The replay.** Return to the first state in place, in one change on the state's own curves (`scene.js` default since v0.4.3), never a blank frame: three of three blind critics read the whole-mock fade as a cut (gate round v07). A scene that rewinds step by step (Paid sliding back through Sending to Queued) still teaches the wrong story; one in-place change does not. `data-seam="fade"` keeps the fade-out seam where an in-place return cannot be shown.
3. **Rest on the proof.** The rest frame, the reduce still and the screenshot are the same frame: the one with the final number. Opinion: choose the still first and script backwards from it.
4. **Pause on hover is a reading aid**, not only compliance: someone pointing at the mock-up is reading it (opinion).
5. **One full scene per screen.** Other fragments play one beat once when they enter (opinion; competing loops split attention).
6. **Script the numbers.** Write the scene's figures in a table before markup: each line, each state's total, each count; then mark the totals `data-sum-of`. The scene is the page's most-watched claim.
7. **Masks get padding.** A word mask cuts descenders at line-height 1.2; pad the clip by `--space-2` and pull it back with the same negative margin.

## Do and don't
- Do: the payment line goes Queued, Sending, Paid and the total adds it. Don't: fade a static screenshot of the dashboard up on scroll.
- Do: hold each state 1000ms or more. Don't: run three states in 900ms because "it feels snappy"; nobody can read it.
- Do: under reduce, show "Paid" and the final total. Don't: show frame 0 ("Queued", the old total) or an empty card.
- Do: rotate the FAQ icon with no transition under reduce. Don't: `transform: none !important` under reduce.
- Do: one hover speed everywhere. Don't: 100ms on links, 150ms on buttons, 300ms on cards.
- Do: rise section headings through a mask. Don't: mask or fade the h1.

## Where this domain is usually wrong
| Belief | Correction | Source |
|---|---|---|
| "Restraint means no motion" | Restraint is in the page; the product moves. Pages with no ladder scored "clearly below" twice | `kb/tests/benchmark/RESULTS.md`; FOUNDATIONS v0.5 |
| "Reduced motion means `animation: none !important` everywhere" | It deletes end states and meaningful fades; replace movement, keep states | `kb/reviews/benchmark-round2-landing.md` item 15c; Comeau |
| "Nothing should run longer than 500ms" | True for anything a person triggers or repeats (NN/g). A scene beat waits on no one, so 1.2 to 4.5s beats are fine when it runs in view, pauses and stills under reduce | NN/g; FOUNDATIONS v0.5 |
| "The exemplars handle reduced motion, so copy them" | Stripe keeps its headline rise, Linear its stepped loops, Raycast nearly everything | `kb/teardowns/motion-imagery.md`, reduced-motion section |
| "More curves look richer" | Stripe ships 12 curves; Linear and Raycast carry their pages on 6 to 8 measured, of which few do the work. Three to five, each with a job (opinion) | same file, section 2, pattern 5 |
| "A pause button is only for videos and carousels" | WCAG 2.2.2 covers any moving content that starts by itself and lasts over 5 s, which includes every looping scene | W3C Understanding 2.2.2 |

## Hand-offs
- **design-art-direction** owns the visual plan and the concept the scene acts out; this chapter owns the timeline. The scene's states come from the concept, not from what is easy to animate.
- **design-copy** writes the state labels and the caption; they are claims and follow its truth rules.
- **design-layout** owns the phone crop of the mock-up; nothing in the scene is cut at 390.
- **Accessibility** (design-foundations): the mock-up is `aria-hidden`; the figcaption says what it shows; the pause button is a real `button` with `aria-pressed` and `aria-controls`.
- **design-frontend**: `scene.js` is about 120 lines with comments, no dependencies; load it at the end of `body` or with `defer`.
