# design-data test: Crux class booking (2026-10-13)

Brief: `kb/tests/design-data/briefs.md`, committed (`35770aa`) before any build. Fresh brief, never used before. Fictional facts. Overlap to note: design-data reference 01 keeps the archived yoga booking schema written 2026-10-09, so class booking is not entirely unseen domain material.

## Method
- **Baseline:** a clean-context subagent allowed to read only the brief and the `render.mjs` usage line; no skills, no `kb/`, no lint. It tested its own schema on PostgreSQL 16. Committed (`53fad57`). Output: `baseline/`.
- **With skill:** a separate subagent following design-director (foundations, design-strategy at inherit depth, design-playbook-mobile, design-data SKILL and references 01, 02, 03, 05, 06, 07), forbidden to open `baseline/`. It built while the v0.2.1 critic fixes were landing, so it read v0.2 to v0.2.1. Output: `skilled/` (schema, API, screen with 11 states, state sheet, 68 own tests, hand-over with the data-to-screen table).
- **Blind critic:** a third subagent got schema, API and screen of both as X and Y (random labels, skill names stripped), loaded both schemas into its own PostgreSQL 16 cluster and wrote its own race and isolation tests. Report: `blind-critic.md`; scripts and outputs: `blind-critic/`.

Key: **X = with skill, Y = baseline.**

## Scores (blind critic)
| Rubric area | With skill | Baseline |
|---|---|---|
| 1. Data fundamentals gate | 8 | 7 |
| 2. Correctness under concurrency | 8 | 7 |
| 3. Data and screen agree | 9 | 5 (capped: screen shows values the schema cannot store or return) |
| 4. Screen fundamentals | 9 | 5 (capped: lint FAIL in all 8 states, 31 to 87 fails each) |
| 5. Expert moves | 8 | 7 |
| **Total /50** | **42** | **31** |

Both schemas loaded, kept gyms isolated through RLS (0 rows across gyms, not found on every cross-gym call) and passed every race the critic wrote: last place with two sessions, 10 members on 3 places, two cancels against a waitlist, cancel racing a new booking, parallel double booking, last pack credit spent twice. No unindexed foreign key in either.

Baseline-only failures: owners cannot add a location through the granted path (`permission denied for function is_valid_timezone`); a booking made 6 hours before start got 1 hour of free cancellation (the brief says late cancels count as a no-show); late-cancel then rebook lists a class twice; a direct service-role insert overbooks (stored count 5, 6 rows); the screen shows a level the CHECK forbids ("Ages 8 to 14"), a cancel reason the API never returns and "Leeds time" with no city stored; day tabs fail label-in-name, a 79px sticky bar has no scroll padding, six filled primary buttons in one view.

## Verdict
**Skilled clearly better (42 vs 31).** The baseline was a strong engineer's work and matched the skilled schema on races and isolation; the skill's margin is in the contract between data and screen (every label and state traced to a field, times in the venue zone) and in screen fundamentals. Not a perfect score: gaps below. Gate not claimed for either until the gaps are fixed and re-tested.

## Gaps in the skilled entry, and what changed in the skill
1. **Staff can lower capacity under the booked count** (capacity 2 with 5 taken accepted; `api.md` promised `409 capacity_below_taken`, the trigger only watched bookings). Skill v0.2.3 move 9a: an invariant holds on every write path.
2. **The 7-day grace checks today, not the class date**: a member in grace could book a class after their access ends. Move 9b: time-bounded rights are checked against the time of the thing.
3. **Missing uniqueness and a small cross-gym leak**: two open monthly passes per member per gym allowed; the instructor-overlap rule keyed on the person, so one gym learns an instructor is busy at another; one global display name shared with every gym. Move 9c: tenant-keyed uniqueness and exclusion.

Not yet re-tested after v0.2.3.

## Re-test on v0.2.3 (2026-10-14)
Same brief, same baseline, a fresh with-skill build (`skilled-r2/`, forbidden to read the earlier entries or scores) and a fresh blind critic with new random labels (G = baseline, H = with skill) who wrote its own seeds relative to `now()` and its own tests. Report: `blind-critic-r2.md`; scripts and results: `blind-critic-r2/`.

| Rubric area | With skill (r2) | Baseline |
|---|---|---|
| 1. Data fundamentals gate | 9 | 5 (capped: cross-gym instructor leak, 3 unindexed foreign keys) |
| 2. Correctness under concurrency | 9 | 8 |
| 3. Data and screen agree | 9 | 6 |
| 4. Screen fundamentals | 8 | 5 (capped: lint FAIL with axe) |
| 5. Expert moves | 9 | 7 |
| **Total /50** | **44** (round 1: 42) | **31** (round 1: 31) |

The three round 1 gaps are closed: staff cannot lower capacity below the booked count (refused for staff and the service role), a member in grace cannot book a class after the grace ends, a second open monthly pass per gym is refused, and the instructor overlap rule is keyed by gym. Both critics' scores for the baseline match (31). The with-skill builder's own 83 checks found and fixed three more of its own bugs (waitlist ties within one transaction, class times skipped by daylight saving, time-zone changes not recomputing class times).

Gaps left: the 1440 layout is a single list beside a sidebar (the baseline's week grid is the better desktop layout); two racing retries with the same booking id return a raw `bookings_pkey` error (rule added in v0.2.4, move 26); display names are global and attendance is not paginated.
