# Pitch: home page

- **URL:** https://pitch.com (final URL https://pitch.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/pitch-home.json`); headline, eyebrow, button and section-head details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/pitch-home-1440-light.jpg`, `pitch-home-390-light.jpg` (capped at 6000px; the page is 14,350px at 1440). Caveats: the 1440 capture has a blank white band about 3,000px tall after "Pitch is your presentation workspace" (a scroll-pinned section the full-page capture did not paint) and the hero product card is a blurred placeholder; the 390 capture renders those sections, so imagery notes lean on it. The hero sits on a painted purple layer the measure reads as white, so the "white on white 1:1" pair is an artefact. One pair, `#0c021c` on `#5318eb` (2.59:1, testimonial cards), could not be confirmed in either capture.
- **Strongest in:** type (a 180px geometric display at line height 0.8), color (one violet family plus a lime action), brand, copy.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Eina 03 Regular` body (62% of characters), `Mark Pro Bold` display (34%), `Eina 03 Bold` buttons and quotes, `Space Mono` uppercase eyebrows, `Mark Pro Regular` on slide thumbnails |
| Weights | 700 for every heading and button (Mark Pro Bold, Eina Bold); 400 body. One 900 ("Trusted by 4M+ teams"). |
| Type steps (1440) | 180 (h1), 92 ("Templates"), 64, 60 (counters), 48 (h2), 32 (h3), 28 (card titles), 20 (quotes), 18 (lead, eyebrow), 16 (body), 14 |
| Line height | 180/144 (0.8), 92/82.8 (0.9), 48/57.6 (1.2), 32/38.4 (1.2), 28/33.6 (1.2), 20/24 (1.2), 18/28.8 (1.6), 16/25.6 (1.6) |
| Tracking | Two rules: -0.04em on display (-7.2px at 180, -2.56px at 64, -1.92px at 48, -1.28px at 32) and -0.02em on text (-0.56px at 28, -0.4px at 20, -0.36px at 18, -0.32px at 16) |
| Hero (390) | 82px/65.6 (0.8), -3.28px (-0.04em); "Create slides that win." breaks to four lines |
| Text colors | Ink `#0c021c` (a violet black, 20.17:1 on white); body `#363636` (12.08:1); muted `#666666` (5.74:1); brand `#5318eb` text (7.78:1); lilac `#c6a5ff` on deep violet (7.66:1); white on `#280f62` (15.73:1) |
| Surfaces | `#ffffff`; deep violet `#280f62` (hero, dark bands); electric violet `#5318eb`; lilac `#c6a5ff`; pale `#ebe3fe`; `#f6f6f6`. A radial `rgba(198,165,255,.35)` to transparent at 70% behind sections. |
| Accent | Lime `#c4ee87` for the secondary action only ("Get a demo", nav "Sign up"), always with ink text (15.3:1). Tokens also hold `#f9f6ff` and a red `#ff2344`. |
| Borders | None to speak of (one 1px `rgba(255,255,255,.4)`) |
| Radii | 20px (cards, 42 uses), 40, 24, 32, 12 (images), 30 (pill buttons), 4 (lime buttons) |
| Shadows | One: a lilac glow `rgba(198,165,255,.35) 0 20px 60px -20px` |
| Buttons | Hero "Sign up for free" 164x52, white pill (radius 30), ink Eina 03 Bold 16px/19.2, -0.32px, arrow icon. "Get a demo" 111x52, lime, radius **4**. "Start creating" 151x52 deep violet pill. Nav "Log in" 97x44 pill, "Sign up" 80x44 lime radius 4. |
| Container | 1224px (8 uses); hero h1 box 1060px; text blocks 702 to 800px |
| Spacing | Gaps 10, 8, 24, 20, 32, 16, 40; padding 24, 12, 32, 120. Section padding 120 at 1440, 80 at 390. |
| Motion | h1 letters: `filter, opacity .2s ease-out` on 21 spans (a per-letter blur-in). Cards `transform .5s cubic-bezier(.34,1.56,.64,1)` (overshoot). `opacity/transform .4s cubic-bezier(.22,1,.36,1)`. `box-shadow .3s cubic-bezier(.4,0,.2,1)`. Links `color .12s`. 0 reduced-motion rules. |
| Body measure | 16px in a 556px column: 70 characters per line. Phone: 40. |

## What it does right

