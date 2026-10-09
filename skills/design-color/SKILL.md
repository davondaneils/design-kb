---
name: design-color
description: Color for websites, apps and brand work, at the level of a top studio. Use whenever the task involves choosing, building, checking or explaining color - "pick a palette", "brand colors", "color scheme", "color palette for my landing page", "make this accessible", "check contrast", "WCAG contrast", "APCA", "dark mode colors", "light and dark theme", "design tokens for color", "Tailwind colors", "OKLCH", "hover/disabled state colors", "my brand color fails contrast", "what color should this brand be", "color psychology", or reviewing a UI's colors. Also use when writing CSS custom properties for color or turning a client's hex codes into a system. Not for chart palettes alone (use dataviz), positioning (use website-strategy) or print/CMYK.
---

# design-color

Make color decisions that a top studio would sign off on: fundamentals perfect first, then the expert layer. All defaults follow the shared contract in `kb/FOUNDATIONS.md` (design-kb repo): token names `--color-{role}-{variant}`, 50 to 950 primitive ramps, WCAG 2.2 AA floor.

## 1. Fundamentals (non-negotiable, check every answer against these)

1. **Contrast, no rounding.** Body text 4.5:1. Large text (24px+, or 18.5px+ bold; on the shared type scale `--text-xl` 25px+ or `--text-lg` 20px bold) 3:1. Icons, input borders, focus indicators and meaningful graphics 3:1 against what is next to them. 4.499:1 fails. Placeholder text counts.
2. **Never color alone.** Errors get icon plus words; inline links get an underline; charts get labels or shapes; selected states get a non-color mark.
3. **Visible focus everywhere.** Default 2px solid `--color-focus-ring`, 2px offset, 3:1 against the adjacent color.
4. **Lightness carries contrast and hierarchy.** Hue does not. Pick lightness first, then chroma, then hue.
5. **Neutrals do most of the work.** 11 neutral steps, one primary, semantic hues (success, warning, danger, info). Every extra hue needs a job.
6. **Scales are defined up front** with the same lightness per step across hues. No ad hoc lighten/darken.
7. **Components use semantic roles only**: `bg`, `surface`, `surface-raised`, `text`, `text-muted`, `border`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger`, `info`, `focus-ring`. Every fill has a paired text color that passes.
8. **Dark mode is a remap, not an inversion.** Same roles, different steps; elevation by lighter surfaces.
9. **One color, one meaning.** Brand color is not also the error color or decoration on non-interactive text.
10. **Verify with numbers, then judge by eye in context.** Every text and UI pair, every state, both themes. Color is relative to its neighbors (Albers).
11. **Label claims**: evidence, convention or folklore. Mark opinions as opinions.

If an answer breaks any of these, fix it before adding anything clever.

## 2. Core numbers

**OKLCH lightness pass lines** (any hue, sRGB; measured): on white, L at most 0.55 gives 4.5:1, at most 0.45 gives 7:1, at most 0.65 gives 3:1. On black, L at least 0.59 gives 4.5:1. No color exceeds 4.58:1 against both white and black (the ratios multiply to 21), so every text token needs a light and a dark value.

**Contrast-locked ladder** (default for every hue):

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| OKLCH L | .975 | .935 | .88 | .81 | .72 | .635 | .53 | .46 | .39 | .32 | .25 |
| Chroma share | 12% | 28% | 50% | 75% | 95% | 100% | 100% | 92% | 80% | 65% | 50% |

Neutrals add 975 (L .215) and 990 (L .18) for dark surfaces. Worst cases across all hues: 600 on white 4.94:1 (and white on 600); 600 on 50 4.64:1; 700 on 100 5.58:1; 500 on white 3.19:1 (UI and large text only). **Rule: six ladder positions apart passes body text (worst 4.64:1: 50 to 600, 100 to 700, 200 to 800), five apart passes 3:1 with almost no margin (worst 3.01:1).** Count positions on the 11-step ladder, not hundreds: 600 on 100 is five positions and fails body text at 4.37 to 4.39:1 on every hue (measured 2026-10-09, all hues at 15 degree steps). So `text-muted` (600) passes on `bg` (50) and white, never on a 100 tint: use 700 there.

**Max chroma by personality** (opinion, starting points): calm or premium 0.08 to 0.13, standard 0.14 to 0.20, loud 0.20 to 0.26, neutrals 0.005 to 0.02.

**Default role mapping** (neutral and primary from the ladder):

| Role | Light | Dark |
|---|---|---|
| bg / surface / surface-raised | neutral-50 / white / white + shadow | neutral-990 / 975 / 950 |
| text / text-muted | neutral-900 / neutral-600 | neutral-50 / neutral-300 |
| border / border-strong | neutral-200 / neutral-500 | neutral-800 / neutral-600 |
| primary / hover / pressed / on-primary | 600 / 700 / 800 / white | same |
| accent (links), focus-ring | primary-600 | primary-300 |
| success, warning, danger text | 600 of their hue | 300 of their hue |
| *-subtle backgrounds | 50 or 100, text 800 | low-chroma tint at L .25 (chroma .03 to .035, for example `oklch(25% 0.035 25)`), text 200. The 950 step (chroma .05 to .1) glows on near-black surfaces |

## 3. Workflow for any color task

1. **Read the brief**: who, what product, light/dark needs, existing brand colors, markets.
2. **Convert** any given colors to OKLCH (`assets/oklch_scale.py hex2oklch "#hex"`) and read L. That one number tells you what role the color can play.
3. **Generate ramps** for neutral, primary and semantic hues with the ladder (`scale --hue H --chroma C`), using `--neutral` for the neutral ramp and `--shift` for yellows and oranges.
4. **Map roles** for both themes. Keep the client's exact brand color as its own primitive `--color-brand` for logo and marketing moments.
5. **Check every pair** (`check FG BG`): each text role on each surface, each state, both themes. In dark mode also aim for APCA Lc 75 on body text and Lc 60 on other text.
6. **Judge in context** on real screens, then tune hue and chroma by eye. Re-check if you touched lightness.
7. **Deliver** values as OKLCH with hex fallbacks, semantic tokens, contrast results, and the reasoning, with opinions labelled.

**Reviewing an existing UI** (audit): list every text and UI pair with its surface in both themes; measure each (`check`); flag fails with the criterion (1.4.3, 1.4.11, 1.4.1); flag dark mode pairs under APCA Lc 60; check placeholder, focus, error, disabled and selected states; give a fixed value for each fail, keeping the hue and changing lightness; note tokens that are reused across themes (they cannot pass in both).

## 4. Decision rules

- **Brand color L above 0.65** (light: yellows, oranges, pastels): a fill, accent or illustration color, never small text on white, never with white labels. Dark labels pass WCAG, but between L 0.65 and 0.75 they score only APCA Lc 45 to 50, so on those fills use dark labels at `--text-lg` bold or larger, or use the 600 step with a white label for small buttons.
- **Brand color L 0.56 to 0.65** (mid-tones): fills and icons; white labels usually fail at body size (the pass line is L 0.55 to 0.595 by hue). Use the 600 step for buttons, or large labels.
- **Brand color L 0.55 or below**: it can be text and carry white labels. Still check: 4.5:1 exactly has no margin.
- **In every band**: text and links use the 600 or 700 step of the brand hue; the exact brand color stays a primitive (`--color-brand`).
- **Margin**: aim for 5:1 or more on text you control. A pair at 4.51:1 breaks on hover tints, thin weights or anti-aliasing.
- **Brand is red or green**: shift danger or success by at least 20 degrees of hue and lean on icons. Never use brand red for errors.
- **No brand color**: choose hue by category map and ownability (`references/psychology-brand.md`), chroma by personality.
- **Yellows and oranges**: rotate dark steps toward orange (`--shift -20`) so they read gold, not olive. Never use yellow as text on white.
- **Dark mode accent text**: 300 step or lighter. 500 fails WCAG on some dark surfaces, and 400 scores only about Lc 53.
- **Muted text on a tinted or sunken surface** (100 step, image stage, alert): 600 fails there; use 700 for muted text, or full `text`.
- **Light brand color in dark mode** (L .65 to .75, such as teal `#14b8a6` or orange `#f26b21`): it can return exact as the primary fill in dark mode with a near-black label (`#101214` on `#14b8a6` 7.54:1), so the brand shows true where it is strongest. In light mode the same role uses the 600 step with white.
- **Full-bleed brand band in dark mode**: a large field of a bright brand color glares on a dark page. Drop the band to the 950 step of the hue (text 50 to 200) and let the exact brand color return only as the one bright fill (the CTA).
- **Chart series next to a gray benchmark** (this period vs previous): separate them by lightness (at least .15 L), not hue. Teal 500 vs gray 500 measured deutan Delta E 0.3 in the dataviz validator; teal 700 vs gray 500 measured 14.9. Then dash the benchmark and label both.
- **Hover**: one step darker (600 to 700) in both themes, so white labels keep passing. Pressed: two steps. Disabled: neutral-100 fill, neutral-400 text (exempt, keep recognisable).
- **Text on color**: tint the text toward the background hue (blue-800 on blue-100), not gray.
- **Text on images**: scrim or solid band, check the worst pixel.
- **Alpha colors** (`rgb(255 255 255 / 0.6)` text, translucent borders): contrast depends on whatever is behind. Check the composited color on every surface it can sit on, or use solid tokens for text.
- **Email and old embeds**: ship hex only; many email clients do not support modern CSS color (opinion; check caniemail.com).
- **Client wants low contrast "elegant" gray body text**: refuse the contrast, give elegance through size, weight, spacing and a warm near-black (for example `oklch(30% 0.01 60)`, 13.6:1).
- **Theme default**: follow the OS; offer Light, Dark, System. Do not default general audiences to dark (NN/g 2020).
- **APCA**: use as a second opinion only and label it "draft method, not a WCAG requirement". Legal baselines are WCAG 2.1 AA (US ADA Title II, EU EN 301 549); design to 2.2 AA.
- **Charts**: hand off to the dataviz skill; keep chart palettes separate from status colors. Okabe-Ito is a safe categorical start.

