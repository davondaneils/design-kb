# Critic review: design-product-ui v0.1

Reviewed: `skills/design-product-ui/SKILL.md`, `references/01` to `06`, against `kb/research/product-ui/*`, `kb/FOUNDATIONS.md` v0.2, design-foundations `references/accessibility.md`, design-ux and design-layout. Drafts in `kb/drafts/product-ui/` are the pre-review specialist snapshot; the skill references carry the fixes.

## Citation spot check (before step 1)
Method: all 136 claim IDs across the six research notes listed in order; `random.seed(18)`, `random.sample(rows, 28)` in Python 3 (28 = 20.6 percent). Each URL re-fetched with WebFetch on 2026-10-09 and asked whether the exact quote appears.

| ID | URL | Result |
|---|---|---|
| B2 | primer.style/product/ui-patterns/loading/ | Found verbatim |
| B5 | same | Found verbatim |
| B12 | vercel.com/geist/empty-state | Found verbatim |
| B15 | primer.style/product/ui-patterns/degraded-experiences/ | Found verbatim |
| B16 | same | Found verbatim |
| B17 | carbondesignsystem.com/components/data-table/usage/ | Found (sentence begins "Once an item from the table is selected,") |
| B27 | vercel.com/design/guidelines | Found verbatim |
| D1 | nngroup.com/articles/dashboards-preattentive/ | Found (sentence continues "on which users can act quickly") |
| D6 | same | Found verbatim |
| D10 | vercel.com/docs/dashboard-features | Found verbatim |
| F4 | blog.superhuman.com/how-to-build-a-remarkable-command-palette/ | Found verbatim |
| F8 | vercel.com/docs/dashboard-features | Found verbatim |
| F16 | linear.app/docs/custom-views | Found (markdown backticks around keys) |
| F19 | developer.apple.com HIG keyboards (JSON endpoint) | Found; page uses a curly apostrophe in "don't". Wording identical |
| F24 | vercel.com/design/guidelines | Found verbatim |
| N4 | w3.org/WAI/ARIA/apg/patterns/tabs/ | Found verbatim |
| N5 | same | Found verbatim |
| N7 | nngroup.com/articles/breadcrumbs/ | Found verbatim |
| N16 | docs.stripe.com/dashboard/basics | Found verbatim |
| T16 | w3.org/WAI/ARIA/apg/patterns/grid/ | Found verbatim |
| T23 | adrianroselli.com (2018 tables post) | Found, in the Dec 7, 2022 update |
| T26 | nngroup.com/articles/data-tables/ | Found verbatim |
| T31 | nngroup.com/articles/mobile-tables/ | Found (a heading) |
| T32 | same | Found verbatim |
| T33 | primer.style/product/components/data-table/ | Found verbatim |
| T34 | same | Found verbatim |
| T38 | polaris-react.shopify.com/components/tables/index-table | Found verbatim |
| T42 | vercel.com/design/guidelines | Found (backticks and a link in source) |

Result: 28 of 28 confirmed. Batch passes. Caveat: WebFetch returns a model's reading of the page; a quote reported as present was checked by asking for the exact string, not by a raw HTML grep (raw fetch is blocked by the egress policy).

Known weak citations, recorded rather than failed: T36 (Carbon row sizes) is a value table, not a quote; T40 (Geist dash) wording not confirmed verbatim, glyph elided for the house rule.

## Round 1 verdict: REVISE

### Step 1, fundamentals gate (on the skill's own advice)
1. `05-states-bulk.md`: recommended `aria-checked="mixed"` as an option on a native checkbox. ARIA in HTML forbids `aria-checked` on `input type=checkbox`. **Fixed**: native `indeterminate` property; `aria-checked="mixed"` only for custom `role="checkbox"`.
2. `02-find-and-command.md`: tier 2 listed `/` and `?` as safe global keys. They are printable characters, so WCAG 2.1.4 applies. **Fixed** in fundamental 2 and the tier rule; SKILL.md fundamental 7 names them.
3. `03-forms-settings.md`: "disabled controls often cannot take focus" was vague. **Fixed**: natively disabled controls never take focus; use `aria-disabled` if the control must stay reachable.
4. `01-tables.md`: muted 12px header text had no contrast reminder. **Fixed**.

### Step 2, claims stronger than sources
5. `01-tables.md` exemplar line said Stripe tables have sortable headings; the doc says "some of which provide sorting options". **Fixed** with the quote.
6. `04-shells-density.md`: selected icon color rule leaned on Apple N17 more than it says. **Fixed**: labelled opinion, quote kept.
7. `05-states-bulk.md`: "Polaris has the props" for select all matching was not in the claim table. **Fixed**: labelled opinion, prop name stated, "no written guidance".

### Step 3, contradictions
8. `04-shells-density.md` said "below lg: drawer"; design-ux 02 says "sidebar at lg 1024+, icon rail below". **Fixed**: rail from md to lg, drawer under md.
9. Checked against FOUNDATIONS: spacing values in chapters (8, 12, 16, 24, 32, 48), type sizes (12, 14, 16, 20, 25, 31, 39), row heights (32, 40, 48), durations, breakpoints: all on scale. Widths (240, 56, 560 to 640) are layout sizes, not spacing tokens; marked opinion.
10. Accessibility rules agree with design-foundations `references/accessibility.md` (focus, 2.4.11, live regions, targets).

### Step 4, gaps
11. No rule for long tables (pagination vs virtualization), long text cells or timestamps. **Fixed** in `01-tables.md` (Geist T44 added to research).

### Step 5, expert bar
Items a strong generalist is unlikely to know: Safari drops table semantics on `display` changes (Roselli); WCAG 1.4.10 excepts the table but not the page or the cells; `/` and `?` fall under 2.1.4; route tabs are links not tablists; header and figure share an edge with the sort arrow inside; native checkbox `indeterminate` vs `aria-checked`; the palette as shortcut teacher with synonyms; switch vs checkbox as the save model signal; never disable a control because of an outage (Primer). Lines a top practitioner nods at (kept because they are gate items): right-align numbers, visible labels, skip link.

### Step 6, filler and house rules
12. Em dash grep (U+2014) across `skills/design-product-ui`, `kb/*/product-ui`: none after removing two quoted source dashes in research (F1 and T40 now elide the glyph and say so).
13. `03-forms-settings.md` worked example wording ("48,210 users of data") was unclear. **Fixed**.

## Round 2 verdict: APPROVE
All 13 items closed. Residual risks: many numbers are opinion (sidebar width, palette size, stale thresholds) and labelled so; exemplar patterns come from public docs, not measured app screenshots; the "answer line" is the specialist's opinion with no exemplar source. Send to tester.
