---
name: design-search
description: Search visibility for websites and apps, covering classic SEO and AEO (answer engine optimization for Google AI Overviews, AI Mode, ChatGPT search, Perplexity, Copilot, Claude). Use for technical SEO (crawling, indexing, canonicals, robots.txt, noindex, sitemaps, redirects, JavaScript rendering, hreflang, Core Web Vitals as a ranking input), on-page work (title tags, meta descriptions, headings, content structure, E-E-A-T, helpful content), schema.org structured data and rich results, site architecture, URL design, internal linking, faceted navigation and pagination, getting cited by AI answer engines and LLMs, AI crawler and robots.txt policy (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended), llms.txt questions, local SEO and Google Business Profile, and SEO or AI visibility measurement and reporting (Search Console, Bing Webmaster Tools, GA4). Trigger on phrases like "SEO", "rank on Google", "show up in ChatGPT", "AI Overviews", "GEO", "AEO", "schema markup", "site migration", "why isn't my page indexed", "meta tags", "local pack", "SEO audit", "SEO report". Not for paid search ads, or for copy persuasion (use copywriting) or funnel design (use sales-funnels).
---

# design-search

Facts in this skill are current to **2026-10-09**. Search, and AI search especially, changes monthly. Before giving advice that depends on a platform behavior, check the date on the fact in `references/` and say how old it is. Review due 2027-01-09.

## How to use this skill
1. Pass the fundamentals gate below. Any failure is reported first and fixed first; nothing else earns credit until the gate passes.
2. Apply the decision rules for the task.
3. Add the expert moves that fit.
4. Label every non-obvious claim with its evidence level and date (see Evidence rule).
5. Read the matching reference file when the task goes deeper than this page.

## Evidence rule (non-negotiable)
Every claim about how a search or answer engine behaves carries one label and a date:
- **Official**: the platform documents it (Google Search Central, OpenAI, Anthropic, Perplexity, Bing docs).
- **Measured**: controlled or large-sample study with a stated method.
- **Correlational**: large-sample association, no causation.
- **Practitioner**: a named expert's field observation or opinion.
- **Speculation**: no evidence. Say so, or leave it out.
Never present Correlational, Practitioner or Speculation as fact. Never promise rankings, AI Overview inclusion or ChatGPT mentions. No third party has access to Google's ranking systems (Official, Google AI optimization guide, 2026-05).

## Fundamentals gate (all must pass)

**Indexability**
1. Every page that should rank returns 200, is not blocked in robots.txt, has no noindex, and is linked internally with a real `<a href>`.
2. Every page that should not rank is handled with the right tool: noindex (crawlable), 404/410, 301, canonical, or auth for staging. Never robots.txt Disallow plus noindex on the same URL (the noindex is never seen).
3. One canonical URL per piece of content. Internal links, sitemap, canonical tag, hreflang and redirects all point to it. One protocol and host (https, www or apex) with 301s from the rest.
4. Primary content, title, meta description, canonical and JSON-LD are in the server-rendered HTML. Most AI crawlers do not run JavaScript (Measured, Vercel 2024-12).
5. XML sitemap lists only canonical 200 URLs; `lastmod` only on real change.
6. Mobile parity: the mobile version carries the same primary content, title, meta description, structured data, robots meta and alt text as desktop. Google indexes the mobile version (Official, 2025-12).

**Page contract**
7. Unique, descriptive `<title>` per page; distinguishing words first; brand last on inner pages.
8. One visible H1 that is the most prominent text and agrees with the title. Headings form a true outline.
9. The page answers one intent, chosen by reading the live results page for that query (one page per intent, not per keyword variant), and the answer or core offer is near the top.
10. Images have descriptive alt text (decorative images empty alt); links have descriptive anchor text. These double as the WCAG 2.2 AA floor in the shared foundation contract.

**Integrity**
11. Structured data, where used, is valid and matches visible content. No self-serving review markup.
12. No spam patterns: no scaled near-duplicate pages, doorway city pages, keyword stuffing, fake date refreshes, fabricated authors, hidden text, or bought links (Official, Google spam policies, 2026-08).
13. Measurement baseline exists before changes: Search Console and Bing Webmaster Tools verified, analytics capturing conversions.

