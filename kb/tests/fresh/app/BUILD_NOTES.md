# Halyard plan screen: build notes

Brief 2 of `kb/tests/fresh/briefs.md`. Built by following `skills/design-director/SKILL.md` end to end.
**Gate not claimed: self-review only.** No fresh-context critic has seen these pages (director step 15). The judged rows below are the builder's own reading.

## Deliverables

| Path | What it is |
|---|---|
| `plan.html` | The screen. Self-contained (CSS, JS, the Inter subset, the wordmark and the icons are all inline). Light and dark. Laid out for 390 and 1440, checked at 768 and 1024. |
| `plan.html?state=empty` / `error` / `loading` / `nowindow` / `saved` | The states. `saved` is the post-action state for Save plan. |
| `plan-states.html` | State sheet (`data-lint-page="state-sheet"`): buttons at rest, hover, focus, pressed, busy and disabled; fields at rest, focus, invalid and disabled; handle at rest, hover, focus and dragging; nav, meters, verdicts, warning rows, notices, failed and loading rows, toast. |
| `src/` | Sources. `build.mjs` builds both pages. Also `model.js` (pure model), `plan.js`, `plan.css`, `icons.mjs`, `plan.src.html`, `plan-states.src.html`, `scenarios.mjs` (motion-audit), `operate.mjs` (operates every control and checks every number) and `run-checks.sh` (reruns every check into `reports/`). |
| `shots/` | 56 renders: 6 states plus the sheet, at 390, 768, 1024 and 1440, light and dark. |
| `reports/` | The output of every tool. `motion/` holds the frame strips. |

## Read log (in order)
1. `CLAUDE.md`, then `kb/tests/fresh/briefs.md` (Brief 2 and the scoring).
2. `skills/design-director/SKILL.md`.
3. `skills/design-foundations/SKILL.md`, plus its references: tokens, fundamentals checklist and accessibility. Then `kb/FOUNDATIONS.md` v0.5.
4. `skills/design-playbook-dashboard/SKILL.md` and `references/signature-moves.md`. Then `skills/design-playbook-mobile/SKILL.md` for the phone layout: platform conventions, and a skim of the exemplars.
5. References, in playbook order:
   - design-ux: SKILL, 01, 02, 03 (part), 04.
   - design-product-ui: SKILL, 01, 02 (part), 04, 05, 06.
   - design-layout: SKILL, 01 (widths), 04, 05, 06.
   - design-typography: SKILL, 04, 05, 06.
   - design-color: SKILL, ui-tokens-themes.
   - dataviz skill: SKILL, marks-and-anatomy, interaction, anti-patterns, palette, choosing-a-form.
   - design-art-direction: SKILL, 04 (recipes 1 to 3 and the moves).
   - design-graphic: 02 icon systems, plus the wordmark.py and tab_contrast.py headers.
   - design-copy: SKILL, 02, 06.
   - design-motion: SKILL, 07, 08, the headers of motion-audit, motion-plan-check and scene.js, and motion-tokens.css.
   - design-conversion 05, design-search 07 (app rules), design-frontend SKILL, design-polish SKILL and 06.
6. Teardowns: `kb/teardowns/linear-app.md`, `stripe-dashboard.md`, `things-home.md`, `INDEX.md`, and `motion-imagery.md` (sections 2 and 4).
7. Tool headers: `tools/lint.mjs`, `tools/lint-truth.mjs`, `tools/render.mjs`.
8. `kb/tests/design-motion/scenarios.mjs`, for the scenario format only. That test's pages were not opened.

Nothing under `kb/tests/benchmark/round1`, `round2`, `kb/reviews/benchmark-*` or any earlier test's pages was opened. Neither was `kb/tests/fresh/landing/`.

