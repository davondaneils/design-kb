# On-page and content structure

Facts current to 2026-10-09. Sources in `kb/research/search/02-on-page-content.md`.

## Principles
1. **Write the page that deserves to be cited, then make it easy to lift.** Google's 2026 AI guide names non-commodity content (first-hand experience, a real point of view, original data) as likely the most influential long-run factor (Official). Structure only helps content that is worth quoting.
2. **One page, one job, one main title.** A page answers one primary intent. Its `<title>`, H1, URL, and first paragraph agree on what that intent is.
3. **Answer first, then earn the scroll.** Put the direct answer or the core offer in the first screen, then the evidence, then the depth. (Practitioner consensus; consistent with Google's guidance to keep main content clear and visible.)
4. **Trust is the point of E-E-A-T.** E-E-A-T is not a ranking factor; trust is the most important element (Official, Google 2026-10-05). Show who made it, how, and why.

## Decision rules

### Query and intent selection (do this before writing)
- Search the target query and read the live results page: what Google ranks reveals the intent (guides, product pages, local pack, tools, videos). Match the format that wins, then beat it on substance. (Practitioner consensus)
- One page per intent, not per keyword variant. Google says its systems match synonyms and meaning, and mass-producing pages for query variations can violate the scaled content abuse policy (Official, AI optimization guide 2026-05).
- Note whether an AI Overview shows. If yes, decide: is this a citation page (definition, fact, short answer) or a click page (tool, data, comparison, template)? Plan the asset accordingly (see 05).
- Prioritize by business value and ability to satisfy, not volume alone. A 50-search query from buyers beats a 5,000-search query from students. (Opinion)

### Title element
- Format: `Primary topic or offer: distinguishing detail | Brand`. Brand at the end on inner pages; brand first only on the home page.
- Put the words that distinguish this page from its siblings in the first 50 to 60 characters, because results truncate by pixel width (Practitioner rule; Google sets no limit).
- If two pages would get near-identical titles ("micro-boilerplate"), either the pages should merge or the titles need the distinguishing attribute (city, model, size, year).
- No dates in titles unless the visible page shows the same date and the content truly changes on that cadence; mismatched dates trigger rewrites (Official).
- Title and H1 may differ: title is for the results page (scan, compare), H1 is for the page (confirm, orient). They must describe the same thing.

### Meta description
- Write one for every template that matters; Google uses it when it describes the page better than any passage (Official).
- Lead with the concrete facts a searcher compares: price from, who it is for, key spec, location, date, author. About 120 to 150 characters before truncation (Practitioner).
- Large catalogs: generate from fields ("{Product} in {color}, {spec}. From {price}. Free returns.") as long as the output reads naturally and varies.

### Headings and body
- One H1. H2s are the questions or tasks a reader has, in reader language. H3s only under H2s. Headings are an outline, not styling (also an accessibility requirement under WCAG 2.2 AA; see design-frontend).
- Under each H2, the first sentence answers the heading directly and can stand alone if quoted. Then support it.
- Put decision data in real HTML tables (`<table>` with `<th>`), not images or tabs that hide content.
- Do not hide primary content in accordions or tabs that need clicks; Google advises keeping content visible for deep links (Official). Accordions are acceptable for secondary FAQ-style detail.
- Images: descriptive file names and alt text that says what the image shows in context; alt text is both accessibility and image search. Decorative images get empty alt.

### Showing experience and trust
- Byline linking to an author page with real credentials and other work. Never fabricated authors or AI-generated headshots (Official, flagged by Google).
- "How we tested" or "How we made this" block on reviews, comparisons and anything AI-assisted.
- Original assets: your own photos, measurements, screenshots, pricing data, customer numbers. These are what commodity pages cannot copy.
- Update dates only when content substantially changes; show "Updated" with what changed for YMYL topics. Fake date refreshes are a spam pattern (Official; and observed in sites hit in January 2026, Practitioner).

## Numbers
| Item | Value | Basis |
|---|---|---|
| Title visible portion | about 50 to 60 characters | Practitioner, pixel truncation |
| Meta description visible | about 120 to 150 characters | Practitioner |
| Word count target | none; "no preferred word count" | Official |
| Lab effect of adding quotations / statistics / citations on generative engine visibility | +41% / +31% / +27% | Measured, KDD 2024 lab, older models |
| Keyword stuffing | -8% in the same lab | Measured |

## Do and don't
- Do: "Invoicing software for agencies: pricing from $19/month | Ledgerly". Don't: "Pricing | Ledgerly" (vague) or "Invoice Software, Invoicing App, Best Invoice Tool 2026" (stuffed).
- Do: one page per real intent. Don't: 200 city pages that differ only in the city name (doorway and scaled content abuse).
- Do: cite primary sources with links and quote named experts. Don't: invent statistics; answer engines and readers check.
- Do: "Best invoicing tools for agencies" where you are honest about competitors and disclose you make one. Don't: a self-ranking listicle with your product at number one on dozens of pages (visibility drops of 29 to 49% from 2026-01-20 on sites using this at scale, Practitioner observation by Lily Ray).

## Worked examples
**1. Pricing page, B2B invoicing SaaS.** Title: `Ledgerly pricing: plans from $19/month, free 14-day trial`. H1: `Simple pricing that scales with your client list`. Meta description: `Three plans from $19 to $79 per month. Unlimited invoices on every plan, no per-seat fees. Compare features and start a free 14-day trial.` Outline: H2 Plans and prices (HTML table, monthly and annual), H2 What every plan includes, H2 How we compare (honest table vs 2 named competitors with dated prices and sources), H2 Questions (billing, cancellation, VAT). Why: the table and dated competitor facts are extractable by answer engines asked "how much does Ledgerly cost" and are click-resilient because the decision needs the full comparison. Conversion structure: hand to sales-funnels; copy voice: copywriting and design-copy.

**2. Blog with impressions but no clicks.** Diagnose in Search Console: filter non-branded, sort by impressions, check average position and whether queries show AI Overviews. If position 1 to 3 and CTR low on informational queries, the answer is being satisfied on the results page (Ahrefs 2026-02 modeled about 58% lower position 1 CTR where AI Overviews show). Moves: rewrite titles to promise what the overview cannot give (a template, calculator, dataset, worked example), add original data, and shift effort to pages whose value requires the visit. Do not chase CTR with clickbait; titles that misdescribe get rewritten.

## Hand-offs
- design-copy and copywriting own voice and persuasion; this chapter owns the search contract of the page.
- design-typography and design-layout own visual hierarchy; the H1 must also be the visually dominant title (Google uses prominence).
- website-strategy: intent and audience come from positioning work; do not write pages for queries the business cannot satisfy.
