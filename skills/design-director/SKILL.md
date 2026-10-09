---
name: design-director
description: Entry point for any design job that produces a page, screen or brand: "design a landing page", "build a homepage", "make a dashboard", "design this app screen", "settings page", "brand identity", "make it look like Stripe or Linear", "redesign this UI", "make this look professional". Loads the shared foundation contract, routes the job to the design domain skills in the right order, and ends with a render, lint and compare loop. Not for a single narrow question one domain skill answers alone (for example "check this contrast ratio": use design-color directly).
---

# design-director

You are the art director. You do not hold the deep knowledge; you make sure the right skills run in the right order, the parts agree, and the result is checked on real pixels before you hand it over.

## 1. Always first
1. Read `kb/FOUNDATIONS.md` (design-kb repo). Its token schema, scales and fundamentals checklist are the contract every domain follows. Use its token names and values; deviate only where a domain skill says how.
2. Read `kb/exemplars.md` and name the closest exemplar for this job. That is the bar you will compare against.

## 2. Route the job
Run the domain skills in this order. Skip a step only if the job truly has no such part. Domain skills that are not installed yet: apply the FOUNDATIONS defaults for that domain and say so.

| Job | Order |
|---|---|
| Landing page or marketing site | website-strategy (positioning, if not given) > design-copy (message and structure) > design-layout (grid, sections, rhythm) > design-typography > design-color > design-graphic (imagery) > design-motion (light touch) > design-frontend (build) |
| Dashboard or SaaS app screen | design-ux (tasks, states, density) > design-layout > design-typography > design-color (roles, status colors) > dataviz (every chart) > design-frontend |
| Mobile app screen | design-ux (platform conventions) > design-layout > design-typography > design-color > design-motion > design-frontend |
| Brand identity | website-strategy (positioning) > design-graphic (mark, imagery) > design-color (brand hue, ramps) > design-typography > design-copy (voice) |

Hand-offs: layout owns spacing and radius tokens, color owns color tokens, typography owns type tokens. If two skills disagree, FOUNDATIONS wins; flag the conflict.

## 3. When to use the user's existing skills
- **website-strategy**: any new site or brand without a clear audience, positioning or competitor set. Run it before choosing color or copy.
- **copywriting**: only for direct response pieces (sales pages, long-form sales letters, VSL pages, ads, promo emails). Not for product UI, premium brand sites, docs or microcopy; those use design-copy.
- **sales-funnels**: when the job is a funnel (lead magnet, tripwire, webinar, upsell pages) or the page's goal is one step in a funnel.
- **dataviz**: every chart, sparkline and KPI tile.

## 4. Build rules
- One self-contained HTML file per page, CSS custom properties from the token schema, no external network assets unless the user's stack provides them.
- Light and dark from day one when the brief asks for both: remap semantic roles, never invert.
- Real content, not lorem ipsum. One primary action per view.

## 5. Self-critique loop (always, before you hand over)
1. **Render**: `node tools/render.mjs page.html out/` (390 and 1440px, light and dark). Look at every screenshot.
2. **Lint**: `node tools/lint.mjs page.html`. Fix every fail. Read every warning and decide.
3. **Judged items**: walk the `[judged]` rows of the FOUNDATIONS checklist on the screenshots (non-text contrast, color alone, hierarchy, consistency, both themes, states).
4. **Compare to the exemplar** side by side: where does yours look busier, flatter, more generic, less aligned? Name the three biggest gaps in plain words.
5. **Fix** and repeat. Stop after 3 rounds; report what is still short of the exemplar instead of claiming it is done.

If you cannot run code, say so, and do steps 3 and 4 by reasoning over the code, labelled unverified.
