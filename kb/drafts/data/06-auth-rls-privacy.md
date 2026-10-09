# Auth, row-level security and privacy

Facts from `kb/research/data/06-auth-rls-privacy.md`. Opinion is marked "Opinion". Not legal advice; for regulated data (health, kids, finance) get a lawyer.

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
- One policy per operation (`select`, `insert`, `update`, `delete`) rather than `for all` (Supabase docs).
- UPDATE needs both `using` (which rows you may touch) and `with check` (what the row may become). Missing `with check` lets a user move a row into another tenant.
- INSERT uses `with check`, never trusts a client-supplied `org_id` without checking membership.
- Never authorize on `user_metadata` (user-editable). Roles come from your tables or `app_metadata`.
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
grant execute on function private.my_org_ids() to authenticated;   -- needed so policies can call it

alter table projects enable row level security;

create policy "members read projects" on projects for select to authenticated
  using (org_id = any (array(select private.my_org_ids())));

create policy "members create projects" on projects for insert to authenticated
  with check (org_id = any (array(select private.my_org_ids())));

create policy "members update projects" on projects for update to authenticated
  using (org_id = any (array(select private.my_org_ids())))
  with check (org_id = any (array(select private.my_org_ids())));

create policy "admins delete projects" on projects for delete to authenticated
  using (exists (
    select 1 from memberships m
    where m.org_id = projects.org_id and m.user_id = (select auth.uid()) and m.role in ('owner','admin')
  ));

create index on projects (org_id);
```
The `private` schema must not be in the API's exposed schemas list.

Self-hosted Postgres with your own server: same policies, with tenant context from `current_setting('app.current_org', true)::uuid` set per transaction via `set local` or `set_config(..., true)` so pooled connections never carry one tenant's context into the next request (AWS guidance plus PostgreSQL docs).

Testing RLS (non-negotiable before launch): with two test users in two orgs, try as user B to select, insert into, update into, and delete user A's rows through the public API with the publishable key. Each must fail or return empty. Opinion on the process; the incidents above show why.

Automated gate check: run the Supabase Advisors (Studio, or `supabase db advisors` in the CLI). Relevant lints: 0013 RLS disabled in public, 0008 RLS enabled with no policy, 0015 RLS references user metadata, 0010 security definer view, 0011 function search path mutable, 0028 and 0029 security definer function executable by anon or authenticated, 0001 unindexed foreign keys, 0003 auth RLS initplan (the unwrapped `auth.uid()`), 0006 multiple permissive policies (Supabase database advisors docs). Outside Supabase: `select tablename from pg_tables where schemaname = 'public' and not rowsecurity;` must return nothing.

## Firebase rules equivalents
- Never `allow read, write: if true` or only `request.auth != null` (Firebase insecure rules docs).
- Owner check: `allow read, delete: if request.auth.uid == resource.data.owner_id;` `allow create: if request.auth.uid == request.resource.data.owner_id;` `allow update: if request.auth.uid == resource.data.owner_id && request.resource.data.owner_id == resource.data.owner_id;`
- Validate shape and types in rules (`request.resource.data.title is string && request.resource.data.title.size() <= 200`).

## Privacy by design (GDPR baseline; good practice everywhere)
- **Minimize:** for every personal field, write the purpose next to it in the migration comment. No purpose, no column (Art. 25). Birthday for age gating becomes `is_over_18 boolean`.
- **Separate:** keep personal data in a small set of tables (`profiles`, `contacts`) so export and erasure touch few places. Reference people by id elsewhere.
- **Retention:** set a period per data class and a scheduled job that enforces it (logs 30 to 90 days, audit 1 to 7 years depending on obligations; numbers are opinion, decide with counsel).
- **Rights:** build "download my data" (JSON export of the person's rows) and "delete my account" before launch. Respond to requests within one month (GDPR Art. 12(3), extendable by two months for complex cases).
- **Erasure:** delete or irreversibly anonymize personal data "without undue delay" (Art. 17), except records you must keep by law (invoices) or for legal claims. Also delete from the auth provider, storage buckets, email tool, analytics and Stripe customer (or redact), and note that backups age out on their normal schedule.
- **Security of processing:** encryption in transit and at rest (default on major hosts), least-privilege roles, tested restores, and regular review (Art. 32). Personal data breach: notify the supervisory authority without undue delay and, where feasible, within 72 hours of becoming aware, unless the breach is unlikely to result in a risk to people (Art. 33). Keep an incident runbook so the clock does not start with a search for who owns it.
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

## Hand-offs
- Login, signup, MFA and recovery screens: design-ux and design-copy. Cookie consent and privacy page wording: design-copy (legal review required).
