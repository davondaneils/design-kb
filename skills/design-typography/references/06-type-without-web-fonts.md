# Type without a font CDN

Read this when web fonts cannot come from a font CDN: the network blocks Google Fonts or Adobe Fonts, the page must be one self-contained file, the client has a privacy rule against third-party requests, or the build runs offline. The goal is the same type quality as with any font service, never "we fell back to Arial".

Measured facts below come from `kb/research/typography/06-type-without-web-fonts.md` (M1 to M7, with scripts). Run the tools in `assets/` rather than guessing numbers.

## Floor: fundamentals (non-negotiable)

1. **Say which path you took** in the hand-over: system stack only, self-hosted, or mixed, and why. Never pretend a font loaded that did not. `[judged]`
2. **Every stack ends in a generic** (`serif`, `sans-serif`, `monospace`) and lists real, named fonts for macOS, Windows and Android/Linux before it. `[judged]`
3. **Self-hosted files are WOFF2, subset, with `font-display` set** (`swap` with a metric fallback, or `optional`). `[judged]`
4. **The license allows it.** Subsetting, pinning axes and base64 inlining are modifications under the OFL; if the copyright line declares a Reserved Font Name, the modified file must be renamed (OFL FAQ 2.6, 2.7), inside the file's name table and not only in `font-family`: `font_kit.py --family` changes the CSS name only. A glyph the latin file lacks (the rupee U+20B9 and the narrow no-break space U+202F are missing from Fontsource's latin files) comes from a second `@font-face` with the same family on the latin-ext file and its own `unicode-range: U+20B9, U+202F` (round 1, `kb/tests/benchmark/round1/landing/BUILD_NOTES.md` skill problem 14). Commercial EULAs often forbid all three. Read the license first. `[judged]`
5. **Every style you use has a real face, fallback included.** `font-synthesis: none`, and give the metric fallback a separate italic `@font-face`; without it, italics render upright when the web font is missing (measured, M5). `[judged]`
6. **The page reads with the web font blocked.** Render it with fonts removed (`kb/tests/design-typography/fonts/inline.mjs --no-fonts`), check line breaks and contrast hold. `[judged]`
7. **Measure in `ch` with the lower count:** `max-inline-size: 52ch` for body (63 to 68 characters in every text face measured). Never `66ch` (81 to 86 characters). Confirm with `tools/lint.mjs`. `[lint]`
8. All FOUNDATIONS type rules still apply: sizes on the scale, body 1.5, 16px inputs, contrast. `[lint]`

## Standards and facts

| Fact | Source |
|---|---|
| `system-ui` is "the default user interface font on a given platform": SF on Apple, Segoe UI on Windows, Roboto on Android. Not one face. | MDN font-family |
| `ui-serif`, `ui-sans-serif`, `ui-monospace`, `ui-rounded` work in Safari only (desktop 13.1+, iOS 13.4+); Chrome, Edge, Firefox ignore them. | caniuse extended-system-fonts |
| Apple's SF and New York are variable with "dynamic optical sizes" and tracking that the system "adjusts at every point size". On the web, `system-ui` or `-apple-system` gets this for free. | Apple HIG Typography |
| Windows 11's Segoe UI Variable has `wght` and automatic `opsz` (8 to 36pt), but on the web "you will need to specify the Segoe UI Variable font in CSS". | Microsoft Learn, Typography in Windows |
| Bahnschrift (Windows) is a variable font with weight and width. | modern-font-stacks |
| `local()` matches a full or PostScript name; list both. Browsers "may ignore user-installed fonts", so only fonts that ship with the OS are reliable. | MDN @font-face src |
| A requested weight under 400 takes the next lighter installed weight first: `font-weight: 350` on a static family with a Light cut renders Light 300. | MDN font-weight, fallback weights |

## Decision rules

