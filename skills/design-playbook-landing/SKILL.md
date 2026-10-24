---
name: design-playbook-landing
description: Job playbook for a marketing site or landing page at the level of stripe.com, linear.app or apple.com product pages. Use for "design a landing page", "build a homepage", "marketing site", "product page", "pricing page", "waitlist page", "redesign our homepage", "make our site look like Stripe or Linear", "site for my coffee brand / SaaS / studio", "event or festival site", "conference page". Says which foundations and domain references to load in what order, what done looks like, and the signature moves the marketing exemplars share. Not for app screens or dashboards (design-playbook-dashboard), native apps (design-playbook-mobile) or a brand system without a site (design-playbook-brand).
---

# design-playbook-landing

A landing page has one job: make the right visitor understand the offer and take one action. Everything below serves that.

## 1. Load in this order
1. **design-foundations** (always): tokens, the 16-item gate, `references/accessibility.md`.
2. **design-strategy** (always, after foundations): the strategy brief at the depth its section 1 sets; one page for a new site, three lines for an event or campaign page, full (it routes to website-strategy stages 2 to 5) when audience, positioning or competitors are not given. The hero is written from its primary category entry point and category frame. No visual decisions before this. Then write the build spec (`references/build-spec.md`): the sixteen decisions as values and the never-list, in a file beside the brief, re-read before every edit pass.
3. **Copy**, by the rule in section 2: design-copy `references/01-page-copy-structure.md`, `03-voice-and-tone.md` and `06-copy-in-context.md` (every number is a claim; content mechanics), or copywriting.
4. **design-layout**: `references/05-page-composition-and-density.md`, `01-grids-and-structure.md`, `04-responsive-and-adaptive.md`, and `06-pacing-signature-and-phone-editing.md` for any page over four sections (write the flatplan before layout and the phone edit list before the 390 build).
5. **design-typography**: `references/02-selection-pairing.md`, `01-scale-measure-leading.md`, `05-typographic-detail.md`; `06-type-without-web-fonts.md` (system stack, self-hosted or mixed, decided before layout); `07-type-led-pages.md` when type carries the page (display 49 to 112px, leading 0.95, optical margin).
6. **design-color**: `references/palette-building.md`, `ui-tokens-themes.md`.
7. **design-art-direction**, right after color: SKILL.md, then `references/01-concept-and-consistency.md` and `04-visuals-without-image-hosts.md` (always); `02-photography.md` and `03-composition-and-overlays.md` when photos exist or text sits on images or textures; `05-requesting-photography.md` at hand-over. Write the one-sentence concept and its reject test before layout. design-graphic `references/03-photography-direction.md` and `04-illustration.md` for the craft of each image; `references/01-logo-identity.md` (outlining workflow, responsive tiers, favicon) when the brief supplies no logo files.
8. **When the page sells** (pricing, subscription, shop, booking, checkout): **design-conversion** SKILL.md, then the references its section names (`01-cta-hierarchy.md`, `02-proof-and-trust.md`, `03-pricing-and-plans.md`, `04-checkout-and-forms.md`); then **design-ux** `references/07-commerce-flows.md`, `03-forms.md` and `02-navigation-ia.md` (purchase flow, field budget, no dead ends). Funnel step order and offers stay with sales-funnels.
9. **design-data** `references/07-data-shapes-the-ui.md` only for sites with accounts, shops or bookings: stock levels, "places left", prices and dates from a catalog are data claims with a source field, not typed copy.
10. **design-motion**: `references/01-purpose-restraint.md`, `04-micro-interactions.md`; add `03-choreography-transitions.md` (reveals and LCP) and `07-motion-on-real-pages.md` when the page shows data or a drawing that could reveal; add `08-cinematic-scroll.md` when scroll drives a film, a pinned object or chapters (product reveals, launches, studios, hospitality). Light touch: one hero reveal may run to 800ms, on the hero artifact by transform or clip-path (the headline paints at once), everything else 600ms or less (FOUNDATIONS Motion; design-motion move 9). No motion at all is not restraint: round 1 shipped 1 duration and 1 curve against the exemplars' 5 to 8 (`kb/reviews/benchmark-round1-landing.md` scorecard Motion).
11. **design-frontend**: build; `references/05-images-fonts.md` for LCP and font loading, `07-measured-build-quality.md` for the proof step.
12. **design-search**: `references/07-page-build.md` first (it applies the rest to a built page), then `02-on-page-content.md` and `03-structured-data.md`.
13. **design-polish** after the lint gate passes and before the exemplar comparison: SKILL.md, `references/06-polish-checklist.md`, and the reference each failing item names. Build a state sheet for every interactive control. Then the self-critique loop in design-director.

