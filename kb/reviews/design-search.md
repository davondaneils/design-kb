# Critic review: design-search v0.1 (draft)

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
