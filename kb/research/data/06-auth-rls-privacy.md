# Research: Auth, RLS and privacy

Status key: C = consensus, P = practitioner opinion, O = one expert's opinion, Q = contested.

## Findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Passwords: minimum 15 characters when single factor, minimum 8 when used within MFA; allow at least 64; no composition rules; check a blocklist of common, expected or compromised passwords; no forced periodic rotation. | NIST SP 800-63B rev 4 (Aug 2025) sec. 3.1.1.2 | C |
| 2 | Hashing: Argon2id m=19 MiB, t=2, p=1 minimum; scrypt N=2^17, r=8, p=1; bcrypt cost at least 10 with a 72-byte input limit; PBKDF2-HMAC-SHA256 600,000 iterations where FIPS is required. | OWASP Password Storage Cheat Sheet | C |
| 3 | Session cookies: `__Host-` prefix, Secure, HttpOnly, SameSite=Strict or Lax, Path=/; at least 64 bits of entropy (128 recommended for self-made IDs); regenerate on login and privilege change; invalidate on the server at logout; idle timeout 15 to 30 min for low-risk apps, 2 to 5 min for high-value; absolute timeout for example 4 to 8 h. | OWASP Session Management Cheat Sheet | C |
| 4 | RLS: with RLS enabled and no policy, publishable-key API access returns nothing (default deny); write one policy per operation; UPDATE uses USING (existing row) and WITH CHECK (new row); `to anon using (true)` exposes every row. Grants are checked before policies; revoke default grants on new public tables. | Supabase RLS docs | C |
| 5 | RLS performance (Supabase measured): index on policy column 171 ms to under 0.1 ms; wrap auth.uid() in (select ...) 179 ms to 9 ms; wrapping security-definer role checks 11,000 ms to 7 ms and 178,000 ms to 12 ms; explicit filter in the client query 171 ms to 9 ms; `TO authenticated` makes anon requests exit early. | Supabase RLS performance guide | C (vendor benchmark) |
| 6 | Views bypass RLS by default; on PG 15+ set `security_invoker = true`. Security definer functions must not live in an exposed schema and should set `search_path = ''`. | Supabase RLS docs | C |
| 7 | Service role or secret key bypasses RLS; never ship it to a browser. New sb_secret_ keys return 401 from browsers. | Supabase docs | C |
| 8 | Table owners bypass RLS unless FORCE ROW LEVEL SECURITY; superusers and BYPASSRLS roles always bypass. Tenant context via `current_setting('app.current_tenant')`, preferred over a database user per tenant; set it per transaction (SET LOCAL or set_config(..., true)) so pooled connections do not carry one tenant's context into the next request. | AWS Prescriptive Guidance RLS; PostgreSQL docs | C |
| 9 | Firebase anti-patterns: open rules, `auth != null` only, expired test-mode rules; fix with owner checks and data validation; on update, require both old and new owner to match to block ownership transfer. | Firebase insecure rules | C |
| 10 | Incidents: Firebase misconfiguration exposed about 125M records across about 900 sites (2024); CVE-2025-48757 covered AI-builder-generated Supabase apps with missing or weak RLS allowing unauthenticated read and write. | Simon Willison; Pluto Security write-up | C (reported) |
| 11 | Supabase pentest roundup: network-capable functions (http extension) exposed via RPC to anon allowed SSRF; missing WITH CHECK is common. | Supabase GitHub discussion 38690 (third party) | P |
| 12 | GDPR Art. 25: data protection by design and by default; only the data necessary for each purpose, limiting amount, extent, retention and accessibility. | GDPR Art. 25 | C (law) |
| 13 | GDPR Art. 17: erasure "without undue delay" when data is no longer needed, consent withdrawn and other grounds; exceptions include legal obligation and legal claims. | GDPR Art. 17 | C (law) |
| 14 | GDPR Art. 32: pseudonymisation, encryption, resilience, timely restore, regular testing. | GDPR Art. 32 | C (law) |
| 15 | OWASP API #1 is BOLA: check that the caller may access the specific object on every request. | OWASP API Top 10 2023 | C |
| 16 | GDPR Art. 12(3): respond to data subject requests "without undue delay and in any event within one month", extendable by two further months for complex or numerous requests (tell the person within the first month). | GDPR Art. 12 | C (law) |
| 17 | GDPR Art. 33(1): notify the supervisory authority "without undue delay and, where feasible, not later than 72 hours" after becoming aware, unless the breach is unlikely to result in a risk to rights and freedoms. | GDPR Art. 33 | C (law) |
| 18 | Supabase Advisors are deterministic lints (Studio, CLI `supabase db advisors`, MCP): 0001 unindexed foreign keys, 0003 auth RLS initplan, 0008 RLS enabled no policy, 0010 security definer view, 0011 function search path mutable, 0013 RLS disabled in public, 0015 RLS references user metadata, 0028/0029 security definer function executable by anon/authenticated. | Supabase database advisors docs | C (vendor) |
| 19 | Supabase Storage access control is RLS on `storage.objects`; uploads denied without policies; public buckets readable without policies; folder scoping via `storage.foldername(name)`; service keys bypass. | Supabase storage access control docs | C (vendor) |

