# Ramp: home page

- **URL:** https://ramp.com (final URL https://ramp.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/ramp-home.json`); hero, form, button and section-head details from `kb/teardowns/probe.mjs` and a scratch probe of the same kind. Screenshots: `kb/exemplars/shots/ramp-home-1440-light.jpg`, `ramp-home-390-light.jpg` (capped at 6000px tall; the page is 13,997px at 1440).
- **Caveat:** the site declares every color in CSS `lab()`, which the measure script cannot composite, so its contrast table came back empty. Hex values and ratios below are my conversion of the computed `lab()` values (D50 to sRGB) with alpha composited on the measured surface.
- **Strongest in:** type (one face, one weight), hierarchy by opacity, data-density (live counters as proof), product-ui.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Lausanne` for 100% of text, with stylistic set `"ss01"` on everything. Material Icons for glyphs. IBM Plex Mono is declared in `:root` but no text measured in it. |
| Weights | **400 only.** Lausanne loads at 400 and 400 italic; every heading, button and label is 400. |
| Type steps (1440) | 64 (hero), 48, 40, 28 (h2 sizes), 24, 20 (h3, lead), 18 (hero sub), 16 (body, buttons), 14 (UI, nav), 13 (links), 10 (uppercase eyebrow) |
| Line height | 64/64 (1.0), 48/50 (1.04), 40/42 (1.05), 28/32 (1.14), 24/28 (1.17), 20/26 (1.3), 18/24 (1.33), 16/22 (1.38), 14/20 (1.43) |
| Tracking | Effectively zero: -0.01px at 64 and 48, -0.005px at 40, normal below. Eyebrow 10px uppercase at +0.5px (+0.05em). |
| Hero (390) | 40/42 (1.05), weight 400, left aligned, two lines; body drops to 15/21 |
| Text colors | Ink `lab(2.84 .37 .97)` = `#0c0a08` (19.8:1 on white); the same ink at 60% alpha = `#6d6c6b` effective (5.24:1 on white, 5.06:1 on `#f4f2ef`); white and white at 60% on dark `#1f1f1d` (16.5:1 and 6.7:1) |
| Surfaces | White page; `#f4f2ef` warm stone for cards and the hero product stage; `#1f1f1d` near-black bands; translucent white `rgba(255,255,255,.5)` overlays |
| Accent | Lime `lab(92.14 -20.5 84.77)` = `#e4f222` on "See a demo" and "Get started for free", always with ink text (16.0:1). Dark button `#1a1919` with white text (17.5:1). |
| Borders | 1px `#d2cecb` (warm, 24 uses), 1px `#e5e7eb` (22), 1px `rgba(33,33,33,.1)` (14) |
| Radii | 12px cards (42 uses), 8px CTA buttons (25), 16px large panels (24), 6px nav buttons (22), 10px input, 4px tags, pill chips |
| Shadows | None on cards at rest; one `inset 0 0 2px rgba(255,255,255,.6)` highlight. Cards animate `transform, box-shadow .4s ease` on hover. |
| Buttons | Hero "Get started for free" 176x52, lime, ink 16px/400, padding 0 20, radius 8, inside a 450x62 form with a 260x52 email input (radius 10). Nav "See a demo" 107x34 lime and "Get started" 103x34 `#1a1919`, both 14px, padding 12 16, radius 6. |
| Container | 1440 max with 64px side padding (content 1312); hero h1 max 1050; section heads max 960 and 755; body copy 533 |
| Spacing | Section padding 128 top and bottom (80 at 390), one at 64 (48 at 390); padding 8, 20, 4, 24, 6, 64; gaps 8, 12, 24, 16 |
| Motion | Links and buttons `.3s cubic-bezier(.4,0,.2,1)`; inputs `.15s`; cards `.4s ease` lift; a blur reveal `filter, opacity .68s`; nav text `color .24s cubic-bezier(.45,.05,.55,.95)`. No CSS keyframe animations. 12 `prefers-reduced-motion` rules. |
| Body measure | 16px in a 533px column: 57 characters per line. Phone 15px: 43. |

## What it does right

**Type.** One face, one weight, no tracking, and size plus opacity do all the work. The heading trick is the same as Stripe's but done with alpha instead of a second hex: "Cards & Expenses" in full ink, "that handle themselves" in the same ink at 60%, same size, same line. Because it is alpha, the muted half adapts to whatever surface it sits on (5.24:1 on white, 5.06:1 on stone). `ss01` is set globally, so the face carries Ramp's alternate glyphs everywhere.

**Color.** Three neutrals (white, warm stone `#f4f2ef`, near-black `#1f1f1d`), one ink with two opacities, and one loud lime `#e4f222` that only ever appears as a button fill with ink text. Borders are warm (`#d2cecb`) to match the stone, not a cool Tailwind gray. **Opinion:** lime with black text is a rare accent that is both on-brand and high contrast (16:1); the usual brand-blue button rarely gets above 5:1.

