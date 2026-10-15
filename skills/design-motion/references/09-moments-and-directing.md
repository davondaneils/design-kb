# 09. Moments and directing: the shot plan, the moment kit, and the blind gate

Why this reference exists: the fresh brief built a page that passed every motion check (ladder, scene, holds, reduce) and still read as "not anything special" on video (Davon, 2026-10-15; `kb/tests/fresh/RESULTS.md`). Presence checks cannot tell a moment people remember from a bar filling. This reference turns what the remembered moments do (`kb/moments/STUDY.md`, nine moments timed to the frame) into a plan the builder writes, a kit the builder starts from, and a judge the builder cannot talk past.

Everything below is measured unless marked **opinion**. The directing method (event shot, screen ownership, reading hold, 0.1s offsets, 1.00 to 1.03 push, three stills, four-field corrections) is from the Remotion launch-film article linked in x.com/skunzu/status/2110097012339200134 (article x.com/i/article/2108585693232455681); the exemplar timings show the same rules at work.

## 1. Fundamentals (non-negotiable)

1. **Every scene is directed by a shot plan.** One shot per beat, written before the CSS: the state, the one element that **owns** the screen, the text the viewer must **read**, and for the event the **aim** (cursor target), the **press** and the result. `motion-plan-check.mjs` fails a scene without one (`plan`).
2. **One owner at a time.** Nothing outside the owner starts moving once a beat's change has settled (`quiet`). Stripe's browser follows the phone by 150 to 250ms and is then still for 7.5s; Linear's product window waits about 1.1s for the headline to be read.
3. **The reading hold is counted from legibility.** Time left in the beat after the change settles is at least `max(1000ms, 300ms + 330ms per visible word)` (reading aloud, 183 words a minute, Brysbaert 2019). A number or price is one word. `read` fails below it.
4. **A product page acts out one event.** Start state, cursor on the action, the press registering, the result owning the screen (`event`). The press is what makes cause and effect visible; a fill bar has no cause.
5. **Changes happen in place.** Roll the value, restack the list, sharpen the text; do not cut to a new picture. Every one of the nine studied moments changes what is already there.
6. **The blind gate is the motion verdict.** A fresh critic sees our moment beside an exemplar's, unlabeled, and must fail to tell them apart and must name a moment in ours it would describe to a friend (section 5). Self-review is not the verdict.

## 2. Writing the shot plan

```html
<div class="mock" id="send-scene" data-scene data-visual="product"
     data-beats="draft:2400 aim:1400 press:1200 sent:4400" data-rest="2400" data-still="sent" aria-hidden="true">
  <script type="application/json" data-shot-plan>
    {"shots": [
      {"state": "draft", "owner": ".invoice",     "read": ".invoice-title"},
      {"state": "aim",   "owner": ".shot-cursor", "aim": ".send"},
      {"state": "press", "owner": ".send",        "press": ".send"},
      {"state": "sent",  "owner": ".receipt",     "read": ".receipt", "push": ".invoice"}
    ]}
  </script>
  ...
  <span class="shot-cursor" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3 2l13 7.5-5.6 1.4 3.2 6-2.4 1.2-3.2-6L3 16z"/></svg></span>
</div>
<button type="button" data-scene-pause aria-controls="send-scene" aria-pressed="false">Pause animation</button>
<script src="scene.js"></script><script src="moments.js"></script>
```

Sizing each beat (worked from rule 3):
| Beat | Change takes | Words to read | Hold needed | Beat |
|---|---|---|---|---|
| draft | 0 (authored state) | "Invoice 0142, Arcadia Studio" = 4 | 1620 | 2400 |
| aim | spring about 520 | none | the cursor arriving | 1400 |
| press | press and release 200 | none | the button visibly pressed | 1200 |
| sent | receipt rise 400 | "Sent to billing@arcadia.studio. Due in 30 days." = 7 | 2610 | 4400 (last beat, also rests 2400) |

Rules of thumb (**opinion**, from the timings): the aim beat is the spring plus about 800ms so the cursor is seen to rest on the target before it presses; the press beat is short; the result beat is the longest in the scene. Offsets between a lead and a follower are `--offset` (100ms; 80 to 250 measured).

Fill the plan from the three stills first (section 6): if the opening, result and ending stills do not tell the story with the motion turned off, no timing will save it.

## 3. The moment kit (`assets/moments.css`, `assets/moments.js`)

