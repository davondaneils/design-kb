# Research 01: Technical SEO

Researched 2026-10-09. Evidence labels used across all search research: **Official** (vendor documentation), **Measured** (controlled or large-sample study with method), **Correlational** (large-sample association, no causation), **Practitioner** (named expert opinion or field observation), **Speculation**.

## Key findings

| # | Claim | Source (doc date) | Label |
|---|---|---|---|
| 1 | Canonical signals by strength: redirects (strong), rel=canonical in `<head>` or HTTP Link header (strong), sitemap inclusion (weak). | Google, Consolidate duplicate URLs | Official |
| 2 | Do not canonicalize with robots.txt, URL removal tool or noindex. Use absolute URLs, self-referencing canonical, one method not two, canonical in `<head>` only. Link internally to the canonical. | Same | Official |
| 3 | With client-side JS, put the canonical in the initial HTML; if JS sets it, it must match and only one tag may exist. | Google, JavaScript SEO basics (updated 2026-03-04) | Official |
| 4 | Every 200 page enters the render queue; render can be delayed. If `noindex` is in initial HTML Google may skip rendering, so removing it with JS may fail. | Same | Official |
| 5 | Google only discovers links in `<a>` with `href`. Use History API, not `#` fragments, to change content. | Same; Links crawlable doc | Official |
| 6 | SPA soft 404s: JS-redirect to a URL that returns 404, or inject noindex. | JavaScript SEO basics | Official |
| 7 | Sitemaps: max 50,000 URLs or 50MB uncompressed per file; index files for more. Absolute canonical URLs only. Google ignores `priority` and `changefreq`. `lastmod` used only when "consistently and verifiably" accurate, and only for significant changes (main content, structured data, links). | Google, Build a sitemap | Official |
| 8 | robots.txt blocks crawling not indexing; a blocked URL can still be indexed without content. Use noindex to keep out of the index. | Google, Title links doc (2025-12-10); Consolidate duplicates | Official |
| 9 | Core Web Vitals "good": LCP at or under 2.5s, INP at or under 200ms, CLS at or under 0.1, at the 75th percentile, split mobile and desktop. INP replaced FID in 2024. | web.dev, Web Vitals | Official |
| 10 | "Core Web Vitals are used by our ranking systems" but there is no single page experience signal; relevance wins; page experience matters most when many helpful pages compete. Do not chase perfect scores for SEO alone. | Google, Page experience (updated 2026-09-22) | Official |
| 11 | hreflang: HTML link, HTTP header or sitemap (equivalent). Return links required, self-reference required, absolute URLs, x-default for fallback, ISO 639-1 language plus optional ISO 3166-1 alpha-2 region; "UK" and "EU" invalid. Google does not use hreflang or `lang` to detect language. | Google, Localized versions (updated 2026-09-21) | Official |
| 12 | IndexNow endpoints: Bing, Yandex, Naver, Seznam, Yep, Amazon. Up to 10,000 URLs per POST. Google not listed. | indexnow.org FAQ | Official |
| 13 | AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, others) did not execute JS in a Vercel network study; Gemini (Googlebot infra) and AppleBot render. ChatGPT and Claude fetches hit 404 at about 34 to 35% vs 8% for Googlebot. | Vercel and MERJ, "The rise of the AI crawler", 2024-12-17 | Measured (one network, dated: recheck) |
| 14 | Mobile-first: Google indexes the mobile version; content, titles, descriptions, structured data, robots meta and alt text must match; content requiring swipe, click or typing is not seen. | Google, mobile-first indexing (updated 2025-12-10) | Official |
| 15 | Page indexing statuses: Discovered (crawl delayed, often to avoid overload), Crawled not indexed (no need to resubmit), Google chose different canonical, Alternate with proper canonical (no action). | Google Search Console help 7440203 | Official |
| 16 | Googlebot default IPs appear US-based; Google recommends separate locale URLs with hreflang over locale-adaptive serving. | Google, locale-adaptive pages | Official |
| 17 | Google AI features need nothing technical beyond being indexed and snippet-eligible; allow crawling in robots.txt and CDN config. | Google, AI features and your website (2025-12-10) | Official |

## Numbers
- LCP 2.5s, INP 200ms, CLS 0.1, p75. Sitemap 50,000 URLs / 50MB. IndexNow 10,000 URLs per request.
- Vercel crawl volume (one month, late 2024): Googlebot 4.5B, GPTBot 569M, Claude 370M, AppleBot 314M, PerplexityBot 24.4M.

## Conflicting or moving views
- Dynamic rendering: Google lists it only as a "workaround"; practitioner consensus is to prefer SSR or SSG. (Practitioner)
- Whether AI crawlers now render JS: the Vercel data is from Dec 2024. Treat "AI crawlers do not run JS" as the safe default until a newer measured study says otherwise. (Recheck by 2027-01.)

## Sources
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/title-link
- https://web.dev/articles/vitals
- https://developers.google.com/search/docs/appearance/page-experience
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://www.indexnow.org/faq
- https://vercel.com/blog/the-rise-of-the-ai-crawler
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- https://support.google.com/webmasters/answer/7440203
- https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages
