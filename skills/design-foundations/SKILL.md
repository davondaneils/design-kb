---
name: design-foundations
description: Foundation layer of design-kb, always loaded first by design-director and every design playbook. Holds the shared token system (spacing, type, color roles, radius, elevation, motion, icons, sizes, breakpoints, content mechanics), the 16-item fundamentals checklist that gates every page, and accessibility (WCAG 2.2 AA) as the cross-cutting floor. Load it directly for "what are our design tokens", "run the fundamentals check", "is this accessible", "a11y audit", "WCAG checklist". Not a design method on its own: for a page, screen or brand use design-director.
---

# design-foundations

The floor under every design job. Nothing a playbook or domain reference teaches earns credit until this layer passes. Source of truth: `kb/FOUNDATIONS.md` (contract v0.4.2) in the design-kb repo. The reference files here mirror it; if they ever differ, FOUNDATIONS wins.

## 1. Non-negotiable rules
1. **Tokens only.** Components use semantic tokens (`--color-text-muted`, `--space-gap-md`, `--radius-control`), never raw values or primitives. Names follow `--{category}-{role}-{variant}`.
2. **One scale per idea.** Spacing 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Type 12, 14, 16, 20, 25, 31, 39, 49, 61 (ratio 1.25, root 16). Radius 0, 4, 8, 12, 16, full. Off-scale values are deliberate optical corrections, and you say so.
3. **Accessibility is the floor, not a feature.** WCAG 2.2 AA in light and dark: 4.5:1 body text, 3:1 large text, UI parts and focus rings; 24x24 CSS px targets (44x44 on touch); keyboard operable; visible focus; never color alone; reduced motion respected. Full rules: `references/accessibility.md`.
4. **The checklist is a gate.** Every rendered page passes all 16 items in `references/fundamentals-checklist.md`. One miss fails the page, however good the rest is.
5. **Light and dark remap the same roles.** Never invert; dark surfaces get lighter as they rise.
6. **Body measure** 45 to 75 characters; default `max-inline-size: 52ch` (63 to 68 characters in every text face measured), then confirm with the lint. Never `66ch` (81 to 86 characters).
7. **Copy is a fundamental.** Every number matches its source, one clock (US: "2:05 pm"), weekday-checked dates, no line break inside a date, price, range or number and unit. Run `skills/design-copy/assets/claims_inventory.mjs` and tick every claim (item 16).
8. **Never `none` inside a shadow token** (dark levels are `0 0 0 0 transparent`) and never `em` in a container query (use `rem`): both silently break.

## 2. Defaults at a glance
| Category | Default |
|---|---|
| Spacing | 4px base; component padding 4 to 24; layout gaps 16 and up |
| Type | body 16 / 1.5; headings 1.1 to 1.25 (0.95 for display lines of 100px and up); fluid `clamp()` only for 39px and up; display ramp `--text-display`, `--text-display-2` may exceed 61 |
| Color roles | bg, surface, surface-raised, surface-sunken, text, text-muted, text-muted-on-tint (muted text on any tint, re-measured), border, primary, on-primary, accent, success, warning, danger, info, focus-ring |
| Breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536, mobile first; container queries for components, conditions in `rem` |
| Icons | 12, 16, 20, 24px (`--size-icon-sm` to `-xl`), `--icon-stroke` 1.5px, one cap and one join, `currentColor` |
| Sizes | controls and rows 32, 40, 48 (`--size-control-sm` to `-lg`) |
| Elevation | ring plus tinted two-layer shadow, levels 0 to 4 (`references/tokens.md`); dark themes lift with lighter surfaces, a ring and a top highlight |
| Motion | fast 150ms, base 200 to 250ms, slow 300 to 400ms, page ceiling 600ms (one hero reveal per marketing page may reach 800ms, opinion); `--motion-hover`, `-enter`, `-exit` pairs; `linear` only for loops, scroll and time axes; under reduce no movement, fades up to 150ms |
| Content | US 12-hour clock "2:05 pm", "Tue, Oct 13" with the weekday checked, numerals, sentence case, no breaks inside dates, prices and units |
| Focus | 2px solid `--color-focus-ring`, 2px offset, on `:focus-visible` |

## 3. Reference map
| Need | Read |
|---|---|
| Every token name and value, the token schema, icons, sizes, content mechanics, a starter token file | `references/tokens.md` |
| The 16-item gate and how to run lint, render and the claims inventory | `references/fundamentals-checklist.md` |
| WCAG 2.2 AA checklist, focus, targets, live regions, forms, testing protocol, and where each domain keeps its own accessibility detail | `references/accessibility.md` |
| Design systems: component contracts, token tiers, theming, versioning | planned (`references/design-systems.md`; see `kb/status/systems.md`) |

## 4. Who owns what
Changing a value here is an editor-in-chief decision recorded in the FOUNDATIONS change log. Owner domains fill in the values the contract leaves open: color ramps (design-color), type faces (design-typography), shadow recipes (design-layout, using the design-polish recipe in FOUNDATIONS), illustration roles (design-art-direction with design-color), motion curves beyond the three defaults (design-motion), icon drawing rules (design-graphic with design-polish), content mechanics beyond the sheet (design-copy).
