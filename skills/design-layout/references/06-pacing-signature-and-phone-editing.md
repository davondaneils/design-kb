# 06 Page pacing, signature moves, phone editing and dashboard grids

> design-layout reference 06. Read when a page has more than four sections, when the middle of a page feels flat, when a layout must work from 390 to 1440, or when proportioning a dashboard grid. Sources: design-kb `kb/research/layout/06-pacing-signature-and-phone-editing.md`; rendered evidence: `kb/tests/design-layout.md` (run 2).

The first five references make a page correct. This one makes it hold attention from the hero to the footer, look like itself, and survive the trip from 1440 to 390 as an edited page rather than a squashed one. Everything here sits on top of the gate in SKILL.md; none of it earns credit while a gate item fails.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **DOM order is reading order at every width.** Phone and desktop may place things differently only through grid placement that keeps the source order meaningful (WCAG 1.3.2). If the phone needs a different order, change the source order and lay the desktop out from it. [judged]
2. **The phone's first screen (390 x 844) shows what it is, for whom, and the primary action.** If the action lands below 844px, the hero is not edited yet. [judged; measured with `kb/tests/design-layout/measure-layout.mjs`]
3. **No unique content is cut at any width.** Duplicates may go; unique facts may be collapsed, deferred to the next screen or moved, never removed (Google mobile-first indexing, research 06 claims 1 and 2). [judged]
4. **At 1440 x 900 the next section peeks.** A hero that ends exactly at the fold is a false floor (NN/g, research 03). Some text of the next section is visible above 900px. [judged; measured]
5. **One page grid.** Every section uses the same columns and gutter; deliberate breaks are named in a CSS comment. Count left edges of text blocks at 1440: few, each reused. [judged; measured as `edges` and `strongEdges`]
6. **Measure is set on the text element:** `max-inline-size: var(--size-measure)` (`52ch`) on the paragraph itself, because `ch` resolves against the element's own font. A `52ch` on a wrapper in another font is a different measure. Confirm with the lint (45 to 75 characters at 1440). [lint]
7. **Equal-height rows have no holes.** Panels in a row stretch to one height; the shorter one pins its last element (`margin-top: auto`) instead of ending in blank space. [judged]

### Standards
| Standard | Rule | Source |
|---|---|---|
| WCAG 2.2, 1.3.2 Meaningful Sequence | Visual order may not change meaning | research 04 |
| WCAG 2.2, 1.4.10 Reflow | 320 CSS px, no 2D scroll except data regions | research 04 |
| Google mobile-first indexing | Same content on mobile; accordions or tabs rather than removal | research 06, claims 1, 2 |
| Apple HIG, Layout | Most important items near the top and leading side; progressive disclosure; layout by size class, not device | research 06, claims 8, 14, 15 |
| Android canonical layouts | Supporting pane: primary about two thirds, 70/30 at expanded width, 50/50 at medium | research 06, claims 11 to 13 |

