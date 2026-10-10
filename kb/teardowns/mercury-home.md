# Mercury: home page

- **URL:** https://mercury.com (final URL https://mercury.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme requested (the page is dark regardless), 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/mercury-home.json`); hero, button and section-head details from `kb/teardowns/probe.mjs` and a scratch probe of the same kind. Screenshots: `kb/exemplars/shots/mercury-home-1440-light.jpg`, `mercury-home-390-light.jpg` (capped at 6000px tall; the page is 11,661px at 1440 and 15,035px at 390, so the lower half is not in the captures).
- **Strongest in:** color (a blue-black dark theme with no pure white or black), type (variable weights at 360, 420 and 480), imagery and art direction, brand.
- Everything below is measured unless marked **opinion**. Hero text sits on a photograph, so its real contrast could not be measured; the ratios below are against the page surfaces.

## Measured values

| Area | Value |
|---|---|
| Families | `arcadia` (variable, 360 to 500) for 91% of characters; `arcadiaDisplay` (variable, 320 to 480) for headings. No third face. |
| Weights | 360 for leads and quotes, 400 body and legal, 420 buttons and nav, 480 headings and item titles, 700 only on legal `strong`. All variable-axis values off the usual 100 steps. |
| Type steps (1440) | 49.35 (hero, fluid), 42 (section h2), 32, 28, 24 (display); 21 (hero sub), 18 (lead), 16 (body, buttons), 12 (legal) |
| Line height | 49.35/54.28 (1.1), 42/48.3 (1.15), 32/36.8 (1.15), 28/33.6 (1.2), 24/28.8 (1.2), 21/28.36 (1.35), 18/24.3 (1.35), 16/22.4 (1.4), 12/16.8 (1.4) |
| Tracking | **Positive** on display: +0.42px at 42 (+0.01em), +0.48px at 32 (+0.015em), +0.42px at 28 (+0.015em), +0.48px at 24 (+0.02em); 0 on the hero and body; +0.24px at 12 (+0.02em) |
| Hero (390) | 28/30.8 (1.1), weight 480, centered, 342px wide; sub drops to 14px |
| Text colors | Primary `#ededf3` (15.25:1 on `#171721`); secondary `#c3c3cc` (10.06:1 on `#181822`); announcement bar `#2a2924` on `#f8f8f5` (13.7:1); white on accent 4.71:1 |
| Surfaces | `#171721` and `#181822` page; `#1f1f2b`, `#1e1e2a` raised panels; `#272735` at 390. Every dark is blue-violet tinted. One light strip `#f8f8f5` for the announcement bar. |
| Accent | `#5266eb` (periwinkle) on "Open account" only. Glass secondary: `rgba(175,178,206,.2)` fill. |
| Borders | 1px `rgba(175,178,206,.36)` (10 uses), 1px `rgba(112,115,147,.22)`, 1px `#70707d` |
| Radii | 4px (106 uses, links and small UI), 12px panels (27), 8px icon tiles, pill (32 to 40px and 9999) on every button and the email field |
| Shadows | Almost none on a dark page. One small light-mode card: `0 0 3px rgba(0,0,0,.05), 0 8px 12px rgba(0,0,0,.05), 0 12px 20px rgba(0,0,0,.05)` |
| Buttons | "Open account" 145x40, `#5266eb`, white 16px/420, padding 0 20, radius 32. "Launch demo" 141x40, glass fill, 1px `rgba(175,178,206,.36)` border, `backdrop-filter: blur(20px)`, radius 40. Hero form 560x48: email input 246x46 with radius `32px 0 0 32px` fused to the button. |
| Container | Outer max 1952px (full bleed at 1440); hero text column 672px (max 688) |
| Spacing | Token scale in `:root`: 0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128 and up to 240. Most used padding 32, 12, 20, 40, 72; section padding 112 and 128; gaps 12, 32, 40. |
| Motion | Colors `.15s cubic-bezier(.4,0,.2,1)` and `.3s cubic-bezier(0,0,.2,1)`; panels `.5s cubic-bezier(0,0,.6,1)`; accordion rows animate `grid-template-rows .3s`; entrances `translateUp, fadeIn .67s cubic-bezier(.28,1.1,.74,1)` (y1 of 1.1, a slight overshoot). Logo marquee 45s linear at 390. 7 `prefers-reduced-motion` rules. |
| Body measure | Lead 18px in a 432px column: 41 characters per line |

