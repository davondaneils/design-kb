# Stripe: Dashboard

- **URL:** https://docs.stripe.com/dashboard/basics (the Dashboard guide; the Dashboard itself sits behind a login). Supporting evidence: https://docs.stripe.com/stripe-apps/design and https://docs.stripe.com/stripe-apps/style (the Stripe Apps UI toolkit, which documents the Dashboard's own tokens and shows Dashboard screenshots).
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/stripe-docs-dashboard.json`); docs chrome probed element by element. Screenshots: `kb/exemplars/shots/stripe-docs-dashboard-1440-light.jpg`, `stripe-docs-dashboard-390-light.jpg`.
- **Caveats:** at 1440 the docs scroll inside a container, so `pageHeight` equals the 900px viewport and the 1440 screenshot shows the first screen only (computed styles still cover the whole article; the 390 capture is full length). The basics page has no Dashboard screenshot (its one image is a YouTube banner), so Dashboard values come from three Stripe Apps illustrations (`app-anatomy`, `views-contextview`, `views-focusview`, 1658px wide shown at 799px): colors are pixel samples and are **estimates**; sizes are not given because the illustrations are zoomed. The context-view illustration is dated "May 24, 2022" and shows top tabs, while the current guide says "the first section of the sidebar", so the illustration predates the current navigation. The docs use the system stack (`-apple-system`); this capture rendered with the Linux fallback. Brand values are in `stripe-home.md`.
- **Strongest in:** product-ui (token discipline), data-density, UX (docs chrome as product UI), color roles.
- Everything below is measured unless marked **opinion** or **estimate**.

## Measured values

| Area | Value |
|---|---|
| Families | `-apple-system, BlinkMacSystemFont` stack for all docs UI (SF Pro on Apple devices); `Source Code Pro` and Menlo for code. No web font loaded. |
| Weights | 400 body, 500 links and sidebar active item, 600 labels and small buttons, 700 h1, h3 and active section |
| Type steps (1440) | 32 (h1), 24 (lead, weight 400), 21 (h2), 20 (feedback head), 16 (body, h3), 14 (sidebar, toolbar, callout), 13 (table, TOC header), 12 (page actions) |
| Line height | 32/40 (1.25), 24/32 (1.33), 16/26 (1.63) body, 14/20 (1.43) UI, 13/20 (1.54) table cells, 12/16 (1.33) |
| Tracking | 0 at every size |
| Phone (390) | h1 stays 32/40; lead wraps to four lines; body 16/26 at 38 characters per line |
| Text colors | h1 `#1a1f36` (16.2:1); body `#3c4257` (10:1); nav ink `#1a2c44` (14.1:1); secondary `#50617a` (6.3:1, 5.9:1 on `#f4f7fa`); link `#5469d4` (4.83:1 on white, **4.49:1 on `#f4f7fa`**) |
| Surfaces | `#ffffff` article; `#f4f7fa` 64px header band; `#f7fafc` panels; dark `#273951` skip link |
| Borders | Sidebar right edge 1px `#d4dee9`; table rows 1px `#ecf1f6`; callout ring `rgb(227,232,238) 0 0 0 1px` |
| Radii | 4 (callout, links, kbd: 106 uses), 6 (Sign in, inputs), 8 (Search, Ask AI) |
| Shadows | Borders are drawn as shadows. Search: `rgba(16,17,26,.16) 0 1px 1px, rgb(212,222,233) 0 0 0 1px`; Ask AI and Sign in: `rgb(212,222,233) 0 0 0 1px` only |
| Sidebar | 280px wide, padding `12 16 16 12`; rows 20px line with a 12px gap (32px pitch); nested rows 28px pitch, indented 16px; 8px chevrons; uppercase group labels ("VERSIONING", "TOOLS") |
| Top bar | 64px band; Search 200x32 (radius 8, padding `2 8`, "/" shortcut chip); Ask AI 84x32; Sign in 62x28 (14px/600, padding `4 8`, radius 6); tabs row 36px, items padding `8 12`, active tab `#5469d4` 600 with an underline |
| Article | Column 799px; TOC 202px with 13px/500 header; table header 13px/500 `#50617a`, cells padding 16, 13px/20 |
| Callout | 799x50, padding 12, radius 4, 1px ring, 14px/26 weight 500 text |
| Container | 1175px max (rendered 1145) for article plus TOC |
| Spacing | Padding 16, 12, 8, 32; gaps 8, 4, 6, 16. A 4px base. |
| Motion | Link color `.1s cubic-bezier(0,0,.4,1)`; button background and ring `.15s cubic-bezier(0,.09,.4,1)`; input ring `.24s ease`. 0 `prefers-reduced-motion` rules readable (3 sheets blocked). |
| Body measure | 16px in a 799px column: **86 characters per line** |
| Stripe Apps tokens (documented) | Spacing `xxsmall 2, xsmall 4, small 8, medium 16, large 24, xlarge 32, xxlarge 48`. Text roles `primary, secondary, disabled, info, success, attention, critical`; backgrounds `surface` (app) and `container` (cards); keylines `neutral`, `critical`; fonts `heading, subheading, body, caption`. Source: docs.stripe.com/stripe-apps/style. |
| Dashboard (estimate) | Primary `#635bff` (active nav pill and primary button, 4.7:1 with white); ink `#30313d`; secondary `#6a7383` (4.8:1 on white); chrome `#f6f8fa`; chart line close to `#5469d4` with a gray comparison line; "8 new" badge tint `#e8f5f7` |

