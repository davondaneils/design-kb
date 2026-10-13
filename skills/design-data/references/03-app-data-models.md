# Common app data models

Facts and claim ids from `kb/research/data/03-app-data-models.md` (Stripe facts rechecked 2026-10-13). Opinion is marked "Opinion". SQL is PostgreSQL 18 (Supabase-compatible; on older versions replace `uuidv7()` with `gen_random_uuid()`).

## Fundamentals (non-negotiable)
1. The auth provider's user table is never extended or exposed; product data about a person lives in `profiles` keyed by the auth id. [judged]
2. Anything that may be shared or sold to teams is owned by `org_id` from day one, indexed, on every business row. [judged]
3. Roles live in your tables or `app_metadata`, never in user-editable metadata. [judged]
4. Billing state is a cache of the provider, written only by the server from one sync function; webhook events are deduped and never applied as deltas. [judged]
5. Limits that count rows (seats, capacity) are checked after locking the parent row in the same transaction. [judged]
6. Files live in object storage, private by default, paths prefixed by the owner key, policies mirroring the tables. [judged]
7. Deletion is designed per table (hard delete, trash with purge, or never delete), and the audit log is append-only. [judged]

## Principles
1. **Identity is not a profile.** The auth provider owns credentials and sessions. Your `profiles` table owns everything the product knows about a person. Never write to or expose the provider's user table directly (Supabase docs).
2. **In B2B, data belongs to the organization, not the user.** People leave companies; the projects stay. Make `org_id` the owner of business rows from day one, even when every org has one member (WorkOS). Retrofitting tenancy later touches every table, query and policy.
3. **Payments state lives at the provider; your database holds a cache.** Stripe is the source of truth. Your tables are a projection refreshed by one sync function (Theo Browne, practitioner; Stripe docs on unordered, duplicated webhooks).
4. **Deletion is a feature you design, not a column you add.** Decide per table: hard delete, archive, or trash with a purge date.

