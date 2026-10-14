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
4. **Sample models a domain expert would reject** (the app treats a cross-stream passage as with the stream; the site reverses the Met Office area name "Selsey Bill to Lyme Regis"). design-copy has no rule for this.
