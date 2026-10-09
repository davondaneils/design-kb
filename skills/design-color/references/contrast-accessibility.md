# Contrast and accessibility

What is required, what is recommended, and how to pass by construction. Research notes with full citations: `kb/research/color/03-contrast-accessibility.md` in the design-kb repo. Floor for every skill: WCAG 2.2 AA (`kb/FOUNDATIONS.md`). Cross-cutting accessibility (focus, targets, keyboard, forms, testing): design-foundations `references/accessibility.md`. This file keeps the color-specific part.

## Fundamentals (non-negotiable)
1. **Body text 4.5:1.** Large text (at least 24px regular or 18.5px bold; on the shared type scale that is `--text-xl` 25px and up, or `--text-lg` 20px bold and up) **3:1**. WCAG SC 1.4.3, AA.
2. **UI parts and meaningful graphics 3:1** against adjacent colors: input borders when the border is the only thing showing the field, checkbox outlines, toggle states, icons without a text label, chart lines, focus indicators. SC 1.4.11, AA.
3. **No rounding.** 4.499:1 fails 4.5:1. 2.999:1 fails 3:1 (W3C).
4. **Never color alone.** Errors get an icon and text; links in body copy get an underline (the minimum alternative is 3:1 between link color and surrounding text, technique G183; underline is still better); charts get labels, shapes or patterns. SC 1.4.1, A.
5. **Focus is always visible** and its indicator has 3:1 against what is next to it. Default here: 2px solid `--color-focus-ring` with 2px offset. SC 2.4.7 and 1.4.11.
6. **Placeholder and hover text count.** 1.4.3 "applies to ... placeholder text and text that is shown when a pointer is hovering".
7. **Exempt, and only these:** disabled controls, pure decoration, logotypes, text inside photos with significant other content, unmodified browser default controls.

## The formula
Relative luminance per channel: c = v/255; linear = c/12.92 if c <= 0.04045, else ((c + 0.055)/1.055)^2.4. L = 0.2126R + 0.7152G + 0.0722B. Ratio = (L_light + 0.05)/(L_dark + 0.05), from 1 to 21. Tool: `assets/oklch_scale.py check FG BG`.

## Numbers
| Element | Minimum (AA) | Enhanced (AAA or better practice) |
|---|---|---|
| Body text | 4.5:1 | 7:1 (SC 1.4.6). Apple: "strive for 7:1, especially in small text" |
| Large text | 3:1 | 4.5:1 |
| Placeholder text | 4.5:1 | Use a visible label anyway |
| Icons that carry meaning, input borders, focus rings | 3:1 | |
| Inline link vs surrounding body text (if no underline) | 3:1 (G183) | Underline instead |
| Disabled control | none required | Keep it recognisable; pair with a reason |
| Focus Appearance (AAA, 2.4.13) | | 2px perimeter area, 3:1 between focused and unfocused |

**Lightness pass lines (OKLCH, any hue, sRGB):** on white, L at most 0.55 passes 4.5:1, at most 0.45 passes 7:1, at most 0.65 passes 3:1. On black, L at least 0.59 passes 4.5:1, at least 0.70 passes 7:1.

**Gray text on white:** `#767676` (4.54:1) is the lightest neutral gray that passes body text. Light gray placeholders like `#a1a5ac` (2.47:1) fail.

