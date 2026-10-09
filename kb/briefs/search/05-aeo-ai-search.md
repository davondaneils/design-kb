# Brief 05: AEO, AI answer engines and LLM citations

Owner hat: domain-specialist (search). Status: drafting. Brief date: 2026-10-09. Fast moving: every claim must carry a date and an evidence label.

## Question it answers
How do AI Overviews, AI Mode, ChatGPT search, Perplexity, Copilot and Claude choose sources, and what actually raises the odds of being cited and clicked, as opposed to what is folklore?

## After reading, a designer must be able to decide
- Which crawlers to allow or block (search vs training vs user-triggered fetchers).
- Whether to build llms.txt, chunk content, add schema "for AI", or chase mentions.
- How to structure pages so a passage can be lifted and attributed.
- How to set expectations: CTR losses where AI Overviews show, AI referral share near 1%.
- How to measure presence without trusting vendor black boxes.

## Must cover
- Google AI optimization guide (published 2026-05-15, updated 2026-07-10) and its mythbusting list.
- Crawler table: OAI-SearchBot, GPTBot, ChatGPT-User, Claude-SearchBot, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Googlebot.
- AI crawlers do not render JS (Vercel, Dec 2024).
- Evidence on clicks: Pew (July 2025), Ahrefs (Feb 2026).
- Evidence on citations: Ahrefs brand mentions (May 2025), freshness (July 2025), overlap studies, GEO paper (KDD 2024), Bing AI Performance (Feb 2026).
- Spam risk: self-promotional listicles (Jan 2026), "summarize with AI" prompt injection.
- Evidence ladder: Official, Measured, Correlational, Practitioner, Speculation.

## Test briefs
- "Make our SaaS show up in ChatGPT and AI Overviews."
- "Should we block AI bots?"
