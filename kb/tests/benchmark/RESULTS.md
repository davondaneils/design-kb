# Exemplar benchmark: results

Date: 2026-10-13. Briefs: `briefs.md` (committed before any build). Each round: a fresh builder followed design-director end to end; `kb/teardowns/measure.mjs` measured the pages exactly as it measured the exemplars; `score.py` compared the numbers; a fresh-context critic that did not build the page scored it against the exemplar teardowns and screenshots, gate table first. Round 2 was a rebuild from scratch on the fixed skills, by new builders and new critics who were told not to open round 1.

## Headline
- **Both rounds, both pages: "clearly below" the exemplars, capped by the fundamentals gate.** Neither page reaches Stripe or Linear yet.
- **Every round 1 gate fail was gone in round 2** (zones on times, the 1.2:1 selected filter, the false post-approve copy, pressed reading as disabled, 12px phone text, 33 characters per line, the misaligned menu, the inline link with a 44px box). The fixes held.
- **New gate fails appeared in round 2, of a different kind:** controls that do nothing when pressed, a confirm dialog that contradicts itself, a total off by $0.69, focus that lands under an open drawer, a table rule that starts mid-row. These come from operating the page, not from looking at it, and no rule, lint check or self-review caught them. Two new lint checks now do (`dead-control`, `phone-facts`; both fire on the round 2 page and pass on the fixtures).
- Above the gate, the marketing page moved from 4 of 9 domains at "close" to 6 of 9 (phone and tablet layout, dark theme). Imagery and motion stayed "clearly below" both rounds: the skills now get the basics right and still do not produce a signature.

## Scorecards (fresh-context critic ratings)

### Marketing page (vs Stripe, Linear, Ramp, Mercury)
| Domain | Round 1 | Round 2 |
|---|---|---|
| Type scale | close | close |
| Spacing rhythm | close | close |
| Color and contrast | close light, clearly below dark | close |
| Hierarchy | close | close |
| Copy | close | clearly below (3 truth slips) |
| Imagery and art direction | clearly below | clearly below |
| Motion | clearly below | clearly below |
| Layout at 390 | clearly below | close |
| Layout at 768 and 1024 | clearly below | close |
| Gate fails (checklist rows) | 13, 15, 16 | 15, 16 |
| Overall | clearly below | clearly below |

### Run review app screen (vs Linear app, Stripe Dashboard, Vercel Dashboard)
| Domain | Round 1 | Round 2 |
|---|---|---|
| Type scale | close | close |
| Density and row heights | close | clearly below |
| Spacing rhythm | reaches exemplar | close |
| Color and status color | close | clearly below |
| Contrast | clearly below (gate) | reaches exemplar |
| Hierarchy | clearly below | close |
| Copy and microcopy | clearly below (gate) | clearly below (gate) |
| States | close | close |
| Motion | close | close |
| Layout at 390 | clearly below | clearly below |
| Layout at 768 and 1024 | close | close |
| Gate fails (checklist rows) | 3, 16 | 1, 13, 15, 16 |
| Overall | clearly below | clearly below |

## Measured (score.py, light; same script as the exemplars)
| Measure | Exemplar range | Site R1 | Site R2 | App R1 | App R2 |
|---|---|---|---|---|---|
| Phone characters per line (gate 35 to 75) | 34 to 50 | 33 | 40 | 40 | 41 |
| Phone body size | 15 to 16 (app), 10 to 20 (site) | 14 | 14 | 12 | 14 |
| Text under 4.5:1 | 0 to 17% | 0% | 0% | 0% | 0% |
| Spacing on the 4px grid | 51 to 100% | 100% | 100% | 99.8% | 100% |
| Transition durations | 5 to 8 (site), 3 to 5 (app) | 1 | 1 | 1 | 1 |

## What this says about the library
1. **The gate is enforced only where a tool enforces it.** 10 of round 1's 14 misses were rules already in a skill. Round 2 fixed all of them because they became lint checks or hand-over checks, then missed new things no check covered. The next gains come from more operated checks (press every control, re-add every total after each action), not more prose.
2. **The skills make correct pages, not memorable ones.** Imagery and motion were "clearly below" in both rounds on the marketing page. The concept and reveal rules exist; nothing yet pushes a builder from a correct single product card to Stripe's bento of live mock-ups or Linear's full product in the hero.
3. **Product UI density is unstable.** Round 2's app traded density and status color for hierarchy: alert cards became the loudest objects and the people table started below the first screen. design-product-ui needs a first-screen budget for review screens.

## Files
- Round 1: `round1/` (pages, shots, `score-*.md`, `RANKED.md`, `FIXES.md`); critic reviews `kb/reviews/benchmark-round1-landing.md`, `-app.md`.
- Round 2: `round2/`; critic reviews `kb/reviews/benchmark-round2-landing.md`, `-app.md`.
- Tools: `score.py`; `kb/teardowns/measure.mjs` (oklch, `--scheme`); `tools/lint.mjs` checks `selected-state`, `reading-size`, `phone-facts`, `dead-control`, measure floor at 390, closed `<details>`, oklch in `overlay`.
