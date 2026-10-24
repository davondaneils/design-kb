# Operated checks against the critics' hand-found misses

Date: 2026-10-24. Tool: `tools/operate.mjs` (also run by `tools/lint.mjs` on every target). Runs: `round1-landing.txt`, `round1-app.txt` (default and `?state=error`), `round2-landing.txt`, `round2-app.txt` (default, `?state=error`, `?state=approved`, `?state=confirm`), each with `--log`. JSON beside each. Fixture: `tools/fixtures/bad-operate.html` fails every check once; `tools/fixtures/good.html` passes.

## What the critics found by operating the page or reading a state, and what the tool says

| # | Miss (round, page, critic gate row) | Tool result | Check |
|---|---|---|---|
| 1 | R1 app, 16b: after Approve run, the page still says "estimates until you approve", "need a look before you approve", "Approve by" | **fail** | `stale-commit` |
| 2 | R1 app, 16a: "People paid 38" under "Nobody has been paid" in `?state=error` | **fail** | `contradiction` |
| 3 | R1 landing, 15: pressed primary reads as disabled (critic delta E 6.5) | **fail** (delta E 6.4) | `press-state` |
| 4 | R1 landing, 15: phone "Menu" looks the same open and closed | **fail** | `disclosure` |
| 5 | R2 landing, 15a: pricing stepper buttons do nothing | **fail** | `dead-control`, `stepper` |
| 6 | R2 landing, 15b: at 200 the wrong button disables | **fail** | `stepper` |
| 7 | R2 landing, 15c: open FAQ row keeps its "+" under reduced motion | **fail** (all 5 rows) | `disclosure` |
| 8 | R2 landing, 16d: "$108 a month / 9 people" untrue after the stepper is pressed | **fail** (the value never moves; once it does, `stepper` fails any press that leaves the text around it unchanged) | `stepper` |
| 9 | R2 app, 1: focus lands under the open phone drawer | **fail** (all three states) | `focus-obscured` |
| 10 | R2 app, 16a: confirm dialog says "Everyone is paid" above "not sent" | **fail** | `contradiction` |
| 11 | R2 app, 16d: rate lock grows from 24 to 29 minutes after Retry | **fail** | `countdown` |
| 12 | R2 app, 16e: "People in this run" reads 3 and 38 after the filter | **fail** | `label-number` |
| 13 | R2 app, 16b and c: default page says "Everyone is paid Fri, Oct 30" while an alert says Tomás can't be paid | **warn** only (page-wide pairs warn; a dialog or one section fails) | `contradiction` |
| 14 | R2 app, 15: the state sheet's ghost "pressed" cell is drawn the same as rest | **missed**: the live ghost buttons do have a pressed state; only the sheet's pinned class is missing. The tool presses live controls, not sheet cells | none |

**12 of 14 fail, 1 warns, 1 is missed.**

## Not in scope (found by looking or by arithmetic, not by operating)
- R2 landing 16b: hero total off by $0.69 when re-added at the displayed 4-decimal rates. Footing a total at displayed precision is still a hand check (director step 13).
- R2 landing 16a: "0.4% shown on every line" with no line showing it. Judged.
- R2 app 13: the total row's rule starts mid-row; a stray "·" line at 390. Rendering, not operating.
- R2 app 15: the loading state's primary reads as busy. Judged.
- R1 app 3: the selected filter at 1.21:1. Caught statically by lint `selected-state` since the round 1 fixes.

## Found that no critic reported
- R1 app: five buttons that do nothing ("Send reminder", "Review rate", "Check proration", the workspace switch, "Use another account"); the round 1 critic said only that "Review rate" was still offered after Approve.
- R1 app: the approve dialog says "pays everyone on Fri, Oct 30" in the same dialog as "Lucía Fernández's pay is held".
- R1 and R2 app: table sort buttons and the R1 "All 38" segment look the same held down as at rest (design-polish 01 rule 3).

## False alarms seen while building it, and the fix
- A submit button in a form that fails native validation changes no DOM (the browser shows its own bubble): exempt.
- `scroll-behavior: smooth` moved the button under the probe point mid-scroll: the tool scrolls with `behavior: 'instant'`.
- Identical renders differ by a few anti-aliased pixels: two screenshots count as the same when 8 or fewer pixels differ.
- A segment that is never disabled has no disabled look: the pressed-versus-disabled delta is only measured when a disabled copy looks different from rest.

## Cost
About 30 to 40 seconds per page state on these pages (each control on a fresh load at 1440, controls only shown at 390 again at 390, disclosures again under reduced motion, one level into dialogs). Skip with `--no-operate` while iterating; never for the hand-over.
