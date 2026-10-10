# Vercel: home page

- **URL:** https://vercel.com
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/vercel-home.json`), headline details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/vercel-home-1440-light.jpg`, `vercel-home-390-light.jpg`. The lower third of the 1440 capture is blank: those sections reveal on scroll and had not painted when the full-page shot was taken. Judge the top two thirds only.
- **Strongest in:** typography (tight grotesk display), monochrome color system, whitespace, token discipline.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `GeistSans` (Vercel's own, variable 100 to 900) and `Geist Mono`. Nothing else. |
| Weights | 400 (hero h1, body), **450** (section h2, leads), 500 (buttons, nav). 450 is a variable in-between weight. |
| Type steps (1440) | 64 (h1), 56 (h2), 24 (lead), 16, 14 (body and nav), 12 (mono captions), 11 (badges) |
| Line height | 64/64 (1.0), 56/56 (1.0), 24/32 (1.33), 16/24 (1.5), 14/20 (1.43) |
| Tracking | **-3.84px at 64 (-0.06em)**, -3.36px at 56 (-0.06em), -0.96px at 24 (-0.04em), -0.32px at 16 (-0.02em). Much tighter than Stripe or Linear. |
| Hero (390) | 48px/56, -2.88px (-0.06em), centered (left-aligned at 1440) |
| Text-wrap | `text-wrap: balance` on h1, h2 and leads |
| Background | `#fafafa` page, `#ffffff` cards and secondary buttons, `#171717` primary buttons. That is the whole palette. |
| Text colors | `#171717` (17.2:1 on `#fafafa`), `#4d4d4d` (8.1:1), `#666666` (5.5:1), `#8f8f8f` (3.1:1, decorative only) |
| Accent | None. A single green `#297a3a` for a status dot. Gradients appear only inside small feature illustrations. |
| Color space | Root tokens are written in `lab()`, for example `--color-gray-950: lab(1.90334% .278696 -5.48866)`, and gradients interpolate `in oklab` |
| Borders | No CSS borders. Edges are box-shadow rings: `0 0 0 1px rgba(0,0,0,.08)` or `0 0 0 1px rgb(235,235,235)`, inset on inputs. |
| Radii | Pills (`9999px` equivalent) for marketing buttons, 6px for nav buttons, 4px small |
| Buttons | Hero "Deploy now" 124x40, `#171717` fill, 16px/500, pill. "Talk to sales" 130x40, white with a 1px shadow ring. Nav buttons 32px tall, 14px, radius 6. |
| Container | 1448px max (full width at 1440); content 921 to 1080px |
| Spacing | `--spacing: .25rem` (4px base, Tailwind v4). Gaps 6, 4, 12, 20, 40, 44 |
| Motion | Hover `color .1s cubic-bezier(.4,0,.2,1)` (79 uses); `all .15s`; opacity `.3s`; the hero's three rotating lines fade color over `.5s cubic-bezier(0,0,.2,1)`. 16 `prefers-reduced-motion` rules. |

## What it does right

**Type.** Geist at 64px with -0.06em tracking and line height 1.0: letters nearly touch, which gives the headline a dense, logo-like block. Section heads at weight 450, a hair heavier than body. Leads at 24px/32 with -0.04em. Every heading is `text-wrap: balance`, so two-line headings break evenly ("Build agents on infrastructure / that thinks like them").

**Color.** Monochrome: `#fafafa`, white, `#171717` and three grays. Hierarchy is carried by gray steps, never hue. Customer stories use the two-tone trick: "Zapier serves over 100 million" in `#171717`, then "monthly website visits on Vercel." in `#4d4d4d` at the same 24px. Colors are authored in `lab()`, gradients mixed in `oklab`. **Opinion:** this is the cleanest example of a palette that needs no accent because the product (the triangle) is the brand mark.

**Layout and spacing.** A three-column hero at 1440: headline and buttons left, the triangle logo center, three short benefit lines right. Big empty space above and below the logo strip. Customer stories as a split: a 24px claim with a short feature list on the left, a live screenshot of the customer's own site on the right.

**Hierarchy.** First screen: an announcement bar ("Ship 26 is coming to SF", "Get your ticket"), the hero, then logos. Logos are monochrome and evenly spaced.

**Imagery and art direction.** The triangle is the only hero art. Below, real customer sites (Zapier, Notion AI chat) shown inside plain frames. No photography.

**Motion.** 100ms color hovers; the right-hand benefit lines cycle with a 500ms ease-out color fade. Restrained.

**Copy and UX.** Two-word headline ("Agentic Infrastructure"). Two actions: "Deploy now" (product-led) and "Talk to sales". Nav: Products, Resources, Enterprise, Pricing, then "Get a Demo", "Log In", "Sign Up". Proof is a customer's own metric, not Vercel's.

## Borrow
- Tracking at -0.06em on a grotesk at 56px and up, with `text-wrap: balance`.
- A five-color monochrome system (`#fafafa`, `#fff`, `#171717`, `#4d4d4d`, `#666`) when the logo carries the brand.
- Box-shadow rings (`0 0 0 1px rgba(0,0,0,.08)`) instead of borders: no layout shift on state change and they stack with real shadows.
- Colors authored in `lab()`/`oklab` for perceptual consistency.
- Customer proof as "their number on our platform", same size, two tones.

## Do not borrow
- -0.06em tracking on any face with tight default spacing or at body sizes; Geist is drawn loose enough to take it at display sizes only.
- `#8f8f8f` on `#fafafa` (3.1:1) for readable text.
- Scroll-triggered reveals that leave content unpainted for crawlers, screenshots and print.
- A hero with no visual of the product. It suits Vercel because the product is invisible infrastructure; a visible product should show itself.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Weight 450 is not a FOUNDATIONS weight.
- Display line height 1.0 under 100px.
- Steps 24, 56, 64 off the 1.25 scale.
- No borders at all; edges are shadow rings. FOUNDATIONS already defines `--ring` as `0 0 0 1px`, so this matches the elevation recipe.
