# design-search changelog

## v0.2 (2026-10-10)
- New `references/07-page-build.md`: search applied to a built page (head order, graph placement, social card and icons, quotable passages, app pages behind login), with worked examples on the combined coffee page and Tally dashboard. Facts rechecked against Google's docs on 2026-10-10.
- New `assets/search-check.mjs`: the page gate as a script. Local JSON-LD validation (JSON parse, schema.org vocabulary in `assets/schemaorg-vocab.json`, Google required properties, visible-content match, optional jsonld.js expansion), titles, meta, canonical, robots, headings, links, Open Graph, favicon format, head order, 2 MB cut, `--expect private` mode.
- SKILL.md: gate items 14 to 16 (built page, no fundamentals regression, private pages); expert moves 13 to 16 (product markup placement, social card crops and cache, head order and size, llms.txt and Lighthouse); listicle claim softened to match the source (one possible factor).
- `references/03-structured-data.md`: homepage row added; category page row now states the carousels beta scope (EEA, Turkiye, South Africa).
- First rendered test: `kb/tests/design-search.md` run 2.

## v0.1 (2026-10-09)
- First version: six references, critic revise (11 fixes applied), text-only test.
