---
name: design-playbook-landing
description: Job playbook for a marketing site or landing page at the level of stripe.com, linear.app or apple.com product pages. Use for "design a landing page", "build a homepage", "marketing site", "product page", "pricing page", "waitlist page", "redesign our homepage", "make our site look like Stripe or Linear", "site for my coffee brand / SaaS / studio". Says which foundations and domain references to load in what order, what done looks like, and the signature moves the marketing exemplars share. Not for app screens or dashboards (design-playbook-dashboard), native apps (design-playbook-mobile) or a brand system without a site (design-playbook-brand).
---

# design-playbook-landing

A landing page has one job: make the right visitor understand the offer and take one action. Everything below serves that.

## 1. Load in this order
1. **design-foundations** (always): tokens, the 15-item gate, `references/accessibility.md`.
2. **website-strategy** if audience, positioning or competitors are not given. No visual decisions before this.
3. **Copy**, by the rule in section 2: design-copy `references/01-page-copy-structure.md` and `03-voice-and-tone.md`, or copywriting.
4. **design-layout**: `references/05-page-composition-and-density.md`, `01-grids-and-structure.md`, `04-responsive-and-adaptive.md`.
5. **design-typography**: `references/02-selection-pairing.md`, `01-scale-measure-leading.md`, `05-typographic-detail.md`.
6. **design-color**: `references/palette-building.md`, `ui-tokens-themes.md`.
7. **design-graphic**: `references/03-photography-direction.md`, `04-illustration.md`; then art direction and imagery (planned) for how to get usable images when image hosts are blocked.
8. **design-motion**: `references/01-purpose-restraint.md`, `04-micro-interactions.md`. Light touch.
9. **design-frontend**: build; `references/05-images-fonts.md` for LCP and font loading.
10. **design-search**: `references/02-on-page-content.md`, `03-structured-data.md`.
11. Visual polish (planned), then the self-critique loop in design-director.

A planned domain that is not built yet: apply the FOUNDATIONS defaults and say so in the hand-over.

## 2. Which copy skill
- **copywriting (direct response)** when the page sells in one sitting through a long argument: sales pages, long-form sales letters, VSL pages, advertorials, funnel steps (opt-in, order form, upsell), promo emails and ads. Pair with sales-funnels when the page is one step in a funnel.
- **design-copy** for premium product and brand sites, SaaS marketing sites, studio and portfolio sites, pricing pages, and every piece of UI text. Short, specific, calm. No hype stacks, countdowns or fake scarcity.
- Quick test: if the closest exemplar is on the marketing list in `kb/exemplars.md` (Stripe, Linear, Apple, Mercury and so on), it is not direct response. Use design-copy. (Opinion; the exemplar teams write this way.)
- Mixed case (a paid-ads landing page for a premium brand): structure from copywriting's awareness levels, voice and sentence craft from design-copy.

## 3. Non-negotiables for this job
1. One primary action per view, the same verb everywhere it appears.
2. The hero says what it is, for whom, and why now, in the visible first screen at 390px and 1440px.
3. Proof sits next to the claim it proves.
4. Real content and real product imagery; never lorem ipsum, never a generic stock hero.
5. Light and dark designed when asked; every section passes the gate in both.

## 4. Done means
1. `node tools/lint.mjs page.html` exits 0.
2. `node tools/render.mjs page.html out/` and every `[judged]` row holds on the screenshots.
3. Side by side with the named closest exemplars, rated close (not clearly below) on hierarchy, type, imagery, rhythm and craft. Pick them from `references/signature-moves.md` by site type.
4. The hand-over names what is still short of the exemplar.

## 5. Reference map
| Need | Read |
|---|---|
| Closest exemplar by site type, and the moves the marketing exemplars share | `references/signature-moves.md` |
| Section order for common landing page types | design-copy `references/01-page-copy-structure.md`, design-layout `references/05-page-composition-and-density.md` |
