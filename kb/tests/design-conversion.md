# Test: design-conversion v0.1 (rendered vertical slice)

Tester, 2026-10-10. Briefs and rubric: `kb/briefs/conversion/slice-test-briefs.md`. Pages: `kb/tests/design-conversion/` (`before/` is the combined-test baseline; `coffee.src.html` and `dashboard.src.html` are the after sources, built with `node kb/tests/design-conversion/build.mjs`).

**Honesty note.** This session had no subagent tool. The same agent wrote the skill and rebuilt the pages, so this is not a clean-context test: the after pages show that the skill can be applied, not that a cold reader would apply it. A clean-context re-run is listed in the pipeline notes. External CDNs and photo hosts are blocked, so the pages use generated SVG and CSS imagery, and the express-pay buttons are neutral outlined stand-ins (no official Apple Pay or Google Pay assets).

## Method
1. Lint every page and state with `tools/lint.mjs` (any fail = fail).
2. Run `skills/design-conversion/assets/conversion-audit.mjs` at 390 and 1440 on every state.
3. Render with `tools/render.mjs` at 390 and 1440, light and dark (36 PNGs in `shots/`).
4. Score the 7-item conversion rubric from screenshots and source; recompute every number with `kb/research/conversion/scripts/price-math.mjs` and Python `datetime`.
5. Compare the decision moments with the measured exemplar teardowns (branch `claude/exemplar-library-xfa3bl` at 40d89cf; read with `git show`, not committed here).

## Results: gate and audit
| Page | Lint before | Lint after | Audit before | Audit after |
|---|---|---|---|---|
| Coffee (default plus 7 states, plus state sheet) | 0 fails, 21 warnings | 0 fails, 22 warnings, every state | 0 fails, 1 warning (cart-shipping) | 0 fails, 0 warnings, every state |
| Dashboard (default plus 9 states, plus state sheet) | 0 fails, 27 warnings | 0 fails, 27 warnings, every state | 0 fails | 0 fails |

Read this honestly: the baseline already passed the automated floor. The gain is in the judged rubric, the number errors and the decision moments, not in lint counts.

Audit sanity check: `skills/design-conversion/assets/fixtures/bad.html` (preticked add-on, blocked paste, `type="number"` card field, "Submit", no term line, 5.0 with no count, countdown) gives 10 fails and 4 warnings, so the audit is not passing everything.

## Conversion rubric
| # | Item | Before | After |
|---|---|---|---|
| 1 | One filled primary per screen; labels predict the next screen | Fail at 390: hero primary below the first screen; band used a second verb form | Pass: buy panel puts price plus "Start a subscription" in the first screen at 390 and 1440; one label everywhere; modal counts only its own "Pay $18 and subscribe" |
| 2 | Price block complete and adjacent | Partial: price and "15% under shop price", no next charge or cancel line | Pass: "$18 a bag", 340 g, shipping included, compare line, live term line "$18 every 2 weeks. Your first bag, lot 0412 ... ships Friday, Oct 16. Next charge Oct 30. Skip, pause or cancel online any time." directly above the button |
| 3 | Every number correct | Fail: "15%" is really 14.29% | Pass: "$3 less than a single bag"; $0.90 a cup; Oct 16 and Oct 30 are Fridays, Nov 13 for 4 weeks; distribution 1,040/160/44/22/18 = 1,284, mean 4.70; dashboard 3.6M by Oct 12 projects 9.3M, 7.8M crosses 10M on Oct 16 |
| 4 | Proof with count and distribution near the primary | Fail: no rating near the subscription | Pass: 4.7 from 1,284 subscriber reviews, 5-row distribution, featured 3-star review with the head roaster's reply, same screen as the order card at 1440 |
| 5 | Forms | No checkout existed | Pass (`?state=checkout`): express pay first, 8 visible fields with autocomplete tokens, line 2 and coupon collapsed, card block encapsulated, "Due today $18.00" beside "Pay $18 and subscribe"; `?state=checkout-error` shows inline errors with text, not color alone |
| 6 | No dark patterns | Pass | Pass: no urgency, no preticked add-ons, renewal in the term line, plain "Or buy a single bag, $21" (no confirmshaming) |
| 7 | In-product upgrade | No surface | Pass: sidebar meter "3.6M of 10M, on pace for 9.3M"; `?state=limit` warning alert in "Needs attention" (non-modal, projects the date, says what is kept, upgrade is a "Compare plans" text link so "Share report" stays the primary); `?state=limit-member` replaces the buy action with "Ask Priya Shah" |

Score: before 2 of 7, after 7 of 7.

## Gaps found and fixed during testing
- G1: baseline "15% under shop price" was 14.29%. Replaced with currency ("$3 less"), which is also the stronger framing for small savings (chapter 03).
- G2: baseline primary sat below the first screen at 390. Fixed with grid areas that move the buy panel above the art at phone width.
- G3: muted text on the sunken card block measured 4.38:1. Legend and lock line now use full text color.
- G4: `.opt:hover small` measured 4.24:1 on the tinted hover surface (caught on the state sheet). New token `--color-text-muted-on-tint`.
- G5: the `hidden` attribute lost to grid and flex display rules (line 2 field, limit alert). Global `[hidden] { display: none !important; }`.
- G6: dark mode "Recommended" tag used the primary hue at low contrast; now `--color-accent`.
- G7: audit false positives (term-line check firing on nav and footer links, autocomplete on radios, the page primary counted behind an open modal, "1,284 subscriber reviews" not matched, shipping note outside the card). All fixed in `conversion-audit.mjs`.
- G8 (skill text): chapter 03 said a 340 g bag lasts 2 weeks "at two cups a day". At 17 g a cup that is 20 cups, about a cup and a half a day. Fixed in the draft and reference.

## Exemplar comparison (decision moments only)
- **Price at the first screen (Apple MacBook Air, measured, C51):** close. Same move, price sentence and single button in one panel. Apple's panel is quieter and its product photography carries the page; ours has none (photo hosts blocked).
- **Two paths and proof at the fold (Stripe home, measured, C52):** close on structure (commit plus smaller path; proof beside the decision). Stripe shows two filled buttons in its first screen; this kb's gate forbids that, so ours is stricter, not a gap.
- **Objection answered under the button (Raycast, C54):** close. The term line and guarantee do the same job.
- **Checkout:** clearly below Apple and Stripe Checkout on polish of payment marks and wallet buttons (no official assets offline), close on structure and field budget.
- Overall: at the conversion moments, close to the exemplars; the page as a whole stays below Apple on imagery, which this domain does not own.

## Verdict
**Pass** (gate 100 percent, rubric 7 of 7, audit 0 fails, after better than before at the moment of decision). Status moves to testing complete pending a clean-context re-run and Davon's look.

## Screenshots
`kb/tests/design-conversion/shots/`: `coffee-1440-light.png`, `coffee-390-dark.png`, `coffee-state-checkout-1440-light.png`, `coffee-state-checkout-error-*`, `coffee-state-plan-4-*`, `dashboard-1440-light.png`, `dashboard-390-dark.png`, `dashboard-state-limit-1440-light.png`, `dashboard-state-limit-member-*`, and both state sheets. Note: full-page renders show the open checkout dialog pinned at the top of the page, as it sits in the first viewport.
