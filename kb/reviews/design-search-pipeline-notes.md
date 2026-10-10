# design-search: suggested changes to shared files

From wave 2 (2026-10-10). This branch does not edit the files below; the editor-in-chief decides.

## design-director (`skills/design-director/SKILL.md`)
1. Section 5, self-critique loop: add a step after lint, "Search: `node skills/design-search/assets/search-check.mjs page.html` (public) or `--expect private` (app screens behind login). Fix every fail." The landing playbook already loads design-search, but nothing in the loop checks it, so v0.1 never touched a built page.
2. Section 5: add "after any semantic markup pass, pixel-diff the page against its previous render". In this wave a `<time>` wrapper and a font-feature rule moved a word in the H1 by 3px; the lint cannot see that, a diff can.
3. Section 4, build rules: "every public page ships its social card and icons, rendered from the page's own type and art at build time" (the card is an art-directed asset, not an afterthought).
4. design-playbook-landing item 10 names `02-on-page-content.md` and `03-structured-data.md`; it should name `07-page-build.md` first (it applies both to a built page).

## design-playbook-dashboard
5. Add design-search to the load order for one job only: `references/07-page-build.md`, "App pages behind login", plus `search-check --expect private`. Today the dashboard playbook never loads search, and the combined dashboard shipped without `noindex`.

## kb/FOUNDATIONS.md
6. Fundamentals checklist: consider a 16th row, "Search gate: search-check exits 0 (public or private)", `[check]`. Alternatively keep it inside design-search; the editor decides whether search is a fundamental for every page. Opinion: yes for the private-page half at least (leaking an app into search is a correctness failure, not a craft one).
7. "Findings every domain must know": add (next to the accessibility findings, or as a new short list) "Google Search's favicon formats exclude SVG (doc updated 2026-08-28); ship a PNG icon" and "Googlebot reads only the first 2 MB of uncompressed HTML (updated 2026-02-03); self-contained pages with inlined fonts must stay well under it". Both affect every page the kb builds, since the kb inlines fonts.
8. Type scale: say that raster assets (social cards, icons) are outside the type scale gate; the card's 104px wordmark is deliberate.

## tools/
9. `tools/render.mjs`: an option to render a fixed-size HTML template to an exact PNG (the social card and icons needed a separate Playwright call in `kb/tests/design-search/build.mjs`).
10. `tools/lint.mjs` `tabular` check flags `<time>` elements whose text has digits even inside a table row header; harmless, but it pushed a page-wide `time { tabular-nums }` rule that changed letter shapes. Consider skipping `th` text or documenting the scoped fix.

## Research gaps (carry forward)
11. X card and LinkedIn image specs could not be fetched (docs refused or robots disallowed on 2026-10-10). Fetch from an environment that can.
12. Exemplar heads (title patterns, og images, JSON-LD) are unmeasured; add to `kb/teardowns/` when hosts are reachable.
13. ChatGPT search's index and partners remain undocumented (carried from v0.1).
