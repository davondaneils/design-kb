# Exemplar teardown index

Which exemplar to compare a page against. Each row links a one-page teardown measured from the live site on 2026-10-10 (method: `kb/teardowns/measure.mjs` and `probe.mjs`, raw JSON in `data/`, screenshots in `kb/exemplars/shots/<slug>-1440-light.jpg` and `-390-light.jpg`). The list is Davon's approved set in `kb/exemplars.md`.

How to use it (the Critic's step "compare to exemplars"): pick the job first (table 1), then the domain you are judging (table 2), and open the named teardown's "Measured values" and "Borrow / Do not borrow" sections. Compare numbers, not impressions: type steps, tracking, line height, text contrast, radii, shadow recipes, durations.

## 1. Pick by job

| Job | Compare against first | Then | Why |
|---|---|---|---|
| Landing page, product or SaaS | [stripe-home](stripe-home.md) | [linear-home](linear-home.md), [vercel-home](vercel-home.md), [ramp-home](ramp-home.md) | Hero, proof, CTA system and product shown as code; one light, one dark, one monochrome, one warm |
| Landing page, consumer or brand-led | [apple-macbook-air](apple-macbook-air.md) | [cashapp-home](cashapp-home.md), [family-home](family-home.md), [arc-home](arc-home.md) | Photography, one-color brands, illustration systems |
| Landing page, dark theme | [linear-home](linear-home.md) | [raycast-home](raycast-home.md), [framer-home](framer-home.md), [mercury-home](mercury-home.md) | Surface steps, alpha borders, light text tuning |
| Landing page, small business or service | [designjoy-home](designjoy-home.md) | [pitch-home](pitch-home.md) | One offer, one person, pricing on the page |
| Dashboard or app UI | [linear-app](linear-app.md) | [stripe-dashboard](stripe-dashboard.md), [vercel-dashboard](vercel-dashboard.md) | Density, row heights, status color, 12 to 13px type |
| Consumer app or to-do style UI | [things-home](things-home.md) | [notion-product](notion-product.md), [superhuman-home](superhuman-home.md) | Calm UI, keyboard-first, published app shots |
| Phone (390) layout | the 390 rows of the job's first pick | [apple-macbook-air](apple-macbook-air.md), [stripe-home](stripe-home.md) | Every teardown records the 390 hero size and characters per line |
| Brand, studio or portfolio | [pentagram-home](pentagram-home.md) | [teenage-engineering-home](teenage-engineering-home.md), [rauno-home](rauno-home.md), [emilkowalski-home](emilkowalski-home.md) | Work as the color, proportional layout, interaction craft, restraint |
| Editorial or long read | [brandidentity-home](brandidentity-home.md) | [nytimes-feature](nytimes-feature.md) (not measured, see below) | Two faces with fixed jobs, fluid type tokens, magazine rhythm |

## 2. Pick by domain

● = among the site's strongest domains in its teardown, ○ = useful secondary reference. Domains: type, color, layout (and spacing), hierarchy, imagery (and art direction), motion, copy, UX, product UI, density, brand, editorial.

| Teardown | Type | Color | Layout | Hierarchy | Imagery | Motion | Copy | UX | Product UI | Density | Brand | Editorial |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [stripe-home](stripe-home.md) | ● | ● | ○ | ● | ● | ○ | ○ | ● |  |  |  |  |
| [linear-home](linear-home.md) | ● | ● | ○ | ○ | ○ | ○ |  |  | ● |  |  |  |
| [vercel-home](vercel-home.md) | ● | ● | ● | ○ |  |  | ○ |  |  |  |  |  |
| [apple-macbook-air](apple-macbook-air.md) | ● | ○ | ○ | ● | ● | ○ | ● | ● |  |  |  |  |
| [raycast-home](raycast-home.md) | ○ | ● | ○ |  | ● | ○ |  |  | ● |  |  |  |
| [framer-home](framer-home.md) | ● | ● |  |  |  |  |  |  | ● |  | ● |  |
| [mercury-home](mercury-home.md) | ● | ● |  |  | ● |  |  |  |  |  | ● |  |
| [ramp-home](ramp-home.md) | ● |  |  | ● |  |  |  |  | ● | ● |  |  |
| [cashapp-home](cashapp-home.md) | ● |  | ● |  |  | ● |  |  |  |  | ● |  |
| [family-home](family-home.md) | ● |  |  |  | ● |  |  |  | ● |  | ● |  |
| [designjoy-home](designjoy-home.md) | ● |  |  |  |  |  | ● | ● |  |  | ● |  |
| [pitch-home](pitch-home.md) | ● | ● |  |  |  |  | ● |  |  |  | ● |  |
| [linear-app](linear-app.md) | ● | ● |  |  |  |  |  |  | ● | ● |  |  |
| [stripe-dashboard](stripe-dashboard.md) |  | ● |  |  |  |  |  | ● | ● | ● |  |  |
| [vercel-dashboard](vercel-dashboard.md) | ● | ○ |  |  |  |  |  | ○ | ● | ● |  |  |
| [superhuman-home](superhuman-home.md) | ● | ● |  |  |  |  |  |  | ● |  | ● |  |
| [things-home](things-home.md) |  | ● |  |  | ● |  | ● | ○ | ● |  |  |  |
| [notion-product](notion-product.md) | ● | ● |  |  |  |  |  | ● | ● |  |  |  |
| [arc-home](arc-home.md) |  | ● |  |  |  |  | ● |  | ● |  | ● |  |
| [pentagram-home](pentagram-home.md) |  |  | ● |  | ● |  |  | ○ |  |  | ● | ● |
| [rauno-home](rauno-home.md) |  |  |  |  |  | ● |  | ● |  |  | ● |  |
| [emilkowalski-home](emilkowalski-home.md) | ● |  |  |  |  | ● | ● |  |  |  |  |  |
| [nytimes-feature](nytimes-feature.md) | (unmeasured) |  |  |  |  |  |  |  |  |  |  | (unmeasured) |
| [teenage-engineering-home](teenage-engineering-home.md) |  |  | ● |  | ● |  |  |  |  |  | ● |  |
| [brandidentity-home](brandidentity-home.md) | ● |  |  | ● |  |  |  |  |  |  |  | ● |

## 3. Patterns the set shares (measured, with where to look)
- **Two-tone headings at one size:** ink sentence plus a muted continuation, hierarchy by color not size. Stripe (32px, `#061b31` then `#64748d`), Linear (48px, `#f7f8f8` then `#8a8f98`), Vercel (24px), Apple (21px/600), Raycast (20px, fails AA), Ramp (ink at 100% then 60% alpha).
- **Negative tracking that scales with size:** Stripe and Linear about -0.02em on display, Vercel -0.06em, Pitch -0.04em; Apple and Raycast go positive at small sizes.
- **Variable in-between weights:** Linear 510 and 590, Vercel 450, Superhuman 460 and 540, Mercury 360, 420 and 480, Pentagram 350 and 375.
- **Product shown as live HTML, not screenshots:** Stripe, Linear, Raycast, Framer, Notion.
- **One weight or one face for a whole page:** Stripe (300), Ramp (400), Cash App, Emil Kowalski (one 16px size).
- **Contrast misses inside the exemplar set** (do not copy): Raycast gray heading halves 3.75:1, Designjoy hero sub 2.44:1, Family colored eyebrows 2.2 to 3.6:1, Apple `#86868b` below large sizes, Notion's closing button 4.03:1. The fundamentals gate in `kb/FOUNDATIONS.md` still applies to anything borrowed.

## 4. Coverage and gaps
- **Not measured:** nytimes.com returns HTTP 403 (DataDome bot protection) to every request from the cloud environment. `nytimes-feature.md` holds the steps to finish it from a normal browser.
- **App UIs behind logins** (Linear, Stripe Dashboard, Vercel Dashboard, Superhuman, Notion, Things, Arc): measured from public surfaces (Linear's live app HTML on its home page; Stripe and Vercel docs, which share each product's design system; Stripe Apps illustrations and Vercel docs screenshots for the dashboards themselves) and from published product shots, which are marked as estimates.
- **Partial captures:** Vercel (lower third blank, scroll reveals), Pitch (blank pinned band), Rauno (fixed stage, shows first frame), The Brand Identity (videos captured black), Pentagram (cookie banner, lazy images), Cash App (1440 re-captured by scrolling its inner container). Each teardown's header says what was affected.
- **Live capture (2026-10):** stripe-home, linear-home, vercel-home, ramp-home and apple-macbook-air each carry a "Live capture (2026-10)" section with live head data (title, description, og and twitter tags, favicons, JSON-LD presence), the live `h1` markup and first-screen CTAs, captured with TinyFish `fetch_content` (raw: `live/<slug>/head.json`). No new screenshots: no available tool returns an image of a public page, so the 1440 and 390 shots above remain the earlier Playwright captures. JSON-LD `@type` values are unverified (the tool strips script contents).
- **Dashboard values are still estimates where marked.** The Mobbin connector (`search_screens`, `search_flows`) returned "requires a paid plan" on 2026-10-10, so no Linear app, Stripe Dashboard or Vercel dashboard value in this index or in `linear-app.md`, `stripe-dashboard.md` and `vercel-dashboard.md` is Mobbin-backed yet. Each of those files names the Mobbin query to run once a paid seat is connected.
- Sites change. Re-measure before relying on a value older than a few months: `node kb/teardowns/measure.mjs <url> kb/teardowns/data/<slug>.json`.
