# The Brand Identity: home page

- **URL:** https://the-brandidentity.com (final URL https://the-brandidentity.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/brandidentity-home.json`); headline details from `kb/teardowns/probe.mjs`; type and hover rules read from the stylesheets. Screenshots: `kb/exemplars/shots/brandidentity-home-1440-light.jpg`, `brandidentity-home-390-light.jpg` (capped at 6000px; the page is 21,793px at 1440).
- **Caveats:** many feature tiles are autoplay videos (21 at 1440) that rendered as solid black rectangles in headless capture; on a real browser they show footage. A cookie bar was open.
- **Strongest in:** editorial type (a grotesk and a serif with one job each), fluid type tokens, hover color, a magazine rhythm on a single centered column.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `NB International Pro` 300 and 400 (sans, 45% of characters) and `Times Now` 400 (serif, 55%) |
| Weights | 400 for all headlines in both faces; 300 for nav, labels, prices, small caps labels. No bold. |
| Fluid type tokens | `.times-75` `max(36px, min(4.86vw, 105px))` / 1.05 / -0.02em; `.nb-48` `max(26px, min(3.33vw, 72px))` / 1.2; `.times-32` `max(18px, min(2.22vw, 48px))` / 1.16; `.nb-20` `max(20px, min(1.39vw, 30px))` / 1.27 / -0.02em; `.nb-11` `max(11px, min(.76vw, 16.5px))` / 1.35 / .005em uppercase. `html { font-size: 10px }`. |
| Type steps (1440) | 70 (Times interview heads), 48 (NB lead head, uppercase section heads), 32 (Times standfirst and project heads), 26 (Times), 22 (Times card text), 20 (NB nav and labels), 18, 16 (product titles), 11 (NB labels) |
| Line height | 70/73.5 (1.05), 48/57.5 (1.2), 32/37.1 (1.16), 20/25.4 (1.27), 16/20.8 (1.3), 11/14.85 (1.35) |
| Tracking | -1.4px at 70 (-0.02em), -0.4px at 20 (-0.02em), 0 at 32 and 48, +0.16px at 16 (+0.01em), +0.055px at 11 (+0.005em) |
| Hero (390) | Lead head 26px/31.2 (NB); Times heads 36px/37.8, -0.72px; standfirst 18px/20.9. The `max()` floors take over. |
| Text colors | `#000` on `#f5f5f5` (19.3:1); `#0a0a0a` on white (19.8:1); white on `#0a0a0a`; `#a0a0a0` on `#f5f5f5` (2.4:1) for struck-out prices and disabled states |
| Surfaces | Page `#f5f5f5` (off-white); white and `#eeeeee` product tiles; black cookie bar; tile backdrop colors that match each project image (`#0651a1`, `#48443d`, `#d2c4be`, `#253d5d`, `#f0eee4`) |
| Accent | Pure `#0000ff` on hover only (7.9:1 on `#f5f5f5`); `--red: red` token |
| Borders | 1px `#0a0a0a` on buttons (top and bottom only) and the email field underline |
| Radii | 0 on everything except 5px on form inputs (`--border-radius: 5px`) |
| Shadows | None |
| Layout | 12-column grid, 34px gaps, 29px page padding (2.9rem); lead feature figure spans columns 3 to 10, text columns 4 to 9; 180px between home articles at 1440, 72px at 390 |
| Motion | Hover color `.5s cubic-bezier(.165,.84,.44,1)` (ease-out quart) on links, labels, SVG strokes and fills; images `opacity .3s ease-in-out`; bookmark icon fades in `.3s` same quart curve on card hover. 1 reduced-motion rule. |

## What it does right

**Type.** Two faces with fixed jobs. NB International (a grotesk) for the brand voice, nav, labels and the lead headline; Times Now (a serif) for interview headlines, standfirsts and project captions. Every size is a single fluid token, `max(floor, min(vw, ceiling))`, so the floor is readable on phones and the ceiling stops growth on wide screens. Labels are 11px uppercase with +0.005em tracking; display serif is -0.02em.

**Color.** Off-white `#f5f5f5`, black, and nothing else in the chrome. The one color is a hover: titles, nav and icon strokes turn pure `#0000ff` over 500ms. **Opinion:** on a site that shows other people's brands all day, a single RGB blue reads like a hyperlink from 1995 on purpose; it is neutral because it is the default.

**Layout and spacing.** One centered column on a 12-column grid. Each story is a module: image, label, headline, "READ NOW", then 180px of air. Store rails break the column with four products across (16px titles, prices, a struck-out original in `#a0a0a0`).

**Hierarchy.** Story modules rotate between three recipes: (A) NB 48px headline plus Times 32px standfirst ("The psychology of stuff: why people get attached to branded objects"); (B) an "INTERVIEW" label plus a Times 70px headline ("Why Field of Practice treats branding as a practice of change"); (C) a "PROJECT" label set inline with a Times 32px headline on the same line (`display: inline`, 20px right margin). **Opinion:** the rotation is what makes a long single column read like a magazine instead of a feed.

**Imagery and art direction.** Square-cornered images and muted autoplay video, no overlays, tile backgrounds that match the work (for example `#0651a1`, `#253d5d`) so a tile does not flash white while loading.

**Motion.** Long, soft hover color (500ms ease-out quart) instead of underlines or scale. In the account menu, hovering one link turns its siblings `#a0a0a0` (`.nav-account-wrapper.hover a:not(:hover)`), a focus-by-dimming move.

**Copy and UX.** Navigation is a sentence: "Features, Store, Jobs". The wordmark is "The", a long horizontal rule, "Brand Identity". Newsletter: "Daily case studies → your inbox" with a single underlined email field and an arrow. Calls to action are "READ NOW" and "MORE TEMPLATES" with a diagonal arrow.

## Borrow
- Every size as one `max(floor, min(vw, ceiling))` token, named by its desktop size (`times-75`, `nb-48`).
- Two faces with fixed roles: grotesk for labels and brand, serif for headlines and standfirsts.
- Inline label plus headline on one line (`display: inline` on both, 20px gap).
- Rotate three story recipes down a single column, 180px apart.
- Hover color change over 500ms with `cubic-bezier(.165,.84,.44,1)`, applied to text, SVG stroke and fill together.
- Give each image tile a backdrop color that matches the image, so it never flashes white while loading.
- Dim siblings on hover to focus a menu choice.

## Do not borrow
- `#a0a0a0` on `#f5f5f5` (2.4:1) for the original price: the struck-out number is still information a buyer reads.
- Pure `#0000ff` as the only hover feedback; fine at 7.9:1, but there is no non-color cue and the 500ms fade delays it.
- Autoplay video in most tiles: heavy on data, and blank (black) whenever it fails to play.
- 11px labels at weight 300: legible on this off-white only because the ink is pure black.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Fluid ceilings exceed 2.5x their floors: `times-75` 105/36 (2.9x), `nb-48` 72/26 (2.8x), `times-32` 48/18 (2.7x); FOUNDATIONS caps the max at 2.5 times the min, and the floors 36, 26, 18 are off the scale.
- Steps 11, 18, 22, 26, 32, 48, 70 are off the 1.25 scale.
- Display line height 1.05 at 70px (FOUNDATIONS 1.1 to 1.25 under 100px).
- Spacing 29, 34 and 180px are off the 4px scale.
- Radius 5px on inputs (between 4 and 8).
- 500ms hover transitions exceed the 150ms fast and 200 to 250ms base durations.
