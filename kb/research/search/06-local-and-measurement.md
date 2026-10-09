# Research 06: Local SEO basics and measurement

Researched 2026-10-09. Labels as defined in 01.

## Local

| # | Claim | Source (date) | Label |
|---|---|---|---|
| 1 | Local ranking rests on relevance, distance, prominence. Prominence partly from links and review count and rating. "There's no way to request or pay for a better local ranking." | Google Business Profile help, answer 7091 | Official |
| 2 | Business name must be the real-world name; no taglines, keywords, service or location descriptors unless part of the real name. Fewest, most specific categories describing what the business is. One profile per location. Service-area businesses hide address; area generally within about 2 hours' drive. Virtual offices ineligible. | Google, Guidelines for representing your business, answer 3038177 | Official |
| 3 | Keep Business Profile and Merchant Center current to appear in AI responses. | Google AI optimization guide (2026-07-10) | Official |
| 4 | LSRF 2026 local pack top factors: primary GBP category, proximity, keywords in GBP business title, physical address in city, open at time of search, high ratings, address shown (not SAB), additional categories, quantity of native reviews with text, map pin placement. Local organic top: dedicated page per service, geo relevance of content, link quality, keywords in GBP landing page title, industry links. Reviews and behavioral signals up; 3 of top 5 AI visibility factors are citation (listing) factors. | Whitespark, published 2025-11-06 | Practitioner survey |
| 5 | Note the conflict: "keywords in GBP business title" ranks highly in the survey but adding keywords violates Google guidelines and risks suspension. | Rows 2 and 4 | Conflict |

## Measurement

| # | Claim | Source (date) | Label |
|---|---|---|---|
| 6 | AI Overviews and AI Mode traffic is included in Search Console Performance under "Web". | Google AI features doc (2025-12-10) | Official |
| 7 | Generative AI performance report (2026-06-03, UK subset first): impressions, pages, countries, devices, dates; no clicks or queries; data from 2026-05-18. | Google blog; Evolv | Official via secondary |
| 8 | Branded queries filter (Nov 2025, fully rolled out by March 2026) splits branded and non-branded; works with query groups. | Google blog 2025-11; Search Engine Land 2026-03-26 | Official |
| 9 | Bing AI Performance report (Feb 2026 preview): citations, cited pages, grounding queries. | Search Influence 2026-02-12 | Official feature |
| 10 | GA4: build a custom channel group "AI Search" with regex on session source (chatgpt.com, openai.com, perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com, edgeservices.bing.com) placed above Referral. AIO clicks appear as google / organic. Copy-pasted links show as Direct. | Discovered Labs guide (2026) | Practitioner method |
| 11 | AI referrals about 1.08% of traffic (Conductor 2026). AI visitors converting at higher rates is reported (Washington Post 4 to 5x subscriptions) but cross-site evidence is thin. | Conductor via RemoteWorkEurope 2026-04-08 | Measured / anecdotal |
| 12 | Prompt tracking: 30 to 50 core prompts, 3 to 5 runs each in a 24 to 72h window, log location, language, account state. | Aleyda Solis, 2026-09-26 | Practitioner |
| 13 | Be wary of third-party tools promising ranking success; no third party has access to Google's systems. | Google AI optimization guide | Official |

## Sources
- https://support.google.com/business/answer/7091
- https://support.google.com/business/answer/3038177
- https://whitespark.ca/local-search-ranking-factors/
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://developers.google.com/search/blog/2025/11/search-console-branded-filter
- https://searchengineland.com/google-search-console-branded-query-filter-seo-reporting-analysis-472474
- https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/
- https://discoveredlabs.com/blog/how-to-track-chatgpt-perplexity-and-ai-overviews-traffic-in-ga4-without-guessing
- https://www.aleydasolis.com/en/ai-search/ai-search-optimization-checklist
