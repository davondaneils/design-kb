---
name: design-foundations
description: Foundation layer of design-kb, always loaded first by design-director and every design playbook. Holds the shared token system (spacing, type, color roles, radius, elevation, motion, breakpoints), the 15-item fundamentals checklist that gates every page, and accessibility (WCAG 2.2 AA) as the cross-cutting floor. Load it directly for "what are our design tokens", "run the fundamentals check", "is this accessible", "a11y audit", "WCAG checklist". Not a design method on its own: for a page, screen or brand use design-director.
---

# design-foundations

The floor under every design job. Nothing a playbook or domain reference teaches earns credit until this layer passes. Source of truth: `kb/FOUNDATIONS.md` (contract v0.2) in the design-kb repo. The reference files here mirror it; if they ever differ, FOUNDATIONS wins.

## 1. Non-negotiable rules
1. **Tokens only.** Components use semantic tokens (`--color-text-muted`, `--space-gap-md`, `--radius-control`), never raw values or primitives. Names follow `--{category}-{role}-{variant}`.
2. **One scale per idea.** Spacing 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Type 12, 14, 16, 20, 25, 31, 39, 49, 61 (ratio 1.25, root 16). Radius 0, 4, 8, 12, 16, full. Off-scale values are deliberate optical corrections, and you say so.
3. **Accessibility is the floor, not a feature.** WCAG 2.2 AA in light and dark: 4.5:1 body text, 3:1 large text, UI parts and focus rings; 24x24 CSS px targets (44x44 on touch); keyboard operable; visible focus; never color alone; reduced motion respected. Full rules: `references/accessibility.md`.
4. **The checklist is a gate.** Every rendered page passes all 15 items in `references/fundamentals-checklist.md`. One miss fails the page, however good the rest is.
5. **Light and dark remap the same roles.** Never invert; dark surfaces get lighter as they rise.
6. **Body measure** 45 to 75 characters; default `max-width: 32em`, then confirm with the lint (66ch renders about 80 characters in Inter).

## 2. Defaults at a glance
| Category | Default |
|---|---|
| Spacing | 4px base; component padding 4 to 24; layout gaps 16 and up |
| Type | body 16 / 1.5; headings 1.1 to 1.25; fluid `clamp()` only for 39px and up |
| Color roles | bg, surface, surface-raised, text, text-muted, border, primary, on-primary, accent, success, warning, danger, info, focus-ring |
| Breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536, mobile first; container queries for components |
| Elevation | shadow levels 0 to 4; dark themes lift with lighter surfaces |
| Motion | fast 150ms, base 200 to 250ms, slow 300 to 400ms; ease standard `cubic-bezier(0.2, 0, 0, 1)` |
| Focus | 2px solid `--color-focus-ring`, 2px offset, on `:focus-visible` |

## 3. Reference map
| Need | Read |
|---|---|
| Every token name and value, the token schema, a starter token file | `references/tokens.md` |
| The 15-item gate and how to run lint and render | `references/fundamentals-checklist.md` |
| WCAG 2.2 AA checklist, focus, targets, live regions, forms, testing protocol, and where each domain keeps its own accessibility detail | `references/accessibility.md` |
| Design systems: component contracts, token tiers, theming, versioning | planned (`references/design-systems.md`; see `kb/status/systems.md`) |

## 4. Who owns what
Changing a value here is an editor-in-chief decision recorded in the FOUNDATIONS change log. Owner domains fill in the values the contract leaves open: color ramps (design-color), type faces (design-typography), shadow recipes (design-layout), motion curves beyond the three defaults (design-motion).
