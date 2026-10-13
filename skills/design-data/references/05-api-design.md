# API design (REST basics)

Facts and claim ids from `kb/research/data/05-api-design.md` (rechecked 2026-10-13). Opinion is marked "Opinion".

## Fundamentals (non-negotiable)
1. Every endpoint that takes an object id checks that the caller may access that object (OWASP API1). [judged]
2. Request bodies are allowlisted; responses omit private fields (OWASP API3). [judged]
3. Every list is paginated from day one with a default and a cap. [judged]
4. Every create or charge accepts an `Idempotency-Key`. [judged]
5. Errors are RFC 9457 problem+json with correct status codes; field errors carry a pointer and a stable code. [judged]
6. Webhooks you receive are signature-checked on the raw body, deduped on event id, acknowledged fast. [judged]

## Principles
1. **An API is a promise.** Every field, status code and URL you ship is something a client (your app, a partner, an AI agent) will depend on. Add freely, remove never, rename never.
2. **Authorize the object, not just the user.** Being logged in proves who you are; it does not prove you may read invoice `inv_123`. Broken Object Level Authorization is number 1 on the OWASP API Security Top 10 (2023).
3. **Every write must be safe to retry.** Networks drop responses after the server commits. Without idempotency, retries double-charge and double-create.
4. **Errors are part of the interface.** A machine-readable error shape lets the UI show the right message on the right field.

## Decision rules: resources and methods
- URLs are plural nouns: `/projects`, `/projects/{id}`, `/projects/{id}/tasks`. Nest one level at most; deeper resources get their own top-level path with a filter (`/tasks?project_id=...`). Opinion, common to Stripe, Google AIP and Zalando guidelines.
- Methods per RFC 9110: GET (safe, idempotent), PUT and DELETE (idempotent), POST and PATCH (not idempotent). Use POST to create, PATCH to partially update, DELETE to delete. Never change state on GET.
- Actions that are not CRUD get a sub-resource verb: `POST /invoices/{id}/send`, `POST /subscriptions/{id}/cancel`.
- IDs in URLs are opaque (UUIDv7 or prefixed IDs like `proj_...`), never sequential integers that leak volume or invite enumeration.
- JSON field naming: pick one (snake_case like Stripe, or camelCase) and never mix. Timestamps as ISO 8601 strings in UTC (`2026-10-09T14:30:00Z`) or Unix seconds; pick one. Money as integer minor units plus `currency` (Stripe convention).
- Version once, at the top: `/v1/` path prefix or a dated header (Stripe style). Additive changes do not need a new version; removals and renames do.