## 5. Expert layer (what separates top work from competent work)

- **Predict, then verify.** Read OKLCH L and know the contrast class before you check it.
- **The 500 is not your button.** Tailwind blue-500 with white text is about 3.7:1. Buttons with 14 to 16px white labels sit at 600.
- **Brand color is a token, not a step.** Keep it exact; build the ladder from its hue; never bend the ladder to fit it.
- **Change the role, not the color.** When a brand color fails, a generic fix darkens it into mud. The expert fix moves it to a role where it passes (fill behind dark text, underline, illustration).
- **WCAG 2 is least reliable in dark mode.** `#3b82f6` on `#111` passes at 5.13:1 but scores Lc 37. Go lighter (300 step) for dark mode links.
- **Chroma peaks mid-scale.** Full chroma at the ends looks neon (light) or clips (dark).
- **Tinted neutrals** (chroma 0.005 to 0.015, brand hue) make a system feel designed; warm neutrals (hue 60 to 80) feel editorial (opinion).
- **Finer steps near black** for dark surfaces (990, 975, 950), lighter as they rise.
- **Three inputs, whole theme.** Hue, chroma and the fixed ladder regenerate everything, so a rebrand is a primitives swap (Linear does this with base, accent and contrast).
- **Name the gradient space**: `linear-gradient(in oklab, ...)` keeps lightness even between distant hues; do not rely on defaults (opinion on the visual result; syntax per MDN).
- **Check light, dark and more-contrast** (`prefers-contrast: more`) and Windows `forced-colors` (keep real borders).
- **Drop the folklore.** The "62 to 90 percent of judgments are color" figure has no source. Hue-emotion tables are conventions, not laws.

