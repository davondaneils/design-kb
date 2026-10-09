# Research 04: Architecture, URLs, internal linking

Researched 2026-10-09. Labels as defined in 01.

## Key findings

| # | Claim | Source (date) | Label |
|---|---|---|---|
| 1 | Google follows `<a>` with `href` containing a real URL; no `javascript:` hrefs. JS-inserted links fine if standard markup. | Google, Links crawlable | Official |
| 2 | Anchor text: descriptive, concise, relevant to both pages; avoid "click here"/"read more"; image alt acts as anchor; no stuffing; do not place links side by side. | Same | Official |
| 3 | Every page you care about should have at least one internal link; no ideal count. | Same | Official |
| 4 | Outbound: nofollow when you do not trust a source; `sponsored` for paid, `ugc` for user content. | Same | Official |
| 5 | Faceted nav: if not needed in Search, disallow filter parameters in robots.txt or use fragments; canonical and nofollow are weaker. If needed, use `&`, consistent filter order, 404 for empty or nonsensical combinations. | Google, Faceted navigation (updated 2025-12-18) | Official |
| 6 | Pagination: Google no longer uses rel next/prev; each page self-canonical with unique URL (`?page=n`); crawlable sequential links; infinite scroll and load-more need crawlable fallbacks. | Google, Pagination and incremental loading | Official |
| 7 | URLs: readable words, hyphens not underscores, audience language, lowercase standardization, no session IDs, avoid infinite calendars, root-relative links. Country-specific domain or subdirectory for multi-regional. | Google, URL structure | Official |
| 8 | Internal links are listed among Google's recommended practices for AI features ("make content easy to find through internal links"). | Google AI features doc (2025-12-10) | Official |
| 9 | Clicks from ChatGPT and Claude fetches hit 404 about 34% of the time (likely hallucinated or stale URLs). Keep URLs stable and redirect old ones. | Vercel, 2024-12-17 | Measured |
| 10 | Whitespark LSRF 2026: "dedicated page for each service" is the top local organic factor. | Whitespark, 2025-11-06 | Practitioner survey |

## Practitioner consensus (opinion, label it)
- Keep important pages within 3 clicks of home; flat beats deep. (Common practice, not Google-stated.)
- Hub and spoke topic clusters: hub links to all spokes, spokes link back and laterally where useful.
- Subfolders consolidate signals more predictably than subdomains for content you want to rank together. Google says both work; the debate is practitioner.

## Sources
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/crawling-indexing/url-structure
- https://developers.google.com/search/docs/appearance/ai-features
- https://vercel.com/blog/the-rise-of-the-ai-crawler
- https://whitespark.ca/local-search-ranking-factors/
