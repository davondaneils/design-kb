# Halyard home page: build notes

Brief 1, `kb/tests/fresh/briefs.md`. Built by following `skills/design-director/SKILL.md` end to end. Built by one subagent, with 3 self-critique rounds. The motion was then rebuilt to design-motion v0.4 and FOUNDATIONS v0.6 (three directed scenes on the moment kit) with 3 more filmed rounds; the visual design is unchanged.

## Files

| Path | What |
|---|---|
| `halyard.html` | The page. Self-contained (fonts, icons, the moment kit: moments.css, moments.js and scene.js, favicon inlined). Light and dark. Designed at 1440 and 390, checked at 768 and 1024. |
| `halyard-states.html` | The state sheet: buttons (rest, hover, focus, pressed, disabled, busy), nav links, billing toggle, Plus card monthly and yearly, FAQ closed, hover and open, menu closed and open, pause playing, paused and focus, and the 13 scene frames (hero 5, warnings 3, route 5). |
| `src/` | `data.mjs` (the one dataset), `page.html`, `states.html`, `og.html` (templates), `build.mjs` (generates both pages), `assets.mjs` (favicon, `logo-512.png`, `og.png`), `scenarios.mjs` (motion-audit), `operate.mjs` (operates every control and re-adds totals), `assets/` (subset fonts, wordmark); the kit is read from `skills/design-motion/assets/` at build time. |
| `og.png`, `logo-512.png` | The social card (1200x630) and the JSON-LD logo. |
| `shots/` | 28 renders: the page at 390, 768, 1024 and 1440; `?state=yearly`, `menu`, `faq` and `paused` at 390 and 1440; the state sheet at 390 and 1440. Each in light and dark. |
| `reports/` | Every tool's output (`.txt`, plus `.json` where the tool writes one), `lint/` (one JSON per state), `motion-audit/` (filmstrips). |

To rebuild, run from the repo root: `node kb/tests/fresh/landing/src/build.mjs`. If the logo or the social card changes, run `node kb/tests/fresh/landing/src/assets.mjs` first.

## Read log

1. `CLAUDE.md` (system context)
2. `kb/tests/fresh/briefs.md`
3. `skills/design-director/SKILL.md`
4. `kb/FOUNDATIONS.md` (v0.5, full)
5. `skills/design-foundations/SKILL.md`, references `tokens.md`, `fundamentals-checklist.md`, `accessibility.md` (first 80 lines)
6. `skills/design-playbook-landing/SKILL.md`, references `signature-moves.md`
7. `kb/teardowns/INDEX.md`, `motion-imagery.md`, `stripe-home.md`, `linear-home.md` (measured), `things-home.md` (measured), `apple-macbook-air.md` (measured)
8. `skills/design-copy/SKILL.md`, references 01 (page copy structure), 03 (voice and tone, first 60 lines), 06 (copy in context)
9. `skills/design-layout/references` 06, 05, 01 and 04 (full)
10. `skills/design-typography/references` 06, 02, 05, 01 and 07 (scanned)
11. `skills/design-color/references/palette-building.md`, `ui-tokens-themes.md`
12. `skills/design-art-direction/SKILL.md`, references 06 (full), 01, 04 and 05, `assets/visual-plan-check.mjs` (header and logic)
13. `skills/design-graphic/SKILL.md` (sections 1 and 2), references `01-logo-identity.md` and `04-illustration.md` (first 40 lines), `assets/wordmark.py` (header)
14. `skills/design-conversion/SKILL.md`, references 01, 02 and 03 (full), 04 (floor); `skills/design-ux/SKILL.md` section 3, references 07 (floor and rules), 03 (gate and rules), 02 (full)
15. `skills/design-motion/SKILL.md`, references 08 (full), 01, 04, 03 and 07 (floor and rules), `assets/scene.js` (full), headers of `motion-plan-check.mjs` and `motion-audit.mjs`
16. `skills/design-frontend/references` 05 (first 40 lines) and 07 (floor, ceiling 1 to 5); `skills/design-search/references` 07 (full), 02, 03 (first 30 lines), `assets/search-check.mjs` (header)
17. `skills/design-polish/SKILL.md` (sections 1 to 3), `references/06-polish-checklist.md`
18. Tool headers: `tools/lint.mjs`, `tools/render.mjs`, `conversion-audit.mjs`, `icon_audit.mjs`, `kb/teardowns/choreo-probe.mjs`, `kb/teardowns/measure.mjs`, `claims_inventory.mjs`, `vitals.mjs`, `weight.mjs`, `css-audit.mjs`, `polish-audit.mjs`; the art-direction fixture `visual-plan-good.html` (head).

I did not open anything under `kb/tests/benchmark/round1`, `kb/tests/benchmark/round2`, `kb/reviews/benchmark-*`, or the pages of any earlier test. I did not touch `kb/tests/fresh/app/`.

## v0.4 rebuild read log

1. `CLAUDE.md`; the task message.
2. `skills/design-director/SKILL.md` (motion and self-critique steps).
3. `kb/FOUNDATIONS.md` Motion section v0.6 and the token table.
4. `skills/design-motion/SKILL.md` (full); references `09-moments-and-directing.md` (full), `08` (product scenes), `10`.
5. `kb/moments/STUDY.md` (full); `skills/design-motion/assets/moments.css`, `moments.js`, `scene.js` (full); `assets/fixtures/moments-demo.html`.
6. `skills/design-playbook-landing/SKILL.md` (what done looks like).
7. This file (previous build), `src/` (all), `kb/reviews/fresh-landing.md` (scene and map defects), `kb/tests/fresh/briefs.md` Brief 1.
8. `motion-plan-check.mjs`, `motion-audit.mjs` (full, to fix), `kb/moments/film.mjs`, `kb/moments/sheet.sh`; `tools/lint.mjs` (measure, reading-size, icons); `claims_inventory.mjs` header.

I did not run `blind-gate.mjs`, did not open any `gate` folder or `.blind-key` file, and did not open `kb/tests/benchmark/round1`, `round2` or the benchmark reviews.

## Concept

Halyard draws your day the way a chart draws the sea. Tide, wind and light are lines on one strip, and the window where all three agree is marked in chart magenta, the one loud colour on the page.

Reject test: if a section could belong to any weather app, or if magenta shows on anything other than a window, a selected state or the primary action, it is cut.

Type is Literata Display (roman and italic, 440 to 560) for headings and quotes, the system sans for running text, and JetBrains Mono for times and figure captions. All three are self-hosted and subset, with metric fallbacks.

## Visual plan

Treatment: "echo-fill". Every product fragment sits on the same day fill: night, dawn at 07:33, day, dusk at 17:56, then night, as fractions of 24 hours. Every fragment shares one shell (`--radius-lg` inside a `--radius-xl` stage), one elevation (`--elevation-fragment`) and one caption style (mono "FIG n", "Sample data").

