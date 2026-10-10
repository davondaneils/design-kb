# Vercel: Dashboard

- **URL:** https://vercel.com/docs/projects/project-dashboard, which now redirects to https://vercel.com/docs/projects ("Projects overview"). The Dashboard sits behind a login. Dashboard screenshots taken from https://vercel.com/docs/deployments (`deploy-outputs-light.png` 3200x1800, `deployment-resources-page-light.png` 2400x1256), https://vercel.com/docs/deployments/managing-deployments (`filter-status-light.png` 1146x660, `redeploy-model-light.png`) and https://vercel.com/docs/analytics (`panels-light-mode.png` 2432x1376, `visitor-chart-light.png`).
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/vercel-docs-dashboard.json`), docs chrome probed element by element. Screenshots: `kb/exemplars/shots/vercel-docs-dashboard-1440-light.jpg`, `vercel-docs-dashboard-390-light.jpg`.
- **Caveats:** the docs are built on Geist, the same design system as the Dashboard, and are measured live. Dashboard values from the images are **estimates**: colors are pixel samples; sizes assume the images are 2x captures (e.g. 2432px for about a 1216px layout), which the docs do not state. Brand values are in `vercel-home.md`.
- **Strongest in:** product-ui, data-density, type (Geist tracking), color (status only).
- Everything below is measured unless marked **opinion** or **estimate**.

## Measured values

| Area | Value |
|---|---|
| Families | `GeistSans` (variable, 100 to 900) for everything; `Geist Mono` for code |
| Weights | 400 body and nav, 500 links, buttons and nested nav, 600 headings and top-level nav |
| Type steps (1440) | 40 (h1), 24 (h2), 20 (h3), 18 (logo label), 16 (body, h4), 14 (all UI), 13, 12 (labels, meta), 11 (beta badge) |
| Line height | 40/48 (1.2), 24/32 (1.33), 20/26 (1.3), 16/27.2 (1.7) prose, 16/24 (1.5) headings, 14/20 (1.43) UI, 12/16 (1.33) |
| Tracking | -2.4px at 40 (**-0.06em**), -0.96px at 24 (-0.04em), -0.4px at 20 (-0.02em), -0.32px at 16 headings (-0.02em), -0.28px on 14px nav (-0.02em), 0 on body, +0.2px on the 11px badge |
| Phone (390) | h1 drops to 24/32 at -0.96px; body 16/27.2 at 42 characters per line |
| Text colors | Ink `#171717` (17.2:1 on `#fafafa`); body `#4d4d4d` (8.5:1 on white); links `#0068d6` (5.3:1); muted `#7d7d7d` (**3.94:1** on `#fafafa`); faint `#8f8f8f` (**3.1:1**); `#0070f3` on `#fafafa` (**4.36:1**) |
| Surfaces | Page `#fafafa`; cards and buttons `#ffffff`; selected nav `#ebebeb`; subtle fill `#f2f2f2` |
| Borders | `rgba(0,0,0,.08)` and `#ebebeb`, both 1px, mostly drawn as `0 0 0 1px` shadow rings |
| Radii | 6 (85 uses: nav rows, buttons, inputs), 4 (links, kbd), full (badges), 8 (details panel) |
| Shadows | Button ring `rgb(235,235,235) 0 0 0 1px`; floating card `rgba(0,0,0,.08) 0 0 0 1px, rgba(0,0,0,.04) 0 2px 2px, #fafafa 0 0 0 1px`; label `#ebebeb 0 0 0 1px, rgba(0,0,0,.05) 0 1px 2px` |
| Header | 64px; buttons 32px tall, padding `0 6` plus 6px inner span padding, radius 6: "Sign Up" `#171717` fill white text, "Ask AI" and "Log In" white with a 1px `#ebebeb` ring, 14px/500 |
| Sidebar | About 288px column; search field 264x36 with a "⌘ K" hint; nav rows **264x36**, padding `0 4 0 10` (nested `0 8 0 10`), radius 6, **1px gap**; active row `#ebebeb`; top level 14/20 weight 600 `#171717`, nested 14/20 weight 500 `#4d4d4d`, both -0.28px |
| Content | Article 768px (`max-w-3xl`); content wrapper padding `24 48 64 12`; TOC aside 240px with "On this page" 14px `#7d7d7d` |
| Tokens (root vars) | `--geist-space` 4, 8, 12, 16, 24, 32, 40, 64; color ramps `--ds-{blue,red,amber,green,teal,purple,pink}-100` to `-1000` in OKLCH; `--geist-cyan #50e3c2`, `--geist-warning #f5a623`, `--geist-error #e00`. Type classes named by role and size: `text-heading-40`, `text-heading-24`, `text-label-14`, `text-label-12`, `text-copy-14`. |
| Motion | Color, background and border `.1s cubic-bezier(.4,0,.2,1)` (79 uses); opacity `.1s`; buttons `all .15s`; menus `.2s`. 8 `prefers-reduced-motion` rules. |
| Body measure | 16px in a 768px column: 83 characters per line |
| Dashboard status (estimate) | Ready `#7ce0c3` (close to `--geist-cyan`), Error `#da2f20`, Building `#e9a944` (close to `--geist-warning`), Queued and Canceled `#eaeaea`; success check on a `#0761d1` circle |
| Dashboard rows (estimate) | Analytics list rows about 40px pitch with a 32px bar; deployment summary rows separated by 1px `#eaeaea`, collapsed groups on `#fafafa`; count pills `#eaeaea` fully rounded; region badges ("SFO1", "GLOBAL") gray `#999` with white text |

