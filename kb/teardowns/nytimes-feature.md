# New York Times: feature story ("Swept Away", 2025)

- **URL:** https://www.nytimes.com/interactive/2025/11/15/us/camp-mystic-flooding-deaths-video-map.html (published Nov. 15, 2025; by J. David Goodman, Malika Khurana, Bora Erden, Marco Hernandez, Yuhan Liu, Karthik Patanjali, Bedel Saget and Charlie Smart)
- **Why this story:** the Society for News Design named The New York Times "World's Best-Designed Digital Presence" at SND47 (2026), and the announcement shows this story's opening ("Swept Away") among the cited work. Quote: "Judges highlighted how The New York Times' digital work pushes beyond a strong baseline" (snd.org/snd-2026-worlds-best-designed, accessed 2026-10-10, tier 4).
- **Status: NOT MEASURED.** On 2026-10-10 every nytimes.com request from this environment returned HTTP 403 from DataDome bot protection (`server: DataDome`, `x-datadome: protected`), in Playwright Chromium and in plain HTTP alike; `static01.nyt.com` also returned 403, and web.archive.org and archive.ph did not connect. `data/nytimes-feature.json` records the 403. No screenshots exist.
- **Strongest in (expected, unverified):** editorial typography, scrollytelling, maps and data graphics, pacing. Treat this as a placeholder until measured.

## What could be read
A text-only fetch and a search excerpt through the Parallel Search connector (2026-10-10) returned the story's skeleton, not its styles:
- Headline "Swept Away"; dek "A detailed account of how 28 people died in the flooding at Camp Mystic."
- The story is organized by clock time: section heads "3:00 a.m.", "3:50 a.m." and onward.
- Each time step carries an annotated aerial map whose labels are the camp's own cabin names ("Nut Hut", "Giggle Box", "Jumble House", "Bubble Inn", "Bug House", "Twins", "Wiggle Inn"), landmarks ("Recreation hall", "Dining hall", "Guadalupe River") and an "EVACUATION ROUTE" label. Labels appear twice per step, which suggests separate desktop and phone versions of each map (inferred, not seen).

**Opinion, from the structure only:** time as the section spine and the place's own vocabulary as map labels are the two transferable moves: the reader always knows when and where they are.

## How to complete this page
1. From a browser where nytimes.com loads (Davon's machine), run `node tools/render.mjs <URL> kb/exemplars/shots --name nytimes-feature --jpeg 60 --schemes light --max-height 6000` and `node kb/teardowns/measure.mjs <URL> kb/teardowns/data/nytimes-feature.json`, or save the page's screenshots at 1440 and 390 into `kb/exemplars/shots/`.
2. Then fill the same sections as `stripe-home.md`. Never fill them from memory: the story's typefaces and sizes must be read from the computed CSS, not recalled.
