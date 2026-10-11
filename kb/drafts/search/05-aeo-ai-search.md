# AEO: AI answer engines and LLM citations

Facts current to 2026-10-09. Fastest-moving chapter in the knowledge base: recheck by 2027-01-09. Sources in `kb/research/search/05-aeo-ai-search.md`.

## Evidence ladder (use these labels in every answer)
| Label | Meaning | Example |
|---|---|---|
| Official | The platform documents it | OAI-SearchBot controls ChatGPT search inclusion |
| Measured | Controlled or large-sample study with method | Ahrefs schema DiD study, 2026-05 |
| Correlational | Large-sample association only | Brand mentions vs AIO visibility, 0.664 |
| Practitioner | Named expert's field observation | Listicle drops, January 2026 |
| Speculation | No evidence; say so or omit | "LLMs prefer 120-word answers" |

## Principles
1. **AI search is retrieval on top of search.** Google's AI Overviews and AI Mode ground on Google's core ranking systems via RAG and query fan-out (Official, 2026-05). ChatGPT, Perplexity and Claude run their own search crawlers. Being crawlable, indexed and good at classic SEO is the entry ticket.
2. **Two outcomes, two strategies: citation and click.** Being named or cited in the answer is brand exposure; the click is rarer (Pew 2025-07: 1% of visits clicked links inside AI summaries). Optimize some pages to be cited (definitions, facts, comparisons) and others to be click-resilient (tools, data, templates, configurators, pricing detail).
3. **Corroboration beats self-assertion.** AIO brand visibility correlates more with branded web mentions (0.664) than backlinks (0.218) (Correlational, Ahrefs 2025-05). Answer engines repeat what many independent sources agree on. Your site states the facts; third parties confirm them.
4. **No hacks.** Google calls llms.txt, chunking, AI-specific rewriting, manufactured mentions and "AI schema" unnecessary for Search (Official, 2026-05). Self-promotional listicles at scale and prompt-steering "Summarize with AI" buttons have drawn visibility losses and are treated as spam (Practitioner, 2026-01 to 05).

## Crawler control (all Official, fetched 2026-10-09)
| Token | Company | Purpose | Honors robots.txt | Block it and you lose |
|---|---|---|---|---|
| Googlebot | Google | Search incl. AI Overviews and AI Mode | Yes | All Google Search |
| Google-Extended | Google | Training and grounding in Gemini apps and other non-Search Google AI | Yes | Not Search, not AI Overviews |
| OAI-SearchBot | OpenAI | ChatGPT search results | Yes (about 24h to apply) | Appearance in ChatGPT search answers |
| GPTBot | OpenAI | Foundation model training | Yes | Future training inclusion only |
| ChatGPT-User | OpenAI | User-triggered fetch | May not apply | n/a |
| Claude-SearchBot | Anthropic | Search quality | Yes | Visibility in Claude search answers |
| ClaudeBot | Anthropic | Training | Yes, Crawl-delay supported | Training inclusion |
| Claude-User | Anthropic | User-triggered fetch | Yes | Claude fetching your page for a user |
| PerplexityBot | Perplexity | Search index (not training) | Yes | Perplexity results |
| Perplexity-User | Perplexity | User-triggered fetch | Generally no | n/a |
| Bingbot | Microsoft | Bing and Copilot | Yes | Bing, Copilot, and engines that use Bing results |

Decision rule: **block training, allow search** is a coherent policy for publishers who want visibility without contributing training data:
```
User-agent: GPTBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
```
To keep content out of AI Overviews you must use `nosnippet`, `data-nosnippet`, `max-snippet` or `noindex`, which also limit classic snippets (Official). Google began testing a Search Console opt-out toggle from generative AI features in June 2026 (UK subset, Official via secondary reports; check availability before advising).
Also check the CDN or WAF: "block AI bots" toggles at Cloudflare or Vercel override a friendly robots.txt.