## What it does right

**Type.** One family with a display cut, both variable, and the weights are tuned between the stops: 360 for long reads, 420 for buttons, 480 for heads. Nothing is bold. The unusual move is **positive** tracking on headings (+0.01 to +0.02em) where most sites go negative; with a light-on-dark page and a slightly loose display cut it keeps the letters from clotting. Hero and section heads use `text-wrap: balance`, body uses `pretty`.

**Color.** No `#000` and no `#fff` text anywhere it matters: the page is `#171721`, text is `#ededf3` and `#c3c3cc`, all pulled toward blue-violet so the dark reads as night sky, not as a void. Only two text colors carry the whole page. The accent `#5266eb` appears on one action ("Open account") and nowhere decorative. The single light element is the announcement bar in warm off-white `#f8f8f5` with warm ink `#2a2924`, which makes it read as a separate paper note.

**Layout and spacing.** Full-bleed photo hero, then centered single-column heads (672px) and wide two-column feature rows: an accordion on the left, a large product visual on the right. A spacing token scale sits in `:root` (`--spacing-*` from 0 to 240) with semantic aliases (`--gap-sm` 24, `--gap-md` 32, `--gap-xl` 40).

**Hierarchy.** First screen: a 49px two-word idea ("Radically different banking"), one line of sub, an email field fused to the primary button, a glass secondary, and a legal pill at the fold ("Mercury is a fintech company, not an FDIC-insured bank..."). Proof follows immediately: "Loved by 300K+ of the most ambitious entrepreneurs on the planet", seven customer logos (Supabase, Linear, Lovable and others) and a video testimonial carousel with a progress bar.

**Imagery and art direction.** A single surreal photograph carries the brand: an office chair and desk on a misty mountain ridge at dawn. Feature visuals are product UI rendered in **light** mode (cards, bills, invoice form) inside the dark page, so the product looks calm and paper-like, and abstract monochrome renders (a light beam, a globe) stand in for ideas like speed and global payments. **Opinion:** the light-UI-on-dark-page contrast is the move worth stealing; the product reads as the brightest, most trustworthy thing on screen.

**Motion.** Short ease-out color changes (150 to 300ms), accordion height via `grid-template-rows`, and one entrance curve with a 1.1 control point so items settle with a hint of overshoot. Seven reduced-motion rules are present.

**Copy and UX.** Headlines are paired thoughts: "Banking's been a headache. Now, it's a head start." Feature rows lead with time: "Apply online in 10 minutes", "Get a credit card instantly", "Tackle banking tasks in seconds". The email field in the hero starts sign-up without leaving the page. Legal is visible, not hidden: footnote numbers in the sub ("banking¹") and a disclaimer pill over the hero.

## Borrow
- A tinted dark theme: page `#171721`, raised `#1f1f2b`, text `#ededf3` and `#c3c3cc`. Two text colors are enough.
- Light-mode product UI inside a dark marketing page to make the product the brightest object.
- Email input fused to the primary button (radius `32px 0 0 32px` on the field) to start sign-up in the hero.
- Glass secondary button: 20% tinted fill, 36% border, `blur(20px)`, next to a solid accent primary.
- Positive tracking (+0.01 to +0.02em) on light-on-dark display type set in a medium weight.
- A spacing token scale with semantic gap aliases.

## Do not borrow
- Hero type straight on a photograph with only a top-down scrim (`linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.3) 40%, transparent)`). Contrast depends on the image; it was not measurable and will fail on a brighter crop.
- White on `#5266eb` is 4.71:1: passes AA at 16px but has almost no margin; a lighter hover state would fail.
- 10px legal text at 390 (4,335 characters of it). It is readable on retina, but below any sensible minimum.
- The entrance overshoot curve on financial content if your brand is meant to feel sober.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Weights 360, 420 and 480 are off the regular/medium/semibold/bold set; they are variable-axis values.
- Type steps 18, 21, 24, 28, 32, 42 and fluid 49.35 are off the 1.25 scale.
- Spacing tokens include 20, 40, 56, 72, 80 and 112, which are not in the FOUNDATIONS set.
- Display tracking is positive (+0.01 to +0.02em); FOUNDATIONS assumes tightening at display sizes.
- Entrance motion 670ms exceeds the 600ms page duration; panel transitions at 500ms sit inside it.
- Body line height 1.35 to 1.4, below the 1.5 default.
