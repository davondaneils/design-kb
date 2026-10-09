# Typographic detail

Read this before shipping any text: characters, numerals, caps, OpenType features, alignment, links.

## Principles
1. **Details are where amateurs show.** Straight quotes, fake small caps and jittering numbers are noticed subconsciously by every reader, consciously by every professional.
2. **Use the font's real features, not imitations.** If the face has small caps, tabular figures or case forms, turn them on. If it does not, do not fake them.
3. **Typography is in the content, not just the CSS.** Correct characters must be in the text (or produced by a smart-typography step in the pipeline).

## Fundamentals (non-negotiable)
- `<html lang="...">` set correctly; it drives hyphenation, quote marks, and screen reader pronunciation.
- Curly quotes and apostrophes in all copy. The apostrophe is the closing single quote, pointing down (Butterick).
- Hyphen for compounds (well-known), en dash (U+2013) for ranges (10–20), real minus (U+2212) for negative numbers (−4), multiplication sign (U+00D7) for dimensions (1920 × 1080).
- Ellipsis character (U+2026), not three periods.
- Tabular figures on every number that updates or sits in a column.
- Left-aligned, ragged-right body text. No justified text on the web unless hyphenation is on and the column is wide (WCAG 1.4.8 AAA asks for no justification).
- Kerning on, explicitly: `font-kerning: normal`. The initial value is `auto`, which lets the browser skip kerning (for example on small text) (MDN). Never turn it off.
- No faux bold, italic or small caps.

## Character reference
| Need | Character | Unicode | Note |
|---|---|---|---|
| Quotes | curly double and single | U+201C, U+201D, U+2018, U+2019 | Language-specific: German and French use different marks; `lang` plus `q` element can set them |
| Apostrophe | right single quote | U+2019 | Also in "'90s": the apostrophe points down even at word start |
| Feet, inches, minutes | prime, double prime | U+2032, U+2033 | Not curly quotes (Butterick) |
| Range | en dash | U+2013 | Pages 10–20; score 3–2 |
| Negative, subtraction | minus | U+2212 | −12; same width as plus in most fonts, so it aligns in tables |
| Dimensions | multiplication | U+00D7 | 1920 × 1080 |
| Number plus unit | narrow no-break space | U+202F | "10 kg" never splits across lines |
| Name pairs, "No. 1" | no-break space | U+00A0 | |
| Ellipsis | ellipsis | U+2026 | |
| Trademark, copyright | real symbols | U+2122, U+00A9 | Not (c) or (TM) |

House rule note: this knowledge base never uses the long em dash; in product copy, follow the brand style guide.

## Numerals
| Context | Setting |
|---|---|
| Tables, prices in lists, timers, scores, counters, live data | `font-variant-numeric: tabular-nums lining-nums;` and right-align |
| Running prose in a serif text face that has oldstyle figures | `oldstyle-nums proportional-nums` (figures blend with lowercase) |
| Headlines and UI labels | `lining-nums proportional-nums` (default in most sans faces) |
| Codes, IDs, coupon codes | `slashed-zero` (or a mono face) |
| Recipes, measurements | `diagonal-fractions` on the fraction span only |
| 1st, 2nd | `ordinal` only where the face supports it; otherwise plain text |

Tabular figures stop numbers from jittering as they change and keep column edges flush (practitioner consensus on X: Soren, Lee Robinson, Wes Bos; mechanism per MDN).

## Caps, small caps and tracking
- All caps: under one line, +5 to 12% letter spacing (`letter-spacing: 0.06em` to `0.12em`) (Butterick).
- Use `text-transform: uppercase` in CSS rather than typing caps, so content stays reusable in other styles. Opinion: typed caps also risk some screen readers reading a word as an acronym.
- Turn on case-sensitive forms for caps: `font-feature-settings: "case" 1;` raises hyphens, parentheses and colons to cap height (if the font has `case`).
- Acronyms in prose: `font-variant-caps: all-small-caps` with +0.05em, only if the font has real small caps (`smcp`, `c2sc`). Otherwise leave acronyms as caps at normal size (Butterick: never fake small caps).
- Letter spacing disables optional ligatures in browsers. Fine for caps; do not add tracking to body text "for air".
- Negative tracking on large display text (see 01); positive on tiny text; zero on body.

## OpenType in CSS
Prefer high-level properties; they combine and inherit correctly. `font-feature-settings` overrides every feature at once and must restate them all (MDN).

```css
:root { font-kerning: normal; font-variant-ligatures: common-ligatures; }
sup, sub { line-height: 0; }
table, .num, time, .price { font-variant-numeric: tabular-nums lining-nums; }
.caps { text-transform: uppercase; letter-spacing: 0.08em; font-feature-settings: "case" 1; }
.acronym { font-variant-caps: all-small-caps; letter-spacing: 0.05em; }
code { font-variant-ligatures: none; } /* unless the team chose programming ligatures */
```
Stylistic sets (`ss01` to `ss20`) and character variants (`cv01` and up) are font-specific; read the specimen. Example: many UI faces ship a single-storey "a", an open digit 4 or a disambiguated l in a stylistic set, useful for codes and small UI.

## Alignment, hyphenation, wrapping
- Ragged right by default. Centered text only for short blocks of 1 to 3 lines (Butterick: centered text sparingly).
- `hyphens: auto` needs `lang`. Use it on narrow mobile columns and any justified text; avoid in headlines and UI labels.
- `text-wrap: balance` for headlines, `pretty` for paragraphs (see 04).
- Hanging punctuation: `hanging-punctuation: first last` works only in Safari (caniuse). For pull quotes elsewhere, use a negative `text-indent` of about -0.45em on the opening quote, tuned per font.
- Avoid widows in headlines with `balance` rather than manual `<br>`, which breaks at other widths.

## Superscripts and footnote markers
Default `sup` and `sub` push their line apart, so one footnote marker creates an uneven gap in a paragraph. Fix: `sup, sub { line-height: 0; }`. Better, where the font has real superior figures: `font-variant-position: super` (uses `sups`), which keeps the line box intact and draws properly weighted figures.

## Links and emphasis
- Links underlined in body text (color alone fails WCAG 1.4.1 in body copy). Refine: `text-decoration-thickness: 0.06em; text-underline-offset: 0.18em;` (opinion: thinner, lower underlines read as crafted; tune per font). `text-decoration-skip-ink: auto` is the default and keeps descenders clean.
- Emphasis: italic in prose, weight in UI. Never bold and italic together; never underline for emphasis (Butterick).

## Rendering (opinion)
- `-webkit-font-smoothing: antialiased` on macOS makes text thinner. Many product teams use it for light text on dark; on light backgrounds it can push small text under the legibility line. Test both; do not set it globally by habit.

## Worked example: scoreboard row
"Rangers 3-2 Penguins, 2:41 left in 3rd" typed with a hyphen becomes: team names `--text-base` 600; scores `--text-2xl` 600 with `tabular-nums lining-nums` so 1 and 0 take the same width and the score never shifts when it changes; an en dash between scores (3–2) with thin spaces if the score is large; clock in tabular figures with the colon raised via `case` if supported; "3rd" plain unless the face has a good `ordn`.

## Hand-offs
- Microcopy and tone: design-copy, copywriting skill.
- Link color and focus states: design-color, design-ux.
