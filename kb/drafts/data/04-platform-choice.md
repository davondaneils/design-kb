# Choosing the data platform

Facts from `kb/research/data/04-platform-choice.md`. Pricing and limits change often; re-check before quoting (last checked 2026-10-13). Opinion is marked "Opinion".

## Fundamentals (non-negotiable)
1. Business data with users, teams, orders or permissions goes in a relational database unless the brief is clearly offline-first. [judged]
2. Before anyone depends on it: automatic backups, one tested restore, region next to the functions, a pooler for serverless. [judged]
3. If the browser talks to the database, the row rules are written and tested in the same change as the tables. [judged]
4. Client code carries only the low-privilege key (Supabase publishable); secret keys stay on servers. [judged]

## Principles
1. **Relational by default.** Business data is full of many-to-many relationships (users and orgs, orders and products, tags and posts). Relational databases join them; document stores push the joins into your code (Kleppmann, DDIA ch. 2).
2. **Pick the boring database, then a host.** The engine decides your data model and exit cost; the host decides convenience and price. Postgres is portable across Supabase, Neon, RDS, Crunchy, Render, Railway and self-hosting. Firestore and Convex are their own engines with no drop-in substitute.
3. **The security model comes with the platform.** If the browser talks to the database (Supabase client, Firebase SDK), your row rules are the only wall. That is a fine design when the rules are right, and a public dump when they are not (Firebase 2024: about 125M records exposed across about 900 sites through misconfigured rules; CVE-2025-48757: AI-builder Supabase apps with missing or weak RLS).

## Decision table
| Situation | Choose | Why |
|---|---|---|
| Typical SaaS, marketplace, content site, internal tool | **Postgres** (hosted: Supabase if you want auth, storage, realtime and auto API in one; Neon or similar if you bring your own backend) | Relations, constraints, RLS, JSON when needed, portable |
| Single server app, one writer process, under about 100K hits/day | **SQLite** (with WAL mode and continuous backups; Litestream is one example tool, opinion) | sqlite.org calls 100K hits/day conservative and shows 10x; one writer at a time; Nomad List runs on it (practitioner) |
| Offline-first mobile with sync, data is per-user trees | **Firestore** or a local-first sync engine | Document locality, offline SDKs; accept 1 MiB docs and denormalization |
| Live collaborative UI, TypeScript team, wants reactivity built in | **Convex** (or Postgres plus a realtime layer) | Reactive queries out of the box (vendor claim); accept engine lock-in |
| Analytics over hundreds of millions of events | Postgres first, then a columnar store (ClickHouse, BigQuery) fed from it | Opinion: do not start here |
| Caching, rate limits, queues at scale | Postgres first (tables plus `for update skip locked`), then Redis | Opinion: "just use Postgres" until measured need |

Opinion for this audience: a designer-builder shipping a first or second real app should default to **Supabase Postgres** (or Postgres plus a separate auth provider) unless the brief clearly says offline-first mobile. It teaches correct relational habits, keeps the exit door open, and its RLS model is well documented.

## What to check before you commit (any host)
- **Backups and restore:** are automatic backups included, how long kept, is point-in-time recovery available, and have you done one test restore? Example (October 2026): Supabase Free has no automatic backups; Pro keeps daily backups for 7 days; PITR is an add-on from $100/month per 7 days of retention (supabase.com/pricing).
- **Free tier traps:** Supabase Free projects pause after 1 week of inactivity and cap at 500 MB per database and 2 active projects (supabase.com/pricing). Fine for prototypes; not for anything a client depends on.
- **Region:** put the database in the same region as your server functions and most users; cross-region round trips add tens to hundreds of milliseconds per query.
- **Connection limits:** serverless functions open many short connections. Use the host's pooler (Supavisor, PgBouncer, Neon pooler) in transaction mode for serverless; know that session state (`set`) does not survive across transactions there.
- **Key model (checked 2026-10-13):** Supabase is deprecating the legacy `anon` and `service_role` keys "by the end of 2026" in favor of `sb_publishable_...` (browsers, apps, CLIs) and `sb_secret_...` (servers, Edge Functions). The new keys are not JWTs: send them on the `apikey` header. Secret keys return 401 from browsers (matched on User-Agent), and you can issue one per service so a leak forces one rotation. Legacy keys keep working until you deactivate them in Settings > API Keys, and deactivation is reversible, so migrate, verify, then deactivate. Build new projects on the new keys.
- **Exit path:** can you `pg_dump` everything including auth users? For Firestore, plan an export pipeline before you need it.

## Firestore rules of thumb (if you choose it)
- Max document 1 MiB; max 20 levels of nesting (Firestore quotas).
- No monotonically increasing document IDs (hotspots); use auto IDs. An indexed sequential field caps a collection at about 500 writes per second (Firestore best practices).
- Paginate with cursors, never offsets: skipped documents are billed reads.
- Model for the screen: denormalize into the documents each screen reads, and accept fan-out writes to keep copies in sync. Write the security rules in the same pull request as the data shape.
- Never ship test-mode or `allow read, write: if request.auth != null` rules (Firebase insecure rules docs).

## Do and don't
| Do | Don't |
|---|---|
| Postgres for anything with users, orgs, orders and permissions | A document store because "the schema is not decided yet" (schema-on-read moves the schema into every reader; Kleppmann) |
| Write migrations from day one, even on Supabase | Edit tables in the dashboard on production |
| Test a restore before launch | Assume the host's backups exist |
| Pick one region near users and functions | Database in us-east, functions in eu-west |

## Worked example: realtime collaborative whiteboard
Shapes and strokes change many times per second; rooms are trees; presence is ephemeral. Choice: Postgres for accounts, orgs, boards and permissions; a CRDT sync service (Yjs over a websocket provider, or a local-first engine) for the live board document, snapshotted to Postgres as `jsonb` or object storage every N seconds. Presence never touches the database. Reason: relational for who-can-see-what, document or CRDT for the hot collaborative payload. Opinion, matching the "use the model that fits each part" consensus in DDIA.

## Worked example: marketplace MVP in a weekend
Sellers, listings, buyers, orders, payouts, reviews: heavy many-to-many and money. Choice: Supabase Postgres, Stripe Connect, schema from `03-app-data-models.md` adapted (orgs as seller accounts). Firestore would force duplicating listing data into orders and reviews and hand-writing integrity rules. Turn on backups (Pro) before the first real transaction.

## Where this domain is usually wrong
- **"A document store because the schema is not decided yet."** Schema-on-read moves the schema into every reader (Kleppmann).
- **"The free tier is fine for a client launch."** Supabase Free pauses after 1 week of inactivity and has no automatic backups (supabase.com/pricing, 2026-10-13).
- **"The anon key is a secret."** It is public by design; the row rules are the wall (Supabase API keys docs).
- **"Wait for PostgreSQL 19."** It is in beta (Beta 4, 2026-09-24); build on 18.

## Hand-offs
- Rendering strategy, caching and where queries run (server components, edge): design-frontend.
- Search infrastructure (Postgres full text vs a search service): design-search.
