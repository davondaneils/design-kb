# Family: home page

- **URL:** https://family.co (final URL https://family.co/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/family-home.json`); hero, button and section-head details from `kb/teardowns/probe.mjs` and a scratch probe of the same kind. Screenshots: `kb/exemplars/shots/family-home-1440-light.jpg`, `family-home-390-light.jpg` (capped at 6000px tall; the page is 11,315px at 1440).
- **Caveat:** many colors are declared in `color(display-p3 ...)`. Hex values for those are my conversion to sRGB (clipped where the P3 color is outside sRGB), so treat their contrast ratios as close, not exact.
- **Strongest in:** imagery (a mascot illustration system), type (a custom display face over Inter), brand, product-ui.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Inter` 400/500/600 for 93% of characters; `Family` (custom display, 500 only) for headlines; `LFE Sans` 400/600 in a small number of elements |
| Weights | 400 body, 500 for every display head and the buttons, 600 for small labels and eyebrows |
| Type steps (1440) | 68 (hero), 44 (section heads), 23 (blog card titles), 19 (lead), 17 (body), 15, 14, 13 |
| Line height | 68/74.8 (1.1), 44/48 (1.09), 23/25 (1.09), 19/27 (1.42), 17/26 (1.53), 15/22 (1.47), 14/20 (1.43), 13/18 (1.38) |
| Tracking | Negative at every size: -1.36px at 68 (-0.02em), -1.35px at 44 (-0.031em), -0.44px at 23 (-0.019em), -0.3px at 19 (-0.016em), -0.22px at 17 (-0.013em), -0.13px at 15, -0.09px at 14 |
| Hero (390) | 44/48 (1.09), -1.35px, centered, 342px wide; section heads drop to 32/35 |
| Text colors | Body `#474645` (9.42:1 on white, 7,837 characters); heading `display-p3(.204 .204 .2)` = `#343433` (12.5:1); dark `#121212` (18.7:1); muted `#848281` (3.82:1); `#474645` at 70% (4.08:1) |
| Eyebrow colors | One per section, all 14px/600: orange `#ff3e00` approx (3.54:1), blue `#0086fc` approx (3.61:1), gold `#d48f00` approx (2.72:1), green `#00c978` approx (2.18:1) |
| Surfaces | `#ffffff` page; `#fbfaf9` warm panels; `#f6f4ef` secondary button; `#171717` primary button; `#000000` phone frames |
| Borders | Almost no CSS borders: panels use an inset ring instead, `inset 0 0 0 1px display-p3(.949 .941 .929)` (30 uses) |
| Radii | 10px testimonial panels, 12px explore panels, 40px images, 72px (27 uses, large rounded media), 32px pill buttons, 6px nav items, 7.5% phone screens |
| Shadows | Panels: inset 1px ring only. Floating cards: `0 1px 6px rgba(0,0,0,.04), 0 0 24px rgba(0,0,0,.05)`. Dropdown: `0 0 24px rgba(0,0,0,.15)`. |
| Buttons | "Download on iOS" 210x48, `#171717`, white Inter 17px/500, padding **0 24 0 22**, radius 32, Apple glyph. "Watch the Video" 198x48, `#f6f4ef`, `#121212`, padding **0 20 0 19**, play glyph. Nav "Get Started" 109x32, 15px/500. |
| Container | 1072px max for content; 620px for the centered hero copy |
| Spacing | Section padding varies per section: 120/96, 104/104, 132/112, 78/92 (at 390: 24 to 48). Padding 32, 12, 8, 24, 48; gaps 8, 10, 11.2, 12, 15, 24. |
| Motion | Reveal `transform 1s cubic-bezier(.19,1,.22,1)` (expo-out, 56 uses); image hover `transform .22s` same curve; links `all .2s ease-out` (120 uses); buttons `background-color .1s ease`; a 120s linear marquee. **0** `prefers-reduced-motion` rules. |
| Body measure | 17px in a 494px column: 57 characters per line. Phone: 40. |

## What it does right

