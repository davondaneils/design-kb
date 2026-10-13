# Halyard home page: build notes

Brief 1, `kb/tests/fresh/briefs.md`. Built by following `skills/design-director/SKILL.md` end to end. Built by one subagent, with 3 self-critique rounds.

**gate not claimed: self-review only**

## Files

| Path | What |
|---|---|
| `halyard.html` | The page. Self-contained (fonts, icons, scene.js, favicon inlined). Light and dark. Designed at 1440 and 390, checked at 768 and 1024. |
| `halyard-states.html` | The state sheet: buttons (rest, hover, focus, pressed, disabled, busy), nav links, billing toggle, Plus card monthly and yearly, FAQ closed, hover and open, menu closed and open, pause playing, paused and focus, and the 5 scene frames. |
| `src/` | `data.mjs` (the one dataset), `page.html`, `states.html`, `og.html` (templates), `build.mjs` (generates both pages), `assets.mjs` (favicon, `logo-512.png`, `og.png`), `scenarios.mjs` (motion-audit), `operate.mjs` (operates every control and re-adds totals), `assets/` (subset fonts, wordmark, scene.js). |
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

## Motion plan

Hover is `--duration-instant` everywhere. The entrance band is unused on purpose: nothing enters on load except the scene, so the hero reads at once.

| Moving thing | Job | Band | Duration | Curve | Trigger | Reduced motion |
|---|---|---|---|---|---|---|
| Links, buttons, summary | Feedback | press/hover | `--duration-instant` 100ms; press scales to 0.97 | `--ease-standard` | Hover, press | Colour only, kept |
| Hero scene | Explain | scene | Beats 1600, 2000, 2400, 2000, 3600; rest 4000 | Per part | In view, loops; pause button | Still frame "window"; pause button hidden |
| Time sweep and progress | Scan the day | scene | The beat minus `--duration-reveal` | Linear (time axis) | Each beat | Hidden / full |
| Cuts appear | State change | UI change | `--duration-slow`, delayed by their time | `--ease-standard` | As the sweep passes | All shown |
| Windows draw in | The answer | reveal | `--duration-reveal`, 80ms apart | `--ease-enter` | Beat "window" | Shown |
| Status label, plan card | State change | UI change / reveal | `--duration-slow` / `--duration-reveal` | Standard / enter | Each beat | Final label, card shown |
| Section h2 words | Attention | UI change | `--duration-slow`, `--stagger` 40ms (20ms above 7 words, capped at 8 steps) | `--ease-enter` | In view, once | In place |
| Stages and cards | Orientation | reveal | `--duration-reveal`, 80ms apart, 16px travel | Standard and enter | In view, once | In place |
| Card fragments | One beat | reveal | `--duration-reveal` | Linear (time-axis wipe); enter (bars 20ms apart) | In view, once | In place |
| Price value, FAQ icon | State change | UI change | `--duration-slow` / `--duration-base` | `--ease-standard` | Toggle, open | End state, no movement |

## Check results (final build)

All checks were run from the repo root on the final build. Output is in `reports/`.