## What the screen is
- **Answer first.** The page opens with a verdict line ("Inside Wren's limits, 2 cautions") and one computed sentence: when to leave each harbour, whether the stream is with you, the gusts and the margin to sunset.
- **Facts strip.** Four figures: Leave Lymington, Leave Yarmouth, Home, Passage. Each departure states its window and carries −10 min and +10 min steppers. That is the non-drag path (WCAG 2.5.7).
- **Timeline (the hero).** Small multiples on one time axis:
  - Tide height at Lymington, with HW and LW labelled.
  - Stream at the Needles Channel, E-going above zero.
  - Wind: mean, gust, and Wren's 20 kn limit dashed, with hatched warning spans and numbered badges.
  - The plan lane: safe windows, the two legs, two draggable `role=slider` handles, and the bracket for the margin to sunset.
  - Night is shaded in every row. Each leg's time is carried up through every row as one faint band, so tide, stream and wind read against the passage.
  - A crosshair readout (mouse) gives every series at that time, and says whether leaving either harbour then would be inside the limits.
  - "Show hourly values" is the table view.
  - Below about 560px the plot crops to 06:00 to 20:00 and says so. The table keeps all 24 hours.
- **Warnings as rows.** Numbered 1 to 3 to match the badges on the timeline. Each row has a fixed heading, a body and a live "effect" line: Clear of your plan, Affects your return, or Outside Wren's limit. Hovering a row outlines its span on the timeline.
- **Route.** A schematic map with timed waypoints, plus a waypoint table (out and back times). It is captioned "not to scale and not for navigation".
- **Side column.** Lymington HW and LW, sunrise and sunset, Wren's limits, and a link to edit them.
- **Safety footer.** "Halyard is a planning aid, not a navigation source", sample data, and the official sources to check (UKHO, Admiralty chart, Met Office inshore waters forecast).
- **Phone.** Topbar with brand and a Menu/Close toggle. A sticky save bar ("Out 11:50 · Back 16:44 / Home 17:31, 2 cautions" plus Save plan).
- **Every number is derived from `src/model.js` after every change.** The facts, notes, answer, verdict, warnings, lane labels, waypoint table, save bar, slider aria values and live region all come from it. `operate.mjs` checks them against the model in node.

### Fixed facts and how the sample model stages them
- Saturday 24 October 2026. The weekday was checked in node. 25 October is avoided because the clocks change that night.
- Sunrise 07:33 and sunset 17:56 BST. 4.5 nm each way. Wren is a 7.9 m sloop: 20 kn true wind, 12 kn wind against tide, arrive by sunset, planning speed 5.0 kn.
- The forecast is "issued Fri 23 Oct, 18:00 BST (sample)". 23 October 2026 is a Friday.
- **Default plan.** Out 11:50, a 44 min leg, arriving 12:34. Back 16:44, a 47 min leg, home 17:31.
- **Windows.** The out window is 10:05 to 12:35. The back window is 16:15 to 17:10. Displayed windows are rounded inward to 5 min, and spans outward.
- **Warnings.**
  1. Wind against tide 13:20 to 15:25, up to 15 kn. Clear of the plan, because you are ashore at Yarmouth.
  2. Gusts above 20 kn 16:00 to 19:00, to 23 kn, mean 15 to 18 kn. Affects the return.
  3. Home 25 min before sunset. Affects the return. Halyard flags any margin under 30 min (product rule, opinion).
  - Summary line: "3 warnings, 2 affect your plan".
- **nowindow.** A storm forecast: mean over 20 kn from 05:40 to 20:20, up to 27 kn, gusting 34 kn. "Choose another day" is the primary action.
- **Known simplification (sample model).** Speed over ground is 5.0 kn plus half the Needles Channel stream, signed so that the west-going stream helps the out leg. A real Lymington to Yarmouth crossing runs SSE, mostly across the stream. The sign was chosen to stage the brief's three warnings, and it should not be read as pilotage. The page labels all of this as sample.

## Motion plan