## Decision rules
- **Rendering:** key facts (prices, specs, answers, author, dates) must be in server HTML. Most AI crawlers do not execute JS (Measured, Vercel 2024-12).
- **Page structure:** H2 per sub-question, first sentence answers it in a self-contained way, then evidence. Do this for readers who skim; do not shred pages into micro-chunks (Google: no ideal length, no chunking needed, Official 2026-05).
- **Facts, sources, quotes:** add original numbers, cite primary sources, quote named experts. Lab evidence: +27 to +41% visibility in a generative engine (Measured, KDD 2024, older models: directional only).
- **Freshness:** real updates to time-sensitive pages; AI assistant citations skew about 26% fresher than organic results, ChatGPT most (Correlational, Ahrefs 2025-07). Never fake dates.
- **Entity consistency:** one dated fact sheet (name, category, founding, pricing, locations, leaders) mirrored across site, Organization schema, Business Profile, LinkedIn, Crunchbase, Wikipedia or Wikidata where eligible, review sites, partner pages. Fix contradictions; answer engines blend sources (Practitioner, Aleyda Solis 2026-09).
- **Earned presence:** get into the third-party pages that answer engines already cite for your category (review platforms, comparison articles, communities, industry lists). Find them by running your prompts and logging cited domains. Never pay for undisclosed placements.
- **Commerce:** keep Merchant Center feeds and Business Profile current; Google names them as inputs for AI responses (Official 2026-05). Watch Universal Commerce Protocol and agent checkout (emerging, Official mention, no ranking claim).
- **Agents:** browser agents read the DOM, screenshots and the accessibility tree (Official, 2026-05). Semantic HTML, labeled controls and WCAG 2.2 AA forms make a site operable by agents; this is the same work as accessibility (design-frontend, design-ux).

## What not to sell (with the evidence)
| Tactic | Verdict | Evidence |
|---|---|---|
| llms.txt | Optional, harmless, no proven effect | Google does not use it (Official 2026-05); 1 in 94,614 AI-cited URLs was an llms.txt (Correlational) |
| Schema "for AI" | No measured citation lift | Ahrefs DiD 2026-05 |
| Chunking pages into tiny blocks | Unnecessary | Google 2026-05 |
| Self-ranking "best X" listicles at scale | Risky | Visibility drops 29 to 49% from 2026-01-20 (Practitioner, Lily Ray) |
| "Summarize with AI" buttons with steering prompts | Prompt injection, labeled spam | Practitioner report of Google and Microsoft stance, 2026-05 |
| Tools promising AI ranking | Be wary | Google 2026-05 |

## Numbers to set expectations
| Metric | Value | Source and label |
|---|---|---|
| Clicks on results when AI summary shown vs not | 8% vs 15% of visits | Pew, 2025-07, Measured |
| Position 1 CTR change where AIO shows | about -58% vs expected | Ahrefs, 2026-02, Measured (modeled) |
| AI referrals share of site traffic | about 1.08%; ChatGPT 87.4% of it | Conductor, 2026, Measured |
| AIO citation overlap with top 10 organic | 17% to 76% depending on study | Correlational, conflicting |
| Mentions vs AIO visibility | rho 0.664 | Ahrefs 2025-05, Correlational |

## Measuring AI visibility
1. Search Console Performance (Web) includes AI Overview and AI Mode clicks (Official). Generative AI report shows impressions only (rolling out from 2026-06).
2. Bing Webmaster Tools AI Performance: Copilot citations, cited pages and **grounding queries**. Grounding queries reveal the fan-out phrasing the engine actually searched; mine them for missing sub-topics. (Expert move, Practitioner)
3. GA4 custom channel "AI Search" (regex in 06), placed above Referral.
4. Prompt panel: 30 to 50 core prompts by journey stage, each run 3 to 5 times in a 24 to 72 hour window, logged by engine, location, language, logged-in state; track presence, position in answer, accuracy, cited domains, competitors (Practitioner, Aleyda Solis 2026-09). Answers vary run to run; one screenshot is an anecdote.
5. Server logs: requests by OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User; user-triggered fetches are a demand signal for those pages.

## Worked examples
**1. "Make our SaaS show up in ChatGPT and AI Overviews."** Step 1 access: robots.txt and WAF allow OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot, Googlebot; pricing and feature facts in server HTML. Step 2 baseline: 40 prompts across problem, category, comparison and brand stages, 3 runs each, logged. Step 3 gaps: where competitors are named and you are not, list the cited domains. Step 4 owned: pricing page with an HTML table, honest comparison pages vs top 3 competitors with dated facts, a use-case page per core job, original benchmark data. Step 5 earned: reviews on the 2 to 3 platforms that keep getting cited, accurate listings, a genuine analyst or community presence. Step 6 measure monthly: prompt panel, GSC, Bing grounding queries, GA4 AI channel, demo requests that mention AI in "how did you hear". Promise: improved presence over quarters, not a guaranteed placement.

**2. News publisher asks "should we block AI bots?"** Separate goals. Licensing leverage and training opt-out: block GPTBot, ClaudeBot, Google-Extended, CCBot. Audience from answer engines: allow OAI-SearchBot, Claude-SearchBot, PerplexityBot. Blocking Googlebot to avoid AI Overviews is self-harm; use `max-snippet` or `data-nosnippet` on premium sections if needed, knowing classic snippets shrink too. Recheck tokens quarterly; vendors add new ones.

## Hand-offs
- design-frontend: SSR, semantic HTML, accessibility tree quality for agents.
- design-copy and copywriting: voice of answer-first copy.
- website-strategy: category, positioning and the brand fact sheet's claims.
