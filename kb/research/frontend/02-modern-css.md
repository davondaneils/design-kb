# Research 02: Modern CSS architecture and tokens

Researched 2026-10-09. Status key: C = consensus or standard, P = practitioner opinion, V = verify (fast moving).

## Key findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | `@layer`: first declared layer has lowest priority; specificity is ignored across layers; unlayered normal styles beat all layered normal styles; for `!important` the order inverts. Baseline widely available since March 2022. | MDN `@layer` | C |
| 2 | Tailwind v4 uses native layers `theme, base, components, utilities`, CSS-first `@theme` config that emits tokens as custom properties, an oklch palette, built-in container queries, and logical property utilities (`mx-6` emits `margin-inline`). | Tailwind CSS v4 blog | C |
| 3 | Tailwind v4 targets Chrome 111, Safari 16.4, Firefox 128. | Tailwind compatibility docs | C |
| 4 | Container queries: `container-type: inline-size` queries width only; `cq*` units fall back to small viewport units if no container exists. | MDN Container queries | C |
| 5 | Container style queries are an Interop 2026 focus area, so not yet safe everywhere. | web.dev Interop 2026 | V |
| 6 | `@scope` became Baseline newly available in December 2025. | web.dev, New to the web platform, December 2025; Frontend Masters | V |
| 7 | `color-scheme: light dark` plus `light-dark()` gives two-value color tokens; a manual override sets `color-scheme` from a data attribute. `@property` with `syntax: '<color>'` gives a typed fallback and makes the token animatable. | web.dev, Baseline in action: color theme | C |
| 8 | `<image>` values inside `light-dark()` became Baseline newly available in September 2026. | web.dev, September 2026 | V |
| 9 | vw text does not grow with browser zoom; a clamp max can make 200% unreachable (WCAG 1.4.4 failure). Keep root at 100%, use rem, keep max at least 2x base or test. | Adrian Roselli, Responsive type and zoom | P (expert, test-backed) |
| 10 | In `clamp(min, preferred, max)` with a rem + vw preferred value, max must be at most 2.5 x min to guarantee 200% text resize. | Maxwell Barvian, Smashing Magazine 2023 | P (derived from WCAG maths) |
| 11 | Utopia: interpolate between a small-screen and a large-screen type scale (tool defaults around 360px to 1240px, ratios 1.2 to 1.25). | Utopia (Clearleft) | P |
| 12 | Modern reset: `box-sizing: border-box`; `margin: 0` except `dialog`; `interpolate-size: allow-keywords` inside a reduced-motion guard (Chromium only); body line-height 1.5; media `display: block; max-width: 100%`; `font: inherit` on controls; `overflow-wrap: break-word`; `text-wrap: pretty` on p and `balance` on headings; app root `isolation: isolate`. | Josh W. Comeau, A modern CSS reset | P |
| 13 | Never use `transition: all`; animate transform and opacity. | Vercel Web Interface Guidelines | P |
| 14 | Nested radii: child radius at or below parent radius and concentric. | Vercel Web Interface Guidelines | P |

## Conflicting views
- APCA vs WCAG 2 contrast: Vercel prefers APCA. WCAG 2.2 ratios are the legal and design-kb floor. Resolution: pass WCAG 2.2 first; APCA is an optional second check (opinion).
- Fluid type: Barvian's "max at most 2.5x min" vs Roselli's "max at least 2x base, and test". Both require zoom testing.

## Sources
- MDN `@layer`: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- Tailwind CSS v4.0: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind compatibility: https://tailwindcss.com/docs/compatibility
- MDN Container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- web.dev Interop 2026: https://web.dev/blog/interop-2026
- web.dev December 2025: https://web.dev/blog/web-platform-12-2025
- Frontend Masters, How to @scope CSS now that it's Baseline: https://frontendmasters.com/blog/how-to-scope-css-now-that-its-baseline/
- web.dev Baseline in action, color theme: https://web.dev/articles/baseline-in-action-color-theme
- web.dev September 2026: https://web.dev/blog/web-platform-09-2026
- Adrian Roselli, Responsive type and zoom: https://adrianroselli.com/2019/12/responsive-type-and-zoom.html
- Maxwell Barvian, Addressing accessibility concerns with using fluid type: https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/
- Utopia: https://utopia.fyi/blog/designing-with-fluid-type-scales/
- Josh W. Comeau, A modern CSS reset: https://www.joshwcomeau.com/css/custom-css-reset/
- Vercel Web Interface Guidelines: https://vercel.com/design/guidelines