**Type.** A custom geometric display face (`Family`, 500) for heads only, Inter for everything else, and every size tracked negative in proportion: about -0.02 to -0.03em on display and -0.01em on 17px body. Body is set at 17/26 (1.53), a size up from the usual 16, which suits a page that explains an unfamiliar product. Section heads are paired sentences set as two lines: "Relentless protection. Restful ease.", "Effortless onboarding. Masterful management."

**Color.** Neutrals are warm: body `#474645`, panels `#fbfaf9`, secondary button `#f6f4ef`. Color lives in the illustrations and in one eyebrow per section (orange "Understandable", blue "Send & Receive", gold "Seamless", green "Simple"), and the same hue then marks that section's checklist icons. A full P3 palette sits in `:root` (`--graphic-green`, `--graphic-blue-pale`, `--graphic-gold-alt`, and more), so illustrations and UI share tokens.

**Layout and spacing.** Centered hero framed by two illustration clusters that bleed off the left and right edges. Below, a 3-column grid of feature panels (Easy, Secure, Fast, Powerful, Fun), each panel a live UI fragment with a title and a two-line caption. Then alternating rows: phone screenshot on one side, eyebrow, head, paragraph, checklist and a "Watch the demo" thumbnail on the other. Section padding is tuned by eye per section (78 to 132px), not taken from one token.

**Hierarchy.** Head, sub, two buttons; the primary is dark, the secondary is a pale warm pill with a play glyph. In every feature row the order is eyebrow (color), head (44px), body, checklist, demo link, so the colored word is what you scan.

**Imagery and art direction.** The brand is a set of mascots: a blue flower-shaped character with a square face, a green blob, a red flower, a yellow triangle, plus coins, hearts, padlocks and stars, all flat with soft shading. The mascot returns in "Relentless protection" meditating with a shield. Product is shown as real iOS screens in black phone frames with plausible data ("Benji Taylor", "+418.03m PEPE"). **Opinion:** the illustration system is what makes a crypto wallet feel safe and friendly; it is the move to study.

**Motion.** Reveals use a 1s expo-out (`cubic-bezier(.19,1,.22,1)`): fast start, very long settle. Hover feedback is 100 to 220ms. Asymmetric button padding (22 left, 24 right; 19 and 20) optically centers the label next to a leading glyph.

**Copy and UX.** "Your favorite crypto wallet." Then "Explore Ethereum with the best wallet for iOS. Interacting with crypto has never been so simple." Feature titles are one word (Easy, Secure, Fast, Powerful, Fun) with a two-line caption each: "Your crypto, your control. Security at every stage." Each section ends with a demo video link.

## Borrow
- A custom display face at one weight over Inter, with tracking that scales from -0.03em at 44px to -0.01em at 17px.
- One accent hue per section, used for the eyebrow and that section's icons, so color marks the topic.
- Inset 1px ring (`inset 0 0 0 1px`) instead of a border on panels: no layout shift, crisp edge.
- Asymmetric horizontal padding on buttons with a leading glyph (glyph side 1 to 2px tighter).
- A mascot and object illustration system to make a technical product approachable.
- 17px body at 1.53 line height for explanatory product copy.

## Do not borrow
- The colored eyebrows as text: all four fail AA at 14px (green 2.18:1, gold 2.72:1, orange 3.54:1, blue 3.61:1). Darken each hue for text and keep the bright one for icons.
- Muted text `#848281` (3.82:1) and `#474645` at 70% (4.08:1) on white; both fail for body sizes.
- Three `h1` elements and no `h2` or `h3` on the page.
- No `prefers-reduced-motion` handling with 1s transform reveals.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 13, 15, 17, 19, 23, 44, 68 are off the 1.25 scale (body is 17, not 16).
- Radii 6, 10, 40, 72 and percentage radii are outside the 0, 4, 8, 12, 16, full set.
- Section padding 78 to 132px and gaps of 10, 11.2 and 15 are off the spacing set.
- 1s reveal duration exceeds the 600ms page duration; no reduced-motion rules.
- Colors in display-p3 with no sRGB-first token layer; FOUNDATIONS roles would need a P3 note.
