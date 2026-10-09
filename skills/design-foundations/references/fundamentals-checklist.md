# Fundamentals checklist

Mirror of `kb/FOUNDATIONS.md` v0.2. FOUNDATIONS is the source of truth.

Every rendered test page must pass every item. One miss fails the page, however good the rest is. `[lint]` items are hard gates enforced by `node tools/lint.mjs <page.html>` (nonzero exit on any fail); `[judged]` items are checked by the tester on the screenshots from `node tools/render.mjs`.

| # | Item | How |
|---|---|---|
| 1 | WCAG 2.2 AA automated rules (axe-core tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa), light and dark scheme, 390 and 1440px | [lint] |
| 2 | Text contrast 4.5:1 body, 3:1 large; contrast cases axe cannot decide (text on images, gradients, overlaps) | [lint] for decidable pairs, [judged] for "needs review" warnings |
| 3 | Non-text contrast 3:1 for input borders, icons and focus indicators | [judged] (axe does not measure it); measure with `skills/design-color/assets/oklch_scale.py check` |
| 4 | Targets at least 24x24 CSS px (inline text links exempt); 44x44 preferred on touch | [lint] fail under 24, warn under 44 at 390px |
| 5 | Body line length 45 to 75 characters at 1440px, at most 75 at 390px | [lint] |
| 6 | Every font size on the type scale (fluid display sizes of 39px and up allowed with `clamp()`) | [lint] |
| 7 | Every margin, padding and gap on the spacing scale | [lint] |
| 8 | No horizontal scroll at 390px | [lint] |
| 9 | Visible focus on every element in the tab order (2px ring, 2px offset by default) | [lint] presence; [judged] 3:1 contrast of the ring |
| 10 | If anything moves, `prefers-reduced-motion: reduce` removes the movement | [lint] |
| 11 | No information by color alone (errors have icon plus text, links underlined in body copy, charts labelled) | [judged] |
| 12 | Hierarchy: one clear primary action per view, headings in order, scan path obvious | [judged] (heading order partly by axe) |
| 13 | Consistency: tokens from the schema, one radius family, one icon style, aligned edges | [judged] |
| 14 | Both themes designed (not inverted) when the brief asks for dark mode | [judged] |
| 15 | States: hover, focus, active, disabled, error, empty and loading exist where the page needs them | [judged] |

## How to run it
From the design-kb repo root (`tools/` needs Node and the Chromium that Playwright finds; see `tools/package.json`):

```sh
node tools/lint.mjs page.html            # [lint] items; exit 1 on any fail
node tools/render.mjs page.html out/     # 390 and 1440px, light and dark screenshots
```

Then walk the `[judged]` rows on the screenshots, in order. Accessibility detail behind items 1 to 4, 9 to 11: `accessibility.md`.

If you cannot run code: say so, check every item by reading the code, and label the result unverified.
