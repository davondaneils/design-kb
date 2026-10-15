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

## Motion plan (v0.4 rebuild, after round 2)

Rebuilt to design-motion v0.4 and FOUNDATIONS v0.6 (Motion, shot plans), then corrected after the first blind gate (round 2, below). The visual design is unchanged except where round 2 asked: the hero stage is one quiet tint, and the plan sits inside the hero card. Every scene is built on the moment kit: `skills/design-motion/assets/moments.css` (inlined in `@layer moments`), `scene.js` and `moments.js` (inlined as scripts in that order), read at build time by `src/build.mjs` (`kit()`), so the page stays one self-contained file. `src/assets/scene.js` (the old copy) is deleted. A short page script adds what the kit does not do: the hero's follow-on entrance and the cursor's rest point, and the route boat on its path with the counting readout. Each scene's HTML is authored on its still frame (reduced motion and no JS show it). Swaps carry an inline `--swap-i` and `--swap-count`, so the still is right without JS.

Hover is `--duration-instant` everywhere. Ladder measured at 1440 and 390: press/hover 100/150, UI change 200/300, entrance 400/519, reveal 600/800, scene 1200/1400/1600/4400 (5 bands).

| Moving thing | Job | Band | Duration | Curve | Trigger | Reduced motion |
|---|---|---|---|---|---|---|
| Links, buttons, summary | Feedback | press/hover | `--duration-instant`; press 0.97 | `--ease-standard` | Hover, press | Colour only |
| Hero card (the stage) | Staging | entrance | `--duration-page` 400ms, 12px rise with opacity; chips then chart follow by `--offset` each | `--ease-enter` | Load, once | In place |
| Hero scene (the event) | Explain how a window is found | scene | aim 1500, press 2400, window 4400; rest 4000 (loop 8300) | Per part | In view, loops; pause | Still: 2 windows, plan in card |
| Cursor | The hand | entrance | Waits 700ms (title and chips read), then `--duration-spring` 519ms | `--ease-spring` | aim beat | Hidden |
| Press, label | Feedback | press / swap | `--duration-instant`; `--duration-swap` | standard; swap | press beat | Label at rest |
| Sweep, status bar | Scan the day | scene | 1200ms, starting `--duration-slow` after the press | linear (time axis) | press beat | Hidden / full |
| Cuts, over-limit bars, windows, row labels | The answer, as the line passes | UI change / swap | `--duration-slow` each, delayed to the moment the line passes (cuts at their start, bars at their hour, windows and labels at the window's close) | standard; enter; swap | press beat | All shown |
| Status "2 windows found" | Confirms | swap | `--duration-swap`, `--offset` after the last window lands | `--ease-swap` | press beat | Shown |
| Plan (inside the card), push 1.00 to 1.03 | The result | entrance / scene | `--duration-page`; the push over the beat | enter; standard | window beat | Shown, no push |
| Warnings scene | Explain the alert | scene | fri18 2400, saved 2400, fri21 4500; rest 3000 (loop 9300) | swap; enter; exit | In view, loops | Still: the 21:00 frame |
| Route scene | The plan to the minute | scene | leave 1500, jack 2200, hamstead 2800, gurnard 3200, cowes 2200; rest 2400 (loop 11900) | standard; swap | In view, loops | Still: boat at Cowes |
| Route boat and line | One plan, sailed | scene / reveal | Per leg, scaled to its minutes: 600, 1200, 1600, 400ms | `--ease-standard` (eases out of and into each mark) | Each leg beat | Boat at Cowes, line drawn |
| How heading words | Attention | UI change | `--duration-slow`, `--stagger` | `--ease-enter` | In view, once | In place |
| Stages and cards | Orientation | reveal | `--duration-reveal`, 80ms apart, 16px (figures holding a scene fade only) | standard and enter | In view, once | In place |
| Card fragments | One beat | reveal | `--duration-reveal` | linear wipe; enter (bars) | In view, once | In place |
| Price value, FAQ icon | State change | UI change | `--duration-slow` / `--duration-base` | `--ease-standard` | Toggle, open | End state |

### Why these three moments

Brief 1 sells one thing: Halyard turns a sailor's day (tide, wind, light, the boat's limits) into a departure window, and tells you when it moves. The study (`kb/moments/STUDY.md`) found Stripe carries a page with about four directed scenes, each a product event, and Linear lets the headline own the first moment before the product arrives. So the page keeps three scenes, each explaining one claim the copy makes.

