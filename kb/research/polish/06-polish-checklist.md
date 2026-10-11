# Research: 06 Polish checklist and automation

Accessed 2026-10-09.

## Sources for the checklist
The checklist is a synthesis of research notes 01 to 05 plus the FOUNDATIONS gate. Its items cite those notes; nothing here is a new factual claim except the automation feasibility below.

## Exemplar access
Exemplar hosts were blocked again on 2026-10-09 (curl returned no connection for linear.app, vercel.com, stripe.com; see `kb/exemplars.md`). WebFetch could read Linear's and Vercel's own docs pages (text only). No exemplar CSS was measured; the ceiling sections that cite exemplars use the teams' published text (Linear blog, Vercel Geist materials) and are labelled as such. Teardowns remain the open stream.

## Automation feasibility (tested against `tools/lint.mjs` architecture: Playwright plus in-page `getComputedStyle`)
| Proposed check | How | Feasible | Expected false positives |
|---|---|---|---|
| Radius family | collect computed `border-*-radius` of visible elements; fail values not in {0,4,8,12,16} or at least 9999, or 50% on square elements | yes | pills sized by percentage; images clipped by parent (skip `overflow:hidden` children whose radius is inherited) |
| Nested radius | for an element with radius R and padding P, check children touching the padding edge have radius R minus P (or 0 when R minus P is 4 or less) | yes, warn only | children not flush with the padding box |
| Shadow inventory | collect distinct computed `box-shadow` values; warn above 5 distinct (excluding focus rings); fail if offsets point in different directions | yes | focus ring shadows; inset rings |
| Shadow in dark | in dark scheme, warn on shadows with alpha above 0.3 on large surfaces | yes | modal scrims |
| Forced colors edge | emulate `forcedColors: 'active'` (Playwright supports it); warn when an interactive element has no border, outline or text to show its edge | yes | text links (have text) |
| Hover gating | parse stylesheets for `:hover` rules outside `@media (hover: hover)`; warn | yes | color-only link hovers, which are harmless |
| Layout shift on state | for each focusable, measure bounding box before and after `:hover` and `:focus` (Playwright hover and focus), fail if size changes over 0.5px | yes | intentional expanding search fields |
| Icon stroke vs text | for inline SVG next to text, compare rendered stroke width (stroke-width times CTM scale) with stem width (font size times weight ratio from research 03); warn if off by more than 0.5px | yes, warn only | filled icons; logos |
| color-scheme set | fail if page has dark styles but `color-scheme` is not set on root | yes | none expected |
| Tabular numbers | warn on `td`, `th`, `.num`, `time` with digits and no `tnum` in `font-variant-numeric` or `font-feature-settings` | yes | IDs and codes |
| Heading wrap | warn on h1 to h3 without `text-wrap: balance` | yes | single-line headings |
| Sticky obscures focus | tab through, check focused rect not fully under any `position: sticky/fixed` element | yes | none expected |
| Scrollable region labelled | elements with overflow scroll or auto that overflow: need tabindex and accessible name (axe covers part as `scrollable-region-focusable`) | partly in axe | none |

Playwright `emulateMedia({ forcedColors: 'active' })` exists in the installed playwright-core 1.56 API (documented Page.emulateMedia option `forcedColors`). Not executed in this run beyond the lint itself; flagged in pipeline notes as proposals.