## 2. Which copy skill
- **copywriting (direct response)** when the page sells in one sitting through a long argument: sales pages, long-form sales letters, VSL pages, advertorials, funnel steps (opt-in, order form, upsell), promo emails and ads. Pair with sales-funnels when the page is one step in a funnel.
- **design-copy** for premium product and brand sites, SaaS marketing sites, studio and portfolio sites, pricing pages, and every piece of UI text. Short, specific, calm. No hype stacks, countdowns or fake scarcity.
- Quick test: if the closest exemplar is on the marketing list in `kb/exemplars.md` (Stripe, Linear, Apple, Mercury and so on), it is not direct response. Use design-copy. (Opinion; the exemplar teams write this way.)
- Mixed case (a paid-ads landing page for a premium brand): structure from copywriting's awareness levels, voice and sentence craft from design-copy.

## 3. Non-negotiables for this job
1. One primary action per view, the same verb everywhere it appears.
2. The hero says what it is, for whom, and why now, in the visible first screen at 390px and 1440px. Check the 390 first screen (390x844) for the category word ("coffee subscription", "invoicing software"): a lead paragraph that does the clarity job falls below the first phone screen when an image sits between it and the H1.
3. Proof sits next to the claim it proves.
4. Real content and real product imagery; never lorem ipsum, never a generic stock hero.
5. Light and dark designed when asked; every section passes the gate in both.
6. One promise, one number: shipping time, trial length, refund window and every count are said one way across the hero facts, headings, steps, slip and footer (`claims_inventory.mjs` warns `PROMISE`). A store-wide rating sits beside a product only with its scope ("4.7 from 1,284 subscriber reviews"), never as that product's rating (`kb/reviews/round3-critic.md`, coffee item 16).

