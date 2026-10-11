# Stripe: home page

- **URL:** https://stripe.com (final URL https://stripe.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/stripe-home.json`); headline details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/stripe-home-1440-light.jpg`, `stripe-home-390-light.jpg` (capped at 6000px tall; the page is 15,018px at 1440).
- **Strongest in:** type (one variable face at one weight), color (restrained neutrals plus one signature gradient), product imagery built in code, CTA system.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `sohne-var` (Klim's Söhne, variable) for 97% of characters; `SourceCodePro` 500 for code. Fallback `"SF Pro Display"`. |
| Weight | 300 (light) for headlines **and** body. 400 only on buttons and small UI. No bold anywhere in the marketing copy. |
| Type steps in use (1440) | 56 (section display), 48 (hero), 32 (h2), 26 and 22 (card titles), 18 (lead), 16 (body and nav), 14 (button, small) |
| Line height | 48/55.2 (1.15), 56/57.68 (1.03), 32/35.2 (1.1), 22/24.2 (1.1), 18/25.2 (1.4), 16/22.4 (1.4) |
| Tracking | Scales with size, always negative on display: -0.96px at 48 (-0.02em), -1.4px at 56 (-0.025em), -0.64px at 32 (-0.02em), -0.22px at 22 (-0.01em), 0 at 16 |
| Hero (390) | 34px/35.02 (1.03), -0.34px; the hero drops its second and third sentences and keeps only "Financial infrastructure to grow your revenue." |
| Text colors | Ink `#061b31` (17.4:1 on white); secondary `#50617a` (6.3:1); tertiary `#64748d` (4.75:1 on white, 4.54:1 on `#f8fafd`); brand `#533afd` links (6.2:1) |
| Surfaces | `#ffffff` main; `#f8fafd` tinted band; `#e5edf5` hairlines and fills; dark band `#0d1738` with text `#a3b5d6` (8.5:1) and `#839bc8` (6.3:1) |
| Accent | `#533afd` (indigo) for every primary button and link. Signature radial gradient `rgb(127,125,252)` to `rgb(244,75,204)` to orange behind the hero. |
| Borders | 1px `#e5edf5` (46 uses): the page grid lines and card edges |
| Radii | 4px (buttons, 102 uses), 6px (nav and cards, 70), 8px; nothing larger except mock-ups |
| Shadows | Large soft "stacked" recipes on mock-up cards only: `rgba(50,50,93,.25) 0 30px 45px -30px, rgba(0,0,0,.1) 0 18px 36px -18px`. Negative spread equal to the y offset, so the shadow only shows below. |
| Buttons | Primary 141x48, `#533afd` on white text, 16px/400, padding 15.5 24 16.5, radius 4. Nav "Contact sales" 137x40, 14px. Secondary is white with a 1px border. |
| Container | 1266px max (rendered 1266); text blocks 752 to 876px |
| Spacing values (most used) | 8, 6, 16, 12, 24, 4, 32 padding; gaps 8, 16, 4, 64, 32. A 4px base with an 8px rhythm. |
| Motion | Links `color .3s cubic-bezier(.25,1,.5,1)` (an ease-out quart). Reveal transforms `.8s cubic-bezier(.165,.84,.44,1)`; clip-path reveals `.8s`. Section headings fade color over 1.2s `cubic-bezier(.65,0,.35,1)`. |
| Body measure | Lead paragraph 22px in an 817px column: 65 characters per line. Phone body 16px: 40 per line. |

## What it does right

**Type.** One variable face, one weight (300), and size alone carries hierarchy. That only works because the ink is very dark (`#061b31`, 17:1) so a light weight still reads, and because tracking tightens by about 0.02em at every display step. The section header trick: an `h2` in ink and a continuation sentence in muted `#64748d` at the **same size** on the same line ("Flexible solutions for every business model. Grow your business..."). Hierarchy by color, not by size, so a heading and its standfirst read as one thought. `text-wrap: pretty` on every heading.

**Color.** Almost every pixel is white, `#f8fafd` or `#e5edf5`; three blue-gray text steps; one indigo for action. The color budget is spent on one place: the hero gradient, which reappears as the fill of every product card. The hero continuation text is `rgba(0,14,255,.5)`, a translucent blue, so as the gradient sweeps behind the words their color shifts. The dark stats band (`#0d1738`) is the only dark block on the page and holds the four proof numbers.

**Layout and spacing.** A visible structural grid: 1px `#e5edf5` vertical lines run the full height at the 1266px container edges and through the logo strip. It reads as engineering paper and keeps every card aligned. Cards sit in a bento grid with equal 8 to 16px gaps.

**Hierarchy.** First screen: a live counter ("Global GDP running on Stripe: 1.72996828%") as an eyebrow, a 48px four-line hero, two buttons, then a logo strip at the fold. Proof comes before features.

**Imagery and art direction.** No photography above the fold. Product is shown as HTML/CSS mock-ups (checkout, billing usage chart, connected accounts table) set at 9 to 12px inside cards, with real-looking data ("Daybreak Yoga", "$999.00 /year"). One photo band (a keynote) and one aerial customer photo. **Opinion:** the mock-ups are the strongest lesson: they look like the product, scale crisply, and carry brand color through their fills.

**Motion.** Short color transitions on links (300ms ease-out), long entrance reveals (800ms) with a strong ease-out, heading color fades at 1.2s. Nothing bounces.

**Copy and UX.** Headline is a promise plus the full scope in one sentence. Two primary actions ("Get started", "Sign up with Google") side by side. Proof numbers are specific: "135+ currencies and payment methods supported", "$1.9T in payments volume processed in 2025", "99.999% historical uptime". Case studies are one line each: "Hertz unifies commerce with Stripe."

## Borrow
- Same-size two-tone heading: ink sentence plus muted continuation (32px, `#061b31` then `#64748d`).
- One weight across the page, hierarchy from size and color; tracking -0.02em at 32px and up.
- Product shown as live HTML mock-ups with plausible data, not screenshots.
- Shadows that only fall below: negative spread equal to the y offset.
- A single accent color for all actions; the brand gradient used in one hero and echoed in card fills.
- Specific proof numbers in a contrasting band.

## Do not borrow
- Weight 300 body text on a lighter ink or a lower-quality face: it fails at small sizes. Stripe gets away with it because of Söhne and a 17:1 ink.
- Mock-up text at 9 to 11px. Fine as decoration (it is `aria-hidden` imagery), never as content.
- Tertiary text `#64748d` on `#f8fafd` (4.54:1) is right at the AA line; on any darker tint it fails.
- The 15,000px page length. It suits a platform with eight product lines, not a single product.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 22, 26, 32, 48, 56 are off the 1.25 scale (20, 25, 31, 39, 49, 61).
- Button radius 4px and card radius 6px; FOUNDATIONS has 4 and 8 but not 6.
- Display line height 1.03 at 56px (FOUNDATIONS asks 1.1 to 1.25 for headings under 100px).
- Motion 800ms reveals and a 1.2s color fade exceed the 600ms page duration.
- No `prefers-reduced-motion` rules were readable (6 stylesheets blocked cross-origin reading), so reduced-motion behavior is unverified.

## Live capture (2026-10)

Captured 2026-10-10 from the live sites.
- **Tools:** TinyFish `fetch_content` with `page_metadata` and CSS selector scoping (reached every target), Parallel Search `web_fetch` (reached them, text excerpts only), TinyFish `run_web_automation` (reached them, but could not run JavaScript, report computed CSS or return screenshots; its one visual report gave a 1334px viewport and a hero weight of 700 that contradicts the measured 300, so it is not used). Direct curl and Playwright from this container are blocked (proxy 403). Raw: `live/stripe-home/head.json`.
- **Not captured:** 1440 and 390 screenshots (no tool here returns an image of a public page) and fresh computed type sizes. Sizes below come from the earlier Playwright run in this file unless marked **live**.

| Item | Live value |
|---|---|
| Title | "Stripe \| Financial Infrastructure to Grow Your Revenue" (54 characters) |
| Description | 149 characters, same text in og and twitter |
| og:image | `stripe.37119086.jpg` on b.stripecdn.com (JPEG, hashed file name); `og:type` website; `twitter:card` summary_large_image, `@stripe` |
| JSON-LD | Block present (selector matched); @type not readable with this tool, so **unverified** |
| Favicons | SVG first, then PNG 96x96, `.ico` as shortcut icon, apple-touch-icon 180x180 PNG. Four links, SVG leading. |
| h1 (**live**) | Two `h1` elements with the same text, the second `aria-hidden="true"`: a background and a foreground layer so the headline can sit over and under the gradient. Lead clause in `<em>`, continuation in a span, class `hds-heading--xl`. Copy unchanged from the earlier measure. |
| Hero size | 48px/55.2, weight 300, -0.96px at 1440; 34px at 390 (earlier measure, still the same classes) |
| First-screen CTAs (**live**) | Hero: 2 ("Get started" primary, "Sign up with Google"). Nav: "Start now", "Contact sales", "Sign in". One filled primary in the hero. |
| Imagery | Animated color gradient behind the headline (confirmed by TinyFish's visual pass); no photo in the first screen |
| Experiments (**live**) | `edge-experiment-treatments` meta names 5 running tests: homepage React build, curator h2, footer email capture, mobile sticky hamburger, curator input strength |

**Note (opinion):** the duplicate `h1` is a visual trick paid for with an outline smell; one `h1` plus a decorative `div aria-hidden` would give the same effect with a clean outline. Do not copy the duplicate.
