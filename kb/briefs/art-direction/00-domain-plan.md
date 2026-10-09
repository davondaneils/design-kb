# Domain plan: art direction and imagery (design-art-direction)

Owner hat: editor-in-chief. Skill: `design-art-direction`. Slug: `art-direction`. Layer: domain reference. Written 2026-10-09.

## Why this domain exists
The color pilot's coffee page passed every gate and still rated "clearly below" the exemplars. Davon's blind ranking: the better pages were "not super special". The tester named imagery and art direction as the first gap: a CSS coffee bag stood in for a visual idea (`kb/tests/design-color.md`). This domain owns the visual idea of a page and every picture on it.

## Scope
1. A page-level visual concept that runs through a whole site (the idea, its rules, and how it becomes tokens and components).
2. Photography: picking, cropping, treating, and making a set consistent.
3. Composition and focal point, and text over images done accessibly.
4. Getting usable visuals when image hosts are blocked: inline SVG illustration, CSS-drawn objects, generative patterns and textures, data-driven graphics.
5. Briefing or requesting real photography from the user, with exact specs.

## Out of scope (link, do not duplicate)
- Logos, icons, social and OG graphics, file export, shot-brief basics, illustration style spec fields: design-graphic (`01` to `06`). This domain builds on graphic `03` and `04` and never restates them.
- Palettes, ramps and contrast math: design-color. Type choice: design-typography. Grids and hero layout: design-layout. Animation: design-motion. Image delivery code (srcset, LCP): design-frontend `05`. Charts: dataviz. Positioning (what the brand stands for): website-strategy.

## Subtopics (one file name across briefs, research and drafts)
| # | File | Question |
|---|---|---|
| 1 | 01-concept-and-consistency.md | What is the page's visual idea, and how do I keep every image in one voice? |
| 2 | 02-photography.md | How do I pick, crop and treat photographs so they prove something and look like one brand? |
| 3 | 03-composition-and-overlays.md | Where does the eye land, and how do I put text on images without failing contrast? |
| 4 | 04-visuals-without-image-hosts.md | How do I make real, specific visuals from SVG, CSS and code when no image can load? |
| 5 | 05-requesting-photography.md | What exactly do I ask the user to shoot or send, and how do I slot it in? |

## Test plan
The tester improves the two rendered pages from the color pilot (`kb/tests/design-color/coffee-with.html`, `dashboard-with.html`), so the gain is measurable against a known baseline. Briefs and rubric: `slice-test-briefs.md`. Per-subtopic test briefs are for text runs and future rounds.

## Network limit (state it, design for it)
Image CDNs, font CDNs and exemplar hosts are blocked by the egress policy for curl and the browser. Text-only fetches of some exemplar homepages work through WebFetch; pixels do not. Fonts available locally (`fc-list`): Inter, Inter Display, Bitstream Charter, Caladea, Carlito, DejaVu, Liberation, Free fonts. Every visual on a test page is inline SVG or CSS, and the hand-over says so.
