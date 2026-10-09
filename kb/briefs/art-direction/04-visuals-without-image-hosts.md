# Brief 04: Visuals without image hosts

## Question
When no image can load (blocked CDNs, no assets yet), how does Claude make visuals that are specific, ownable and finished rather than placeholders?

## Audience
Claude building any page in a sandbox where image and font hosts are blocked.

## Decisions the reader must be able to make
- Choose the medium: inline SVG illustration, CSS-drawn object, generative pattern or texture, data-driven graphic, typographic image, or an honest slot for a real photo.
- Make it specific to the brand's facts (data-driven beats decorative).
- Keep it accessible (`role="img"` plus a name, or hidden), small, theme-aware (`currentColor` and tokens), and reduced-motion safe.
- Seed generative work so it renders the same every time.

## Fundamentals
1.4.11 for meaningful parts; decorative art hidden from assistive tech; text stays live HTML; no fake photos; SVG text renders at 12px or more.

## Expert layer
Generate from real data (terrain, roast curves, time series) so the art is true; feTurbulence grain; seeded PRNG; flow fields (Hobbs); one drawing language shared with the icon grid; draw the object at full fidelity or not at all.

## Must cover
MDN feTurbulence, baseFrequency, pattern; grainy gradients; ARIA img role; Tufte sparklines; a seeded generator script in assets.

## Out of scope or reuse
Chart construction and chart palettes: dataviz skill. Icon drawing: design-graphic 02.

## Test briefs
1. Coffee landing page with no photos available (slice brief A). Exemplars: apple.com product pages, family.co.
2. Dashboard empty and loading states plus KPI sparklines (slice brief B). Exemplars: Linear app, Vercel Dashboard.

## Rubric
Gate first (lint 0 fails). Then: no visual reads as a placeholder; every visual is traceable to a brand fact; dark theme recolors through tokens.