## What it does right

**Type.** No web font in the product docs: the system stack at 14px for chrome and 16/26 for prose. Hierarchy comes from weight and color, not tracking: sidebar active item 700 `#1a2c44`, siblings 400 `#50617a`, the current page 500 in link blue. The lead line ("Learn how to use the web version of the Stripe Dashboard.") is 24px at weight 400 under a 32px/700 h1, so the two read as title and standfirst.

**Color.** Blue-gray inks in four steps (`#1a1f36`, `#1a2c44`, `#3c4257`, `#50617a`) and one interactive blue. The Dashboard illustrations repeat the same split: ink `#30313d`, muted `#6a7383`, chrome `#f6f8fa`, a single `#635bff` for the active tab and the primary button. Third-party apps may not recolor components; Stripe allows color only in the app indicator bar (docs: "Unlike other UI elements, you can select any color for the app indicator").

**Layout and spacing.** Three columns at 280, 799 and 202. The sidebar is a list of 20px lines with 12px gaps rather than boxed rows, which gives a 32px pitch without hover boxes. Keylines are 1px rings drawn with `box-shadow`, so cards, inputs and buttons share one edge recipe and never shift layout on focus.

**Hierarchy.** Page actions ("Ask about this page", "Copy for LLM", "View as Markdown", "Install tools") sit at 12px/600 in secondary gray between the lead and the body: present on every page, never louder than the content.

**Imagery and art direction.** Dashboard illustrations are clean, zoomed re-drawings (fake company "Cactus Practice", "Gross volume $12,198.72") rather than raw captures. **Opinion:** zoomed redraws age badly: the 2022 tabs no longer match the sidebar the text describes.

**Motion.** Short and asymmetric: 100ms color on links, 150ms on button fills and rings with a fast-start curve.

**Copy and UX.** The guide names the keyboard affordance in the first paragraph ("press the question mark key (?) for a list of available keyboard shortcuts"). The Stripe Apps token names are roles, not colors ("attention", "critical: Should be used sparingly"), which is what keeps 3rd-party UI consistent with the Dashboard.

## Borrow
- Semantic token sets with very few members: 7 text roles, 2 backgrounds, 2 keylines, 4 type roles, 7 spacing steps (2 to 48).
- Keylines as `0 0 0 1px` box-shadow rings, with a `0 1px 1px rgba(16,17,26,.16)` contact shadow added only on the main input.
- Sidebar as 14/20 text with 12px gaps; nested level indented 16px at a 28px pitch.
- Control heights 28 (small), 32 (default), 36 (tab row), 64 (top band).
- Let partners brand one element (an indicator bar) and lock the rest.

## Do not borrow
- Link `#5469d4` on the `#f4f7fa` band (4.49:1): fails AA by a hair; on white it passes (4.83:1).
- An 86-character body measure at 16px; cap the column near 52ch.
- Screenshots that are zoomed redraws with a date in them; they visibly drift from the live product.
- No readable reduced-motion rules (sheets blocked, so unverified rather than absent).

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 13, 21, 24 and 32 are off the 1.25 scale; body line height 1.63 exceeds 1.5.
- Zero tracking on 32px headings; FOUNDATIONS teams usually tighten display sizes.
- Stripe Apps spacing (2, 4, 8, 16, 24, 32, 48) is a strict subset of FOUNDATIONS spacing; it skips 12.
- Radius 6 on small buttons is not on the radius scale.
- System font stack only; FOUNDATIONS has no rule on web font versus system stack for product UI.
