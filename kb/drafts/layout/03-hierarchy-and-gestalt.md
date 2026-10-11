# Visual hierarchy and gestalt

Sources: research/layout/03.

## Principles
1. **One winner per view.** Each screen has one primary element (a headline, a number, a call to action). Everything else is ranked behind it. "If everything is contrasted, then nothing stands out" (NN/g).
2. **Emphasize by de-emphasizing.** The fastest way to make the primary thing win is to quiet its competitors: lighter text tone, smaller size, less weight, less space (Refactoring UI, opinion).
3. **Layout follows scanning, and scanning follows layout.** People scan layer-cake style when headings stand out, F-style when they do not (NN/g). Design for layer-cake.
4. **Order is meaning.** Visual order, DOM order and focus order must tell the same story (WCAG 1.3.2, 2.4.3).

## Decision rules

### Ranking tools, in the order to reach for them
1. Position: top and leading side first (Apple HIG); center-left gets the most attention (NN/g: about 80% of fixations on the left half, peak about 600px from the left edge).
2. Space: more space around an element raises its rank (Carbon).
3. Contrast and tone: three text tones (`--color-text`, `--color-text-muted`, and a lighter tertiary) do most of the work.
4. Weight: two weights in UI, 400 or 500 for normal, 600 or 700 for emphasis.
5. Size: last, and in steps from the foundation type scale. A single view uses about 3 to 4 steps (NN/g suggests no more than 3 sizes in simple designs).
6. Color: accent color reserved for the primary action and true status. Never the only signal.

### Budgets per view (opinion, derived from NN/g limits)
- 1 primary element, at most 2 large elements total.
- 1 solid primary button per view or per distinct region. Secondary actions outline or muted; tertiary as text links.
- 3 to 4 type sizes, 3 text tones, 2 weights.
- Accent color on 10 percent or less of the surface (opinion, common 60-30-10 heuristic; details in design-color).

### Grouping, in order of preference
1. **Proximity** (space). Free, quiet, strongest cue.
2. **Alignment.** Shared edges imply relation; indentation implies subordination (Apple HIG).
3. **Similarity.** Same treatment for same role, so a link looks like every other link.
4. **Common region** (background tint or card). Use when groups are heterogeneous, interactive as a unit, or must survive reflow.
5. **Lines.** Last resort, and light. A divider between every row is usually a spacing problem.

### Placement rules
- Primary action sits where the eye ends the task: below or trailing the content it acts on, aligned to the content's edge, not floating in a far corner (NN/g: distant items are overlooked).
- Do not put a destructive or unrelated action inside a group of routine ones (NN/g: an "Add" button among "Save as draft" and "Cancel" was missed).
- Important content on the right side must be visually prominent to be seen (NN/g).
- Above the fold holds the value proposition and primary action; about 57% of viewing time is above the fold, 74% within two screenfuls (NN/g 2018). Leave a visible slice of the next section to avoid a false floor.
- Headings front-load the key words: the first two words should carry the gist (NN/g).

### Order and accessibility
- Build the DOM in reading order first; let CSS place items. Avoid `order`, `flex-direction: row-reverse` or grid placement that changes meaning or makes tab order jump.
- If a visual reorder is needed at one breakpoint, prefer changing the grid template over reordering items, and check tab order at every breakpoint. `reading-flow` is experimental; do not rely on it yet.
- Hierarchy must survive grayscale and high-contrast modes: if it only exists in color, it fails WCAG 1.4.1.

### Acceptance test
- **Squint or blur test** (NN/g): blur the screen; you should still see the primary element first, then the groups. If two things fight, demote one.
- **Five-second test**: show for five seconds, ask what the page is and what to do next.
- **Grayscale test**: ranking must hold with color removed.

## Do and don't
- Do make the price large and the "/month" small and muted. Don't make both bold.
- Do style label above value in muted tone, value in the strong tone. Don't bold both (Refactoring UI: labels are secondary).
- Do group filters with space and one tinted region. Don't wrap each filter in its own bordered box.
- Do use one solid button. Don't make "Cancel" a second filled button next to "Save".

## Worked examples
**Busy dashboard header.** Before: page title, 3 filled buttons, a date picker, a search box and breadcrumbs all at equal weight. After: breadcrumbs muted and small above the title; title at `--text-2xl`; one filled primary action trailing; secondary actions collapse into an outline button and an overflow menu; date range and search move down into the content toolbar where they act. Squint test: title, then primary button, then content.

**Checkout step primary action.** Full-width (on mobile) or content-width (desktop) solid button at the end of the form column, aligned to the field edge, label states the outcome ("Pay $48.00"). Secondary "Back" becomes a text link on the leading side. Order summary on the right on lg and up, made prominent with a surface tint so it is seen despite right-side neglect; on mobile it collapses to a summary row above the form.

## Hand-offs
- Contrast values and tone ramps: design-color.
- Type scale steps and weights: design-typography.
- Wording of headings and CTAs: design-copy; persuasion structure: copywriting.
- Focus visibility and keyboard order testing: design-ux, design-frontend.
