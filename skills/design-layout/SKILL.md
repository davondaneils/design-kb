---
name: design-layout
description: Layout, grids, spacing and visual hierarchy for web, app and graphic work. Use whenever Claude lays out or critiques a page, screen, component or composition, including "lay out", "wireframe", "structure this page", "grid", "columns", "spacing feels off", "too cramped", "too much white space", "make X stand out", "visual hierarchy", "nothing stands out", "responsive", "mobile version", "breakpoints", "sidebar", "dashboard layout", "landing page structure", "pricing page", "article layout", "card grid", "table layout", "density", "compact mode", "align", "full bleed", or when writing HTML/CSS/Tailwind/Figma frames whose arrangement matters. Not for color values (design-color), type choice (design-typography) or copy (design-copy).
---

# design-layout

Layout decides what people see first, what they see as a group, and whether the page holds from 320px to 2560px. This skill gives the rules, numbers and moves a top studio uses. Defaults follow the shared design-kb foundation contract (spacing, breakpoints, type, radius tokens). Deviate only on purpose and say why.

## 1. Fundamentals gate (non-negotiable)

Check every layout against these before anything else. One miss fails the work, however polished the rest.

**Structure**
1. Every spacing value is a foundation token: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (`--space-0` to `--space-11`). Component padding 4 to 24; layout gaps 16 and up. Off-scale values only as deliberate optical corrections.
2. Body text measure 45 to 75 characters, 66 ideal (`max-inline-size: 66ch`). Never full-width paragraphs.
3. Components have no outer margins. The parent sets gaps (`gap`, or `.stack > * + *`).
4. One alignment system per view. Count the distinct left edges; remove any that carry no meaning.

**Hierarchy**
5. One primary element and one filled primary button per view or distinct region. Secondary actions outline or muted, tertiary as links.
6. Groups are unambiguous: the gap between groups is at least 2x the gap inside a group (ideally two scale steps larger). Label to field 8, field to field 24, section to section 48.
7. Group with space first, then alignment, then a tinted region, then lines. A divider under every row is a spacing bug.
8. The squint test passes: blurred, the primary element reads first, then the groups.

**Accessibility (WCAG 2.2 AA floor)**
9. Reflow at 320 CSS px with no horizontal page scroll and no lost content (1.4.10). Only data tables, maps, video and similar regions may scroll in 2D, inside their own container.
10. Targets at least 24x24 CSS px (2.5.8); 44x44 for touch (Apple HIG 44x44 pt).
11. DOM order equals reading order; CSS reordering never changes meaning or scrambles tab order (1.3.2, 2.4.3).
12. Sticky headers and footers never fully hide a focused element: set `scroll-padding-top` to the header height (2.4.11).
13. No fixed heights on anything holding text; layouts survive 1.5 line height, 2x paragraph spacing, 0.12em letter and 0.16em word spacing (1.4.12) and 200% text zoom.
14. Hierarchy holds in grayscale; nothing is signaled by color or position alone.
15. Muted text is still readable: every text tone meets 4.5:1 (3:1 for large text). Hierarchy is never bought with failing contrast.

**Responsive**
16. Mobile first, foundation breakpoints for the page shell: sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Components adapt to their container (intrinsic CSS or container queries), not the viewport.
17. When columns stack, related items stay adjacent and the primary action stays reachable.

## 2. Workflow

1. **Name the job.** Page type, the one primary action or decision, the user (first-time or daily expert), main device. This sets density and skeleton.
2. **Pick the structure** (see table below). Write the shell first: container, columns, navigation per width.
3. **Rank the content.** List elements in priority order; assign position, space, tone, weight, then size, in that order.
4. **Space it with three tiers**: inside components, between components, between sections. Three values plus the page margin covers most views.
5. **Run the gate.** Then apply the expert moves in section 4.
6. **Test the extremes**: 320px, 400% zoom, 1920px, a landscape phone, keyboard tab-through.

When the brief is a critique ("spacing feels off"), audit in gate order, list each failure with the exact current and fixed value, then show the fixed version.

## 3. Core decision rules

### Structure by job
| Screen | Structure |
|---|---|
| Marketing, editorial | 12-col grid (4 / 8 / 12 cols), 1280px content box, gutter 16 / 24 / 32 |
| Long-form reading | Named-line content grid: 66ch body, popout and full-bleed tracks |
| App | Fixed sidebar 240 to 280px + fluid main (`minmax(0, 1fr)`); rail at md to lg; bottom bar or drawer under md |
| Collections | `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))` |
| Media + text pair | Sidebar pattern: wraps when content would drop below 50% |
| Card rows | Parent grid + `grid-template-rows: subgrid` so titles and CTAs align |

### Column grid
| Viewport | Cols | Gutter | Margin |
|---|---|---|---|
| under 640 | 4 | 16 | 16 |
| 640 to 1023 | 8 | 24 | 24 to 32 |
| 1024 to 1279 | 12 | 24 | 32 |
| 1280 and up | 12 | 32 | at least 32; content box `min(1280px, 100% - 2 * var(--space-7))` centered |

### Spacing tiers
| Tier | Values |
|---|---|
| Inside dense components (icon to text, chip, label to input) | 4 to 8 |
| Component padding (buttons, cards, cells) | 12 to 24 |
| Between components and fields | 16 to 32 |
| Between sub-sections | 48 |
| Between page sections | 64 mobile, 96 to 128 desktop; fluid `clamp(64px, 4rem + 4vw, 128px)` |

### Hierarchy budget per view
1 primary element; at most 2 large elements; 3 to 4 type sizes; 2 weights (400 or 500, 600 or 700); text in `--color-text` and `--color-text-muted`; accent color for the primary action and true status only.