## 6. Worked examples

**A. Client brand yellow `#FFC20E`, needs buttons and links.**
`oklch(84.6% 0.172 85.3)`: L .85, so 1.62:1 on white. Role change: primary button = yellow fill with near-black label (10.39:1); hover moves to the 300 step, which stays yellow (8.88:1). The fill itself is 1.62:1 on white, which is allowed because the label identifies the control (SC 1.4.11). Links = near-black text with a 2px yellow underline (decoration, no contrast duty). Focus ring = 2px near-black, 2px offset (yellow fails 3:1 on white). Yellow ramp with `--shift -20` gives 600 `#8a6500` (5.33:1) for small "pending" labels. The brand stays loud; nothing turns brown.

**B. Dark mode check: `#3b82f6` links on `#111`.**
WCAG 5.13:1 passes; APCA Lc 37 says dim. Use primary-300 `#9dc2ff` (10.43:1, Lc 68) for inline links, underlined. Keep 400 for icons and large labels.

More worked examples (fintech palette, SaaS tokens, wellness brand hue, hex-to-OKLCH migration) are in the references.

## 7. Tool

`assets/oklch_scale.py` (Python 3, no dependencies):
```
python3 assets/oklch_scale.py scale --hue 260 --chroma 0.20 [--neutral] [--shift -20] [--css --name blue]
python3 assets/oklch_scale.py check "#1463dc" "#ffffff"      # WCAG ratio + verdict, APCA Lc
python3 assets/oklch_scale.py hex2oklch "#ffc20e"
```
`--css` prints `--color-{name}-{step}: oklch(...); /* #hex */`. Hex values are gamut-safe sRGB fallbacks. If you cannot run code, use the ladder table and the pass lines, and say the numbers are unverified.

## 8. Reference map

| Read | When |
|---|---|
| `references/fundamentals-models.md` | OKLCH syntax, gamut and P3, relative colors, hex migration |
| `references/palette-building.md` | Full ladder, guarantees, harmony, proportion, brand color handling, fintech and yellow examples, data viz pointers |
| `references/contrast-accessibility.md` | Every WCAG criterion and number, APCA levels and status, legal baselines, color blindness, forced colors |
| `references/ui-tokens-themes.md` | Role mapping with measured values, CSS skeleton, states table, dark mode, SaaS token example |
| `references/psychology-brand.md` | Evidence vs folklore, choosing a brand hue, presenting to clients, wellness example |

## 9. Related skills

- **website-strategy**: positioning and competitor set before choosing a brand hue.
- **copywriting**: color names and microcopy in brand books.
- **dataviz**: chart palettes and chart color rules.
- design-typography, design-layout, design-ux, design-motion, design-frontend (planned): sizes, spacing, focus behavior, state transitions and implementation share `kb/FOUNDATIONS.md`.

## 10. Before you answer

- Every text pair has a ratio, and it passes. Every UI pair passes 3:1.
- Both themes covered if the product has (or will have) dark mode.
- States covered: hover, focus, pressed, selected, disabled, error.
- Values in OKLCH with hex fallbacks; tokens named `--color-{role}-{variant}`.
- At least one non-obvious move that a strong generalist would miss.
- Opinions labelled; no folklore stated as fact.
