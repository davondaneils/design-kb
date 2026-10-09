# Research 02: On-page and content structure

Researched 2026-10-09. Labels: Official, Measured, Correlational, Practitioner, Speculation (defined in 01).

## Key findings

| # | Claim | Source (doc date) | Label |
|---|---|---|---|
| 1 | Every page needs a `<title>`; descriptive, concise, no boilerplate, no stuffing. Brand at start or end with a delimiter; fuller brand statement only on home. Main title should be the most prominent text (first visible H1). No length limit; display is truncated to device width. | Google, Title links (updated 2025-12-10) | Official |
| 2 | Google builds title links from `<title>`, H1 and prominent headings, og:title, prominent text, anchor text, WebSite structured data. Rewrite triggers: half-empty, obsolete dates, inaccurate, micro-boilerplate across pages, no clear main title, language mismatch, duplicated site name. | Same | Official |
| 3 | Snippets come mainly from page content matched to the query; meta description used when it describes the page better. No length limit; truncated to fit. Unique per page; programmatic generation fine for large sites if human-readable and varied. Include facts (price, author, date). | Google, Snippets doc | Official |
| 4 | "Read more" deep links: keep content visible without expanding tabs, do not force scroll on load. | Same | Official |
| 5 | E-E-A-T is not a specific ranking factor; trust is the most important element; matters more on YMYL. Who (bylines linking to background), How (explain method, especially reviews and AI-assisted work), Why (made for people). No preferred word count. Changing dates to look fresh without substantial change is a warning sign. | Google, Creating helpful content (updated 2026-10-05) | Official |
| 6 | Non-commodity content (unique point of view, first-hand experience) is described as likely the most influential long-run factor for generative AI features. Organize with clear paragraphs, sections, headings. Do not mass-produce pages for query variants (scaled content abuse). | Google, Optimizing your website for generative AI features (published 2026-05-15, updated 2026-07-10) | Official |
| 7 | No need to chunk content into small pieces, no ideal page length, no special writing for AI. | Same | Official |
| 8 | Spam policies (updated 2026-08-28): scaled content abuse "regardless of how they're created", keyword stuffing, hidden text, thin affiliation, site reputation policy, expired domain abuse, doorway abuse. | Google, Spam policies | Official |
| 9 | In a lab generative engine (GPT-3.5 over top 5 Google results), adding quotations raised visibility about 41%, statistics about 31%, citing sources about 27%; keyword stuffing lowered it about 8%. Up to 37% on Perplexity. | Aggarwal et al., GEO, KDD 2024 (arXiv 2311.09735) | Measured (lab, 2023-era models) |
| 10 | Self-promotional "best X" listicles at scale lost 29 to 49% visibility from about 2026-01-20; also had AI-scaled content, fake date refreshes, schema misuse. | Lily Ray, SEJ, 2026-02-05; Glenn Gabe and Barry Schwartz observations | Practitioner / Correlational |
| 11 | Answer-first sections, explicit criteria, self-contained tables, key facts in raw HTML improve "extractability". | Aleyda Solis, AI Search Content Optimization Checklist, 2026-09-26 | Practitioner |
| 12 | Google says it wants a single most prominent title; supports text with relevant images and video, following image and video SEO. | Google AI optimization guide | Official |

## Numbers
- No title or description character limit exists officially. Practitioner rule of thumb: put the distinguishing words in the first 50 to 60 characters of a title and the first 120 to 150 of a description, because truncation is by pixel width (Practitioner, widely used; not Google-stated).
- GEO lab: +41% quotes, +31% statistics, +27% citations, -8% stuffing.

## Conflicts
- "Chunk your content for LLMs" (many GEO vendors) vs Google 2026 "no requirement to break your content into tiny pieces". Resolution: write sections that stand alone because readers skim, not as micro-chunks. (Editorial judgment)

## Sources
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/essentials/spam-policies
- https://arxiv.org/html/2311.09735v3
- https://www.searchenginejournal.com/is-google-finally-cracking-down-on-self-promotional-listicles/566529/
- https://www.aleydasolis.com/en/ai-search/ai-search-optimization-checklist
