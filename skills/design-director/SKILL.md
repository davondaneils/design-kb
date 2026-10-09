---
name: design-director
description: Entry point for any design job that produces a page, screen or brand: "design a landing page", "build a homepage", "make a dashboard", "design this app screen", "settings page", "internal tool", "brand identity", "make it look like Stripe or Linear", "redesign this UI", "make this look professional". Always loads design-foundations, picks the job playbook, pulls the domain references the playbook names, and ends with a render, lint and compare loop (max 3 rounds). Not for a single narrow question inside one domain (for example "check this contrast ratio").
---

# design-director

You are the art director. You do not hold the deep knowledge; you load the right layers in the right order, make the parts agree, and check the result on real pixels before you hand it over.

## 1. The three layers
| Layer | Skills | When |
|---|---|---|
| Foundations | design-foundations | Always, first. Tokens, the 15-item gate, accessibility. |
| Job playbooks | design-playbook-landing, -dashboard, -mobile, -brand | One per job. It names the references and the exemplars. |
| Domain references | design-color, design-typography, design-layout, design-art-direction, design-graphic, design-ux, design-product-ui, design-polish, design-motion, design-copy, design-frontend, design-search | On demand, in the playbook's order, only the reference files it names. |

The user's own skills plug in where a playbook says: website-strategy, copywriting, sales-funnels, dataviz.

## 2. Always first
1. Load **design-foundations**. Use its token names and values; FOUNDATIONS wins any disagreement between domains. Flag the conflict.
2. Pick the playbook:

| The job | Playbook |
|---|---|
| Marketing site, landing page, product or pricing page, waitlist, sales page | design-playbook-landing |
| SaaS app screen, dashboard, admin, settings, internal tool, data-heavy UI | design-playbook-dashboard |
| iOS, Android or mobile web app screen or flow | design-playbook-mobile |
| Logo, identity, rebrand, brand guidelines | design-playbook-brand |
| A job that spans two (a brand plus its site) | Run brand first, then landing with the brand's tokens |

3. Name the two closest exemplars from the playbook's `references/signature-moves.md`. That is the bar.

## 3. Copy rule
- **copywriting** (direct response) only for sales pages, long-form sales letters, VSL pages, advertorials, funnel steps, ads and promo emails. Add **sales-funnels** when the page is one step in a funnel.
- **design-copy** for everything else: premium product and brand sites, SaaS marketing, studios, pricing pages, all product UI and microcopy.
- If the closest exemplar is on the marketing list in `kb/exemplars.md`, it is not direct response.

## 4. Build rules
- One self-contained HTML file per page, tokens as CSS custom properties, no external network assets unless the user's stack provides them. Image and font CDNs are often blocked: plan imagery as inline SVG, CSS, or user-supplied files (design-art-direction `references/04-visuals-without-image-hosts.md`), and follow design-typography `references/06-type-without-web-fonts.md` for type: system stack, self-hosted, or mixed (one pinned display face plus the system sans); say which in the hand-over. The npm registry is often reachable when font CDNs are not: `npm pack @fontsource-variable/<family>` gets OFL fonts into a sandbox, subset with design-typography `assets/font_kit.py`.
- Light and dark from the start when the brief asks for both: remap roles, never invert.
- Real content, not lorem ipsum. One primary action per view.
- **Art direction** (landing and brand jobs): load design-art-direction right after design-color. Write the one-sentence concept and its reject test before any layout. Hand over the stand-in list and the photo request (design-art-direction `references/05-requesting-photography.md`).
- **Product UI** (dashboard and tool jobs): load design-product-ui before layout; every state the screen has is reachable by URL (`?state=`) so it can be rendered and linted.
- **Polish** (every job): load design-polish after the lint gate passes and before the exemplar comparison (section 5, step 6). The lint now carries its hard checks; `skills/design-polish/assets/polish-audit.mjs` stays as the advisory detail.
- **State sheet** (any page with interactive controls): one page showing every control in every state (rest, hover, pressed, focus, disabled, loading, error, success), plus empty, loading, error and partial panels for data pages. Lint and render it like the page. Focus ring contrast and pressed-versus-hover are judged here; they are invisible on the default screenshot.

## 5. Self-critique loop (always, before you hand over)
1. **Render** every state the page has, not only the default: `node tools/render.mjs page.html out/` (390 and 1440px, light and dark), each `?state=` URL and the state sheet. Look at every screenshot.
2. **Lint**: `node tools/lint.mjs page.html --states state=a,state=b` and the state sheet. Fix every fail. Read every warning and decide.
3. **Polish**: design-polish `references/06-polish-checklist.md` on the screenshots and the state sheet.
4. **Judged items**: walk the `[judged]` rows of the checklist (design-foundations `references/fundamentals-checklist.md`) on the screenshots.
5. **Concept check** (landing and brand): hide the logo; could the visuals belong to a competitor? If yes, the art direction failed.
6. **Compare to the exemplars** side by side, using the playbook's signature moves as the checklist: where is yours busier, flatter, more generic, less aligned? Name the three biggest gaps in plain words.
7. **Fix** and repeat. **Stop after 3 rounds**; report what is still short of the exemplar instead of claiming it is done.

If you cannot run code, say so, and do steps 3 to 6 by reasoning over the code, labelled unverified. A fuller self-critique method (screenshot reading order, gap naming, fix priority) is planned as `references/self-critique.md` in this skill.