| Band | Duration (token) | What moves | Trigger | Why |
|---|---|---|---|---|
| Press/hover | 100 ms (`--duration-instant`), 150 ms (`--duration-fast`) | Button and nav fills, press scale 0.97, readout fade-in, warning-span outline on row hover | Pointer | Feedback only |
| UI change | 200 ms (`--duration-base`), `--ease-standard` | Leg, handle, leg band, lane label and sunset bracket slide (transform). A changed warning's status fades in. Toast rises 16px (`--ease-enter`). Hourly plus rotates to a cross | **Stepper press only** | Explains *where* the window moved: the passage visibly slides against tide and wind |
| UI change | 300 ms (`--duration-slow`) | Departure, Leave Yarmouth and Home times roll in their slots. A changed warning row flashes once (opacity). Phone menu drops 8px | Stepper press; menu | The changed numbers are the ones that roll |
| Reveal | 600 ms (`--duration-reveal`) | Route draws Lymington to Yarmouth (two-transform wipe) | Map 40% on screen, once | One reveal on the page |
| Never | | Drag (1:1, no transition); arrow, Shift, Page and Home/End keys (instant, so key repeat never queues); first paint; numbers on arrival | | Frequent and keyboard actions stay instant |

- **Reduced motion** keeps every end state. What remains is colour and opacity at 150 ms or less, and a static spinner.
- **No scene.** This is an app screen and the work is the hero, so `scene.js` is not used. motion-plan-check ran with `--no-scene`.
- Save waits for the `--duration-reveal` token (600 ms) as simulated latency, read from CSS.

## Check results (final run, `src/run-checks.sh`)

