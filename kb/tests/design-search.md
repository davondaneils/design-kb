# Tester report: design-search v0.1

Tested 2026-10-09. Each brief answered twice: (A) as a strong generic assistant would without the skill, (B) following `skills/design-search/`. Outputs are condensed to their decisions; every decision that differs is shown.

## Rubric (each 0 to 10, total 50)
1. **Fundamentals gate** (correct indexing, canonical, rendering, page contract, integrity). A single factual error caps this at 4 and fails the brief.
2. **Evidence honesty** (dated, labelled claims; no promises; no folklore as fact).
3. **Specificity** (numbers, exact directives, tokens, dates).
4. **Expert moves** (non-obvious moves a top practitioner would use).
5. **Fit to brief** (prioritized, actionable for this business).

Pass bar: B clearly beats A on every brief and B is shippable by a top studio.

---

## Brief 1: Next.js SaaS relaunch, wants ChatGPT and AI Overviews
"We are relaunching our Next.js SaaS marketing site: pricing page, 30 feature pages, a blog rendered client-side from a headless CMS. What is the SEO plan for launch? We also want to show up in ChatGPT and Google AI Overviews."

### A: generic answer (condensed)
- Use SSR or SSG for pages "for better SEO"; Google can render JS so the blog "should be fine" but SSR is faster.
- Unique titles under 60 characters and meta descriptions of 150 to 160 characters; one H1.
- Add schema: Organization, Article, **FAQ schema on feature pages for rich results**, HowTo where relevant.
- Create a sitemap with priority and changefreq; robots.txt allowing all.
- Redirect old URLs with 301s.
- For AI: "Add an llms.txt file so LLMs understand your site", write conversational Q&A content, chunk content into short sections, use schema "so AI can parse it", build backlinks.
- Improve Core Web Vitals "to boost rankings".

### B: with skill (condensed)
- **Gate first.** Blog is client-rendered: Google renders it late; ChatGPT, Claude and Perplexity crawlers do not run JS (Measured, Vercel 2024-12), so to them the blog is empty. Move the blog to SSG with revalidation; title, description, canonical, JSON-LD in server HTML; verify with `curl -A "GPTBot"`. Mobile parity check at every foundation breakpoint. One host, https, 301s from the rest.
- **Migration:** one-to-one redirect map in one hop, no redirects to home; keep redirects at least a year; sitemap of canonical 200s only with real `lastmod` (priority and changefreq are ignored, Official); one sitemap per template so the Page indexing report shows which template fails; Search Console and Bing Webmaster Tools verified before launch; staging behind auth, not robots.txt; pre-deploy check that production does not ship staging noindex.
- **Templates:** pricing title `Ledgerly pricing: plans from $19/month, free 14-day trial`; pricing in an HTML table; feature pages one per real job, not per keyword variant.
- **Schema:** Organization and WebSite with `@id` graph, SoftwareApplication with offers, BlogPosting with Person author, BreadcrumbList. **No FAQ or HowTo for rich results: HowTo deprecated 2023, FAQ rich results removed for all sites 2026-05-07 (Official).** Schema showed no measurable AI citation lift (Measured, Ahrefs 2026-05).
- **AI visibility:** allow OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot, Googlebot in robots.txt and in the CDN or WAF bot settings. llms.txt optional and unproven; Google Search does not use it, and chunking is unnecessary (Official, 2026-05). Build a 40-prompt panel, 3 runs each; honest comparison pages with dated facts; original benchmark data; earn presence on the review sites the engines already cite (mentions correlate 0.664 vs backlinks 0.218, Correlational). Set expectation: AI referrals are about 1% of traffic in 2026 (Measured, Conductor).
- **Post-launch:** monitor 404s for 4 weeks, including AI-referred 404s (ChatGPT and Claude fetchers hit about 34% 404s, Measured), and 301 recurring ones.
- CWV: hold LCP 2.5 s, INP 200 ms, CLS 0.1 at p75 for users; it is a tiebreaker, not a growth plan.

### Scores
| Criterion | A | B |
|---|---|---|
| Fundamentals gate | 4 (wrong: FAQ and HowTo rich results, priority/changefreq, "blog should be fine") | 10 |
| Evidence honesty | 3 (llms.txt and schema-for-AI stated as fact) | 9 |
| Specificity | 6 | 9 |
| Expert moves | 3 | 9 |
| Fit to brief | 6 | 9 |
| **Total** | **22** | **46** |

Skill ignored or misled: no. Note: B did not mention preserving existing backlinks' targets in the redirect map explicitly. Gap G1.

---

## Brief 2: two-location physiotherapy clinic
"We run a physio clinic with two locations. We want to rank in the Google map pack. Our web agency also says we should add FAQ schema to every page and an llms.txt for AI search. Thoughts?"

### A: generic answer (condensed)
- Claim and verify Google Business Profiles; "add your main keywords and city to your business name" is not said, but A suggests "make sure your business name includes what you do if possible".
- Pick categories, add photos, collect reviews, post weekly updates.
- NAP consistency, local citations, location pages.
- FAQ schema: "Yes, it can win rich snippets and helps AI."
- llms.txt: "A good forward-looking step; low effort."

