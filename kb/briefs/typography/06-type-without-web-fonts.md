# Brief 06: Excellent type without a font CDN, and type that carries a page

Written by the editor-in-chief, 2026-10-09.

**Question it answers:** When Google Fonts, Adobe Fonts or any font CDN cannot load (blocked network, privacy policy, offline, a single self-contained file), how do we still set type at the level of the exemplars? And when a page has no photography, how does the type itself become the image?

**Audience:** Claude building a page through design-director and a playbook, usually inside a sandbox where only local files and package registries are reachable.

**After reading, a designer can decide:**
- Which of three paths to take: system stack only, self-hosted files (local, npm package, or the client's licensed files), or a mix (one self-hosted voice face, everything else system).
- Which named system stack fits the brand, and what it resolves to on macOS, Windows, Android and Linux.
- How to cut a self-hosted face down (subset, pin variable axes) and what each step saves, in KB.
- How to make the fallback invisible (metric overrides, italic fallback faces) and how to test it.
- How to use the variable system fonts that already exist (SF, Segoe UI Variable, Bahnschrift) and the traps (weight fallback, `ui-*` keywords outside Safari).
- How to set the measure in CSS so it holds in any face (resolves the 66ch versus 32em conflict).
- How type does the heavy lifting on a landing page with no imagery: a display ramp above the tokens, roman and italic in one headline, numerals as graphics, optical margins.

**Fundamentals:** every FOUNDATIONS rule still holds (scale, 1.5 body, measure, contrast, 16px inputs); `font-display` set; no faux styles; license checked before subsetting or inlining; text readable with the font blocked.

**Expert layer:** axis pinning as the biggest size lever; feature loss in CDN-style builds; `from-font` resolving where declared; side bearings at display sizes; the best available ampersand; measure in ch with a lower count.

**Must cover:** modern-font-stacks, MDN font-family generics and `local()`, caniuse for `ui-*`, Apple HIG dynamic optical sizes, Microsoft Segoe UI Variable, Fontsource, OFL modification rules, MDN font-weight fallback, measured CPL table.

**Out of scope or reuse:** loading strategy basics (reference 03), pairing method (02), color of type (design-color), build pipelines (design-frontend).

## Test briefs (rendered, through design-director)
1. **Coffee landing page, no font CDN** (design-playbook-landing; exemplars apple.com product pages, family.co, mercury.com). Start from `kb/tests/design-color/coffee-with.html`; keep its color system; rebuild the type so the page is distinctive with no photography. Light and dark, 390 and 1440.
2. **Analytics dashboard, no font CDN** (design-playbook-dashboard; exemplars Stripe Dashboard, Vercel Dashboard). Start from `kb/tests/design-color/dashboard-with.html`; make numbers, units, paths and dates typographically correct and identical across platforms.
3. **Fallback check** (either page): the same page with web fonts removed must not reflow.

## Rubric
**Gate (any miss fails):** `tools/lint.mjs` exits 0; every `[judged]` row holds; plus these type checks on the screenshots and source: curly quotes and apostrophes, en dash ranges, U+00D7 and U+2212 where needed, units not uppercased, tabular figures on every aligned or changing number, no faux bold or italic, measure 45 to 75 at 1440, fallback page reflows by 0px in the measured sections.

**Exemplar closeness (close / clearly below / far below):**
1. Type as voice: with the logo hidden, would you know the brand from the type alone?
2. Scale contrast: one dominant display moment per screen; body calm.
3. Detail: numerals, units, ampersands, optical alignment of display lines.
4. Delivery: total font bytes, no layout shift on swap, no CDN.

**Pass** = gate 100 percent, rated close on 1 to 3, clearly better than the design-color with-skill page on type.
