# Research 06: Design-to-code fidelity and frameworks

Researched 2026-10-09. Status key: C = consensus or standard, P = practitioner opinion, V = verify (fast moving).

## Key findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Tailwind v4: tokens live in `@theme` and become CSS variables; spacing utilities derive from one `--spacing` variable (0.25rem default), so `p-3` is 12px and `p-4` is 16px. | Tailwind CSS v4 blog | C |
| 2 | Tailwind v4 variants include `not-*`, `starting:`, `in-*`, `inert`, `nth-*`, `@container` with `@sm:` and `@max-md:`. Default type scale differs from design-kb (e.g. `text-lg` is 18px), so it must be overridden in `@theme`. | Tailwind CSS v4 blog; Tailwind docs | C |
| 3 | Next.js Image: `sizes` drives the generated srcset; `fetchPriority="high"` or `preload` for the LCP image. | Next.js docs | C |
| 4 | next/font applies `size-adjust` and metric overrides automatically. | Chrome for Developers, Improved font fallbacks | C |
| 5 | Craft details used by top product teams: tabular numbers in comparisons; `…` and curly quotes; non-breaking spaces (`10&nbsp;MB`); `scroll-margin-top` on anchor targets; concentric radii; layered shadows; semi-transparent borders; test at 50% zoom for ultra-wide; safe-area insets; `touch-action: manipulation`; gate `overscroll-behavior` behind `@media (pointer: fine)`; delay only the first tooltip in a group; keep the button label while loading. | Vercel Web Interface Guidelines (Rauno Freiberg and Vercel design) | P |
| 6 | App root `isolation: isolate` for predictable stacking. | Josh W. Comeau reset | P |
| 7 | Practitioner tier on X.com: designers such as Brett Williams (DesignJoy) share design references and tool compilations that are mostly visual and no-code (Framer, Webflow). Front-end craft leads on X come from Rauno Freiberg, Emil Kowalski, Adam Argyle (nerdy.dev, Open Props), Una Kravets, Jhey Tompkins, Kevin Powell, Josh W. Comeau, Sara Soueidan, Adrian Roselli, Harry Roberts. Every fact used from them in this KB was verified against MDN, web.dev or W3C, or is labelled practitioner opinion. | Search results; author sites | P (leads only) |

## Gaps
- No primary source defines a standard "design QA" process. The state matrix and content stress tests in the draft are studio practice, marked as opinion.
- WebSearch budget ran out during this round; X threads themselves were not fetched (X pages do not fetch). Re-run in the next review cycle.

## Sources
- https://tailwindcss.com/blog/tailwindcss-v4
- https://nextjs.org/docs/app/api-reference/components/image
- https://developer.chrome.com/blog/font-fallbacks
- https://vercel.com/design/guidelines
- https://www.joshwcomeau.com/css/custom-css-reset/
- https://nerdy.dev/
