# Designjoy: home page

- **URL:** https://www.designjoy.co (final URL https://www.designjoy.co/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/designjoy-home.json`); hero, button and section-head details from `kb/teardowns/probe.mjs` and a scratch probe of the same kind. Screenshots: `kb/exemplars/shots/designjoy-home-1440-light.jpg`, `designjoy-home-390-light.jpg` (the 1440 page is 6,998px, so the capture is nearly complete; the 390 page is 12,239px and is cut at 6000).
- **Caveat:** 2 stylesheets were blocked from cross-origin reading, so the reduced-motion count (0) may be incomplete.
- **Strongest in:** type (sans plus an italic serif accent word), copy, brand, conversion UX for a one-person service.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Figtree` 300 to 700 for 93% of characters; `Seriouslynostalgic` italic (one accent word per head); `Seriouslynostalgic` extra condensed for testimonial quotes; `OCR-A` (`Ocrastd`) for tiny uppercase eyebrows |
| Weights | 500 for heads and buttons, 400 body. The serif accents are 400. |
| Type steps (1440) | 82 (h1), 60 (testimonial quotes, condensed serif), 56 (h2), 24, 22, 20 (card titles, FAQ, lead), 16, 15 (buttons), 14 |
| Line height | 82/78 (**0.95**), 56/56 (1.0), 60/60 (1.0), 24/26.4 (1.1), 20/22 (1.1, FAQ), 20/28 (1.4, about text), 16/20 (1.25), 14/20 (1.43) |
| Tracking | -3px at 82 (-0.037em), -2px at 56 (-0.036em); normal on everything else, including the serif accent words |
| Hero (390) | 61/56 (0.92), -3px (-0.049em), left aligned, 303px wide |
| Text colors | `#000000` (17.05:1 on the `#ece6e8` page, 21:1 on white); gray `#99948f` (2.44:1 on the page, 3.01:1 on white, 6.99:1 on black); `rgba(0,0,0,.55)` (4.76:1 on white); pink `#ff0084` on `#1b000e` (5.3:1) |
| Surfaces | Page `#ece6e8` (dusty pink-gray); white cards; black pricing card and footer; saturated gradient cards fading from transparent to yellow `rgb(255,219,1)`, blue `rgb(0,0,254)` and orange `rgb(255,90,0)` |
| Borders | 1px `#e0d4d8` (18 uses), plus `#ddced3`, `#d1c2c7`, `#ccbfc4`: every border is the page hue darkened, never a neutral gray. Dashed border on the "About" box. |
| Radii | 19px cards (21 uses), 8px buttons, 20px large cards, 12px, pill badges |
| Shadows | Glossy dark button: `0 1px 2px rgba(0,0,0,.3), inset 1px 1px .25px rgba(255,255,255,.3), inset 0 2px 1px rgba(255,255,255,.5)` over `linear-gradient(#444, #000)`. Floating card: `0 20px 68px rgba(0,0,0,.25)` plus the same inset highlights. Large drops `0 50px 50px rgba(0,0,0,.2)`. |
| Buttons | Primary "See pricing" in the hero card 324x60, white, black Figtree 20px/500, padding 20 15, radius 8. Nav: "Login" and "Book a call" 38px tall outline, "See pricing" 110x38 glossy black gradient, 15px/500, padding 8 16, radius 8. |
| Container | 1200px max with visible 1px vertical rules at its edges; heads 670px; hero text 550px; about box 590px |
| Spacing | Gaps 32 dominant (24 uses); padding 7 (badges), 10, 16, 46, 60, 40, 72; margins 24, 12, 32, 60; one 160px gap in the hero |
| Motion | `all .2s ease` on 6 links. No other transitions or keyframes found; 0 reduced-motion rules (2 sheets unreadable). |
| Body measure | About text 20px in a 560px box: 51 characters per line. At 390 the same box is 215px wide: **19 characters per line**. |

## What it does right

