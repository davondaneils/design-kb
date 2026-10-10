# Apple: MacBook Air product page

- **URL:** https://www.apple.com/macbook-air/ (chosen as the representative Apple product page)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/apple-macbook-air.json`), headline details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/apple-macbook-air-1440-light.jpg`, `apple-macbook-air-390-light.jpg` (capped at 6000px; the page is 32,271px tall at 1440).
- **Strongest in:** product photography and art direction, type tuned per size, pacing of a long product story, pricing UX.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `SF Pro Display` at 19px and up, `SF Pro Text` below: two optical cuts of one family, switched by size. `SF Pro Icons` for glyphs. |
| Weights | 600 for every headline and for the run-in paragraph intros; 400 for body and links |
| Type steps (1440) | 80 (section headline), 64 (hero headline), 56 and 48 (h2), 28 (product name), 24, 21 (intro paragraphs), 19, 17 (body), 14, 12 (nav, legal) |
| Line height | 80/84 (1.05), 64/70 (1.09), 56/60 (1.07), 48/52 (1.08), 21/29 (1.38), 17/25 (1.47), 12/16 (1.33) |
| Tracking | Size-specific, as in Apple's SF tracking table: -1.2px at 80 (-0.015em), 0 at 56 and 64, **+0.231px at 21 (+0.011em)**, -0.374px at 17 (-0.022em), -0.224px at 14 (-0.016em), -0.12px at 12 (-0.01em) |
| Hero (390) | Product name 21px/25; headline steps down with the same classes |
| Gradient text | Headlines "Might takes flight.", "Get the highlights." and "M5. The chip that zips." use `linear-gradient(90deg, #022640, #5786ab)` clipped to text (`background-clip: text`) |
| Text colors | Ink `#1d1d1f` (16.8:1 on white); gray `#86868b` (3.62:1 on white; used only at 21px weight 600, which counts as large text); secondary `#6e6e73` (5.07:1); link `#0066cc` (5.6:1); nav text `rgba(0,0,0,.56)` on `#f5f5f7` (4.83:1) |
| Accent | Action blue `#0071e3` (buttons); orange `#bf4800` for one "Now supercharged by M5." line |
| Surfaces | Alternating `#ffffff` and `#f5f5f7` bands. Hero has a sky gradient `rgb(212,234,246)` to `rgb(249,249,249)` that matches the Sky Blue laptop. |
| Radii | 28px on every tile and card (62 uses); 980px pills on all buttons; 50% on color swatches and carousel controls |
| Shadows | None measured. Depth comes from photography and surface color. |
| Buttons | "Buy" 73x45, `#0071e3`, 17px/400, padding 11 21, pill. Small "Buy" in the sticky local nav 47x24, 12px. "Go inside M5" text button 151x54. |
| Container | Text at 83.33% (817px) and 66.67% (653px) of a 980px column; tiles up to 1180px |
| Spacing | Gaps 20px between tiles; paddings 30, 27, 28, 40, 50 |
| Motion | Link color `.32s cubic-bezier(.4,0,.6,1)`; transforms `.3s cubic-bezier(0,0,.5,1)`; 8 videos on the page; **40 `prefers-reduced-motion` rules**, the most of any exemplar measured |
| Body measure | 21px intro in an 817px column: 73 characters per line. Phone: 19px, 37 per line. |

## What it does right

**Type.** Two optical sizes of one family, switched at about 19px, and tracking that changes per size (positive at 21px, negative at 17 and below). This is the HIG's size-specific tracking applied on the web. Weight is almost binary: 600 for anything that names, 400 for anything that explains.

**The run-in paragraph.** A tile caption is an `h3` in ink (`#1d1d1f`) followed in the same line by a paragraph in gray (`#86868b`), both 21px weight 600: "Four beautiful colors will have you on cloud nine." then "And every MacBook Air comes with a color-matched MagSafe charging cable." The gray only passes AA because the text is large and bold, which is exactly why Apple sets it at 21px/600 and never smaller.

**Color.** Neutrals carry the page; the product supplies color. The hero gradient is sampled from the Sky Blue finish, and the headline gradient (`#022640` to `#5786ab`) is the same family of blue. One orange line marks what is new.

**Layout and spacing.** Rounded 28px tiles on `#f5f5f7` bands, 20px apart, in carousels and grids. A sticky local nav with the product name and a small "Buy" pill. Sections open with a small eyebrow ("Design", "Performance") over a large gradient headline, then a full-bleed photo.

**Hierarchy.** First screen at 1440: the laptop photographed edge-on, then "MacBook Air" (28px), "Might takes flight." (64px), the orange "Now supercharged by M5.", then price and Buy in one pill-shaped panel. Price is on the first screen.

**Imagery and art direction.** Studio renders on matching gradient fields; lifestyle photos in warm interiors with the screen visible; color swatches under the product. Every image shows the product doing one thing.

**Motion.** Video and scroll-linked sequences, with 40 reduced-motion rules that swap them for stills.

**Copy and UX.** Short, playful headlines with a pun ("Might takes flight.", "M5. The chip that zips.", "Built to go places."). Body copy gives one number per claim ("just 2.7 pounds", "up to 18 hours of battery life"). Footnote markers on every claim.

## Borrow
- Ink heading plus gray continuation in one run-in paragraph, at a size and weight where the gray still passes (18.66px bold or 24px regular and up).
- Switch to a display cut or tighter tracking above about 20px; loosen slightly at mid sizes.
- A single radius (28px) for all tiles and pills for all buttons.
- Take the hero background from the product's own color.
- Price and the primary action on the first screen.
- Generous `prefers-reduced-motion` coverage for every video and scroll effect.

## Do not borrow
- `#86868b` on white below 18.66px bold or 24px regular: it is 3.62:1 and fails AA for normal text.
- Gradient text on a busy or photographic background: contrast cannot be guaranteed per pixel.
- Page length (32,000px) without Apple's photography budget; long pages need an image worth stopping for at every scroll.
- 12px legal and nav text at weight 400 for anything a user must act on.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Steps 17, 19, 21, 28, 56, 64, 80 are off the 1.25 scale (Apple's scale is built around a 17px body).
- Radius 28px is not a FOUNDATIONS radius (0, 4, 8, 12, 16, full).
- Display line height about 1.05 to 1.09 under 100px.
- No shadows at all; elevation by surface color and imagery.
