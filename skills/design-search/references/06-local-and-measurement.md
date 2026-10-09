# Local SEO basics and measurement

Facts current to 2026-10-09. Sources in `kb/research/search/06-local-and-measurement.md`.

## Part A: Local

### Principles
1. **Google ranks local results on relevance, distance and prominence, and you cannot pay for rank** (Official). Distance you cannot change; relevance and prominence you can.
2. **The Business Profile is the local homepage.** Its primary category is the single largest controllable factor in practitioner surveys (Whitespark 2026, Practitioner).
3. **Consistency is the trust signal.** Name, address, phone, hours and categories match across the profile, website, schema and major listings.

### Decision rules
- **Name:** the real-world name on signage and invoices. No keywords, city or tagline (Official). Keywords in the name correlate with rank in surveys (Whitespark 2026), but violate guidelines and risk suspension; never recommend adding them. If the real legal and signage name contains a keyword, that is allowed.
- **Categories:** primary = the most specific category for what the business is; add the fewest secondary categories needed (Official). Research which primary category top-ranking competitors use.
- **Storefront vs service area:** customers visit you during stated hours: show address. You travel to customers: hide address, set a service area, generally within about 2 hours' drive (Official). Virtual offices and unstaffed mail drops are ineligible.
- **One profile per real location.** Practitioners at a shared practice only under Google's specific rules.
- **Hours:** real customer-facing hours plus special hours for holidays. "Open at time of search" is a top survey factor (Practitioner); accurate hours avoid sending customers to a locked door.
- **Reviews:** ask every customer, by link, without incentives or gating; reply to all, especially negative ones, in a calm specific voice. Count, rating and text content matter (Official: prominence; Practitioner: review text with services and places).
- **Website:** one page per location with unique content and the exact NAP, embedded map, local proof (team, jobs, reviews from that area), linked from the profile. One page per service (top local organic factor, Practitioner survey). `LocalBusiness` subtype schema on each location page matching the profile. Verify the subtype exists on schema.org before using it (for example `Physiotherapy` exists under MedicalBusiness; `PhysicalTherapist` does not); otherwise use the nearest parent.
- **Citations:** consistent listings on the major data aggregators and the directories that answer engines cite for your category; 3 of the top 5 AI visibility factors in Whitespark 2026 were listing factors (Practitioner survey).

### Worked example: two-location dental practice
Two profiles, one per staffed office, primary category "Dentist" (or the specific specialty, such as "Cosmetic dentist", only if that is what the office is). Names identical to signage. Website: `/locations/northside` and `/locations/riverside` each with address, hours, parking, dentists who work there, reviews from that office, and `Dentist` schema with matching NAP. Service pages `/services/implants`, `/services/invisalign` link to both locations. Review requests sent by SMS after each visit, replies within 2 business days. Booking link on profile with UTM `utm_source=google&utm_medium=organic&utm_campaign=gbp-northside` so GBP traffic is separable in GA4.

## Part B: Measurement

### Principles
1. **Measure the business outcome, then the search signals that explain it.** Leads, revenue and qualified sessions first; rankings and citations are diagnostics.
2. **Split branded and non-branded.** Brand demand masks or flatters SEO work. Use the Search Console branded queries filter (rolled out from 2025-11, Official).
3. **AI visibility is partly unmeasurable; say so.** AI Overview clicks are inside google / organic; copy-pasted answer links show as Direct; Search Console's Generative AI report has impressions but no clicks (2026-06).

### The reporting stack
| Tool | What it answers | Notes |
|---|---|---|
| Google Search Console Performance | Clicks, impressions, CTR, position by query and page | AI Overview and AI Mode traffic is included under Web (Official) |
| GSC branded filter and query groups | Brand vs non-brand trend | From 2025-11 |
| GSC Generative AI report | Which pages appear in AI Overviews and AI Mode, impressions | Rolling out from 2026-06-03, UK subset first; data from 2026-05-18; no clicks |
| GSC Indexing (Pages) report | What is indexed and why not | Watch "Crawled, currently not indexed" by template |
| Bing Webmaster Tools AI Performance | Copilot citations, cited pages, grounding queries | Preview from 2026-02 |
| GA4 custom channel "AI Search" | Sessions and conversions from AI referrers | See regex below |
| Prompt panel | Presence and accuracy in ChatGPT, Perplexity, Gemini, Copilot, AI Mode | 30 to 50 prompts, 3 to 5 runs each (Practitioner) |
| Server logs | Crawl coverage and AI fetchers | Verify bots by IP ranges |
| Business Profile performance | Calls, direction requests, website clicks | Local only |

GA4 AI channel regex on Session source (Practitioner method, 2026), placed above Referral in a custom channel group:
```
^.*(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|edgeservices\.bing\.com).*
```

### Traffic drop diagnosis ladder (run in order)
1. **Tracking:** compare GA4 organic sessions with Search Console clicks. If GSC is flat and GA4 fell, it is an analytics or consent issue, not SEO.
2. **Brand vs non-brand:** branded filter. A brand demand drop is a marketing problem, not an SEO one.
3. **Impressions vs CTR:** impressions flat, CTR down, positions stable means the results page changed (AI Overviews, shopping units, ads, other features), not your rank. Where AI Overviews show, position 1 CTR is about 58% lower than expected (Measured, Ahrefs 2026-02).
4. **Indexing:** Page indexing report per sitemap; look for template-wide drops and crawl waste.
5. **Template:** compare categories, products, blog, locations separately; losses usually cluster.
6. **Seasonality:** same weeks year on year, not month on month.
7. **Updates:** overlay Google core and spam update dates and your own releases.
Rank trackers sample one location and device; "stable rankings" can hide lost results-page space. Trust Search Console for totals. (Practitioner method; components sourced as marked)

### KPIs and what not to promise
- Report monthly: non-branded clicks and conversions, branded clicks, indexed pages by template, top pages gained and lost, AI channel sessions and conversions, prompt panel presence rate, Bing citations.
- Do not promise rankings, AI Overview inclusion, or ChatGPT mentions. No third party has access to Google's ranking systems (Official, 2026-05).
- Annotate every chart with Google core updates and site releases.
- Expect AI referrals around 1% of traffic in 2026 (Measured, Conductor); judge by conversion quality, not volume.

### Worked example: monthly SEO and AI visibility report
Page 1: outcome (organic and AI-referred leads vs last month and last year). Page 2: non-branded clicks trend with update annotations; top 10 gaining and losing pages. Page 3: indexing health by template. Page 4: AI visibility (prompt panel presence rate by stage, cited domains where competitors beat us, Bing grounding queries we have no page for, GSC Generative AI impressions if available). Page 5: next month's three actions, each tied to one finding.

## Hand-offs
- 03 structured data: LocalBusiness schema.
- design-data: event tracking and UTM conventions.
- sales-funnels: what happens after the click.
