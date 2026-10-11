# Grids and structure

Sources: research/layout/01. Defaults follow the shared foundation contract (breakpoints 640, 768, 1024, 1280, 1536; spacing tokens `--space-0` to `--space-11`; measure 45 to 75 characters, 66 ideal).

## Principles
1. **The grid serves the content, not the other way round.** Muller-Brockmann derived columns and modules from the text's line height, so type and images share one system. Start from the content's natural widths (a 66ch text column, a 20rem sidebar, a 4:3 image), then pick the grid that holds them.
2. **Three structures, three jobs.** Column grids compose editorial and marketing pages. Intrinsic algorithms (Every Layout) lay out components. Fixed-plus-fluid shells hold apps. Using one for another's job is the most common structural mistake.
3. **Alignment is the cheapest form of order.** Every distinct left edge is a decision the eye has to process. Fewer edges, calmer page (opinion, consistent with Apple HIG: aligned items read as related).
4. **Math first, eyes last.** Snap to the grid, then correct optically where geometry lies (circles, triangles, icons, cap height).

## Decision rules

### Choosing the structure
| If the screen is | Use | Why |
|---|---|---|
| Marketing, editorial, portfolio | 12-column grid (4 / 8 / 12 by breakpoint) with a centered max-width container | Divides into halves, thirds, quarters; supports asymmetric 7/5, 8/4 splits |
| Long-form reading | Named-line content grid (below), not a 12-col grid | The measure, not the column count, is the constraint |
| App with navigation | Fixed sidebar (240 to 280px) + fluid main, main uses intrinsic layouts | Refactoring UI: fix what should not grow; Linear's "inverted L" chrome |
| Collection of items | `repeat(auto-fill, minmax(<min card>, 1fr))` | Column count falls out of the container width; no breakpoints |
| Two things side by side that must stack when narrow | Every Layout Sidebar (`flex-grow: 999; min-inline-size: 50%`) | Switches on the container's width, so it works in any slot |
| Card rows whose inner parts must align | Parent grid + `grid-template-rows: subgrid` on cards | Titles, bodies and CTAs align across cards regardless of text length |

### Column grid numbers (web, foundation breakpoints)
| Viewport | Columns | Gutter | Outer margin | Container max |
|---|---|---|---|---|
| under 640 | 4 | 16 (`--space-5`) | 16 | fluid |
| 640 to 1023 | 8 | 24 (`--space-6`) | 24 to 32 | fluid |
| 1024 to 1279 | 12 | 24 | 32 | fluid |
| 1280 and up | 12 | 32 (`--space-7`) | auto (centered) | 1280px content box (opinion: 1200 to 1280 is the common premium range) |
| 1536 and up | 12 | 32 | auto | keep 1280; let backgrounds and media bleed, not text |

Cross-checks: Carbon uses 4 / 8 / 16 columns with 32px gutters and an 8px mini unit; Material uses 16dp compact and 24dp wider margins. Our numbers sit inside both.

### Measure and widths
- Body text: `max-inline-size: 66ch` default, never above 75ch, never below 45ch except in narrow UI cells.
- Display headlines: cap at about 20ch so they break into 2 to 3 balanced lines; add `text-wrap: balance` (opinion, common premium practice).
- Forms: single column, field widths that hint at expected input (postcode short, address long), container about 480 to 560px (opinion).
- Sidebars: 240 to 280px nav; 320 to 400px for a detail or inspector pane (opinion, matches Every Layout's 20rem example).

### Breaking out of the grid
Use named lines so any child can opt into a wider track:
```css
.content-grid {
  --gutter: var(--space-5);              /* 16px */
  --popout: 8rem;
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gutter), 1fr)
    [popout-start] minmax(0, var(--popout))
    [content-start] min(66ch, 100% - 2 * var(--gutter)) [content-end]
    minmax(0, var(--popout)) [popout-end]
    minmax(var(--gutter), 1fr) [full-end];
}
.content-grid > * { grid-column: content; }
.content-grid > .popout { grid-column: popout; }
.content-grid > .full-bleed { grid-column: full; }
```
Builds on Comeau's `1fr min(42rem, 100%) 1fr` pattern; the gutter tracks keep text off the screen edge on phones.

### Optical alignment rules
- Play triangles: center by visual mass, which means nudging right of the bounding box center.
- Circles next to squares: make circles slightly larger (about 5 to 10 percent, opinion) to look equal.
- Icon plus text: align the icon to the text's cap height or x-height center, not the line box.
- Button labels: center on cap height; `text-box: trim-both cap alphabetic` does this in CSS where supported.
- Hanging punctuation: let opening quotes and bullets hang outside the text edge so the letters align (Bringhurst tradition; `hanging-punctuation` is Safari only, so use a negative text-indent).

## Do and don't
- Do give the sidebar a fixed width and the content `minmax(0, 1fr)`. Don't make a 12-column grid carry an app shell.
- Do let cards use subgrid so CTAs line up. Don't pad short cards with spacer divs.
- Do let images and section backgrounds bleed to the viewport. Don't let paragraphs follow them.
- Do count left edges in a view and remove one. Don't center-align body copy longer than 2 lines.

## Worked examples
**Long-form article with wide images.** Content grid above; body at 66ch; figures that need detail use `popout`; hero image and data charts use `full`. Pull quotes sit in `popout` on lg and up, and drop to `content` below md so they never squeeze the text. Result: one text edge from top to bottom, media breaks rhythm on purpose.

**B2B SaaS marketing site.** 12-column grid, 1280 container, 32 gutter. Hero: copy in columns 1 to 6 (about 560 to 600px, headline capped near 20ch), product shot in 7 to 12 and allowed to bleed off the right edge on xl. Feature rows alternate 5/7 and 7/5 with the copy column on the same left edge throughout (opinion: alternating image side is fine, alternating text edge is not). Logos row: `auto-fit` grid, no breakpoints.

## Hand-offs
- Type sizes and the measure in characters: design-typography.
- Image cropping and art direction at breakpoints: design-graphic.
- Implementation, container queries, performance of layout shifts: design-frontend.