### B: with skill (condensed)
- **Profiles:** one per staffed location; name exactly as signage (no "Physio Northside Sports Injury" stuffing; violates Google guidelines and risks suspension, Official, even though keywords in names correlate with rank in the Whitespark 2026 survey); most specific primary category (for example "Physical therapist", checked against the categories top competitors use), fewest secondary; real hours plus holiday hours; booking link with UTM per location.
- **Ranking model:** relevance, distance, prominence; you cannot pay for local rank (Official).
- **Reviews:** ask every patient by SMS link after visit, no incentives or gating, reply to all within 2 business days.
- **Site:** `/locations/{name}` per profile with matching NAP, parking, practitioners, local reviews, map; one page per service (top local organic factor in Whitespark 2026, Practitioner survey); LocalBusiness subtype with NAP matching the profile. Initial run guessed a nonexistent `PhysicalTherapist` type; after fix G2 the skill checks schema.org, where `Physiotherapy` exists (LocalBusiness > MedicalBusiness > Physiotherapy, verified 2026-10-09).
- **FAQ schema:** no. FAQ rich results stopped appearing for all sites on 2026-05-07 (Official). Keeping existing markup is harmless; adding it to every page is wasted effort. A real FAQ section on the page is still good content.
- **llms.txt:** optional, harmless, unproven. Google Search does not use it (Official, 2026-05); 1 in 94,614 AI-cited URLs was an llms.txt (Correlational). Spend the time on reviews and location pages, which feed both the map pack and AI answers (Google names Business Profile as an input for AI responses, Official 2026-05).
- **Measure:** Business Profile calls, direction requests and bookings by location; GSC non-branded clicks; GA4 AI channel.

### Scores
| Criterion | A | B |
|---|---|---|
| Fundamentals gate | 3 (name advice risks suspension; FAQ claim wrong) | 10 |
| Evidence honesty | 3 | 9 |
| Specificity | 5 | 9 |
| Expert moves | 3 | 8 |
| Fit to brief | 6 | 9 |
| **Total** | **20** | **45** |

Skill misled: the skill gave "Dentist, Plumber" examples only and no rule for checking that a subtype exists, so the first run invented one (a fundamentals miss, caught here). Gap G2. Scores shown are after the fix.

---

## Brief 3: ecommerce traffic down 30%, rankings stable, faceted URLs
"Outdoor gear store, 8,000 products. Filters create millions of URLs. Organic traffic is down 30% year on year but our rank tracker says positions are stable. Diagnose it and give us a monthly report format."

### A: generic answer (condensed)
- Possible causes: algorithm update, seasonality, tracking issues, competitors, technical issues.
- Faceted URLs: canonical all filtered pages to the parent category; use rel next/prev for pagination.
- Check Core Web Vitals, backlinks lost, content quality.
- Report: traffic, rankings, conversions, backlinks, CWV.

### B: with skill (initial run, condensed)
- Faceted: index only facets with demand and unique copy; Disallow parameter patterns for the rest; 404 empty combinations; canonical alone is weak crawl control (Official 2025-12). Pagination self-canonical, plain links; rel next/prev unused by Google (Official).
- Traffic down with stable positions: check whether AI Overviews now show on top queries (position 1 CTR about 58% lower where they show, Measured, Ahrefs 2026-02); branded vs non-branded split with the GSC branded filter; annotate core updates.
- Report: the 5-page format from the measurement reference.

B initial scored well but the diagnosis was a list of two causes, not an ordered ladder, and it did not cover out-of-stock and discontinued product handling, which is the most common self-inflicted ecommerce loss. Gaps G3 and G4.

### B after gap fixes (condensed additions)
- **Diagnosis ladder, in order:** (1) tracking break: compare GA4 to GSC clicks; if GSC is flat and GA4 fell, it is analytics, not SEO. (2) Branded vs non-branded split. (3) Impressions vs CTR: impressions flat and CTR down on stable positions means the results page changed (AI Overviews, shopping units, more ads), not your ranking. (4) Indexing: Page indexing report by sitemap; millions of facet URLs show as "Discovered, currently not indexed" eating crawl. (5) Template-level losses: compare categories vs products vs blog. (6) Seasonality: compare same weeks year on year. (7) Updates: annotate core and spam updates.
- **Products:** temporarily out of stock stays 200 with `availability` OutOfStock and alternatives; permanently discontinued 301 to the closest replacement or the parent category if none.
- Rank trackers sample one location and device; "stable" positions can hide lost SERP real estate. Trust GSC.

### Scores (after fixes)
| Criterion | A | B |
|---|---|---|
| Fundamentals gate | 4 (canonical-everything for crawl control and rel next/prev are outdated advice) | 10 |
| Evidence honesty | 5 | 9 |
| Specificity | 4 | 9 |
| Expert moves | 3 | 9 |
| Fit to brief | 5 | 9 |
| **Total** | **21** | **46** |

---

## Trigger check
- Fires on: all three briefs (phrases "SEO", "ChatGPT", "AI Overviews", "map pack", "schema", "organic traffic", "faceted"). Also on "why isn't my page indexed", "site migration", "SEO report".
- Stays quiet on: "design a color palette for a fintech app" (design-color), "write a sales page" (copywriting), "build a webinar funnel" (sales-funnels), "Google Ads keyword bids" (excluded in description). Borderline: "write a blog post about X" triggers design-copy first; design-search should only add the page contract. Acceptable.

## Gap list (sent back to domain-specialist; all fixed in this pass)
- **G1** Migration: redirect map must prioritize URLs with external backlinks and top organic landing pages. Fixed in `references/01-technical-seo.md` worked example 3.
- **G2** LocalBusiness subtype: add a rule to verify the subtype exists on schema.org and fall back to the nearest parent. Fixed in `references/03-structured-data.md` and `references/06-local-and-measurement.md`.
- **G3** Traffic drop diagnosis ladder. Fixed in `references/06-local-and-measurement.md` and summarized in `SKILL.md` workflows.
- **G4** Out-of-stock and discontinued product handling. Fixed in `references/04-architecture-linking.md`.

## Result
All three briefs: B beats A by 23 to 25 points; B is shippable. **Pass.**