Performance: Core Web Vitals at the 75th percentile, LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less (Official, web.dev). Report misses, but treat CWV as a ranking tiebreaker, not a growth plan (Official, Google page experience doc, 2026-09). Implementation belongs to design-frontend.

## Core decision rules

### URL handling
| Situation | Do |
|---|---|
| Moved | 301 in one hop to the closest equivalent; update internal links |
| Gone | 404 or 410, never redirect everything to home |
| Variant or duplicate | rel=canonical (absolute, in `<head>`) to the main URL |
| Keep out of index | noindex, left crawlable |
| Infinite crawl space you never want indexed | robots.txt Disallow on the pattern |
| Staging | HTTP auth, not robots.txt |
| Empty filter combination or impossible page number | 404 (Official, 2025-12) |
| Paginated list | each page self-canonical, plain links between pages |

### JavaScript sites
SSR or static generation for every indexable route. Links are `<a href>`, History API routing (no `#/` routes), noindex never in initial HTML of an indexable page, exactly one canonical in server HTML. Verify with `curl -A "GPTBot"` and Search Console URL Inspection.

### Titles and snippets
`Primary topic or offer: distinguishing detail | Brand`. Distinguishing words in the first 50 to 60 characters (Practitioner; Google sets no limit). Meta description leads with comparable facts (price, audience, spec, place, date) in about 120 to 150 characters (Practitioner). Dates in titles only if the visible page shows the same date.

### Structured data
Mark up only for a nameable payoff, from Google's current gallery (25 features as of 2026-06-15: Article, Breadcrumb, Product, Local business, Organization, Review snippet, Event, Job posting, Video, Recipe, Software app, Profile page, Discussion forum, Q&A, Dataset, and others). Gone: HowTo (2023), FAQ rich results (removed for all sites 2026-05-07), seven types cut in 2025-06, more in 2025-11. JSON-LD, server-rendered, one connected `@id` graph. Schema produced no measurable AI citation lift in the only controlled study (Measured, Ahrefs 2026-05); do not sell it for AI.

### Architecture
Topic hubs with focused child pages; children link back and to 2 to 5 siblings. Every indexable page within about 3 clicks (Practitioner) and linked at least once (Official). Readable, lowercase, hyphenated, stable URLs. One page per real service and per real location; service x city pages only with distinct local substance (otherwise doorway abuse).

### AI answer engines
- AI Overviews and AI Mode need nothing beyond indexing and snippet eligibility (Official, 2025-12). They use query fan-out over sub-questions (Official).
- Crawlers are separable: allow search bots (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot); training bots (GPTBot, ClaudeBot, Google-Extended) are a business choice. Google-Extended covers "AI training and grounding in other Google systems", not Search, so it does not affect AI Overviews; only nosnippet, data-nosnippet, max-snippet or noindex do, and they also cut classic snippets (Official).
- Check CDN and WAF bot settings; they can override robots.txt.
- Skip for Google: llms.txt, chunking, AI-specific rewriting, manufactured mentions, AI schema (Official, Google AI optimization guide, 2026-05-15, updated 2026-07-10).

### Local
Business Profile name equals the real-world name (no keywords, Official), most specific primary category, fewest secondary categories, storefront vs service-area set correctly, one profile per staffed location, real hours, steady unincentivized reviews with replies. Location page per profile with matching NAP and LocalBusiness schema.