**Type.** A neutral sans (Figtree 500, tracked -0.037em) with one word per heading swapped into an italic display serif: "Design subscriptions for *everyone*", "The way design *should've* been done in the first place", "*Frequently* asked questions", "One subscription, *endless possibilities*". The serif word is set at the same size and line height so the line stays solid. Testimonials switch to a condensed serif at 60/60 ("Designjoy shows that they know the art of subtlety."), and tiny OCR-A labels ("MEMBERSHIP BENEFITS", "PRICING") act as eyebrows. Four faces, each with exactly one job.

**Color.** The page is a muted pink-gray `#ece6e8`, borders are the same hue darker (`#e0d4d8`), so the frame is quiet; then cards explode into saturated yellow, electric blue `rgb(0,0,254)`, magenta and orange gradients with smiley-face art. **Opinion:** quiet frame, loud tiles is why the page feels playful without being chaotic.

**Layout and spacing.** A 1200px column marked by visible hairlines at both edges, like a page in a binder. Hero is a 2-column split: headline and one line of sub on the left, a gradient "Join Designjoy" card with the real CTA on the right. Below: three process cards (Subscribe, Request, Receive), a logo row, an about box, a five-tile benefits carousel, two big quotes, a work bento, pricing, FAQ with a booking card, and a black closing band.

**Hierarchy.** The nav itself is a CTA row ("Login", "Book a call", "See pricing"), and the hero card repeats "See pricing" as a 60px white button plus "Book a 15-min intro call". Pricing is shown twice: in the first process card ("$5,995 /month") and in the pricing section ("$4,995" with "$5,995" struck through).

**Imagery and art direction.** 3D gradient blobs, smiley-face sticker art on a membership card, and real work samples tilted in a bento. The glossy black buttons with inner highlights are deliberately skeuomorphic against the flat pastel page.

**Motion.** Almost none: a 200ms ease on links. The page relies on color, not movement.

**Copy and UX.** The offer is the headline: "Design subscriptions for everyone", then "Pause or cancel anytime." Risk reducers are their own cards: "Pause anytime", "Try it for a week". Credibility is specific and founder-led: "First launched in 2017", "Designjoy is run entirely by Brett", testimonial from Webflow and from Kevin O'Leary. The FAQ answers 14 buying objections ("How fast will I receive my designs?", "Are there any refunds?"). For copy method, see the copywriting and sales-funnels skills rather than repeating it here.

## Borrow
- One italic serif word per sans headline, same size and line height, to add voice without a second heading style.
- Borders and dividers tinted from the page color (`#ece6e8` page, `#e0d4d8` lines), not neutral gray.
- A quiet tinted page with saturated gradient cards as the only loud elements.
- The CTA card in the hero: a self-contained offer tile with one primary button and a secondary booking link.
- Show the price early (first process card) and again in the pricing section.
- Glossy dark button recipe: `linear-gradient(#444,#000)` plus two inset white highlights at 30% and 50%.

## Do not borrow
- Gray `#99948f` on `#ece6e8`: 2.44:1, used for the hero sub "Pause or cancel anytime." (20px) and the about paragraph. Fails AA.
- The about box at 390: 19 characters per line, far below a readable 40 to 75.
- 61px hero on a 390 screen with -3px tracking (-0.049em): "subscriptions" runs almost edge to edge (screenshot, **opinion** on tightness).
- `rgba(255,255,255,.8)` text measured on white (1:1) in 111 characters; likely text sitting over a gradient the measure could not see, but check it.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 15, 22, 24, 56, 60, 82 are off the 1.25 scale.
- Heading line heights 0.95 and 1.0, below the 1.1 to 1.25 range; FAQ 20/22 (1.1) used for questions.
- Card radius 19px and 20px, off the radius set.
- Spacing 7, 10, 46, 60, 72 are off the spacing set.
- Four font families; FOUNDATIONS assumes one or two.
- No reduced-motion rules found (2 sheets blocked), though there is little motion to reduce.
