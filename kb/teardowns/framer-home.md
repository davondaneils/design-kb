# Framer: home page

- **URL:** https://www.framer.com (final URL https://www.framer.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme requested (the site is dark only), 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/framer-home.json`); headline, button and section-head details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/framer-home-1440-light.jpg`, `framer-home-390-light.jpg` (capped at 6000px; the page is 10,741px at 1440). Caveats: no CSS transitions were found because motion runs in JavaScript (Framer Motion), so hover and reveal timings are unmeasured; in the 1440 capture the four agent cards render at low opacity (a scroll-linked state the full-page capture froze), while the 390 capture shows them at full strength; 1 stylesheet blocked; contrast pairs re-measured after the tool learned to composite alpha (white at 60% on black: 7.37:1).
- **Strongest in:** type (one grotesk display face tracked at -0.04em), dark color, product-ui shown as live HTML, brand.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Inter` and `Inter Variable` for 85% of characters; `GT Walsheim Medium` for h1 and h2 only (280 characters); `Input Mono` and `JetBrains Mono` inside product mock-ups |
| Weights | 500 for every display heading (GT Walsheim Medium). 400 for body and h3. 500 and 600 only inside mock-up UI. |
| Type steps (1440) | 54 (h1), 44 (h2), 18 (h3 and body), 15, 14 (nav, buttons), 13, 12, 10 (mock-up UI) |
| Line height | 54/54 (1.0), 44/48.4 (1.1), 18/24.3 (1.35), 14/19.6 (1.4), 13/20.8 (1.6) |
| Tracking | -2.16px at 54 (-0.04em), -1.76px at 44 (-0.04em), -0.2px at 18 (-0.011em), -0.28px at 14 on buttons (-0.02em), -0.1px at 14 body. Display is always -0.04em. |
| OpenType | h1 sets `ss02`; Inter sets `cv01, cv05, cv09, cv11` (alternate 1, l, 6/9 and single-storey a), h3 adds `ss03` |
| Hero (390) | 36px/36 (1.0), -1.44px (-0.04em), same copy, wraps to 3 lines; h2 drops to 28/30.8 |
| Text colors | White `#ffffff` (21:1 on black); white at 60% (renders `#999999`, 7.37:1) for every description; `#999999` on `#111111` (6.63:1); `#cccccc` on `#111111` (11.76:1); `#666666` on `#111111` (3.29:1, mock-up table headers only) |
| Surfaces | `#000000` page; `#111111` cards; `#171717` and `#242424` raised UI; `#1a1a1a`. Buttons `rgba(255,255,255,.1)`. |
| Accent | Framer blue `#0099ff` (selection fills at 21 to 22% alpha, 1px selection borders, progress bars). `#d67a5c` (an orange terminal frame) and `#00bb88` ("GOOD" status) inside mock-ups only. Token `#cbff00` defined but not seen. |
| Borders | Almost none: 1px `rgba(255,255,255,.06)` (8 uses) and 1px `#0099ff` selection outlines |
| Radii | 8px (231 uses: buttons, cards), 15px (71), 6px, 20px, 4px, 18px (story cards), 100px pills |
| Shadows | Mock-ups only: `rgba(0,0,0,.2) 0 2px 6px`; floating images `rgba(0,0,0,.2) 0 27 to 40px 43 to 64px` (fractional values, so scroll-scaled); a blue glow `rgba(0,153,255,.15) 0 1px 2px, rgba(0,153,255,.2) 0 2px 4px` on a selected element |
| Buttons | "Get started for free" 149x34, `#ffffff` fill, black Inter Variable 14px/400, -0.28px, padding 10 14, radius 8. "Download app" same size, `rgba(255,255,255,.1)` fill, white text. Nav "Sign up" 66x30. Story cards 360x460, radius 18, padding 40. |
| Container | 1200px (15 uses); text columns 600 to 732px |
| Spacing | A 5px base: gaps 10, 5, 15, 6, 8, 20, 30; padding 10, 15, 20, 25, 40. Section padding 120/120 at 1440, 60/60 at 390. |
| Motion | CSS: one animation, a film-grain sprite `0.75s steps(12) infinite`. Everything else is JS-driven and unmeasured. 0 `prefers-reduced-motion` rules readable. |
| Body measure | 18px in a 616px column: 72 characters per line. Phone: 30 per line in a 270px card. |

## What it does right

