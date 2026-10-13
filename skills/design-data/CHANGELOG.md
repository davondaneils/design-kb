# Changelog: design-data

## v0.2 (2026-10-13)
- Revived from the archive (`wip/design-data`, v0.1 of 2026-10-09) as a **domain reference**, with the data-to-screen contract as the reason it belongs in design-kb.
- SKILL.md rewritten in the current convention: reference-layer description and header, gate items 14 to 21 (data to screen), state matrix, time and money rules, list rules, expert moves 19 to 29, data-to-screen contract table in the output format, hand-offs to the skills that exist today.
- New `references/01` to `07`. 01 to 06 built from the archived drafts with fundamentals, "Where this domain is usually wrong" and Sources added; 07 (`data-shapes-the-ui`) is new through every stage: brief, research (claims D1 to D37), draft, reference.
- Facts rechecked against primary sources on 2026-10-13. Changes: PostgreSQL 19 is in beta, not released (18.6 current; 14 end of life 2026-11-12); Stripe adds the `paused` status and `active` does not mean every invoice is paid; Entitlements details (summary webhook holds at most 10 entries, list API to reconcile); the IETF Idempotency-Key draft -07 expired on 2026-04-18; RFC 9457 errors now use `pointer` and `detail` with a stable `code`; Supabase RLS recipe now revokes and re-grants table privileges, grants `usage` on the private schema, and tests with pgTAP via `supabase test db`; Advisors list confirmed 0001 to 0029 with 0004, 0023, 0024 and 0025 added to the skill, and `db advisors --local` misses API-exposure lints; Supabase key details (`apikey` header, legacy keys work until deactivated); GDPR Digital Omnibus pending (96-hour breach notice proposed, not adopted). Unchanged: `uuidv7()`, Supabase key names and end-of-2026 deprecation, RLS performance numbers, Stripe idempotency and pagination, Supabase pricing, GDPR article text, NIST 800-63B rev 4.
- Status: drafting. Next: critic, then tester (rendered test brief in `kb/tests/design-data/briefs.md`).

## v0.1 (2026-10-09, archived)
- First version: six drafts and a critic-approved SKILL.md (13 fixes, `kb/reviews/design-data.md`), shipped with no reference files and archived as "engineering, not design".