## Users, auth and profiles
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,  -- same id as the auth user
  display_name text not null default '',
  avatar_url text,
  theme text not null default 'system' check (theme in ('light','dark','system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
Rules:
- Create the profile with a trigger on auth signup or lazily on first request. A failing trigger blocks signups (Supabase docs), so keep it tiny and tested.
- Never authorize on `user_metadata` / `raw_user_meta_data`; users can edit it (Supabase RLS docs). Roles live in your own tables (below) or in `app_metadata`. `app_metadata` rides inside the JWT, and "a JWT is not always up-to-date" (Supabase RLS docs): a demoted admin keeps the claim until the token refreshes. When a revocation must take effect at once (removing a member, demoting an owner), policies read the role from your tables, not from the token.
- Email: let the auth provider own it. If you copy it, keep it in sync from auth events and treat the provider as truth.
- Outside Supabase, the same shape applies: a `users` table owned by your auth library (Auth.js, Better Auth, Clerk, WorkOS) plus your `profiles`.

## Organizations, memberships, roles, invitations (multi-tenant B2B)
```sql
create table orgs (
  id uuid primary key default uuidv7(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,48}$'),
  time_zone text not null default 'UTC',   -- IANA name; "today", "overdue" and week boundaries are computed in it (07)
  created_at timestamptz not null default now()
);

create table memberships (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index on memberships (user_id);   -- "which orgs am I in", and RLS lookups

create table invitations (
  id uuid primary key default uuidv7(),
  org_id uuid not null references orgs(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','member','viewer')),
  token_hash text not null unique,       -- store a hash; email the raw token once
  invited_by uuid references profiles(id) on delete set null,
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index on invitations (org_id, lower(email)) where accepted_at is null;
create index on invitations (org_id);       -- FK index; the partial index above skips accepted rows
create index on invitations (invited_by);   -- FK index (Advisor 0001)
```
Re-inviting the same email updates the pending row (new token hash, new `expires_at`) instead of inserting, so an expired invite never blocks a fresh one.
Every business table then carries `org_id uuid not null references orgs(id)` plus an index starting with `org_id`.

Decision rules:
- **B2C with no sharing:** rows owned by `user_id`. **Any chance of sharing, teams, or selling to companies:** org-owned rows, and create a personal org at signup so the code path is the same for solo users (Makerkit uses personal plus team accounts; opinion: one code path beats two).
- **Roles:** start with a fixed `role` text column and a CHECK. Move to `roles` and `role_permissions` tables (permission names like `billing.manage`, Makerkit convention) only when customers need custom roles.
- **Last owner rule:** enforce "an org always has at least one owner" in the function that changes roles or removes members, inside a transaction.
- **Invite tokens:** at least 128 random bits from a CSPRNG (OWASP), stored hashed (sha256 is fine for high-entropy tokens), single use, expiry 7 days (opinion), bound to the invited email.
- **Tenancy model:** pool (shared tables plus `org_id` plus RLS) is the default for indie and early SaaS. Silo (database per tenant) only for contractual isolation or data residency (AWS multi-tenant guidance lists the trade-offs; the default here is opinion).

## Billing (Stripe)
```sql
create table billing_customers (
  org_id uuid primary key references orgs(id) on delete cascade,
  stripe_customer_id text not null unique
);

create table subscriptions (
  id text primary key,                           -- Stripe subscription id, sub_...
  org_id uuid not null references orgs(id) on delete cascade,
  status text not null,                          -- mirror Stripe's values exactly
  price_id text not null,                        -- from the subscription item, not the subscription
  quantity integer not null default 1,           -- seats: the seat item's quantity
  current_period_end timestamptz,                -- from items.data[].current_period_end (moved off the subscription in API 2025-03-31.basil)
  cancel_at_period_end boolean not null default false,
  synced_at timestamptz not null default now()
);
create index on subscriptions (org_id);

create table stripe_events (                    -- dedupe log
  id text primary key,                           -- evt_...
  type text not null,
  received_at timestamptz not null default now()
);
```
Rules:
- **Create the Stripe customer before checkout** and store the mapping; put your `org_id` in Stripe `metadata` (Theo Browne, practitioner).
- **One sync function.** On any relevant webhook, and on the checkout success page, call `syncStripe(customerId)`: fetch current subscriptions from the Stripe API and upsert your rows. Do not apply event payloads as deltas: Stripe does not guarantee order and may deliver duplicates (Stripe webhooks docs). This removes a whole class of "user paid but app says free" bugs.
- **Dedupe without losing events:** insert the event id into `stripe_events` in the same transaction as the work it triggers (or as the durable job that will do it). If the insert conflicts, return 200 and stop. Never record the id first and do the work after a commit: a crash in between marks the event done, Stripe's retry is skipped, and the effect is lost. With the sync function the re-fetch is already safe to repeat; the dedupe row matters for one-off effects (emails, credit grants).
- **Access rule:** grant paid features when status is `active` or `trialing`. Treat `past_due` as a grace period you choose (show a banner, keep access for N days); your Stripe settings decide whether it later moves to `canceled`, `unpaid` or stays `past_due`. Revoke on `unpaid` (Stripe: "Revoke access to your product when the subscription is `unpaid`"), `canceled`, `incomplete_expired`. `incomplete` has 23 hours to complete payment. `paused` means a trial ended without a payment method under the `pause` setting: no access until resumed. `active` does not mean every invoice is paid (Stripe subscription docs, checked 2026-10-13).
- **Or gate on Entitlements**, the better default when plans bundle features: Stripe creates an active entitlement per feature when a subscription becomes active, fires `entitlements.active_entitlement_summary.updated` on every change (its list holds at most 10 entries; fetch `entitlements.url` for more), and `GET /v1/entitlements/active_entitlements?customer=` reconciles after a missed webhook (Stripe Entitlements docs, checked 2026-10-13). Store the feature lookup keys per org; the API turns them into capability flags for the UI (`07-data-shapes-the-ui.md`).
- **Never compute "is paid" in the browser** from a client-readable flag the user can write. The column is written only by the server (service role) and read through RLS.
- Checkout flow, pricing page and upsells: sales-funnels. Paywall and plan copy: copywriting.

## Content (posts, pages, products)
```sql
create table posts (
  id uuid primary key default uuidv7(),
  org_id uuid not null references orgs(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  body jsonb not null default '{}'::jsonb,       -- rich text editor document
  status text not null default 'draft' check (status in ('draft','scheduled','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, slug),
  check (status <> 'published' or published_at is not null)
);
create index on posts (org_id, status, published_at desc);
create index on posts (author_id);              -- FK index (Advisor 0001)

create table post_revisions (
  id bigint generated always as identity primary key,
  post_id uuid not null references posts(id) on delete cascade,
  body jsonb not null,
  edited_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on post_revisions (post_id, created_at desc);
create index on post_revisions (edited_by);      -- FK index

create table slug_redirects (                  -- old slug keeps working after a rename
  org_id uuid not null references orgs(id) on delete cascade,
  old_slug text not null,
  post_id uuid not null references posts(id) on delete cascade,
  primary key (org_id, old_slug)
);
create index on slug_redirects (post_id);        -- FK index
```
Rules: status as a single CHECKed column (never three booleans); `published_at` drives ordering and scheduling; a cross-column CHECK makes "published with no date" impossible; slug unique per tenant; keep old slugs as 301 redirects (search impact: design-search). Rich text editor output (TipTap, Lexical, Portable Text) is a legitimate jsonb document because it is read and written whole.

## Files (avatars, attachments, exports)
```sql
create table attachments (
  id uuid primary key default uuidv7(),
  org_id uuid not null references orgs(id) on delete cascade,
  uploaded_by uuid references profiles(id) on delete set null,
  storage_path text not null unique,       -- '{org_id}/{attachment_id}/{filename}'
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);
create index on attachments (org_id, created_at desc);
create index on attachments (uploaded_by);       -- FK index
```
Rules:
- Bytes go to object storage (Supabase Storage, S3, R2); the table stores path and metadata. Never store files in a `bytea` column for app uploads (opinion, near universal).
- Private bucket by default. Supabase Storage is RLS on `storage.objects`, default deny for uploads, and public buckets are readable by anyone without policies (Supabase storage access control docs). Only marketing images and truly public avatars go in a public bucket.
- Prefix every path with the owner key (`org_id` or user id) and write storage policies that check the first folder segment, for example `(storage.foldername(name))[1] = any (array(select private.my_org_ids()::text))` (compare as text so a malformed path fails the check instead of raising a cast error). Storage policies mirror the table policies.
- Serve private files through short-lived signed URLs. Delete the object when the row is deleted (a job, since FK cascades do not reach storage).

## Audit log
```sql
create table audit_events (
  id bigint generated always as identity primary key,
  org_id uuid not null,
  actor_id uuid,                       -- null for system
  action text not null,                -- 'member.removed', 'billing.plan_changed'
  target_type text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip inet,
  created_at timestamptz not null default now()
);
create index on audit_events (org_id, created_at desc);
```
Append only: no UPDATE or DELETE grants for app roles. No foreign keys, on purpose, so the history survives deletes. Write it in the same transaction as the action. Never put secrets or full documents in `metadata`. Retention period decided up front (see privacy in `06-auth-rls-privacy.md`).

## Deletion
| Situation | Pattern |
|---|---|
| Default | Hard `delete` with FK cascades designed per relationship; copy the row as jsonb into `deleted_records(table_name, record_id, data, deleted_at)` in the same statement if you want an archive (Brandur Leach, opinion) |
| User-facing trash with restore | `deleted_at timestamptz`, partial unique indexes `where deleted_at is null`, every policy and query filters it, and a scheduled purge (for example 30 days) |
| Legal or financial records (invoices, payouts) | Never delete; restrict FK; anonymize the person instead |
| Account deletion request | Delete or anonymize personal data, keep legally required records, cancel billing, log the request (privacy rules: `06-auth-rls-privacy.md`) |

Why not soft delete everywhere: every query must remember the filter, foreign keys stop protecting you, and purge becomes a dependency puzzle; one practitioner reports never seeing undelete used in a decade (Brandur Leach, Soft deletion probably isn't worth it).

## Worked example: B2B SaaS with teams and per-seat billing
- Tables: profiles, orgs, memberships, invitations, billing_customers, subscriptions, stripe_events, projects (org-owned), audit_events.
- Seats: `subscriptions.quantity` is the paid seat count. Accepting an invite runs in one transaction: `select id from orgs where id = $1 for update` (lock the org, the one row that always exists; an org can have no subscription row, or a canceled one next to the live one), then read the live subscription's `quantity`, count memberships, insert. Two concurrent accepts cannot both see 4 of 5 seats. A plain count without the lock is a race. Over the limit returns 409 with a problem+json body pointing to upgrade (API rules in `05-api-design.md`).
- Removing a member: delete the membership row only; the projects they created stay with the org (`created_by` set null or kept as a dangling id in audit).
- RLS: `projects` readable when the caller has a membership in `projects.org_id` (policy pattern in `06-auth-rls-privacy.md`).

## Where this domain is usually wrong
- **"Add `deleted_at` to every table."** It leaks into every query and policy and breaks foreign keys; one practitioner saw undelete used almost never in a decade (Brandur Leach). Use it only for a real trash.
- **"Handle each Stripe event type."** Events arrive unordered and duplicated (Stripe webhooks); re-fetch state with one sync function.
- **"`past_due` means revoke."** It is a grace state whose outcome you configure; `unpaid` is the revoke signal (Stripe).
- **"Users own the data."** In B2B the organization does; people leave (WorkOS).

## Hand-offs
- What each billing and permission state looks like on screen, and the capability flags the UI reads: `07-data-shapes-the-ui.md`, design-product-ui, design-conversion.
- Invite emails, role labels, destructive confirmations: design-copy and design-ux.
- Pricing tiers and plan design: website-strategy (positioning) and sales-funnels (flow).

## Sources
- Supabase, Managing user data: https://supabase.com/docs/guides/auth/managing-user-data (accessed 2026-10-09)
- Supabase, Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security (accessed 2026-10-13)
- Supabase, Storage access control: https://supabase.com/docs/guides/storage/security/access-control (accessed 2026-10-09)
- WorkOS, Model your B2B SaaS with organizations: https://workos.com/blog/model-your-b2b-saas-with-organizations (accessed 2026-10-09)
- Makerkit, Database architecture: https://makerkit.dev/docs/next-supabase-turbo/development/database-architecture (accessed 2026-10-09)
- Theo Browne, Stripe recommendations: https://github.com/t3dotgg/stripe-recommendations (accessed 2026-10-09)
- Stripe, How subscriptions work: https://docs.stripe.com/billing/subscriptions/overview (accessed 2026-10-13)
- Stripe, Entitlements (API): https://docs.stripe.com/billing/entitlements.md?dashboard-or-api=api (accessed 2026-10-13)
- Stripe, Webhooks: https://docs.stripe.com/webhooks (accessed 2026-10-09)
- Stripe changelog, 2025-03-31.basil ("`current_period_start` and `current_period_end` fields are no longer available on the subscription resource"; now on subscription items): https://docs.stripe.com/changelog/basil/2025-03-31/deprecate-subscription-current-period-start-and-end (accessed 2026-10-13)
- Brandur Leach, Soft deletion probably isn't worth it: https://brandur.org/soft-deletion (accessed 2026-10-09)
- Brandur Leach, Idempotency keys: https://brandur.org/idempotency-keys (accessed 2026-10-09)
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html (accessed 2026-10-09)
- AWS, multi-tenant partitioning models: https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/partitioning-models.html (accessed 2026-10-09)
