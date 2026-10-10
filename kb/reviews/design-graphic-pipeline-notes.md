# design-graphic: suggested changes to shared files

From the wave 2 run (2026-10-10). design-graphic does not edit these files; each item is for the owner named.

## For the editor-in-chief (kb/FOUNDATIONS.md)
1. **Icon size and stroke tokens.** design-graphic v0.1 used `--size-icon-sm..2xl`, which the token schema does not have; v0.2 removed them. Proposal: add `--size-icon-{sm,md,lg}` = 12, 16, 20 (plus 24 for toolbars) as primitives and one semantic `--icon-stroke` (default 1.5px, set beside font-weight). Owner: design-graphic with design-polish.
2. **Checklist item 13 (one icon style)** is `[judged]` today. Proposal: back it with `skills/design-graphic/assets/icon_audit.mjs` (mixed caps or joins, hard-coded colors, ink touching the box are fails). Measured case: the combined Tally page passed `tools/lint.mjs` and the polish audit with round and butt caps, round and miter joins, and `#ffffff` and `#000000` inside status icons.
3. **Favicon contrast** in the accessibility findings list: logos are exempt from 1.4.11, but a favicon that vanishes on a gray tab strip fails its job. Proposal (opinion): ink reaches 3:1 against light, gray and dark strips, or the mark sits on its own field (`assets/tab_contrast.py`).
4. Logo contrast exemption vs "WCAG floor everywhere" (carried from wave 1): add one line that logos are exempt per W3C Understanding 1.4.11, with the limits in design-graphic 01.

## For tools/lint.mjs (editor-in-chief adopts checks)
5. **icon-stroke cannot see sprite icons.** It reads `path, line, polyline, circle, rect, polygon` under the `svg`; shapes behind `<use href>` live in a shadow tree and are skipped. Either resolve `<use>` targets or warn when an icon is a `<use>`.
6. **icon-stroke compares against the host's weight**, not the label beside the icon; a nav link at 500 with a bold child label reads as 500. Low priority.
7. Port the two hard checks from `icon_audit.mjs` (one cap and join per page, no hard-coded fill or stroke color in icons 12 to 28px) as fails; keep ink share and partial pixels as warnings.

## For design-director
8. In "Build rules", add: the logo on any page is outlined SVG from design-graphic (never live text), and every page ships a favicon (`<link rel="icon">` as a data URI on single-file pages). Neither combined page had a favicon before this wave.

## For design-polish
9. polish-audit `icon-stroke` passed mixed caps on the combined dashboard (its cap check only sees icons next to Inter text). Point to `icon_audit.mjs` for the set-level check, or widen the selector.

## For design-playbook-dashboard
10. Step 7 or 11: name design-graphic `references/02-icon-systems.md` ("Building a product icon set (code)") for any app with a sidebar or toolbar; the combined page drew icons ad hoc.

## For design-playbook-landing
11. Step 7: add design-graphic `references/01-logo-identity.md` (outlining workflow and tiers) when the brief has no supplied logo files.