### Decision rules
- **If a page has more than four sections**, write its flatplan before any CSS: one line per section with its job, its loudness (loud, medium, quiet) and its kind of loudness (type, color, data, image). Then apply the pacing rules below.
- **If the flatplan has a section without a named component** (ledger strip, ruled index, quote set as type, receipt, pinned stage), name one before any CSS. **If two sections name the same component or the same body layout**, change one. A page built from one reused frame reads as "the exact same" however good the copy is (Stand Firm v2 review, 2026-10-24).
- **If a page body holds more than one ruled list** (rows on hairlines with a right-aligned figure), the list is one component however its cells vary. Turn every list but one into an object or a map: a contents list became a spine map (seven ink blocks, each as wide as its part's page count; the plan part in the accent); an offer list became a paper slip on the colour field with a total line; the questions kept the rows. Stand Firm v3 had three ruled lists in a row on the buy page and the client read them as the same component (v4 design log, 2026-10-24).
- **If a pinned stage has chapters, size each chapter by its content** (one picture at 21:9 or 2:1 plus 60 to 90 words), never by a viewport fraction. Four chapters at `min-height: 78svh` for 60 words each made a 3,300px column that was mostly field (Stand Firm v3); content-sized chapters made about 2,700px with no empty screen, and the price row rides in the sticky column beside the figure so the longest section is never without the action (v4).
- **If two loud sections of the same kind are adjacent** (two color bands, two display headlines), separate them with a quiet or medium section, or change one's kind.
- **If the third and fourth sections are both quiet**, the page dies in the middle. Move the second loud moment there: a band, a big number, a chart, a full-bleed artifact.
- **If you want rhythm, change scale, density and tone. Do not flip image sides.** Zigzag image-text layouts slow scanning (NN/g, research 06 claim 7).
- **If a list holds six or fewer comparable products** (name, a few attributes, price, one action), use a ruled index (rows on hairlines, thumbnail, price and action at the row end), not equal cards. Cards hide ranking and comparison (NN/g, research 05) and cost about twice the height on a phone.
- **If a section makes a claim another section proves**, put them next to each other. The subscription band goes after the shop prices it undercuts; the platform breakdown sits beside the trend whose warning it explains.
- **If a dashboard row has one primary panel and one that explains it**, split 2fr / 1fr (8 + 4 of 12) from xl (1280); stack under xl, where a third of the content is under 320px.
- **If the phone toolbar wraps to two lines**, shorten labels at the phone breakpoint ("Compared to: previous period" becomes "vs previous") before you hide anything.
- **If a table has more columns than a phone row can hold**, keep the row key, the sorted measure and one comparison; defer the rest to the full view the panel already links to.
- **If the layout is between 640 and 1023 (tablet)**, a square art panel at full width is about 700px tall. Put the art in half the width and stack its facts beside it.
- **If annotations sit on art whose size changes with its column**, show or hide them with a container query on the art (`container-type: inline-size`), not a viewport media query: the stage at 1024 is smaller than the stage at 768.
- **If you compress rows for density**, re-run the lint before you call it done: shaving an inline-block link's padding from 4 to 2px dropped it under the 24px target (WCAG 2.5.8) in this test's first round.
- **If the grid utility sets `column-gap` and a component sets `gap`**, the component's shorthand wins and silently changes the column gap. On grid containers that inherit the page grid, set `row-gap` only.

### Numbers
| What | Value |
|---|---|
| Page grid from lg (1024) | 12 columns, gap 32 (`--space-7`), content box 1136 inside a 1232 max with 48 padding |
| Margin column | columns 1 to 3 (about 260px at 1440); body columns 4 to 12 (about 844px) |
| Hero split | 7 + 5 on the same 12 columns; reuse it for the offer band so the price sits under the bag |
| Section padding | 64 phone, 128 desktop; 64 to 96 between blocks inside a long section; the section after the hero opens at 96 so it peeks |
| First phone screen | 390 x 844 CSS px: label, headline (3 lines at 49px is about 150px), one short line of sense or offer, the action |
| Dashboard rows (xl) | answer, KPI strip, attention rows, primary 2fr + supporting 1fr, detail table full width |
| Supporting pane minimum | 320px; under that, stack |
| Alerts | one row each from lg (about 55px measured); a third alert adds a row, not a card. At 1440 the two-alert strip only went from 178 to 168px: the win is scaling and scan order, not height |
| Ultra-wide cap for app content | about 1600px; past it, add air or a pane, not line length |
| Measure | `52ch` = 63 to 68 characters in eight faces (re-measured 2026-10-10) |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns
Opinion, from memory: the exemplar hosts were blocked again on 2026-10-10, so these need confirming in `kb/teardowns/` before they become numbers.
- **apple.com product pages** pace by alternation: a full-screen statement, then a dense specification band, then a full-bleed image, then quiet copy. The kind of loudness changes every section.
- **stripe.com** keeps one strong left edge for headings and lets illustrations break right, rarely left.
- **Editorial sites (nytimes.com features, pentagram.com case studies)** run a narrow text column with media that breaks out on purpose, and captions that live in the margin.
- **Stripe and Vercel dashboards** put the answer and a few large numbers first, then one wide chart with a narrower explainer, then a full-width table.

### Signature moves
1. **Flatplan the page, then alternate.** Write each section as L, M or Q plus its kind. The tested coffee page went from L L M Q Q (hero, band, cards, steps, ledger) to L M L Q L Q L (hero, index, band, statement, chart, steps, number), without adding a section. Why: magazine editors pace an issue from the flatplan (Offscreen, research 06 claims 9 and 10); a web page is one long spread with the same problem.
2. **The margin column.** Columns 1 to 3 carry every small thing: section labels, the "see all" link, the chart caption, hanging step numerals. The body edge at column 4 repeats in every section. Labels can be sticky (`position: sticky; top: header + 32`) so they ride beside long sections. Why: one repeated edge is what makes a grid visible; the tested coffee page went from 11 to 8 distinct left edges at 1440 (measured, tester report). Opinion on stickiness.
3. **Break the grid toward one edge, once, for the artifact that earns it.** The roast curve's chart paper bleeds to the right viewport edge; the data stays in the body column and the axis labels hang into the gutter. Why: a single directed break reads as intent; breaks everywhere read as no grid. Opinion.
4. **Draw data into the furniture.** The ledger's row rules are drawn to scale (`width: calc(var(--v) * 100%)` on an absolutely positioned rule inside a `position: relative` row), so the hairlines are the chart and the longest one is what was paid. A section gains a picture with no image, which matters when photography is not available. Opinion, tested.
5. **A ruled index instead of a card row.** Two-pixel rule to open, hairline per row, thumbnail art, serif name at the largest size in the row, price and action at the row end. On a phone each row is about 200px instead of 440.
6. **Echo the split.** The hero's 7 + 5, reused in the offer band and the ledger, stacks the bag, the price and the paid amount on one vertical line. Readers feel the alignment before they see it.
7. **Supporting pane beside the trend.** On a dashboard, the panel that explains the chart takes the right third and stretches to the chart's height, its footnote pinned to the bottom. The explanation is in the first screen next to the thing it explains.
8. **Alerts as rows.** Title, detail, and time with the action pushed right, one line each, tinted full-bleed inside one panel. The row tint carries severity, the icon and the word ("Error:", "Warning:") carry meaning without color.

### Phone editing (the list, section by section)
Write it as a table in the hand-over. Verbs, in order of preference: **keep, reorder (source order), crop, thumbnail, merge duplicate, shorten label, collapse, defer**. Never: cut a unique fact.
| Section | Coffee page, as tested |
|---|---|
| Hero | Source order changed so the action comes before the art; the logistics line is hidden under 640 because the facts row and step 3 say the same thing; the art cropped from 4:5 to 1:1; on a small stage a container query drops only annotations repeated elsewhere (the lot number, "washed"), and keeps "60 bags this season", which appears nowhere else (a critic catch, round 1) |
| Shop | Cards became index rows; tile art became a 96px thumbnail; tile captions dropped (the contour key is stated once in the hero) |
| Chart | 240px tall instead of 400; the optional middle annotation hidden; two labelled points stay |
| Footer | Link lists side by side instead of stacked |
| Result | 6,738px to 5,574px at 390 (17 percent shorter); the primary action ends at 476px instead of 1,078px |
| Stand Firm v4 buy page (2026-10-24) | Stage: 21:9 chapter photos become 88px square thumbnails beside the heading (thumbnail); the sticky plan and price row are dropped and the dock carries the action (defer). Spine map: horizontal blocks become a vertical stack whose row heights stay proportional to page count (reorder, keep the fact). Gallery on the quiz page: 4:3 photos become 96px squares left of the text (thumbnail). Section padding 96 at desktop, not 128, on both pages |

### Do and don't
| Do | Don't |
|---|---|
| Give every section its own named component under a shared header system | Re-use one section frame (label, H2, split, cards) and change only the words |
| Change the kind of loudness between neighbours | Put two color bands or two display headlines back to back |
| When two dark grounds must meet and the story runs one into the other (the problem into the stakes), join them: the second's ground starts at the first's color and darkens, its picture fading in at the top (opinion, Stand Firm results v1) | Leave a hard seam between two near-same darks; it reads as a mistake, not a change |
| Keep one body edge down the page | Give each section its own left edge |
| Break the grid once, toward one edge | Bleed everything, or nothing ever |
| Edit the phone page section by section | Stack the desktop and call it responsive |
| Collapse or defer secondary detail | Delete facts on the phone |
| Split a dashboard row 2:1 when one panel explains the other | Split 1:1 by habit, or 5:6 so the table outweighs the trend |

### Worked examples
1. **Coffee landing page (tested).** Brief: middle sections quieter than the hero. Flatplan showed hero and band back to back (two loud), then three quiet sections. Moves: band moved after the shop (the claim "15% under shop price" now sits under the prices it beats); cards became an index; the story section became statement, chart (bleeding right), steps (hanging numerals on a subgrid), ledger (big number plus rules to scale). Phone list as above. Lint 0 fails before and after.
2. **Analytics overview (tested).** Brief: dashboard grid and density. Moves: alerts became rows; the 5:6 chart-table split became chart 2fr plus a new platforms pane 1fr that holds the evidence for the iOS warning; the table went full width with a Change column instead of white space; phone chips shortened to one line; average time deferred on phone rows; content capped at 1600px.
3. **Pricing page (not rendered).** Flatplan: hero (L type), plans (M data), comparison (Q dense), testimonial (L type), FAQ (Q), closing CTA (L color). Plans echo the hero split; the comparison table's sticky header sits under the site header with `scroll-padding-top` (reference 05).

### Hand-offs
- design-art-direction decides what the loud moments show; this reference decides where they sit and how loud they are.
- design-typography owns the display ramp the loud sections use; the measure token is shared.
- design-product-ui owns table internals and states; this reference owns the panel grid around them.
- dataviz owns chart form; layout owns the chart's frame, bleed and caption placement.
- design-copy reference 01 owns section order by message; reconcile with the flatplan, message first, then loudness.

## Sources
- Google Search Central, mobile-first indexing best practices: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing (accessed 2026-10-10)
- NN/g, Defer Secondary Content When Writing for Mobile Users (Nielsen, 2011): https://www.nngroup.com/articles/defer-secondary-content-for-mobile/
- NN/g, Accordions on Mobile (Budiu, 2015): https://www.nngroup.com/articles/mobile-accordions/
- NN/g, Zigzag Image-Text Layouts Make Scanning Less Efficient (Flaherty, 2017): https://www.nngroup.com/articles/zigzag-page-layout/
- Josh Clark, Mobile Isn't the Lite Version (2012, opinion): https://bigmedium.com/ideas/mobile-not-lite-jakob-nielsen.html
- Apple HIG, Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Android Developers, canonical layouts: https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts
- Offscreen magazine, How to plan a magazine (2015, practitioner opinion): https://offscreenmag.com/blog/how-to-plan-a-magazine
- Measured: `kb/research/typography/measure-cpl.mjs` (52ch), `kb/tests/design-layout/measure-layout.mjs` (page metrics)
