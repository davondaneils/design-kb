# Cash App: home page

- **URL:** https://cash.app (final URL https://cash.app/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/cashapp-home.json`); hero, button and section-head details from `kb/teardowns/probe.mjs` and a scratch probe of the same kind. Screenshots: `kb/exemplars/shots/cashapp-home-1440-light.jpg`, `cashapp-home-390-light.jpg`.
- **Caveat (why pageHeight is 1440 at 1440):** the desktop page is **not** a single screen. `body` is `overflow: hidden` and all content scrolls inside a custom smooth-scroll container (`div.smooth-scroll-manager...`, `overflow-y: auto`, 900px tall, scrollHeight 9,744px). The first 1440 capture therefore showed only the hero. I re-rendered the 1440 screenshot by scrolling that container to load content, then unlocking its height; the committed `cashapp-home-1440-light.jpg` is that capture (6,000px of 9,744). In it the sticky phone shows only at the top, because unlocking the container also unpins it. The phone's screen differs between the two captures (Green status and savings in one, card and $789.13 balance in the other), so the screen changes with scroll. Bulk measurements counted elements inside the container, but lazy content below the fold may be missing from them. At 390 the page scrolls normally (11,235px).
- **Strongest in:** brand (one green, one face), type (tight negative tracking at a single weight), layout, motion.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Cash Sans` (custom, loaded at 400, 500, 600, 700) for 97% of characters; Arial for "See legal disclaimers" links |
| Weights | 400 for the h1, every h2 and body. 500 on "Sign up" and small links, 700 only on a phone number. |
| Type steps (1440) | 56 (h1), 40 (h2 and stat h3), 20.25 (support line), 18 (body and quotes), 14 (buttons), 12 (nav buttons, legal), 11.6 (cookie banner). Odd decimals (17.9999, 55.9998) show the sizes are computed from viewport units. |
| Line height | 56/53.2 (**0.95**), 40/44 (1.1), 18/25.2 (1.4), 18/21.6 (1.2, quotes), 14/14 (1.0, buttons), 12/14.4 (1.2) |
| Tracking | **-0.03em at every text size**: -1.68px at 56, -1.2px at 40, -0.54px at 18. Buttons and legal -0.02em (-0.28px at 14, -0.24px at 12). |
| Hero (390) | 41.67/39.59 (0.95), -1.25px (-0.03em), left aligned, 358px wide; body 16.67/23.34; h2 29.17/32.09 |
| Text colors | `#000000` (21:1 on white, 11.67:1 on green), `#999999` for legal (2.85:1 on white), `#ffffff` only on black buttons |
| Surfaces | `#ffffff` page; `#00e013` brand green on the hero and the closing sign-up band; `#000000` buttons |
| Accent | The green `#00e013` is a surface, never text. White on it would be 1.80:1, so all text on green is black. |
| Borders | 1px `#000000` on outline buttons (8 uses); 1px black at 30% |
| Radii | Pills (100px, 999px) on all buttons; media cards use **percentage** radii (`15.9% / 13%`, `14.3%`, `7.8% / 6.6%`) so corners scale with the card; 50% for round icon buttons |
| Shadows | None. Zero box-shadows on the page. |
| Buttons | Section CTAs: outline pills 153x48, 1px black border, black 14px/400, padding 16 19.88, radius 100. Hero "Get started" 127x42 white pill on green with an arrow. Nav "Sign up" 95x46 white, 12px/500; "Log in" 71x46 black with white text. |
| Container | No max-width rules; 20px side margins at 1440 and full-width rows (`h1` at x=20, legal block 1400px wide). Hero is three columns: headline left, phone center, copy and button right. |
| Spacing | Section padding 90 top and bottom (60 at 390); padding 40, 20, 32; gaps 24, 20, 10.5; margins 32, 40, 24 |
| Motion | `color .6s ease` (15 uses), `all .3s ease` on buttons, image `transform .4s ease-in-out`, reveals `opacity, transform .6s ease`, `main` animates `background-color .6s ease-in-out`. At 390 a floating "Download Cash App" bar slides in `.6s cubic-bezier(0,0,.2,1)`. 1 `prefers-reduced-motion` rule. |
| Body measure | 18px in a 371px column: 44 characters per line (also 44 at 390) |

