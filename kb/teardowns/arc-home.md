# Arc: home page (and the browser UI in its product shots)

- **URL:** https://arc.net (final URL https://arc.net/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/arc-home.json`); headline, sub, button and section-head details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/arc-home-1440-light.jpg` (capped at 6000px; page 6,125px), `arc-home-390-light.jpg` (3,639px, full). Caveats: in the 1440 capture the press-quote section and the first product shot are washed out (a scroll-linked fade the full-page capture froze); the measure's 1440 `h1Style` caught the h1 at zero width, so h1 values come from the probe. The page now leads with Dia, the company's newer browser, above Arc itself. The wavy band edges and blue grain are images or SVG and were not measured. Browser UI values are **estimates read from screenshots**, not measured from the app.
- **Strongest in:** brand (a playful system: soft rounded display, electric blue, wavy edges), color, product-ui (sidebar browser shown in themed screenshots), copy.
- Everything below is measured unless marked opinion or estimate.

## Measured values

| Area | Value |
|---|---|
| Families | Seven: `Marlin Soft SQ` display (62% of characters), `InterVariable` body, `Marlin` (buttons, footer), `ABC Oracle` (Dia sub and button), `ABC Favorit Mono` (handles, labels), `Exposure VAR` serif (Dia headline), system UI |
| Weights | 700 on every Marlin Soft heading and testimonial; Inter 500 body (not 400); Oracle 400; mono 400 and 700 |
| Type steps (1440) | 45.5 (h1, a press quote), 40 (section heads), 36 (Dia headline), 28 (testimonials, closing head), 24 (Try Dia), 20, 17 (body), 16, 14, 13, 12 |
| Line height | 45.51/42.25 (0.93), 40/39 (0.975), 36/36 (1.0), 28/30 (1.07), 20/24 (1.2), 17/25.5 (1.5) |
| Tracking | Marlin Soft at -0.04em (-1.82px at 45.5, -1.6px at 40), -0.05em at 28 (-1.4px); Exposure -0.02em (-0.72px at 36); small labels positive: 12px at +0.4px, +0.6px and +1.8px (+0.15em on "More Details") |
| Hero (390) | Dia headline wraps to two lines; section heads 27.2px/26.52, -1.6px (-0.059em); h1 quote 32px/31.2 (-0.05em) |
| Text colors | Electric blue `#3139fb` as text on cream `#fffcec` (6.56:1) and white (6.75:1); cream `#fffcec` on blue (6.56:1); body `#696969` on white (5.49:1); Dia sub black at 65% on cream (6.9:1); indigo `#2702c2` (white on it 11.21:1) |
| Surfaces | `#ffffff` product sections; `#3139fb` bands (nav, quote band, closing CTA, footer); cream `#fffcec` body and testimonial band; Dia button black at 85% |
| Accent | The blue is the brand, used as both background and text. Indigo `#2702c2` for the Mac download button. Pastel gradient wash (pink, peach, lavender) behind the Dia hero, read from the capture. |
| Borders | 2px `#3139fb` (4 uses); otherwise none |
| Radii | 8px nav items, 10px download buttons, 22px Try Dia (16px on phone), 4px |
| Shadows | Buttons `rgba(0,0,0,.1) 0 5px 5px`; Try Dia `rgba(0,0,0,.25) 0 2px 8px` |
| Buttons | "Try Dia" 214x76: app icon tile, ABC Oracle 24px/400, arrow; black at 85%, radius 22, padding 8 22 8 8. "Download Arc for Mac" 273x45, `#2702c2`, white, radius 10. "Download Arc for Windows" 273x45, white with `#2702c2` text. |
| Container | 1344 and 1400px; headings capped at 700px (h1) and 900px (subs) |
| Spacing | Gaps 12, 16, 8, 6, 24; padding 24, 8, 32, 4, 16; section padding 128/128 at 1440, 64/64 at 390; 72px top |
| Motion | Links `transform, background .15s ease`; buttons `transform .15s ease, box-shadow .15s ease-out` (press feedback); `opacity .1s ease-out`; press-quote marquee `78.5s linear infinite`. 0 reduced-motion rules. |
| Body measure | Dia sub 20px on one line 805px wide: 82 characters. Phone: 41. |

## What it does right

