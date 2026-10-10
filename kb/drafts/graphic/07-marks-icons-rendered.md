# Draft 07: marks and icon sets that hold up on real pixels (wave 2 additions)

Domain-specialist, 2026-10-10. Research: `kb/research/graphic/07-marks-icons-rendered.md` (G and M numbers). Folded by the skill-architect into `skills/design-graphic/SKILL.md`, references 01, 02 and 06. Opinion is marked (opinion).

## Floor: fundamentals (non-negotiable)
1. A wordmark in a header or footer is artwork: outlined paths in one inline SVG, not live text in a web font. Live text changes with font loading, fallback metrics and user font settings; the mark must not. The link around it carries the name (`aria-label="Brand, home"`) and the SVG is `aria-hidden`, or the SVG is `role="img"` with a `<title>`. [judged]
2. Every tier of the mark is drawn, not scaled: wordmark (tier 1 and 2), symbol (tier 3, 32 to 80px), small symbol (tier 4, 16 to 32px, monoline, inner detail removed). [judged on the mark sheet]
3. One icon family: one grid per rendered size (16 for 14px labels, 12 for 12px labels), one cap and one join across every icon, ink at least 1px from the box edge, no hard-coded fill or stroke color. [icon_audit: fail]
4. Status icons that carry meaning (error, warning) reach 3:1 and are paired with text (1.4.11, 1.4.1). [lint plus judged]
5. The favicon's ink reaches 3:1 against whatever is behind it on every tab strip, light, gray and dark: either the bare mark passes on all of them, or it sits on its own field. [measured: `assets/tab_contrast.py`]

## Decision rules
- **If the brand name is short and the type carries the identity**, outline the brand face at its display optical size, set tracking and pairs by eye on the word, and spend the one quirk on a letter the concept owns (Ember & Oak: an ember and two growth rings inside the O). (opinion; quirk rule from 01)
- **If the family has an italic ampersand**, try it in the roman word; it is usually the better form in a title (Bringhurst 5.1.3 [G3][G4]).
- **If the font is variable with an optical size axis**, instance it at the size the mark lives at (opsz 72 for a mark, not the 16pt text default) and measure cap height from the H of that instance: the OS/2 value describes the default instance only (Newsreader: 1340 reported, 1430 measured at opsz 72) [M3].
- **If the mark sits under about 320px wide**, drop inner detail one step (two rings to one); under 32px use the drawn tier 4. (opinion, tier rule from 01)
- **Favicon: give the mark its own field.** Measure the bare mark against every strip with `assets/tab_contrast.py`; a mid-lightness brand color rarely clears 3:1 on both a gray inactive tab and a dark one (Ember & Oak orange: 3.04 on white, 2.32 on #dee1e6, 5.29 on #202124). A `prefers-color-scheme` rule does not save it: inside an SVG it follows the OS or the embedding scheme, not the strip a themed browser paints [G7]. A rounded field in the darkest brand neutral with the light mark inside fixes the contrast inside the icon, on any strip. (opinion on the choice; contrast measured [M4])
- **Icon stroke** is set in CSS where font-weight is set: `.nav a { font-weight: 500 }` and `.nav a[aria-current] { font-weight: 600; --icon-stroke: 1.75px }`. The icon never carries a stroke-width attribute. (opinion built on design-polish 03 stems)
- **Straight stems** of a 1.5px stroke go on .25 or .75; 1px on .5; 2px on whole pixels [M1].
- **Inline, not sprite**, while a lint or audit must read the shapes: `<use>` hides them in a shadow tree [M2 note].

## Numbers
| Item | Value |
|---|---|
| 16 grid | live area 14 (1px padding), keylines circle 13, square 12 (Material 20/18 scaled, opinion) |
| Stroke beside Inter 14px 500 / 600 | 1.5px / 1.75px (stems 1.50 / 1.78, design-polish) |
| Stroke beside Inter 12px 500 / 600 | 1.25px / 1.5px (stems 1.28 / 1.52) |
| Icon to label gap | 8 inline and in buttons, 12 in nav rows (opinion) |
| Tier 4 favicon | own field, radius 7 of 32; ring stroke 3.5 of 32 (1.75px at 16); ember r 4 of 32 (larger in proportion than the big mark, on purpose) |
| Volume outlier | ink share more than 35 percent off the set median for that size: look, then decide (opinion) |

## Expert moves
1. **Place stems on the device grid you ship to.** Measured: a 1.5px stem at x.25 is crisp at 2x (3 whole device pixels) and leaves one soft column at 1x; at x.0 it blurs two columns at both densities. Library icons scaled from 24 to 16 land on 0.67px steps and are never crisp. Generalists blame "antialiasing"; it is placement. [M1]
2. **Stroke is a type property.** Bind `--icon-stroke` to the same selector that sets font-weight, so selected, hover and bold states move icon and label together. [opinion]
3. **Solid status icons with the mark knocked out** in one evenodd path: one color, keeps mass at 16px, survives forced colors, no white or black hard-coded inside. The audit found exactly this bug in the combined page. [M2]
4. **Outline the wordmark from the instance you will see.** Variable fonts move cap height across optical sizes; measuring from H avoids a mark that is 7 percent off its own clear-space unit. [M3]
5. **Audit the set with numbers.** Ink share (optical volume), padding and partial-pixel share at 1x and 2x catch outliers the eye accepts on a busy page. The fundamentals lint and the polish audit both passed a set with mixed caps, mixed joins and hard-coded colors. [M2]
6. **The sign-off is the mark at full measure.** A full-width outlined wordmark in the footer is the brand's loudest moment after the hero and costs about 15 KB of paths. (opinion; Pentagram-style sign-off)

## Worked examples
- Ember & Oak: concept "the hill and the fire" (design-art-direction). Wordmark: Newsreader opsz 72, weight 480, italic ampersand, tracking -16 units, pairs `r ` -24, ` &` -20, `& ` -8, ` O` -10 (2000-unit font). The O keeps its own outline and gains two eccentric rings (stroke 3 per 100 cap, the O's hairline) and an ember dot in brand orange, up and right of centre. Header 24 to 28px tall with one ring; bag label 32px symbol with one ring; footer full width with two rings; favicon tier 4 on its own warm 950 field (ring 14.9:1, ember 5.3:1 inside the field; the bare orange mark measured 2.32:1 on a gray tab strip and was rejected); apple-touch icon on warm 950. Built in `kb/tests/design-graphic/marks.mjs`.
- Tally: 18 icons on a 16 grid and 2 on a 12 grid, one module (`kb/tests/design-graphic/icons.mjs`), metaphor table in its header, stems on quarter pixels, solid error and warning, gear drawn with 6 teeth (the most a 16px gear survives, opinion), tally mark as brand at 1.75px. Nav labels moved from 400 to 500 so 1.5px icons match their stems.

## Hand-offs
design-polish 03 (stem tables, caps), design-art-direction (concept that the mark's detail comes from; photography and illustration), design-typography (face choice, optical sizes), design-color (favicon contrast), design-frontend (inline SVG budget).