## What it does right

**Type.** One custom face at one weight for everything that matters, and every size tracked at exactly -0.03em, so the 56px hero and the 18px body share one density. The hero line height is 0.95: the two lines "The way money / should work" lock into a solid block. Heading sizes are computed from viewport width, so the whole page scales as one unit between breakpoints (56 at 1440, 41.7 at 390).

**Color.** The palette is four values: white, black, `#999999` and green `#00e013`. Green is a field you stand in, not a highlight: the hero and the closing band are solid green with black type. There are no shadows, gradients or tinted grays, so the green carries all the brand. **Opinion:** this is the clearest example of "own one color" on any fintech site; the restraint everywhere else is what makes the green loud.

**Layout and spacing.** The desktop hero splits into thirds: headline flush left, a phone mock dead center, the sub and button flush right. The phone stays pinned while sections scroll past it, and its screen changes per section. Sections are wide horizontal rows: heading at the left edge, content in the middle, CTA pill at the right edge, with 90px vertical padding. Percentage radii keep image cards looking the same at every width.

**Hierarchy.** First screen: brand mark, seven text links, two pill buttons; then the 56px headline, the phone and one call to action. Each section repeats the same pattern (h2, two lines of copy or four bullets, one outline pill, a "See legal disclaimers" link), so the user learns the rhythm once. Proof closes the page: "The money app trusted by 59 million+ active accounts" with stat heads "5★", "9.9m+", "4.5★".

**Imagery and art direction.** Product UI in a phone frame with real balances ("$980.00", "$150.00 available", "$50.00 owed"), studio product photography (the card, a green tote reading "BUY NOW PAY LATER"), a hand holding a star-shaped Cash App Tag, and a pixel-font "$$$" graphic. Everything is shot or rendered on white or green.

**Motion.** Long, soft eases: 600ms color and background changes (the `main` background transitions, which suggests the page color shifts between sections; inferred from the CSS, not observed), 300 to 400ms on buttons and images. One reduced-motion rule only.

**Copy and UX.** "The way money should work." Section heads are plain benefits: "Sending money is fast, free, and made for you", "Access cash when you need it". Bullets are short and concrete: "No hidden or monthly fees ever", "Real-time transaction alerts". On phones a sticky full-width "Download Cash App" bar keeps the one action that matters in reach.

## Borrow
- One weight, one tracking value (-0.03em) for every size from 12 to 56px.
- A brand color used as a full surface with black text (11.67:1), never as text on white.
- Hero line height under 1 (0.95) for a two-line display head.
- Percentage border radii on media so corners scale with the element.
- A repeating section unit: h2, short copy, one outline pill, legal link.
- A sticky download bar on mobile for an app-first product.

## Do not borrow
- The scroll container with `body { overflow: hidden }`. It breaks full-page capture, browser find-in-page scroll, scroll restoration and some assistive tech; normal document scroll with `position: sticky` gets the same pinned phone.
- `#999999` legal text on white: 2.85:1, fails AA at 12px.
- Only one reduced-motion rule for a page whose layout moves with scroll.
- Nav button text at 12px inside a 46px pill; the hit area is fine, the label is small.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type sizes are fluid (55.9998, 17.9999, 20.2499) rather than fixed steps; 18, 40 and 56 at 1440 are off the 1.25 scale.
- Hero line height 0.95, below the 1.1 to 1.25 heading range; buttons at 1.0.
- Body line height 1.4, below 1.5.
- Percentage radii and 100px pills; FOUNDATIONS has fixed steps plus full.
- Spacing 90, 40, 20, 10.5 are off the spacing set.
- `ease` and `ease-in-out` keywords instead of the standard curves; 600ms transitions sit at the page limit.