## Decision rules: status codes
| Code | When |
|---|---|
| 200 | Successful GET, PATCH, or action returning a body |
| 201 | Created; include the resource in the body and a `Location` header |
| 204 | Success with no body (DELETE) |
| 400 | Malformed request (bad JSON, wrong types) |
| 401 | Not authenticated (missing or expired token) |
| 403 | Authenticated but not allowed |
| 404 | Not found, and also when the caller may not know it exists (prefer 404 over 403 for other tenants' objects so IDs cannot be probed; opinion, common practice) |
| 409 | Conflict with current state (duplicate slug, idempotent request still in progress, version mismatch) |
| 422 | Well-formed but fails validation (field rules); also idempotency key reused with a different payload (IETF draft) |
| 429 | Rate limited; include `Retry-After` (RFC 6585 defines 429 and allows Retry-After) |
| 500 | Bug. Never for validation. |

## Decision rules: errors
Use RFC 9457 Problem Details, `Content-Type: application/problem+json`:
```json
{
  "type": "https://api.example.com/problems/validation",
  "title": "Your request has invalid fields",
  "status": 422,
  "detail": "2 fields need attention.",
  "errors": [
    { "pointer": "#/slug", "code": "invalid_format", "detail": "Use lowercase letters, numbers and hyphens." },
    { "pointer": "#/price_minor", "code": "min", "detail": "Price can't be negative." }
  ]
}
```
A uniqueness clash (slug or invoice number taken) is a conflict with current state: 409 with the same `errors` shape (`code: "taken"`), as in the mapping table in `07-data-shapes-the-ui.md`; when one submit has both kinds, return 422 and include the `taken` item (opinion). `errors` is an extension member. RFC 9457's own validation example uses `errors` items with `detail` and a JSON Pointer `pointer` (checked 2026-10-13); the `code` is this skill's addition so the client maps a stable code to its message. Clients "SHOULD NOT parse the detail member" (RFC 9457): show the client's own copy for each code, fall back to `detail`. A problem with no `type` means `about:blank`. Map database constraint names to pointers and codes (name your constraints; mapping table in `07-data-shapes-the-ui.md`). Never return stack traces, SQL or internal IDs of other tenants. Error message wording: design-copy.

## Decision rules: lists and pagination
- Paginate every list endpoint from day one; adding it later breaks clients (Google AIP-158).
- Cursor pagination. Request: `?limit=50&cursor=...`. Response:
  ```json
  { "data": [ ... ], "has_more": true, "next_cursor": "eyJjIjoiMjAyNi0xMC0wOVQxNDozMDowMFoiLCJpIjoiMDE5Li4uIn0" }
  ```
- Default limit 20 to 50, maximum 100, clamp larger values to the max (Stripe default 10 and max 100; AIP-158 coerces over-max). Numbers inside that band are opinion.
- Cursors are opaque and never grant access: re-check authorization on every page (AIP-158). Encode the keyset (last `created_at` and `id`), and sign or encrypt it if it would reveal anything sensitive (AIP-158 notes that plain base64 is not obfuscation).
- Filtering via query params (`?status=open&assignee_id=...`), sorting via an allowlist (`?sort=-created_at`). Never pass a client string into `order by`.

## Decision rules: idempotency
- Accept an `Idempotency-Key` header on every POST that creates or charges. Client generates a UUIDv4 per user intent (not per retry) (Stripe).
- Server stores `(user_id or org_id, key)` unique, with request fingerprint, status, response code and body (Brandur Leach). Same key plus same payload returns the stored response; same key plus different payload returns 422; same key while the first is still running returns 409. These codes come from the IETF Idempotency-Key draft -07, which **expired on 2026-04-18** without becoming an RFC (datatracker, checked 2026-10-13): a sound convention, not a standard. Never put personal data in a key (Stripe).
- Keep keys at least 24 hours (Stripe API v1); prune after that. Stripe's API v2 instead retries failed work to completion on a repeated key (Stripe docs, 2026-10-13); either way the client sends the same key for the same intent.
- Clients retry with exponential backoff and jitter on network errors, 409, 429 and 5xx; never on 4xx validation errors. Opinion, standard practice.

## Decision rules: webhooks you receive
1. Read the raw body; verify the signature with the provider library before parsing (Stripe: `Stripe-Signature`, HMAC-SHA256, 5 minute tolerance; frameworks that parse the body break verification).
2. Insert the event id into a processed-events table in the same transaction as the work, or as the durable job that does it; on conflict, return 200 and stop (duplicates happen). Never record the id and then do the work after a separate commit: a crash between them marks the event done and the retry is skipped.
3. Return 2xx fast, then do the work asynchronously (queue or background task). Stripe retries live events for up to 3 days.
4. Assume no ordering. Re-fetch current state from the provider instead of trusting the event payload as a delta.
5. Exempt the route from CSRF middleware; never from signature checks.

## Decision rules: webhooks you send
Sign the payload (HMAC-SHA256 with a per-endpoint secret, include a timestamp), retry with backoff for at least a day, give each event a unique id so receivers can dedupe, and let customers replay from a dashboard. Opinion, modeled on Stripe.

## Security checklist for every endpoint
- [ ] Authenticated (or explicitly public)
- [ ] Object-level check: the row's `org_id` or `user_id` matches the caller (or RLS does it)
- [ ] Property-level: request body allowlisted (no mass assignment of `role`, `org_id`, `is_paid`); response omits private fields (OWASP API3)
- [ ] Rate limited per user and per IP; page size capped (OWASP API4)
- [ ] Admin functions on separate routes with role checks (OWASP API5)
- [ ] Server-side fetches of user-supplied URLs validated against an allowlist (OWASP API7, SSRF)

## Do and don't
| Do | Don't |
|---|---|
| `POST /projects` returns 201 with the project | `POST /createProject` returning 200 `{ success: true }` |
| 422 with field errors | 200 with `{ "error": "bad" }` |
| `GET /tasks?project_id=p1&limit=50&cursor=...` | `GET /projects/p1/sections/s3/tasks/t9/comments` |
| Ignore unknown fields in responses; never remove fields | Rename `name` to `title` in place |
| `PATCH` with only changed fields, allowlisted | Accept the whole object and save it |

## Worked example: todo app with shared lists
```
GET    /v1/lists                         lists the caller can access (memberships)
POST   /v1/lists                         create (Idempotency-Key)            201
GET    /v1/lists/{list_id}               404 if not a member
PATCH  /v1/lists/{list_id}               owner or editor only                200
DELETE /v1/lists/{list_id}               owner only                          204
GET    /v1/lists/{list_id}/items?limit=50&cursor=...
POST   /v1/lists/{list_id}/items         (Idempotency-Key)                   201
PATCH  /v1/items/{item_id}               checks item's list membership       200
POST   /v1/lists/{list_id}/members       invite by email                     201
DELETE /v1/lists/{list_id}/members/{user_id}                                 204
```
Items get a top-level path for updates so clients do not need the parent id, but authorization still resolves item to list to membership on every call.

## Worked example: "Stripe webhook keeps double-granting credits"
Cause: duplicate deliveries plus a handler that adds credits per event. Fix: (1) processed-events table keyed by `evt_` id; (2) make the grant itself idempotent, for example a `credit_grants` row unique on `(org_id, stripe_invoice_id)`, so even two different event types for the same invoice cannot grant twice; (3) compute balance from grants instead of incrementing a counter.

## Decision rules: conditional requests
- Send `ETag` on reads of editable resources; accept `If-None-Match` and return 304 when unchanged (RFC 9110).
- Edits send `If-Match`; a mismatch returns 412 and the UI shows who changed what. Return 428 when a client edits without a precondition on resources people edit together (RFC 6585). Details and the screen side: `07-data-shapes-the-ui.md`.

## Where this domain is usually wrong
- **"200 with `{ success: false }`."** Clients and caches read status codes; use 4xx and problem+json.
- **"The Idempotency-Key header is an IETF standard."** It is an expired draft (2026-04-18); Stripe's practice is the working reference.
- **"Add pagination later."** It breaks every client (AIP-158).
- **"Return the total count with every list."** Stripe lists carry `has_more`, not a total; Stripe search's total is opt-in and accurate only to 10,000 (Stripe docs, 2026-10-13).

## Hand-offs
- Response fields the UI needs (states, `as_of`, summaries, capability flags): `07-data-shapes-the-ui.md`.
- Error messages and empty states: design-copy, design-ux. Client fetching, caching, optimistic updates: design-frontend.

## Sources
- RFC 9110, HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html (accessed 2026-10-13)
- RFC 9457, Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457.html (accessed 2026-10-13)
- RFC 6585, Additional HTTP Status Codes (428, 429): https://www.rfc-editor.org/rfc/rfc6585.html (accessed 2026-10-13)
- Stripe API, Pagination: https://docs.stripe.com/api/pagination (accessed 2026-10-13)
- Stripe API, Search (total_count): https://docs.stripe.com/api/pagination/search (accessed 2026-10-13)
- Stripe API, Idempotent requests: https://docs.stripe.com/api/idempotent_requests (accessed 2026-10-13)
- Stripe, Webhooks: https://docs.stripe.com/webhooks (accessed 2026-10-09)
- Google AIP-158, Pagination: https://google.aip.dev/158 (accessed 2026-10-13)
- IETF Idempotency-Key draft, history (expired 2026-04-18): https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/history/ (accessed 2026-10-13)
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/ (accessed 2026-10-09)
- Brandur Leach, Idempotency keys: https://brandur.org/idempotency-keys (accessed 2026-10-09)
