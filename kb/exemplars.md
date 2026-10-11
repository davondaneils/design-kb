# Exemplar set

**Status: approved by Davon, 2026-10-09.** This is the confirmed quality bar (editor-in-chief human gate; approval relayed to this session by the project coordinator). Source: `exemplars-draft.md` in the project files, copied 2026-10-09.

This list is the quality bar. Test outputs are rendered and judged side by side against the closest exemplar. Changes need Davon's approval.

## Marketing and landing pages
1. stripe.com
2. linear.app
3. vercel.com
4. apple.com (product pages)
5. raycast.com
6. framer.com
7. mercury.com
8. ramp.com
9. cash.app
10. family.co
11. designjoy.co
12. pitch.com

## Product, app and tool UI
13. Linear (app)
14. Stripe Dashboard
15. Vercel Dashboard
16. Superhuman
17. Things 3 (culturedcode.com)
18. Notion
19. Arc browser / arc.net

## Brand, editorial and portfolio
20. pentagram.com
21. rauno.me
22. emilkowal.ski
23. nytimes.com (feature stories)
24. teenage.engineering
25. the-brandidentity.com

## Screenshots
Target: homepage of each marketing exemplar at 1440 and 390px, JPEG, in `kb/exemplars/shots/`, made with
`node tools/render.mjs https://<site> kb/exemplars/shots --name <site> --jpeg 60 --schemes light --max-height 6000`.

**2026-10-09 run: no exemplar rendered.** The cloud environment's egress policy denied every exemplar host (HTTP 403 on CONNECT for stripe.com, linear.app, vercel.com, www.apple.com, www.raycast.com, www.framer.com, mercury.com, ramp.com, cash.app, family.co, www.designjoy.co, pitch.com, plus the brand and portfolio sites). web.archive.org and the common image CDNs were denied too. Re-run the command above from an environment that allows these hosts, or add them to the environment's allowed domains. Until then, exemplar comparisons in `kb/tests/` are made from text fetches and remembered layouts and say so.

Product UI exemplars (Linear app, Stripe Dashboard, Vercel Dashboard, Superhuman, Notion) sit behind logins. Use public screenshots the teams publish (docs, changelogs, press kits) or screenshots Davon supplies.
