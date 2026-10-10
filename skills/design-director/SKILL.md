---
name: design-director
description: Entry point for any design job that produces a page, screen or brand: "design a landing page", "build a homepage", "make a dashboard", "design this app screen", "settings page", "internal tool", "brand identity", "make it look like Stripe or Linear", "redesign this UI", "make this look professional". Always loads design-foundations, picks the job playbook, pulls the domain references the playbook names, and ends with a render, lint, fact, search and exemplar loop (max 3 rounds). Not for a single narrow question inside one domain (for example "check this contrast ratio").
---

# design-director

You are the art director. You do not hold the deep knowledge; you load the right layers in the right order, make the parts agree, and check the result on real pixels before you hand it over.

## 1. The three layers
| Layer | Skills | When |
|---|---|---|
| Foundations | design-foundations | Always, first. Tokens, the 16-item gate, accessibility, content mechanics. |
| Job playbooks | design-playbook-landing, -dashboard, -mobile, -brand | One per job. It names the references and the exemplars. |
| Domain references | design-color, design-typography, design-layout, design-art-direction, design-graphic, design-ux, design-product-ui, design-conversion, design-polish, design-motion, design-copy, design-frontend, design-search | On demand, in the playbook's order, only the reference files it names. |

What each reference is for, in one line:
| Reference | Load it for |
|---|---|
| design-color | palettes, contrast-locked ramps, semantic roles, light and dark |
| design-typography | faces, scale, measure, type without web fonts, type-led pages, typographic detail |
| design-layout | grids, spacing, hierarchy, responsive, density, flatplan and phone edit list (reference 06) |
| design-art-direction | concept sentence, imagery system, visuals without image hosts, text over art, photo requests |
| design-graphic | logos and favicons, icon sets (`assets/icon_audit.mjs`), illustration, social graphics, export |
| design-ux | the usability gate, navigation, forms, states, onboarding, notifications, purchase flows |
| design-product-ui | tables, filters, command palettes, settings, shells and density, panel states, dashboards |
| design-conversion | CTA hierarchy, proof, pricing, subscription terms, checkout, upgrade prompts (`assets/conversion-audit.mjs`) |
| design-polish | elevation, state layers, focus shape, borders, icon strokes, state sheets (`assets/polish-audit.mjs`) |
| design-motion | purpose, timing, choreography, micro-interactions, reduced motion, motion on real pages (`assets/motion-audit.mjs`) |
| design-copy | page structure, microcopy, voice, readability, copy in context (`assets/claims_inventory.mjs`) |
| design-frontend | semantic HTML, modern CSS, performance, images and fonts (`assets/css-audit.mjs`, `pixel-diff.mjs`, `vitals.mjs`, `weight.mjs`) |
| design-search | technical SEO, on-page, structured data, AI answers, the built-page gate (`assets/search-check.mjs`) |

The user's own skills plug in where a playbook says: website-strategy, copywriting, sales-funnels, dataviz. UI pattern examples (what the best shipped products do, linked): `kb/references/patterns/`.

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

3. Name the closest exemplars from `kb/teardowns/INDEX.md` table 1 (measured values) and the playbook's `references/signature-moves.md`. That is the bar. Defaults: landing pages against Stripe, then Linear, Vercel and Ramp; dashboards against the Linear app, then the Stripe and Vercel dashboards.

## 3. Copy rule
- **copywriting** (direct response) only for sales pages, long-form sales letters, VSL pages, advertorials, funnel steps, ads and promo emails. Add **sales-funnels** when the page is one step in a funnel.
- **design-copy** for everything else: premium product and brand sites, SaaS marketing, studios, pricing pages, all product UI and microcopy.
- Writing a sales landing page from scratch: design-copy for structure, slots, microcopy and review; copywriting for the long-form argument inside the slots (design-copy pipeline notes).
- If the closest exemplar is on the marketing list in `kb/exemplars.md`, it is not direct response.

