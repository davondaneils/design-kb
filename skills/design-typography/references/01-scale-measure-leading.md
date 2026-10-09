# Scale, measure and leading

Read this when choosing sizes, line lengths and line heights, or when building type tokens. Defaults follow the shared design-kb foundation contract (root 16px, ratio 1.25, body line height 1.5, headings 1.1 to 1.25, measure 45 to 75 with 66 ideal).

## Principles
1. **Size is set by reading distance and task, not taste.** Body text on a phone at arm's length and on a laptop are the same angular size at roughly the same px; TV and signage are larger (Apple tvOS default 29pt vs iOS 17pt, HIG).
2. **Everything optical scales inversely with size.** As text grows, line height ratio falls and tracking tightens. As text shrinks, both open up. Material 3 encodes exactly this: Display Large 57/64 with -0.2 tracking, Body Small 12/16 with +0.4 (TypeScaleTokens).
3. **Measure is the master variable for comfort.** A perfect size with a 110-character line still fails. Set the measure first, then size, then leading.
4. **The user's settings win.** Sizes in rem, containers that grow, no fixed text heights (WCAG 1.4.4, 1.4.12).

## Fundamentals (non-negotiable)
- Root font size stays the browser default. Never set `html { font-size: 62.5% }` or a px value; it overrides user preferences. Use `rem` for type, `em` for spacing that should follow local text size.
- Body text: 16px (1rem) minimum on the web; 17pt on iOS (HIG body); 16sp on Android (M3 Body Large). Smallest text anywhere: 12px web, 11pt iOS (HIG minimum). 12px is for captions and labels only, never paragraphs.
- Form inputs: 16px or larger, or iOS Safari zooms on focus (CSS-Tricks). Do not disable zoom to work around it.
- Paragraph line height 1.5, unitless (`line-height: 1.5`) so it scales with any size. Headings 1.1 to 1.25.
- Measure 45 to 75 characters, 66 ideal (Bringhurst); 80 is the hard ceiling (WCAG 1.4.8 AAA). Multi-column: 40 to 50.
- No container that holds text may have a fixed height or `overflow: hidden` that clips when a user sets line height 1.5, paragraph spacing 2em, letter spacing 0.12em, word spacing 0.16em (WCAG 1.4.12 F104). Use `min-height`.
- Fluid sizes: max no more than 2.5x min, endpoints in rem (Smashing, 2023). Otherwise 200% zoom fails at some widths.
- One scale. Every size in the product is a token. An off-scale size is a bug unless documented.

## The default scale (foundation contract)
Ratio 1.25 (major third) from 16px. 12 and 14 are hand-tuned UI steps below base (the pure ratio would give 12.8 and 10.24, which render poorly).

| Token | px | rem | UI line height (4px grid) | Prose line height (unitless 1.5) | Heading line height | Tracking (starting point) |
|---|---|---|---|---|---|---|
| `--text-xs` | 12 | 0.75 | 16 (1.33) | 18 | n/a | +0.01em; caps labels +0.06 to +0.1em |
| `--text-sm` | 14 | 0.875 | 20 (1.43) | 21 | n/a | 0 |
| `--text-base` | 16 | 1 | 24 (1.5) | 24 | 20 (1.25) for bold UI titles | 0 |
| `--text-lg` | 20 | 1.25 | 28 (1.4) | 30 (lead text, long-read body) | 24 (1.2) | -0.005em |
| `--text-xl` | 25 | 1.5625 | n/a | n/a | 28 (1.12) | -0.01em |
| `--text-2xl` | 31 | 1.9375 | n/a | n/a | 36 (1.16) | -0.015em |
| `--text-3xl` | 39 | 2.4375 | n/a | n/a | 44 (1.13) | -0.02em |
| `--text-4xl` | 49 | 3.0625 | n/a | n/a | 56 (1.14) | -0.02em |
| `--text-5xl` | 61 | 3.8125 | n/a | n/a | 68 (1.11) | -0.025em |

Line heights in the UI and heading columns snap to the 4px grid (Material does the same: 16/24, 14/20, 12/16, 22/28). Tracking values are opinion: they follow the shape of Inter's published formula (tracking = -0.0223 + 0.185 x e^(-0.1745 x px), rsms) and Material's tokens, and must be tuned per typeface. A face drawn for display (Inter Display, a "Display" cut) already has tight spacing; apply less.

## Decision rules
- **If** it is a product UI (dense, many components) **then** use the 1.25 scale above, absolute grid-snapped line heights set together with size in one token pair (`font-size` + `line-height`), and do not inherit line height across components.
- **If** it is prose (articles, docs, marketing body) **then** use unitless `line-height: 1.5` on the text container so every inline size inherits correctly.
- **If** the brief is a long-read (over about 800 words) on desktop **then** body is `--text-lg` (20px) or fluid from 1rem to 1.25rem (ratio 1.25, well under the 2.5x limit). Opinion: 18 to 21px is where most elite editorial sites sit; Butterick's range is 15 to 25px.
- **If** the screen is under 640px (foundation `sm`) **then** compress display steps: cap headings at `--text-3xl` (39px) or use the fluid tokens below. A 61px headline on a 360px screen holds about 8 to 10 characters per line, which breaks words badly.
- **If** you need a ratio other than 1.25 **then**: 1.2 (minor third) for dense dashboards and data tools; 1.333 (perfect fourth) or larger for marketing and editorial heroes where you want drama. Keep 1.25 tokens and add a separate display ramp rather than changing base tokens other skills depend on.
- **If** lines are long (approaching 75 to 80 characters) **then** raise line height toward 1.6. **If** short (captions, cards, 30 to 45 characters) **then** 1.3 to 1.4 is fine for non-paragraph UI text, but keep paragraphs at 1.5 or more.
- **If** text is light on a dark background **then** add about 0.05 to the line height and see the weight note in 03 (opinion: light text on dark reads heavier and tighter).

