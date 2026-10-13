# Hand-over: Halden Hearing

brief_lint: PASS. Depth: full, 756 words (WARN: aim for 600). Weakest field: proof. Swap test: pass.

## What was decided
| Decision | Evidence level | Where |
|---|---|---|
| Position on time: "independent audiologists, hearing test in Clifton", 90 minutes, no commission | E for the fact (founders); C for the frame (it is the search term in the brief) | `strategy.md` 2 and 3 |
| Concept: the same everyday sentence set twice, as heard (s, f, th gone) and as said | O (opinion), grounded in MedlinePlus and AARP on high consonants | `strategy.md` 7, hero figure |
| Primary distinctive asset: Halden wordmark with an ochre H crossbar | E that shapes and marks are strong assets; O for this one, untested | `mark.svg`, `mark-reversed.svg`, `mark-mono.svg`, `favicon.svg` |
| Damson field and warm paper, ochre accent; breaks the navy, blue and green wall | O, checked against the captured wall | `wall/`, tokens in `home.html` |
| Literata display serif, system sans body at 20px | O | `home.html` |
| Prices shown in full beside a second booking button | C (answers the purchase fear) | section 2 of `home.html` |
| Claims cut: "chains sell in one appointment", "only" | no evidence held | `strategy.md` 4 |

Font path: mixed. Literata (OFL, @fontsource-variable/literata 5.3.0) pinned at opsz 48, wght 500, roman and italic, subset and inlined as base64 (about 41 KB together) with metric-matched fallbacks; body text uses the system sans stack. In production, serve the two subsets as external hashed WOFF2 files with preload, not inline.

## Stand-ins (replace before launch)
- Phone 0117 496 0732 (Ofcom drama range), address "Clifton Village, Bristol BS8", domain haldenhearing.example.
- The avatar Ann and her words are built from the brief and public sources, not from interviews.
- Open client questions are in `discovery.md` stage 2: manufacturer names, fees for aids bought elsewhere, HCPC numbers, hours, whether every appointment is 90 minutes.

## Photo request
Priya and Tom at work (not posed smiling), the soundproof booth, the shop front. These support the type-led image; they do not replace it. No stock faces.

## Not built
Brand guidelines, logo kit beyond the four SVGs, booking flow, other pages (hearing tests, hearing aids, earwax removal, about), state sheet, real photography. Only the hero and the next section exist.

## Checks
- tools/lint.mjs: PASS, 0 fail, 1 warn (fluid display size reaches 88px). JSON in `lint/home.lint.json`.
- claims_inventory: exit 0, 12 strings, each traced to the brief or a cited source (phone and address are stand-ins).
- search-check: PASS, 0 fail, 1 warn (title repeats "hearing", part of the brand name).
- conversion-audit: no fails (`lint/conversion.json`).
- Icon audit: not applicable; no icons (bars are CSS ornaments).
- Renders: 390, 768, 1024, 1440, light and dark, full page and first screen, in `shots/`; mark stress sheet at 16, 32 and 180px in `shots/mark-sheet-1440-light.png`.
- Favicon on dark tab strips: the damson field is about 1.09:1 against the strip; the paper H inside it carries the contrast. Watch this.
- Word swap: the H1 is false for Specsavers, Boots Hearingcare and Amplifon; the two independents are unverified.
- Wall and hide-the-logo: self-assessed pass. Not independent.
- Five-second test: not run. No fresh-context viewer was available in this session. Run it on `shots/first-390-light.png`.

Gate not claimed: this is self-review only. The fundamentals and exemplar rating need the independent critic.

## What I would test next
1. Five-second test with 5 to 8 people over 60: what is this, who is it for, what do I do next.
2. Message test of the H1 against "A hearing test, not a sales pitch" and "Take 90 minutes".
3. Mark misattribution and learnability: show it among the wall logos, ask who it belongs to after a day.
4. Scan the two independents' appointment lengths; if either offers 90 minutes, the swap test weakens and the frame needs the names and no commission to lead.
5. Five to ten patient interviews to replace the stand-in language and supply proof (the weakest field).
