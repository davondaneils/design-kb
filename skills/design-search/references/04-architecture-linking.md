# Site architecture, URLs and internal linking

Facts current to 2026-10-09. Sources in `kb/research/search/04-architecture-linking.md`.

## Principles
1. **Architecture is a statement of priority.** The pages linked from the global nav and from many contextual links are the pages you are telling search engines matter. Link equity follows links, so money pages must sit near the top of the link graph.
2. **Build the topic map before the page list.** Group by user task and topic (hubs), then pages under them. Query fan-out in AI Mode and AI Overviews searches subtopics around a question (Official, 2026), so a hub that covers the sub-questions with linked, focused pages matches how retrieval now works.
3. **Every URL is a promise to keep.** Readable, stable, lowercase, hyphenated, never reused for different content.

## Decision rules

### Structure
- Small site (under about 50 pages): home > section > page. No more than 2 levels.
- Content or service site: hub per topic or service, each hub links to every child, each child links back to the hub and to 2 to 5 siblings where a reader would genuinely go next. (Practitioner consensus)
- Keep every indexable page within 3 clicks of the home page and linked from at least one other page (Google: at least one link; 3 clicks is Practitioner).
- Orphan check: any URL in the sitemap or analytics with zero internal inlinks is a bug. Crawl with Screaming Frog or Sitebulb and compare against the sitemap.
- Local or multi-service businesses: one page per service and one per location where you truly operate (top local organic factor in Whitespark 2026, Practitioner survey). Service x city pages only where you have a real, distinct offer there; otherwise it is doorway abuse (Official).

### URLs
- Pattern: `/{section}/{readable-slug}`. Hyphens, lowercase, audience language, no stop-word padding, no dates unless the content is a dated news item.
- No IDs where words fit; IDs are acceptable for huge catalogs (`/p/123-blue-wool-scarf`).
- Parameters only for things that do not change the main content meaningfully (tracking, sort); standard `?key=value&key2=value2`.
- Never `#` fragments to load different content.
- Subfolder vs subdomain: Google says both work; prefer subfolders for content you want to rank as one site (blog, help center, locales), subdomains for separate products or platforms (Practitioner opinion, widely held).

### Anchor text and contextual links
- Anchor names the destination: "dental implant costs" not "click here" or "read more" (Official). Same rule satisfies WCAG link purpose (design-frontend).
- Vary anchors naturally; never exact-match stuffing (spam policy).
- Contextual links in body copy carry the most meaning; nav and footer links establish structure. Do not put 200 links in a mega footer.
- Breadcrumbs on every page below level 1, marked up with BreadcrumbList.

### Faceted navigation (ecommerce, directories)
- Decide per facet: does a real search demand exist for this filtered set ("women's running shoes size 9" maybe; "sorted by price ascending" never)?
- Indexable facets: clean URL or stable parameters, consistent order, self-canonical, unique title and H1 and intro copy, internal links from the parent category.
- Non-indexable facets: robots.txt Disallow the parameter patterns if crawl waste is real; otherwise noindex. Canonical-to-parent is weak for crawl control (Official, 2025-12).
- Filter combinations with zero results, duplicated filters, impossible pages (`?page=999`): return 404, not 200 and not a redirect (Official, 2025-12).

### Pagination
- Each page `?page=n` is a real URL with a self-referencing canonical. Do not canonical page 2 to page 1 (Official).
- Plain `<a href>` links between pages; rel next/prev is unused by Google (still harmless, Bing may read it).
- Infinite scroll or load-more must also expose paginated URLs with links. Crawlers do not scroll or click (Official).

### Product lifecycle (ecommerce)
- Temporarily out of stock: keep the page 200, set `availability` to OutOfStock in Product markup and feeds, show restock date or alternatives.
- Permanently discontinued with a successor: 301 to the successor.
- Discontinued, no successor, page has links or traffic: keep a 200 page that says it is discontinued and links to the closest alternatives, or 301 to the parent category if the page has no value of its own.
- Discontinued, no links, no traffic: 404 or 410.
(Practitioner consensus, consistent with Google's guidance against redirecting everything to one page and against soft 404s.)

## Numbers
| Item | Value | Basis |
|---|---|---|
| Minimum internal links to an indexable page | 1 | Official |
| Click depth target | 3 or fewer | Practitioner |
| Sibling links per spoke | 2 to 5 | Practitioner opinion |
| AI fetch 404 rate | about 34% for ChatGPT and Claude fetchers | Measured, Vercel 2024-12 |

## Expert moves
- **Redirect what AI hallucinated.** Answer engines link to URLs that never existed. Pull 404s from server logs where the referrer is chatgpt.com, perplexity.ai or the user agent is ChatGPT-User, Claude-User or Perplexity-User, and 301 recurring ones to the right page. (Practitioner, derived from Vercel's measured 404 rates)
- **Internal link from the pages that already earn links.** Find top pages by referring domains, and add contextual links from them to the money page that needs lift. Faster than new backlinks.
- **Prune or merge thin siblings.** Ten weak pages on near-identical intents split signals and trigger title micro-boilerplate rewrites. Merge into one strong page and 301.

## Worked example
**40-location home services company.** Structure: `/services/{service}` hubs (8), `/locations/{city}` pages (40) with genuine local content (team, jobs done there, reviews from that area, service area map, local phone), and service-in-city pages only for the 10 to 15 metros with distinct demand and real local proof. Each location page links to the service hubs; each service hub lists locations served. One GBP per staffed location, each linking to its location page. Breadcrumbs everywhere. Result: no doorway pattern, crawlable within 3 clicks, local signals aligned (see 06).

## Hand-offs
- design-ux owns navigation labels and IA testing (card sorts, tree tests); this chapter sets the crawl and equity constraints.
- design-data owns slug generation and redirect tables.
- 01 technical: status codes and canonicals.
