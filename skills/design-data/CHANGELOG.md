# Changelog: design-data

## v0.2.1 (2026-10-13, critic fixes; `kb/reviews/design-data.md`, "v0.2 review")
- Gate fixes in the skill's own SQL: five unindexed foreign keys indexed (03: `invitations.invited_by`, `posts.author_id`, `post_revisions.edited_by`, `slug_redirects.post_id`, `attachments.uploaded_by`; plus `invitations.org_id`, `bookings.class_id`); `orgs.time_zone` added (07 computes "overdue" in it); bookings use a partial unique index so a cancelled member can rebook; the yoga example stores wall time plus zone as truth, as its own rule says.
- Races and lost work: seats lock the org row (an org can have zero or two subscription rows); webhook dedupe is written in the same transaction as the effect (03, 05, SKILL move 15).
- Dated or wrong facts: PostgreSQL 18 NOT NULL `not valid` then `validate` (02, move 14); Stripe `current_period_end` moved to subscription items in 2025-03-31.basil (03, SKILL billing); Advisors run 0001 to 0030; supabase/cli issue 5868 closed 2026-07-16; Supabase default grants hedged to the docs' wording.
- New: `nullif(current_setting(...), '')::uuid` (measured error without it); JWT `app_metadata` staleness (move 19); write tests read rows back; sortable header equals an index and fractional order keys (07, moves 31 and 32); slugs resolve by a full id or a unique short id; example UUIDv7 now dates to the invoice's creation; 05 error example consistent with 409 for `taken`.
- Description: direct-load sentence now matches the other domain references (no keyword trigger list).
- Data-to-screen expert moves are now 20 to 32 (one security move inserted as 19).

## v0.2 (2026-10-13)
- Revived from the archive (`wip/design-data`, v0.1 of 2026-10-09) as a **domain reference**, with the data-to-screen contract as the reason it belongs in design-kb.
- SKILL.md rewritten in the current convention: reference-layer description and header, gate items 14 to 21 (data to screen), state matrix, time and money rules, list rules, expert moves 19 to 29, data-to-screen contract table in the output format, hand-offs to the skills that exist today.
- New `references/01` to `07`. 01 to 06 built from the archived drafts with fundamentals, "Where this domain is usually wrong" and Sources added; 07 (`data-shapes-the-ui`) is new through every stage: brief, research (claims D1 to D37), draft, reference.
- Facts rechecked against primary sources on 2026-10-13. Changes: PostgreSQL 19 is in beta, not released (18.6 current; 14 end of life 2026-11-12); Stripe adds the `paused` status and `active` does not mean every invoice is paid; Entitlements details (summary webhook holds at most 10 entries, list API to reconcile); the IETF Idempotency-Key draft -07 expired on 2026-04-18; RFC 9457 errors now use `pointer` and `detail` with a stable `code`; Supabase RLS recipe now revokes and re-grants table privileges, grants `usage` on the private schema, and tests with pgTAP via `supabase test db`; Advisors list confirmed 0001 to 0029 with 0004, 0023, 0024 and 0025 added to the skill, and `db advisors --local` misses API-exposure lints; Supabase key details (`apikey` header, legacy keys work until deactivated); GDPR Digital Omnibus pending (96-hour breach notice proposed, not adopted). Unchanged: `uuidv7()`, Supabase key names and end-of-2026 deprecation, RLS performance numbers, Stripe idempotency and pagination, Supabase pricing, GDPR article text, NIST 800-63B rev 4.
- Status: drafting. Next: critic, then tester (rendered test brief in `kb/tests/design-data/briefs.md`).

## v0.1 (2026-10-09, archived)
- First version: six drafts and a critic-approved SKILL.md (13 fixes, `kb/reviews/design-data.md`), shipped with no reference files and archived as "engineering, not design".
