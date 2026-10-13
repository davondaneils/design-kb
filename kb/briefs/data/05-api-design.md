# Brief 05: API design (REST basics)

Question: how should my app's endpoints look so clients, AI tools and future me can rely on them?
After reading, the designer can: name resources, map verbs, pick status codes, shape errors (RFC 9457), paginate with cursors, make writes idempotent, version, and handle webhooks safely.
Must cover: plural nouns, nested only one level; method semantics from RFC 9110; 200/201/204/400/401/403/404/409/422/429; problem+json; cursor pagination (Stripe and AIP-158 shapes, default and max page size); Idempotency-Key (Stripe 24 h retention, IETF draft status codes); webhooks (verify signature on raw body, dedupe on event id, ack fast, no ordering assumption); OWASP API Top 10 BOLA.
Test briefs: "Design the API for a todo app with shared lists"; "Stripe webhook keeps double-granting credits".
