# teenage engineering: home page

- **URL:** https://teenage.engineering (final URL https://teenage.engineering/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme requested (the site renders black regardless), 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/teenage-engineering-home.json`); tokens, `@font-face` rules and hover rules read from the stylesheets. Screenshots: `kb/exemplars/shots/teenage-engineering-home-1440-light.jpg`, `teenage-engineering-home-390-light.jpg`.
- **Caveats:** the home page on the day was a single campaign (the New York store opening): one photo and one announcement, then the footer. 1 stylesheet was blocked cross-origin (a fonts.net tracking CSS). The desktop navigation is one SVG with `<text>` elements, so its type sizes are SVG units scaled to the header.
- **Strongest in:** brand (a proprietary thin face, monochrome, hardware-panel navigation), a fully proportional layout system, imagery.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `te-20` and `te-40`, self-hosted from files `TE20T`, `TE20L`, `TE40T`, `TE40L` (also aliased as `UniversTE20T` and `UniversTE40L`); `Unicode` fallback stack mapped to Hiragino Sans W1/W3 and Meiryo for the Japanese text |
| Weights | **100** (thin) for links, nav sub-items and body; 300 (light) for announcements and headings. Nothing heavier. |
| Type tokens | Sizes are fractions of the viewport against a 980px design (`--base-design-width: 980`): desktop `--fs-10` .00918 x width (9px at 980), `--fs-15` 13px, `--fs-20` 18px, `--fs-25` 23px, `--fs-30` 27px, `--fs-40` 36px. Phone tokens double the ratios (a 490px design). |
| Type steps (1440) | 26.45 (`fs-20`, announcement), 19.5 (SVG nav labels), 19.1 (`fs-15`, footer and newsletter), 16 (UI), 9 (SVG nav sub-items) |
| Type steps (390) | 21.5 ("free shipping over $120*"), 16, 14.3 (`fs-20`), 13.3, 10.3 (copyright) |
| Line height | 26.45/29.39 (1.11), 19.1/22.04 (1.15), 16/24 (1.5), 9/13.5 (1.5) |
| Tracking | `normal`; kerning and ligatures on, discretionary ligatures off (`"kern","liga","dlig" 0`) |
| Text colors | `#f1f2f2` on black (18.7:1); `#e5e5e5` on black (16.7:1); phone footer `#f5f5f5` on `#0f0e12` (17.6:1) |
| Surfaces | Desktop `#000`; phone footer `#0f0e12` (`--te-black`); phone newsletter button `#b2b2b2` |
| Palette tokens | Grays `#f5f5f5`, `#e5e5e5`, `#ccc`, `#b2b2b2`, `#a1a7af`, `#767676`, `#7f7f7f`, `#4d4d4d`, `#272727`; signal colors `--te-blue #0071bb`, `--te-green #006837`, `--te-orange #f05a24`, `--te-red #b81d13`, `--te-yellow #fab413` |
| Accent in use | Green `#006837` only on the cart tab at the right edge (visible in the 1440 capture) |
| Borders | Phone footer rows divided by 1px `#272727` |
| Radii | None on desktop; phone button 7.96px (10/490 of the width); tile token `--tile-border-radius` 25/980 of the width |
| Shadows | None on the page. Toast token: `#00000080 0 (2/980 w) (8/980 w)`. |
| Buttons | Phone "join our newsletter" 354x52, `#b2b2b2` fill, `#0f0e12` text (9.1:1), 21.5px/300, padding 8 21.5. Token `--btn-min-click-area: 48px`. |
| Layout | Header height 80/980 of the width (117.5px at 1440); paddings 66.1 and 33.1px at 1440 (45 and 22.5 on the 980 design); hero photo full width, source 1440x1920 webp |
| Motion | Cart tab `transform .2s ease-in`; add-to-cart icons `transform .25s, opacity .15s`, scale 1.5 on hover; toasts `transform .2s ease-out`. Link hovers are instant underlines; buttons drop to opacity .7 with no transition. 1 reduced-motion rule. |

## What it does right

**Type.** A proprietary face (files named TE20 and TE40, aliased to Univers TE) used at weight 100 for most text, white on black. **Opinion:** thin type on black usually fails; it holds here because the ink is near-white (`#f1f2f2`, 18.7:1) and phone text stays at 13px or above except the 10.3px copyright line. Lowercase everywhere ("teenage engineering", "products", "store", "latest", "finder"); the one uppercase line is the store announcement.

**Color.** Black, near-white and a gray ramp. Five signal colors exist as tokens (blue, green, orange, red, yellow) but the home page spends exactly one: the green cart tab.

**Layout and spacing.** Every dimension is a fraction of the viewport against a 980px desktop design or a 490px phone design (`calc(.0816327 * var(--client-width))`). The page scales like a drawing: at 1440 everything is 1.469x the design. **Opinion:** this is how an industrial designer lays out a front panel; nothing reflows, it scales.

**Hierarchy.** The header is a control panel: five groups (products, store, latest, finder, the logo), each an outline icon plus a 19.5px label plus 9px sub-items ("instruments", "audio", "designs"), with a block of Japanese mission text set like a spec label.

**Imagery and art direction.** One black-and-white photograph of the shop front at 216 Lafayette St with its neon sign, full width, no overlay. Below it, only "now open!" and the opening hours.

**Motion.** Nearly none: instant underlines, an opacity drop on buttons, a 200ms slide for the cart tab. Scale-up on add-to-cart icons is the one playful touch.

**Copy and UX.** Lowercase, terse, factual: "free shipping over $120*", "14 day return policy", "*excludes field desk. please see terms and conditions". Phone footer is a list of 41.8px rows with chevrons, above the 48px minimum token.

## Borrow
- Viewport-proportional tokens from one design width (`size / 980 * 100vw`) for a brand page that should scale like an object, with a second ratio set for phones.
- A weight-100 face on true black only with near-white ink (18:1 or better) and a 13px floor.
- A gray ramp plus five named signal colors, and the discipline to show one per page.
- Navigation drawn as a labeled panel: icon, label, and small sub-items per group.
- A `--btn-min-click-area: 48px` token.
- Turn off discretionary ligatures explicitly in `font-feature-settings`.

## Do not borrow
- Proportional sizing with no clamp: everything grows linearly with the window (at 2560 wide the header would be 209px tall, 80/980 of the width). Cap it with `min()`.
- 9px nav sub-items at 1440 are small for weight 100, even at high contrast.
- Desktop navigation as SVG `<text>`: harder to translate, select and style per state than HTML links.
- Focus handling removes outlines in several places (`input:focus { outline: none }`, `._checkout-link:focus { outline: none }`) and replaces them with a border-color change or an underline. Keep a 3:1 visible focus ring.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type sizes are continuous viewport fractions (19.1, 26.45, 14.3, 21.5), never the 1.25 scale.
- Weight 100 is outside regular, medium, semibold, bold.
- Spacing is fractional (66.1, 33.1, 17.9, 35.8px), off the 4px scale.
- Radius 7.96px on the phone button (between 4 and 8).
- `ease-in` on the cart tab entrance; FOUNDATIONS asks for decelerating curves on enter.
