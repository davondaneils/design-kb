# Research: Choosing the data platform

Status key: C = consensus, P = practitioner opinion, O = one expert's opinion, Q = contested.

## Findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Relational handles many-to-many with joins; document stores push joins into app code; document locality helps one-to-many trees; the models are converging (JSON in SQL, joins in document stores). | Kleppmann DDIA ch. 2 | C |
| 2 | SQLite suits sites under about 100K hits/day (conservative; shown at 10x); sqlite.org serves 400K to 500K requests/day on a shared VM. One writer at a time; use client/server for many concurrent writers, many machines, or near-terabyte data. | sqlite.org, Appropriate uses | C |
| 3 | Nomad List (Pieter Levels) runs PHP plus SQLite on a single VPS. | nomads.com FAQ | P |
| 4 | Supabase free: 500 MB database per project, 50,000 MAU, 1 GB storage, 2 active projects, paused after 1 week of inactivity, no automatic backups. Pro from $25/mo, daily backups kept 7 days, PITR add-on $100/mo per 7 days. | supabase.com/pricing (checked Oct 2026) | C (fast moving) |
| 5 | Supabase is deprecating legacy anon and service_role keys by end of 2026 in favor of `sb_publishable_` and `sb_secret_` keys; secret keys return 401 from browsers. | Supabase docs, migrating to new API keys | C (fast moving) |
| 6 | Firestore: 1 MiB max document, 20 levels of nesting, avoid monotonically increasing IDs (hotspots), about 500 writes/s with an indexed sequential field, cursors not offsets. | Firebase quotas and best practices | C |
| 7 | Misconfigured Firebase rules exposed about 125M records across about 900 sites (2024), many with plaintext passwords. | Simon Willison, Mar 2024 | C (reported) |
| 8 | Convex: TypeScript backend functions with built-in reactivity; suits TypeScript teams needing live sync. | Convex Stack blog | P (vendor) |
| 9 | Multi-tenant models: silo (database per tenant), bridge (hybrid), pool (shared tables with tenant key plus RLS). Pool wins on cost and agility; silo on isolation and compliance. AWS names no default. | AWS Prescriptive Guidance | C |

## Conflicting views
- "Just use Postgres" for queues, search and vectors vs specialized stores. P. Rule chosen: Postgres first; add a specialized system only on a measured need.
- BaaS speed vs lock-in: leaving Firestore means rewriting queries and rules. P.

## Recent changes
- Supabase key model change (2025 to 2026). Supabase pricing changes often. PG 18. Re-check every 3 months.

## Sources
- SQLite, Appropriate uses: https://www.sqlite.org/whentouse.html
- Nomads FAQ: https://nomads.com/faq/what-is-the-tech-stack-behind-nomadscom-6610937
- Supabase pricing: https://supabase.com/pricing
- Supabase new API keys: https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
- Firestore quotas: https://firebase.google.com/docs/firestore/quotas
- Firestore best practices: https://firebase.google.com/docs/firestore/best-practices
- Simon Willison on Firebase exposure: https://simonwillison.net/2024/Mar/18/firebase
- Convex: https://stack.convex.dev/why-choose-convex-database-for-backend
- AWS, multi-tenant partitioning models: https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/partitioning-models.html
- Kleppmann DDIA ch. 2 summary: https://candost.blog/books/data-models-and-query-languages/

## Re-check 2026-10-13
| # | Fact | Result | Quote | URL |
|---|---|---|---|---|
| R1 | Supabase key names and legacy deprecation | Unchanged: `sb_publishable_...` and `sb_secret_...`; legacy `anon` and `service_role` "deprecating ... by the end of 2026". New detail: the new keys are not JWTs and go on the `apikey` header; secret keys return 401 from browsers (matched on User-Agent); legacy keys stay valid until you deactivate them, and deactivation is reversible. | "Supabase is deprecating the `anon` and `service_role` keys by the end of 2026."; "They return HTTP 401 if used in a browser (matched on the `User-Agent` header)" | https://supabase.com/docs/guides/api/api-keys ; https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys |
| R2 | Supabase Free and Pro limits | Unchanged: Free 500 MB database, 50,000 MAU, 1 GB storage, 2 active projects, paused after 1 week inactive, no automatic backups; Pro from $25/month, 8 GB disk per project, daily backups kept 7 days; PITR $100 per month per 7 days retention. | "Free projects are paused after 1 week of inactivity. Limit of 2 active projects." | https://supabase.com/pricing |
| R3 | PostgreSQL versions | See research 01 R2: 18.6 current, 19 in beta, 14 end of life 2026-11-12. | | https://www.postgresql.org/ |
