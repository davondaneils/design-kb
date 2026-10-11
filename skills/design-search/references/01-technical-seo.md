# Technical SEO: crawl, render, index

Facts current to 2026-10-09. Sources in `kb/research/search/01-technical-seo.md`. Evidence labels: Official, Measured, Correlational, Practitioner, Speculation.

## Principles
1. **Indexing is a pipeline, and every stage can silently drop a page.** Discover (links, sitemaps) > crawl (robots.txt, server) > render (JS) > index (canonical, noindex, quality) > serve. Diagnose in that order; never debug ranking before confirming indexing.
2. **One URL, one answer.** Every piece of content has exactly one canonical URL, and every signal (internal links, sitemap, canonical tag, hreflang, redirects) points at that same URL. Mixed signals are the most common self-inflicted wound.
3. **The initial HTML is the contract.** Google renders JS, but late; most AI crawlers do not render at all (Measured, Vercel 2024-12). What is not in the server response may as well not exist for answer engines.
4. **Performance is a tiebreaker, not a growth lever.** Core Web Vitals are used in ranking, but relevance wins (Official, Google page experience doc 2026-09-22). Fix CWV for users and conversion; do not promise traffic from it.

## Decision rules: what to do with a URL

| Situation | Do | Never |
|---|---|---|
| Page moved permanently | 301 (or 308) to the closest equivalent, update internal links to the new URL | Chain redirects (A>B>C); redirect everything to home |
| Page gone, no equivalent | 404 or 410 | Soft 404 (200 with "not found" text); redirect to home |
| Duplicate or variant (tracking params, sort order, print) | rel=canonical to the main URL, absolute URL, in `<head>` | Canonical via robots.txt; noindex to pick a canonical within a site |
| Must stay reachable but never in search (thank-you, internal search results, account pages) | `<meta name="robots" content="noindex">` and leave crawlable so the tag is seen | Block in robots.txt AND noindex (the noindex is never read) |
| Crawl waste on infinite spaces (filters, calendars) you never want indexed | robots.txt Disallow on the parameter pattern | Rely on canonical to save crawl (weak, slow) |
| Staging or preview site | HTTP authentication (401) or IP allowlist | robots.txt only (URLs can still be indexed from links) |
| Already-indexed page you want removed | Serve noindex (crawlable) or 404/410; use Search Console Removals only as a temporary hide | Add robots.txt Disallow first (Google can no longer see the noindex) |

## Decision rules: JavaScript sites
- If the framework can server-render or statically generate (Next.js, Nuxt, Astro, SvelteKit, Remix), do it for every indexable route. Client-only rendering is acceptable for logged-in app screens and non-essential widgets.
- Links are `<a href="/real/url">`. No `onclick` navigation, no `javascript:` hrefs, no `#/route` fragment routing (use the History API).
- `noindex` never goes in the initial HTML of a page you want indexed. Google may skip rendering when it sees noindex, so JS cannot remove it.
- Exactly one canonical tag, present in the server HTML. If JS also writes it, it must match.
- SPA "not found" routes: return a real 404 from the server, or JS-redirect to a URL that does, or inject noindex.
- Test what crawlers see: `curl -sL -A "Mozilla/5.0 (compatible; GPTBot/1.1)" https://example.com/page | grep -i "key fact"`. If the price, spec, or answer is missing from raw HTML, AI crawlers miss it. Use Search Console URL Inspection for Google's rendered view.

## Numbers
| Item | Value | Source |
|---|---|---|
| LCP (good) | 2.5 s or less | web.dev, Official |
| INP (good) | 200 ms or less | web.dev, Official |
| CLS (good) | 0.1 or less | web.dev, Official |
| Assessment | 75th percentile of real users, mobile and desktop separately | web.dev |
| Sitemap file | 50,000 URLs or 50 MB uncompressed, whichever first | Google |
| `priority`, `changefreq` | Ignored by Google | Google |
| `lastmod` | Used only if consistently accurate; only for significant change | Google |
| IndexNow batch | Up to 10,000 URLs per POST; Bing, Yandex, Naver, Seznam, Yep, Amazon. Not Google. | indexnow.org |
| AI crawler 404 share | ChatGPT 34.8%, Claude 34.2%, Googlebot 8.2% of fetches | Vercel 2024-12, Measured |

