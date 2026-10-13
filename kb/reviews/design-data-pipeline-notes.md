# design-data: suggested changes to shared files

From the design-data revival (v0.2, 2026-10-13). This branch does not edit the files below; the editor-in-chief decides. Each item names the file, the change and why.

## CLAUDE.md
1. Structure, last paragraph: replace "Data and backend is out of scope (archived on `wip/design-data`)." with "Data and backend lives in `design-data`, a domain reference loaded when a screen is drawn over real data; its angle is the contract between data and screens (`references/07-data-shapes-the-ui.md`)." Item 3 of the layer list: add `-data` to the domain references (`design-color`, `-typography`, ..., `-search`, `-data`). Davon asked for the skill; the archive reason no longer holds.

## design-director (`skills/design-director/SKILL.md`)
2. Section 1, both tables: add the row `design-data | data layer behind a screen: schema, RLS, API, auth, and what each data decision lets the screen truthfully show (reference 07)`.
3. Section 4, build rules: add "**Data contract** (any screen over real or realistic data): load design-data `references/07-data-shapes-the-ui.md` before drawing states. Every `?state=` the page has names its data condition and field in the build note; totals come from a server summary, never from rows on screen; times are formatted in the zone the screen is about; money per currency; capability flags, not role checks, decide disabled actions." Today the director's state truth contract checks that numbers agree on the page; nothing checks that the page's states and numbers are ones the data can produce.
4. Section 5, step 3 (fact check): add "and against the data-to-screen contract table (design-data SKILL.md section 6) when one exists."

## design-playbook-dashboard (`skills/design-playbook-dashboard/SKILL.md`)
5. Load order: insert after item 3 (design-product-ui) "**design-data** `references/07-data-shapes-the-ui.md` for every screen over data (state matrix, time zones, money, counts, capability flags); the rest of design-data when the job includes the schema, API or access rules."
6. "Done means": add "every state and number traces to a field or named query in the data-to-screen contract".

## design-playbook-mobile and design-playbook-landing
7. Mobile: same insertion as item 5 for app screens over account data (optimistic writes and offline retries need client ids and idempotency keys, reference 07). Landing: load design-data only for sites with accounts, shops or bookings (stock levels, "places left", prices from a catalog).

## kb/FOUNDATIONS.md
8. Content mechanics, money row: say which form applies where. Today en-US shows "$1,250" and "$75.50" (copy style), while design-product-ui fundamental 2 requires one precision per table column ("$1,250.00" beside "$75.50"). Proposed sentence: "Running copy and KPI tiles drop .00 (`trailingZeroDisplay: 'stripIfInteger'`); table columns keep one precision per column." Measured with Node 22 ICU 77: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }).format(1250)` gives "$1,250" (`kb/research/data/07-data-shapes-the-ui.md` D37).
9. Content mechanics, clock row: add that `Intl.DateTimeFormat('en-US')` prints "10:02 AM", so the en-US house style ("10:02 am") needs a lowercase pass on the day period (measured, D37). Builders have been relying on `Intl` output.
10. "Findings every domain must know": add "Date-only values (`"2026-10-09"`) never pass through `new Date()` before formatting: it parses them as UTC midnight and prints the day before in any zone west of UTC ("Thu, Oct 8" in Toronto, measured). Format with `timeZone: 'UTC'` or from the parts (MDN Date.parse; design-data reference 07)." This is a weekday bug that `claims_inventory.mjs` would flag only if the weekday is printed.
11. Fundamentals checklist row 16 (copy is true): consider adding "every number and state is one the data can supply (design-data gate 14 and 15)". Opinion: this belongs in the judged half of row 16, not a new row.

## kb/INDEX.md and kb/TOPIC_MAP.md (librarian)
12. INDEX: add `design-data | reference | Schema, RLS, API, auth, and the data-to-screen contract | v0.2 | drafting | 2026-10-13 | 2027-01-13 (every 3 months: Supabase keys, Advisors, Stripe, PostgreSQL 19, GDPR omnibus) | design-product-ui, design-ux, design-frontend`.
13. TOPIC_MAP row 11: layer reference, skill design-data, status drafting, branch `claude/data-backend-strategy-brand-a8m75c`. Run `node tools/rollup.mjs` after merging `kb/status/data.md`.

## Other skills (hand-offs that now have a target)
14. design-search SKILL.md hand-offs: "Engineering (out of scope): content model feeding pages and JSON-LD, slugs, redirect tables, tracking." becomes "design-data: content model, slugs and `slug_redirects`, ids in URLs (reference 07, Slugs and stable URLs); tracking stays out of scope."
15. design-product-ui SKILL.md section 7 hand-offs: add "Data condition and response field for each panel state, capability flags with reasons, server totals: design-data `references/07-data-shapes-the-ui.md`." Its fundamental 11 ("A control people cannot use says why ... and who can change it") needs `can.x.reason` and `who` from the API.
16. design-ux `references/03-forms.md` and `04-states-feedback.md`: link the server side: problem+json items with `pointer` and `code` mapped from named constraints, client ids plus `Idempotency-Key` for optimistic creates (design-data reference 07).
17. design-frontend `references/05-images-fonts.md`: link the image row shape (width, height, alt, focal point, placeholder) in design-data reference 07, so dimensions come from the data, not from a guess in CSS.

## tools
18. `tools/lint.mjs`: a warning check for `<img>` without `width` and `height` attributes (and without a CSS `aspect-ratio`), the most common CLS cause per web.dev; design-data stores the dimensions, the lint would confirm they reach the page.
19. `tools/lint-truth.mjs` (optional): warn when two money figures with different currency symbols sit inside one `data-sum-of` total, and when text matches "Page N of M" while the page also carries a "Load more" control (two pagination models). Opinion; both are classes of error reference 07 names.

## Tests
20. `kb/tests/design-data/briefs.md` (Crux, written 2026-10-13 before the build) is the held-out rendered test. The skill's worked examples were chosen to avoid it: an invoices screen, a limited edition drop and a KPI tile, not class booking. The 01 reference keeps its archived yoga booking schema (written 2026-10-09, before the test brief); the tester should note that overlap when scoring.