**Type.** The hero is one sentence at 180px with line height 0.8: the two lines nearly touch, the ascenders of "that" sitting just under "Create slides". It only works because line 1 has no descenders. The tracking system is two numbers: -0.04em for anything set in Mark Pro, -0.02em for anything set in Eina. Eyebrows are Space Mono uppercase in `#5318eb` ("WHY PITCH", "THE PAYOFF", "HOW TO"), a third voice used only for labels. Each h1 letter is its own span with a blur and opacity transition; the capture shows the first letters still pale, so it resolves left to right.

**Color.** One hue family, five steps: `#280f62`, `#5318eb`, `#c6a5ff`, `#ebe3fe`, white, plus a violet-tinted ink `#0c021c` instead of black. The lime `#c4ee87` is the complement and appears only on the demo action. Hero: deep violet with a lighter radial wash from the left, a scatter of blurred real slide thumbnails behind the type ("Marketing Proposal", "Creative Brief", "Sales Pitch"), and a white fade into the page below.

**Layout and spacing.** Centered hero, then a left-aligned body grid on a 1224px container. "THE PAYOFF" is a three-figure stat row ("4M+", "150+", "5H+") in violet with two-line captions. Feature cards are numbered like slides ("(01) Create", "(02) Collaborate", "(03) Deliver") and stack as a deck.

**Hierarchy.** 180px h1, then an 18px sub, then two buttons: no 40 to 60px step in between, so the jump is extreme on purpose. Below the fold, h2 drops to 48px and h3 to 32px, a plain 1.5x ladder.

**Imagery and art direction.** Product shots sit inside lilac-to-violet gradient tiles with radius 20: a "Sales Room" view with "+76%" stat chip, a brand kit panel (style colors, headline font, body font), the editor with live cursors ("Frank", "Emily") and comment pills. Real slide designs are the decoration everywhere. **Opinion:** showing finished slides instead of the editor sells the outcome, which is what a deck buyer cares about.

**Motion.** Small and specific: per-letter blur-in on the headline (200ms each), a springy overshoot curve on card transforms (500ms, peaks at 1.56), a quint ease-out on reveals (400ms). Hover color is 120ms.

**Copy and UX.** "Create slides that win." Sub: "From prompt to presentation, 4M+ teams create and deliver winning slides together in Pitch." A lilac announcement bar over the nav ("Pitch's MCP & API are here"). Two-action pairing everywhere: pill for self-serve, square lime for sales. At 1440 the nav collapses to a single round hamburger button. Stats are concrete: "On average, users save over 5 hours every week."

## Borrow
- Two tracking rules only: -0.04em on the display face, -0.02em on the text face.
- Display line height 0.8 for a short headline with no descenders on line 1.
- One hue in five steps plus a complementary accent reserved for one action.
- Pair button shape with intent: pill = sign up, square = talk to sales.
- A mono uppercase eyebrow in the brand color above every section head.
- A tinted ink (`#0c021c`) instead of `#000` so black text belongs to the palette.
- Feature cards numbered like slides ("(01) Create") so the page structure mirrors the product.
- A three-figure stat row in the brand color with two-line captions, placed before the feature tour.

## Do not borrow
- The pair `#0c021c` on `#5318eb` (2.59:1, 20px quote text in testimonial cards) if the cards really sit on the electric violet; dark text on that violet fails.
- A hamburger-only nav at 1440: it hides Product, Use Cases, Templates and Pricing behind a click on a wide screen.
- Line height 0.8 on any headline that can wrap differently (it gets 4 lines on a phone; descenders will collide on other copy).
- A 14,350px page with scroll-pinned sections that fail to paint for tools and some readers.
- A per-letter blur-in on the h1 with no readable reduced-motion rule.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 18, 28, 32, 48, 60, 64, 92, 180 are off the 1.25 scale.
- Display line height 0.8 at 180px and 82px (FOUNDATIONS allows 0.95 only at 100px and up).
- Body line height 1.6 (FOUNDATIONS: 1.5).
- Radii 20, 24, 30, 32, 40 alongside 4; more than one radius family.
- Overshoot easing `cubic-bezier(.34,1.56,.64,1)` is outside the standard, enter and exit curves.
- No readable `prefers-reduced-motion` rule.
- Spacing values 10, 20, 40, 52, 72 and 80 are off the 0 to 128 spacing scale (most-used gap is 10px).
