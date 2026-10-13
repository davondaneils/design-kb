# Auth, row-level security and privacy

Facts and claim ids from `kb/research/data/06-auth-rls-privacy.md` (rechecked 2026-10-13). Opinion is marked "Opinion". Not legal advice; for regulated data (health, kids, finance) get a lawyer.

## Fundamentals (non-negotiable)
1. RLS enabled on every table in an exposed schema, in the migration that creates it, with grants revoked and granted back per role, and one policy per operation. [judged]; Supabase Advisors 0013, 0008.
2. UPDATE policies have both `using` and `with check`. [judged]
3. No authorization on user-editable metadata or client-supplied flags. [judged]; Advisor 0015.
4. No secret, service role or admin key in client code, public env vars or mobile bundles. [judged]
5. Every route that takes an object id scopes the lookup by the caller's tenant or user. [judged]
6. A two-user, two-org cross-tenant test passes before launch, kept as a test file. [judged]
7. Personal data is minimized, has an export and a deletion path, and is never logged with secrets. [judged]

## Principles
1. **Buy authentication; own authorization.** Passwords, MFA, OAuth, magic links, session rotation and breach-list checks are solved problems with sharp edges. Use a provider (Supabase Auth, Clerk, WorkOS, Auth0, Firebase Auth, Better Auth or Auth.js). What the provider cannot know is who may see which rows; that is yours, and it lives as close to the data as possible.
2. **Default deny.** A new table is unreadable until a policy says otherwise. A forgotten policy should mean an empty screen, not a leak.
3. **The browser is hostile territory.** Anything shipped to the client (keys, flags, hidden fields, JWT claims) can be read and changed. The server or the database decides.
4. **Collect less, keep less.** Data you never stored cannot leak, needs no consent and no deletion pipeline (GDPR Art. 25: only data necessary for each purpose, by default).

## Authentication rules (when you must touch them)
- Passwords: minimum 15 characters if the password is the only factor, minimum 8 if used with MFA; allow at least 64; no composition rules; check against a breached or common password list; no forced periodic rotation (NIST SP 800-63B rev 4, 2025).
- Hashing (if you ever store passwords yourself): Argon2id with at least 19 MiB memory, 2 iterations, parallelism 1; bcrypt only for legacy with cost at least 10 and a 72-byte input limit (OWASP Password Storage).
- Sessions in cookies: `__Host-` prefix, `Secure`, `HttpOnly`, `SameSite=Lax` (or Strict), `Path=/`; regenerate the session id on login and privilege change; invalidate server side on logout (OWASP Session Management).
- Offer passkeys and OAuth (Google, Apple) where the provider supports them; magic links are fine for low-risk apps. Opinion.

## Authorization: the layer cake
1. **Database RLS** (Supabase, any Postgres): rows filtered for every query, including ones you forgot about. Required whenever the client talks to the database directly.
2. **Server check** on every route that takes an object id (OWASP API1, BOLA): load the row with `where id = $1 and org_id = $caller_org`, never `where id = $1` then compare.
3. **UI hiding** of buttons: cosmetic only.
If you have a server and RLS, do both (defense in depth). Opinion.

