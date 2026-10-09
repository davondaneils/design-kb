# 06 Design-to-code fidelity, React/Next and Tailwind

Sources: kb/research/frontend/06-design-to-code.md. Much of this chapter is studio practice and is marked (opinion).

## Principles
1. Fidelity means intent, not pixels. Match the design's tokens, rhythm, states and behaviour; then make it survive real content, zoom, languages and themes, which the mock never showed (opinion).
2. A component is not done until every state exists. The mock shows one state; production has about ten (opinion).
3. Tokens first, components second, pages last. Hard-coded values in a component are bugs (foundation contract).
4. The finish is in the details: optical alignment, tabular numbers, balanced headings, concentric radii. Top teams sweat these (Vercel Web Interface Guidelines, practitioner).

## Token mapping
- Figma variables map 1:1 to CSS custom properties using the foundation naming `--{category}-{role}-{variant}`: `color/text/muted` becomes `--color-text-muted`.
- If the design uses a value not on the scale (13px padding, #1F2A37 text), do not invent a token. Snap to the nearest token and flag it to the designer. Off-scale values are almost always accidents (opinion).
- Light and dark modes in Figma map to the `light-dark()` pair on the same semantic token (chapter 02).

## The state matrix (every interactive component)
| State | Check |
|---|---|
| default, hover, active (pressed) | hover only under `@media (hover: hover)` |
| focus-visible | 2px+ outline, 3:1, not obscured |
| disabled | still readable; prefer `aria-disabled` plus explanation when users need to know why |
| loading | label stays, spinner beside it, width does not jump |
| error, success | text plus icon, not color alone |
| empty | designed empty state with next action |
| selected / current | `aria-current="page"` for nav, `aria-selected` / `aria-pressed` as the pattern requires |
| skeleton | delay 150 to 300ms before showing, keep at least 300 to 500ms once shown (Vercel, practitioner) |
| overflow | long names, 3-line titles, 7-digit numbers |
| RTL and forced colors | logical properties hold; boundaries visible |

## Content stress test (run before calling a build done)
1. Longest real string: German or Finnish translations run about 30% longer than English (opinion, common localization guidance). Paste a 40-character word into titles and buttons.
2. Zero, one and 10,000 items.
3. 200% zoom and 320px width (WCAG 1.4.4, 1.4.10).
4. Text spacing override (1.4.12).
5. Dark mode, forced colors, reduced motion.
6. Slow 4G with CPU throttle: does the layout shift while loading?
7. Ultra-wide: zoom the browser to 50% to simulate a 2560px+ screen (Vercel, practitioner).

## Craft details (practitioner, Vercel Web Interface Guidelines unless noted)
- Concentric radii: inner radius = outer radius minus the padding between them. A 16px card with 8px padding holds an 8px-radius image (`--radius-xl` outer, `--radius-md` inner).
- `font-variant-numeric: tabular-nums` on any column of numbers or changing value.
- `text-wrap: balance` on headings, `pretty` on paragraphs (Comeau reset).
- Typographic punctuation: `…` and curly quotes in UI copy; `&nbsp;` between number and unit (`10&nbsp;MB`).
- `scroll-margin-top` on anchor targets under a sticky header.
- `touch-action: manipulation` on controls to remove the double-tap zoom delay.
- Safe areas: `padding-inline: max(var(--space-5), env(safe-area-inset-left))` for full-bleed mobile layouts; needs `viewport-fit=cover`.
- Layered shadows (ambient plus key) look real; a single heavy shadow looks cheap (opinion). In dark mode, raise surfaces instead (foundation contract).
- Optical alignment: icons and play triangles often need a 1px nudge; trust the eye over the bounding box.
- Never `transition: all`; list the properties.

## React and Next.js
- Semantics survive frameworks only if you keep them: `<Link>` for navigation, `<button>` for actions, no `onClick` on `div`. Lint with `eslint-plugin-jsx-a11y` (opinion: standard React tooling).
- Route changes: move focus to the new `h1` (with `tabindex="-1"`) and update the title. Next.js ships a route announcer, but its behaviour varies by version (V), so keep the focus move as the default and test with a screen reader.
- IDs: `useId()` for label and `aria-describedby` wiring; never hard-coded IDs in reusable components.
- Server Components by default, client components only where interaction lives; that is the biggest JS budget lever in Next (opinion).
- `next/image`: always pass `sizes` for responsive images (otherwise the srcset assumes full-width or fixed); for the LCP image use `fetchPriority="high"` (or `preload` when it must be in the head; `priority` is deprecated since Next.js 16). Default quality is 75 (Next.js docs).
- `next/font`: self-hosts and applies `size-adjust` fallback metrics automatically; use the `variable` option to expose a CSS custom property and wire it into `--font-*` tokens.

## Tailwind v4
- Configure in CSS with `@theme`. Override the default type scale to match the foundation (Tailwind's defaults differ: `text-lg` is 18px there, 20px here):
```css
@import "tailwindcss";
@theme {
  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.25rem;  --text-xl: 1.5625rem; --text-2xl: 1.9375rem;
  --text-3xl: clamp(1.5625rem, 1.2201rem + 1.5217vw, 2.4375rem);
  --text-4xl: clamp(1.9375rem, 1.4973rem + 1.9565vw, 3.0625rem);
  --text-5xl: clamp(2.4375rem, 1.8995rem + 2.3913vw, 3.8125rem);
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px;
  /* Semantic colors declared here directly, so Tailwind emits them on :root
     and generates bg-bg, bg-surface, text-text-muted, border-border, ring-focus-ring */
  --color-bg:         light-dark(var(--neutral-50),  var(--neutral-950));
  --color-surface:    light-dark(var(--white),       var(--neutral-900));
  --color-text:       light-dark(var(--neutral-900), var(--neutral-50));
  --color-text-muted: light-dark(var(--neutral-600), var(--neutral-400));
  --color-primary:    light-dark(var(--blue-600),    var(--blue-400));
  /* ...remaining roles as in reference 02 */
}
:root { color-scheme: light dark; }
```
- Never write `--color-bg: var(--color-bg)` to "map" an existing token: a custom property referencing itself is a cycle and becomes invalid. Either declare the value in `@theme`, or keep your own token under a different name and use `@theme inline { --color-bg: var(--app-bg); }`.
- Tailwind's default palette names (`--color-blue-600`) can serve as the primitive layer if the project has no design-color palette; semantic roles still reference them.
- Spacing: Tailwind's `--spacing: 0.25rem` multiplier already yields the foundation pixel values (`p-1` 4px, `p-2` 8px, `p-3` 12px, `p-4` 16px, `p-6` 24px, `p-8` 32px, `p-12` 48px, `p-16` 64px, `p-24` 96px, `p-32` 128px, `p-0.5` 2px). Use only those steps; ban others in review. Note that Tailwind `p-4` is 16px while the foundation index token `--space-4` is 12px: in Tailwind projects, talk in pixel values, not index numbers.
- Container queries: `@container` on the wrapper, `@md:` variants on children.
- Use logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`) instead of `ml-*`/`left-*`.
- Compose variants with a small helper (`cva` or `tailwind-variants`) and merge conflicts with `tailwind-merge` (opinion: common practice); never string-concatenate conflicting utilities.
- Browser floor: Chrome 111, Safari 16.4, Firefox 128 (Tailwind docs). If you must support older, stay on v3.

## Pre-ship QA checklist
1. HTML validates landmarks and headings; no `div` buttons.
2. Every value is a token; no off-scale numbers.
3. State matrix complete for each component.
4. Stress tests 1 to 7 pass.
5. Accessibility protocol from chapter 03 passes.
6. Core Web Vitals lab check under budget; LCP element identified and prioritized.
7. Visual regression snapshots (Playwright or Storybook with Chromatic) in light and dark at 375, 768 and 1280 widths (opinion).

## Worked examples
1. Figma pricing cards in Next.js and Tailwind. Three cards, middle highlighted. Tokens via `@theme`; card `rounded-xl p-6` (16px radius, 24px padding). A plan image flush to the card's inner edge would need 16 - 24, which is below zero, so it gets `rounded-none`; with `p-2` (8px) padding it would get 8px. The CTA button floats inside the padding, so the concentric rule does not apply and it takes its own token, `rounded-md` (8px). Price uses `tabular-nums` and the toggle is a radio group (chapter 01). Highlighted card uses a 2px border in `--color-primary` plus a "Most popular" text badge, so the emphasis is not color alone. Container query switches cards from stacked to row at 48em container width.
2. Static landing mock to semantic HTML/CSS. Identify landmarks first, then the heading outline from the content (not from the font sizes), then tokens, then components. Hero image becomes the LCP `<img>` with `fetchpriority="high"`. Testimonials carousel becomes a horizontally scrolling list with `scroll-snap` and visible buttons (no autoplay).

## Hand-offs
- Visual decisions (palette, type, layout grid, imagery): design-color, design-typography, design-layout, design-graphic.
- Interaction flows and patterns: design-ux. Motion specs: design-motion.
- Copy on buttons, errors and empty states: design-copy; persuasion copy: copywriting; conversion flow: sales-funnels.
- Data fetching, auth and API shape behind the UI: engineering, out of scope for design-kb. Meta, structured data and rendering for crawlers: design-search.
