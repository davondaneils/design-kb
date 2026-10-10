# Rauno Freiberg: home page (practitioner portfolio)

- **URL:** https://rauno.me (final URL https://rauno.me/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/rauno-home.json`); interaction values from scripted wheel, key and click runs reading inline `transform` every 60ms, and from the page's stylesheets. Screenshots: `kb/exemplars/shots/rauno-home-1440-light.jpg`, `rauno-home-390-light.jpg`.
- **Caveats:** the page is not a document. It is a fixed 1440x900 stage (`pageHeight` 6108 is a scroll track) holding a horizontal strip of nine 1200x720 frames that the whole strip scales and translates. The full-page capture therefore shows only the first frame plus empty gray. All `font-size` values below are pre-transform; rendered size is size x scale (scale .882 at rest on 1440, .3 on 390).
- **Strongest in:** motion and interaction (scroll mapped to a spatial canvas, a wireframe toggle), brand, restraint.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `X` (self-hosted, weight 400 only loaded) for all text; tokens also name JetBrains Mono and Georgia (not used on this page) |
| Weights | 400 for everything visible; the h1 computes to 500 but its spans render at 400 |
| Type steps (1440, pre-scale) | 720 ("DD" monogram), 85 (intro sentence), 75 (manifesto), 14 (frame labels). Rendered at scale .882: 635, 75, 66, 14 (labels sit outside the scaled frames). |
| Line height | `normal` everywhere (font default), no set leading |
| Tracking | `normal` everywhere |
| Hero (390) | Same strip, scaled to .3: frames render 360x216 and the 85px sentence renders about 25px. No separate phone layout. |
| Text colors | Ink `#171717` on white frames (17.9:1); black on yellow (19.6:1); labels `#6f6f6f` on `#ededed` (4.29:1) |
| Surfaces | Stage `#ededed`; frames `#ffffff`; one frame and the hero disc in `#FFFF02` |
| Color tokens | Accents declared in Display P3: `--red color(display-p3 .94 .19 .04)`, `--blue color(display-p3 .071 .442 .945)`, `--orange color(display-p3 .99 .4 .02)`, `--neon2 color(display-p3 0 1 .984)`, plus `--yellow-high-contrast color(display-p3 1 .94 .01)` |
| Borders | Minimap tracker 1px `#8f8f8f`; minimap ticks 1x18px `#8f8f8f`, 9px gap |
| Radii | 12px on contact links; 9999px on two round elements; frames square |
| Shadows | None rendered. Tokens: `0 5px 10px`, `0 8px 30px`, `0 30px 60px`, all `rgba(0,0,0,.12)` |
| Frames | 1200x720 (5:3), 40px apart (left offsets step 1240px), labels 14px placed 28px above each frame |
| Spacing tokens | 8px base: 8, 16, 24, 32 ... 88 (`--space-1..11`) |
| Motion | Wheel 1240px moves exactly one frame: `translateX(-1240px)` applies within one frame; scale eases .882 to .805 (60ms) to .779 (120ms) to .761 (240ms) to .758 (300ms) and holds, a decelerating curve over about 300ms. Non-main frames fade in `.35s ease-in-out` after a `.8s` delay on load. Minimap tracker: background, border and opacity `.2s ease-in-out` with a `.2s` delay; ticks fade over 150ms with a 300ms delay. Token `--transitions-snappy: cubic-bezier(.2,.8,.2,1)`. 0 reduced-motion rules. |
| Focus | Frames `:focus-visible` draw `outline: 4px solid var(--colors-focus); outline-offset: 4px` on the sheet; contact links the same |

## What it does right

**Type.** One sans at one weight and default leading, set very large (85px) inside a frame, with alternate lines indented (about 58px rendered at 1440, read from the screenshot) so the sentence "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details" reads like a poster, not a paragraph. The only small type is the 14px gray label above each frame. **Opinion:** the indentation does the job a second weight usually does.

**Color.** Gray stage, white sheets, one loud yellow (`#FFFF02`) disc that overlaps the intro text, so the type crosses from white to yellow mid-word. Other accents are defined in Display P3, so on a wide-gamut screen the orange and neon are more saturated than sRGB allows.

**Layout and spacing.** The home page is a filmstrip: intro, Devouring Details, Craft, History of Software Design, Projects, Field Notes, contacts, and a manifesto, each a 1200x720 sheet. Big words are cropped by the frame edge ("Craf", "Proj"), which turns navigation labels into graphics.

**Hierarchy.** A center crosshair (`+`, `mix-blend-mode: difference`) marks the focal point; a minimap of 1px ticks at top 64px shows position, with a 30x18 outlined tracker for the current frame.

**Imagery and art direction.** No photos and no images (0 img tags); every frame is type, a shape or an SVG (a pixel hand cursor for History of Software Design, handwritten red "Rauno's Field Notes").

**Motion.** Vertical scroll drives horizontal travel 1:1 and the stage zooms out slightly while it moves, settling in about 300ms. Clicking the center crosshair sets `data-debug="true"` and the whole page switches to an X-ray view: text becomes `color: transparent; -webkit-text-stroke: 1px` black and SVG paths get 1px strokes, so you see the construction lines (verified by screenshot).

**Copy and UX.** The last frame is a manifesto: "Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful. Make it." Contact uses `cursor: copy` on the email button. Every frame and link has a 4px focus ring.

**Linked work worth studying (loaded):** https://rauno.me/craft lists 26 dated experiments (Exclusion Tabs, Vanish Input, Wheel Input, Radial Menu, Precision Slider, Flashlight Tabs, Minimap). https://rauno.me/craft/interaction-design ("Invisible Details of Interaction Design", July 2023, about 21,000 characters) covers kinetic physics, spatial consistency, fidgetability, scroll landmarks and Fitts's law. The home page minimap is the same pattern as https://rauno.me/craft/minimap (loaded; the page is the live prototype, little text).

## Borrow
- Map scroll to a spatial axis in whole-frame steps (frame width plus gap, here 1240px), and add a small zoom-out during travel that settles in about 300ms with a decelerating curve.
- A position minimap of 1px ticks with an outlined tracker, transitions 150 to 200ms.
- A debug or X-ray toggle via one data attribute and `-webkit-text-stroke: 1px` with transparent fill: a cheap, memorable way to show craft.
- Define accents in `color(display-p3 ...)` with an sRGB fallback.
- Crop large type with the frame edge to make labels into images.
- `cursor: copy` on copy-to-clipboard controls.

## Do not borrow
- Frame labels `#6f6f6f` on `#ededed` are 4.29:1 at 14px: fails AA for normal text.
- Minimap ticks and tracker `#8f8f8f` on `#ededed` are 2.76:1: fails the 3:1 non-text minimum.
- No `prefers-reduced-motion` rules: scroll-driven travel and zoom run for everyone.
- One layout for every width: on a phone the whole strip is scaled to .3, so body copy renders near 25px but labels and links shrink with it. Fine for a personal experiment, not for a client site.
- Hijacking vertical scroll for horizontal movement breaks the expected scroll model; keep it to showcase pages.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type sizes 14, 75, 85, 720 and `line-height: normal`; none on the scale or the 1.1 to 1.5 leading rules.
- Spacing tokens are an 8px ramp (8 to 88) including 40, 56, 72, 80, 88, off the FOUNDATIONS scale.
- Radii 12 and 9999 in use; tokens 4, 8, 16. 12 is on the scale.
- Shadow tokens use pure black at .12 with no negative spread.
- Zero reduced-motion handling (FOUNDATIONS: always honor it).