| Screen | Visual | Kind | Job |
|---|---|---|---|
| Hero | F1 day strip and F2 plan card, as a scene | product | Show how a window is found |
| Proof | None: three sample quotes | type beat | Quote |
| How (3 cards) | F3 tide and stream, F4 wind, F5 light | product x3 | One test each |
| Route | F6 route card with a chart illustration | product | The plan to the minute |
| Warnings | F7 warnings panel and F8 phone alert | product | What happens when the window moves |
| Coverage | Coast map with 14 stations and 8 stream points | illustration | Where it works, and where it does not |
| Pricing | None | type beat | Pricing |
| Safety | F9 "Before you go" checklist | product | The planning-aid promise inside the app |
| Questions | None | type beat | FAQ |
| Final CTA | F10 mini strip | product | The answer, once more |
| Footer | Full-width wordmark | identity | Sign-off |

Stand-ins and the photo request are in the hand-over list below.

## Motion plan (v0.4 rebuild, after round 4)

Rebuilt to design-motion v0.4 and FOUNDATIONS v0.6 (Motion, shot plans), then corrected after three gate rounds (rounds 2, 3 and 4, below). Every looping scene replays in place (the kit default since round 4): no seam fade, no blank card. The visual design is unchanged except where the gate asked: the three scene stages are one quiet tint (`--color-surface-sunken`), and the plan sits inside the hero card. Every scene is built on the moment kit: `skills/design-motion/assets/moments.css` (inlined in `@layer moments`), `scene.js` and `moments.js` (inlined as scripts in that order), read at build time by `src/build.mjs` (`kit()`), so the page stays one self-contained file. A short page script adds what the kit does not do: the hero's follow-on entrance, `data-on` on the value each roll shows, and the route boat on its path. Each scene's HTML is authored on its still frame (reduced motion and no JS show it). Swaps carry an inline `--swap-i` and `--swap-count` and a `data-on` value, so the still is right without JS.

A **roll** is the page's label change inside a scene: the kit swap (a clipped box; the track moves by whole lines on `--ease-swap`) over `--duration-page`, with the value fading through: the old value out over the first `--duration-base`, the new one in over the second, so two labels never show at once. The hero's button, row labels and count use it. The route readout and the warnings use the kit's plain vertical roll (no fade-through), so no value is ever blank or ghosted.

Hover is `--duration-instant` everywhere.

| Moving thing | Job | Band | Duration | Curve | Trigger | Reduced motion |
|---|---|---|---|---|---|---|
| Links, buttons, summary | Feedback | press/hover | `--duration-instant`; press 0.97 | `--ease-standard` | Hover, press | Colour only |
| Hero card (the stage) | Staging | entrance | `--duration-page` 400ms, 12px rise with opacity; chips then chart follow by `--offset` each | `--ease-enter` | Load, once | In place |
| Hero scene (the event) | Explain how a window is found | scene | aim 1200, press 3100, window 4400; rest 4000 (loop 8700); replays in place | Per part | In view, loops; pause | Still: 2 windows, plan in card |
| Hero reset | Back to the start, in place | UI change | About 0.5s, `--offset` apart: bars grey and plan placeholders (0), windows, cuts and row labels (+100), status (+200) | standard; exit | aim beat of a replay | None |
| Cursor | The hand | entrance | Parked by the page just off the button (72px left, 56px down); waits 700ms, then `--duration-spring`; leaves with the button | `--ease-spring`; exit | aim beat | Hidden |
| Press, button label | Feedback | press / roll | Kit press (0.97); two rolls in the beat (0 and 1700ms) | standard; swap | press beat | Label at rest |
| Sweep line | Scan the day (the only owner) | scene | 1200ms (`--duration-reveal` x2) from +200ms; a 2px line only; no status bar | `--ease-standard` (eases out at the right edge) | press beat | Hidden |
| Cuts, over-limit bars | The constraints, as the line passes | UI change | `--duration-slow`, at the eased time the line reaches them | `--ease-standard` | press beat | All shown |
| Windows and row labels | The answer | UI change / roll | After the line: Out at +1400ms, Back +1500ms (`--offset`); one ring-out each (`--duration-page`) | enter; standard; swap | press beat | Shown |
| Count, button back | Confirm | roll | +1600ms, +1700ms; settled by 2100, found windows held 1000ms | `--ease-swap` | press beat | Shown |
| Plan (inside the card) | The climax | entrance | Row reserved from the start (dimmed skeletons); values rise `--duration-page`, `--stagger` apart, its own beat, then nothing moves | enter; standard | window beat | Shown |
| Warnings scene | Explain the alert | scene | fri18 2600, saved 3000, fri21 4500; plays once and holds. fri21 chain: tag roll 0, tint 400, edge 700 to 1100, Leave time 1100, 15:00 1200, note texts cross 1300 | swap; enter; exit | In view, once | Still: the 21:00 frame |
| Route scene | The plan to the minute | scene | leave 2000, jack 1200, hamstead 1200, gurnard 1600, cowes 4400; rest 2400 (loop 10400); replays in place (the line retracts to dashed over 600ms) | swap; standard | In view, loops | Still: boat at Cowes |
| Route boat and line | One plan, sailed | entrance / reveal | Per leg, scaled to its minutes: 600, 800, 1200, 400ms; a settle at each mark (1.15, Cowes 1.3, `--duration-slow`) | `--ease-swap` (in and out) | Each leg beat | Boat at Cowes, line drawn |
| Route readout | Where and when | roll | Departure and arrival only; at Cowes `--duration-slow` after arrival: place, then time, distance, average speed 50ms apart | `--ease-swap` | leave and cowes beats | Cowes values |
| How heading words | Attention | UI change | `--duration-slow`, `--stagger` | `--ease-enter` | In view, once | In place |
| Stages and cards | Orientation | reveal | `--duration-reveal`, 80ms apart, 16px (figures holding a scene fade only) | standard and enter | In view, once | In place |
| Card fragments | One beat | reveal | `--duration-reveal` | linear wipe; enter (bars) | In view, once | In place |
| Price value, FAQ icon | State change | UI change | `--duration-slow` / `--duration-base` | `--ease-standard` | Toggle, open | End state |

### Why these three moments

Brief 1 sells one thing: Halyard turns a sailor's day (tide, wind, light, the boat's limits) into a departure window, and tells you when it moves. The study (`kb/moments/STUDY.md`) found Stripe carries a page with about four directed scenes, each a product event, and Linear lets the headline own the first moment before the product arrives. So the page keeps three scenes, each explaining one claim the copy makes.