### Density
| Mode | Row or control height | Inside padding | Use |
|---|---|---|---|
| Comfortable | 48 | 16 to 24 | consumer, first-time, touch |
| Default | 40 | 12 to 16 | most product UI |
| Compact | 32 | 8 to 12 | daily expert tools, data tables |
Compact keeps 24px targets and at least 14px text; switch to default or comfortable under `@media (pointer: coarse)`.

### Collections
Browse mixed content: cards. Search or compare: list or table. Single-type visuals: even grid. Tables: numbers right-aligned in `tabular-nums`, text left, never centered, headers aligned with their data, light horizontal rules or none.

## 4. Expert moves (what separates top studio work)

1. **De-emphasize to emphasize.** Before enlarging the hero element, quiet everything around it: muted tone, smaller step, less weight. Size is the last lever, not the first.
2. **Measure to the glyph.** Line boxes add half-leading (4px each side for 16/24 text), so text-padded components look top-heavy. Use `text-box: trim-both cap alphabetic` (Baseline 2026, newly available) or subtract the half-leading on buttons, badges and pills.
3. **Concentric corners.** Inner radius = outer radius minus padding. A 16 radius card with 8 padding holds an 8 radius image. If the result is 4 or less, square the inner corner.
4. **Heading binds down.** Space above a heading about 2x the space below (for example 48 above, 16 to 24 below) so it belongs to its section, not the one before.
5. **Named-line content grid.** One grid gives body, popout and full-bleed tracks; media breaks the column on purpose while the text edge never moves. See references/01.
6. **Subgrid card rows.** Pricing cards, feature cards and product tiles align title, price and CTA across cards regardless of copy length. No spacer hacks.
7. **Avoid the false floor.** A hero that fills exactly one screen looks finished and stops scrolling. Let the next section peek above the fold (NN/g: 57% of viewing time above the fold, 74% in the first two screens).
8. **Left-weighted attention.** About 80% of fixations land in the left half; priority content goes center-left, and anything important on the right needs extra prominence (NN/g). Order summaries on the right get a tinted surface.
9. **Fix what should not grow.** Sidebars, inspectors, forms and text columns get fixed or capped widths; let only the content region flex. On ultra-wide screens add a pane, not width.
10. **Groups must survive reflow.** When stacking, re-check proximity: a related link that sat beside its card on desktop can land three blocks away on mobile. Keep button pairs together and order stacked features by importance.
11. **Optical corrections, deliberately.** Play icons nudge right of center; circles slightly larger than adjacent squares; icon-side button padding about 4px smaller; quotes and bullets hang outside the text edge.
12. **Un-stick on short screens.** Under about 500px of height (landscape phones) collapse or un-stick headers and footers so content keeps at least two thirds of the screen.
13. **Density is earned by subtraction.** Before shrinking padding, cut columns, merge fields and remove decorative rules. Then densify vertical padding, never text below 14px.

## 5. Page skeletons (summary)

- **Landing:** header (one CTA) > hero (headline about 20ch, one line, CTA, product proof, next section peeking) > proof strip > problem and outcome > 3 to 6 features > deep proof > pricing or teaser > FAQ > closing CTA. One primary action, repeated.
- **Dashboard:** one job; KPI row (3 to 5 tiles, value is the largest text) > primary trend > breakdowns > detail table; global filters in one toolbar; top-left holds the most important number. KPI row 4 across at lg, 2x2 at md, stacked horizontal tiles under sm; chart cards never under about 320px; compact tables go to default density on touch.
- **Article:** content grid, 66ch body, headings front-loaded for layer-cake scanning, sticky TOC on xl, wide media in popout or full bleed.
- **Pricing:** 3 to 4 plans, recommended in the middle with the only filled CTA, subgrid cards with 4 to 6 differentiators, billing toggle above, grouped comparison table with sticky plan header, mobile stacks or tabs with no horizontal scroll.

Full skeletons, numbers and worked examples: references/05.

## 6. Reference map

| Read | When |
|---|---|
| references/01-grids-and-structure.md | Choosing a grid or shell, content and dialog widths, full-bleed CSS, subgrid, RTL and logical properties, optical alignment |
| references/02-spacing-and-rhythm.md | Spacing scale use, proximity ratios, semantic spacing tokens, baseline rhythm, fluid section spacing, spacing audits |
| references/03-hierarchy-and-gestalt.md | Making something stand out, grouping, scanning patterns, CTA placement, order and accessibility, poster and print composition |
| references/04-responsive-and-adaptive.md | Breakpoint plans, navigation per width, container queries, WCAG minimums, wide and short screens |
| references/05-page-composition-and-density.md | Landing, dashboard, article, pricing, tables, density modes |

## 7. Related skills

- design-color: tone ramps, contrast values, accent use. design-typography: type scale, line height, measure in type terms.
- design-ux: navigation, flows, forms behavior. design-motion: layout transitions. design-copy: headings and CTA wording.
- design-frontend: CSS architecture, container queries, layout shift. design-data: charts inside dashboards. design-graphic: imagery and crops.
- website-strategy (positioning before layout), copywriting (sales page message order), sales-funnels (funnel steps and offers): use these for what the page says and sells; this skill decides how it is arranged.

## Output standard

When delivering a layout, state: the structure chosen and why, the grid and breakpoints, the spacing tiers with tokens, the ranked hierarchy, and how it passes the gate. In code, use tokens (`var(--space-6)`), `gap`, intrinsic CSS, logical properties (`margin-inline`, `padding-block`) so RTL mirrors for free, and semantic HTML in reading order.
