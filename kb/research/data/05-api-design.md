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
