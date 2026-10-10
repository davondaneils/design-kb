# Raycast: home page

- **URL:** https://www.raycast.com
- **Measured:** 2026-10-10, Playwright Chromium, light scheme requested (the site is dark only), 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/raycast-home.json`), headline and button details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/raycast-home-1440-light.jpg` (needed a 120s screenshot timeout; the default 30s timed out), `raycast-home-390-light.jpg`.
- **Strongest in:** art direction on dark, tactile UI detail (keys, buttons), product demos as UI, a published token scale.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Inter` (variable) for 88% of text; `GeistMono` for captions and system notes; `SF Pro Text` inside the macOS mock-up; `jetBrainsMono` in code |
| Weights | 600 hero, 500 for section heads, body leads and buttons, 400 small print |
| Type steps (1440) | 64 (hero), 24 (lead quotes), 20 (section h2), 18 (hero sub), 16, 15, 14, 13, 12 |
| Line height | 64/70.4 (1.1); 16/25.6 and 14/22.4 (1.6); section heads `normal` |
| Tracking | Positive on small text: +0.2px at 14 to 20, +0.3 and +0.4px on 12 to 14px labels. The hero is untracked (0). |
| Hero (390) | 36px/39.6 (1.1), weight 600, centered |
| Background | `#07080a` page; radial glows (`rgb(18,18,18)` to `rgb(13,13,13)`); a 0.5px dot grid `radial-gradient(rgb(47,48,49) .5px, transparent 0)` |
| Text colors | White `#ffffff` (20:1); `#9c9c9d` (7.3:1); `#6a6b6c` (3.75:1, used for the gray half of section headings); white at 60% (7.3:1), 40% (3.75:1), 30% (2.57:1) |
| Accent | Raycast red, used as light: the hero art is red glass bars on black. No red text or red buttons. |
| Borders | 1px `rgba(255,255,255,.1)` and `.06`; `#2f3031` |
| Radii | Published tokens: `--rounding-xs 4px, sm 6px, normal 8px, md 12px, lg 16px, xl 20px, xxl 24px, full 100%`. Most used: 11px (keycaps, 159), 8px (108), 6px, 12px, 20px, 22px (extension cards) |
| Spacing tokens | Published: `--spacing-0-5 4px, -1 8px, -1-5 12px, -2 16px, -2-5 20px, -3 24px, -4 32px, -5 40px, -6 48px, -7 56px, -8 64px, -9 80px, -10 96px, -11 112px, -12 168px` |
| Buttons | "Download for Mac" 173x36, `#e6e6e6` fill, `#2f3031` text, 14px/500, padding 8 12, radius 8. Shadow: `0 0 0 2px rgba(0,0,0,.5), 0 0 14px rgba(255,255,255,.19), inset 0 -1px .4px rgba(0,0,0,.2), inset 0 1px .4px #fff`: a dark outline, a soft glow, and a top highlight with a bottom shade, so it reads as a physical key. |
| Keycap shadow | 157 keys: `rgba(0,0,0,.4) 0 1.5px .5px 2.5px, #000 0 0 .5px 1px, inset 0 2px 1px 1px rgba(0,0,0,.25), inset 0 1px 1px 1px rgba(255,255,255,.2)` |
| Motion | Keys `opacity .4s, box-shadow/transform/color .2s` (157); text `color .3s ease`; extension cards slide in `.7s cubic-bezier(.215,.61,.355,1)`; a blinking caret `1.1s steps(1)`; 10 reduced-motion rules |
| Body measure | Hero sub 18px, 786px wide, `text-wrap: balance`: 79 characters per line on its two lines |

## What it does right

**Type.** Inter, small and slightly letter-spaced (+0.2px) on dark, which offsets the bloom of light text on black. Section heads are modest (20px, weight 500) and lean on the two-tone pattern: white first sentence, gray second ("Take shortcuts, not detours." then "One interface, everything you need."). The hero is the only large type on the page.

**Color.** Black plus one hue, and the hue is light, not paint: red glass bars with blur and grain behind the hero, and red glows bleeding into product sections. All chrome stays neutral. **Opinion:** the most efficient way on the list to get a strong brand from a single color.

**Layout and spacing.** Centered hero, then alternating full-width product demos and short centered heads. A floating, rounded nav bar (inset from the edges, translucent) rather than a full-bleed header. Spacing comes from a published 8px-based token set that jumps from 112 to 168 for section breaks.

**Hierarchy.** Hero: headline, one-sentence sub, one button, then system requirements in mono ("macOS Tahoe and Apple Silicon required", "Install via Homebrew | Download V1"). The requirement line answers the first objection before it is asked.

**Imagery and art direction.** The product is shown as working UI inside a macOS desktop mock-up (menu bar, clipboard history with real hex values). A full 3D keyboard rendered in CSS with 157 individually shadowed keys. Extension cards carry the partner's own brand color (Linear navy, Spotify green).

**Motion.** Keys press, a caret blinks, cards slide in. Each motion demonstrates a feature (keyboard first) rather than decorating.

**Copy and UX.** "Your shortcut to everything." Sub: "A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable." Single action ("Download for Mac") repeated in the nav. Section heads are aphorisms: "It's not about saving time. It's about feeling like you're never wasting it."

## Borrow
- One brand hue used as light (glow, glass, grain) on a near-black base, with neutral chrome.
- The tactile button recipe: outline ring, soft outer glow, inset top highlight, inset bottom shade.
- Positive tracking (+0.2px) on 12 to 20px light-on-dark text.
- System requirements and install alternatives in small mono under the main download button.
- Publishing spacing and radius tokens as named CSS variables, with one big jump for section breaks.

## Do not borrow
- `#6a6b6c` on `#07080a` (3.75:1) for the gray half of 20px weight-500 headings. That is normal-size text and fails AA. Use at least `#8a8a8b` (about 5.5:1) or make the line 24px.
- White at 30% and 40% alpha for readable text (2.6:1 and 3.75:1).
- A 157-key CSS keyboard on a page that must load fast on phones; the 1440 full-page capture needed more than 30 seconds to render.
- Dark only.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Spacing tokens include 20, 40, 56, 80, 112, 168, outside the FOUNDATIONS scale.
- Radii 6, 11, 20, 22, 24 outside the radius set.
- Section heads at 20px with `line-height: normal`.
- Some readable text below AA contrast (see above): a fundamentals miss under this repo's gate.
