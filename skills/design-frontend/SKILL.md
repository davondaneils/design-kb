---
name: design-frontend
description: Front-end build quality for websites and web apps - semantic HTML, modern CSS (design tokens, cascade layers, container queries, logical properties, fluid type, light and dark themes), WCAG 2.2 AA implementation, Core Web Vitals and performance budgets, responsive images and web fonts, and design-to-code fidelity, with notes for React, Next.js and Tailwind v4. Use whenever Claude writes, reviews or fixes HTML, CSS or UI components, builds a landing page, site, dashboard or artifact from a design or brief, converts Figma to code, sets up tokens or a theme switch, audits accessibility (focus, contrast, targets, forms, screen readers, keyboard), or fixes slow LCP, INP or CLS. Triggers include "build this page", "code this design", "make it accessible", "WCAG", "a11y audit", "Lighthouse", "Core Web Vitals", "page is slow", "layout shift", "dark mode", "design tokens", "Tailwind", "Next.js image", "font loading", "srcset", "container queries", "responsive". Not for choosing palettes, typefaces, layouts or copy themselves (use the other design-kb skills).
---

# design-frontend

The build layer of design-kb. Every visual decision from design-color, design-typography, design-layout, design-graphic, design-ux and design-motion ends up here as HTML and CSS. This skill makes that code correct, accessible, fast and faithful to the design, at the level a top product studio ships.

All defaults follow the design-kb foundation contract (spacing, type, color roles, breakpoints, radius, motion, accessibility floor). Deviate only with a stated reason.

## 1. Fundamentals gate (non-negotiable; check these first, every time)

A build that misses any of these fails, however good the rest is.

**Markup**
1. `<html lang>`, `<meta charset>`, a unique `<title>` (page first, brand last), `<meta name="viewport" content="width=device-width, initial-scale=1">`. Never `user-scalable=no` or `maximum-scale=1`.
2. One `<main>`, landmarks (`header`, `nav` with `aria-label` when there are several, `footer`), a skip link to `main`.
3. One `h1`; heading levels follow structure, not font size. Size is a class.
4. Navigation is `<a href>`; actions are `<button type="button">`; submits are `<button type="submit">` in a `<form>`. Never a click handler on a `div` or `span`.
5. Every input has a visible `<label>`; radios and checkboxes sit in `<fieldset><legend>`; personal data fields carry `autocomplete`.
6. Every image has `alt` (empty for decoration); icon-only buttons have an accessible name; decorative SVGs are `aria-hidden="true"`.
7. Native before ARIA: `<dialog>`, `popover`, `<details>`, `inert`, real inputs. If you add a `role`, you own its full keyboard pattern.

**Accessibility floor (WCAG 2.2 AA)**
8. Contrast 4.5:1 for body text, 3:1 for large text (24px, or 18.66px bold), UI boundaries, states and focus indicators, in light and dark themes.
9. Visible `:focus-visible` outline (2px minimum, 3:1), never hidden by sticky headers or banners (`scroll-padding-block-start`). No `outline: none` without a replacement.
10. Targets at least 24 by 24 CSS px; 44 by 44 for primary touch controls.
11. Everything works by keyboard; Esc closes overlays; focus returns to the trigger; DOM order matches visual order.
12. Never color alone (links in text are underlined; errors have text and icon).
13. Text reaches 200% zoom and reflows at 320px wide with no horizontal page scroll; no fixed heights on text containers.
14. Errors are identified in text, linked by `aria-describedby`, and focus moves to the first invalid field on submit. Paste is never blocked.
15. Motion respects `prefers-reduced-motion`; anything moving more than 5 seconds can be paused.

**CSS**
16. Tokens only: no raw hex, px spacing or durations inside components. Names follow `--{category}-{role}-{variant}`.
17. Root font size stays 100%. Type in `rem`. No `62.5%` trick.
18. Logical properties by default (`margin-inline`, `padding-block`, `inset-inline-start`, `text-align: start`).
19. Animate only `transform` and `opacity`; never `transition: all`.

