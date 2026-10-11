# Color fundamentals and models

How color works on screens, and why to author in OKLCH. Sources: `kb/research/color/01-fundamentals-models.md`.

## Fundamentals (non-negotiable)
1. Treat a color as three separate levers: **lightness**, **chroma** (colorfulness) and **hue**. Lightness does the heavy lifting: contrast, hierarchy and legibility all come from lightness difference, not hue difference.
2. Judge every color in place, on its real background and next to its real neighbors. The same swatch reads differently on white, on gray and next to a saturated color (Albers, 1963).
3. Every color you ship has an sRGB value. Wide gamut (P3) is an enhancement layered on top, never the only value.
4. Check contrast with a calculator, not by eye. Eyes adapt; WCAG numbers do not (see 03).

## Principles
- **Author in a model whose numbers mean what they say.** In HSL, `hsl(60 100% 50%)` (yellow) and `hsl(240 100% 50%)` (blue) share L 50% but look nothing alike in lightness (Stripe 2019; Ottosson 2020). In OKLCH, L tracks perceived lightness, so equal L means roughly equal lightness across hues.
- **OKLCH is Oklab in polar form** (Ottosson, 2020). It fixes CIELAB's poor blue hue prediction; CIE LCH blues drift purple as you change lightness, OKLCH blues stay blue (Evil Martians).
- **Gamut is a ceiling on chroma that moves with hue and lightness.** Yellow can be very colorful only when light; blue can be very colorful only when fairly dark. You cannot have a dark saturated yellow (it becomes olive or brown).

## Numbers
| Thing | Value | Source |
|---|---|---|
| OKLCH L | 0 (black) to 1 or 100% (white) | MDN |
| OKLCH C | 0 upward; 100% = 0.4; practical sRGB/P3 max under about 0.37 | MDN; Evil Martians |
| OKLCH H | 0 to 360 degrees | MDN |
| Browser support | Baseline widely available since May 2023 | MDN |
| `light-dark()` | Baseline 2024; needs `color-scheme: light dark` | MDN |
| sRGB coverage | about 35% of visible colors; P3 adds about 30% | Evil Martians (one team's figure) |

**Contrast from lightness alone** (derived, every hue, chroma up to 0.20, sRGB):
| OKLCH L of the foreground | Against white | Against black |
|---|---|---|
| 0.45 or lower | 7:1 or more | |
| 0.55 or lower | 4.5:1 or more | |
| 0.65 or lower | 3:1 or more | |
| 0.59 or higher | | 4.5:1 or more |
| 0.70 or higher | | 7:1 or more |

Two consequences. First, mid-tones near L 0.6 are for fills, icons and large type, not small text. Second, no color can beat 4.58:1 against both white and black at once, because the two ratios multiply to 21 (derived from the WCAG formula: (1.05 / (Y + 0.05)) x ((Y + 0.05) / 0.05) = 21, and the square root of 21 is 4.58). One text color can never serve both a light and a dark theme with margin; every text token needs a value per theme.

## Decision rules
- If you are starting a new system: author colors as `oklch()` with an sRGB hex comment. Hex stays the hand-off format for tools that do not read OKLCH.
- If you need a hover or pressed variant of one color: use relative color syntax, `oklch(from var(--color-primary) calc(l - 0.06) c h)`. Lightness math in `calc()` uses numbers (0.06), not percentages (MDN).
- If a client asks for "more vivid" colors on modern devices: add P3 values inside `@media (color-gamut: p3)` after the sRGB value. Expect Chrome and Safari to clip out of gamut values rather than gamut map them gracefully, so keep P3 chroma inside the P3 gamut.
- If a color must stay identical everywhere (a logo color in a brand book): keep its exact hex as its own token. Do not let a generated scale move it.
- If gradients look muddy in the middle: write the interpolation space explicitly, `linear-gradient(in oklab, ...)` (syntax: MDN, color-interpolation-method), rather than relying on defaults. Our opinion: mixing complementary hues in gamma-encoded sRGB passes through a dull gray middle; Oklab keeps lightness even. Use `in oklch` only when you want the hue to travel around the wheel.

## Expert moves
- **Predict contrast before you check it.** With the L table above, you can say "body text needs L at most 0.55 on white" and pick the color in one move. Then verify.
- **Same L across hues is the trick that makes multi-hue systems feel even.** Red 600, green 600 and blue 600 at the same L read as one family and pass the same contrast tests.
- **Chroma is the dial clients feel as "brand".** Hold L for accessibility, spend chroma for personality. Neutrals with chroma 0.005 to 0.02 tinted toward the brand hue feel designed; zero chroma grays feel default (our opinion; matches Radix and Tailwind's tinted grays).
- **Oklab is not perfect.** Its data are model generated, and its hue prediction is good but not best (Ottosson). Expect to nudge yellows and blues by eye.
- **Lighting changes color.** Colors look darker and duller in bright light, brighter in dim light (Apple HIG). Test a palette on a phone outdoors before signing off.

## Do and don't
- Do: `--color-blue-600: oklch(53% 0.2 260); /* #1463dc */`. Don't: `--color-blue-600: hsl(220 80% 50%)` and assume its L predicts contrast.
- Do: darken with `calc(l - 0.06)` in OKLCH. Don't: Sass `darken(10%)` in HSL, which shifts perceived hue and saturation unevenly.
- Do: sRGB fallback, then P3 in a media query. Don't: P3-only colors.

## Worked example: "Convert my hex palette to OKLCH and tell me what I gain"
Input: primary `#3b82f6`, success `#22c55e`, warning `#f59e0b`, all used as text on white.
1. Convert (with `assets/oklch_scale.py hex2oklch`): `#3b82f6` is `oklch(62.3% 0.188 259.8)`, `#22c55e` is `oklch(72.3% 0.192 149.6)`, `#f59e0b` is `oklch(76.9% 0.165 70.1)`.
2. Read the L column: all three sit above 0.55, so none can pass 4.5:1 on white. Checks: 3.68:1, 2.28:1, 2.15:1. The green and amber even fail the 3:1 needed for icons.
3. Fix by lightness only: `oklch(53% 0.19 260)` gives `#1c64d7` at 5.45:1. Do the same for green and amber at L 0.53 (they turn darker and less neon, which is physics, not taste: dark yellow does not exist in sRGB). Keep the bright originals as fills behind dark text.
4. Gain: every color's text-readiness is now visible in its first number, and the three semantic colors read as one family because they share L.

## Hand-offs
- Contrast rules and APCA: 03. Building full scales: 02. Tokens and themes: 04.
