# Linear: home page

- **URL:** https://linear.app
- **Measured:** 2026-10-10, Playwright Chromium, light scheme requested (the site is dark only), 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/linear-home.json`), headline and button details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/linear-home-1440-light.jpg`, `linear-home-390-light.jpg`.
- **Strongest in:** dark-theme color, type tuning (variable weights), product shown as live UI, restraint.
- Everything below is measured unless marked **opinion**. The hero product shot is real HTML, not an image, so its values are also the best public evidence of the Linear app UI (see `linear-app.md`).

## Measured values

| Area | Value |
|---|---|
| Families | `Inter Variable` for text (fallback `"SF Pro Display"`), `Berkeley Mono` for code and labels (16% of characters) |
| Weights | 400 body, **510** medium (buttons, nav, headings), **590** for app titles. Non-standard variable weights, between the usual 500 and 600 stops. |
| Type steps (1440) | 64 (hero), 48 (h2), 32 (quote), 24 (lead), 20 (app title), 15 (body), 14, 13 (UI), 12 (meta) |
| Line height | 64/64 (1.0), 48/48 (1.0), 24/31.92 (1.33), 15/24 (1.6), 13/19.5 (1.5) |
| Tracking | -1.408px at 64 (-0.022em), -1.056px at 48 (-0.022em), -0.704px at 32 (-0.022em), -0.288px at 24 (-0.012em), -0.165px at 15 (-0.011em), -0.13px at 13 (-0.01em). Every size is tracked negative. |
| Hero (390) | 38px/41.8 (1.1), -0.836px (-0.022em), weight 510 |
| Background | `#08090a` page; `#0f1011` panels; `#090a0b` and `#101112` app surfaces. Steps of 1 to 3 points of lightness. |
| Text colors | Primary `#f7f8f8` (18.7:1); secondary `#d0d6e0` (13.6:1); muted `#8a8f98` (6.1:1 on `#08090a`); faint `#62666d` (3.3:1 on `#0f1011`, used for decorative labels only) |
| Accent | None on the page chrome. Color appears only inside the product UI (status dots, labels) and a yellow-green `#e4f222` testimonial card. |
| Borders | 1px `rgba(255,255,255,.08)` (66 uses), `.12` (11), `.05`. White at low alpha, never a gray hex, so borders adapt to any surface. |
| Radii | 9999px pills for buttons and tags (72), 8px cards, 12px panels, 4 and 6px small UI |
| Button | "Get started" 127x44, `#e5e5e6` fill, `#08090a` text, 16px/510, padding 0 20, pill. Shadow is a five-layer stack, the heaviest layer at 8% alpha: `0 0 1px rgba(0,0,0,.08), 0 1px 1px rgba(0,0,0,.07), 0 3px 2px rgba(0,0,0,.04), 0 5px 2px rgba(0,0,0,.01)`. Nav "Sign up" is 73x32, 13px. |
| Panel shadow | `rgba(255,255,255,.08) 0 0 0 .5px inset` (a half-pixel inner highlight) plus `rgba(0,0,0,.25) 0 2px 32px` |
| Container | 1436px max at 1440; text columns 566 to 620px |
| Spacing | Padding 32, 4, 8, 12, 6; gaps 8, 4, 6, 12. Section padding 32px horizontal; big vertical air between sections. |
| Motion | Hover color `.1s cubic-bezier(.25,.46,.45,.94)` (187 uses); buttons `.16s` same curve; backgrounds `.4s ease-out`; a dot-grid illustration animates in at `.42s`. 14 `prefers-reduced-motion` rules found. |
| Body measure | Lead 24px in a 566px column: 50 characters per line. Phone: 15px, 50 per line. |

## What it does right

**Type.** Inter as a variable font set at weights 510 and 590 rather than 500 and 600: a slightly heavier medium that holds up on a near-black background, where light text blooms. Every size carries negative tracking, roughly -0.022em on display and -0.01em on UI text, so the whole page feels tight and engineered. Display line height is 1.0. Body is 15px, not 16, with a generous 1.6 line height.

**Color.** Dark mode done properly: the page is `#08090a`, not `#000`, and panels step up by tiny amounts (`#0f1011`, `#101112`), with elevation shown by lighter surfaces and white-alpha hairlines, not by drop shadows. Text uses four steps (`#f7f8f8`, `#d0d6e0`, `#8a8f98`, `#62666d`). Two-tone section headings like Stripe's: "A new species of product tool." in `#f7f8f8`, then the explanation in `#8a8f98` at the same 48px. No brand color on chrome; color is reserved for meaning inside the product.

**Layout and spacing.** Left-aligned hero at 64px, product shot directly under it, full width of the 1436px container. Feature sections pair a large two-line heading on the left with a 24px lead on the right, then a wide product fragment. Small mono labels ("FIG 0.2") act as figure captions.

**Hierarchy.** The product shot is the hero; the headline is short and sits above it. Below the fold the page alternates heading, lead, product fragment.

**Imagery and art direction.** The product is the only imagery: real HTML of the app (sidebar, issue view, agent chat) with plausible issue IDs ("DRV-8852 Faster app launch"). Wireframe isometric line drawings for the three principles. No photography, no stock.

**Motion.** Very short UI transitions (100 to 160ms) with an ease-out-quad curve; illustrations animate with stepped timing. **Opinion:** the speed of the hover states is itself the brand message (speed).

**Copy and UX.** "The product development system for teams and agents". One supporting line, 10 words. Nav has six items. The customer quote card ("Our speed is intense and Linear helps us...") is the only loud color block.

## Borrow
- Dark theme base `#08090a` with surface steps of 1 to 3 lightness points and borders as `rgba(255,255,255,.05 to .12)`.
- Variable weights 510 and 590 on dark backgrounds.
- Tracking -0.022em on display sizes, -0.01em on UI sizes.
- Live HTML product shots instead of screenshots; they stay sharp and can be themed.
- Multi-layer button shadow with each layer under 10% alpha.
- No chrome accent color: color means status.

## Do not borrow
- The faint `#62666d` on `#0f1011` (3.3:1) for anything a user must read; Linear uses it only for decorative labels.
- Line height 1.0 on wrapping text under 48px.
- Dark-only theming for a product whose users work in daylight; Linear's app offers light themes, the marketing page does not.
- Hiding the real `h1` text in a visually hidden span and drawing the visible headline from split spans: it works for them but makes the heading harder to audit.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 13, 15, 24, 48, 64 are off the 1.25 scale.
- Weights 510 and 590 are not in the `--weight-*` set (regular, medium, semibold, bold).
- Display line height 1.0 at 48 and 64px (FOUNDATIONS: 1.1 to 1.25 under 100px).
- Body 15px with 1.6 leading (FOUNDATIONS: 16px root, 1.5).
- Hover duration 100ms sits at the instant end; matches FOUNDATIONS "instant 0 to 100ms".