**Performance**
20. The LCP image is an `<img>` in the HTML with `fetchpriority="high"`, never `loading="lazy"`, never a CSS background.
21. Every `<img>` and `<video>` has `width` and `height` (or `aspect-ratio`); embeds and ads get reserved slots.
22. No sync scripts in `<head>` above CSS; scripts `defer` or `type="module"`.
23. Targets at p75 mobile: LCP 2.5s or less, INP 200ms or less, CLS 0.1 or less.

## 2. Defaults (from the foundation contract)

| Category | Default |
|---|---|
| Spacing | 4px base: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (`--space-0` to `--space-11`). Component padding 4 to 24; layout gaps 16 and up. |
| Type | Root 16px, ratio 1.25: 12, 14, 16, 20, 25, 31, 39, 49, 61 (`--text-xs` to `--text-5xl`). Body line-height 1.5, headings 1.1 to 1.25, measure 45 to 75ch (66 ideal). Fluid `clamp()` only for 3xl and up. |
| Color roles | `--color-bg, -surface, -surface-raised, -text, -text-muted, -border, -primary, -on-primary, -accent, -success, -warning, -danger, -info, -focus-ring`, each a `light-dark()` pair over 50 to 950 primitives. |
| Breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536, mobile first, written in em (40em, 48em, 64em, 80em, 96em). Container queries for components. |
| Radius | 0, 4, 8, 12, 16, full (`--radius-none, -sm, -md, -lg, -xl, -full`). |
| Elevation | 0 to 4 shadow levels; dark themes raise surfaces instead of deepening shadows. |
| Motion | `--duration-instant` 100ms, `-fast` 150ms, `-base` 200ms, `-slow` 300ms, `-page` 400ms; easing `--ease-standard cubic-bezier(0.2,0,0,1)`, `--ease-enter cubic-bezier(0,0,0,1)`, `--ease-exit cubic-bezier(0.3,0,1,1)`. |
| Layers | `@layer reset, vendor, tokens, base, layout, components, utilities;` |

Full token file, reset and theme switch: `references/02-modern-css.md`.

## 3. Decision rules

| Situation | Do |
|---|---|
| Component must work in different column widths | `container: name / inline-size` on its wrapper and `@container`; the wrapper needs a definite width from its parent |
| Page-level layout change | media query in em, mobile first |
| Display headline should scale | `clamp(min rem, a rem + b vw, max rem)` with max at most 2.5 x min; test 200% and 400% zoom |
| Theme support | `color-scheme: light dark` on `:root`, `light-dark()` tokens, `data-theme` override, inline head script to avoid a flash |
| Third-party CSS fights you | `@import url(x.css) layer(vendor)`; never raise specificity or add `!important` |
| Menu, dropdown, tooltip-like panel | `popover` + `popovertarget`; anchor positioning with a static fallback |
| Blocking question | `<dialog>` with `showModal()`, `autofocus` on the likely action, explicit close button |
| Hover effects | inside `@media (hover: hover) and (pointer: fine)` |
| Hero height on mobile | `min-height: 100svh`, not `100vh` |
| Responsive image | `srcset` w-descriptors + `sizes` computed from the grid CSS; lazy images can use `sizes="auto, <fallback list>"` |
| Animated asset | `<video autoplay muted loop playsinline>` with poster, never GIF |
| Web font | WOFF2, subset, `font-display: swap` with a metric-matched fallback (or `optional` for non-brand body text); preload at most 2 files |
| Slow interaction | update the visible state first, then `await scheduler.yield()` (with `setTimeout` fallback), then heavy work |
| Long page of repeated sections | `content-visibility: auto; contain-intrinsic-size: auto 500px` |
| Multi-page site navigation speed | speculation rules `prerender` with `moderate` eagerness, excluding side-effect URLs |
| Status message ("Saved", "3 results") | `role="status"` region present in the initial DOM |

## 4. Expert moves (what separates top-studio work)

