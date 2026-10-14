# Field test: PPGPool27 design pass (Oct 2026)

The first real project run through design-kb end to end: director, critic, visual and UX reviews, lint, then a build. The app is PPGPool27 (ppgpool.com), a phone-first companion for a 16-team NHL points pool: one HTML page of vanilla JS, its own token contract, a broadcast look, daily batch data. The build is a draft PR on `davondaneils/ppgpool27` (#2).

This note lists where the skills were wrong, missing or did not apply, so each gap can go back through the pipeline (briefs, research, drafts, reviews, tests). Numbers below were measured on the live page during the pass unless a source is named. Anything marked opinion is opinion.

## What worked
- design-ux 01 (G1 to G12) caught the two biggest interaction fails cleanly: Back leaving the app instead of closing a sheet, and a touch sheet with no reachable close button.
- The fundamentals gate ordering held up. Contrast fails (badge tints at 3.68 to 4.34:1, white on dark red at 3.38:1, faded head-to-head rows at 2.35:1) were found and fixed before any polish work. Lint contrast fails went from 7 to 0.
- The design-ux severity ladder justified holding back cosmetic items in favour of copy that was false (projected gaps shown as current gaps, a pace column that contradicted the player sheet).

## Gaps, ranked by how much they cost on this project

### 1. No rule for once-a-day data going stale (design-ux 04, design-product-ui 06, design-copy 02)
The biggest blind spot. The skills cover "Updated 2 min ago" and a 24 h operational threshold, not a daily pipeline. With the clock frozen three days past the data, the page still said "last night" and "today" with no warning.
- Add: relative day words must be generated from the data's date, and switch to absolute dates plus one page banner once the data is older than one cycle.
- design-copy 02 allows relative dates for "low-stakes recency". Change the rule to "relative is fine when generated from the data date; never typed".

### 2. No cross-surface number reconciliation (design-copy `claims_inventory.mjs`)
The main failure class in a data app is the same entity carrying two numbers on two surfaces (a team at +37 in one card and 36 in another, because two week definitions were in use). The tool groups by claim type, not by entity.
- Add a mode that groups claims by entity name and lists every number each one carries.
- PERIOD should flag differing window definitions ("Week of Oct 4 to Oct 10", "week of Oct 5", "Last 7 days").
- Accept `http(s)` URLs; `--render` loads `file://`, so a fetch-driven app renders empty.
- mm:ss durations (ice time) trigger CLOCK and STYLE. Skip times in a duration context or with no am/pm partner.
- `lang="en"` reads as en-US. Add an en-CA row; FOUNDATIONS already lists locales.

### 3. Host token vocabulary (design-foundations, lint)
The skills require FOUNDATIONS token names; this app has its own contract (`--band-y`, `--cp`, `--t-body`, `--muted`, `--me`). There is no "map to the host project's tokens first" step, and the lint scores spacing, radius and type against the FOUNDATIONS scale, so house values (6 px, 10 px, a 10 px small radius) show as fails. Of 230 lint fails before the pass, most were this.
- Add a host-token mapping step to design-director, and a lint option that takes the host's scale.

### 4. Lint false positives that bury real fails
- Wordmark split into weight spans flagged as "run together".
- Avatar initials under a headshot flagged as text over art (they are a fallback hidden by the image).
- Ticker labels at 3.76:1, measured inside the marquee's edge fade.
- A 35-character measure on card bodies at 1440 (cards are not reading columns).
- `::after` hit-area extensions not counted toward touch-target size.
- Fix: an allow mechanism (data attribute or selector list), and count pseudo-element hit areas.

### 5. Runtime brand colour against status colours (design-color)
"One colour, one meaning" says nothing about a user-chosen team hue that lands on top of `danger`. Here the viewer's team hue (16 degrees) sat beside a `--bad` of about 21 degrees.
- Add a hue-distance guard. Opinion: swap the status colour when hues are within 30 degrees or delta E is under 20. The build swaps `--bad` to the red token in that case.
- Add the two-channel pattern: ownership is fill, bar and ring in team colour; polarity is text colour plus an arrow. Then no team colour can collide with good or bad.

### 6. Mobile playbook 2a conflicts with valid owner decisions (design-playbook-mobile)
"One hero number at display size" and "nothing above the hero but the title and status bar" both fail here: the owner replaced the number hero with a conversational headline, and a ticker is joined to the header.
- Accept "a sentence that answers the question, with one emphasized figure" as an equal hero form, and let a project override "nothing above".

### 7. Mobile web sheets and Back (design-playbook-mobile)
"Browser Back must work" is too general to catch the sheet bug. Add: on mobile web, a sheet or overlay pushes a history entry so system Back closes it; tab switches replace state. (Opinion, from Android and in-app browser behaviour observed in the pass.)

### 8. Hover is not a pause control on touch (design-motion 07)
Rule 6 is written for auto-updating numbers. Add that a marquee ticker or auto-drifting rail is moving content under WCAG 2.2.2 Pause, Stop, Hide (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), and that hover or `:active` pausing does not satisfy it on touch. The build makes a tap toggle the pause.

### 9. Type ramp has no condensed display or micro caps (design-typography 04, 05)
- Typography 04 assumes 16 px body and 12 px minimum captions. Broadcast UI runs 9.5 to 10.5 px caps at about 0.14em under a condensed display face. Add a "condensed display plus micro caps" ramp with a floor (opinion: 9.5 px caps at weight 700 or more).
- Typography 05 says tabular figures on every updating number but misses the warning that `tnum` set on `body` widens figures and hyphens in prose. Measured in Inter: the hyphen gets 41% wider. Add "scope `tnum` to number elements".

### 10. Third-party marks in dark mode (design-graphic 02)
Graphic 02 covers your own icons only. Navy NHL logos vanished on dark cards. Add: light and dark variants or a plate (the build uses a light drop-shadow halo), dim states that keep 3:1 (WCAG 1.4.11), and a real-size check.

### 11. Numbers that do not transfer from landing pages (design-layout 06, design-graphic 02)
- Layout 06's 64 / 128 section padding and 1136 content box are landing-page numbers. The pacing rules transferred; the numbers should be scoped to landing pages.
- Graphic 02's hockey-pool worked example specifies 12 px tab labels and filled selected icons. This app, like iOS, uses about 10 px labels with colour and weight for selection. Mark the example as one option.

### 12. No tied-rank convention (design-product-ui 01)
No skill says how to show ties across table, prose and chart ("T2", "2nd", "T2nd"), or how to word a shared record ("+4 tied" hid that the viewer's own player was one of the four). The build uses "Tied by 4 others" and a one-line "ties share a rank" note.

### 13. No sports or broadcast exemplar (`kb/teardowns/`)
None of the 25 teardowns is a sports, live-score or broadcast product. Team-colour theming, score typography, logos on dark and a broadcast graphics package (score bug, lower third, intermission panel) had no teardown to judge against, so those calls in the pass were opinion. Candidates: Apple Sports, the NHL app, theScore, ESPN, plus one broadcast package teardown.

## Correctly ignored
design-ux 04 notifications (declined by the owner), design-product-ui 05 bulk selection, product-ui 06 KPI tile row (removed on purpose), and dataviz's "a table view exists" for a chart that sits directly under its table.

## Suggested next step
Gaps 1, 2 and 3 cost the most and touch the most skills. Opinion: brief them as one "data apps" round (staleness, reconciliation, host tokens), then 5, 7 and 8 as small rule edits, then the teardown in 13.