| Check | Exit | Key numbers |
|---|---|---|
| `tools/lint.mjs plan.html --states empty,error,loading,nowindow,saved` | 0 | Every state passes. Default 0 fail / 14 warn, empty 0/12, error 0/5, loading 0/1, nowindow 0/7, saved 0/12. The warnings are 44px touch advisories (skip link, handle 24x32 with a larger hit area, details summary, Edit link), svg-overlap notes on the "Gust 23 kn" label, and the sticky save bar over the plot. |
| `tools/lint.mjs plan-states.html` | 0 | 0 fail, 29 warn (the sheet's 40px buttons at 390, and font-fallback shift) |
| `claims_inventory.mjs --year 2026` (static, `--render` for all 6 URLs, sheet) | 0 (all 8) | "No mechanical flags". Every claim was ticked against `model.js` and `operate.mjs`. |
| `search-check.mjs --expect private` | 0 | 0 fail, 0 warn. Robots noindex, nofollow, 0 JSON-LD, no og tags, head order ok. |
| `icon_audit.mjs` (page, sheet) | 0 | PASS. One cap, one join. Volume flags on the 12px grip only. |
| `polish-audit.mjs` (page, sheet) | 0 | 0 fail / 0 warn on the page. 2 warn on the sheet (shadow, svg hairline). |
| `css-audit.mjs` | 0 | PASS. 320 rules, 255 token declarations. Warns on 100vh and on unguarded hover colour transitions. |
| `vitals.mjs` | 0 | LCP 832 ms, CLS 0.000, TBT 227 ms, 58.6 KB on the wire |
| `weight.mjs` | 0 | 155.7 KB raw, 58.6 KB gzip, font 27.7 KB gzip |
| `motion-audit.mjs src/scenarios.mjs` | 0 | 11 scenarios pass. Stepper (3 scenarios) motion, 200/300 ms. **Arrow-key repeat: 0 animations. Shift/Page keys: 0. Drag: 0.** Warning hover 150 ms. Save toast 200 ms. Phone menu 300 ms. Route reveal 600 ms. Hourly toggle 200 ms. |
| `motion-plan-check.mjs plan.html --no-scene` | 0 | 1440 and 390: ladder 100/200/600, 3 bands (press/hover, UI change, reveal), no stagger, 2 masked entrances, reduced motion ok |
| `kb/teardowns/measure.mjs plan.html reports/measure.json` | 0 | Measured at 1440 and 390 (h1 Inter Halyard 20px/25 w600 at 390). See `reports/measure.json`. |
| `src/operate.mjs` | 0 | 123 checks, 0 failed: mouse, Enter, Space, arrows, Shift, PageUp/Down, Home/End, mouse drag, touch tap, touch drag at 390, save, edit-after-save, retry, menu, hover, crosshair |
| `tab_contrast.py` | 1 by design | The favicon is a two-tone mark on its own field. The navy field is 7.5 to 9.8:1 on light tab strips. The white mark is 16 to 16.7:1 on dark strips. Each colour alone fails on the other theme's strips, which is what the tool's own advice ("use a two-tone mark on its own field") covers. |

### Operated by hand-equivalent (`operate.mjs`)
- **Default:** 11:50 / 16:44 / home 17:31, 25 min before sunset, 3 warnings with 2 affecting the plan.
- **Leave Yarmouth +20 by mouse:** back 17:04, home after sunset, and warning 3 turns to "Outside Wren's limit".
- **Enter and Space on the out stepper:** out −20.
- **Arrow keys:** ArrowLeft ×6 moves back to 16:34. Shift+Right gives 17:04. PageDown gives 16:04: the stream is against you, so the verdict is "Outside Wren's limits" and the save notice lists "return outside its window".
- **Home and End:** Home clamps to out arrival plus 30 min. End gives 19:00, home 1 h 48 min after sunset.
- **Out End:** clamps so that back is at or after out arrival plus 30 min.
- **Mouse drag to 16:00:** 0 animations.
- **Save:** busy for 600 ms, then "Plan saved". The URL becomes `?state=saved`, the meter goes to 2 of 3 and the toast shows. Any edit afterwards returns to "Save plan" and clears `?state=`.
- **Retry:** `?state=error` goes to `?state=loading` (aria-busy) and then to the default.
- **Phone, touch:** Menu tap opens (Close) and tap closes. Tap +10 gives 12:00. A touch drag to 17:00 gives home 17:46, 10 min before sunset. The save bar works.
- After every action, these all agree with the model: home time, slider aria values, leg minutes, both ends of the waypoint table, the lane label, the save bar, the home note, the answer sentence and the warning count.

## Director step 14 hand-over list
- **Primary action rendered as its own state:** done (`?state=saved`), linted and claim-checked. The saved notice restates every warning still open.
- **Labels true in every state:**
  - "Leave Lymington" and "Home" are computed.
  - The error state says "tide window" and "Wind not checked".
  - The empty state shows no plan numbers; the conditions are marked `data-sample`.
  - The nowindow state shows no departure times.
- **Selected nav:** weight 600 against 400 (+200), plus a 2px inset bar and a fill. Lint `selected-state` passes in both themes.
- **Rest, pressed and disabled side by side** on the sheet. Disabled is a neutral fill, never opacity on the brand fill. Busy keeps the brand fill and shows a spinner.
- **Reading size:** body 14px (app). 12px is used only for axis, legend, labels and meta. Lint `reading-size` passes at 390.
- **One time zone (BST)**, stated in the panel head, the tide table header and the forecast line.
- **Tables:** the hourly table scrolls inside a 360px region with a sticky header. Waypoint and tide tables are short.
- **Commit:** Save plan sits in the header (48rem and up) or the sticky save bar (phone), and is reachable on the long page. There is no money on this screen.
- **Phone menu:** the 5 nav links, boat and usage, trigger reads Close when open. The primary action stays in the sticky save bar under it, rather than inside the panel. The panel is inline (it pushes content), not a drawer, so nothing sits under it.
- **Facts strip:** 2x2 at 390 and 768, 4 across from a 52rem work area (1024 and 1440).
- **Operated, not only rendered:** see above. Lint `dead-control` passes.
- **Phone facts:** every number at 1440 is at 390. The timeline crops to 06:00 to 20:00 with a note, and the hourly table and waypoint table carry the rest. Lint `phone-facts` passes.
- **Control borders on dark:** the secondary button border is `--color-neutral-500` on `#171a1c`, 5.1:1.

### Phone edit list (what changed for 390)
- The sidebar becomes a topbar with brand and Menu.
- Save moves to the sticky save bar with an out/back/home summary.
- Facts go 2x2. Steppers and the menu button get 44px targets.
- Timeline row labels sit above the plots. The plot crops to 06:00 to 20:00 and the axis steps to 3 h.
- The out leg label drops "to 12:34" when it would collide with the back label.
- The route and side column stack.

## Fonts
Self-hosted Inter (Fontsource 5.3.0, OFL, no Reserved Font Name), subset to latin and wght 400 to 620, inlined as base64 (27.7 KB gzip). The fallback face is metric-matched (Arial, Liberation Sans or Helvetica at size-adjust 107.59%).

The subset has tabular figures but no U+202F or U+2192. The page uses a no-break space and draws arrows in SVG.

**Production:** serve the WOFF2 as an external, hashed, immutable file with `<link rel="preload" as="font" crossorigin>` rather than inlining it.

## Self-critique rounds (3, then stop)
1. **Round 1:**
   - The page first rendered blank because the build used `String.replaceAll` with replacement strings, so the `$$` in the script became `$`. The build now uses function replacers, which also fixed the font not loading.
   - Fact rows had collapsed into a stack (`dd { display: contents }`).
   - The phone tables overflowed.
   - Wind badges collided with the gust label.
   - Fixed the 17 lint fails:
     - stepper accessible names
     - text over art on the lane labels and the north arrow
     - the off-scale 136px label column, now 128
     - icon caps
     - axis labels running together
     - grid edges on the facts
     - the handle focus ring
     - undefined `--x`
     - a sample-state truth fail
2. **Round 2:**
   - Replaced four hairline guides per row with one faint band per leg through every row; it reads at a glance.
   - Lightened the hatch.
   - Hid the crosshair over the handles, which also removed the one animation the drag path had.
   - Kept a busy primary filled.
   - Moved the facts to 2x2 at 768.
   - Moved chart geometry to lane tokens (css-audit raw-space).
   - The saved notice now lists legs outside their window.
3. **Round 3:** a final full run of every check (table above) and every render read again at 390, 768, 1024 and 1440 in both themes. Stopped here.

## Three biggest gaps against the exemplars
1. **Density and typographic finish versus Linear app.**
   - Linear runs 13px rows at weights 510 and 590 with −0.01em tracking, 28px nav items and 40px list rows. This screen uses 14px at 400, 500 and 600, 40px nav items and a 24px-padded work area, so it is calmer but looser.
   - At 768 and 1024 Save plan wraps under the title rather than holding the title row.
   - The 128px timeline label column wraps "Needles Channel, knots" to two lines.
2. **Interaction depth versus Linear and Things.**
   - There is no command menu or shortcut layer beyond the slider keys.
   - There is no undo for Save, and no in-page day switcher ("Choose another day" is a link).
   - There is no tap-to-inspect crosshair on touch. Phone users get the hourly table instead.
   - The stepper motion is correct and restrained, but it lacks Things' tactile delight (spring on completion, the satisfying settle).
3. **Craft of the supporting visuals versus Stripe Dashboard.**
   - The route is a token-coloured schematic with blob coastlines and plain waypoint dots.
   - It has no chart-quality detail (buoy symbols, depth tint, the Hurst narrows) and no relation to the timeline beyond the times.
   - The sample stream model treats the crossing as along-stream, which a sailor would question even with the sample label.
   - Stripe's supporting charts and illustrations carry the same precision as its tables; here the timeline does and the map does not.
