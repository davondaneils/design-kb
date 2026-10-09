# Brief 01: Technical SEO (crawl, render, index)

Owner hat: domain-specialist (search). Status: drafting. Brief date: 2026-10-09.

## Question it answers
Can every page that should rank be fetched, rendered, understood and indexed, and is every page that should not rank kept out cleanly?

## After reading, a designer or builder must be able to decide
- robots.txt vs noindex vs canonical vs 301 vs 404/410 for any URL.
- Whether a JavaScript framework setup is safe for Google and for AI crawlers (which mostly do not render JS).
- What goes in the XML sitemap and what lastmod means.
- Which Core Web Vitals targets to hold and how much they matter for ranking.
- hreflang setup for multi-language sites.

## Must cover
- Status codes and the indexing control decision table.
- Canonical signals ranked by strength (Google docs).
- JS SEO rules: links as `<a href>`, no fragment routing, noindex in initial HTML, one canonical.
- Sitemaps: 50,000 URLs / 50MB, lastmod only when true, priority and changefreq ignored.
- CWV: LCP 2.5s, INP 200ms, CLS 0.1 at p75; ranking weight is a tiebreaker. Align with FOUNDATIONS.md (design-frontend owns implementation).
- IndexNow for Bing and others; Google does not use it.
- hreflang return links, x-default, valid codes.

## Test briefs it should pass
- "We are launching a Next.js marketing site with client-side rendered blog. What do we need for SEO?"
- "Our staging site got indexed. Fix it."
