# Topic map

**Generated rollup. Do not edit by hand.** The librarian regenerates this table from `kb/status/<domain>.md`. Each domain's status file is the source of truth, so parallel domain runs never overwrite each other.

Ownership: the editor-in-chief owns in-progress status (planned, researching, drafting, review, testing, paused, linked, archived) in each status file; the librarian owns the shipped version field and this rollup. Shared defaults: `kb/FOUNDATIONS.md`. Exemplar set: `kb/exemplars.md`.

Layers: **foundation** (always loaded), **spine** (design-director), **playbook** (what triggers, one per job), **reference** (domain depth, loaded on demand), **linked** (the user's existing skills), **archived** (dropped). Rows are sorted by layer, then number.

| # | Layer | Domain | Skill | Branch | Status | Shipped | Status file |
|---|---|---|---|---|---|---|---|
| 14 | foundation | Foundations (tokens, fundamentals gate, accessibility) | design-foundations | restructure | drafting | none | `status/foundations.md` |
| 17 | foundation | Design systems and tokens | design-foundations (planned `references/design-systems.md`) | none yet | planned | none | `status/systems.md` |
| 13 | spine | Director (spine across the three layers) | design-director | restructure | drafting | none | `status/director.md` |
| 20 | spine | Self-critique loop | design-director (planned `references/self-critique.md`) | none yet | planned | none | `status/critique.md` |
| 15 | playbook | Job playbooks (landing, dashboard, mobile, brand) | design-playbook-landing, design-playbook-dashboard, design-playbook-mobile, design-playbook-brand | restructure | drafting | none | `status/playbooks.md` |
| 2 | reference | Color theory and palettes | design-color | merged into restructure (from pilot/design-color, PR #1) | testing | v0.1 (2026-10-09, text-only test; pending re-test) | `status/color.md` |
| 3 | reference | Typography and font pairing | design-typography | restructure (merged from wave/typography on 2026-10-09) | testing | none (v0.2 ready, awaiting Davon's blind ranking) | `status/typography.md` |
| 4 | reference | Layout, grids, spacing, hierarchy | design-layout | wave/layout (from restructure) | testing | none | `status/layout.md` |
| 5 | reference | Graphic design (logos, icons, export) | design-graphic | wave/graphic (from restructure) | review-ready (tested, pass) | v0.2 pending merge | `status/graphic.md` |
| 6 | reference | UX and interaction (web and app) | design-ux | wave/ux (from restructure) | testing | none (v0.2 in skills/design-ux, awaiting merge) | `status/ux.md` |
| 7 | reference | Motion and micro-interaction | design-motion | wave/motion (from restructure) | testing done, ready for librarian | none (v0.2 proposed) | `status/motion.md` |
| 8 | reference | Copywriting and UX writing | design-copy | wave/copy (from restructure) | testing | none (v0.2 built and render-tested 2026-10-10, awaiting Davon) | `status/copy.md` |
| 10 | reference | Front-end build quality: semantic HTML, modern CSS, performance | design-frontend | wave/frontend (from restructure) | review (render test passed; ready to merge) | 0.2 on wave/frontend, not merged | `status/frontend.md` |
| 12 | reference | Search: SEO and AEO | design-search | wave/search (from restructure) | testing | none | `status/search.md` |
| 16 | reference | Visual polish and craft details | design-polish | restructure (merged from wave/polish on 2026-10-09) | testing | v0.1 (on branch, not merged) | `status/polish.md` |
| 18 | reference | Product and tool UI | design-product-ui | restructure (merged from wave/product-ui on 2026-10-09) | testing | none (v0.1 built, awaiting Davon's review) | `status/product-ui.md` |
| 19 | reference | Art direction and imagery | design-art-direction | restructure (merged from wave/art-direction on 2026-10-09) | testing | none (v0.1 ready for review) | `status/art-direction.md` |
| 99 | reference | Conversion design for websites (CRO) | design-conversion | wave/conversion (from restructure) | testing | v0.1 (2026-10-10, on branch, not merged) | `status/conversion.md` |
| 1 | linked | Strategy and brand | (existing) website-strategy | n/a | linked | none | `status/strategy.md` |
| 9 | linked | Conversion and funnels | (existing) sales-funnels | n/a | linked | none | `status/funnels.md` |
| 11 | archived | Data and backend structure | design-data (dropped) | wip/design-data (archived, not merged) | archived | none | `status/data.md` |

## Subtopics
Subtopic tables live in each domain's status file once that domain is active. Color subtopics: `briefs/color/01` to `05`, all built into `skills/design-color/references/`.

## Standing research stream
Exemplar teardowns: measured CSS from the exemplar set, kept in `kb/teardowns/` (method in its README). Feeds the playbooks' signature moves and every domain's ceiling layer.