**Type.** Two families with a hard split: GT Walsheim Medium for the h1 and six h2s and nothing else, Inter for everything a user reads. Every display size is 500 weight at -0.04em with line height 1.0 to 1.1, so headlines read as one dense block. h3s are not headings visually: "Design with an agent" is 18px/400, the same size as its description, white where the description is 60% white. Same-size two-tone, like Stripe and Linear, but at body size. `text-wrap: balance` on h2 and h3.

**Color.** Pure black page, three gray steps for surfaces (`#111`, `#171717`, `#242424`), and text dimmed by alpha (`#fff` at 60%) instead of gray hex. The only brand hue is `#0099ff`, and it appears almost only as the selection color inside mock-ups: selection outlines, the CMS row highlight, Core Web Vitals bars, the analytics chart fill. The hero glow (blue light behind the "Ask Framer..." prompt box) is the one loud moment.

**Layout and spacing.** Left-aligned hero at 120px from the edge, two buttons, then a 1000px video frame with a duration badge ("0:36"). Below: a logo grid, then four agent cards stacked full width, then a bento grid of nine platform tiles (Performance, CMS, SEO, Collaboration, Localization, Hosting, Security, Analytics, A/B Testing), each a small working UI with a one-word label and arrow. **Opinion:** the 5px spacing base (5, 10, 15, 20, 25) is Framer's own canvas default leaking into the site.

**Hierarchy.** The h1 is 54px, small for a hero at 1440; the product frame below it is bigger than the headline. Section heads are 44px, only 10px smaller than the h1, so the page reads as a sequence of equals rather than a hero plus support.

**Imagery and art direction.** No photography of people. Every tile is the product, rebuilt as HTML: a CMS collection tree ("Blog, Careers, Events, Talks 89"), a branch list ("Main, use-cases, publishing"), locales with completion ("Dutch 35%"), "99.99% uptime" set in huge type, an analytics chart. Mock-up text sits at 10 to 13px in `#999`/`#ccc`. Imagery inside the mock-ups (Haus Studio site, flowers, fields) is saturated blue and green, the only color on the page.

**Motion.** Not measurable from CSS. The only declared animation is an animated film grain: a WebP sprite stepped through 12 frames every 0.75s, so the black has texture. **Opinion:** stepped grain is a cheap way to keep a pure-black page from looking flat.

**Copy and UX.** "Framer is the design agent for every step from idea to launch". Section heads answer an objection each: "Agents that work alongside you, not instead of you", "Not just vibes, a full platform", "Built on a community that isn't going anywhere". Every agent card ends in the same link, "Start with Agents". The phone keeps every section and stacks the bento tiles one per row.

## Borrow
- Display at weight 500, -0.04em, line height 1.0 to 1.1; body Inter with `cv01, cv05, cv09, cv11` for a cleaner, less default Inter.
- Same-size card titles: 18px white title, 18px 60% white description.
- Text dimmed with white alpha (`#fff` at 60%) on pure black; it renders `#999` and passes at 7.37:1.
- One brand hue used as the product's selection color inside mock-ups, not on chrome.
- A bento of small working UI tiles, each labeled with one word and an arrow.
- Duration badge on the hero video frame so people know the cost before pressing play.
- Animated film grain (a 12-frame sprite stepped every 0.75s) to give a pure-black page texture without a gradient.
- Section heads at 44px, only 10px under the 54px h1, when the page is a list of equal capabilities rather than one big promise.

## Do not borrow
- `#666666` on `#111111` (3.29:1) for mock-up table headers ("Title", "Status", "Category") if any of it is real UI.
- A 34px-tall primary button with 14px text at 1440: the main action is smaller than the nav on most sites.
- Scroll-linked dimming of whole content cards: if the script stalls, readers get 3:1 text (as the 1440 capture shows).
- No readable `prefers-reduced-motion` rule while video, grain and scroll effects run.
- Five monospace and grotesk families inside one page (Inter, Inter Variable, GT Walsheim, Input Mono, JetBrains Mono): fine in mock-ups, too many for a real interface.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 13, 15, 18, 44, 54 are off the 1.25 scale.
- Spacing on a 5px base (5, 10, 15, 25, 30) instead of 4/8.
- Radii 15, 18, 20 and 25px alongside 8; FOUNDATIONS allows one radius family from 0, 4, 8, 12, 16.
- h1 line height 1.0 at 54px (FOUNDATIONS: 1.1 to 1.25 under 100px).
- Body line height 1.35 at 18px (FOUNDATIONS: 1.5).
- Motion not declared in CSS and no reduced-motion rule readable.
- Primary button 34px tall, below a 44px target size.