## APCA (label as draft, never as the standard)
- APCA is a proposed perceptual contrast method. It is **not** in the WCAG 3 draft: it was removed in July 2023, and the draft says the WCAG 3 contrast algorithm "is yet to be determined" (Roselli, April 2026). WCAG 3 is not expected to be final before 2030 (Roselli's estimate).
- The legal tests are WCAG 2.x: US ADA Title II uses WCAG 2.1 AA (compliance April 2027 or 2028 by population size, after the April 2026 extension); the EU Accessibility Act (in force June 2025) works through EN 301 549, which references WCAG 2.1 AA. Design to 2.2 AA, which is a superset.
- Use APCA as a second opinion. Its levels: Lc 90 preferred body text, Lc 75 minimum body text, Lc 60 other readable text, Lc 45 large headlines and fine icons, Lc 30 absolute minimum for placeholder and disabled, Lc 15 for dividers.

## Decision rules
- If text is under 24px regular (or 18.5px bold): 4.5:1. Otherwise 3:1. If unsure whether the font renders that large, use 4.5:1.
- If the font is thin (weight 300 or lighter) or the text is under 14px: aim for 7:1. W3C notes thin fonts may need more contrast.
- If you are in dark mode: pass WCAG 2 **and** aim for APCA Lc 75 on body text and Lc 60 on other text, including accent and link text. WCAG 2 is lenient on light text over very dark backgrounds: `#3b85ff` on `#101214` passes WCAG at 5.35:1 but scores only Lc 39. In practice, dark mode body text needs OKLCH L 0.86 or more on an L 0.18 surface (Lc 78).
- If white text on a saturated mid blue, purple or red fails WCAG at 3.5 to 4.4:1: you still must fix it to claim AA (darken the fill to the 600 step). APCA rates these pairs better than WCAG does; that is a reason to prefer APCA's opinion in design debates, not a legal pass.
- If text sits on an image: put a scrim or solid band behind it and check the worst pixel, not the average. Background images without enough contrast fail (F83).
- If a control is identified only by its border (an empty text input): border 3:1 against the background. If it has a visible label inside and a filled background, the border is optional.
- If you style hover: the hover state may be subtler than 3:1, but must not lower the contrast of text, borders or the focus ring (W3C).
- If a client wants a low contrast "elegant" gray for body text: show them the number and the law. Offer elegance through weight, size, spacing and a warm tinted near-black instead (for example L 0.30, chroma 0.01, hue 60).

## Color vision and forced colors
- About 1 in 12 men and 1 in 200 women have a color vision deficiency, mostly red/green (Colour Blind Awareness). Red vs green as the only status difference fails many users. Add icons and words; make one of the pair clearly lighter (different L) so it survives grayscale.
- Quick test: view the screen in grayscale. If two states look the same, they rely on hue alone.
- Windows contrast themes (`forced-colors: active`) replace author colors and remove box-shadow. Keep real borders on buttons, cards and inputs (transparent borders become visible), use system colors like `CanvasText` and `ButtonText` for small fixes, and never ship a separate design for it (MDN).
- Apple asks for light, dark and increased contrast variants of every custom color. The web equivalent is `@media (prefers-contrast: more)`: raise muted text to body text values and borders to the 600 step.

## Expert moves
- **Pass by construction, not by audit.** Lock lightness steps so the right pairs always pass (see palette-building.md). Then audits find nothing.
- **Know the sqrt(21) limit.** No color gets more than 4.58:1 against both white and black, so every text token needs a separate light and dark value.
- **Contrast budget for hierarchy.** Use three text levels, not five: body (7:1 or more), muted (4.5:1 to 6:1), and disabled (exempt, about 2:1 to 3:1). Hierarchy below 4.5:1 is not available for real content; get it from size and weight.
- **Check states, not just defaults.** Selected tabs, pressed buttons, error borders, focus on dark sections and on the brand color fill each need their own check.
- **Focus rings on colored fills.** A blue ring around a blue button fails 3:1 against the button. Use a 2px offset so the ring sits against the page background, or a two-tone ring (inner white, outer dark).

## Do and don't
- Do: error = red 600 text and border, plus an icon and message. Don't: red border only.
- Do: `#595959` or darker for small gray text on white when you want margin (7:1). Don't: `#999` (2.85:1).
- Do: label APCA as "draft method, not a WCAG requirement". Don't: tell a client "we follow WCAG 3".

## Worked example: "Check this dark mode: #3b82f6 links on #111"
1. WCAG: `#3b82f6` on `#111111` is 5.13:1. Passes AA, so a generic check stops here.
2. APCA second opinion: Lc 37, far below Lc 60 for readable text and Lc 75 for body copy. Inline links will look dim and strain the eye.
3. Fix by lightness, keeping the hue: the 300 step (`#9dc2ff`) gives 10.43:1 and Lc 68; the 200 step (`#c2d9ff`) gives Lc 82 for link-dense long text. Reserve the 400 step (`#6da4ff`, 7.56:1, Lc 53) for icons and large labels.
4. Underline inline links so they do not rely on color (1.4.1).
5. Result: legal pass with margin, and comfortable reading in the theme where WCAG 2 is least reliable.

## Hand-offs
- Scales that pass by construction: palette-building.md. Dark mode surfaces and state tokens: ui-tokens-themes.md. Typography sizes and weights: design-typography (planned). Focus and keyboard behavior: design-ux and design-frontend (planned).

## Sources
- W3C, WCAG 2.2 (12 Dec 2024). https://www.w3.org/TR/WCAG22/
- W3C, Understanding 1.4.3, 1.4.11, 1.4.1, 2.4.7, 2.4.13 and Technique G183. https://www.w3.org/WAI/WCAG22/Understanding/
- Myndex, APCA in a Nutshell. https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html
- Roselli, WCAG3 contrast as of April 2026. https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
- US DOJ, ADA Title II web rule. https://www.ada.gov/resources/2024-03-08-web-rule/
- Colour Blind Awareness. https://www.colourblindawareness.org/colour-blindness/
- MDN, forced-colors and prefers-contrast. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
- Apple HIG, Dark Mode. https://developer.apple.com/design/human-interface-guidelines/dark-mode
- Dark mode WCAG vs APCA pairs: measured with `assets/oklch_scale.py`.
