# Research 05: AEO, AI answer engines, LLM citations

Researched 2026-10-09. This area moves monthly. Every row carries its date. Labels as defined in 01. Recheck by 2027-01-09.

## Official: what the platforms say

| # | Claim | Source (date) | Label |
|---|---|---|---|
| 1 | AI Overviews and AI Mode have no extra technical or content requirements; page must be indexed and snippet-eligible. No special files, markup or schema needed. | Google, AI features and your website (updated 2025-12-10) | Official |
| 2 | Both use query fan-out: multiple related searches across subtopics, which surfaces a wider set of links than classic search. | Same; AI optimization guide | Official |
| 3 | Controls: Googlebot robots.txt governs crawling for Search incl. AI features; `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex` limit what is shown; Google-Extended limits training and grounding in other Google systems (not Search). | AI features doc | Official |
| 4 | AI optimization guide: generative features run on core ranking (RAG/grounding). "AEO" and "GEO" are SEO for Search. Most influential: non-commodity content. Myths: llms.txt (Google Search does not use it), chunking, AI-specific rewriting, inauthentic mentions, special schema. Warns against third-party tools promising ranking. Mentions agents reading screenshots, DOM, accessibility tree; Universal Commerce Protocol. | Google, Optimizing your website for generative AI features, published 2026-05-15, updated 2026-07-10 | Official |
| 5 | Google claims clicks from AI Overview pages are "higher quality"; no data provided. | AI features doc | Official claim, unverified |
| 6 | OAI-SearchBot governs ChatGPT search inclusion ("sites opted out ... will not be shown in ChatGPT search answers"); GPTBot is training only; ChatGPT-User is user-triggered and robots.txt "may not apply"; changes take about 24h. | OpenAI, Overview of crawlers (fetched 2026-10-09) | Official |
| 7 | Anthropic: ClaudeBot (training), Claude-SearchBot (search quality), Claude-User (user-requested fetch). All honor robots.txt; Crawl-delay supported. | Anthropic support article 8896518 (fetched 2026-10-09) | Official |
| 8 | Perplexity: PerplexityBot (search, honors robots.txt, not used for training), Perplexity-User (user-triggered, generally ignores robots.txt). | Perplexity docs (fetched 2026-10-09) | Official |
| 9 | Search Console Generative AI performance report: launched 2026-06-03 to a subset of UK sites; impressions only (no clicks, CTR, position, queries); pages, countries, devices, dates; data from 2026-05-18. Opt-out toggle from generative AI features in testing; Google says it is not a classic ranking signal. | Google blog 2026-06; Evolv and SEO-Day reports | Official via secondary reporting |
| 10 | Bing Webmaster Tools AI Performance report (public preview, Feb 2026): citations, cited pages, grounding queries for Copilot. | Search Influence, 2026-02-12 | Official feature, secondary report |

## Measured and correlational

| # | Claim | Source (date) | Label |
|---|---|---|---|
| 11 | Users who saw an AI summary clicked a result in 8% of visits vs 15% without; 1% clicked links inside the summary; sessions ended 26% vs 16%. 900 US adults, March 2025 browsing. Google disputes method. | Pew Research, July 2025 | Measured (panel) |
| 12 | Position 1 CTR on AIO keywords modeled about 58% lower than expected without AIO (Dec 2023 vs Dec 2025, 300k keywords, GSC desktop data). | Ahrefs, 2026-02-04 | Measured (modeled) |
| 13 | AI referrals about 1.08% of site traffic; ChatGPT 87.4% of AI referrals. 13,770 domains, 3.3B sessions. | Conductor 2026 benchmarks, reported 2026-04-08 | Measured |
| 14 | Brand visibility in AIOs correlates with branded web mentions (0.664), branded anchors (0.527), branded search volume (0.392) more than DR (0.326) or backlinks (0.218). 75k brands. | Ahrefs, 2025-05-26 | Correlational |
| 15 | AI assistant citations about 25.7% fresher than organic results by publish date; ChatGPT strongest; AIO not fresher. Average cited page still about 2.9 years old. 17M citations. | Ahrefs, 2025-07-28 | Correlational |
| 16 | Overlap of AIO citations with top 10 organic ranges from about 17% to 76% depending on study, date and metric (Ahrefs Jul 2025 76%, Ahrefs Mar 2026 38%, BrightEdge 17%). | Compiled by apiserpent, 2026 | Correlational, conflicting |
| 17 | Adding JSON-LD produced no clear AI citation lift. | Ahrefs, 2026-05-11 | Measured |
| 18 | AI crawlers do not render JS (except Gemini via Googlebot, AppleBot). | Vercel, 2024-12-17 | Measured (dated) |
| 19 | Lab GEO: quotations +41%, statistics +31%, cite sources +27%, stuffing -8%. | Aggarwal et al., KDD 2024 | Measured (lab) |
| 20 | Copilot citations concentrate on very few pages: one page took 69% of a site's 19,717 citations; grounding queries read like keyword-dense rewrites (fan-out). | Search Influence, 2026-02-12 | Measured (one site) |
| 21 | llms.txt: 1 of 94,614 AI-cited URLs was an llms.txt file (Aug to Dec 2025). No major vendor officially reads it for answers. | ALLMO via Pixelmojo; Google guide | Correlational |

## Practitioner (opinion, label it)
- Lily Ray (2026-05-13 podcast; 2026-02-05 SEJ): self-promotional listicles and scaled comparison pages carry spam and FTC risk; "Summarize with AI" buttons with steering prompts are prompt injection; AI citations track organic rank.
- Aleyda Solis (2026-09-26 checklist): define 30 to 50 core prompts; run each 3 to 5 times in a 24 to 72h window; diagnose gaps as accessible, extractable, fresh, corroborated, transactable; keep a dated brand fact sheet; separate citation earning from click earning.
- Mike King / iPullRank (2025 to 2026): fan-out and passage-level retrieval mean coverage of sub-questions matters more than one keyword; specifics unverified.

## Speculation (do not present as fact)
- Exact passage length that gets cited; "LLMs prefer 80 to 150 word answers"; schema helps LLMs; llms.txt helps any engine.

## Sources
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.openai.com/api/docs/bots
- https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers.md
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://evolvagency.io/learn/generative-search/google-search-console-generative-ai-performance-reports
- https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/
- https://www.theregister.com/2025/07/22/google_ai_overviews_suppress_search/ (Pew summary)
- https://ahrefs.com/blog/ai-overviews-reduce-clicks-update
- https://remoteworkeurope.eu/news/2026/conductor-aeo-geo-benchmarks-ai-referrals-one-percent
- https://ahrefs.com/blog/ai-overview-brand-correlation/
- https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/
- https://apiserpent.com/blog/ai-overview-citations-vs-rankings-overlap
- https://ahrefs.com/blog/schema-ai-citations/
- https://vercel.com/blog/the-rise-of-the-ai-crawler
- https://arxiv.org/html/2311.09735v3
- https://www.pixelmojo.io/blogs/google-says-you-dont-need-llms-txt
- https://ppc.land/lily-ray-what-the-seo-industry-is-getting-dangerously-wrong-about-ai-search/
- https://www.aleydasolis.com/en/ai-search/ai-search-optimization-checklist
- https://ipullrank.com/resources/webinars/query-fan-out-webinar
