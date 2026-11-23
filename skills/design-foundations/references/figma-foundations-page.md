# The Figma Foundations page: a reusable recipe

The handoff page a developer builds from: every colour, size, space, motion and icon rule, in one place, driven by Figma variables so it re-themes when the values change. First built for VGC (Nov 2026) and passed by two fresh critic rounds. Use it on any site or product job that hands a Figma file to a developer.

A starter file exists (a neutral copy of the VGC page). Duplicate it, change the variables, rewrite the text rows, then run the checks in section 5. If the starter is not to hand, build from this recipe.

## 1. Fundamentals (non-negotiable)

1. **The page documents tokens; it never invents them.** Every number on the page exists in the token files (CSS and JSON) under the same name, and every Figma variable has WEB code syntax `var(--name)` that matches the CSS exactly. A name that differs by one word (`--color-text-accent` vs `--color-accent`) is a broken handoff.
2. **One fact, one place.** A rule stated in two sections must say the same thing. Contradictions between sections (breakpoints, cards per row, reading width, "never" rules) were the most common failure in review.
3. **Measure contrast on every surface, after every palette change.** Text, muted text, link, accent, focus ring and form colours, on the background and on the card surface of each surface. Numbers on the page are re-measured, never carried over.
4. **Show the focus ring on every surface.** One ring colour rarely passes 3:1 on light, brand and dark fields. The ring is a role that switches with the surface.
5. **Links are underlined in running text, on every surface** (WCAG 1.4.1). Show it in the surface demos.
6. **Rules on top, visual underneath.** Each row: title and numbers in a head, then a full-width visual. Three-column rows squeeze the visual.
7. **House style survives the doc itself:** curly quotes and apostrophes, no em dashes, the project's spelling.

## 2. File structure

- Pages: Cover, Start here (developer guide), Foundations, Components, Sitemap, then one page per template (Desktop / Tablet / Mobile frames), then extras, then a "Working files, not for build" divider.
- Variable collections: Primitives (hidden scopes), Scale (space, radius, size, fonts), Colour (semantic roles, one mode per surface, for example Paper / Field / Navy), Responsive (Desktop / Tablet / Mobile: type sizes, section padding, side margin, columns, the per-screen content gaps), Motion (hidden). Every variable has explicit scopes and WEB code syntax.
- Styles: text styles with sizes bound to Responsive variables; effect styles for card shadow, media shadow and focus ring; grid styles per frame size.
- Foundations layout: one 1440 frame per section, each wrapped in a Figma Section, laid out left to right in reading order with an equal gap. A Contents frame comes first; each entry links to its Section. Sections hug their frame with an even inset (80): content outside a Section's bounds is not part of what Dev Mode marks ready.
- Clip content off on every container that holds a shadow, ring or overhang. Only the page frame and image masks clip.

## 3. Sections and their visuals

| # | Section | Visual that earns its place |
|---|---|---|
| 00 | Contents | Numbered list, each name a link to its Section |
| 01 | Colour | Primitive swatches with name and uppercase hex; a usage line where a colour has a "never" |
| 02 | Surfaces and roles | The same sample (eyebrow, heading with accent word, body, muted, underlined link, button, hairline) on each surface; a role table (CSS name, value per surface, "n/a" where a role is banned, for example no forms on a brand field); the one-attribute switch in monospace (`[data-surface="..."]`, default needs none) |
| 03 | Type | One row per text style: specimen, family and weight, sizes Desktop / Tablet / Mobile, line height and tracking, `clamp()` for fluid styles. Body specimen no wider than the measure (52ch) |
| 04 | Spacing and radius | Scale squares, radius tiles with usage, control sizes (44 and 56) drawn as a real input and button |
| 05 | Shadows and focus | Shadow tiles with room to breathe; focus ring drawn at 2px with a 2px gap on each surface, with ratios and the `:focus-visible` snippet |
| 06 | Layout and breakpoints | Per frame size: rules plus a to-scale diagram (columns tinted blue, margins the lightest red, section padding bands labelled in place); a colour key |
| 07 | Spacing inside sections | Per pattern (text group, header to content, cards, forms, lists): a Desktop, Tablet and Mobile visual, each tagged, each set to its Responsive mode so sizes resolve. Red bars run the full content width with the number only, in the margin. Card padding as a rounded ring on one card; the other cards clean. A closing "rule" row on the tiers |
| 08 | Motion | Duration ruler with the limits as lines; easing curves drawn to scale with handles and a time-step dot strip (close dots slow, wide dots fast); default vs reduced motion side by side |
| 09 | Icons | The set; sizes with one icon enlarged on its grid; stroke do and don't; tap areas with the same red tint as spacing |
| 10 | Accessibility | Every measured pair by surface; targets; focus |
| 11 | Content | Spelling, punctuation, numbers, dates in the project's locale |

## 4. Expert moves

- **Spacing tiers scale by screen, inner gaps do not.** Label to input and padding inside a component stay fixed (they track type size and tap targets); gaps between groups shrink with the screen. Keep the order on mobile so no outer gap becomes smaller than an inner one. Stay on the space scale; if a proposed value is off-scale, round to a scale step and say so.
- **Fluid sizes are documented as fluid.** Print the `clamp()` beside Display and Section sizes, and compute the tablet value from the clamp, not from a guess.
- **The reduced-motion rule and the token must agree.** If reveals become a short fade, the reveal duration token under `prefers-reduced-motion` is that fade, not 0.
- **Icon stroke at small sizes.** A 24-grid icon scaled down thins its stroke. To hold one weight, set `stroke-width` to `base × 24 ÷ size` for inline SVG, and drop sizes the stroke cannot survive.
- **Desktop examples on a 1248 doc frame are the content area, not 1440.** Label them so; tablet and mobile can be shown at real width.

## 5. Checks before hand-over

1. Every number on the page matches the CSS and JSON token files; every variable's code syntax resolves in the CSS.
2. Every contrast pair re-measured; focus ring passes 3:1 on every surface; banned pairs marked "n/a".
3. No two sections contradict (breakpoints, content cap, cards per row, measure, "never" rules).
4. Each Section hugs its frame; nothing overlaps; Clip content off where shadows or rings live.
5. Curly quotes, no em dashes, project spelling, sentence case.
6. A fresh-context critic reviews screenshots of every Section plus the token files. Expect a second round: the first fixes surface new issues.

Source: VGC Foundations build and its two critic reviews, recorded in the project's `brand/design-log.md`. Contrast per WCAG 2.2 (1.4.3, 1.4.11, 1.4.1 for links).
