# Exemplar teardowns

A standing research stream, run by the researcher next to the books and standards. Textbooks give the floor; teardowns give the ceiling: what the sites in `kb/exemplars.md` actually ship, measured, not remembered.

## What to measure
One file per exemplar page: `kb/teardowns/<site>-<page>.md` (for example `linear-home.md`). Record from the live computed CSS, desktop 1440 and phone 390:

| Area | Measure |
|---|---|
| Type scale | every distinct `font-size` in use, with the element; the ratio between steps; the families and weights |
| Line heights | per size, as a unitless ratio |
| Tracking | `letter-spacing` at display and body sizes |
| Measure | characters per line of body text |
| Spacing steps | distinct margin, padding and gap values; the section padding; the base unit they share |
| Colors | text, muted text, background, surfaces, borders, accent; contrast ratio of each text pair |
| Radii | every distinct `border-radius` |
| Shadows | full `box-shadow` recipes, and where borders are used instead |
| Motion | `transition` and `animation` durations and easing; what moves on load, hover and scroll; reduced-motion behavior |
| Layout | container max width, grid columns and gutters, breakpoints seen |

Then write: **signature moves** (named, with the measured values and a screenshot path in `kb/exemplars/shots/`) and **where it deviates from FOUNDATIONS** (a deviation is data for the editor-in-chief, not an automatic change to the contract).

## How
- From an environment that can reach the site: `node tools/render.mjs https://<site> kb/exemplars/shots --name <site> --jpeg 60 --schemes light --max-height 6000` for screenshots, and a Playwright script reading `getComputedStyle` on sampled elements for the values. Record the date, URL and method in each file.
- Product UIs behind logins (Linear app, Stripe Dashboard, Vercel Dashboard, Superhuman, Notion): use public screenshots in docs, changelogs and press kits, or screenshots Davon supplies. Mark values read from screenshots as estimates.

## Network block
On 2026-10-09 the cloud environment's egress policy denied every exemplar host (HTTP 403 on CONNECT), plus web.archive.org and common image CDNs. Until the hosts are allowed, teardowns need either a run from Davon's machine (or another environment with access) or exported HAR and CSS files he supplies. Never fill a teardown from memory; the playbooks' signature moves are already marked "opinion, unmeasured" for that reason.
