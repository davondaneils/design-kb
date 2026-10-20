# Fresh brief: Halyard

Date: 2026-10-13. Written and committed before anything was built, after the imagery and motion rework (FOUNDATIONS v0.5, `kb/teardowns/motion-imagery.md`). No skill, test or review has seen this product, its category or its locale: every earlier test was payroll (Ferry), coffee, an analytics dashboard, a freelancer app or a festival, all but the festival in en-US.

Like the benchmark, there is no without-skill baseline. The pages are scored against the measured exemplars with the benchmark's scorecard (`kb/tests/benchmark/briefs.md`, "How it is scored"), so the result is comparable with `kb/tests/benchmark/RESULTS.md`.

## Product
**Halyard**: a passage planner for small-boat sailors on the south coast of England. It reads tide heights and streams, wind forecast and daylight for a chosen day and boat, and proposes the departure window when the tide is with you and the wind is inside the boat's limits. It shows the plan as a timeline (tide, wind, light) and a route with timed waypoints, and warns when the window closes (wind against tide over a set strength, an arrival after sunset). Audience: owners and crews of 6 to 12 metre yachts and dayboats sailing from the Solent, Poole and Chichester Harbour. Locale **en-GB** (`lang="en-GB"`, times in BST/GMT on a 24-hour clock in tide and timetable data, "Saturday 24 October 2026" in running copy, £). Pricing: free for one boat and three plans a month; Halyard Plus £4.99 a month or £39 a year. All tide, wind and route numbers, names and quotes are sample content and must be marked as such where a reader could mistake them for real data or a navigation source; the page must say Halyard is a planning aid, not a substitute for official tide tables, charts or forecasts.

## Brief 1: marketing home page
- One page, `halyard.html`, at 1440 and 390 wide (lint covers 768 and 1024), light and dark.
- Job: a sailor who checks four apps on Friday night (tide tables, a wind forecast, a sunset time, a chart) lands from a search. In one screen they learn what Halyard does, who it is for and what to do next (get the app for iOS or Android, or plan a sail in the browser).
- Must include: hero with one primary action; the product shown (built in HTML, CSS and SVG, not screenshots), including how a window is found (tide with you, wind inside limits, home before dark); a section on the warnings; coverage (which harbours and tidal stations, honest about what is not covered); pricing (free and Plus); proof (sample, labelled); safety and sources statement; FAQ; footer.
- Closest exemplars: Stripe home and Linear home (product shown as live HTML), then Apple MacBook Air (consumer, picture-led), Things (calm consumer app).

## Brief 2: product app screen
- One screen, `plan.html`: the plan for **Saturday 24 October 2026**, boat *Wren* (a 7.9 m sloop, limits: true wind up to 20 knots, wind against tide no more than 12 knots, arrive by sunset), passage Lymington to Yarmouth (Isle of Wight) and back, about 4.5 nautical miles each way. At 1440 and 390, light and dark.
- Content: high and low waters at Lymington for the day (sample); a 24-hour timeline of tide height, tidal stream at the Needles Channel, wind speed and direction, sunrise 07:33 and sunset 17:56 BST (sample values; check the weekday and keep them consistent); the proposed out and back windows with departure times; 3 warnings (a wind-against-tide period mid-afternoon, a gust forecast above 20 knots after 16:00, a return arrival 25 minutes before sunset). One primary action: "Save plan". The plan can shift its departure by dragging or by keyboard, and the windows and warnings update.
- States reachable by URL: default, `?state=empty` (no boat set up yet), `?state=error` (the forecast could not be loaded), `?state=loading`, `?state=nowindow` (no safe window that day). Plus a state sheet.
- Closest exemplars: Linear app, then Things, Stripe Dashboard.

## How it is scored
Exactly the benchmark method (`kb/tests/benchmark/briefs.md`): fundamentals gate first (FOUNDATIONS 16 items, lint, claims, search check), measured comparison (`kb/teardowns/measure.mjs` plus `kb/tests/benchmark/score.py`, and now `kb/teardowns/choreo-probe.mjs` for motion and imagery), then a fresh-context critic that did not build the pages rates each domain reaches exemplar, close, clearly below or far below, with the same domain rows as `kb/tests/benchmark/RESULTS.md`. Built by fresh builders following design-director end to end; no builder opens the benchmark rounds.