Added sources: https://gdpr-info.eu/art-12-gdpr/ , https://gdpr-info.eu/art-33-gdpr/ , https://supabase.com/docs/guides/database/database-advisors , https://supabase.com/docs/guides/storage/security/access-control . RFC 6585 (429 Too Many Requests, Retry-After): https://www.rfc-editor.org/rfc/rfc6585.html

## Sources
- NIST SP 800-63B rev 4: https://pages.nist.gov/800-63-4/sp800-63b.html
- OWASP Password Storage: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase RLS performance: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
- Supabase API keys: https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
- AWS RLS recommendations: https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/rls.html
- Firebase insecure rules: https://firebase.google.com/docs/rules/insecure-rules
- Simon Willison on Firebase: https://simonwillison.net/2024/Mar/18/firebase
- CVE-2025-48757 write-up: https://blog.pluto.security/p/cve-202548757-what-happened-why-it-b22
- Supabase security discussion: https://github.com/orgs/supabase/discussions/38690
- GDPR Art. 17: https://gdpr-info.eu/art-17-gdpr/
- GDPR Art. 25: https://gdpr-info.eu/art-25-gdpr/
- GDPR Art. 32: https://gdpr-info.eu/art-32-gdpr/
- OWASP API Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/

## Re-check 2026-10-13
| # | Fact | Result | Quote | URL |
|---|---|---|---|---|
| R1 | RLS performance numbers | Unchanged: index 171 ms to under 0.1 ms; `(select auth.uid())` 179 to 9; wrapped `is_admin()` 11,000 to 7; `has_role()` 178,000 to 12; `team_id=any(array(select user_teams()))` 173,000 to 16; client filter 171 to 9; `TO authenticated` for anon 170 to under 0.1. Tests on a 100K row table. | "The tests are doing selects on a 100K row table." | https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv |
| R2 | Supabase RLS procedure | **Changed: stricter recipe.** Supabase now says set grants as well as policies: revoke all from `anon, authenticated`, grant back only what the app needs, and ship a pgTAP test file per table run by `supabase test db`. Its private-schema helper example also grants `usage on schema private to authenticated`; the archive's policy set lacked that grant. | "Revoke any existing grants from both client roles."; "Run `supabase test db` and fix what it reports." | https://supabase.com/docs/guides/database/postgres/row-level-security |
| R3 | `auth.uid()` returns null for signed-out requests | Confirmed; Supabase recommends making the intent explicit. | "`auth.uid()` returns `null`" | same |
| R4 | Security definer helpers skip RLS only when the owner can | New detail: a helper owned by a role without `bypassrls`, or reading a table with `force row level security`, re-evaluates the policy and stays recursive. | "a `security definer` function only skips RLS when its owner can" | same |
| R5 | Advisors lint ids | Confirmed unchanged for 0001, 0003, 0006, 0008, 0010, 0011, 0013, 0015, 0028, 0029. The full list now runs 0001 to 0029 and includes 0004 no primary key, 0023 sensitive columns exposed (ERROR), 0024 permissive RLS policy, 0025 public bucket allows listing, 0026 and 0027 pg_graphql table exposure. CLI: `supabase db advisors` (also Studio, MCP `get_advisors`, Management API). A CLI issue reports that `db advisors --local` misses the API-exposure lints such as `rls_disabled_in_public`, so run it against the linked project too. | "0023 sensitive columns exposed 0024 permissive rls policy 0025 public bucket allows listing"; "CLI: supabase db advisors" | https://supabase.com/docs/guides/database/database-advisors ; https://supabase.com/docs/guides/observability/advisors ; https://github.com/supabase/cli/issues/5868 |
| R6 | GDPR Art. 12(3), 17, 20, 25, 32, 33 | Text unchanged (gdpr-info.eu, fetched today). **Pending change to watch:** the Commission's Digital Omnibus proposal (November 2025) would amend the GDPR, including a proposed 96-hour breach notification deadline in place of 72 hours; as of 2026-10-13 it is still before Parliament and Council (the separate AI omnibus was adopted and entered into force 2026-07-27). Keep 72 hours until the amendment is adopted and in force. | Art. 33: "not later than 72 hours after having become aware of it"; OEIL summary: "extending the authority notification deadline to 96 hours" | https://gdpr-info.eu/art-33-gdpr/ ; https://oeil.europarl.europa.eu/oeil/en/procedure-document-summary/pdf?id=1866785 ; https://digital-strategy.ec.europa.eu/en/policies/digital-rulebook |
| R7 | GDPR Art. 20 portability | Added: export in "a structured, commonly used and machine-readable format". | same wording | https://gdpr-info.eu/art-20-gdpr/ |
| R8 | NIST SP 800-63B rev 4 passwords | Unchanged: 15 minimum single-factor, 8 with MFA, at least 64 allowed, no composition rules, no periodic change. | "SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters" | https://pages.nist.gov/800-63-4/sp800-63b.html |
