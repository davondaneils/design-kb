# Brief 07: Search on a built page (the page contract, rendered)

Owner hat: editor-in-chief (search). Status: drafting, then rendered test. Brief date: 2026-10-10. Wave 2, reference layer.

## Question it answers
When design-director builds a page through a playbook, what exactly must the finished HTML carry so that search engines index it correctly, answer engines can quote it accurately, and links to it unfurl well, and how is that checked on the built file instead of by reading prose?

v0.1 of design-search was tested on text answers only. This brief moves it onto real pages: the combined coffee landing page and the combined Tally dashboard in `kb/tests/combined/` (Davon picked both 3 of 3).

## Audience
design-director and the landing and dashboard playbooks at build time; the tester at check time.

## Decisions the reader must be able to make
- The title, meta description and H1 of a homepage whose hero headline changes every week.
- Which structured data a page earns: Organization or OnlineStore, WebSite, Product and Offer, LocalBusiness subtype, FAQPage (only if earned), and which page each belongs on.
- Where internal links point (real hub URLs vs in-page anchors) and what their anchors say.
- Which passages an answer engine can lift and attribute, and what makes a passage survive being lifted (named subject, absolute dates, units).
- The social card: size, safe area, evergreen vs per-lot, alt text, and where the tags sit in `<head>`.
- Icons: formats and sizes Google Search accepts for the favicon; the Organization logo.
- An app screen behind login: how it is kept out of search and out of link previews.

## Fundamentals (gate)
1. FOUNDATIONS checklist (15 items) still passes on every page and state after the search work: `node tools/lint.mjs` exits 0. Search work never costs a fundamentals miss.
2. One `<title>`, one meta description, one absolute canonical, one visible H1; heading levels never skip; no `href="#"` on any link a crawler should follow.
3. Every JSON-LD block parses, uses schema.org types and properties that exist and apply, meets Google's required properties for the feature it targets, and states only what the visible page shows.
4. Open Graph's four required properties, absolute image URL, image alt.
5. Private app pages: noindex present, no structured data, no social card that could leak workspace data.

## Expert layer (what a top practitioner adds)
- Product markup belongs on product pages, not on a homepage grid; the one exception is the regional carousels beta.
- Global shipping and returns on Organization, not repeated on every Offer.
- Social card designed for the crops it meets, evergreen on the homepage because unfurlers cache images by URL.
- Head order for unfurlers that read as little of the page as they can; inlined assets count toward Googlebot's 2 MB cut.
- Relative dates carry a machine date; quotable sentences name their subject.
- Lighthouse's llms.txt audit vs Google Search's stance: both true, different systems.

## Must cover
Google docs fetched on 2026-10-10: title links, snippets, robots meta, block indexing, control what you share, Googlebot size limit, favicon, site names, Organization, LocalBusiness, product snippets, merchant listings, carousels and the carousels beta, FAQPage, publication dates, AI features, AI optimization guide. Open Graph protocol. Slackbot. OpenAI bots. Chrome Lighthouse llms.txt audit.

## Out of scope or reuse
Positioning (website-strategy), voice (design-copy), build pipeline and SSR (design-frontend), visual design of the pages (every other domain: this wave must not change how the pages look except where search needs visible content).

## Test briefs (rendered)
1. **Coffee landing page** (`kb/tests/combined/coffee.html`, design-playbook-landing, closest exemplars apple.com product pages and family.co). Apply design-search: head, structured data, links, dates, quotable passages, social card and icons. Must keep the page's look.
2. **Tally dashboard** (`kb/tests/combined/dashboard.html`, design-playbook-dashboard, closest exemplars Linear app, Vercel Dashboard). An app behind login: verify and fix only what keeps it out of search and previews; say so.
3. **Structured data fixtures**: one product page fixture (the right home for Product and Offer) and one negative fixture with the common mistakes; the checker must pass the first and catch every mistake in the second.

## Rubric
Gate: `node tools/lint.mjs` 0 fails on both pages and every state, before and after (no regression); `skills/design-search/assets/search-check.mjs` 0 fails after; every `[judged]` row still holds on the renders.

Then, for the coffee page:
- **Close to the exemplar** means: the search result and the social card look as considered as the page (a studio would sign the card), the outline reads as a table of contents, every structured data node is earned and placed on the right page, and the quotable facts (prices paid, roast data, location, hours) are lifted cleanly with their dates.
- **Clearly below** means: generic template card, schema added for its own sake (FAQ, homepage Product), or tags that disagree with each other (og:url vs canonical, markup vs page).

For the dashboard: pass means noindex present, nothing indexable or unfurlable leaks, and the report says plainly that the rest of the search work does not apply.
