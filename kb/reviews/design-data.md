# Critic review: design-data v0.1 (first pass)

Reviewed: `skills/design-data/SKILL.md`, `kb/drafts/data/01` to `06`, against `kb/research/data/` and the shared foundation contract.

## Verdict: revise (then approved after fixes below were applied; see "Second pass")

## Fundamentals check
- Gate rules are correct against sources (Don't Do This, PostgreSQL constraints and ALTER TABLE docs, Supabase RLS docs, OWASP API Top 10). No fundamentals errors in DDL samples on re-read, with one concurrency bug (fix 1).
- The "Michael Jordan" test: would a senior Postgres or Supabase engineer learn something? Yes on: composite FK to protect a denormalized `org_id`, `not valid` then `validate`, NOT NULL via validated CHECK, wrapped security-definer membership function with measured numbers, sync-not-delta Stripe pattern plus idempotent business effect, partial unique index for pending invites, deleted_records archive. Two missing expert points (fixes 5 and 6).

## Fix list
1. **03-app-data-models, seats example**: "check count(memberships) < quantity inside the transaction" is a race under concurrent invite accepts (two transactions both see 4 of 5). Fix: lock the parent first (`select ... from subscriptions where org_id = $1 for update`) then count, or keep a `seats_used` counter updated under the same lock. Same note on the booking capacity rule in 01 (already says `for update`; keep).
2. **02-indexes-and-migrations, worked example**: the timezone example admits a constant default would be instant, which undercuts the lesson. Fix: backfill a computed value (derived from `profiles.country` or last login IP), so the long form is genuinely needed, and keep the one-line note that a constant default is instant on PG 11+.
3. **SKILL.md section 3**: "404, not 403" is stated as fact; the draft marks it opinion. Fix: mark as common practice/opinion.
4. **SKILL.md and 01**: EXCLUDE with `room_id WITH =` needs the `btree_gist` extension. SKILL.md omits it. Fix: add.
5. **Gap, UUIDv7**: UUIDv7 embeds a millisecond timestamp, so a public UUIDv7 reveals when a row was created. Fix: in 01 and SKILL.md, add "if creation time is sensitive (for example user signup dates in a dating or health app), use UUIDv4 for that table's public id".
6. **Gap, file uploads**: designer-builders store avatars and attachments early and leak them through public buckets. Supabase Storage is RLS on `storage.objects`, default deny, public buckets readable without policies; paths can be scoped by folder with `storage.foldername(name)` (Supabase storage access control docs). Fix: add a "Files" section to 03 and a gate line to SKILL.md: private bucket by default, path prefixed with `org_id` or user id, storage policies mirror table policies, store path and metadata in a table.
7. **Gap, tooling that checks the gate**: Supabase Advisors include lints for unindexed foreign keys (0001), auth RLS initplan (0003, the unwrapped `auth.uid()`), RLS disabled in public (0013), policies referencing user metadata (0015), security definer views (0010) and mutable function search path (0011) (Supabase database advisors docs). Fix: cite these in 06 and SKILL.md as the automated gate check; runnable via `supabase db advisors`.
8. **Gap, environments**: nothing says "never develop against production; separate dev or branch databases; seed data". Fix: add one rule to 02 migrations.
9. **06 research note**: GDPR Art. 12(3) and Art. 33 were flagged as unverified. Verified now against gdpr-info.eu (one month, extendable by two further months; 72 hours "where feasible", exception when unlikely to result in risk). Fix: update research note and add the exception wording in 06.
10. **04-platform-choice**: Litestream named as an example without a source. Fix: mark as an example tool (opinion), not a claim.
11. **05-api-design**: "Retry-After" with 429 is standard (RFC 6585 defines 429 and says the response may include Retry-After). Keep, add source line.
12. **House rules**: grep for U+2014 across all new files (none found at review time). Keep checking on each edit.
13. **Foundation contract**: only touchpoint is stored preferences. `theme` values `light`, `dark`, `system` and a `reduced_motion` boolean are consistent with the contract's light and dark themes and its reduced-motion rule; `system` means follow `prefers-color-scheme`. Add that clarification.

## Contradictions with other skills
- None found. design-frontend owns formatting and caching; design-ux owns flows; this skill only names hand-offs.

## Second pass
All 13 fixes applied to drafts, references and SKILL.md. Verdict: approve for testing.

# v0.2 review (2026-10-13)

Reviewed: `skills/design-data/SKILL.md` v0.2, `references/01` to `07`, `CHANGELOG.md`, against `kb/research/data/01` to `07`, `kb/drafts/data/01` to `07`, `kb/FOUNDATIONS.md` v0.4.4, `CLAUDE.md`, design-director section 4, `tools/lint-truth.mjs`, and the hand-off skills (design-product-ui, design-ux, design-frontend, design-search). The held-out test (`kb/tests/design-data/`) was not read.

## Verdict: revise

Two reasons, either one enough:
1. **Citation spot check failed** (06-R5, below). By protocol the research batch goes back to the researcher.
2. **Fundamentals gate failed on v0.2 as submitted.** The skill's own SQL broke its own gate item 3 five times, and three patterns were races or crashes (seat lock, webhook dedupe order, tenant GUC cast). All gate misses are fixed in this pass (fix list below), so the skill now passes the gate on re-read. The verdict stays revise until the researcher reconciles the notes and a second critic pass confirms the edits.

## Citation spot check (before step 1)
Population: the 60 quote-bearing research rows (01 R1 to R6, 02 R1 to R4, 03 R1 to R3, 04 R1 to R2, 05 R1 to R7, 06 R1 to R8, 07 D1 to D29 and D36; internal rows D30 to D35 and the measured D37 excluded). Sample: 12 (20 percent), `random.seed(20261013); random.sample(pop, 12)` in Python 3.

| Row | Checked | Result |
|---|---|---|
| 02-R1 | Advisors page lists 0001_unindexed_foreign_keys, INFO | Pass |
| 03-R3 | Stripe Entitlements: "contains a maximum of 10 entitlements"; list API "to reconcile state after a webhook delivery failure" | Pass |
| 05-R6 | RFC 9110 13.1.1 "lost update" and "MAY indicate that the conditional request failed by responding with a 412" (rfc9110.txt lines 5810, 5833); RFC 6585 428 sentence | Pass |
| 06-R5 | Advisors list and CLI issue 5868 | **Fail.** The quote appears, but the claim does not hold: the live list runs to **0030** (`0030_autovacuum_disabled`), not 0029; issue 5868 is **closed as completed (fix merged 2026-07-16)**, so "`--local` misses the API-exposure lints" was stale on the day it was written |
| 06-R8 | NIST 800-63B rev 4: 15 single-factor, 8 with MFA, at least 64, no composition rules, no periodic change | Pass |
| 07-D1 | PG datetime docs: "stored internally as UTC, and the originally stated or assumed time zone is not retained" | Pass |
| 07-D7 | MDN NumberFormat: currency default is "the number of minor unit digits provided by the ISO 4217 currency code list" | Pass |
| 07-D10 | Stripe search `total_count` "only accurate up to 10,000. This field isn't included by default." | Pass |
| 07-D16 | RFC 9562 s8: "then UUIDv4 (Section 5.4) SHOULD be utilized"; 48-bit ms timestamp | Pass |
| 07-D21 | PG error codes 23502, 23503, 23505, 23514, 23P01, 40001 | Pass |
| 07-D26 | MDN object-position definition; initial value `50% 50%` | Pass |
| 07-D36 | MDN Date.parse: "The first will imply UTC time because it's date-only" | Pass |

Extra live checks of the riskiest claims (outside the sample): Supabase key prefixes, `apikey` header, 401 by User-Agent, "by the end of 2026", reversible deactivation (pass); Stripe statuses, 23 hours, `paused`, "Revoke access ... when the subscription is `unpaid`" (pass); Stripe ISK and UGX two-decimal quirk (pass); RFC 9457 `errors` items with `detail` and `pointer`, `about:blank`, "SHOULD NOT parse" (pass); IETF Idempotency-Key -07 expired 2026-04-18 (pass); RLS numbers 171, 179, 173,000 to 16, 170 (pass); PostgreSQL 18.6, 19 Beta 4 on 2026-09-24, 14 EOL 2026-11-12 (pass); IANA 2026e Manitoba (pass); Supabase RLS doc wording (pass, but "grants every operation by default" was stronger than the docs' "On projects that still grant ... by default", fixed). New facts the notes miss: PostgreSQL 18 accepts NOT VALID not-null constraints (ALTER TABLE 18.6 docs); Stripe moved `current_period_end` to subscription items in 2025-03-31.basil (Stripe changelog).

## Numbers measured
| Number | Method | Result |
|---|---|---|
| Weekdays 2026-10-09, 10-30, 11-02, 10-13 | Node 22.22.0 `Intl` | Fri, Fri, Mon, Tue: all match 07 |
| `new Date("2026-10-09")` in Toronto | Node, ICU 77.1 | "Thu, Oct 8"; with `timeZone:'UTC'` "Fri, Oct 9": matches |
| "7:40 am ET" from `11:40Z` | Node | "7:40 AM" (EDT): matches after the lowercase pass |
| $4,825, CA$900, $5,725 | `Intl.NumberFormat` with `stripIfInteger`; 482500 + 90000 | match; 125000 + 87500 = 212500, leaving 270000 for the 5 unseen USD rows (plausible) |
| Truth contract 7 = 5 + 2 | arithmetic; attributes checked against `tools/lint-truth.mjs` header | match |
| UUIDv7 in the invoice example | decoded the 48-bit prefix | was 2025-10-11, a year before `sent_at` (2026-09-25); **fixed** to `01a0d912-f0f9-...` = 2026-09-25T14:58:12Z |
| All `sql` blocks in 01, 03, 06, 07 | PostgreSQL 16.15 with shims (`uuidv7()`, `auth.uid()`, roles, `btree_gist`) | all run; RLS cross-tenant select, update-into and insert-into another org are refused |
| Unindexed FKs | catalog query equivalent to lint 0001 (non-partial indexes) | v0.2: **5** (`invitations.invited_by`, `posts.author_id`, `post_revisions.edited_by`, `slug_redirects.post_id`, `attachments.uploaded_by`); after fixes: 0 |
| `current_setting('app.current_org', true)::uuid` after an earlier `set local` | PG 16.15 | returns `''`, cast raises "invalid input syntax for type uuid": **bug, fixed** with `nullif` |
| Rebook after cancel | PG 16.15 | v0.2 `unique (class_id, user_id)` blocks it; fixed partial index allows it |
| Winnipeg 7:00 am on 2026-11-10 | PG 16.15 with pre-2026e tzdata | stored as 13:00Z (UTC-6); under 2026e it is 12:00Z. Demonstrates the wall-clock rule |
| Float order key halvings | Node loop between 1 and 2 | 52 before the midpoint equals a neighbour |
| Em dashes (U+2014) | grep over skill, drafts, research, review | 0 |
| SKILL.md length | `wc -w` | 3,612 words after fixes (was 3,343) |

## Foundation conformance (FOUNDATIONS v0.4.4)
- Tokens in 07: `--color-surface-sunken`, `--radius-md`: both in the color roles and token schema. Pass.
- Content mechanics, en-US: "Due Fri, Oct 9" (UI date), "7:40 am", "2:41 pm", "3:25 pm" (12-hour, space), "$4,825", "CA$900" (the prefixed symbol `Intl` prints), two currencies never summed. Pass. Locale from `lang` and `Intl` for other locales stated. Pass.
- Checklist row 1 (axe alt), row 16 (`truth` contract: `data-num`, `data-sum-of`, `data-derived-from`, `data-monotonic`, `data-source`, `data-source-stopped`, `data-data="none"`) match `tools/lint-truth.mjs` and design-director section 4. Pass.
- Stored preferences: `theme` in `light`, `dark`, `system` and `reduced_motion` boolean. Pass.
- Accessibility: unknown values as a muted dash plus sr-only text (no `aria-label` on a span), error icon plus text, alt stored. Agrees with design-foundations `references/accessibility.md`. Pass.

## Gate findings (v0.2 as submitted)
1. Own SQL broke gate item 3 (every FK indexed) five times in 03; Advisor 0001 would flag each.
2. Seat limit locked `subscriptions where org_id = $1`, which locks nothing when the org has no subscription row and several rows when a canceled one sits beside the live one: the race the move claims to close stays open.
3. Webhook dedupe "insert the event id first; if it conflicts, return 200 and stop" loses events: a crash after recording the id and before the effect makes Stripe's retry a no-op (03, 05, SKILL move 15).
4. Tenant GUC `current_setting(..., true)::uuid` crashes every query on a pooled connection that served an earlier tenant (measured).
5. Bookings `unique (class_id, user_id)` stops a member who cancelled from ever rebooking; the capacity count ignored cancelled rows.
6. 07 computes "overdue" in `orgs.time_zone`, which the 03 `orgs` table did not have.
7. 07 slug rule "resolve by id" over `/posts/how-we-fire-7c1e`: a 4-hex fragment of a UUIDv7 is the creation timestamp, not an id.
8. 01's own worked example stored a future class as an instant only, against its own rule (opinion rule, but the example is what gets copied).
9. Description carried a 17-keyword trigger list ("index", "policy", "delete my account"): a broad trigger for a domain reference (CLAUDE.md structure rule).

## Fix list
| # | File | Change | Status |
|---|---|---|---|
| 1 | 03 (ref and draft) | Indexes on `invitations(org_id)`, `invitations(invited_by)`, `posts(author_id)`, `post_revisions(edited_by)`, `slug_redirects(post_id)`, `attachments(uploaded_by)` | Done |
| 2 | 03, SKILL move 7 | Seats lock `orgs` row, then read the live subscription's quantity | Done |
| 3 | 03, 05, SKILL move 15 | Dedupe row written in the same transaction as the effect or its durable job; why | Done |
| 4 | 06 | `nullif(current_setting('app.current_org', true), '')::uuid`, with the measured error | Done |
| 5 | 01 | Partial unique index for live bookings, `bookings(class_id)` index, `updated_at`, capacity count excludes cancelled; classes store `starts_local`, `ends_local` as truth with derived `starts_at`, `ends_at`; Do and don't row split past vs future | Done |
| 6 | 03 | `orgs.time_zone text not null default 'UTC'` | Done |
| 7 | 07 | Slugs resolve by a full id or a unique `short_id`; why a UUID prefix is not an id | Done |
| 8 | SKILL description | Direct-load sentence now the house wording ("only when the user names it or asks a narrow question inside this domain alone") | Done |
| 9 | 02, SKILL move 14 | PostgreSQL 18 `add constraint ... not null col not valid` then `validate`; CHECK route kept for 17 and older; worked example rewritten; source line updated | Done |
| 10 | 02 | Backfill uses `coalesce(..., 'UTC')`: the join form skipped unmatched rows and made the validate step fail | Done |
| 11 | 02, SKILL move 14 | `create index concurrently` in its own migration file; tools that wrap files in a transaction fail with "cannot run inside a transaction block" | Done |
| 12 | 03, SKILL billing | Stripe 2025-03-31.basil: `current_period_end` and seat `quantity` come from subscription items; source added | Done |
| 13 | SKILL automated checks, section 9, 06 | Advisors list 0001 to 0030; issue 5868 closed 2026-07-16, reason to run against the linked project restated as drift | Done |
| 14 | 06 | Default grants hedged to the docs' wording; allowed writes proved by reading the row back (`lives_ok` passes on zero rows) | Done |
| 15 | 03, 06, SKILL move 19 | `app_metadata` roles are stale until the JWT refreshes; immediate revocation reads tables | Done |
| 16 | 05 | Problem example no longer puts `taken` under 422; 409 for uniqueness, 422 when mixed (opinion) | Done |
| 17 | 07 | Invoice UUIDv7 re-minted to match its creation date | Done |
| 18 | 07, SKILL moves 31 and 32 | New expert material: sortable header equals an index (keyset); manual order as fractional keys (Figma, measured 52 halvings); new rows on a live keyset list (opinion) | Done |
| 19 | SKILL moves 1 and 8 | Marked opinion with their sources | Done |
| 20 | SKILL, CHANGELOG | Version 0.2.1; changelog entry; data-to-screen moves renumbered 20 to 32 | Done |
| 21 | `kb/research/data/06` R5 | Correct "0001 to 0029" to 0030 and record that issue 5868 closed 2026-07-16 (fixed) | **Researcher** |
| 22 | `kb/research/data/` | Add rows for facts now in the skill without a research row: PG 18 NOT VALID not-null (02); Stripe basil period move (03); Supabase "a JWT is not always up-to-date" and "lives_ok ... passes when the write matched zero rows" (06); the `current_setting` measurement (06); Figma fractional indexing quotes as D38 (07); fix the "grants every operation by default" wording in 06 R2 | **Researcher** |
| 23 | 02 | Confirm from Supabase primary sources whether the CLI still wraps each migration file in a transaction (a third-party mirror of the v2.109.0 release notes, 2026-06-30, says `migration up` now handles CONCURRENTLY); then name the Supabase behavior in 02 | **Researcher** |

## Expert-learning test (lines a top practitioner may not already know)
- PostgreSQL 18 takes NOT VALID not-null constraints, so the four-step CHECK dance is two steps (02, move 14).
- `current_setting(name, true)` returns `''`, not null, once any transaction on that connection set it; `::uuid` then crashes (06, measured).
- Stripe sends ISK and UGX as two-decimal integers ending in 00 while ISO 4217 and `Intl` say zero decimals (07).
- Stripe moved `current_period_end` to subscription items in 2025-03-31.basil (03).
- pgTAP `lives_ok` passes on an empty read and on a zero-row write (06).
- A security definer helper skips RLS only because its owner has `bypassrls` (06).
- `org_id = any (array(select private.my_org_ids()))`: 173,000 ms to 16 ms (move 13).
- Dedupe row in the same transaction as the effect, or the event is lost (move 15).
- Stripe search `total_count` is opt-in and accurate only to 10,000 (move 23).
- A sortable header is an index; manual order is a fraction (moves 31, 32).
- tz 2026e moved Manitoba's rule with a month's notice, so future events store wall time plus zone (07).
- `new Date("2026-10-09")` prints "Thu, Oct 8" in Toronto (move 30).
The list is long enough to clear the expert bar. The data-to-screen material (07) is the strongest part and is new to this knowledge base.

## Gaps left for the domain specialist (not fixed here)
- Offline and mobile: design-playbook-mobile loads 07 for "offline retries", but 07 has no rule for a queued write that meets a 412 or 409 on reconnect, or for ordering a queue of dependent writes (create, then edit). Needs a short section.
- Realtime: Supabase Realtime Postgres Changes and RLS, and what a live panel shows while a subscription reconnects (it is the "Refreshing" or "Stale" row, but the data condition is not named).
- SKILL.md grew to 3,612 words. Opinion: move the Advisors id list to 06 and keep one line in the gate.

## Contradictions with other skills
None found. design-product-ui owns state visuals and sortable header markup; design-ux owns optimistic and undo timing (07 cites both with the same numbers: 5 s undo, optimistic only for reversible actions); design-frontend owns `Intl` and images; design-search owns 301s. `dataviz` is an external skill also named by design-product-ui.
