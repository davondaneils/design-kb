# Critic review: design-search

## v0.2 review (2026-10-10): reference 07, search-check.mjs, SKILL.md gate 14 to 16

Reviewed against `kb/research/search/07-page-build.md`, research 01 to 06, `kb/FOUNDATIONS.md` v0.3, design-foundations `references/accessibility.md` and the Jordan bar.

### Citation spot check (done first)
Method: the 54 unique URLs in `kb/research/search/01` to `06`, shuffled with a linear congruential generator seeded 20261010 (`s = (s*1103515245 + 12345) mod 2^31`), first 11 taken (20 percent). Each re-fetched on 2026-10-10 with WebFetch and checked against the claim it supports.

| # | URL | Claim checked | Result |
|---|---|---|---|
| 1 | developers.google.com/search/docs/appearance/ai-features | No extra requirements for AI Overviews and AI Mode; fan-out; nosnippet, data-nosnippet, max-snippet, noindex controls | Pass (quote present, page updated 2025-12-10) |
| 2 | developers.google.com/.../ecommerce/pagination-and-incremental-page-loading | rel next/prev unused; each page its own canonical; `<a href>` links between pages | Pass ("Google no longer uses these tags") |
| 3 | apiserpent.com/blog/ai-overview-citations-vs-rankings-overlap | Overlap 76% (Ahrefs Jul 2025), 38% (Mar 2026), 17% (BrightEdge) | Pass (tier 5 compilation, labelled correlational) |
| 4 | developers.google.com/.../sitemaps/build-sitemap | 50,000 URLs or 50 MB; priority and changefreq ignored; lastmod only when accurate | Pass |
| 5 | searchengineland.com/...-456969 | Seven rich result types dropped, announced 2025-06-12 | Pass |
| 6 | searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/ | AI Performance preview Feb 2026; grounding queries; one page 69% of 19,717 citations | Pass |
| 7 | support.claude.com/en/articles/8896518 | ClaudeBot, Claude-User, Claude-SearchBot roles; robots.txt honored; Crawl-delay | Pass |
| 8 | searchenginejournal.com/...566529/ | Listicle sites down 29 to 49% from about 2026-01-20 | Pass on numbers; **overstated in SKILL.md**: Ray names listicles as one possible factor among scaled and AI-written content (fix 1) |
| 9 | developers.google.com/.../crawling-managing-faceted-navigation | Disallow facets; `&` separator; 404 empty combos; canonical weaker long term | Pass (updated 2025-12-18) |
| 10 | techwyse.com/news/ai-search/google-faq-rich-results-deprecated-2026 | FAQ rich results removed for all sites 2026-05-07 | Pass (also confirmed on Google's FAQPage doc today) |
| 11 | remoteworkeurope.eu/news/2026/conductor-... | AI referrals 1.08%; ChatGPT 87.4%; 13,770 domains, 3.3B sessions | Pass |

Batch result: **pass** (no wrong quote or URL; one strength-of-claim fix). New research 07 rows were fetched today by the same session; the critic re-read four of them independently with different prompts (favicon formats, Googlebot 2 MB, carousels beta, product snippet single-product rule): all four hold. The favicon format list was asked twice because it contradicts the common belief that SVG works in Google; the exact sentence came back both times.

### 1. Fundamentals gate
- Numbers re-run: search-check on both pages, both fixtures; lint on both pages and all states (results in `kb/tests/design-search.md`). The gate's own advice gets the basics right: alt, link text, outline and labels are tied to WCAG 2.2 AA and agree with design-foundations `references/accessibility.md` (no conflicting rule).
- **Miss found and fixed:** the checker failed any og:image over 5 MB, a number from memory with no fetchable source. Changed to a warning at 1 MB, labelled opinion (fix 2).
- **Miss found and fixed:** the worked example states a ZIP, hours and 5-decimal coordinates the combined page never had. Fine for a fictional test, but the chapter must say they are stand-ins, or a reader copies the move "add hours to match the markup" without "from the client" (fix 3).
- Result after fixes: pass.

### 2. Claims vs research
- "Head order matters for unfurlers": supported by Slackbot's own doc (Range requests). No byte budget is documented, so the chapter states none. Pass.
- "Evergreen homepage card": supported by Facebook's caching sentence. Pass.
- Social card numbers (1200x630, safe square, type sizes): convention plus measurement here; labelled. Pass.
- Absolute dates and entity-named sentences: labelled Speculation with the zero-cost argument. Pass.
- X and LinkedIn specs: correctly left out as unverified. Pass.

### 3. Contradictions
- FOUNDATIONS: no token or scale touched. The card's 104px wordmark and 20px footnote are off the type scale; it is a raster image, not page text, and the lint does not see it. Acceptable; noted in pipeline notes as a rule FOUNDATIONS could state.
- Reference 03 said "optionally ItemList for a carousel where eligible" for category pages; vague and, for products, wrong outside three regions. Fixed in 03 (fix 4).
- Description stays a domain-reference description, not a broad trigger. Pass.

### 4. Gaps
- Checker false positives on weekday names (opening hours). Documented as a known limit (fix 5). Not worth a parser.
- Login page social card is described but not built (no login page in the test set). Left as a gap for design-product-ui.

### 5. Expert bar
Would a top practitioner learn something? Yes: the Googlebot 2 MB cut (updated 2026-02-03; many still quote 15 MB) applied to self-contained pages with inlined fonts; Google's favicon format list excluding SVG; the carousels beta as the only legitimate list-of-products markup; Lighthouse's llms.txt audit sitting next to Google Search ignoring the file; the measured square-crop failure of the first card. The weekly-H1 rule and keep-the-brand-headings rule are labelled opinion.

### 6. Style
Em dash grep (U+2014) on every changed file: zero. SKILL.md 143 lines (limit about 300). Reference 07 stands alone.

### Fix list (all applied)
1. `skills/design-search/SKILL.md` expert move 12: listicle claim now says "one possible factor" with the Sistrix source.
2. `skills/design-search/assets/search-check.mjs`: og:image size rule is a 1 MB warning labelled opinion.
3. `kb/drafts/search/07-page-build.md` and `references/07-page-build.md`: stand-in note in worked example 1.
4. `skills/design-search/references/03-structured-data.md`: homepage row and carousels beta scope.
5. Reference 07: known limit of the relative-date warning.

Verdict: **approve for rendered testing.**

---

## v0.1 review (2026-10-09)

Reviewed 2026-10-09 against `kb/research/search/*`, the shared foundation contract, and the quality bar (fundamentals gate first, then expert moves a top practitioner would learn from).

## Verdict: revise (11 fixes). All fixes applied in the same pass; re-check result at bottom.

## Fundamentals check
- Indexability, canonical, rendering, title/H1, structured data integrity, spam lines, measurement baseline: covered and sourced.
- **Miss:** mobile-first indexing parity was absent from the gate. Google indexes the mobile version; content, metadata, structured data and robots meta must match (Official, Google mobile-first doc, updated 2025-12-10). A site that hides content on mobile fails SEO before anything else. This alone fails the gate. (Fix 1)
- **Miss:** no rule for choosing which query a page targets. A strong generalist starts there; without it the page contract has nothing to agree on. (Fix 2)
- Foundation contract alignment: CWV targets (2.5 s, 200 ms, 0.1) and WCAG 2.2 AA floor are consistent. No breakpoints, tokens or motion values used, so nothing else to align.

## Accuracy findings
1. Crawler table: Bingbot row says blocking loses "engines that use Bing results". Not in research. Stated more strongly than any source. (Fix 3)
2. Worked example cites CCBot without research. (Fix 4)
3. Google-Extended described as "training and grounding in Gemini apps". Google's doc says "AI training and grounding in other Google systems". (Fix 5)
4. Self-serving review rule cited as "since 2019" from memory. Re-fetched: Google's review snippet doc states it; the year was not re-verified. (Fix 6)
5. "Googlebot crawls mostly from the US" labelled practitioner; Google's locale-adaptive doc says default IPs appear US-based and recommends separate locale URLs. Upgrade to Official with source. (Fix 7)
6. Sitelinks search box retirement (2024-10) appears in the draft but not in research notes. Add to research. (Fix 8)

## Gaps
7. No Page indexing report diagnosis ladder ("Discovered" vs "Crawled, currently not indexed" vs "Google chose different canonical"). This is the most common real question ("why isn't my page indexed") and is named in the SKILL trigger. (Fix 9)
8. Expert move "mine Bing grounding queries" rests on a single-site report. Keep it (it is the most actionable fan-out signal available) but label as Practitioner technique and note the feature is a preview. (Fix 10)
9. ChatGPT search's underlying index and partners are not documented in research. Do not claim any. Note as a known research gap in pipeline notes. (Fix 11)

## Filler and style
- No em dashes found (grep U+2014: zero).
- SKILL.md 124 lines, under the 300 limit.
- Repetition between SKILL.md and references is intentional (decision rules summarized, detail in references).

## Fix list
1. `SKILL.md` gate and `references/01-technical-seo.md`: add mobile-first parity rule with source.
2. `references/02-on-page-content.md` and `SKILL.md`: add "Query and intent selection" rules: read the live results page to infer intent, one page per intent not per keyword variant (Official: systems understand synonyms; mass-producing variant pages risks scaled content abuse), note whether an AI Overview shows to decide citation vs click strategy.
3. `references/05-aeo-ai-search.md`: Bingbot row, replace consequence with "Bing results and Copilot" only.
4. `references/05-aeo-ai-search.md` worked example 2: remove CCBot.
5. `references/05-aeo-ai-search.md` and `SKILL.md`: Google-Extended wording per Google doc.
6. `references/03-structured-data.md`: cite review snippet doc, drop the year.
7. `references/01-technical-seo.md`: IP redirect line becomes Official with locale-adaptive doc.
8. `kb/research/search/03-structured-data.md`: add sitelinks search box row.
9. `references/01-technical-seo.md`: add Page indexing report ladder with Google's definitions; add to research 01.
10. `SKILL.md` expert move 2 and reference 05: label Practitioner technique, preview feature.
11. `kb/reviews/design-search-pipeline-notes.md`: record ChatGPT index gap.

## Re-check after fixes
All 11 applied (see diffs in branch). Verdict after fixes: **approve for testing.** Would a top practitioner learn something? Yes, at least: crawler-token separation with the Google-Extended vs nosnippet distinction, the Vercel 404 redirect move, the Bing grounding-query mining, the citation vs click split with dated CTR evidence, and the dated deprecation table that kills the "add FAQ schema" reflex.
