# Research 08: Balancing a symbol beside a wordmark (lockup proportion)

Raised by a live job (Flagship Build Co., 2026-10-14), when the owner judged a horizontal lockup "off". Researcher pass by the agency thread, 2026-10-14. Status key: **C** consensus, **X** contested, **O** opinion, **M** measured here.

Finding in one line: no published guide gives a universal symbol-to-wordmark ratio. Good guides anchor the lockup to one unit taken from the logo itself (the symbol height, a letter height, a dot width), lock the gap to that unit, align to type metrics rather than the text box, and settle the last 10 percent by eye for equal visual weight.

## Key findings

| # | Claim | Quote (under 40 words) | Source | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| L1 | Use the symbol's height as the unit; the gap is a fixed fraction of it. | "Maintain a fixed horizontal gap of X / 4 between the icon and the wordmark. The height of the icon defines the unit X." | https://frappe.io/design/identity | 2026-10-14 | 2 (published brand guide) | C |
| L2 | Secondary text aligns to the symbol's optical center, not its box. | Frappe aligns product names "to the optical center of the icon" (search excerpt) | https://frappe.io/design/identity | 2026-10-14 | 2 | C |
| L3 | A letter height from the wordmark can be the unit instead, and lockups align to cap height and baseline. | Scale builds on its lowercase "e"; a partner logo aligns "to the wordmark's cap height and baseline" (search excerpt) | https://brand.scale.com/logo | 2026-10-14 | 2 | C |
| L4 | A glyph part can set the spacing. | "Use the width of the dot in the GOV.UK wordmark to set the spacing." | https://brand.design-system.service.gov.uk/logo-system/brand-hierarchy | 2026-10-14 | 1 (government standard) | C |
| L5 | Symbols with uneven weight are aligned optically, not by measurement. | Metafy aligns optically because the symbol's heavy base weighs differently from the light points of its crown (search excerpt) | https://brand.metafy.gg/latest/brand/logo-gakad5JR | 2026-10-14 | 2 | C |
| L6 | The goal of sizing is equal visual weight. | "Visual balancing should give all logos the same weight." | https://afterpay.com/en-US/for-retailers/resources/marketing/brand-tools/brand-collaborations | 2026-10-14 | 2 | C |
| L7 | Measured sizing gets a small optical tolerance. | Sport Chek allows partner logos to scale "±10%" for better balance (search excerpt) | https://brand-qa2.canadiantire.ca/en/sport-chek/design-system/foundations/co-branding-partnerships.html | 2026-10-14 | 2 | C |
| L8 | Once set, the lockup is never re-spaced. | "never recombine the mark and wordmark at a different spacing or scale than shown here" (search excerpt) | https://www.scrums.com/company/sorted-ui/brand | 2026-10-14 | 3 | C |
| M1 | Sizing the symbol to the full text block (ascender to the bottom of a second line) oversized it; spanning ascender to baseline read balanced. | Flagship: wide three-flag symbol (1.5:1) beside a serif wordmark with a small caps line below. Five variants rendered side by side (full block; ascender-baseline at gap 1/3 and 1/4; cap-baseline; 1.5x cap centered). Ascender-baseline, gap 1/3 chosen. Symbol = 1.08x cap height. | `/mnt/project-files/design-kb/agency/brand/lockup-variants.html` | 2026-10-14 | M | O (one job) |
| L9 | A popular rule sets the symbol at the golden ratio of the wordmark height, but leaves the measure undefined and cites no evidence. | Logomark height divided by "the average height of the logotype" should be about 1.618; "Ensure that the height of the logotype does not exceed the height of the logomark." | https://enthof.com/graphic-designing/the-optimal-logomark-and-logotype-ratio/ | 2026-10-14 | 4 (blog, no sources) | O |
| M2 | The golden-ratio rule gives a 40 percent spread depending on which height is read. | Flagship wordmark measured: x-height 158, average letter height 195, cap height 224 units. 1.618x gives 256, 316 and 362. The shipped lockup (242) sits within 6 percent of the x-height reading. | `/mnt/project-files/design-kb/agency/brand/lockup-golden.html` | 2026-10-14 | M | O |

## What this changes in the skill
- design-graphic 01, Lockups: the old "1.5 to 2 times the cap height" default holds for compact, roughly square symbols only. Wide or dense symbols carry more area per unit of height, so they sit nearer 1 to 1.25 times cap height. Weight, not height, is what has to match (L6, M1).
- Align to type metrics (ascender, cap line, baseline), never to the text box: a second line (descriptor, "Inc.", "Build Co.") hangs outside the symbol like a tagline (L3, M1).
- Gap as a fraction of the symbol height, 1/4 to 1/3 (L1, M1); open it toward 1/3 when the first letter has a serif or a wide sidebearing that already adds optical space (O).
- Render several proportions at display and header sizes side by side and choose by eye; never ship the first arithmetic answer (L5, L7, M1).
- The golden-ratio rule (L9) is a usable starting point only once the measured height is named: for mixed-case words read it on the x-height, for all-caps words on the cap height. It is a start, not proof (M2).