## Measure in CSS
- Set `max-width` on the text block, not the page. Start with `max-width: 34em` (about 66 characters at Bringhurst's 0.5em average character width).
- `66ch` is not 66 characters. `ch` is the width of the digit zero, wider than the average character in most proportional faces, so `66ch` often holds 72 to 80 characters (estimate from the CSS definition; verify per font). If you use `ch`, start near `60ch` and count a real paragraph.
- Count, do not guess: paste a real paragraph, count characters including spaces on three lines, average.

## Fluid display sizes
Formula (Utopia method): slope = (maxPx - minPx) / (maxVw - minVw); intercept = minPx - slope x minVw. Size = `clamp(min, intercept + slope*100vw, max)` with min and max in rem.

From a 360px to a 1280px viewport (foundation breakpoints run to 1280 `xl`):

```css
:root {
  --text-3xl: clamp(1.5625rem, 1.22rem + 1.52vw, 2.4375rem); /* 25 to 39px */
  --text-4xl: clamp(1.9375rem, 1.5rem + 1.96vw, 3.0625rem);  /* 31 to 49px */
  --text-5xl: clamp(2.4375rem, 1.9rem + 2.39vw, 3.8125rem);  /* 39 to 61px */
}
```
Every max/min ratio here is about 1.6, inside the 2.5x limit. Keep body and UI text fixed (or fluid by at most one step); fluid body text in dense UI moves layouts in ways users did not ask for (opinion).

## Vertical rhythm
- Paragraph spacing: one line (1.5em at body) or `--space-24` at 16px body. Do not combine with first-line indents (Butterick).
- Space above a heading at least 2x the space below it, so the heading belongs to what follows (proximity). Example at 16px body: h2 `margin-top: 48px` (`--space-48`), `margin-bottom: 16px`.
- Trim half-leading where alignment matters: `text-box: trim-both cap alphabetic` (Baseline 2026, newly available per MDN). With trim, a 16px label in a button centers on cap height, not on the line box. For older browsers use Capsize-generated negative margins.

## Do and don't
- Do: `font-size: 1rem; line-height: 1.5;` Don't: `font-size: 14px; line-height: 20px;` on paragraphs that users may enlarge.
- Do: `--text-5xl` tracking -0.025em. Don't: default tracking at 61px, which looks loose and amateur.
- Do: caps label at 12px with +0.08em. Don't: caps label at 12px with 0 tracking (letters collide) or negative tracking.
- Do: `min-height` on cards. Don't: `height: 48px` on a text badge that wraps at 200% zoom.

## Worked examples
1. **SaaS settings page.** Setting descriptions are paragraphs users read, so they get `--text-base` 16/24, not the tempting 14px. Field labels `--text-sm` 14/20 weight 500. Inputs 16px (iOS zoom). Section titles `--text-lg` 20/24 weight 600, margin-top 48, margin-bottom 16. Result: four styles, every size a token.
2. **Long-read essay.** Container `max-width: 34em` at 20px body (about 680px wide), `line-height: 1.5`, paragraphs spaced 1.5em. Headline `--text-5xl` fluid, line height 1.1, tracking -0.025em, `text-wrap: balance`. Mobile body falls to 1rem via `clamp(1rem, 0.9rem + 0.45vw, 1.25rem)` (ratio 1.25).
3. **iOS app.** Use Dynamic Type styles, not fixed sizes: Body 17/22, Headline 17/22 semibold, Title 2 22/28 (HIG). For a custom font, scale with `UIFontMetrics` or SwiftUI `.font(.custom(_:size:relativeTo:))` so user text size settings apply. On Android, set all text in `sp` (never `dp`) so it follows the user's font scale, and test layouts at 200% font scale.

## Non-Latin scripts
- Choose faces with native support for each script (for example the Noto families) rather than relying on browser fallback mid-sentence.
- Scripts with tall stacked marks or dense glyphs (Vietnamese, Thai, Devanagari, CJK) need more line height than Latin; opinion: 1.6 to 1.8 for body.
- Never add letter spacing to connected scripts such as Arabic; it breaks joins. WCAG 1.4.12 exempts scripts that do not use a spacing property.
- CJK has no italics; use weight or a different color token for emphasis instead of synthesized oblique.
- Measure for CJK is counted in characters too, but each is full-width; a common range is about 30 to 40 characters per line (opinion).

## Hand-offs
- Spacing tokens and grid: design-layout.
- Contrast of muted text and text on images: design-color.
- Token plumbing, clamp in CSS, container queries: design-frontend.
- Dense numeric tables: design-product-ui (planned).
