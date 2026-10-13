# Type-led pages: when the type has to carry the page

Read this for a landing, product or brand page that must feel special, especially when there is no photography (image hosts blocked, no shoot budget, a CSS or SVG stand-in for the product). The design-color pilot passed every check and still read as "not super special" (Davon's blind ranking, `kb/tests/design-color.md`); the judge named type as one of the reasons. This file is the answer from the type side. Art direction and imagery stay with design-graphic.

**Status: the moves are opinion, tested on rendered pages** (`kb/tests/design-typography.md`), not measured from the exemplars, whose hosts are blocked here. Numbers that are measured say so.

## Floor (non-negotiable before any move below earns credit)
1. Every move passes the FOUNDATIONS gate: display sizes fluid with `clamp()` and max no more than 2.5x min (F9); paragraphs 45 to 75 characters at 1440 even at display sizes; 4.5:1 for text under 24px, including type on brand fills. `[lint]`
2. One h1, headings in order; a giant wordmark or numeral that is decoration is `aria-hidden` or a `<p>`, never a heading. `[judged]`
3. Body stays calm: `--text-base` or `--text-lg`, 1.5, system or text face. Drama lives in display only. `[judged]`
4. The primary action is still in the first screen at 390 and 1440. A headline big enough to push the CTA below the fold has failed, however good it looks. `[judged]`
5. A high-contrast display face (Didone, fashion serif) keeps its hairline at 0.5 CSS px or more at the size it is seen, at 390 as well as 1440: on a phone the display clamp minimum is the binding size. Measure with `assets/hairline.py`; reference 08. `[judged]`

## The moves (each: what, why, how)

1. **A display ramp above the tokens.** Keep `--text-xs` to `--text-5xl`; add `--text-display` (49 to 112px) and `--text-display-2` (39 to 80px, `clamp(39px, 5vw, 80px)` as in FOUNDATIONS) as fluid tokens. Why: the exemplars' heroes sit far above 61px, and the jump from display to body (7:1 here) is what reads as confidence; middle sizes read as template. How: `clamp(3.0625rem, 1.6rem + 6vw, 7rem)`, ratio 2.29.
2. **Leading under 1 at 100px and up.** `line-height: 0.95` for two to three display lines; 1.1 (the heading default) at 112px leaves a 12px gap that splits one headline into stacked lines. Check descender and ascender collisions on the actual words (g, j, y over T, l, d).
3. **Roman and italic in one headline.** Set the stress of the sentence in the italic of the same family ("Ethiopia Guji, *roasted Tuesday* in Portland"). Why: it gives a second voice with no second family, and it is how editorial typography emphasises (NYT features, book jackets). Keep the italic phrase on one line with `&nbsp;` between its words.
4. **Optical margin at display sizes.** Side bearings scale with size: Newsreader's E has a 0.043em left bearing, 5px at 112px, while the 12px label above it is inset 1px (measured). Pull the display line out by the first glyph's bearing: `translate: -0.04em 0` (transforms keep the spacing tokens clean). Check italic first glyphs separately; they often overhang the other way.
5. **Numerals as graphics.** Facts the brand is proud of (altitude, batch size, days to door, the price) set in the display face at `--text-3xl` or larger, units at `--text-lg` in the muted color, joined by a narrow no-break space (U+202F). Prices: currency symbol at a fixed smaller token, top-aligned, digits at display size. Tabular lining figures only where numbers align or change; proportional elsewhere.
6. **The best available ampersand.** In wordmarks and titles, use the italic ampersand of the display face even in a roman setting (Bringhurst 5.1.3: "In heads and titles, use the best available ampersand.").
7. **Labels as the quiet counter-voice.** One label style for every eyebrow, dt, caption and column head: system sans, `--text-xs`, 600, uppercase, +0.08em. Units and symbols inside a label keep their case (`340 g`, never `340 G`): wrap them in a span with `text-transform: none`.
8. **One editorial set piece per page.** A manifesto paragraph in the display face at `--text-3xl` (desktop) / `--text-2xl` (phone) with an italic phrase, or a ledger (a table of real numbers with a rule above and the total set large). Why: it breaks the card-grid rhythm the eye expects from templates, using only type. Measure still 45 or more at 1440.
9. **A typographic sign-off.** The wordmark set at numeral size at the foot of the page, `aria-hidden`, in the display face with its italic ampersand. Cheap, memorable, and it repeats the voice once more (opinion; common in current studio sites, use once).
10. **The product label speaks the page's type.** If the hero is an illustrated or CSS product (bag, box, device screen), set its label in the same display face and label style as the page, so the product and the page read as one identity.

## Decision rules
- **If** there is real photography **then** use moves 1, 5, 6, 7 and keep the headline smaller (`--text-display-2`); the image is the hero.
- **If** there is no photography **then** the headline is the hero image: moves 1 to 4 in the first screen, the product stand-in beside it, not below.
- **If** the brand has a strong color band (design-color's brand fill) **then** put the biggest numeral (the price) on it; type on a flat brand color is the cheapest graphic a page can have. Check 4.5:1 for any text under 24px on that fill.
- **If** the display face lacks a feature you want (oldstyle figures, small caps) **then** do not fake it; use the system sans label style instead (reference 05).
- **If** the page is product UI **then** none of this applies; see reference 04.

## Do and don't
- Do: one display face, roman and italic, one weight. Don't: a display face in three weights fighting each other.
- Do: units muted and smaller next to display numerals. Don't: units at full size and full color, which halves the numeral's impact.
- Do: italic phrase kept whole with `&nbsp;`. Don't: an italic phrase broken across lines by `balance`.
- Do: top-align the product stand-in with the headline at 1440. Don't: push it under the copy, where it falls below the first screen.

## Worked example
`kb/tests/design-typography/coffee-type.html` (screenshots in `kb/tests/design-typography/shots/`). Same color system and content as the design-color pilot page; only type and layout changed. Moves used: 1 (49 to 112px hero), 2 (0.95), 3 ("*roasted Tuesday*"), 4 (`translate: -0.04em`), 5 (2,100 m / 12 kg / 48 h, and a 61 to 152px price on the orange band), 6 (Ember *&* Oak), 7, 8 (manifesto plus a "What we paid" ledger), 9, 10. Font cost: 44 KB inlined (reference 06).

## Hand-offs
- Imagery, illustration and art direction: design-graphic. Layout grids and section rhythm: design-layout. Copy that earns a big headline: design-copy.