**Pick the path.**
- **If** the page is product UI and cross-platform column alignment does not matter **then** system stack only (zero bytes, native feel).
- **If** it is a data UI where figures must align identically on every OS **then** self-host one text face (for example Inter, 27 KB at 400 to 600, Latin core) with a metric fallback.
- **If** it is a brand or landing page **then** the mixed path: self-host one voice face for display only, pinned to the instance you use (21 to 23 KB per style), and set everything else in the system sans. This spends the byte budget where the brand is. (Opinion; it matches how the measured sizes fall, M2.)
- **If** nothing can be downloaded or inlined at all **then** a named system stack by classification (table below), designed for its worst resolution, plus a stronger display ramp and detail work to carry the voice.

**Where to get self-hostable files with no CDN.** In order: the client's licensed files; the designer's own release (GitHub, the foundry); fonts installed on the machine (`fc-list`, check the license file); npm packages such as Fontsource (`npm pack @fontsource-variable/<family>` downloads OFL WOFF2 files through the package registry, which is often reachable when font CDNs are not).

**Named system stacks** (modern-font-stacks; pick by classification, then design for each resolution):

| Classification | Stack | Usually resolves to (from the stack order; verify on each OS) | Use for |
|---|---|---|---|
| System UI | `system-ui, sans-serif` | SF, Segoe UI, Roboto | Product UI |
| Neo-grotesque | `Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif` | Helvetica Neue (Mac), Arial (Win), Roboto (Android) | Neutral brand sans |
| Humanist | `Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif` | Seravek (Apple), Calibri (Win) | Warm sans body |
| Transitional | `Charter, "Bitstream Charter", "Sitka Text", Cambria, serif` | Charter (Apple), Sitka or Cambria (Win) | Reading serif |
| Old style | `"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif` | Iowan (Apple), Palatino (Win) | Bookish, editorial |
| Didone | `Didot, "Bodoni MT", "Noto Serif Display", "URW Palladio L", P052, Sylfaen, serif` | Didot (Apple), Bodoni MT (Win with Office) | Fashion display only |
| Industrial | `Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif` | Bahnschrift (Win), DIN Alternate (Apple) | Labels, data, sport display |
| Monospace code | `ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace` | SF Mono, Cascadia or Consolas | Code, IDs, paths |

Write the Windows name of the variable system font explicitly before generic fallbacks where you want optical sizing there: `-apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Roboto, ...` (Microsoft Learn says HTML must name it).

**Variable fonts you already have.**
- `system-ui` on Apple: any `font-weight` from 100 to 900 and automatic optical size; do not add your own tracking at display sizes until you have checked it on a Mac, because the system already tightens it (HIG).
- **If** you set an in-between weight (350, 450) **then** only on a face whose `@font-face` declares a weight range; on a static family it snaps to the next lighter cut, so 350 becomes Light 300 (MDN fallback weights). This breaks the "darker theme, lighter weight" trick on Windows and Linux.

**Cut a self-hosted face down** (`assets/font_kit.py subset`), largest saving first, measured on Newsreader roman (M2):

| Step | Size |
|---|---|
| Full Latin variable file (wght 200 to 800, opsz 6 to 72) | 132 KB |
| Narrow wght to 300 to 600 | 117 KB |
| Pin opsz to one value, wght 350 to 550 | 47 KB |
| Pin both (one static instance) | 21 KB |

- **If** a face is used only for display at one weight **then** pin every axis to that instance. Pick the `opsz` for the size range you use (48 for 49 to 112px display).
- **If** you need the font's OpenType features (case, zero, ss01, small caps, oldstyle figures) **then** check the file: CDN-style builds strip them. Fontsource Inter keeps 7 GSUB features; the designer's Inter 4.0 release keeps 40 (M3). Get the full release and subset it yourself with `layout_features = *`.