Load `motion-tokens.css`, `moments.css`, then `scene.js` and `moments.js`. Each moment is CSS keyed off the state `scene.js` steps; `moments.js` writes the few values CSS cannot know (which value to show, stack depth, the cursor's target, the press).

| Moment | Rebuilt from | Markup | What it does |
|---|---|---|---|
| **swap** | Stripe checkout (833ms rolls, `(.78,0,.22,1)`, browser +150 to 250ms, 7.5s holds) | `<span class="swap" data-swap="usd eur jpy" [data-swap-group="1"]><span class="swap-track"><span>$18.40</span><span>€16.90</span><span>¥2,800</span></span></span>` | Rolls to the value for the current state inside a mask, `--duration-swap` on `--ease-swap`; swaps cascade by `--stagger` in document order; group 1 starts `--offset` x 1.5 later |
| **stack** | Sonner (400ms entry from 100% of its height; older items scale .95 and -14px per level) | `<ol class="stack" data-stack><li data-at="paid">...</li></ol>` | An item joins when its state is reached; older items step back; the fourth fades |
| **event shot** | the article's event, Raycast's closing hotkey, Linear's staging | `.shot-cursor` plus `aim`, `press`, `push` in the plan | Cursor travels on a spring (`spring(300, 26)` sampled into CSS `linear()`, about 520ms, 2.6% overshoot) to just below and right of center; press is scale .97 for two `--duration-instant`; the push is 1.00 to 1.03 over the beat |

The cursor parks at the lower right on the first beat and enters the frame on its first aim; it is hidden in the still frame and under reduced motion (a still with a cursor reads as a screenshot of someone else's screen; **opinion**). **Without JS the markup is the still.** `moments.js` positions swaps and stacks; before it runs (or if it never does) a swap shows its first value and stack items are hidden. So author the still in the markup: put the still's index in `style="--swap-i: 2; --swap-count: 3"` on each `.swap`, and `data-in data-depth="0"` (newest) to `data-depth="2"` on the stack items the still shows. The cursor needs no colours in its markup: `moments.css` paints `.shot-cursor path` from `--color-surface` and `--color-text`, so write `<path d="..."/>` only (a hard-coded fill fails lint `icons`). A play may open on its aim beat: `moments.js` snaps the cursor to the park point and starts the travel two frames later, so it is seen. **Entrances go on the section around the scene, not inside it**: `scene.js` finishes every transition inside the scene when it sets the first state on load (so nothing plays backwards), which also finishes an entrance placed there.

Working fixture: `assets/fixtures/moments-demo.html` (all three, passes `motion-plan-check.mjs`); failing fixture: `assets/fixtures/moments-bad.html` (no plan, two owners, no event, a short hold, a quiet break: five fails).

Curves by job, from the study:
| Job | Curve | Token |
|---|---|---|
| Swap something already on screen | `cubic-bezier(.78,0,.22,1)` (Stripe) | `--ease-swap` |
| Large surface or stack | `cubic-bezier(.32,.72,0,1)` (Vaul) | `--ease-drawer` |
| Arrive | `cubic-bezier(0,0,0,1)` | `--ease-enter` |
| A hand moving | spring 300 / 26 | `--ease-spring` (written by moments.js) |

## 4. The nine moments, as decisions you can reuse

From `kb/moments/STUDY.md`; each line is the decision, not the brand.
1. **Swap in place** (Stripe checkout): keep the layout, roll the values. Shows "any country, same product" without a cut.
2. **Short tight type rise** (Stripe hero): 325ms per word, 50ms apart, while the background only drifts.
3. **Stage the hero** (Linear): text owns the first second; the product arrives about 1.1s later.
4. **Stagger cards, not text** (Raycast): 80ms per card works because each card is a separate thing to look at.
5. **End on the product's own gesture** (Raycast): the closing visual is the hotkey that opens the app, with the call to action under it.
6. **Let the photograph move** (Apple): almost no UI motion; the product video and scroll-tied titles carry it.
7. **Show depth with scale and offset** (Sonner): three items in 74px read as a stack.
8. **Big surfaces get the long settle** (Vaul): 500ms on `(.32,.72,0,1)`.
9. **Collapse as one block** (Stripe): rows below a removed row move together on the swap curve.

## 5. The blind gate (`assets/blind-gate.mjs`)

```bash
# 1. Film ours and the paired exemplars, strip labels, shuffle (live; needs network)
node skills/design-motion/assets/blind-gate.mjs prepare page.html --out gate/ \
  --moment hero:top --moment event:#send-scene --moment swap:#fx-scene
# 2. A fresh critic (no build context) opens gate/trial-*/{A,B}-overview.jpg and -detail.jpg, answers gate/QUESTIONS.md,
#    writes gate/answers.json
# 3. Grade
node skills/design-motion/assets/blind-gate.mjs grade --out gate/
```

- Pairs (`assets/exemplar-moments.json`): scene, swap and event against Stripe's checkout; hero against Linear's hero; stack against Sonner. Every clip is cropped to the product region, fitted to the same 960x600 gray frame and filmed the same way, so framing gives nothing away.
- A trial passes when the critic picks ours as the stronger clip, calls them the same, or picks the exemplar with confidence 1 or 2 of 5, **and** names a memorable moment in ours. The gate passes when every trial has a memorable moment in ours and at most one trial was told apart with confidence 3 or more.
- The critic's corrections come back in four fields (where, problem, change, keep), tied to a timestamp, at most five per clip, ordered: missing information and unreadable text first, then timing, then visual detail. Apply them, then run the gate again with a **new** critic; a critic who has seen the earlier round is no longer blind.
- The key is written outside the folder the critic gets. Do not paste paths, brand names or the build note into the critic's prompt.
- Limits, stated plainly: one critic is a noisy judge (three trials and the confidence rule damp it, they do not remove it); a critic may recognise an exemplar by its content and is asked to say so; the gate judges the moment, not the page around it.

## 6. Review loop (from the article, adapted)

1. **Three stills before movement:** the opening, the result and the ending (`blind-gate.mjs stills page.html --out dir --moment scene:#id` films only ours and writes `ours-stills.jpg`; builders run this, not `prepare`). Is the main text readable, is the result visible, is anything cropped or overlapping, does the ending have room? Fix those before touching timing.
2. **Then the event:** watch the press and the result at normal speed and read the result aloud. Extend any hold that ends before you finish (the check does this arithmetic; the read-aloud test catches what the word count cannot, like a long account number).
3. **Then the boundaries:** the seam between plays and the hand-over between scenes. A seam that shows the story running backwards is a fail (`scene.js` resets under the fade).
4. **Corrections in four fields**, never "make it smoother": `where: B 2.40s, the receipt | problem: the cursor drifts across it at 2.9s | change: hold the cursor still until the seam | keep: the press timing`.

## 7. What blind critics catch: rules from the gate rounds

Each rule below cost a gate round on the Halyard test page (`kb/tests/fresh/landing/gate/`); the presence checks passed every one. Apply them while writing the shot plan, not after the critic finds them.

| Rule | What the critic saw | Enforced by |
|---|---|---|
| **The first look shows the payoff.** A scene in the first screen reaches its result by 4.5s (Linear's product arrives 1.1s after its headline) | "the answer never appears" in a 6s hero clip; the press landed at 5s | `payoff` in `motion-plan-check.mjs` |
| **Waiting is not a moment.** A scan or search beat runs about 1.2s, and each result lands the moment it is found, not all at the end | 3s of sweeping before any answer; "the sweep reads as decoration" | shot plan review (the scan beat has no `read`) |
| **The screen never disagrees with itself.** When one fact changes, everything that shows it changes within `--offset` (100ms, at most 300) | a notice said 13:45 for 3s after the card said 13:20 | three stills plus the read-aloud pass (section 6) |
| **Show the change, not only the new value.** A loss or gain gets its own mark for one beat (the lost 25 minutes as a hatched sliver fading over 600ms) | "the edge pulls in a few pixels and is easy to miss" | shot plan: the result shot's `read` names the change |
| **Time on screen follows the data.** A route leg, a step, a bar gets screen time in proportion to what it stands for, within the beat limits | every leg got the same time, 11 minutes or 42 | **opinion**; review |
| **The tip leads.** A line drawn by a moving dot is drawn with the dot as its tip, same curve, same duration; counters run while the thing moves | the line trailed the dot by 0.3s; time and distance jumped after the dot stopped | review at 10 frames a second (the gate's detail sheet) |
| **Overlays sit inside their surface.** A result panel seats inside the card or keeps a clear gap with aligned edges | the plan panel overhung the card's bottom and right edges, in both rounds | `lint.mjs` overlap |
| **Nothing on screen is dead.** A field that never changes in a moving scene is removed or made to move | "With you" in the Stream column never changed | review |
| **No decoration behind the product.** A flat surface or one quiet tint; glows and rainbow halos lose the eye | flagged in both rounds | design-graphic imagery rules |
| **Status follows the thing.** A header count updates `--offset` after the items it counts land, never before | "2 windows found" changed before the windows | `quiet` (the header is not the owner) |

## 8. Myths

| Myth | Correction |
|---|---|
| More motion reads as more premium | Stripe holds each checkout state 7.5s and changes it in under 1.1s. Stillness is most of the moment |
| A scene is a progress bar plus a status label | Nobody remembers a bar filling. The event (a press with a visible result) is what the viewer can follow |
| Ease-out for everything | An in-place swap uses a hard ease-in-out: both ends are on screen, so it accelerates out and lands (Stripe `(.78,0,.22,1)`) |
| The hero should animate everything at once | Linear makes the product wait about 1.1s so the headline is read first |
| Passing the checks means the motion is good | The fresh brief passed every presence check and was "not anything special". The blind gate is the verdict |