## 4. Build rules
- One self-contained HTML file per test page, tokens as CSS custom properties, no external network assets unless the user's stack provides them. Image and font CDNs are often blocked: plan imagery as inline SVG, CSS, or user-supplied files (design-art-direction `references/04-visuals-without-image-hosts.md`), and follow design-typography `references/06-type-without-web-fonts.md` for type: system stack, self-hosted, or mixed (one pinned display face plus the system sans); say which in the hand-over. The npm registry is often reachable when font CDNs are not: `npm pack @fontsource-variable/<family>` gets OFL fonts into a sandbox, subset with design-typography `assets/font_kit.py`.
- **Self-contained is for test pages, not production apps.** Inlined base64 fonts suit a one-visit landing page; for an app with repeat visits they cost 220 to 290ms LCP and 62 percent more bytes on every view (design-frontend `references/07-measured-build-quality.md` finding 4). The build note states the production delivery: external hashed WOFF2 with `preload` for apps.
- Light and dark from the start when the brief asks for both: remap roles, never invert.
- The reset includes `[hidden] { display: none !important; }`: grid and flex rules otherwise override the attribute and hidden panels show (design-conversion test).
- Real content, not lorem ipsum. One primary action per view. Content mechanics from FOUNDATIONS (US 12-hour clock, weekday-checked dates, no breaks inside dates, prices and units).
- **Logo and favicon** (every page): the logo is outlined SVG from design-graphic (never live text), and every page ships a favicon (`<link rel="icon">`, a data URI on single-file pages, plus a PNG for Google Search). Favicon ink reaches 3:1 on light, gray and dark tab strips or sits on its own field (design-graphic `assets/tab_contrast.py`).
- **Social card and icons** (every public page): rendered from the page's own type and art at build time; the card is an art-directed asset (design-search `references/07-page-build.md`).
- **Flatplan before layout** for any page over four sections: each section's job, loudness and kind. Then the **phone edit list**: keep, reorder, crop, thumbnail, merge duplicate, shorten label, collapse, defer; never cut a unique fact (design-layout `references/06-pacing-signature-and-phone-editing.md`).
- **Art direction** (landing and brand jobs): load design-art-direction right after design-color. Write the one-sentence concept and its reject test before any layout. Hand over the stand-in list and the photo request (design-art-direction `references/05-requesting-photography.md`).
- **Product UI** (dashboard and tool jobs): load design-product-ui before layout; every state the screen has is reachable by URL (`?state=`) so it can be rendered and linted. App pages behind a login carry `noindex` (design-search `references/07-page-build.md`).
- **Conversion** (any page that sells: pricing, subscription, shop, checkout, upgrade): load design-conversion after layout, type, color and art direction, before polish.
- **Motion**: scripts read motion tokens from CSS (`getComputedStyle`); no millisecond literals in JS. Keyboard shortcuts never animate.
- **Modals**: announcements while a modal is open come from a live region inside the dialog; the page-level region is inert.
- **Polish** (every job): load design-polish after the lint gate passes and before the exemplar comparison. The lint carries its hard checks; `skills/design-polish/assets/polish-audit.mjs` stays as the advisory detail.
- **State sheet** (any page with interactive controls): one page showing every control in every state (rest, hover, pressed, focus, disabled, loading, error, success), plus empty, loading, error and partial panels for data pages. Mark it `<html data-lint-page="state-sheet">` (exempt from the one-primary check), then lint and render it like the page. Focus ring contrast and pressed-versus-hover are judged here; they are invisible on the default screenshot.
- **Build proof** (design-frontend): lint, `css-audit.mjs`, a pixel diff for any refactor, `vitals.mjs` and `weight.mjs`, with the numbers in the delivery note.

## 5. Self-critique loop (always, before you hand over)
1. **Render** every state the page has, not only the default: `node tools/render.mjs page.html out/ --widths 390,768,1024,1440` (light and dark), each `?state=` URL and the state sheet. Tablet failures (a 700px-tall image at 768, crowded art at 1024) are invisible at 390 and 1440. Render in-page states full page and dialog states with `--viewport-only`. Look at every screenshot.
2. **Lint**: `node tools/lint.mjs page.html --states state=a,state=b` and the state sheet. Fix every fail. Read every warning and decide.
3. **Fact check**: `node skills/design-copy/assets/claims_inventory.mjs page.html --year <year>`. It must exit 0 (wrong weekday, mixed clocks, relative dates in money copy); then tick every listed claim against its source (chart data, price list, log). Fluent copy is not checked copy: three false numbers once passed the critic, the tester and a blind rank.
4. **Search check**: `node skills/design-search/assets/search-check.mjs page.html` for a public page, `--expect private` for app screens behind a login. Fix every fail.
5. **Conversion audit** (any page that sells): `node skills/design-conversion/assets/conversion-audit.mjs page.html`, and each state URL with a price, form or plan.
6. **Icon audit** (any page with icons): `node skills/design-graphic/assets/icon_audit.mjs page.html`. The lint fails mixed caps and joins and hard-coded colors; the audit adds volume and blur.
7. **Film motion** (anything moves): write one scenario per user action and run `node skills/design-motion/assets/motion-audit.mjs <scenarios.mjs> <outdir>`; look at both rows of every strip. Keyboard paths get `expect: 'none'`. Screenshots are rendered with reduced motion, so they never show the motion itself.
8. **Pixel diff after any markup change** (a semantic pass, a `<time>` wrapper, a font-feature rule): `node skills/design-frontend/assets/pixel-diff.mjs before.html after.html --widths 390,768,1024,1440`. A 3px move in an H1 is invisible to the lint and obvious in a diff.
9. **Polish**: design-polish `references/06-polish-checklist.md` on the screenshots and the state sheet, with `polish-audit.mjs`.
10. **Judged items**: walk the `[judged]` rows of the checklist (design-foundations `references/fundamentals-checklist.md`) on the screenshots.
11. **Concept check** (landing and brand): hide the logo; could the visuals belong to a competitor? If yes, the art direction failed.
12. **Compare to the exemplars** side by side, using `kb/teardowns/INDEX.md` and the teardown's "Measured values" and "Borrow / Do not borrow" sections: compare numbers (type steps, tracking, line height, text contrast, radii, shadows, durations), not impressions. Landing: Stripe, Linear, Vercel, Ramp. Dashboard: Linear app, Stripe Dashboard, Vercel Dashboard. Never borrow the exemplar contrast failures the index lists (Raycast gray heading halves 3.75:1, Designjoy hero sub 2.44:1, Family colored eyebrows 2.2 to 3.6:1, Apple `#86868b` below large sizes, Notion's closing button 4.03:1); the gate still applies. Name the three biggest gaps in plain words.
13. **Fix** and repeat. **Stop after 3 rounds**; report what is still short of the exemplar instead of claiming it is done.

If you cannot run code, say so, and do steps 9 to 12 by reasoning over the code, labelled unverified. A fuller self-critique method (screenshot reading order, gap naming, fix priority) is planned as `references/self-critique.md` in this skill.