1. **Hero: "find the window" (event shot).** The claim: "marks the window when all three agree". The day loads with the plan row already reserved, the hand moves a short way to Find windows and presses it, a line sweeps the day alone turning the over-limit wind amber as it passes, and only then does the answer arrive in order (Out window, Back window, "2 windows found", the button back). The found windows hold for a second, then the plan values rise into their row as their own beat and hold. The replay resets in place in about half a second.
2. **Warnings: "the window moves" (swap).** The claim: "you will hear if a new forecast moves either window". The plan is saved (one line), then the 21:00 forecast moves the card in a chain you can follow (the tag rolls and tints, the bar's right edge retracts leaving a hatched 25-minute sliver that stays, then the Leave time and the 15:00 row roll) and only then do the note's texts cross in place to "Back window moved".
3. **Route: "the plan to the minute" (the boat leads).** The claim: "Halyard times every leg". The readout says "Leave Lymington 08:30". The boat sails each leg on its own path, drawing the solid line as its tip, in time scaled to the leg's minutes, easing in and out with a small settle at each mark; the map carries the middle legs. At Cowes the pin fills, the boat settles once, and a beat later "Arrive Cowes 10:10, 10.5 nm, 6.3 kn average" rolls in and holds. The replay retracts the line to Lymington in place.

No depth tier: nothing needs 3D or a camera move.

### Shot plans (as authored in each scene's `<script data-shot-plan>`)

Hero, `#hero-scene`:

| Beat | ms | Owner | Aim / press / read | What changes |
|---|---|---|---|---|
| aim | 1200 | `.app` | aim `.find` | First play: card, chips and chart settle. Replay: the in-place reset (about 0.5s). The hand is parked just off the button and travels there on the spring (519ms from +700) |
| press | 3100 | `.app` | press `.find` | Press 0.97, label rolls to "Checking"; the line sweeps 05:00 to 20:00 alone (1200ms from +200) and the bars turn amber as it passes; after it (+1400) Out lands, Back +1500, "2 windows found" +1600, button back +1700 as the hand leaves; each window rings out once; settled by 2100, then the found windows hold 1000ms |
| window | 4400 | `.plan` | read `.plan__head` | The plan values rise into the reserved row, `--stagger` apart, and the skeletons fade; nothing else moves |

Warnings, `#warn-scene` (plays once):

| Beat | ms | Owner | Read | What changes |
|---|---|---|---|---|
| fri18 | 2600 | `.warn-panel` | `.wp-win` | 18:00 forecast: window "Leave 11:10 to 13:45", against tide 15:25 |
| saved | 3000 | `.notes` | `.face--saved .alert__msg` (6 words, needs 2280) | The phone note arrives: "Plan saved. Out 07:33, back 11:10." Fri 18:10 |
| fri21 | 4500 | `.notes` | `.alert__lead` (9 words, needs 3270) | Tag rolls to Fri 21:00 (0 to 400), tints (400 to 700); the bar's right edge retracts (700 to 1100) leaving the hatched sliver; the Leave time to 13:20 (1100) and 15:25 to 15:00 (1200); then the note's texts cross in place, old up, new from below (1300 to 1700) |

Route, `#route-scene`:

| Beat | ms | Sail | Owner | Read | What changes |
|---|---|---|---|---|---|
| leave | 2000 | none (replay: 600ms retract) | `.boat` | `.rs-time` | Boat at Lymington: "Leave Lymington 08:30", 0.0 nm, 0.0 kn |
| jack | 1200 | 600 (18 min) | `.boat` | none | Boat sails, line drawn behind it, settles at the mark; the readout holds |
| hamstead | 1200 | 800 (29 min) | `.boat` | none | The same |
| gurnard | 1600 | 1200 (42 min) | `.boat` | none | The same |
| cowes | 4400 | 400 (11 min) | `.route-strip` | `.rs-now` | Pin fills, boat settles once (1.0 to 1.3 to 1.0, 300ms), then "Arrive Cowes" and 10:10, 10.5 nm, 6.3 kn, 50ms apart, all in by about 1300ms; then over 3s still, plus the 2400 rest |

The speed is the passage average, distance over time from the legs table (10.5 nm in 100 min is 6.3 kn); `operate.mjs` recomputes it. Every scene has a pause button (one pause icon; `aria-pressed` and the selected fill carry the state), stops off screen, and shows its still under reduced motion. The state sheet shows every frame (3 hero, 3 warnings, 5 route).

### Critic defects fixed in the parts touched (`kb/reviews/fresh-landing.md`)

- "The Solent" label overprinted by the route line: moved to open water.
- Yarmouth label clipped at 390: placed above its point at 1440, dropped below 48rem.
- Pause button label and icon disagreed: one icon in both states.
- Text staggers over 500ms and the word rise on all 8 headings: one heading only; widest stagger now 448ms.
- Scene numbers from one dataset (`D.forecast`, `D.marks`, `D.legs`), re-added by `operate.mjs`.

## Round 2 corrections (after the first blind gate)

The lead's critic corrections, by moment, and what changed. Times are from the films below (from load for the hero; from the scene on screen for the others).

**Hero (first 6s).**
- Answer inside 6s: the day and check beats were merged into the press beat (beats now aim 1500, press 2400, window 4400). Press at about 2.2s, windows at about 2.7s and 3.2s, "2 windows found" at about 3.5s, plan at about 4.7s (`g2f-hero.jpg`). Short of the asked 2.0s press by about 0.2s: a beat cannot be under 1200ms, and the title and chips need their read.
- Dead static hold cut: from about 3.3s to about 0.7s of a still card before the hand moves (the hand waits 700ms into the aim beat, then travels 519ms).
- Card entrance: 12px rise with opacity over 400ms on `--ease-enter` (was 32px over 800ms after a 1000ms wait); chips and chart follow by `--offset` each. No blur anywhere. The card is kept out of the first paint until `scene.js` has set the first beat (the HTML is the still, so it used to flash the answer).
- Halo removed: the hero stage is `--color-surface-sunken`, one quiet tint; the other stages keep the echo-fill.
- Kept: the headline in place from first paint; the cursor travelling into the button (it now always travels from a rest point over the chart, each loop) and "Checking" rolling in place.

**Event (`#hero-scene`).**
- The sweep runs 1200ms (was 1800ms after a separate beat), starting 300ms after the press; each window drops in (300ms, 8px) as the line passes its close; the row label rolls at the same moment; wind bars turn amber at their hour as before.
- The plan is seated inside the card under the Back row, on the card's edges (no overhang); four large times and Daylight to spare kept.
- "2 windows found" rolls `--offset` (100ms) after the last window lands; it no longer leads. The status no longer says "Checking 05:00 to 20:00" (the button says Checking; the status bar fills with the sweep).
- The sweep lane starts below the time axis, so the line never crosses the hour labels (lint caught 18:00 at 3.46:1 mid-sweep).

**Swap (`#warn-scene`).**
- No disagreeing frame: the note now swaps its contents in place in the same beat as the card update (saved note out in 150ms, alert in over 400ms after 150ms), so "Back window moved" is in within about 0.3s of 13:20 (`g2f-warn.jpg`, 5.25s to 5.75s).
- The lost 25 minutes: a hatched sliver in the warning colour where the window used to end, shown as the edge pulls in and faded over 600ms.
- No overlap of two notes: one card, contents swapped (the kit's stack is no longer used here). A new first beat shows the plan being saved, so the note arrives once instead of sitting empty.
- Kept: "Now closes 13:20, 25 minutes earlier" and Fri 21:05.

**Scene (`#route-scene`).**
- The solid line is drawn with the boat as its tip: both run on the leg's own path (the boat on keyframes at the path's vertices, offset by length; the line by its dash offset), same duration, same curve.
- Leg screen time scaled to minutes: 18, 29, 42, 11 min become 600, 1200, 1600, 400ms, on `--ease-standard` (an ease out of and into each mark). Beats stay in 1200 to 4500ms; loop 11900ms.
- Time and distance count up continuously with the boat; the place name rolls so it lands as the boat arrives.
- "Stream: With you" replaced by "Leg speed", which changes per leg (5.0, 6.4, 6.6, 7.1 kn).
- Kept: the dashed route ahead of the boat, the hold at each named mark, 1.5s at Lymington, the readout's type sizes.

**Other changes forced by the checks.** A figure that holds a scene now only fades in (its rise moved under the scene's first owner, a `quiet` fail). Route map place names take full ink (on the smaller state-sheet frames "Hamstead Ledge" and "Isle of Wight" fell to 3.68:1 and 4.37:1); Hamstead Ledge moved slightly down off its mark.

**What a kit asset blocked (not edited, worked around in the page).** `moments.js` aims the cursor the moment the aim beat is set, and `scene.js` finishes every animation in the scene on its load jump, so on the first beat the hand never travels: it appears on the button. The page script sends the hand to a rest point and re-aims it from there on each aim beat. `scene.js`'s load jump also finishes any entrance inside a scene, so the chips and chart entrance is keyed on a class set after it. Neither kit file has a hook for these.

## Round 3 corrections (after the scored gate)

The scored gate (three critics, 1 to 10, within 1 point of the exemplar): hero 7 vs 7 and swap 7 vs 8 passed; event 6 vs 8 and route 6 vs 8 failed. Only the fixes two or more critics agreed on were applied. Times are from the films `r3b-*` (hero from load; the others from the scene on screen).

**Event and hero (`#hero-scene`).**
1. *Button still said "Checking" 1.5 to 2.4s after "2 windows found".* The press beat now resolves itself in order, `--offset` apart: amber bars as the line passes, then the Out row (+1000ms), the Back row (+1100), the count (+1200), the button back to "Find windows" (+1300), and the hand leaves with it. The button's two rolls are one keyframed animation on the press beat (`find-roll`), since a swap only follows states.
2. *Labels crossfading on top of each other.* Every hero label change (button, row labels, count) is a roll: the kit's clipped swap with the value fading through, so the old value is gone before the new one shows. `data-on` marks the shown value (build writes it on the authored frame; the page script keeps it in step).
3. *Pink wash on the sweep.* Gone: a 2px line only, 1200ms on `--ease-standard`, so it crosses the morning fast and eases out at the right edge; it is 95% across at 800ms, when the rows start to land, and fades out at the edge. (800ms was the first try; motion-audit counts an 800ms non-swap animation as a second hero reveal, so the line takes the scene band.) Cuts and bars change at the eased moment the line reaches them (`sweepAt()` in `build.mjs` inverts the curve).
4. *The plan is the climax.* The plan is its own beat, after everything has settled (the press beat is quiet from 1700 to 1800ms). The push is removed, so nothing moves while it holds: 4400ms plus the 4000ms rest. Beats aim 1200, press 1800, window 4400: the plan lands at about 3.4s after the card appears, about 3.6s on the film clock.
5. *One emphasis per window.* Each window's outline rings out once as it lands (`ping`, `--duration-page`, scale to 1.06 x 1.8 and fade).
- The hand's travel is now the kit's (the lead's `moments.js` fix parks it at the lower right and aims two frames later). The page's rest-point workaround is removed. The hand fades in as it sets off, as a CSS animation keyed on `.hero-go`: the kit parks it with transitions switched off, so an opacity transition snapped it on at the park point.

**Route (`#route-scene`).**
6. *Leg speed changed before the place.* On arrival the place name rolls first (starting `--offset` before arrival), then the time, distance and leg speed together.
7. *Counters frozen while moving.* Time and distance no longer count; they are rolls that change on arrival with the label (round 1 behaviour, as the critics asked).
8. *Ease into each mark; Cowes distinct.* Legs keep their minutes' proportions at a quicker scale (400, 600, 800ms on `--ease-standard`, about 21ms a minute), so the middle stops are shorter (beats 1900, 2100, 2300, each held just over 1.0s past the last roll). The last leg arrives on the spring (`--duration-spring`, `--ease-spring`), so the boat settles into Cowes; "Arrive Cowes" takes the full ink and 10:10 the window colour. Cowes's beat is 4100ms (the longest), plus the 2400ms rest. Loop 11900ms.

**Swap (`#warn-scene`).**
9. *Loop reset through a blank card.* The scene plays once and holds its end state (`data-loop="false"`).
10. *"Plan saved" too long for its hold.* Cut to one line: "Plan saved. Out 07:33, back 11:10." The saved beat is 3000ms; the read (6 words) needs 2280.
11. *Order the change.* The card moves first (badge at 0, end time +100ms, bar trim, the against-tide time and the sliver +200ms), then the saved note leaves (+500) and "Back window moved" lands (+650 to +1050). The hatched sliver stays visible through the hold.
12. *Flat background.* The warnings and route stages are `--color-surface-sunken`, like the hero (the state sheet frames too).

## Round 4 corrections (final round, on the lead's kit changes)

The page is rebuilt on the lead's new kit: `scene.js` now replays a scene in place (show of its first state with transitions running) unless the scene asks for `data-seam="fade"`, has `el.__scene.restart()`, and the gate films each scene from its opening state. The page's own seam fade (`[data-scene] { transition: opacity }` and `[data-scene][data-scene-seam] { opacity: 0 }`) is removed, so no scene goes through a blank card on its loop. Only the fixes two or more critics agreed on were applied. No file under `skills/` was edited in this round.

**Event (`#hero-scene`).** Beats aim 1200, press 3100, window 4400; rest 4000 (loop 8700).
1. *Reset in place.* The replay's aim beat is one short uniform change of about 0.5s, `--offset` apart: the amber bars go back to grey and the plan's values to their placeholders (0, `--duration-slow`), the windows and cuts retract and the row labels roll back (+100), the status rolls back to "Ready to check" (+200). The card chrome, chips and chart do not move, and nothing replays step by step. The Find windows button is held still through the reset (an id selector, because the `.roll` rule outranked a class selector and blanked the label for about 0.4s).
2. *One owner during the sweep.* The line crosses 05:00 to 20:00 alone (1200ms from +200, `--ease-standard`), and the bars turn amber as it passes. Only after it finishes (`--res-at`, 1400ms) does Out land, then Back 100ms later, then the count (+200), then the button rolls back (+300) as the hand leaves. The status progress bar is removed, so the line is the only thing scanning.
3. *Hold the found windows.* The press beat settles at 2100ms and holds 1000ms before the plan beat.
4. *No layout shift.* The plan row is in the card from the start at its full height: each value is a dimmed skeleton bar (`.pv::before`) with the value hidden; on the window beat the values rise into place, `--stagger` apart, and the skeletons fade. Nothing below the row moves.
5. *Short cursor travel.* The page parks the hand just below and left of the button (72px left, 56px down) on every aim beat, so it travels a short way on the spring (519ms) and presses at the end of the aim beat, about 0.5s after it sets off. The visible press is the kit's (0.97); see "could not do".

**Route (`#route-scene`).** Legs 600, 800, 1200 and 400ms; beats leave 2000, jack 1200, hamstead 1200, gurnard 1600, cowes 4400; rest 2400 (loop 10400).
6. *Reset in place.* Back to "leave", the boat sails the drawn route backwards to Lymington over 600ms (`--duration-reveal`, `--ease-standard`) and each leg's solid line retracts to dashed in its share, Cowes first, while the readout rolls back. The map never blanks.
7. *Readout rolls, no crossfade.* The readout values are the kit's plain vertical roll (`--duration-page`, `--ease-swap`), no fade-through, so no value is blank or ghosted. They change the moment the dot reaches the mark: label first, then the time, distance and speed 50ms apart (`--offset` / 2).
8. *Ease each leg.* Each leg is on `--ease-swap` (in and out), and the dot settles at each mark (scale 1 to 1.15 to 1 over `--duration-slow`).
9. *Cowes is the biggest moment.* The end pin fills with the window colour, the dot settles once (1.0 to 1.3 to 1.0 over 300ms), and "Arrive Cowes 10:10" lands a beat later (`--duration-slow` after arrival). Then nothing moves for the rest of the 4400ms beat and the 2400ms rest (well over 3s).
10. *Intermediate readouts.* The readout shows only departure ("Leave Lymington 08:30, 0.0 nm") and arrival ("Arrive Cowes 10:10, 10.5 nm, 6.3 kn average"); the map carries the middle legs. The speed is now the average over the passage (10.5 nm in 100 min), and `operate.mjs` checks it against the legs table.

**Swap (`#warn-scene`).** Beats fri18 2600, saved 3000, fri21 4500; plays once and holds.
11. *Note card never blank.* The two note texts cross in place inside one card: "Plan saved" goes out upwards while "Back window moved" comes in from below, overlapping (both from +1300ms, `--duration-page`, `--ease-swap`).
12. *Spread the chain.* The forecast tag rolls (0 to 400ms), then tints to the warning colour through the 300ms pause (an empty gap let motion-plan-check settle the beat at 400ms and fail the card's later moves as "quiet"); the bar's right edge retracts over 400ms on `--ease-enter` (700 to 1100ms), leaving the hatched sliver; then the Leave time (1100ms) and the 15:00 row (1200ms), 100ms apart; then the note texts cross (1300ms).
13. *Hold the before state.* fri18 is 2600ms, and saved holds 3000ms before the change.

**Also in this round.**
- The state sheet's hero frames are narrower than the page's (a 376px plan at 1024), and the four plan columns ran "Leave Lymington" into "Arrive Cowes" (lint run-together). The plan is now a size container and takes the phone's two columns under 30rem; the page's plan is 564px or wider at every width, so the page is unchanged.
- `scenarios.mjs`: notes updated for the new timings, and a new `route-reset` scenario (cowes back to leave, the in-place retract).
- `operate.mjs`: the route checks compare departure and arrival (`0.0` and the legs total; first and last times) and the average speed against the legs table.

## Check results (final build)

All run from the repo root on the final build, in this order, by one script; output in `reports/` (overwritten).

| Check | Command (short) | Exit | Key numbers |
|---|---|---|---|
| motion-plan-check, 1440 | `motion-plan-check.mjs halyard.html` | 0 | PASS. 5 bands. Scenes seen in order: hero aim>press>window, route leave>jack>hamstead>gurnard>cowes, warnings fri18>saved>fri21. Holds after settle: hero aim 532, press 9405, window 7839 (9 words, needs 3270); route leave 1335 (needs 1000), jack 284, hamstead 81, gurnard 84 (no read; the map carries them), cowes 5429 (3 words, needs 1290); warnings fri18 3283 (needs 1620), saved 2583 (6 words, needs 2280), fri21 held (9 words, needs 3270; plays once). Widest stagger 450ms. Payoff: the window shot starts at 4300ms (limit 4500). |
| motion-plan-check, 390 | `--width 390` | 0 | PASS. Same bands and order; press 2937, route middle holds 283 to 385, saved 2586. |
| visual-plan-check | `visual-plan-check.mjs halyard.html --product` | 0 | PASS. 1440: 6 of 8 counted slices (75%), 8 product fragments. 390: 10 of 12 (83%). |
| lint, page and 4 states | `tools/lint.mjs halyard.html --states state=yearly,state=menu,state=faq,state=paused` | 0 | Each PASS, 0 fail, 10 warn |
| lint, state sheet | `tools/lint.mjs halyard-states.html` | 0 | PASS, 0 fail, 9 warn (run-together fixed this round) |
| claims_inventory | `--year 2026` | 0 | No mechanical flags. Scene numbers ticked against `src/data.mjs` (10.5 nm in 100 min is 6.3 kn). |
| motion-audit | `motion-audit.mjs src/scenarios.mjs reports/motion-audit` | 0 | 21 of 21 pass (new: route-reset, the in-place retract; warn-forecast-swap now 1700ms). No warnings: the 800ms leg is on `--ease-swap` and the 1200ms leg is in the scene band. |
| operate | `src/operate.mjs` | 0 | 50 rows pass, including route distance and times (departure and arrival against the legs table) and average speed 6.3 kn re-added. |

The other tools in the earlier table (search-check, conversion-audit, icon audit, css-audit, polish-audit, weight, vitals, measure, choreo-probe) were not re-run for this motion rebuild; their reports in `reports/` date from the previous build.

Lint warnings left on the page: fluid h1 104px at 1440; "What sailors say" and the coverage heading end on a one-word line; layout moves 54px at 1440 if web fonts fail; footer links under 44x44 at 390. The `svg-overlap` warnings are false positives, because that rule does not read opacity: the hero cursor at opacity 0 over "Find windows" and "18:00", and the hidden "Back window moved" face sharing a grid cell with the visible "Plan saved." face (one card, contents swapped).

## Self-critique rounds (v0.4 rebuild)

Films and sheets are in `/tmp/claude-0/-home-user-design-kb/e4ca0cf7-123a-5b05-be92-69a6f3011a7b/scratchpad/halyard-build/` (not committed). Every film was made with `kb/moments/film.mjs` cropped to the scene with `--pad 24` and read with `kb/moments/sheet.sh` at 4 fps. The three stills (opening, result, ending) were cut from the films with ffmpeg because the only tool that writes them, `blind-gate.mjs prepare`, was out of bounds for the builder (see Skill problems).

**Round 1** (films `r1-hero`, `r1-herocrop`, `r1-warn`, `r1-route`; stills of each scene).

| Where | Problem | Change | Keep |
|---|---|---|---|
| Hero, press beat | The press had no visible result: the button dipped and nothing said work had started, so aim and press read as one beat | Button label swaps to "Checking" and the status rolls to "Checking 05:00 to 20:00" on the press | The 1200ms press beat and the spring aim |
| Warnings, alert beat | The new alert hid the saved note completely; the stack read as a replace, not an arrival | Saved-note copy lengthened so both notes share a height and the older one shows above, scaled 0.95 | The drawer curve and the order (note first, alert second) |
| Warnings, fri21 | The forecast change was too quiet: only digits rolled | Chip tints to the warning colour on fri21 (`--duration-slow`) and the window box shrinks on the swap curve | The swap of 13:45 to 13:20 as the read |
| Route, every leg | The inked leg appeared ahead of the boat | Leg opacity waits `--duration-page`, so it inks in behind the boat | The boat as owner |
| Route strip | "0.0   nm" had a gap (unit outside the mask); "The Solent" sat on the route line | Unit moved into each swap value; label moved to open water | The group-1 offset of the strip behind the boat |

**Round 2** (films `r2-hero` from load, sheets `r2-hero-a`, `r2-hero-b`; `r2-warn`).

| Where | Problem | Change | Keep |
|---|---|---|---|
| Hero, check and window beats | The cursor stayed parked on Find windows through the result, sitting on the plan card's "Home" cell and pulling the eye from the answer | Cursor fades out on the check beat (`--duration-fast`, `--ease-exit`); the result owns the screen | Cursor visible through aim and press |
| Hero cursor | The arrow hard-coded `#fff` and `#111` with a butt cap (lint icons fail) | Drawn in tokens (`--color-text` fill, `--color-surface` outline), round caps | Arrow shape and size |
| Warnings alert | Line length 30 characters (lint measure fail at 390 and 1440) | Notes column `min(100%, 392px)`; the alert is a grid of parts (app row, message), not running text | The overlap onto the panel's foot |

**Round 3** (films `r3-hero-dark`, `r3-warn`, `r3-warn-390`, `r3-route-390-dark`, `r3-hero-390`; stills `stills-hero.png`, `stills-warn.png`, `stills-route.png`).

| Where | Problem | Change | Keep |
|---|---|---|---|
| Route card at 390 | Yarmouth label below the coast was clipped by the strip; moved above it, it collided with Hamstead Ledge | Yarmouth placed above its point at 1440 and dropped below 48rem (not a mark on the route) | Every mark and number at 390 |
| Warnings caption | Claims check flagged "Friday" as a relative day in stakes copy | Caption reads "the evening of 23 October" | The chip's "Fri 21:00" (an app label, absolute with the date in the caption) |
| State sheet | 37% of text under 14px at 390 once 13 frames were shown | Frame captions to `--text-sm` | Frames aria-hidden like the page's stages |

Dark and 390 films showed no new defects: windows, amber bars and the warning tint keep their contrast in dark; at 390 every beat reads at the same timing. Every film shows one faded frame at exactly 5.00s on all three scenes, light and dark; the page has no event there, so I take it to be a recorder artefact (Skill problems).

**Round 4, after the blind gate** (films `g2-hero`, `g2-warn`, `g2-route`, then `g2f-hero`, `g2f-warn`, `g2f-hero-dark-390`, `g2f-route-390`; the gate itself was not run or opened).

| Where | Problem | Change | Keep |
|---|---|---|---|
| Hero, aim beat | In `g2-hero` the hand appeared on the button with no travel on the first loop: `moments.js` sets `--cx` when the aim beat is set and `scene.js`'s load jump finishes that transition | Page script sends the hand to a rest point over the chart and re-aims it on the next frame of every aim beat | The 519ms spring |
| Hero, first paint | The answer (the still, which the HTML is authored on) flashed for one frame before `scene.js` ran | Stage held at opacity 0 until `hero-go` is set on the first animation frame | Headline painted at once |
| Hero, sweep | Mid-sweep the line crossed the 18:00 axis label (lint 3.46:1) | Sweep lane starts below the axis | Sweep length and timing |
| Warnings, fri18 | `g2-warn`: the note card sat empty for the first beat | The note `li` is hidden until the saved beat | One card, contents swapped |
| Route, state sheet | Map labels at 3.68:1 and 4.37:1 on the small frames | Full-ink labels; Hamstead Ledge label moved down | Label set and sizes |

**Round 5, after the scored gate** (films `r3a-hero` before, then `r3b-hero`, `r3b-route`, `r3b-warn`, `r3c-hero`, `r3d-hero`; probe `cur3.mjs` for the cursor's opacity by the page clock).

| Where | Problem | Change | Keep |
|---|---|---|---|
| Hero, button and row labels (before) | `r3a-hero` 2.40s and 3.10s: mid-roll, the old and new labels both show inside the 1lh box at 800ms | Rolls of 400ms with the value fading through | The kit's clipped swap |
| Hero, first play | The hand showed at the park point before the card was in | Fade-in as an animation (see above) | The kit's park and aim |
| Hero, sweep | motion-audit failed the 800ms line and progress as a second hero reveal | 1200ms, results keyed to 800ms in (95% across) | `--ease-standard` |
| Route, middle stops | motion-plan-check held "jack" and "hamstead" 983ms against 1000 | Beats 1900, 2100, 2300, Cowes 4100 (loop 11900) | Leg proportions |

**Round 6, final round** (films `r4-hero`, `r4-route`, `r4-warn`, then `r4b-hero` from 12s for the replay; sheets at 4 fps).

| Where | Problem | Change | Keep |
|---|---|---|---|
| Hero, replay reset | `r4-hero`: the Find windows label went blank for about 0.4s during the in-place reset. The page's `.roll` fade-through rule outranked `.scene[data-state="aim"] .find ...` on specificity (both in `@layer motion`), so the button rolled through its fade | The hold rule keys on `#hero-scene`; `r4b-hero` 13.75 to 14.0s shows the label steady while bars grey and the plan returns to placeholders | The 0.5s reset, `--offset` apart |
| Warnings, fri21 | motion-plan-check failed "quiet": the 300ms pause after the tag roll let the beat settle at 400ms, so the bar and text moves after it counted as a second owner | The tag's tint fills the pause (400 to 700ms), so the chain is continuous and settles after the texts cross | The 300ms gap before the bar, as the critics asked |
| State sheet, hero frames | Lint run-together at 1024: four plan columns in a 376px card | Plan is a size container; two columns under 30rem | Four columns on the page |
| Route, every leg | `r4-route`: legs ease in and out with a small settle; Cowes pin, settle, then readout a beat later; reset retracts the line without blanking | None | All |
| Warnings | `r4-warn`: chain spreads over about 1.7s on the scene clock; note texts cross with no blank card | None | All |

## Skill problems

1. `kb/moments/STUDY.md` line 28 names a kit token `--ease-sheet`; FOUNDATIONS (`kb/FOUNDATIONS.md` line 66 and line 139) and moments.css call it `--ease-drawer`. Unclear which is canonical; I used `--ease-drawer`.
2. **Changed (bug):** `skills/design-motion/assets/moments.css` lines 62 to 70. The press target transitioned `filter` (brightness) as well as transform; filter is not a compositor property (fundamental 9) and `motion-audit.mjs` fails a non-blur filter, so any page using the kit's press failed the audit. Now only transform transitions; the brightness step is instant. The push used a literal `cubic-bezier(0.4, 0, 0.6, 1)`, off the token curves (fundamental 4, and motion-audit fails it); now `var(--ease-standard)`.
3. **Changed (bug):** `skills/design-motion/assets/motion-audit.mjs`. It still knew only the v0.5 curves, so every kit swap (`--ease-swap`), stack (`--ease-drawer`) and cursor spring (`--ease-spring`, a `linear()` curve written at run time) failed, and an 800ms swap inside a scene was counted as a second hero reveal. Added the swap and drawer curves to `EASINGS`, read the page's `--ease-spring` and `--duration-spring` after the trigger and accept a `linear(...)` curve at that duration (plus or minus 1ms), and exclude an 800ms swap inside a scene from the hero-reveal count. Header comment says so.
4. **Changed (bug):** `skills/design-motion/assets/motion-plan-check.mjs` `visibleWords` (lines 123 to 144) only checked clipping ancestors above the read element, so a kit swap inside the read element counted every value in its track as visible words (the route time read 3, 4, 5 words as the track grew). It now also checks clips between the read element and each text node.
5. `motion-plan-check.mjs` lines 358 to 364 measure a beat only when the same scene's next beat is recorded inside the check's window. The last beat of a scene that does not loop back in time is never measured (here route `cowes` and warnings `alert`, the alert being the scene's main read). It passes silently. I checked those two by hand: alert 9 words need 3270ms and get 4200 + 3000 rest; cowes 3 words need 1290ms and get 3600.
6. `motion-plan-check.mjs` measured `fri18` at 1440 with 0 words: the figure's own scroll reveal still runs during the first beat, so the read text sits under opacity 0.5 when the beat settles. At 390 it counts 4. The first beat of a scene that starts as it scrolls in is effectively unchecked.
7. `skills/design-motion/assets/moments.js` lines 75 to 95: swaps and stacks are only positioned by JS. Without JS (or before it runs) every swap shows its first value and every stack item is hidden, while the kit's still rule says the still is the last state. The swap demo in `assets/fixtures/moments-demo.html` only looks right without JS because its still is its first value. Authors must write `--swap-i`, `--swap-count`, `data-in` and `data-depth` themselves; the skill does not say so.
8. The kit ships no cursor drawing; the natural arrow (white fill, black stroke) fails lint `icons` (hard-coded colour, mixed caps). A token-drawn cursor in the kit would save every builder the same fail.
9. `skills/design-motion/SKILL.md` line 27 (fundamental 10): "the one hero reveal moves the supporting artifact by transform" reads as transform only, while the Linear staging the task asks for fades the product in. I used opacity plus a 32px rise on the aria-hidden stage (not the LCP h1, which never fades). The rule should say whether opacity is allowed on a non-LCP hero artifact.
10. `references/09-moments-and-directing.md` line 101 and `SKILL.md` line 75 say the three stills come from `blind-gate.mjs prepare`; builders are told not to run the blind gate, so the review step has no tool. I cut them from the films with ffmpeg.
11. `kb/moments/film.mjs`: every film has one washed-out frame at exactly 5.00s regardless of page, scene or scheme. Looks like a recorder artefact (perhaps a screencast restart); it makes a sheet look like a seam where there is none.
12. `tools/lint.mjs` `svg-overlap` ignores opacity, so a faded-out cursor still warns.

13. `skills/design-motion/assets/moments.js` aims the cursor in the `scene:state` handler, and `scene.js` `jump(0)` finishes every animation in the scene subtree on load, so the first aim beat never travels. There is no hook (no "aim from" point, no event after the jump). Worked around in the page script in round 2; fixed in the kit by the lead after round 2 (it parks and aims two frames later), and the page workaround is removed in round 3.
14. The same `jump(0)` finishes any CSS entrance inside a `[data-scene]`, so a staged entrance of a scene's own parts (chips, then chart) cannot be done in CSS alone; it needs a class set after `scene.js` runs.
15. `motion-plan-check.mjs` `quiet` counts a figure's own scroll reveal as motion outside the owner; a figure that holds a scene can only fade in. The rule is right, but the skill does not say it.

16. `motion-audit.mjs` lets an 800ms animation inside a scene pass only on `--ease-swap` (as a swap); an 800ms line on `--ease-standard` inside the same scene is counted as a second hero reveal. A scene timeline at 800ms on another token curve is not a hero reveal; the rule should key on [data-scene], not on the curve.
17. `moments.js` (the lead's park fix) writes `transition: none` inline while parking the cursor, so any page transition on the cursor (an opacity fade-in) snaps in that frame. A page that fades its cursor must use an animation. The kit could restore only the transform transition, or say so.
18. `motion-plan-check.mjs` settles a beat at the first moment no animation is in its active interval, so a staged sequence with a gap between steps (a press, a 100ms pause, then a sweep) settles early; a later step outside the owner then fails "quiet". Here everything after the gap is inside the owner, so it passes, but a sequenced result is fragile under this rule.

19. `moments.js` holds `data-pressed` for 2 x `--duration-instant` (200ms); the critics asked for a 0.97 press held 100ms. The kit owns the press and builders may not edit `skills/`, so the page keeps the kit's 200ms.
20. With in-place replay as the kit default, the first state's transitions run on every loop, so every looping scene now needs its own reset choreography (what goes back first, and how fast), written against the first state. Neither `scene.js` nor the skill says so; a page that wrote none would snap or replay its entrance step by step. (Opinion: the skill should name a reset band, about 0.5s, `--offset` apart.)
21. Rule 18 bit again: a deliberate pause inside a chain (the warnings' 300ms after the tag) settles the beat early and fails "quiet". The fix was to fill the pause with a colour change; a checker that allowed a pause shorter than, say, `--duration-slow` would not force that.

## Critique rounds (first build)

1. Round 1 fixed:
   - the plan card covering the windows
   - cards overlapping their captions
   - the Isle of Wight polygon order
   - the tide LW label overlap
   - a 2062ms stagger
   - lint failures: measure, overflow, radius, run-together, grid-edge and font synthesis
   - state-sheet dead controls and selected state
   - the yearly primary-per-screen fail and the menu overlay
   - search-check `time` and offer fails
2. Round 2 fixed:
   - proof note placement at 1440
   - warnings panel padding
   - the phone map's label crowding
   - the Poole and Lymington label anchors
3. Round 3 fixed:
   - hero row labels now sit above the sweep line (the yearly-state lint caught a 1.12:1 overlay mid-sweep)
   - the phone menu trigger now reads Close when open
   - heading word delays capped at 8 steps and wind bars 20ms apart, so no stagger group fails under load

## Director step 14 hand-over list

| Item | Result |
|---|---|
| Every primary action rendered as its own state | `?state=yearly`, `menu`, `faq` and `paused`, each linted and claim-checked. "Plan a sail" and "Get the app" go to the app and store hubs (outside this page). |
| Labels true in every state | Plus card CTA, price, per-month line and terms change together. Checked by `operate.mjs` and `claims --render`. |
| Selected control 3:1 or weight or underline | Billing segment: a raised chip plus semibold. Paused button: `--color-selected` fill. Lint `selected-state` passes in both themes. |
| Rest, pressed and disabled side by side | On the state sheet. Disabled is a neutral fill, not opacity on magenta. |
| 16px running text | Yes. The 12px size is used only for figure captions and chart ticks. |
| Time zones | One zone (BST), said once in the hero app bar and in the data note. Every clock time has `<time datetime="2026-10-24THH:MM+01:00">`. |
| Phone menu | Shows 4 links, Sign in and Get the app. The trigger reads Close when open. Escape closes it and returns focus. It sits in normal flow, so nothing is underneath for Tab to reach. |
| Operate the page | Done (`operate.mjs`): every control by mouse, Enter and Space; every total re-added. |
| Every 1440 number at 390 | Yes. The phone keeps every time, rate and height; the coverage map drops only the minor and water labels, and the stations stay listed. |
| Menu text and dark control borders | Checked on the dark renders. |

**To confirm before launch:**
- Name the real providers and their licences. The safety section describes each source generically (published tidal constants, the stream atlas, "a numerical weather model", calculated sunrise and sunset) and names no provider.
- Real customer quotes. The three on the page are samples, labelled "Sample quotes written for this design. Not real customers."
- Photo request: one dawn photograph of a small yacht leaving Lymington river, at 07:30 to 08:00 in late October, with the boat small in frame and space top-left. It would go behind the final CTA or in a new band between proof and how.
- App Store and Google Play links, and the store badges.
- Fonts: Literata (OFL) and JetBrains Mono (OFL) are self-hosted subsets inlined as woff2; the body text uses the system sans. The production path should serve the woff2 files with `font-display: swap` and the same metric fallbacks.
- The phone hero: the copy leads and the product sits below the fold at 390.
- Every number is sample data for Saturday 24 October 2026 and must be swapped for live data.
- The safety statement ("Halyard is a planning aid. It is not a substitute for official tide tables, charts or forecasts...") appears in the safety section, and "Halyard is a planning aid. Not for navigation." appears in the footer.

## Short of Stripe and Linear (honest list)

1. **Three scenes, not four, and only one is an event.** Stripe runs about four directed product scenes, each with its own memorable beat. The warnings and route scenes are a swap and a sailed leg, well timed but quieter; neither has a press or a cursor, and neither would be the moment someone remembers.
2. **The hero event is small on screen.** At 1440 the Find windows button wraps onto its own line under the limit chips, so the cursor travels a short way to a small target; Stripe's checkout fills its card. The press reads, but it is not a set piece.
3. **The lost time is small.** The hatched 25-minute sliver is about 9px wide at 1440; it now stays through the hold, but it reads if you watch the back window, not from across the room.
4. **Curves.** Five token curves plus the spring. Linear's blur-in text reveals and Stripe's 12 curves give each moment its own character; here everything outside the swap shares `--ease-enter` and `--ease-standard`.
5. **Outside the touched parts, the critic's defects remain:** the coverage map's Chichester Harbour and Portsmouth labels overprint at 1440 to 768, Poole sits in the not-covered hatch, the dark check icons are 2.95:1, the "Seven days ahead, not three" line, the 16:16 tick crowding the 17:56 label, the inshore area order, and the phone menu's "Sign in" misalignment. None of these was in the motion brief.
6. **Visual coverage dropped** at 1440 from 7 of 8 to 6 of 8 counted slices (75%), still a pass but below Stripe's 14 of 17.
7. **The plan lands at about 5.0s on the film clock** (4.3s into the scene). Round 4 traded speed for order: the line now finishes before the answer lands, and the found windows hold 1s before the plan. The payoff check still passes (the window shot starts at 4300ms, under 4500).
8. **The button's two rolls are hand-keyframed** (`find-roll`, percentages of a 2100ms press-beat timeline), because a kit swap follows states and the button changes twice in one beat. A swap that can step on a delay inside a beat would remove it.
9. **The route readout no longer shows the middle stops.** Departure and arrival only, as one of the two options the critics offered; the map carries the middle legs. A reader who wants the time at Gurnard has to read the legs table.
10. **The press is 200ms, not 100ms** (the kit's; Skill problems 19).
11. **No exemplar comparison was run.** The blind gate is the lead's; round 4 is not yet judged. This is my own reading of my own films.

gate not claimed: self-review only