1. **Hero: "find the window" (event shot).** The claim: "marks the window when all three agree". The day loads, the hand goes to Find windows and presses it, a sweep crosses the day and each window drops into its row the moment the line passes its close, and the plan rises inside the card. Timed for a 6s first look: card in by about 0.5s, press at about 2.2s, both windows by about 3.3s, "2 windows found" just after, plan at about 4.7s.
2. **Warnings: "the window moves" (swap).** The claim: "you will hear if a new forecast moves either window". The plan is saved (the note arrives), then the 21:00 forecast rolls the chip, the window (13:45 to 13:20) and the against-tide time (15:25 to 15:00) in place; the lost 25 minutes show as a hatched sliver that fades; and the note swaps its contents in place to "Back window moved" at the same moment, so the card and the phone never disagree.
3. **Route: "the plan to the minute" (the boat leads).** The claim: "Halyard times every leg". The boat sails each leg on the leg's own path, drawing the solid line as its tip, in time scaled to the leg's minutes; the clock and the distance count up with it, the place name lands on arrival, and the leg speed changes per leg.

No depth tier: nothing needs 3D or a camera move beyond the 1.03 push.

### Shot plans (as authored in each scene's `<script data-shot-plan>`)

Hero, `#hero-scene`:

| Beat | ms | Owner | Aim / press / read | What changes |
|---|---|---|---|---|
| aim | 1500 | `.app` | aim `.find` | Card, chips and chart settle; after 700ms the hand travels from its rest point to Find windows (519ms spring) |
| press | 2400 | `.app` | press `.find` | Press 0.97, label rolls to "Checking"; sweep 05:00 to 20:00 in 1200ms; cuts, amber bars, windows and row labels land as the line passes; status rolls to "2 windows found" 100ms after the last window |
| window | 4400 | `.plan` | read `.plan__head`; push `.app` | Hand gone; button back to Find windows; plan rises inside the card under the Back row; push 1.03 |

Warnings, `#warn-scene`:

| Beat | ms | Owner | Read | What changes |
|---|---|---|---|---|
| fri18 | 2400 | `.warn-panel` | `.wp-win` (4 words, held 3293) | 18:00 forecast: window "Leave 11:10 to 13:45", against tide 15:25 |
| saved | 2400 | `.notes` | `.face--saved b` (4 words, needs 1620, held 1987) | The phone note arrives: "Plan saved for Saturday", Fri 18:10 |
| fri21 | 4500 | `.notes` | `.alert__lead` (9 words, needs 3270, held 6735) | Chip rolls to Fri 21:00 and tints; window rolls to 13:20 and the box shrinks; hatched 25-minute sliver shows and fades (1400ms: holds 800, fades 600); 15:25 rolls to 15:00; the saved note leaves (150ms) and "Back window moved / Now closes 13:20, 25 minutes earlier", Fri 21:05, arrives in the same card (400ms, after 150ms) |

Route, `#route-scene`:

| Beat | ms | Sail | Owner | Read | What changes |
|---|---|---|---|---|---|
| leave | 1500 | none | `.boat` | `.rs-time` | Boat at Lymington, 08:30, 0.0 nm, 0.0 kn |
| jack | 2200 | 600 (18 min) | `.boat` | `.rs-time` (held 1183) | Boat sails, line drawn behind it, 08:30 to 08:48 and 0.0 to 1.5 nm count up; "Jack in the Basket" lands on arrival; 5.0 kn |
| hamstead | 2800 | 1200 (29 min) | `.boat` | `.rs-time` (held 1172) | To 09:17, 4.6 nm; 6.4 kn |
| gurnard | 3200 | 1600 (42 min) | `.boat` | `.rs-time` (held 1166) | To 09:59, 9.2 nm; 6.6 kn |
| cowes | 2200 | 400 (11 min) | `.route-strip` | `.rs-now` (3 words, held 3779) | "Arrive Cowes 10:10", 10.5 nm; 7.1 kn |

Leg speed is the leg's distance over its time from the legs table (1.5 nm in 18 min is 5.0 kn); `operate.mjs` re-adds it. Every scene has a pause button (one pause icon; `aria-pressed` and the selected fill carry the state), stops off screen, and shows its still under reduced motion. The state sheet shows every frame (3 hero, 3 warnings, 5 route).

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

## Check results (final build)

All run from the repo root on the final build, in this order, by one script; output in `reports/` (overwritten).

