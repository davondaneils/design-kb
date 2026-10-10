# Tests: design-ux v0.1

Method: each brief answered twice by Claude. "Generic" = a strong assistant with no skill, answering in good faith. "With skill" = same model following `skills/design-ux/SKILL.md` and the references it points to. Answers are condensed to their decisions; full prose omitted.

Rubric: **Gate** (pass/fail; one fundamentals miss = fail), then 1 to 5 on Correctness, Specificity (real numbers, labels, states), Accessibility, Fit to brief, Expert depth. Pass bar: with-skill passes the gate, wins clearly, and is shippable by a top studio.

## Trigger check
- Fires on: "UX review of our settings page", "how should onboarding work for X", "mobile filters for our shop", "spec loading states", "hamburger or tab bar", "port iOS nav to Android", "form validation rules". Yes, all named in the description.
- Stays quiet on: "pick a palette" (design-color), "pair fonts" (design-typography), "write a sales page" (copywriting), "set up a funnel" (sales-funnels), "fix this SQL" (design-data). Description explicitly excludes visual styling and persuasion copy.

---

## Brief 1: Sign-up and first run for a team analytics SaaS
"We sell a B2B analytics tool. Users sign up, connect a data source (Postgres, BigQuery, Stripe), then see dashboards. Design the sign-up form and first-run experience."

### Generic answer (condensed)
- Sign-up form: First name, Last name, Work email, Company, Role, Password (8+ chars, 1 number, 1 symbol), Confirm password, "Sign up" button disabled until valid.
- Real-time validation as the user types.
- Welcome modal with a 4-step product tour, then "Connect your data" page with a list of connectors.
- Empty dashboard says "No data yet. Connect a source."
- Progress spinner while connecting.

### With-skill answer (condensed)
- Question protocol removes Company, Role, Confirm password; name moves in-product. Fields: Work email, Password; SSO first ("Continue with Google", "Continue with Microsoft"). Labels above, `autocomplete="email"` and `new-password`, show/hide toggle, paste allowed.
- Password rule per NIST Rev 4: 15+ characters (or 8+ if MFA is enforced), no composition rules, blocklist check with reason ("This password appears in known breaches. Choose another.").
- Validation: email on blur; password checklist live after first blur; errors clear on the fixing keystroke. Button "Start free trial", enabled; on submit disabled with spinner, label kept.
- First run: no tour. Dashboard opens with labeled sample data ("Sample data. Connect a source to see yours."). Side checklist (3 steps, skippable): Connect a source (Postgres, BigQuery, Stripe as one-click tiles), Pick a template, Invite a teammate.
- Connection 2 to 15 min: determinate progress with estimate, "We'll email you when it's ready", user keeps exploring sample data. Failure: in-card error naming the cause ("Couldn't reach db.acme.com:5432. Check the host allows connections from 34.120.0.0/16.") with Retry and docs link.
- Activation event: first dashboard on own data viewed by 2+ people; measure time to it.
- States specified: empty, connecting, partial (some tables synced), failed, success swap-in. Focus moves to error summary on submit errors; toasts polite live region.

### Scores
| Criterion | Generic | With skill |
|---|---|---|
| Gate | FAIL (disabled submit; keystroke validation; composition rules contradict NIST; forced modal tour) | PASS |
| Correctness | 2 | 5 |
| Specificity | 2 | 5 |
| Accessibility | 2 | 5 |
| Fit to brief | 3 | 5 |
| Expert depth | 1 | 4 |
| **Total (of 25)** | **10** | **24** |

Where skill was ignored or misled: none. Gap found: none blocking. Minor: skill had no wording for connection error messages specific to data sources; handled by design-copy hand-off.

---

## Brief 2: Mobile shop product listing, filters and cart removal (iOS and Android)
"2,000 product catalog. Design the category listing, filters and how users remove items from the cart, for our iOS and Android apps."

### Generic answer (condensed)
- Infinite scroll grid, 2 columns.
- Filter icon top-right opens a full-screen filter page; "Apply" at bottom.
- Hamburger menu for categories.
- Cart: swipe-to-delete with a confirmation alert "Are you sure you want to remove this item?" Yes / No.
- Tap targets "at least 44 px".

### With-skill answer, first run (condensed)
- Navigation: iOS tab bar / Android navigation bar with Home, Search, Categories, Cart (badge), Account. No hamburger.
- Listing: 2-column grid, 20 items, lazy-load to 60, then "Load more (60 of 412)"; restore scroll on Back; footer reachable (Baymard).
- Filters: [skill had no filter guidance; answer improvised "full-screen filter page"].
- Cart removal: remove immediately with "Removed Linen shirt. Undo" toast (at least 5 s, pauses on touch), plus a visible Remove button (swipe is not the only way, WCAG 2.5.7). No confirmation alert (Raskin; Apple HIG: no alerts for common undoable actions).
- Targets 44 pt iOS, 48 dp Android; quantity stepper buttons 44/48 with 8 px gap.
- Android: system back, Material state layers; no iOS chevrons.

