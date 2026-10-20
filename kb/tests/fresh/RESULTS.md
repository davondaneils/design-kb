# Fresh brief (Halyard): results

Date: 2026-10-13 to 14. Brief: `briefs.md`, committed before any build. Built by two fresh builders following design-director end to end on the reworked skills (FOUNDATIONS v0.5, design-motion 0.3, design-art-direction 0.2.0), then scored by fresh-context critics with the benchmark's method and scorecard. Reviews: `kb/reviews/fresh-landing.md`, `kb/reviews/fresh-app.md`.

## Headline
- **Imagery and motion moved from "clearly below" to "close" for the first time.** Both benchmark rounds rated them clearly below on the Ferry page; the Halyard page rates close on both, against Stripe, Linear, Apple and Things.
- **Both pages are still capped at "clearly below" overall by gate fails**, as in the benchmark. The fails are a new kind again: overlapping map labels, a diagram that contradicts its own list, a dark icon at 2.95:1, sentences that go false when a slider moves, a lane that jumps under the drag, and a phone table clipped by its parent. Every lint check passed on both pages.
- Without the gate fails the critics would rate both pages close in every row but one (app copy, app phone layout).

## Marketing page vs Stripe, Linear, Apple, Things
| Domain | Benchmark R2 (Ferry) | Fresh (Halyard) |
|---|---|---|
| Type scale | close | close |
| Spacing rhythm | close | close |
| Color and contrast | close | close light, clearly below dark (gate) |
| Hierarchy | close | close |
| Copy | clearly below | close |
| **Imagery and art direction** | **clearly below** | **close** |
| **Motion** | **clearly below** | **close** |
| Layout at 390 | close | close |
| Layout at 768 and 1024 | close | close |
| Gate fails (rows) | 15, 16 | 3, 13, 16 |
| Overall | clearly below | clearly below |

## App screen vs Linear app, Things, Stripe Dashboard
| Domain | Benchmark R2 (run review) | Fresh (plan) |
|---|---|---|
| Type scale | close | close |
| Density and row heights | clearly below | close |
| Spacing rhythm | close | close |
| Color and status color | clearly below | close |
| Contrast | reaches exemplar | close |
| Hierarchy | close | close |
| Copy and microcopy | clearly below (gate) | clearly below (gate) |
| States | close | close |
| Motion | close | close |
| Imagery (timeline, route) | not rated | close |
| Layout at 390 | clearly below | clearly below (gate) |
| Layout at 768 and 1024 | close | close |
| Gate fails (rows) | 1, 13, 15, 16 | 1, 15, 16 |
| Overall | clearly below | clearly below |

## Measured (choreo-probe, 1440)
| Measure | Stripe | Linear | Ferry R2 | Halyard |
|---|---|---|---|---|
| Screens with a visual | 14 of 17 | 10 of 12 | 1 of 7 | 8 of 9 (12 of 15 at 390) |
| Product fragments | about 12 | about 5 | 0 | 8 (5 are the same timeline) |
| Median visual cover per screen | 63% | 69% | 0% | 29% |
| Animations run | 721 | 610 | 51 | 245 |
| Distinct durations | 20 | 13 | 3 | 6 |
| Product scenes | 4+ | 2+ | 0 | 1 (beats 1.6 to 3.6s, 11.6s loop, pause button, still under reduce) |

## Honest gaps that remain
1. **Gate fails come from operating and reading diagrams, not from rules.** No lint yet catches: labels overprinting inside an SVG map, a diagram whose geometry contradicts the list it illustrates, icon contrast in dark, sentences about a slider's choice computed from the wrong data, layout that shifts under a drag, content clipped by a non-scrolling parent, and a number split from its unit. The critics drafted a `unit-break` probe (`kb/tests/fresh/app/critic/static-probe.mjs`). These are the next lint checks.
2. **Pictures are small and repetitive.** Median cover 29% against 63%; five of eight fragments are one timeline; no photography (no image host). The visual plan check counts screens, not picture size or variety.
3. **One product scene where Stripe runs four**, and the same word rise on every heading, spreading 612 to 693ms. `motion-plan-check.mjs` now fails text staggers over 500ms (it only warned).
5. **The two pages disagree with each other.** The site puts high water at Lymington at 10:58 and the app at 09:20 for the same Saturday, because each builder made its own sample model; a shared dataset in the brief would have prevented it.
4. **Sample models a domain expert would reject** (the app treats a cross-stream passage as with the stream; the site reverses the Met Office area name "Selsey Bill to Lyme Regis"). design-copy has no rule for this.

## Blind gate on Halyard's motion (design-motion 0.4 and 0.4.1, 2026-10-15)
Four trials, each pairing a Halyard moment with an exemplar moment filmed the same way: hero against Linear's hero, and the event, swap and route scenes against Stripe's checkout. A fresh critic judged each round (`skills/design-motion/assets/blind-gate.mjs`; answers and grades in `kb/tests/fresh/landing/gate/`).

| Round | Page | Told apart (confidence) | Memorable moment named in ours | Verdict |
|---|---|---|---|---|
| v03 | old page (0.3) | 2 trials run: 3, 4 | 2 of 2 | fail |
| v04 | rebuild, round 1 | 4, 3, 3, 3 | 3 of 4 | fail |
| v05 | rebuild, round 2 | 3, 5, 4, 3 | 4 of 4 | fail |

What moved: a memorable moment in every clip, the answer now inside the first look, no overhanging panel, no decorative halo, no frame where two facts disagree. What did not: the critic picked the exemplar every time, and in v04 and v05 recognised Linear and Stripe by their content in every trial.

Honest limits of the gate as built:
1. **Recognition defeats "tell apart".** Any critic who knows Stripe's checkout picks it whatever the craft of the other clip, so the tell-apart rule cannot be passed by an original page. The confidence numbers measure recognition as much as craft.
2. **One critic is noisy.** v04 asked for counters that run while the boat moves; v05 called the same counters unreadable. v04 asked for an earlier press; v05 said the start state was not held long enough. Corrections from one critic are leads, not orders.
3. The v05 corrections that both critics agree on are real and open: several things change at once in the hero sweep and the swap (one owner at a time is not yet met), results are held too briefly at the climax, and the text in the product mocks is small at a 960px frame.

### Scored gate (design-motion 0.4.2 and 0.4.3, Davon's decision 2026-10-20)
Three fresh critics per round score each clip 1 to 10 for motion craft; a trial passes when our median is within 1 point of the exemplar's and most critics name a memorable moment in ours.

| Round | Page | Hero vs Linear | Event vs Stripe | Swap vs Stripe | Route vs Stripe | Passed |
|---|---|---|---|---|---|---|
| v06 | rebuild after 2 correction rounds | 7 vs 7 | 6 vs 8 | 7 vs 8 | 6 vs 8 | 2 of 4 |
| v07 | round 3 (12 agreed fixes) | 7 vs 6 | 6 vs 8 | 7 vs 8 | 6 vs 8 | 2 of 4 |
| v08 | round 4 (13 agreed fixes, in-place replay) | 6 vs 8 | 6 vs 9 | 7 vs 9 | 5 vs 9 | 0 of 4 |

The committed page is the v07 version (best scored); round 4 is kept in git history (commit 8ce4ece). What this says: the system now produces moments three critics out of three remember, and two of four that score within a point of Stripe and Linear; the event and route scenes stay two points short; and applying critics' corrections as patches stopped helping after the first round and then made things worse. Exemplar scores also moved between rounds (Stripe 8 to 9, Linear 6 to 8) with the same clips, which is the noise floor of three critics.