| Check | Command (short) | Exit | Key numbers |
|---|---|---|---|
| visual-plan-check | `visual-plan-check.mjs halyard.html --product` | 0 | 1440: visual on 7 of 8 counted slices (88%), pricing excused, 8 product fragments (probe heuristic 14). 390: 9 of 11 (82%), 4 type beats of 15 slices, 8 fragments (probe 17). Treatment: echo-fill. |
| motion-plan-check, 1440 | `motion-plan-check.mjs halyard.html` | 0 | 4 bands: press/hover 100/150, UI change 200/300, reveal 600/1000, scene 1400/1800. Scene beats seen in order: day, tide, wind, light, window. 3 text-stagger warnings (624 to 699ms, where two headings chain into one burst). |
| motion-plan-check, 390 | `--width 390` | 0 | Same 4 bands and scene order. 1 stagger warning (611ms). |
| lint, page | `tools/lint.mjs halyard.html --states ...` | 0 | PASS, 0 fail, 8 warn |
| lint, `?state=yearly`, `menu`, `faq`, `paused` | same run | 0 | Each: PASS, 0 fail, 8 warn |
| lint, state sheet | `tools/lint.mjs halyard-states.html` | 0 | PASS, 0 fail, 3 warn |
| claims_inventory | `--year 2026`, and with `--render` | 0 / 0 | No PROMISE or PERIOD warnings. Every listed claim was ticked against `src/data.mjs`. |
| search-check | `--base https://halyard.example/` | 0 | 0 fail, 1 warn ("dates": 9 relative days such as "on Saturday" sit outside `<time>`; every clock time carries a datetime). JSON-LD: WebSite, Organization, SoftwareApplication, 2 Offers. |
| conversion-audit | | 0 | No fails |
| icon audit | `icon_audit.mjs --selector "svg.icon"` | 0 | PASS |
| css-audit | | 0 | PASS: 414 rules, 213 token declarations; 5 motion-unguarded warnings (colour and opacity transitions) |
| polish-audit | | 0 | PASS, 1 shadow warning |
| weight | `--lcp "#hero-title"` | 0 | 226 KB raw, 103 KB gzip, 95 KB brotli; fonts 68 KB gzip |
| vitals (mobile, 3 runs) | | 0 | LCP 1104ms (the h1), CLS 0.000, TBT 121ms, 1 request |
| motion-audit | 12 scenarios in `src/scenarios.mjs` | 0 | 12 of 12 pass: scene tide beat, scene window beat, pause click, primary hover, billing by click and keyboard, FAQ by click and Enter, menu at 390, reveals of how, route and warnings at 390. All on the motion tokens, reduced motion included. |
| operate | `src/operate.mjs` | 0 | 38 rows pass: pause, Yearly, Monthly, FAQ 1 to 5 and the 390 menu, each by mouse, Enter and Space, with a visible focus ring on keyboard; Escape closes the menu and returns focus. 10 totals re-added from the screen: legs 10.5 nm, 1 h 40 min out, 1 h 40 min in the plan card both ways, 3 h 46 min to spare, latest leave 16:16, £3.25 a month, £20.88 saving, 25 minutes moved, 14 stations. |
| measure.mjs | `measure.mjs halyard.html reports/measure.json` | 0 | Measured at 1440 and 390 |
| choreo-probe, 1440 | | 0 | 245 animations, 0 loops, ladder 100/300/600/1000/1400/1800, 3 curves, 14 mocks, 0 photos, visual on 8 of 9 screens |
| choreo-probe, 390 | `--width 390` | 0 | 123 animations, 3 curves, 17 mocks, 0 photos, visual on 12 of 15 screens |

For comparison (`kb/teardowns/motion-imagery.md`): Stripe shows visuals on 14 of 17 screens with 12 fragments, and Linear on 10 of 12 with 5.

Lint warnings left on the page:
- The fluid display size is 104px at 1440.
- "What sailors say" and the coverage heading end on a one-word line.
- Layout moves 54px at 1440 if the web fonts fail (the fallbacks have metrics; one heading near a wrap point still moves).
- The "Yarmouth" label on the route card is partly covered by the coast at 390.
- The footer links are under 44x44 at 390.

## Critique rounds

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

## Three biggest gaps against the exemplars

1. **No photography or brand imagery.** Everything is UI, chart or map, with 0 photos (choreo-probe). Apple and Things sell a feeling as well as a function. Halyard's page is precise but cool, and nothing shows the sea, the boat or the light it is about.
2. **The fragments lack depth and variety.** Every fragment is the same white card on the same echo-fill, at one elevation. Stripe varies scale, crop, layering and density from section to section; this page repeats one move ten times. At 390 the hero is text-first, with the product below the fold, and the 1440 visual coverage is 7 of 8 slices, one of them only 14%.
3. **The content is stand-in and the motion is not quite tight.** The quotes are samples and the data sources are placeholders, so the proof band proves nothing yet. Text staggers still spread 611 to 699ms where two headings chain (warnings; the limit is 500ms for text). Two headings also end on a one-word line, and the "Yarmouth" label is partly covered at 390. Linear would not ship those.