1. **Diagnose LCP by subpart.** TTFB about 40%, resource load delay under 10%, load duration about 40%, render delay under 10%. Slow image heroes are usually late discovery (load delay), not file size: fix discovery before compressing.
2. **Fluid type that survives zoom.** `vw` ignores browser zoom; a rem + vw middle term with max at most 2.5 x min keeps WCAG 1.4.4. Body text stays fixed rem.
3. **Focus rings that survive Windows contrast themes.** Outlines persist in forced colors; box-shadows vanish. Use `outline` as the indicator, a box-shadow only as the second tone. Add `outline: 2px solid transparent` to custom controls whose shape is only a background. Meeting AAA 2.4.13 costs one line, so meet it.
4. **Cascade layers as the specificity firewall.** Vendor CSS in a low layer; unlayered CSS beats every layer; `!important` inverts layer order. No specificity wars, ever.
5. **Container query trap.** An `inline-size` container cannot size from its content; in an auto grid track or a basis-less flex item it collapses. Give it a definite width.
6. **Metric-matched fallback fonts.** `size-adjust` plus `ascent-`, `descent-`, `line-gap-override` make the swap invisible, which removes font CLS while keeping `swap`. next/font and Fontaine automate it. Android has no Arial; add a Roboto fallback face.
7. **`sizes` is maths, not a guess.** Derive it from columns, gaps, gutters and the container cap. `sizes="100vw"` on a 3-column grid ships images about 3 times too wide.
8. **Yield after paint, not before.** Visible feedback first, `scheduler.yield()` second, heavy work third. `scheduler.yield` continuations jump the queue; `setTimeout` does not.
9. **bfcache is free speed.** No `unload` listeners, no blanket `Cache-Control: no-store`; back and forward become instant and restored loads reset CLS.
10. **Sticky UI vs focus.** `scroll-padding-block-start` and `-end` equal to sticky header and bottom bar heights satisfy 2.4.11 without JS.
11. **Native top-layer UI.** `dialog`, `popover` and anchor positioning remove z-index bugs, focus-trap libraries and click-outside code.
12. **Hover only where hover exists.** `(hover: hover) and (pointer: fine)` stops sticky hover states on touch.
13. **Craft finish.** Concentric radii (inner = outer minus padding), `tabular-nums` on changing numbers, `text-wrap: balance` on headings and `pretty` on paragraphs, `&nbsp;` between number and unit, `touch-action: manipulation` on controls, loading buttons keep their label.

## 5. How to work

**When building**
1. Read the design or brief; list the landmarks, heading outline and components before writing CSS.
2. Write tokens (or map the project's) to the foundation names.
3. Build components with the full state matrix (`references/06-design-to-code.md`).
4. Identify the LCP element and every image's slot; set priority, `sizes`, dimensions.
5. Run the fundamentals gate (section 1) as a checklist, then the stress tests in reference 06.

**When reviewing or auditing**
Report in this order: fundamentals failures (each with the WCAG SC or metric it breaks and the exact fix), then expert-level improvements, then nice-to-haves. Give code, not adjectives.

**What to deliver with code**
A short note listing: the LCP element and how it is prioritized, the token source, any deviation from the foundation and why, any feature used that is not Baseline widely available and its fallback, and what still needs manual testing (screen reader, forced colors).

## 6. Reference map

| Need | Read |
|---|---|
| Element choice, head order, forms, dialog and popover recipes | `references/01-semantic-html.md` |
| Token file, layers, container queries, fluid type maths, theming, reset, Baseline table, forced colors | `references/02-modern-css.md` |
| WCAG 2.2 AA checklist for code, focus, targets, live regions, testing protocol, legal context | `references/03-accessibility.md` |
| Core Web Vitals thresholds, LCP subparts, INP yielding, CLS, bfcache, speculation rules, budgets, measuring | `references/04-performance.md` |
| Image formats, srcset and sizes maths, lazy loading, font loading and fallback metrics | `references/05-images-fonts.md` |
| Token mapping from Figma, state matrix, stress tests, craft details, React/Next, Tailwind v4, QA checklist | `references/06-design-to-code.md` |

## 7. Related skills

- design-color (palettes, contrast pairs), design-typography (faces, scale, measure), design-layout (grids, spacing, hierarchy), design-graphic (imagery, icons), design-ux (patterns and flows), design-motion (durations, easing, choreography), design-copy (UI text, errors, alt text), design-search (meta, structured data, crawlability).
- website-strategy for positioning and discovery, copywriting for persuasion copy, sales-funnels for conversion paths. This skill builds what they decide.

## 8. Freshness

Browser support moves monthly. Status in this skill is as of October 2026. Before relying on anything in the "use with fallback" or "enhancement only" columns of reference 02, check MDN or webstatus.dev. Review interval: 3 months.
