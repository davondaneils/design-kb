# Research: Common app data models

Status key: C = consensus, P = practitioner opinion, O = one expert's opinion, Q = contested.

## Findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Do not expose the auth schema; create `public.profiles` whose `id` references `auth.users` with cascading delete, populated by a trigger on signup. "If the trigger fails, it could block signups." | Supabase docs, managing user data | C (vendor) |
| 2 | Users can edit `raw_user_meta_data`; never authorize on it. Put authorization data in `raw_app_meta_data` or your own tables. JWT claims can be stale until refresh. | Supabase RLS docs | C (vendor) |
| 3 | B2B: organizations are first-class; users join through memberships carrying a role; a user can belong to zero, one or many orgs; create business data inside the org so "the data remains with the organization and not the user". | WorkOS, Model your B2B SaaS with organizations | P (vendor practitioner) |
| 4 | Makerkit model: personal and team accounts; `accounts_memberships` unique (user, account); roles with numeric hierarchy; permissions named `resource.action`; `billing_customers` per account; RLS helper functions (has_role_on_account, has_permission); RLS on every table. | Makerkit docs, database architecture | P (popular SaaS starter) |
| 5 | Stripe "split brain": 258+ event types, unordered, partial payloads. Keep one function that re-fetches the customer's current state from Stripe and call it from every relevant webhook and from the success page; map user to Stripe customer before checkout; set metadata.userId; enable "limit customers to one subscription". | Theo Browne, t3dotgg/stripe-recommendations | P (widely shared on X) |
| 6 | Stripe statuses: trialing and active grant access; incomplete has 23 h to pay; incomplete_expired and canceled are terminal; past_due outcome depends on settings; unpaid means revoke. Delayed methods (ACH) can go active and fail later. Stripe suggests using active entitlements for feature access. | Stripe docs, how subscriptions work | C |
| 7 | Webhooks can be delivered more than once and out of order; log processed event IDs; live retries for up to 3 days. | Stripe docs, webhooks | C |
| 8 | Soft delete via deleted_at leaks into every query, defeats foreign keys, and complicates purge; the author never saw undelete used in about ten years at three companies; alternative is a `deleted_record` table storing the row as jsonb. | Brandur Leach, Soft deletion probably isn't worth it | O (respected practitioner) |
| 9 | A partial unique index such as `UNIQUE (email) WHERE deleted_at IS NULL` keeps uniqueness when soft delete is kept. | PostgreSQL CREATE INDEX docs (example) | C |
| 10 | Idempotency keys stored per (user_id, key) with request params, response and recovery point; recycle after about 24 h. | Brandur Leach, idempotency keys | O |
| 11 | Random tokens: generate with a CSPRNG; at least 128 bits for self-generated IDs. | OWASP Session Management Cheat Sheet | C |

## Conflicting views
- Soft delete: Rails and Laravel ecosystems often default to deleted_at. Brandur argues against. Q. Rule chosen for the skill: deleted_at only for a user-facing trash with a purge job; otherwise hard delete plus a deleted_record archive.
- Local Stripe state: Theo caches a projection in KV; Stripe recommends entitlements. Both agree Stripe is the source of truth and your database is a cache.

## Sources
- Supabase, Managing user data: https://supabase.com/docs/guides/auth/managing-user-data
- Supabase, Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- WorkOS, Model your B2B SaaS with organizations: https://workos.com/blog/model-your-b2b-saas-with-organizations
- Makerkit, Database architecture: https://makerkit.dev/docs/next-supabase-turbo/development/database-architecture
- Theo Browne, Stripe recommendations: https://github.com/t3dotgg/stripe-recommendations
- Stripe, How subscriptions work: https://docs.stripe.com/billing/subscriptions/overview
- Stripe, Webhooks: https://docs.stripe.com/webhooks
- Brandur Leach, Soft deletion: https://brandur.org/soft-deletion
- Brandur Leach, Idempotency keys: https://brandur.org/idempotency-keys
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
