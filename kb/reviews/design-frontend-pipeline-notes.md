# design-frontend: suggested changes to shared files

From the render test of design-frontend 0.2 (`kb/tests/design-frontend.md`, 2026-10-10). This branch does not edit these files; the owners decide.

## kb/FOUNDATIONS.md (and design-foundations, which mirrors it)
1. **Dark shadow tokens: transparent, not `none`.** The elevation table sets dark `--shadow-1` (and others) to `none`. Composed into a list (`box-shadow: var(--highlight), var(--shadow-1)`) the whole declaration computes to `none`, so the dark primary-button highlight never rendered on either combined page (measured with getComputedStyle; research 07 finding 5). Suggested: `--shadow-1: 0 1px 2px light-dark(rgb(var(--shadow-rgb) / 0.06), transparent)`, same shape for each level.
2. **Container query units.** Add to the breakpoint row: container conditions in rem or px, never em (em resolves against the container's font size; research 07 finding 7).
3. **Layer order.** Add a `states` layer between `components` and `utilities` for review states, and say that `!important` preference overrides belong in the first layer (`reset`).

## tools/lint.mjs
4. **Skip link check.** The combined coffee page passed lint with no skip link (a gate item). Suggested check: the first focusable element is a same-page link to `main` (or a landmark), and it is visible on focus.
5. **Dark shadow check counts transparent shadows.** The dark "drop shadows" warning counts layers whose color is transparent (alpha 0). With the fix in item 1, the coffee state sheet's hovered primary button and hovered card raise this warning although they paint no shadow. Suggested: skip layers with alpha 0.
5b. **Sticky-focus check ignores stacking.** It flags the coffee skip link as "under" the sticky header because their boxes intersect, but the skip link is on top (z-index 20; `document.elementFromPoint` at its centre returns the skip link; screenshot checked). Suggested: test with `elementsFromPoint` and warn only when the bar is above the focused element.
6. **Optional: run `skills/design-frontend/assets/css-audit.mjs`** as a lint check (raw colors, primitives in components, unguarded hover, px type) so token discipline is linted, not only judged.

## design-director
7. **Self-contained rule versus repeat-visit apps.** The rule that test pages inline everything (fonts as base64) is right for a one-visit landing page and costs an app 220 to 290 ms LCP and 62 percent more bytes on every repeat view (research 07 finding 4). Suggested wording: test pages stay self-contained; the build note states the production delivery (external hashed WOFF2 with preload for apps).
8. **Build step.** Name design-frontend's proof step: lint, css-audit, pixel diff for refactors, vitals and weight with the numbers in the delivery note.

## Playbooks
9. design-playbook-dashboard: "content area container query" as the default for KPI strips inside a collapsible sidebar shell (research 07 finding 13).

## kb/TOPIC_MAP.md and kb/INDEX.md (librarian)
10. design-frontend: version 0.2, status testing passed (render test), reference 07 and tools added; note "accessibility moved to design-foundations".
