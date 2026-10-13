# Research: API design

Status key: C = consensus, P = practitioner opinion, O = one expert's opinion, Q = contested.

## Findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Safe methods: GET, HEAD, OPTIONS, TRACE. Idempotent: those plus PUT and DELETE. POST and PATCH are not idempotent by definition. | RFC 9110 sec. 9.2 | C |
| 2 | Problem Details: `application/problem+json` with type, title, status, detail, instance; extension members allowed; obsoletes RFC 7807. | RFC 9457 | C |
| 3 | Stripe list endpoints: cursor via `starting_after` and `ending_before` object IDs; `limit` default 10, range 1 to 100; response `{object: "list", data, has_more, url}`. | Stripe API, pagination | C |
| 4 | AIP-158: paginate from day one (adding later is breaking); document a default page size; coerce over-max to max; negative is an error; opaque URL-safe tokens that never grant authorization; empty next_page_token is the only end signal; tokens may expire (about 3 days). | Google AIP-158 | C |
| 5 | Stripe idempotency: Idempotency-Key header on POST, up to 255 characters, V4 UUID suggested, results including 500s are saved once execution starts, keys can be pruned after at least 24 h, parameter mismatch errors. | Stripe API, idempotent requests | C |
| 6 | IETF Idempotency-Key draft (-07, Oct 2025): 400 when missing, 422 when reused with a different payload, 409 while the original is still processing; publish an expiry policy. | draft-ietf-httpapi-idempotency-key-header-07 | C (draft, not yet RFC) |
| 7 | Webhooks: verify signature on the raw body, constant-time compare, 5 min timestamp tolerance by default, return 2xx fast and process asynchronously, dedupe on event ID, no ordering guarantee, live retries up to 3 days. | Stripe webhooks | C |
| 8 | OWASP API Top 10 2023: #1 Broken Object Level Authorization; #3 Broken Object Property Level Authorization (mass assignment and over-exposure); #4 Unrestricted Resource Consumption; #5 Broken Function Level Authorization. | OWASP API Security Top 10 2023 | C |
| 9 | Idempotency key design with recovery points and atomic phases; 409 on concurrent use of the same key. | Brandur Leach | O |

## Numbers
- Page size: Stripe default 10, max 100.
- Idempotency key retention: at least 24 h (Stripe); Brandur reaps at 72 h.
- Webhook signature tolerance 5 min; Stripe live retry window 3 days.

## Sources
- RFC 9110: https://www.rfc-editor.org/rfc/rfc9110.html
- RFC 9457: https://www.rfc-editor.org/rfc/rfc9457.html
- Stripe pagination: https://docs.stripe.com/api/pagination
- Stripe idempotency: https://docs.stripe.com/api/idempotent_requests
- Stripe webhooks: https://docs.stripe.com/webhooks
- Google AIP-158: https://google.aip.dev/158
- IETF Idempotency-Key draft: https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header
- OWASP API Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- Brandur Leach, idempotency keys: https://brandur.org/idempotency-keys

## Re-check 2026-10-13
| # | Fact | Result | Quote | URL |
|---|---|---|---|---|
| R1 | RFC 9457 | Unchanged: Standards Track, July 2023, obsoletes 7807. Sharpened: its own validation example uses an `errors` extension whose items carry `detail` and a JSON Pointer `pointer`; consumers should not parse `detail`; a missing `type` means `about:blank`. The skill now uses `pointer` plus a machine `code` instead of the archive's `field` and `message`. | "Consumers SHOULD NOT parse the \"detail\" member for information; extensions are more suitable"; "When this member is not present, its value is assumed to be \"about:blank\"." | https://www.rfc-editor.org/rfc/rfc9457.html |
| R2 | IETF Idempotency-Key draft | **Changed: status.** Revision -07 (2025-10-15) **expired on 2026-04-18**; it is not an RFC and has no intended RFC status. Its 400, 409 and 422 codes remain a reasonable convention, labelled as an expired draft. | "2026-04-18 | 07 | (System) | Document has expired" | https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/history/ |
| R3 | Stripe idempotency | Unchanged for API v1: keys up to 255 characters, V4 UUIDs suggested, results saved once execution begins (including 500s), prunable after at least 24 hours, parameter mismatch errors. New: API v2 retries failed work to completion instead of replaying the saved result. Stripe also says not to use personal data as keys. | "Avoid using sensitive data (for example, email addresses or personal identifiers) as idempotency keys." | https://docs.stripe.com/api/idempotent_requests |
| R4 | Stripe pagination | Unchanged: `limit` default 10, 1 to 100; `starting_after` and `ending_before`. | "ranging between 1 and 100" | https://docs.stripe.com/api/pagination |
| R5 | AIP-158 | Unchanged: example default 50, max 1000 coerced; `total_size` optional and may be an estimate; tokens opaque, never authorize; about 3 days expiry rule of thumb. | "This total may be an estimate (but the API should explicitly document that)." | https://google.aip.dev/158 |
| R6 | Conditional requests | New for 07: `If-Match` with ETags prevents lost updates; a false condition gets 412; 428 asks for a conditional request. | "to prevent the \"lost update\" problem"; "The 428 status code indicates that the origin server requires the request to be conditional." | https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match ; https://www.rfc-editor.org/rfc/rfc6585.html |
| R7 | PostgREST maps Postgres errors to HTTP | New for 07: 23505 and 23503 return 409; the body carries `code`, `message`, `details`, `hint`. | "23505 | 409 | uniqueness violation" | https://docs.postgrest.org/en/stable/references/errors.html |