| Check | Command (short) | Exit | Key numbers |
|---|---|---|---|
| motion-plan-check, 1440 | `motion-plan-check.mjs halyard.html` | 0 | PASS. 5 bands. Scenes seen in order: hero aim>press>window, route leave>jack>hamstead>gurnard>cowes, warnings fri18>saved>fri21. Holds after settle: hero aim 836, press 6916, window 7685 (9 words, needs 3270); route leave 1290, jack 1133, hamstead 1178, gurnard 1166 (1 word, needs 1000), cowes 3781 (3 words, needs 1290); warnings fri18 3294 and saved 1985 (4 words, need 1620), fri21 6729 (9 words, needs 3270). Widest stagger 448ms. |
| motion-plan-check, 390 | `--width 390` | 0 | PASS. Same bands and order; holds within about 70ms of 1440 (hero aim 909, route jack 1132), except hero press, measured at 472 (the check settles the press beat at a different point at this width; the beat is not a read beat). |
| visual-plan-check | `visual-plan-check.mjs halyard.html --product` | 0 | PASS. 1440: 6 of 8 counted slices (75%), 8 product fragments. 390: 10 of 12 (83%). Treatment echo-fill. |
| lint, page and 4 states | `tools/lint.mjs halyard.html --states state=yearly,state=menu,state=faq,state=paused` | 0 | Each PASS, 0 fail; 13 warn (page, yearly, paused), 11 (menu, faq) |
| lint, state sheet | `tools/lint.mjs halyard-states.html` | 0 | PASS, 0 fail, 11 warn |
| claims_inventory | `--year 2026` | 0 | No mechanical flags. Every scene number ticked against `src/data.mjs`. |
| motion-audit | `motion-audit.mjs src/scenarios.mjs reports/motion-audit` | 0 | 19 of 19 pass: hero-reveal, hero-aim, hero-press, hero-window, warn-saved, warn-forecast-swap, route-leg, route-leg-long, route-pause-click, pause-click, primary-hover, billing by click and keyboard, FAQ by click and Enter, menu at 390, reveals of how, route and warnings at 390. All on tokens, reduced motion included. |
| operate | `src/operate.mjs` | 0 | 50 rows pass, including the new leg speed = leg distance over leg time (0.0, 5.0, 6.4, 6.6, 7.1 kn re-added) and the route time and distance steps against the legs table. |

The other tools in the earlier table (search-check, conversion-audit, icon audit, css-audit, polish-audit, weight, vitals, measure, choreo-probe) were not re-run for this motion rebuild; their reports in `reports/` date from the previous build.

Lint warnings left on the page: fluid h1 104px at 1440; "What sailors say" and the coverage heading end on a one-word line; layout moves 54px at 1440 if web fonts fail; footer links under 44x44 at 390. The `svg-overlap` warnings are false positives, because that rule does not read opacity: the hero cursor at its rest point sits over "18:00" and "Checking" while it is at opacity 0, and the hidden "Back window moved" face shares a grid cell with the visible "Plan saved for Saturday" face (one card, contents swapped).

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

13. `skills/design-motion/assets/moments.js` aims the cursor in the `scene:state` handler, and `scene.js` `jump(0)` finishes every animation in the scene subtree on load, so the first aim beat never travels. There is no hook (no "aim from" point, no event after the jump). Worked around in the page script, not in the kit.
14. The same `jump(0)` finishes any CSS entrance inside a `[data-scene]`, so a staged entrance of a scene's own parts (chips, then chart) cannot be done in CSS alone; it needs a class set after `scene.js` runs.
15. `motion-plan-check.mjs` `quiet` counts a figure's own scroll reveal as motion outside the owner; a figure that holds a scene can only fade in. The rule is right, but the skill does not say it.

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
3. **The lost time is small.** The hatched 25-minute sliver is about 9px wide at 1440; it reads if you watch the back window, not from across the room. The note swap replaced the kit stack, so there is no second card to see.
4. **Curves.** Five token curves plus the spring. Linear's blur-in text reveals and Stripe's 12 curves give each moment its own character; here everything outside the swap shares `--ease-enter` and `--ease-standard`.
5. **Outside the touched parts, the critic's defects remain:** the coverage map's Chichester Harbour and Portsmouth labels overprint at 1440 to 768, Poole sits in the not-covered hatch, the dark check icons are 2.95:1, the "Seven days ahead, not three" line, the 16:16 tick crowding the 17:56 label, the inshore area order, and the phone menu's "Sign in" misalignment. None of these was in the motion brief.
6. **Visual coverage dropped** at 1440 from 7 of 8 to 6 of 8 counted slices (75%), still a pass but below Stripe's 14 of 17.
7. **Hero press about 0.2s late.** Round 2 asked for the press at about 2.0s; it lands at about 2.2s, because a beat cannot be under 1200ms and the title and chips need their read before the hand moves. Windows are found by about 3.3s and held, inside the asked 4.5s.
8. **Only the hero lost the echo-fill.** The warnings and route stages keep the colour field; round 2 asked only about the hero.
9. **No exemplar comparison was run.** The blind gate is the lead's; round 1 of it failed and round 2 is not yet judged. This is my own reading of my own films.

gate not claimed: self-review only