### Gap found and fixed
- **Gap 1: faceted filtering.** No rule on batch vs live filtering, tray vs separate screen, result counts. Fixed: added a "Filters" section to `references/02-navigation-ia.md` and SKILL.md from NN/g "Applying filters" and "Mobile faceted search" (research 02 #11, #12).

### With-skill answer, after fix (filters part)
- "Filter" text button (not icon only) opens a tray from the right over dimmed results; results stay visible behind.
- Live update if results return under 1 s; otherwise batch with an Apply button labelled with the count ("Show 128 results", opinion) so zero-result combinations are avoided. Facet values show counts; zero-count values dimmed, not hidden.
- Applied filters as removable chips above the grid plus "Clear all"; filters in the deep link.

### Scores (after fix)
| Criterion | Generic | With skill |
|---|---|---|
| Gate | FAIL (hidden nav; confirm instead of undo; swipe-only delete; Yes/No) | PASS |
| Correctness | 2 | 5 |
| Specificity | 2 | 5 |
| Accessibility | 2 | 5 |
| Fit to brief | 3 | 5 |
| Expert depth | 1 | 4 |
| **Total** | **10** | **24** |

---

## Brief 3: "Generate report" in a web dashboard (30 to 90 s, AI summarization)
"Users click Generate report; the system pulls data and writes an AI summary. Takes 30 to 90 seconds. Spec all states."

### Generic answer (condensed)
- Button turns into spinner "Generating..."; full-page overlay spinner until done.
- Error: alert "Something went wrong. Please try again."
- Success: report appears, toast "Report generated!".

### With-skill answer (condensed)
- Before: dialog-free inline panel showing scope (date range, sources) and estimate "About 1 minute". Button "Generate report".
- During: no full-page block. Determinate step progress ("Pulling data 2 of 4 sources", then "Writing summary"), streaming summary text as it arrives, Cancel available, "You can leave this page; we'll notify you" with in-app notification on completion. Elapsed time shown after 10 s (NN/g).
- Partial failure: if one source fails, report generates with a flagged section "Stripe data unavailable (timeout). [Retry Stripe]" instead of failing the whole run.
- Total failure: inline error stating cause and action ("The warehouse query timed out after 90 s. Narrow the date range or retry."), inputs kept.
- Success: report in place, summary at top of what was produced and from which sources, low-confidence statements flagged, "Regenerate" and version history (undo path). Polite live region announces "Report ready".
- Reduced motion: no shimmer on streaming text.

### Scores
| Criterion | Generic | With skill |
|---|---|---|
| Gate | FAIL (no progress for a 30 to 90 s wait beyond spinner; vague error; blocking overlay) | PASS |
| Correctness | 2 | 5 |
| Specificity | 2 | 5 |
| Accessibility | 2 | 4 |
| Fit to brief | 3 | 5 |
| Expert depth | 1 | 5 |
| **Total** | **10** | **24** |

Note: with-skill accessibility scored 4 because the skill did not say how to make streaming text screen-reader friendly. **Gap 2 fixed:** added to `references/04-states-feedback.md`: do not put streaming text in a live region token by token; announce start and completion politely and let users read the finished text (opinion grounded in WCAG 4.1.3 intent; avoids flooding screen readers).

---

## Result
| Brief | Generic | With skill | Pass |
|---|---|---|---|
| 1 Sign-up and first run | 10 (gate fail) | 24 | Yes |
| 2 Mobile listing, filters, cart | 10 (gate fail) | 24 | Yes, after gap 1 fix |
| 3 Long AI report | 10 (gate fail) | 24 | Yes, after gap 2 fix |

Gap list sent to domain-specialist: both fixed in this version (filters; streaming text accessibility). Open item for v0.2: data tables (sorting, bulk actions, column density) are only touched; coordinate with design-data.


---

# Run 2 (v0.2, 2026-10-10): rendered slice test

**Briefs:** `kb/briefs/ux/slice-test-briefs.md` (UX-A coffee purchase and subscription; UX-B dashboard first run). **Method:** baseline is `kb/tests/combined/coffee.html` and `dashboard.html` (copied to `kb/tests/design-ux/before/`). Same agent built and judged; no clean-context tester, so judged rows below are self-scored and should be read with that bias. Pages are built from the baseline sources plus `kb/tests/design-ux/parts/` by `parts/assemble.py`, then `build.mjs` (state sheets from `states.mjs`). Shots: `kb/tests/design-ux/shots/` (rendered by `parts/render-all.sh`).

## Baseline UX audit (gate misses the lint cannot see)
Both baselines lint PASS, yet each fails the design-ux gate:
1. Coffee: "Start a subscription" went to `#`: a dead end, with no choice of coffee, grind or cadence. (Gate: no dead ends.)
2. Coffee: "Add to cart" guessed the grind; a whole-bean buyer gets the wrong product with no chance to say so.
3. Coffee: the header Cart link pointed at a missing `#cart`. (Dead end.)
4. Coffee: Roastery, Journal and Subscriptions vanished below 768 px with no route to them. (Navigation parity.)
5. Coffee: the two calls to action used different verbs for the same job.
6. Dashboard: the empty state had no sample data, no guide and no live wait: a new user saw a blank product and one button.

## Lint (tools/lint.mjs, any fail = fail)
| Target | Before | After |
|---|---|---|
| coffee.html | PASS, 0 fail, 21 warn | PASS, 0 fail, 22 warn |
| coffee states menu, quick, sub-error, cart, cart-empty, removed, checkout, error, sending, subscribed | n/a | all PASS, 0 fail, 22 to 29 warn |
| coffee-states.html (state sheet, with option cards, stepper, close, remove, undo, menu toggle) | n/a | PASS, 0 fail, 17 warn |
| dashboard.html | PASS, 0 fail, 27 warn | PASS, 0 fail, 27 warn |
| dashboard first-run, listening, check-failed, first-data | n/a | all PASS, 0 fail, 26 to 33 warn |
| dashboard loading, empty, partial, viewer, compact, palette, sheet | PASS | all PASS, 0 fail, 8 to 34 warn |
| dashboard-states.html | PASS | PASS, 0 fail, 35 warn |

Failures fixed during the build (each now taught or noted): radio inputs and icon buttons at the 13.33 px UA font (type scale); text behind an open modal flagged for contrast (inactive content, WCAG 1.4.3 exception; handled with `data-lint-skip="overlay"` on `<main>` while a dialog is open, lint change suggested); a horizontally scrolling code snippet not keyboard reachable (axe scrollable-region-focusable; fixed by wrapping); guide and problem copy at 78 and 141 characters per line; the "Connect Stripe" inline link under 24 px tall.

## Judged rows
| Check | Result |
|---|---|
| Every purchase path ends somewhere real (subscription form, quick add dialog, cart drawer, checkout entry) | Pass |
| Grind asked in the buyer's words ("How do you brew?"), never guessed; the answer remembered as "Your usual" | Pass |
| Missing answer: one error at the group, linked by `aria-describedby` on the fieldset, focus moved to the group, shown only after submit | Pass (state sub-error) |
| Button is the summary ("Add subscription, $18 every 2 weeks"), terms in one sentence under it, ship date shown | Pass |
| Cart: subscription and one-time grouped, due today versus then every 2 weeks, free shipping reason stated, remove with undo in place | Pass (states cart, removed) |
| Empty cart has a next step, not a sentence | Pass |
| Announcements made from a live region inside the open dialog (content behind is inert) | Pass |
| Phone nav: every desktop destination reachable through Menu | Pass (state menu) |
| Dashboard first run: sample data marked where it is read (bar, panel tags, neutral deltas), guide with a true count (1 of 4), current step open | Pass |
| Listening: a bounded wait with a time and what happens if nothing arrives | Pass |
| Check failed: cause named, exact fix, copyable, who can do it, "Check again" | Pass |
| First data: real numbers replace the sample; metrics that cannot compute say when ("Needs 30 days of data, Nov 11"), never 0 | Pass |
| Guide can be hidden and found again (sidebar "Setup guide 1 of 4"), focus moved on hide | Pass |
| Both themes, 390 and 1440 | Pass by render review |

## Exemplar comparison (teardowns on `claude/exemplar-library-xfa3bl`, not committed here)
- **Apple MacBook Air (measured teardown):** price and Buy reachable from the first screen and a sticky local nav with a Buy pill. Ours: price is in the first screen and the subscription builder is one band down; there is no sticky buy affordance once the builder scrolls away. Apple's configurator then asks one question per step with an always-visible running total; our builder asks three questions on one card with the total in the button, which is the better fit for three small choices (opinion) but has no persistent total while choosing. Verdict on flow: close. Craft: clearly below; Apple's option tiles, spacing rhythm and photography are a level above, and we have no photography (hosts blocked).
- **Vercel and Stripe onboarding (from memory, not measured):** Vercel's first deploy shows a live log and a bounded wait; Stripe's dashboard runs test-mode data with a persistent marker. Our listening and sample states match the pattern and add the failure path (CSP named, copyable fix) that neither shows on its home page. Verdict on states: close. Visual calm of the guide panel: close; chart and table polish inherited from the baseline.
- **Honest summary:** flows and states now reach the exemplar pattern level; visual craft of the purchase UI is clearly below Apple. Brief pass rule: gate 100 percent, flow and states close, calm close, craft close on the dashboard and clearly below on the coffee option tiles. **Verdict: pass on UX (the domain under test); craft gap logged for design-graphic and design-product-ui.**

## Gaps (for v0.3)
1. No sticky buy affordance on the coffee page once the builder scrolls off (Apple pattern). Teach when a sticky local nav earns its place.
2. The phone code snippet wraps mid-attribute; a copy-only snippet could truncate with a fade and rely on Copy. Teach the trade-off.
3. The dashboard state sheet does not yet cover the guide controls (step marks, problem box, tags); they are linted only in page states.
4. Self-judged run. A clean-context tester should re-score the judged rows.