## What it does right

**Type.** Geist tracking scales with size from -0.06em at 40px to -0.02em at 14px, and the 14px nav is tracked too, which keeps dense lists tight without dropping size. Everything interactive is 14px; prose is 16px at a loose 1.7. Type tokens are named by role and size (`text-label-14`, `text-copy-14`, `text-heading-24`), so a designer can read the size from the class.

**Color.** Grayscale chrome (`#171717`, `#4d4d4d`, `#7d7d7d`, `#ebebeb`, `#fafafa`) and color only for status. In the deployments filter the status summary is a cluster of overlapping dots (teal, red, amber, gray) next to a "4/5" count chip: the filter state is visible while the menu is closed. The docs swap every screenshot for a dark variant (`-light.png` and `-dark.png` pairs), so documentation follows the theme like the product does.

**Layout and spacing.** One control height, 36px, for search and every nav row, with a 1px gap; 32px for header buttons. The sidebar has no dividers: rows, a 6px radius and a gray fill for the current page.

**Hierarchy.** In the analytics panels the row background is the chart: each row's `#f5f5f5` bar is as wide as its share, the value is right-aligned and bold, and the column header ("VISITORS") is uppercase `#5b5b5b`. The last row fades out under "View All" and a "..." pill, which signals more without a pager. (**estimate**, from `panels-light-mode.png`)

**Imagery and art direction.** Dashboard images are tight crops of one component (a filter menu, a summary card) at 2x on a `#fafafa` field, not full-window screenshots. **Opinion:** cropping to the component keeps docs readable and makes drift less visible than Stripe's full-layout redraws.

**Motion.** 100ms with Tailwind's standard ease for hover, 150ms for buttons, 200ms for menus. Matches FOUNDATIONS instant and fast steps.

**Copy and UX.** Statuses are single words ("Ready", "Error", "Building", "Queued", "Canceled"); durations are terse ("7s"); counts sit in pills ("All (1,772)", "HTML (6)").

## Borrow
- A 36px control height for search and nav rows, 1px row gap, 6px radius, active row `#ebebeb`.
- Tracking that scales with size: -0.06em at 40, -0.04em at 24, -0.02em at 14 to 20.
- Bar-as-row-background for ranked lists: no chart axis, the row is the bar.
- Status as an 8 to 10px dot plus one word; a summary of active filters as stacked dots.
- Role-and-size type tokens (`label-14`, `copy-14`, `heading-24`); light and dark screenshot pairs in docs.

## Do not borrow
- Muted `#7d7d7d` on `#fafafa` (3.94:1) for the search placeholder, "On this page" and "Last updated": fails AA for 12 to 14px text.
- `#8f8f8f` (3.1:1) and `#0070f3` on `#fafafa` (4.36:1) for text.
- Region badges with white text on `#999` (about 2.85:1, **estimate**).
- An 83-character prose measure in the 768px column.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Tracking -0.06em at 40px is twice the usual display tightening; FOUNDATIONS has no tracking token yet.
- Prose line height 1.7 exceeds the 1.5 body rule; UI text 14/20 (1.43) sits below it.
- Control height 36px and the 1px nav gap; FOUNDATIONS has no control-height tokens.
- `--geist-space` includes 40, which FOUNDATIONS spacing does not; it lacks 2, 48, 96 and 128.
- Radius 6 is the dominant radius and is not on the FOUNDATIONS scale (4, 8).
- Color ramps run 100 to 1000 in OKLCH; FOUNDATIONS ramps run 50 to 950.

## Live capture (2026-10)

Attempted 2026-10-10 through Mobbin (`search_screens`, `search_flows`) for screens of the logged-in Vercel dashboard. Both calls returned "Mobbin MCP requires a paid plan", so no Mobbin screen was retrieved and nothing here is Mobbin-backed. TinyFish and Parallel can reach only public pages, not the app behind its login. The values above marked **estimate** remain estimates; the measured values come from the public surfaces named in the header. To finish: with a Mobbin paid seat, search "Vercel dashboard project deployments list" (platform web), and replace each estimate with the screen's value plus its `mobbin_url`.
