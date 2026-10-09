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
