# Brief 07: Data shapes the UI

Owner hat: editor-in-chief (data). Status: drafting. Brief date: 2026-10-13. Reference layer, revival of design-data.

## Question it answers
Which data decisions (columns, types, response fields, endpoints, locking) decide what a screen can truthfully show, and how does a designer-builder make the schema and the API carry every state, number and label the screen needs, so that nothing on screen is guessed, invented or contradicted by the data?

This is the angle that brings data into design-kb: design-data was archived as "engineering, not design". The contract between data and screens is design work, because a screen cannot be more truthful than the data behind it.

## Audience
design-director and design-playbook-dashboard (and -mobile) at the point where a screen is drawn over real data; the tester when it checks that every number and state on a screen is something the model can supply.

## Decisions the reader must be able to make
- For each UI state (loading, empty, zero, unknown, not permitted, stale, partial, error, source stopped): which data condition produces it and which column or response field tells it apart from its neighbours.
- How a time is stored, sent and shown: instant plus the venue or user IANA zone, formatted at the edge with `Intl` in the page's locale.
- How money is stored, sent and shown: integer minor units plus currency, into `Intl.NumberFormat`.
- Which pagination a list uses and what that lets the list UI say (no "page 7 of 20" with keyset; what exact counts cost).
- Where a derived number is computed so every total on the screen agrees, and how that maps to the director's `data-sum-of` and `data-derived-from` contract.
- What optimistic UI needs from the data: client-generatable ids and idempotency keys.
- How the response tells the UI what the viewer may do (capability flags with reasons) instead of the UI guessing from a role name.
- How computed values that race (waitlist position, places left) are produced and shown.
- Freshness: `updated_at`, ETags, "Updated just now".
- Undo windows against soft delete.
- Images that never shift layout: width, height, alt, focal point, placeholder.
- Slugs and stable URLs.
- Activity feeds from the audit log.
- Named constraints mapped to field errors in problem+json.

## Fundamentals (gate)
1. Every number, label and state on a screen is stored or computable by a named query; nothing on screen the data cannot supply.
2. Each UI state maps to a distinct data condition the client can read; "zero", "empty", "unknown" and "not permitted" are never the same value.
3. Times and money reach the client as raw values plus their zone or currency; formatting happens once, at the edge.
4. Every related total is computed in one place and shipped together.
5. Every list states its pagination kind and the UI shows only what it supports.
6. Every write the UI may retry or show optimistically carries an idempotency key and, where it creates, a client-generatable id.
7. Every field-level failure returns problem+json with a pointer and a stable code the form maps to a message.
8. Images ship with width, height and alt text.

## Expert layer
Capability flags with reasons; local wall-clock storage for future events (tz 2026e Manitoba example); Stripe's ISK exponent trap; counts as "50+" or estimates; ETag plus `If-Match` for lost updates; computed "places left" served with the row lock; activity feed as a view over the audit log; stable ids in URLs with slug as decoration.

## Must cover
PostgreSQL datetime docs, IANA tz, MDN Intl (DateTimeFormat, NumberFormat, RelativeTimeFormat), Temporal status, Stripe currencies, pagination, search total_count, idempotency, entitlements, AIP-158, Postgres count estimate, RFC 9110 conditional requests, RFC 6585 428, RFC 9457, Postgres error codes, PostgREST errors, web.dev CLS, MDN object-position, WCAG 1.1.1, RFC 9562, crypto.randomUUID. Internal: design-product-ui 05 and 06, design-ux 03 and 04, design-director state truth contract, FOUNDATIONS content mechanics, design-search architecture.

## Out of scope or reuse
Visual design of states (design-product-ui, design-ux), state wording (design-copy), chart choice (dataviz), formatting implementation and caching (design-frontend), search ranking (design-search).

## Test briefs
1. "Invoices list for a small studio's billing tool": schema rows, API response, every screen state, money in two currencies, a partial failure and a stale source. (The worked example in the draft.)
2. "Limited edition drop with N numbered copies": what "12 left" needs from the data, and how it stays true under concurrent checkouts.
3. Held-out: `kb/tests/design-data/briefs.md` (Crux class booking) is the rendered test and must not be used as a worked example.

## Rubric
Pass: every state in the matrix names its data condition and its field; every number in the worked example traces to a column or a named query; no em dashes; facts sourced and dated; opinion labelled. Below the bar: states described only visually, totals computed in the client from a paginated subset, "page 7 of 20" over keyset, a role name checked in the UI.
