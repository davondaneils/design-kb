# Pipeline notes from the product UI wave (design-product-ui)

Suggested changes to shared files this branch may not edit. Each names the file, the change and why. For the editor-in-chief and librarian.

## design-playbook-dashboard
1. `SKILL.md` load order item 3: replace "Product and tool UI (planned): tables, dense forms, command palettes, settings." with "**design-product-ui**: SKILL.md, then `references/01-tables.md`, `05-states-bulk.md`, `06-dashboards.md` for every dashboard; `02-find-and-command.md` and `04-shells-density.md` for multi-screen tools; `03-forms-settings.md` for settings and edit screens."
2. `SKILL.md` "Done means" item 2: add "render every state through a `?state=` parameter (or equivalent) and lint each state URL, not only the ready page." The pilot never rendered states because nothing asked for them.
3. `references/signature-moves.md`: move 4 and 7 can now cite design-product-ui references 02 and 05; add a move "Answer first: one computed sentence above the KPIs" (opinion, from `references/06-dashboards.md`).

## design-director
4. `SKILL.md` section 1 table and section 4 "Planned domains": remove "product and tool UI" from planned; add design-product-ui to the domain references list.
5. Self-critique loop step 1: "Render every state the page has, not only the default."

## design-ux
6. `SKILL.md` section 5 step 7 and `references/02-navigation-ia.md`: hand-off "tables and dense tool UI to design-product-ui (planned)" can drop "(planned)".

## design-layout
7. `SKILL.md` and `references/05-page-composition-and-density.md` "Tables and collections": add "responsive strategies and table semantics: design-product-ui `references/01-tables.md`" so the two do not drift. The 32/40/48 row heights already agree.

## design-foundations
8. `references/accessibility.md`: add two items found in this wave: (a) `aria-label` on generic `span`/`div` is prohibited; use visible `aria-hidden` text plus an sr-only full value; (b) WCAG 2.1.4 applies to `/` and `?` shortcuts, not only letters.
9. Starter utilities: the common `.sr-only { margin: -1px }` fails `tools/lint.mjs` spacing. Recommend `margin: 0` with `clip` in any shared snippet.

## tools
10. `tools/lint.mjs`: when the target is a `file://` URL with a query string and no `--json`, it tries to write `<url>.lint.json` and crashes (ENOENT). Strip the query and scheme when deriving the default JSON path. Also consider a `--states state=a,state=b` flag that lints each query variant in one run.

## Coffee test page (color pilot asset)
11. `kb/tests/design-color/coffee-with.html` "How we roast": the `ol.steps` shows the browser list marker and the `.num` numeral together ("1. 01") at 1440. Fundamentals miss (hierarchy, consistency) outside this domain's brief. Fix with `list-style: none` on `.steps` (the `ol` keeps its semantics). Not fixed on this branch because the brief limited this domain to product UI.

## Index and topic map (librarian)
12. `kb/INDEX.md`: add design-product-ui v0.1 (2026-10-09), domain reference, related: design-playbook-dashboard, design-ux, design-layout, design-typography, dataviz. Review interval: yearly, with Safari table semantics and Apple keyboard guidance rechecked each year.
13. Run `node tools/rollup.mjs` after merging `kb/status/product-ui.md`.

## FOUNDATIONS (data for the editor-in-chief, no change requested)
14. Vercel Geist uses 13px label and copy sizes (vercel.com/geist/typography, fetched 2026-10-09), off the FOUNDATIONS type scale. design-product-ui keeps UI text at 14px and meta at 12px per FOUNDATIONS; noted as a measured exemplar deviation.
