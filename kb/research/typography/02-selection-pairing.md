# Research 02: Font selection and pairing

Status key: **C** consensus, **X** contested, **O** opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Four pairing methods: superfamily (shared construction, e.g. Freight Sans + Freight Text); look-alikes (shared x-height, proportions, apertures, but distinguishable: Rooney + Skolar good, Apolline + Calluna too similar); contrast on a few properties with distinct roles (FF Meta Serif + Urbana good; Brandon Grotesque + Proxima Nova too alike); historical or tool context (Dederon Sans + Minion, both pen-based). "No clear formulas"; too much contrast is jarring. | Aura Seltzer, Typekit blog, "Type Study: Pairing typefaces" (2012) | C (widely repeated) |
| 2 | Staying within one family or superfamily gives a consistent look across variations. | Google Fonts Knowledge, Pairing typefaces within a family | C |
| 3 | Three type roles: display (expressive is fine), body (avoid stylized faces), functional (plain sans or slab). Ornamental fonts fail beyond one line. Avoid confusable glyphs (l I 1, 5 S, O 0) in critical inputs such as passwords. "Font follows feeling." | Pimp my Type, Typography CPR 2026 | O (practitioner) |
| 4 | Use a professional font; avoid decorative, monospaced, most free fonts and default system fonts for body in documents. | Butterick | O (print and document oriented) |
| 5 | Use system-ui where system fonts suffice, especially for body text, to save downloads. | web.dev font best practices | C |
| 6 | Most used web families 2024 (desktop/mobile): Roboto 15.2/2.7%, Font Awesome, Noto Sans JP, Open Sans 5.6/6.8%, Poppins 4.7/5.8%. | HTTP Archive Web Almanac 2024, Fonts | C (data) |
| 7 | Condensed text took about 11% longer than regular width in glance reading; larger sizes read faster; for single-word glances uppercase was faster than lowercase (not recommended for longer text). | NN/g, Typography for Glanceable Reading (MIT AgeLab study) | C (one study, isolated words) |
| 8 | Avoid Ultralight, Thin, Light weights, especially at small sizes; use Regular, Medium, Semibold, Bold. | Apple HIG Typography | C |
| 9 | Fonts with a larger x-height look bigger at the same font-size (Roboto vs Josefin Sans). | Pimp my Type | C |
| 10 | Geist (Vercel) was designed with a high x-height, short descenders, small-size clarity and a mono companion for developer UIs. | basement.studio, The Birth of Geist | C (case study) |
| 11 | Practitioner tier: Brett (Designjoy) publishes "top 10 favorites in every category" font lists; TypeTogether runs a pairing series (Bely Display + Adelle Sans); Kevin Powell thread on picking fonts without jargon. Leads on current taste, not rules. | x.com/BrettFromDJ/status/1834305695778541949; x.com/TypeTogether/status/1748074941587787864; x.com/KevinJPowell/status/1233125977150062594 | O (practitioner; X pages not fetchable, titles only) |
| 12 | Reference compilations for real-world pairings: Typewolf (Jeremiah Shoaf), Fonts In Use. | typewolf.com, fontsinuse.com | O (curated) |

## Conflicting views
- Butterick dismisses system fonts; web.dev recommends system-ui for performance. Resolution: system-ui is right for product UI where native feel and speed matter; brand and editorial surfaces earn a chosen face.
- Pairing "contrast" vs "harmony": all sources agree contrast must be on one or two properties with matched proportions; the rest is taste.

## Sources
- https://blog.typekit.com/2012/05/23/type-study-pairing-typefaces/
- https://fonts.google.com/knowledge/choosing_type/pairing_typefaces_within_a_family_superfamily
- https://pimpmytype.com/wp-content/uploads/2026/05/Typography-CPR-Workshop-webexpo-2026.pdf
- https://practicaltypography.com/summary-of-key-rules.html
- https://web.dev/articles/font-best-practices
- https://almanac.httparchive.org/en/2024/fonts
- https://www.nngroup.com/articles/glanceable-fonts/
- https://developer.apple.com/design/human-interface-guidelines/typography
- https://basement.studio/post/the-birth-of-geist-a-typeface-crafted-for-the-web
- https://x.com/BrettFromDJ/status/1834305695778541949
- https://x.com/TypeTogether/status/1748074941587787864
- https://x.com/KevinJPowell/status/1233125977150062594