**Type.** A soft-cornered rounded grotesk (Marlin Soft SQ) at 700 and -0.04em to -0.05em, line height under 1.0, in electric blue on white or cream on blue. Body is Inter at 500, not 400, at 17px/25.5: it matches the weight of the chunky display. Small labels go the other way, positive tracking and mono. Dia gets its own voice (Exposure serif and Oracle), so the successor product reads as a different brand on the same page.

**Color.** One saturated blue `#3139fb` does everything: nav band, quote band, headings on white, closing CTA, footer. Cream `#fffcec` instead of white for text on blue and for the testimonial band. Inside the screenshots, each browser Space has its own gradient (orange to pink, pink to mauve), so color variety comes from the product, not the page.

**Layout and spacing.** Centered single column throughout. Bands alternate blue, cream and white, separated by scalloped wavy edges. Each feature is a centered 40px blue head, a 17px gray line, then one large product screenshot. Four testimonials in a row on cream, each with a mono handle chip ("@BEEBOMCO").

**Hierarchy.** The only `h1` is a press quote ("Arc is the Chrome replacement I've been waiting for."), credited to The Verge, set cream on blue. There are no `h2` or `h3` elements; section heads are `p` and `div`. **Opinion:** visually clear, structurally empty.

**Imagery and art direction.** Real product screenshots, each themed: a photo gallery Space, a home-goods shopping Space, a zine in Split View with a theme picker. Blue bands carry a visible grain. Small hand-drawn icons (peace sign, heart) above testimonials.

**Motion.** Tactile, not decorative: 150ms transform on press, shadow easing out. A slow 78s press-quote marquee ("Rethinking the fundamentals of how we use the web." Bloomberg).

**Copy and UX.** Short, warm heads with periods: "Space for the different sides of you.", "Your perfect setup.", "The comfort of privacy." Closing head with one italic word: "Enter *your* new home on the internet". Download buttons name the platform. An honest notice above them: "FYI: Arc receives Chromium updates only."

## Browser UI in the published product shots (estimates read from screenshots)
- **No tab strip.** Tabs, URL and controls live in a left sidebar about 22% of the window (estimate). Traffic lights, sidebar toggle, back, forward and reload share the sidebar's top row.
- **URL field** is a rounded pill inside the sidebar ("mmmhome.io") with link and settings icons, not a toolbar across the page.
- **Favorites:** a row of four square tiles with app icons (Gmail, YouTube); Dia shows a 3x2 grid with a calendar tile badged "in 3m".
- **Pinned:** a folder tree under a small gray label ("Home": Read Later, Shopping, Trip Planning!, nested Itinerary and Travel Docs). Then "+ New Tab", then today's tabs.
- **Active tab:** a white rounded pill with a soft shadow; inactive tabs have no fill.
- **Bottom row:** archive icon, Space dots (one per Space), plus.
- **Theme:** the whole sidebar and window frame take the Space's gradient; web content sits in an inset white card with rounded corners (about 8px) and a thin frame of the theme color around it.
- **Dia chat:** right-aligned light blue user bubble, a collapsed "Thought for 5 seconds" line, a bold answer lead, then gray body text.

## Borrow
- One saturated brand blue used as both background and text, with cream `#fffcec` as its partner instead of white.
- A rounded display face at 700, -0.04em, line height under 1.0; body at 500 to match its weight.
- Positive tracking (+0.4 to +1.8px) on 12px mono labels.
- Download buttons that name the platform, paired filled and outlined.
- Press feedback as a 150ms transform, not a color swap.
- Sidebar-browser pattern: URL as a pill in the sidebar, content as an inset card framed by the theme color.

## Do not borrow
- A press quote as the page's only `h1` and no `h2`/`h3`: screen readers and search get no outline.
- Seven font families on one page.
- An 82-character single-line sub at 1440.
- No readable `prefers-reduced-motion` rule while a marquee runs forever.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 17, 28, 36, 40, 45.5 are off the 1.25 scale; 45.51px is a fluid value.
- Display line height 0.93 to 1.07 at 28 to 45px (FOUNDATIONS: 1.1 to 1.25 under 100px).
- Body 17px at weight 500 (FOUNDATIONS: 16px root, regular).
- Radii 10 and 22px alongside 4 and 8.
- Body measure 82 characters at 1440 (FOUNDATIONS: 45 to 75).