## RLS rules (Postgres and Supabase)
Fundamentals (each is a gate):
- `alter table x enable row level security;` on every table in an exposed schema, in the same migration that creates the table.
- Set grants as well as policies: `revoke all on table x from anon, authenticated;` then grant back only what each role needs (many Supabase projects still grant every operation to `anon` and `authenticated` by default, and "Adding policies doesn't remove them"; Supabase RLS docs, checked 2026-10-13; check your project's defaults rather than assuming). Grants decide whether an operation runs at all; policies decide which rows.
- One policy per operation (`select`, `insert`, `update`, `delete`) rather than `for all` (Supabase docs).
- UPDATE needs both `using` (which rows you may touch) and `with check` (what the row may become). Missing `with check` lets a user move a row into another tenant.
- INSERT uses `with check`, never trusts a client-supplied `org_id` without checking membership.
- Never authorize on `user_metadata` (user-editable). Roles come from your tables or `app_metadata`; `app_metadata` reaches policies through the JWT, which "is not always up-to-date" until refresh (Supabase RLS docs), so revocations that must bite at once read your tables.
- The secret / service role key bypasses RLS: server only, never in client code, env vars prefixed `NEXT_PUBLIC_` or `VITE_`, or mobile bundles. New `sb_secret_` keys are refused from browsers (Supabase docs).
- Views bypass RLS unless created `with (security_invoker = true)` (PG 15+).
- Security definer functions: in a non-exposed schema, `set search_path = ''`, and they must check permissions themselves.
- Revoke `execute` from `anon` and `authenticated` on any function that can reach the network or secrets (third-party pentest roundup; SSRF via the http extension).
- Self-managed Postgres: the app role must not own the tables (owners bypass RLS unless `force row level security`) and must not have `BYPASSRLS`.

Performance (Supabase measurements):
- Wrap auth calls: `using ((select auth.uid()) = user_id)` not `using (auth.uid() = user_id)`. 179 ms to 9 ms.
- Index every column a policy filters on. 171 ms to under 0.1 ms.
- Put membership lookups in a `security definer` function that returns the caller's org ids, and call it wrapped: `org_id = any (array(select private.my_org_ids()))`. Tests went from 173,000 ms to 16 ms.
- Add `to authenticated` so anonymous requests skip evaluation.
- Also filter in the client query (`.eq('org_id', orgId)`); the planner uses it. 171 ms to 9 ms.

Canonical org-scoped policy set:
```sql
create schema if not exists private;

create or replace function private.my_org_ids()
returns setof uuid language sql stable security definer set search_path = '' as $$
  select org_id from public.memberships where user_id = (select auth.uid())
$$;
revoke all on function private.my_org_ids() from public, anon;
grant usage on schema private to authenticated;                    -- added 2026-10-13, as in Supabase's own example
grant execute on function private.my_org_ids() to authenticated;   -- needed so policies can call it

create or replace function private.my_admin_org_ids()               -- orgs where the caller is owner or admin
returns setof uuid language sql stable security definer set search_path = '' as $$
  select org_id from public.memberships
  where user_id = (select auth.uid()) and role in ('owner','admin')
$$;
revoke all on function private.my_admin_org_ids() from public, anon;
grant execute on function private.my_admin_org_ids() to authenticated;

alter table projects enable row level security;
revoke all on table projects from anon, authenticated;
grant select, insert, update, delete on table projects to authenticated;

create policy "members read projects" on projects for select to authenticated
  using (org_id = any (array(select private.my_org_ids())));

create policy "members create projects" on projects for insert to authenticated
  with check (org_id = any (array(select private.my_org_ids())));

create policy "members update projects" on projects for update to authenticated
  using (org_id = any (array(select private.my_org_ids())))
  with check (org_id = any (array(select private.my_org_ids())));

create policy "admins delete projects" on projects for delete to authenticated
  using (org_id = any (array(select private.my_admin_org_ids())));

create index on projects (org_id);
```
Role checks go through a helper too. A policy that reads `memberships` directly runs as the caller, so it sees only the membership rows that `memberships`' own grants and policies allow: with that table locked down as this page requires, an owner's delete matches zero rows and reports success (measured on PostgreSQL 16.15, 2026-10-13, critic second pass). The `private` schema must not be in the API's exposed schemas list. The helper skips RLS on `memberships` only because its owner can (on Supabase the owner is `postgres`, which has `bypassrls`); a helper owned by a role without it, or reading a table with `force row level security`, re-evaluates the policy and recurses (Supabase RLS docs, 2026-10-13).

Self-hosted Postgres with your own server: same policies, with tenant context from `nullif(current_setting('app.current_org', true), '')::uuid` set per transaction via `set local` or `set_config(..., true)` so pooled connections never carry one tenant's context into the next request (AWS guidance plus PostgreSQL docs). The `nullif` is not decoration: once any transaction on a connection has set the parameter, `current_setting(..., true)` returns an empty string (not null) on later transactions, and `''::uuid` raises "invalid input syntax for type uuid" (measured on PostgreSQL 16.15, 2026-10-13). With `nullif` an unset tenant gives null and the policy returns no rows.

Testing RLS (non-negotiable before launch): with two test users in two orgs, try as user B to select, insert into, update into, and delete user A's rows through the public API with the publishable key. Each must fail or return empty. Keep it as a pgTAP file per table under `supabase/tests/`, run by `supabase test db`, asserting allow and deny for `anon` and `authenticated` on all four operations; a read test must check returned rows, because "lives_ok passes on an empty result", and an allowed write is proved by reading the row back, because `lives_ok` "passes when the write matched zero rows" (Supabase RLS docs, 2026-10-13).

Automated gate check (lint ids confirmed 2026-10-13): run the Supabase Advisors (Studio Security and Performance Advisor, `supabase db advisors` in the CLI, `get_advisors` over MCP, or the Management API). Relevant lints: 0013 RLS disabled in public, 0023 sensitive columns exposed (ERROR: RLS off on a table with columns named like `password`, `token`, `api_key`), 0008 RLS enabled with no policy, 0015 RLS references user metadata, 0024 permissive RLS policy, 0010 security definer view, 0011 function search path mutable, 0028 and 0029 security definer function executable by anon or authenticated, 0025 public bucket allows listing, 0004 no primary key, 0001 unindexed foreign keys, 0003 auth RLS initplan (the unwrapped `auth.uid()`), 0006 multiple permissive policies. The list runs 0001 to 0030 on 2026-10-13 (0030 autovacuum disabled). Run it against the linked project as well as locally, because production drifts from the migrations: CLI versions before the fix for supabase/cli issue 5868 (closed 2026-07-16) gave `db advisors --local` "a false all-clear for the entire class of API-exposure lints" such as `rls_disabled_in_public`, so update the CLI. Outside Supabase: `select tablename from pg_tables where schemaname = 'public' and not rowsecurity;` must return nothing.

## Firebase rules equivalents
- Never `allow read, write: if true` or only `request.auth != null` (Firebase insecure rules docs).
- Owner check: `allow read, delete: if request.auth.uid == resource.data.owner_id;` `allow create: if request.auth.uid == request.resource.data.owner_id;` `allow update: if request.auth.uid == resource.data.owner_id && request.resource.data.owner_id == resource.data.owner_id;`
- Validate shape and types in rules (`request.resource.data.title is string && request.resource.data.title.size() <= 200`).

## Privacy by design (GDPR baseline; good practice everywhere)
- **Minimize:** for every personal field, write the purpose next to it in the migration comment. No purpose, no column (Art. 25). Birthday for age gating becomes `is_over_18 boolean`.
- **Separate:** keep personal data in a small set of tables (`profiles`, `contacts`) so export and erasure touch few places. Reference people by id elsewhere.
- **Retention:** set a period per data class and a scheduled job that enforces it (logs 30 to 90 days, audit 1 to 7 years depending on obligations; numbers are opinion, decide with counsel).
- **Rights:** build "download my data" and "delete my account" before launch. Export in "a structured, commonly used and machine-readable format" (GDPR Art. 20; JSON or CSV). Respond to requests "without undue delay and in any event within one month", extendable by two further months for complex or numerous requests, telling the person within the first month (Art. 12(3)).
- **Erasure:** delete or irreversibly anonymize personal data "without undue delay" (Art. 17), except records you must keep by law (invoices) or for legal claims. Also delete from the auth provider, storage buckets, email tool, analytics and Stripe customer (or redact), and note that backups age out on their normal schedule.
- **Security of processing:** encryption in transit and at rest (default on major hosts), least-privilege roles, tested restores, and regular review (Art. 32). Personal data breach: notify the supervisory authority without undue delay and, where feasible, within 72 hours of becoming aware, unless the breach is unlikely to result in a risk to people (Art. 33). Keep an incident runbook so the clock does not start with a search for who owns it. Watch: the Commission's Digital Omnibus proposal (November 2025) would move this to 96 hours and change other GDPR articles; on 2026-10-13 it is still before Parliament and Council, so 72 hours stands.
- **Sensitive data:** never store card numbers (use Stripe), government IDs or health data unless the product requires it; if you must, encrypt the column at the app layer and restrict access.
- **Logs:** no passwords, tokens, full card data or full request bodies in logs. Mask emails where possible.

## Worked example: Supabase app where users share projects with teammates
1. Schema: orgs, memberships, projects (org_id), tasks (org_id duplicated from project for cheap RLS, kept consistent by a composite FK `(project_id, org_id) references projects(id, org_id)` with a unique constraint on `projects(id, org_id)`).
2. Enable RLS on all four; policies as above; `private.my_org_ids()`.
3. Index `memberships(user_id)`, `projects(org_id)`, `tasks(org_id, project_id)`.
4. Client uses the publishable key only; admin tasks (Stripe sync, invites email) run in an Edge Function or server with the secret key.
5. Two-user cross-tenant test passes; Security Advisor clean.
The composite FK is the expert move: denormalizing `org_id` onto children makes policies a single indexed comparison, and the composite FK makes the copy impossible to get wrong.

## Worked example: "Delete my account"
Flow: re-authenticate, show what will be deleted and what is kept (invoices kept for tax law), require typing the account email, then a server job: cancel Stripe subscription, transfer or delete orgs where the user is the last owner (block until resolved), delete memberships, delete profile and storage files, delete the auth user, write an audit event without personal data, send a confirmation email. Copy and confirmation UX: design-copy and design-ux.

## Where this domain is usually wrong
- **"RLS on means safe."** RLS with a `to anon using (true)` policy, or without revoked grants, still exposes rows; test allow and deny per role (Supabase).
- **"Logged in means allowed."** BOLA is OWASP API risk number 1.
- **"Hide the button and it is secure."** UI hiding is cosmetic; the policy enforces. The UI should read capability flags computed by the same function (`07-data-shapes-the-ui.md`).
- **"Passwords need symbols and a 90-day change."** NIST SP 800-63B rev 4 forbids composition rules and periodic changes; minimum 15 characters single-factor.
- **"GDPR breach notice is now 96 hours."** Only proposed (Digital Omnibus, not adopted on 2026-10-13); 72 hours applies.

## Hand-offs
- Not-permitted states and disabled actions with reasons on screen: `07-data-shapes-the-ui.md`, design-product-ui `references/05-states-bulk.md`.
- Login, signup, MFA and recovery screens: design-ux and design-copy. Cookie consent and privacy page wording: design-copy (legal review required).

## Sources
- NIST SP 800-63B rev 4: https://pages.nist.gov/800-63-4/sp800-63b.html (accessed 2026-10-13)
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html (accessed 2026-10-09)
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html (accessed 2026-10-09)
- Supabase, Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security (accessed 2026-10-13)
- pgTAP documentation (`lives_ok` asserts only that no exception was raised): https://pgtap.org/documentation.html (accessed 2026-10-13)
- Supabase, RLS performance and best practices: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv (accessed 2026-10-13)
- Supabase, Performance and Security Advisors: https://supabase.com/docs/guides/database/database-advisors (accessed 2026-10-13)
- Supabase, Advisors (observability; CLI command): https://supabase.com/docs/guides/observability/advisors (accessed 2026-10-13)
- supabase/cli issue 5868 (db advisors --local missed API-exposure lints; closed as completed 2026-07-16): https://github.com/supabase/cli/issues/5868 (accessed 2026-10-13)
- Supabase, API keys: https://supabase.com/docs/guides/api/api-keys (accessed 2026-10-13)
- Supabase, Storage access control: https://supabase.com/docs/guides/storage/security/access-control (accessed 2026-10-09)
- AWS, RLS recommendations: https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/rls.html (accessed 2026-10-09)
- Firebase, Insecure rules: https://firebase.google.com/docs/rules/insecure-rules (accessed 2026-10-09)
- Simon Willison on Firebase: https://simonwillison.net/2024/Mar/18/firebase (accessed 2026-10-09)
- CVE-2025-48757 write-up (Pluto Security): https://blog.pluto.security/p/cve-202548757-what-happened-why-it-b22 (accessed 2026-10-09)
- Supabase security discussion 38690 (third party): https://github.com/orgs/supabase/discussions/38690 (accessed 2026-10-09)
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/ (accessed 2026-10-09)
- GDPR Art. 12: https://gdpr-info.eu/art-12-gdpr/ (accessed 2026-10-13)
- GDPR Art. 17: https://gdpr-info.eu/art-17-gdpr/ (accessed 2026-10-13)
- GDPR Art. 20: https://gdpr-info.eu/art-20-gdpr/ (accessed 2026-10-13)
- GDPR Art. 25: https://gdpr-info.eu/art-25-gdpr/ (accessed 2026-10-13)
- GDPR Art. 32: https://gdpr-info.eu/art-32-gdpr/ (accessed 2026-10-13)
- GDPR Art. 33: https://gdpr-info.eu/art-33-gdpr/ (accessed 2026-10-13)
- European Parliament OEIL, Digital Omnibus procedure summary (96-hour proposal): https://oeil.europarl.europa.eu/oeil/en/procedure-document-summary/pdf?id=1866785 (accessed 2026-10-13)
- European Commission, Digital Rulebook (omnibus status): https://digital-strategy.ec.europa.eu/en/policies/digital-rulebook (accessed 2026-10-13)
