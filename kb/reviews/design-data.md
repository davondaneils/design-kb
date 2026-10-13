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