## 3a. Head and markup facts from the live exemplars (captured 2026-10-10)
From the "Live capture (2026-10)" sections of the teardowns (TinyFish `fetch_content`, raw in `kb/teardowns/live/<slug>/head.json`):
1. **One filled primary in the hero.** Stripe: "Get started" filled beside "Sign up with Google"; Vercel: "Deploy now" filled beside "Talk to sales"; Ramp: one email field fused to "Get started for free" (`stripe-home.md`, `vercel-home.md`, `ramp-home.md`). The nav may repeat the action; it never adds a second filled button in the same screen.
2. **On a product page the `h1` is the product name**, and the slogan is the big line below it. Apple's `h1` is the eyebrow "MacBook Air"; "Might takes flight." is not the heading (`apple-macbook-air.md`). On a home page the `h1` is the value line (Stripe, Linear, Vercel, Ramp). One `h1`, as live text: do not copy Stripe's duplicate `aria-hidden` `h1` or Linear's split, hidden heading; both make the outline harder to audit (opinion, `stripe-home.md`, `linear-home.md`).
3. **`theme-color` matches the page background**, one per scheme with `media="(prefers-color-scheme: dark)"`, so mobile browser chrome blends into the page: Linear `#08090a` is its page background, Vercel `#FAFAFA` (`linear-home.md`, `vercel-home.md`).
4. **Separate `og:image` and `twitter:image` when the crops differ.** Vercel ships `og-home-not-x.png` for Open Graph and `og-home-x.png` for X: one card art per platform crop (`vercel-home.md`). Ramp reuses one generic `default-og-image.jpg` for both (`ramp-home.md`); that is the floor, not the bar (opinion).
5. **Never `maximum-scale=1` or `user-scalable=no`** in the viewport tag. Vercel ships `maximum-scale=1`; do not borrow it: it blocks pinch zoom in browsers that honor it (WCAG 1.4.4 Resize text, https://www.w3.org/WAI/WCAG22/Understanding/resize-text, cited in `vercel-home.md`).

## 3b. Event and editorial pages: the hero carries the identity at full strength
Festivals, conferences, exhibitions, launches, magazines and feature stories sell an identity before an offer. The held-out "Set in Stone" festival page came out "correct and calm, but the hero is quiet and the stone art is small; the baseline hero is louder" (`kb/tests/heldout.md` section 5): the skill's restraint rules were applied to the first screen, where they cost the most.
1. **Full strength in the first screen.** The identity (wordmark, key art, poster image) runs at the scale and color the poster runs at: the first screen at 390 and 1440 should read as the poster, not as a page about it. Opinion, with measured precedents: Cash App's hero is a full-bleed brand-green field with a 56px headline at leading 0.95 (`kb/teardowns/cashapp-home.md`); Pentagram opens on a full-bleed 1440x617 hero (`kb/teardowns/pentagram-home.md`); Apple takes the hero background from the product's own color (`kb/teardowns/apple-macbook-air.md`).
2. **Restraint belongs to the body.** Programme, speakers, venue, access, tickets and FAQ stay calm: text sizes on the scale, one accent, quiet surfaces. Calm below makes the loud hero read as a choice (opinion).
3. **Loud means scale, color and crop, never noise.** Display type at the top of the ramp (`--text-display` to 112px; design-typography `references/07-type-led-pages.md`), the identity color as a field rather than a stripe, key art cropped past the edges. Not more elements: still one primary action, one `h1`, the category word and dates readable (section 3 items 1 and 2).
4. **Test it: the hero screenshot alone could be the event's social post** at 390x844 and at 1440x900, with the name, dates and city legible and nothing that reads as a generic template. If the baseline or a competitor's first screen is louder, the page is not done (opinion).
5. **Facts the hero still owes:** what (the category word), when (dates with weekday checked, in the audience's locale: "Sat 17 to Sun 18 April 2027" for en-GB), where (city and venue), and the one action (tickets). A loud hero that hides the dates has failed.
6. **Fundamentals do not relax:** text over key art passes the `overlay` worst-pixel check; display type keeps its hairline (design-typography `references/08-high-contrast-faces.md`); motion stays under the 800ms hero reveal.

## 4. Done means
1. `node tools/lint.mjs page.html` exits 0 at its default widths (390, 768, 1024, 1440), and so does every state URL and the state sheet. `claims_inventory.mjs` `PROMISE` warnings are fixed or named in the hand-over.
2. `node tools/render.mjs page.html out/ --widths 390,768,1024,1440` and every `[judged]` row holds on the screenshots, plus the state sheet (every control in every state) rendered and linted.
3. `claims_inventory.mjs` exits 0 and every claim is ticked against its source; `search-check.mjs` exits 0; `conversion-audit.mjs` exits 0 when the page sells (design-director section 5).
4. At 390: the category word and the primary action sit in the first 844px; when the page sells, the price and the primary action are both there. At 768: a tablet layout, not a stretched phone (design-layout `references/04-responsive-and-adaptive.md`, marketing tablet pattern). At 1440: the next section peeks above 900px. Measure with `kb/tests/design-layout/measure-layout.mjs`.
5. A term line (renews when, at what price, how to cancel online) sits beside any renewal or subscription CTA (design-conversion).
6. Side by side with the named closest exemplars, rated close (not clearly below) on hierarchy, type, imagery, rhythm and craft. Every page passes the first-screen reject test (logo hidden, the motif is drawn in the first screen; `references/signature-moves.md`). Event and editorial pages also pass section 3b item 4 (the hero screenshot works as the social post). Pick them from `kb/teardowns/INDEX.md` (Stripe first, then Linear, Vercel, Ramp for product and SaaS) and `references/signature-moves.md`; compare measured numbers, not impressions.
7. The strategy brief exists at the right depth and `node skills/design-strategy/assets/brief_lint.mjs` passes; the word swap test, covered competitor wall and five-second test are recorded; every public claim has a ledger row with evidence held.
8. A fresh-context critic has judged the gate (design-director section 5, step 14); a self-review alone does not claim it.
9. The hand-over names what is still short of the exemplar.

## 5. Reference map
| Need | Read |
|---|---|
| Closest exemplar by site type, and the moves the marketing exemplars share | `references/signature-moves.md` |
| The build spec: sixteen decisions as values, the never-list, a skeleton | `references/build-spec.md` |
| Scroll-driven films, pinned stages and chapters | design-motion `references/08-cinematic-scroll.md` |
| Where to find sections, footers, motion and landing references | `kb/references/00-general.md` (galleries), `kb/references/motion.md` |
| Measured exemplar values (type steps, colors, radii, durations) and the contrast misses not to copy | `kb/teardowns/INDEX.md`, then `stripe-home.md`, `linear-home.md`, `vercel-home.md`, `ramp-home.md` |
| Checkout and upgrade UI examples | `kb/references/patterns/11-checkout-and-upgrade.md` |
| Section order for common landing page types | design-copy `references/01-page-copy-structure.md`, design-layout `references/05-page-composition-and-density.md` |