**Inline or link.**
- **If** the deliverable is one self-contained file (an artifact, an email-like page, this repo's test pages) **then** inline base64 WOFF2 in `@font-face`, small subsets only (opinion: under about 30 KB each, base64 adds a third).
- **Otherwise** separate WOFF2 files, `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the one above-the-fold text face (reference 03).

**Make the swap invisible.** `assets/font_kit.py fallback <webfont> <local metric twin> --local-name "Times New Roman,Liberation Serif"` prints a `@font-face` with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`. Run it for each style you use, italic included (`--style italic`). Measured on the coffee page: 0px shift with overrides, a 75px shift without (M5).

## Numbers
- Measure: `52ch` default body; keep body between about `40ch` and `56ch`. In em, it depends on the face: Inter `32em` gives 66, a Times-width serif `32em` gives 77 (M1).
- Budget (opinion): mixed path 40 to 60 KB of font total; data UI one text face 25 to 50 KB.
- Inter fallback against Arial: size-adjust 107.59%, ascent 90.04%, descent 22.42% (M7). Newsreader display (opsz 48) against Times New Roman: 105.37%, 69.76%, 25.15%; italic 97.07%, 75.72%, 27.30%.

## Ceiling: signature moves

1. **Spend bytes on the voice, not the body.** One display face, pinned, 20 KB per style; body in the visitor's own system sans, which is already the best-hinted face on their screen. The page looks custom at a tenth of a typical web-font payload.
2. **Pin the axes you do not animate.** A variable font's size is in its axes, not its glyphs; pinning `opsz` alone cut 132 KB to 47 KB. Subsetting characters saves far less once you keep the typographic punctuation.
3. **Use the full release, not the CDN build,** when you need `case`, `zero`, `ss01` or small caps. A designer who sets `font-feature-settings: "ss01"` on a Google Fonts or Fontsource Inter is setting nothing (M3).
4. **Fallbacks need their italic too.** Most metric-fallback recipes only override the roman; under `font-synthesis: none` the fallback italic then renders upright, and without it the browser fakes an oblique (M5).
5. **`font-size-adjust: ex-height from-font` goes on the parent, not the child.** `from-font` resolves against the font of the element where it is declared; on a `code` element it measures the mono itself and changes nothing. On `body` it captures the text face's ratio, which children inherit (M4, Chromium; check other engines).
6. **Design the stack for its worst case.** A Transitional stack is Charter on a Mac and Cambria on Windows; size the display ramp and measure for the wider one, and look at a screenshot with the fallback before shipping.
7. **Test with the font blocked.** Render the page with fonts removed and diff section offsets (`kb/tests/design-typography/fonts/swap-shift.mjs`). A heading that rewraps on fallback is a CLS bug you can see in a screenshot.

## Do and don't
- Do: one pinned display face inlined at 21 KB plus a system body. Don't: a 132 KB variable file for three headlines.
- Do: `max-inline-size: 52ch`. Don't: `66ch` (81 to 86 characters measured).
- Do: `font-weight: 450` on a self-hosted variable face with `font-weight: 400 600`. Don't: `font-weight: 350` on a system stack that may resolve to static Inter or Segoe UI with a Light cut.
- Do: `ui-monospace` first in a mono stack with real fallbacks after it. Don't: `font-family: ui-serif` alone, which is Times in Chrome.

## Worked examples
1. **Coffee roaster landing page, CDN blocked** (`kb/tests/design-typography/coffee-type.html`). Path: mixed. Newsreader (OFL, from the Fontsource npm package), roman and italic pinned to opsz 48 and wght 400, 21 + 23 KB, inlined. Body and UI: `-apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif`. Metric fallbacks for both styles; 0px swap shift. Type does the job photography cannot (reference 07).
2. **Analytics dashboard, CDN blocked** (`kb/tests/design-typography/dashboard-type.html`). Path: self-host one text face, because KPI and table figures must align the same on every OS. Inter, wght 400 to 600, Latin core, 27 KB, metric fallback on Arial. Mono paths through the Monospace Code stack; x-heights matched by `font-size-adjust: ex-height from-font` on `body`. Trade-off stated: the Fontsource build has `tnum` but not `zero` or `ss01`; the full release would cost 161 KB for four static cuts.
3. **Internal admin tool, nothing may be downloaded.** Path: system only. `system-ui` stack for everything, `ui-monospace` stack for IDs. No weight below 400. Hierarchy from the FOUNDATIONS ramp and weight (reference 04), tabular figures from the system fonts (SF, Segoe UI and Roboto all have `tnum`; check in each).

## Hand-offs
- Loading strategy, preload, CLS budgets: reference 03 and design-frontend.
- Making type carry a page without imagery: reference 07.
- Color and contrast of display type on brand fills: design-color.
