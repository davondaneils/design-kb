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
