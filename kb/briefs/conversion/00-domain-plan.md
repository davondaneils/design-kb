# Domain plan: conversion design for websites (design-conversion)

Owner hat: editor-in-chief. Skill: `design-conversion`. Slug: `conversion`. Layer: domain reference. Written 2026-10-10.

## Why this domain exists
The combined pages (`kb/tests/combined/`) pass every lint check and won Davon's blind ranking 3 of 3, but nothing on them was designed for the moment of decision. The coffee page sells a subscription with a single big number and no terms beside the button, says "15% under shop price" when $18 against $21 is 14.3% (a fundamentals error in the copy nobody caught), shows no reviews, no shipping cost on the shop cards, and has no checkout. The dashboard has no plan, usage or upgrade surface at all. The user's existing skills cover funnel strategy (`sales-funnels`) and direct response copy (`copywriting`); nothing covers the design side of conversion on a premium site, where pressure tactics read as cheap and the brand's restraint is part of the offer.

## Scope (design side only)
1. CTA hierarchy and placement across a page and inside a section.
2. Proof and trust design: reviews, ratings, logos, numbers, guarantees and security cues, without looking cheap.
3. Pricing and plan presentation: price blocks, plan cards, cadence and billing toggles, defaults, comparison.
4. Friction removal in checkout and sign-up, and form design for conversion.
5. In-product upgrade and trial prompts (SaaS): limits, meters, gated features.
6. Evidence: what Baymard, NN/g, standards, regulators and published A/B tests actually support, and how to read a test claim.

## Out of scope (link, do not duplicate)
- Funnel architecture, offer stacks, upsells, order bumps, value ladders: `sales-funnels`.
- Persuasive long-form copy, leads, awareness levels, headlines for direct response: `copywriting`. Premium and UI copy: design-copy.
- Positioning, ICP and what the offer is: `website-strategy`.
- Generic form mechanics (labels, validation timing, error text): design-ux `references/03-forms.md`. This domain adds only what is specific to conversion (field budget, checkout order, payment field trust, terms at consent).
- Tables and settings in product: design-product-ui. States: design-ux 04. Color of buttons: design-color.

## Subtopics (one file name across briefs, research and drafts)
| # | File | Question |
|---|---|---|
| 1 | 01-cta-hierarchy.md | How many actions, in what order of emphasis, where, and with what label? |
| 2 | 02-proof-and-trust.md | Which proof, where, in what form, so it convinces without looking cheap? |
| 3 | 03-pricing-and-plans.md | How do I set a price, a plan choice and its terms so the choice is easy and honest? |
| 4 | 04-checkout-and-forms.md | What does a checkout or sign-up need, in what order, with how few fields? |
| 5 | 05-in-product-upgrades.md | When and how does a SaaS product ask for an upgrade or a trial conversion? |
| 6 | 06-evidence-and-testing.md | What evidence supports which practice, and how do I read a published A/B test? |

## Test plan
Improve the two combined pages (`kb/tests/combined/coffee.html`, `dashboard.html`; Davon picked them 3 of 3), copied to `kb/tests/design-conversion/before/`. Briefs and rubric: `slice-test-briefs.md`.

## Network limit
curl and the browser cannot reach Baymard, NN/g or exemplar hosts; WebFetch returns their text (2026-10-10). Exemplar pricing pages were read as text only (linear.app/pricing, stripe.com/pricing, vercel.com/pricing, raycast.com/pricing, apple.com/shop). No exemplar pixels. Google Fonts now works (coordinator note, 2026-10-10); this domain needs no new face and keeps the combined page's Newsreader. Photo hosts stay blocked; no photos are used.