## Mobile-first parity
Google indexes and ranks the mobile version (Official, mobile-first indexing doc, updated 2025-12-10). The mobile page must carry the same primary content, titles, meta descriptions, structured data, robots meta and image alt text as desktop. Accordions and tabs are acceptable if the content is present in the HTML; content that appears only after a swipe, click or typed input is not seen. Breakpoints follow the shared foundation contract (sm 640, md 768, lg 1024, xl 1280, 2xl 1536); hiding content below `md` with `display:none` that does not reappear elsewhere is a parity failure.

## Page indexing report: diagnosis ladder
| Status in Search Console | Meaning (Official, Google Page indexing report help) | Usual fix |
|---|---|---|
| Discovered, currently not indexed | Google knows the URL but delayed crawling, typically to avoid overloading the site | Server capacity and response time; fewer low-value URLs competing for crawl; stronger internal links |
| Crawled, currently not indexed | Fetched but not indexed; "no need to resubmit" | Usually quality or duplication (Practitioner reading): merge thin pages, add unique substance, strengthen links from relevant pages |
| Duplicate, Google chose different canonical than user | Google thinks another URL is the better canonical | Align every signal to one URL, or make the pages genuinely distinct |
| Alternate page with proper canonical tag | Working as intended | None |
| Excluded by noindex / Blocked by robots.txt | Your own directive | Confirm it is intentional |
Read this report by sitemap (one sitemap per template) so a failing template stands out.

## Sitemaps
- Only canonical, indexable, 200-status URLs. A sitemap listing redirects, noindexed or canonicalized-away URLs teaches Google to distrust it.
- Split by type (pages, posts, products) so Search Console's indexing report shows which template is failing. (Practitioner)
- `lastmod` changes only when main content, structured data or links change. Bumping it site-wide on every deploy trains Google to ignore it.
- Reference sitemaps in robots.txt (`Sitemap: https://example.com/sitemap.xml`) and submit in Search Console and Bing Webmaster Tools.

## International (hreflang)
- Use one method only: `<link rel="alternate" hreflang>` in head, HTTP headers, or sitemap.
- Every page lists every alternate including itself; every link is returned. Missing return links void the pair.
- Codes: ISO 639-1 language, optional ISO 3166-1 alpha-2 region. `en-GB` not `en-UK`; no `eu`; a region alone is invalid. Add `x-default` for the selector or global page.
- Each language version canonicals to itself, never to the English version.
- Do not force-redirect by IP. Googlebot's default crawl IPs appear US-based, and Google recommends separate locale URLs with hreflang over locale-adaptive serving (Official, Google locale-adaptive pages doc, fetched 2026-10-09). Offer a dismissible locale suggestion banner instead.

## Do and don't
- Do: one canonical host (https, one of www or apex) with 301s from the others. Don't: serve the same site on both with canonicals only.
- Do: keep URLs stable for years. Don't: change slugs for "freshness".
- Do: log-file analysis by user agent, verified against published IP ranges. Don't: trust user-agent strings alone; they are spoofed.
- Do: fix INP by breaking up long tasks (handled in design-frontend). Don't: sell a CWV project as a ranking project.

## Worked examples
**1. Next.js marketing site with a client-rendered blog.** Problem: blog posts render in the browser from an API. Google will likely index them after a render delay; ChatGPT, Claude and Perplexity crawlers will see an empty shell. Choice: move the blog to static generation with incremental revalidation, ship title, meta description, canonical and JSON-LD in the server HTML, generate `sitemap.xml` from the CMS with real `lastmod`, verify with curl as GPTBot. Result: identical content for every crawler on first byte.

**2. Staging got indexed.** Wrong fix: add `Disallow: /` to staging robots.txt (URLs stay indexed, now with no snippet). Right fix: put staging behind HTTP auth, serve 401 or noindex, then use Search Console Removals for a fast temporary hide while the 401s drop the URLs. Add a pre-deploy check that production never ships the staging robots.txt or a sitewide noindex.

**3. Migration to a new domain.** Start the map from the URLs that matter most: top organic landing pages (Search Console, 16 months), URLs with external backlinks (link tool export), and URLs with AI referrals or AI fetcher hits in logs. Then map every old URL to its new equivalent one to one (not to home), 301 in a single hop, keep the old domain verified, use Search Console Change of Address, update canonicals, hreflang, sitemaps and internal links on day one, keep redirects at least a year (Practitioner: indefinitely if cheap).

## Hand-offs
- design-frontend owns implementation of CWV (image sizing, font loading, long tasks, layout shift). Targets here match the shared foundation contract and web.dev.
- design-ux: infinite scroll and load-more need crawlable paginated fallbacks (see 04).
- URL design for API-driven pages and server status codes: engineering, out of scope for design-kb.