**Layout and spacing.** A 64px gutter, left-aligned hero, then a full-width stone stage holding the product animation, with a faint dot grid behind the hero. Feature cards are a bento of 12px-radius stone tiles, each with a two-tone heading top left and a square arrow button top right. Sections breathe at 128px.

**Hierarchy.** The eyebrow is proof, not a label: "US CORPORATE PAYMENTS PROCESSED BY RAMP:" followed by a live percentage chip (0.9228014%). The hero ends with a ticker bar, "AGENTS AT WORK TODAY:" with running counts ("RECEIPTS PROCESSED: 4,620,064", "ACCOUNTING FIELDS CODED: 986,516"). Then a logo wall where one tile is a customer photo with "$1M+ saved on global spend".

**Imagery and art direction.** Product is shown as clean UI fragments on stone: a receipt being analyzed, the black Ramp card, an invoice list with blue file chips, a cash and treasury chart. "Systems that never spoke" draws the before state as a messy cloud of real-looking screenshots joined by lines. One portrait photo, used as a stat card.

**Motion.** All UI transitions are 150 to 300ms on the standard curve; cards lift over 400ms; one 680ms blur-in. No keyframe loops in CSS (the counters run in script and canvas: 9 canvas elements were found). Twelve reduced-motion rules.

**Copy and UX.** "Time is money. Save both." A six-word pun that states the value. The sub lists the scope: "Cards, expenses, bill payments, and banking*" then "in the blink of AI." The hero form asks "What's your work email?" with the button fused to it. Later, an AI box asks for your company URL to "See recommendations for your business", turning a section into a tool.

## Borrow
- Two-tone headings with one ink and an alpha step (100% and 60%), so the muted half works on any surface.
- One weight across the whole site when the face has enough character; hierarchy from size and opacity.
- Live counters as the eyebrow and as a ticker under the hero: proof that moves.
- A high-lightness accent (`#e4f222`) used only as a fill behind ink text, never as text.
- Warm borders (`#d2cecb`) that match a warm stone surface.
- Email field and primary button fused in one 62px form row at the top of the page.

## Do not borrow
- Line height 1.0 to 1.05 on 40 to 64px heads works for Lausanne's short descenders and two-line heads; on a face with long descenders it collides.
- 10px uppercase eyebrows and ticker labels; fine as decoration, too small for anything a user must read.
- The nav CTA line height of 10.4px inside a 34px button (measured). It renders, but it relies on padding to center text and breaks if the label wraps.
- Declaring colors only in `lab()` without a fallback if you need older browser support or tooling that reads hex.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 13, 18, 24, 28, 40, 48, 64 are off the 1.25 scale.
- Heading line heights 1.0 to 1.05 at 40 to 64px are below the 1.1 to 1.25 range; body 1.38 is below 1.5.
- Radius 6px (nav buttons) and 10px (input) are not in the radius set.
- Spacing 6 and 20 are heavily used; neither is in the FOUNDATIONS set.
- 680ms blur reveal exceeds the 600ms page duration.
- Only one weight (400) in use; FOUNDATIONS expects up to four.

## Live capture (2026-10)

Captured 2026-10-10 from the live sites.
- **Tools:** TinyFish `fetch_content` with `page_metadata` and CSS selector scoping (reached every target), Parallel Search `web_fetch` (reached them, text excerpts only), TinyFish `run_web_automation` (reached them, but could not run JavaScript, report computed CSS or return screenshots; its one visual report gave a 1334px viewport and a hero weight of 700 that contradicts the measured 300, so it is not used). Direct curl and Playwright from this container are blocked (proxy 403). Raw: `live/ramp-home/head.json`.
- **Not captured:** 1440 and 390 screenshots (no tool here returns an image of a public page) and fresh computed type sizes. Sizes below come from the earlier Playwright run in this file unless marked **live**.

| Item | Live value |
|---|---|
| Title | 69 characters, keyword list first and brand last ("Spend Management, Corporate Cards & Accounts Payable Solutions \| Ramp") |
| Description | 192 characters; Google typically shows about 150 to 160 (opinion based on observed snippet lengths; Google sets no fixed limit, https://developers.google.com/search/docs/appearance/snippet) |
| og:image | Generic `default-og-image.jpg`, same for twitter; og `site_name` Ramp; no og:url or og:type |
| JSON-LD | Block present (selector matched); @type **unverified** |
| Favicons | `.ico` 48x48 and sizes=any, PNG 16 and 32, apple-touch-icon 180x180 |
| h1 (**live**) | "Time is money. Save both.", classes `headline-xl text-balance max-w-[1050px] leading-trim` (text-box trimmed so the cap height aligns with the grid) |
| Hero size | 64/64 at 1440, 40/42 at 390, weight 400 (earlier measure) |
| First-screen CTAs (**live**) | One hero form: email field fused to "Get started for free"; nav "Get started". A live counter "US corporate payments processed by Ramp" sits above the h1 as proof before the claim. |
| Imagery (**live**) | Hero video with separate files per breakpoint: `homepage-hero-423.webm` and `homepage-hero-mobile-423.webm` |
