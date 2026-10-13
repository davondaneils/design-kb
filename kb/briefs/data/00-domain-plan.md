# Domain plan: Data and backend structure (design-data)

Owner hat: domain-specialist (data and backend). Status: revived 2026-10-13 as a domain reference (v0.2, drafting). v0.1 was archived on `wip/design-data` as "engineering, not design"; the revival angle is the contract between data and screens (subtopic 07).

Audience: a designer-builder shipping real apps (solo or tiny team, often on Supabase, Firebase or a Postgres host, often with AI coding tools). They can read SQL but have never been burned by a production migration or a data leak. The skill must stop those burns before they happen and make the schema they ship look like a senior backend engineer drew it.

## Quality bar for this domain
- Fundamentals gate (one miss fails): every table has a primary key; every relationship is a declared foreign key with an index on the referencing column; correct types (timestamptz, integer minor units or numeric for money, text plus CHECK, never float for money); NOT NULL by default; uniqueness enforced in the database not the app; authorization enforced at the data layer (RLS or server check on every object ID); no secrets in the client; tenant data scoped by tenant key; migrations that do not lock production.
- Expert layer: the moves a top backend engineer makes without thinking (index the foreign keys, wrap auth.uid() in a select, NOT VALID then VALIDATE, re-sync from Stripe instead of applying webhook deltas, keyset pagination, org-owned data from day one, deleted_record table instead of deleted_at).

## Subtopics (one file name per subtopic, shared across stages)
1. `01-schema-fundamentals.md`: normalization, keys, types, constraints.
2. `02-indexes-and-migrations.md`: what to index, query shape, safe schema change.
3. `03-app-data-models.md`: users and profiles, orgs and memberships, roles, billing, content, audit, deletion.
4. `04-platform-choice.md`: Postgres vs SQLite vs document stores vs hosted BaaS.
5. `05-api-design.md`: REST resources, status codes, errors, pagination, idempotency, webhooks.
6. `06-auth-rls-privacy.md`: authentication, authorization, RLS, secrets, privacy and retention.
7. `07-data-shapes-the-ui.md`: how data decisions set what a screen can truthfully show (states, time, money, pagination, derived numbers, optimistic writes, capabilities, freshness, images, slugs, activity, field errors).

## Reuse and cross-links
- Positioning, offer, buyer: website-strategy. Checkout and upsell flow: sales-funnels. Paywall copy: copywriting.
- Forms, empty states, error UX: design-ux and design-copy. Rendering, caching, client data fetching: design-frontend. Structured data for search: design-search. Dashboards over this data: dataviz, design-product-ui. States: design-product-ui `05-states-bulk.md` and design-ux `04-states-feedback.md`. Totals and live numbers: the design-director state truth contract.
- Shared foundation contract: preference values stored in the database (theme, reduced motion) use the contract's names (`light`, `dark`, `system`) so the front end maps them to tokens without translation.