## Expert moves (layer these once the gate passes)
1. **Split citation pages from click pages.** Where AI Overviews show, position 1 CTR is about 58% lower than expected (Measured, Ahrefs 2026-02); users clicked links inside AI summaries on 1% of visits (Measured, Pew 2025-07). Make definition and fact pages easy to cite, and invest in click-resilient assets the answer cannot replace: calculators, configurators, original datasets, templates, full comparison tables, pricing detail.
2. **Mine Bing grounding queries.** (Practitioner technique.) Bing Webmaster Tools AI Performance (preview since 2026-02) exposes the rewritten queries Copilot actually searched. They show fan-out phrasing. Build or extend pages for the sub-questions you have no answer to.
3. **Corroborate, do not self-assert.** AIO brand visibility tracks branded web mentions (rho 0.664) far more than backlinks (0.218) (Correlational, Ahrefs 2025-05). Keep a dated brand fact sheet and make the site, Organization schema, Business Profile, LinkedIn, review sites and partner pages agree. Earn presence on the third-party pages engines already cite for your category.
4. **Redirect hallucinated URLs.** ChatGPT and Claude fetchers hit 404 on about 34% of requests vs 8% for Googlebot (Measured, Vercel 2024-12). Pull 404s with AI referrers or AI user agents from logs and 301 recurring ones.
5. **Block training, allow search** when a publisher wants visibility without feeding training sets. Template in `references/05-aeo-ai-search.md`.
6. **Never deindex with robots.txt.** Serve noindex or 404 first, wait until dropped, then block if crawl waste matters.
7. **Faceted nav by demand.** Index only facets with real search demand and unique copy; Disallow parameter patterns for the rest; 404 empty combos. Canonical alone is a weak crawl control (Official, 2025-12).
8. **Prune and merge.** Near-duplicate siblings split signals and trigger Google title rewrites ("micro-boilerplate", Official). Merge into one strong page and 301.
9. **Link from pages that already earn links.** Add contextual internal links from top pages by referring domains to the money page needing lift.
10. **Agents read the accessibility tree** (Official, 2026-05). Semantic HTML, labeled controls and accessible forms make the site usable by browser agents; this is the WCAG 2.2 AA work design-frontend already owns.
11. **Prompt panels, not screenshots.** 30 to 50 prompts across journey stages, each run 3 to 5 times in a 24 to 72 hour window, logged by engine, location, language and login state (Practitioner, Aleyda Solis 2026-09). Single answers vary.
12. **Avoid the 2026 traps.** Self-promotional "best X" listicles at scale saw visibility drops of 29 to 49% from 2026-01-20 (Practitioner, Lily Ray). "Summarize with AI" buttons that steer the model are prompt injection and treated as spam (Practitioner report, 2026-05). Keywords in a Business Profile name correlate with rank in surveys but violate guidelines.

## Workflows

**SEO audit:** gate items 1 to 13 in order, using Search Console Pages report, URL Inspection, a crawl (Screaming Frog or Sitebulb), curl as GPTBot, Rich Results Test, and server logs. Output: fundamentals failures first, ranked by traffic at risk, then expert opportunities, each with owner and evidence label.

**New site or redesign launch:** URL map and redirects (one-to-one, one hop), SSR, titles and H1 per template, schema per template, sitemap, robots.txt (production, not staging), canonical host, analytics and Search Console before launch, crawl the staging build behind auth, post-launch check of 404s and indexing for 4 weeks.

**AEO plan:** access (robots, WAF, server HTML) > baseline prompt panel > gap diagnosis (accessible, extractable, fresh, corroborated, transactable) > owned pages > earned presence > monthly measurement. See `references/05-aeo-ai-search.md`.

**Traffic drop:** tracking > brand vs non-brand > impressions vs CTR (results page change, not rank) > indexing by template > template losses > seasonality > update overlay. See `references/06-local-and-measurement.md`.

**Local:** profile, categories, location and service pages, reviews, listings, schema. See `references/06-local-and-measurement.md`.

## Reference map
| Need | Read |
|---|---|
| Status codes, canonicals, JS SEO, sitemaps, hreflang, CWV, migrations | `references/01-technical-seo.md` |
| Titles, descriptions, headings, E-E-A-T, content structure, spam lines | `references/02-on-page-content.md` |
| Schema types by page, gallery, deprecations, JSON-LD graph | `references/03-structured-data.md` |
| IA, URLs, internal links, facets, pagination | `references/04-architecture-linking.md` |
| AI crawlers, AEO decisions, evidence on citations and clicks, what not to sell | `references/05-aeo-ai-search.md` |
| Business Profile, local pages, reporting stack, GA4 AI channel, KPIs | `references/06-local-and-measurement.md` |

## Hand-offs
- **website-strategy**: positioning, audience, and which intents the business should own. Search follows strategy.
- **copywriting** and **design-copy**: voice and persuasion of titles and pages.
- **sales-funnels**: what happens after the click.
- **design-frontend**: SSR, Core Web Vitals, semantic HTML and WCAG 2.2 AA.
- **design-ux**: navigation labels, IA testing, infinite scroll patterns.
- **Engineering (out of scope)**: content model feeding pages and JSON-LD, slugs, redirect tables, tracking.
- **design-typography** and **design-layout**: the H1 must be the visually dominant title.
