# Polish: vertical slice test briefs

Written by the editor-in-chief, 2026-10-09. Reuses the two color pilot briefs unchanged (`kb/briefs/color/slice-test-briefs.md`, Brief A coffee roaster landing page, Brief B Tally analytics dashboard) so the gain from design-polish is measured on the same pages.

## Method
- **Baseline ("before")**: the with-skill pages from the color pilot, `kb/tests/design-color/coffee-with.html` and `dashboard-with.html`, unchanged. They already passed the gate; Davon called them "not super special".
- **After**: the same pages, rebuilt through design-director and the playbook with design-polish applied. Content and color system stay the same, so differences come from polish.
- Lint both with `tools/lint.mjs`, render both with `tools/render.mjs`, plus a state sheet render (hover, focus, pressed, disabled, loading, empty, error) for each page.

## Rubric
**Gate:** lint exits 0; every `[judged]` row holds (FOUNDATIONS checklist).

**Polish rubric (each judged pass or fail on screenshots and CSS):**
1. Radius audit: every radius from the family; nested radii computed; no near-miss values.
2. Depth audit: one separation method per boundary; shadows layered from one light source; dark surfaces step up; nothing relies on shadow alone in forced colors.
3. States: every interactive element has hover, focus-visible and pressed; disabled and loading where the page needs them; dashboard has empty, loading and error states as designed screens.
4. Icons: one family, stroke matched to adjacent text weight, optically centered.
5. Text rendering: headings balanced, tabular numbers where they align, no widows in headings, theme-matched native controls and selection.
6. Edges: no layout shift on state change or scrollbar; sticky header does not cover focus or anchors; long strings handled.
7. Surface: gradients or texture, if used, invisible as technique and without banding.

**Exemplar closeness:** compared with the same exemplars as the color pilot (family.co, mercury.com, apple.com product pages for A; Linear, Stripe and Vercel dashboards for B), on craft details only. Rated close, clearly below or far below.

**Pass** = gate 100 percent, polish rubric 7 of 7, and the after page rated better than the before page on craft.
