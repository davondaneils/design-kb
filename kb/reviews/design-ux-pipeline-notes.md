# Pipeline notes from the design-ux build

Suggestions for the editor-in-chief. Not applied to `.claude/agents/` or CLAUDE.md (owned elsewhere).

## Agent improvements
1. **Researcher: add a "fetch recipe" section.** Apple HIG and Material 3 pages render with JavaScript and return empty to WebFetch. Apple HIG text is available as JSON at `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json` (walk `primaryContentSections` for `text` nodes). Material 3 tokens can be read from the Flutter `gen_defaults/data/*.json` files; Android behavior from developer.android.com (server-rendered).
2. **Researcher: X.com does not fetch and the shared web search budget (200 per turn across parallel agents) runs out.** Budget searches per domain (for example 20) and prefer practitioners' own sites (rauno.me, emilkowal.ski, vercel.com/design/guidelines, adamsilver.io) over X threads.
3. **Critic: require an "expert-learning test" section** listing the specific lines a top practitioner would not already know. It forces the bar to be checked, not asserted.
4. **Domain specialist: require a "where this domain is usually wrong" section** (for example, retracted thumb-zone heatmaps). These myth corrections were the highest-value content.
5. **Skill architect: allow a `references/NN-review-template.md`** for domains where "review this" is a common request. It gives a fixed output shape.
6. **Tester: scoring rubric should put fundamentals as pass/fail before 1 to 5 scores**, matching the quality bar.
7. **Shared scratchpad:** parallel workers overwrote each other's helper script (`hig.py`). Ask workers to prefix temp files with their slug.

## Conflicts with FOUNDATIONS (none blocking)
1. **Touch target:** FOUNDATIONS says 44x44 preferred for touch. Android's platform minimum is 48x48 dp. The skill uses 48 dp for native Android and 44 for iOS and web. Suggest FOUNDATIONS note "48 dp on native Android".
2. **Contrast method:** Vercel guidelines (a practitioner source used here) prefer APCA over WCAG 2. FOUNDATIONS uses WCAG 2.2 ratios. The skill follows FOUNDATIONS and does not recommend APCA.
3. **Button capitalization:** Vercel uses Title Case for buttons (brand preference); GOV.UK and many web systems use sentence case; platform conventions differ. FOUNDATIONS is silent. design-copy should own this decision; design-ux defers to it.
4. **Motion durations:** practitioner guidance says UI animation under 300 ms. FOUNDATIONS "slow 300 to 400 ms" and "page 400 to 600 ms" exceed that; the skill says reserve slow and page durations for large spatial transitions, never for frequent interactions. design-motion should state the same rule.
5. **Focus ring:** FOUNDATIONS requires 3:1 for focus indicators (WCAG 1.4.11). The skill also mentions the AAA 2 px perimeter (2.4.13) as an ideal. Suggest FOUNDATIONS adopt "2 px minimum ring" as the default so color and frontend skills agree.

## Wave 2 (v0.2, 2026-10-10): suggested changes to shared files
1. **design-playbook-landing:** when the page sells (cart, subscription, booking), load design-ux `references/07-commerce-flows.md`, then `03-forms` and `02-navigation-ia`. The combined coffee baseline passed lint with three dead ends; nothing in the playbook asked for the purchase flow.
2. **tools/lint.mjs overlay check:** skip content made inert by an open modal `dialog` (WCAG 1.4.3 exempts inactive content). The test page sets `data-lint-skip="overlay"` on `<main>` while a dialog is open as a workaround.
3. **tools/lint.mjs, new check (proposal):** nav parity. Compare the set of nav link targets at 1440 and 390 (including links inside a menu disclosure); warn when a destination disappears at a breakpoint with no route.
4. **design-director:** in the self-critique loop, note that announcements while a modal is open must come from a live region inside the dialog; a page-level region is inert and silent.
5. **design-director / tester:** the render loop should render in-page states full page and only dialog states with `--viewport-only`; a viewport shot of an in-page error shows the hero.
6. **Researcher:** add verbatim quotes to the design-ux research notes 01 to 06 (07 has them), so the critic's 20 percent re-fetch can check text, not just URLs.
7. **Tester agent:** require a clean-context re-score of judged rows when the builder and judge are the same agent.
