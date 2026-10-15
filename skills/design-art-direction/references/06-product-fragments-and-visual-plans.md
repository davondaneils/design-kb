# 06 Product fragments and visual plans

Sources: live measurements in `kb/teardowns/motion-imagery.md` (choreo-probe, 2026-10-13), the per-site teardowns (`stripe-home.md`, `linear-home.md`, `framer-home.md`, `raycast-home.md`, `apple-macbook-air.md`, `mercury-home.md`), screenshots in `kb/exemplars/shots/`, and the benchmark critic `kb/reviews/benchmark-round2-landing.md`. Values read off a screenshot for this chapter say so. Opinion is marked (opinion).

Why this chapter exists: the benchmark's marketing page passed the gate on imagery and still rated "clearly below" in both rounds. The product appeared once, as one table, on one screen in seven; Stripe shows it on 14 of 17 screens through about 12 mock-ups, Linear on 10 of 12 (`motion-imagery.md` section 1). The difference is not talent. It is a plan written before code, a fragment set built as a family, and a phone layout that crops instead of deleting.

## Floor: fundamentals (non-negotiable)
1. **A visual plan exists before code**: one row per screen-height slice at 1440 (900px) and 390 (844px), each with a visual, its job, its kind and its phone crop, plus one treatment line, the fragment set and any named type beats. [judged: the critic reads it in the build notes]
2. **Coverage**: a visual with 15% or more cover on at least 70% of counted slices, at 1440 and at 390. [`assets/visual-plan-check.mjs` `coverage`]
3. **Fragments**: a product page shows at least three distinct fragments at different scales or crops; the phone keeps all but at most one. [`visual-plan-check` `fragments`, `dropped`]
4. **One treatment**, declared once (`--visual-treatment` on `:root`) and shared by every visual. [`visual-plan-check` warns `treatment`; judged on the thumbnail audit, 01]
5. **Fragments are `aria-hidden` decoration with a visible caption**, and every fact they show also lives in the section's real text. [`visual-plan-check` warns `naming`; judged]
6. **Sample data is labelled and foots** at displayed precision, across fragments as well as inside each. [judged; `claims_inventory.mjs` for dates]
7. **No control inside a fragment**: fake buttons are `div`s with no handler and no tab stop, so the lint's `primary`, `targets` and `dead-control` checks see only real controls. [lint]
8. **Mock-up type stays on the scale**: computed sizes are scale steps (12px and up); smaller rendering comes from `transform: scale()`, not from 9px CSS. [lint `type-scale`]

## Standards
- FOUNDATIONS v0.5, Motion, "Visual plan": 70% of screens at 1440 and 390, three or more fragments on a product page, one stated treatment, `data-visual` labels.
- WCAG 2.2: 1.1.1 (fragments hidden, facts in text), 1.4.3 (text in fragments still meets 4.5:1 against the shell; it is cheap to keep and the lint's axe pass may read it), 1.4.11 (meaningful marks such as chart bars at 3:1), 2.2.2 (a fragment that animates past 5 seconds needs a pause, design-motion).
- FOUNDATIONS shadow recipe: tint from `--shadow-rgb`, x = 0, alpha 0.25 or under, negative spread allowed; dark themes use ring plus highlight, no drop shadow.

## Exemplar patterns (measured)
| Site | Screens with visual (1440) | Fragments (1440 / 390) | The treatment that unifies them |
|---|---|---|---|
| Stripe | 14 of 17 | 12 / 14 | Hero gradient as every card's fill, one radius, the below-only shadow `0 30px 45px -30px` plus `0 18px 36px -18px`, UI text 9 to 12px |
| Linear | 10 of 12 | 5 / 4 | Near-black surfaces stepped 1 to 3 lightness points, one line weight, mono "FIG 0.x" captions |
| Framer | 12 of 12 | 10 (plus 7 videos) / not measured | Every visual is the product's own canvas; brand blue only as the selection color inside mock-ups |
| Raycast | 13 of 18 | 4 / not measured | One window chrome; glow color matches the section |
| Vercel | 5 of 7 | 0 | Type and grid are the picture (the floor) |
| Benchmark Ferry | 1 of 7 | 0 detected (1 card) | none stated |

Sources: `motion-imagery.md` sections 1 and 3; Stripe at 390: 19 of 25 screens, median cover 81%.

Read off the screenshots for this chapter (`stripe-home-1440-light.jpg`, `stripe-home-390-light.jpg`, `linear-home-1440-light.jpg`):
- Stripe's bento card titles are verbs ("Accept and optimize payments globally", "Enable any billing model", "Embed payments in your platform"), and each card's fragment acts out that verb (checkout plus terminal, usage meter plus chart, connected accounts plus an order card).
- The gradient enters each card from a corner or an edge; the card's top-left stays white for the title.
- Fragments bleed off the card edge: the checkout window runs off the right side, cutting the order summary's amounts ("$150.").
- Layering: the "Daybreak Yoga" order card overlaps the Connected Accounts window by about 150px, over its sidebar only; the terminal and the checkout stand 39px apart, not overlapping.
- The terminal's numbers foot: Mocha Latte $5.50, Loyalty (10% off) minus $0.55, Tax $0.51, Total $5.46.
- At 390 the bento becomes one column and each card keeps a fragment, scaled to the card width.
- Linear captions its three principle figures "FIG 0.1", "FIG 0.2", "FIG 0.3" in small mono, top-left above each figure; its hero window carries a second panel (the agent chat) laid over the issue view's right rail.

## Decision rules
- **If the page sells software, the fragment is the default visual for every feature section.** Photography and illustration are for the company story, people and abstract principles.
- **If a section heading names a verb, the fragment shows that verb at the moment it happens**: the accepted option highlighted, the matched deposit tagged, the reminder scheduled. Never the dashboard home.
- **If two sections would show the same screen, crop differently**: one shows the table, the other zooms to one row and its detail. Same screen at the same crop twice counts as one fragment (opinion).
- **If a fragment carries a total, it carries the rows that make the total**, or the total sits in a front fragment over a back fragment that shows the rows.
- **If a fragment overlaps another**, the front one covers chrome (sidebar, title bar, a secondary rail), never a row of data, at every width. Re-check at 768 and 390: a crop that moves the back window moves its data under the front card.
- **If the fragment is wider than its stage at a width**, scale it (0.6 to 0.8 at 390, about 0.7 at 768) and translate it so the meaningful column sits inside; let chrome fall off the edge.
- **If photos are in the set**, the treatment line names one grade, one light direction and one background tone (02); fragments and photos share the radius and the caption style.
- **If a slice has nothing worth showing**, it is a type beat: name it in the plan and mark the section `data-beat="type" data-beat-name="..."`. If more than 30% of slices are beats, the page is type-led: use design-typography reference 07 and say so in the plan.
- **If you cannot say the job of a visual in one sentence** (proves, shows, explains, orients), cut it and make the slice a beat.

## Numbers
| Item | Default |
|---|---|
| Slice height | 900px at 1440, 844px at 390 (the probe's viewports) |
| Visual threshold per slice | 15% cover (the probe's threshold) |
| Coverage | 70% of counted slices, both widths |
| Fragments | 3 or more on a product page; phone count at least desktop count minus 1 |
| Fragment rows | 3 to 6 meaningful rows (opinion) |
| Fragment type | computed `--text-xs` (12px) to `--text-2xl` (31px) for the hero number; rendered 9 to 12px for row text after scaling |
| Phone scale | 0.6 to 0.8 (`--fragment-scale`), from the top left |
| Overlap | `--space-6` (24px) minimum, up to the back fragment's chrome width (opinion; Stripe about 150px over a sidebar) |
| Shell | `--radius-lg` (12px) inside a `--radius-xl` (16px) stage; one ring; `--elevation-fragment` |
| Shadow | each layer's negative spread equals its y offset; alpha 0.25 and 0.10 |
| Caption | `--font-mono`, `--text-xs`, `--color-text-muted`; number in `--color-text` |

## 1. The visual plan, worked: Northlight (sample invoicing product)
Brief: invoicing and payments for small design studios. Product page. No photos. Concept (01): "the money's path": every visual is one step of one sample job, quote to bank.

**Plan at 1440 (slices of 900px)** as built in `assets/fixtures/visual-plan-good.html`:
| Slice | Visual | Job | Kind | 390 crop |
|---|---|---|---|---|
| 1 (0 to 900) | App window: invoice INV-0142, payment card in front over the sidebar | proves the core promise: quote to paid in one place | product | scale 0.6, window moved left so the invoice column fills the stage; sidebar and activity rail fall out; card moves below, over the window's bottom edge |
| 2 (900 to 1800) | Bento row 1: quote with options; invoice with deposit | shows the first two steps | product, product | one column, each fragment kept at 0.72 |
| 3 (1800 to 2700) | Bento row 2: client pay page; bank matching | shows the last two steps | product, product | same |
| 4 (2700 to 3600) | Reminder schedule (FIG 0.6); cash forecast bars (FIG 0.7) | explains chasing; proves the forecast | product, chart | kept, 0.72; chart reflows |
| 5 (3600 to 4500) | Pricing | type beat "pricing" | beat | beat |
| 6 (4500 to 4896, stub) | Payment notice, small | closes the story at a new scale | product | kept, 0.72 |

- **Treatment**: `echo-fill`. `--visual-fill` (two radial gradients from `--color-illustration-accent` and `--color-illustration-accent-fill` over `--color-illustration-surface`) behind every fragment, entering from the bottom right; one shell (`--radius-lg`, `--elevation-fragment`); one caption ("FIG 0.n", mono). The chart's bars take `--color-illustration-accent` so the chart joins the family.
- **Fragment set**: 7 fragments at 4 scales (full window, card, small notification, a timeline), one dataset: quote Q-0088 Standard $12,640.00, invoice INV-0142 with a 30% deposit ($3,792.00) and a balance of $8,848.00, paid Tue, Oct 13, matched Thu, Oct 15; INV-0137 $5,400.00 due Tue, Oct 20 is both the reminder and the first forecast bar.
- **Type beats**: pricing.

Check output on the fixture (2026-10-13):
```
1440 (labelled visuals): visual on 4 of 4 counted slices (100%; 6 slices, type beats excused: pricing); product fragments 7
390 (labelled visuals): visual on 7 of 7 counted slices (100%; 8 slices); product fragments 7
treatment: echo-fill
PASS
```
On the benchmark's Ferry page with `--product`: 1 of 6 counted slices at 1440 (17%), 1 of 8 at 390 (13%), 0 fragments: FAIL on coverage and fragments at both widths.

## 2. The fragment family in code
Component tokens live in the token block with the FOUNDATIONS tokens they are built from. They are not FOUNDATIONS tokens (yet); they are this page's statement of its treatment.
```css
:root {
  --visual-treatment: echo-fill;                 /* the name the check compares */
  --visual-fill:
    radial-gradient(60% 70% at 100% 100%, var(--color-illustration-accent-fill) 0%, transparent 70%),
    radial-gradient(80% 90% at 85% 100%, var(--color-illustration-accent) 0%, transparent 75%),
    var(--color-illustration-surface);
  /* below-only: each layer's negative spread equals its y offset */
  --elevation-fragment: var(--ring),
    0 32px 48px -32px rgb(var(--shadow-rgb) / 0.25),
    0 16px 32px -16px rgb(var(--shadow-rgb) / 0.10);
  --fragment-scale: 1;
  --fragment-window: 920px; --fragment-card: 460px; --fragment-toast: 288px; --fragment-rail: 176px;
  --stage-lg: 560px; --stage-md: 440px; --stage-sm: 340px; --stage-xs: 300px;
}
@media (prefers-color-scheme: dark) {
  :root { --elevation-fragment: var(--ring), var(--highlight); }  /* FOUNDATIONS: no drop shadow in dark */
}
```
The stage crops and carries the fill; the position wrapper scales; the shell is the product.
```css
.stage { position: relative; overflow: clip; border-radius: var(--radius-xl);
         background: var(--visual-fill); border: 1px solid var(--color-border); }
.frag-pos { position: absolute; transform-origin: 0 0; transform: scale(var(--fragment-scale)); }
.frag { background: var(--color-surface); color: var(--color-text); border-radius: var(--radius-lg);
        box-shadow: var(--elevation-fragment); font-size: var(--text-xs); line-height: var(--leading-normal); overflow: hidden; }
.frag__bar { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4);
             border-bottom: 1px solid var(--color-border); }
.row { display: flex; justify-content: space-between; gap: var(--space-4); padding-block: var(--space-3);
       border-bottom: 1px solid var(--color-border); }
.num { font-variant-numeric: tabular-nums; }
.fig { display: grid; grid-template-columns: auto 1fr; gap: var(--space-3); margin-top: var(--space-3);
       font: var(--text-xs)/var(--leading-normal) var(--font-mono); color: var(--color-text-muted); }
.fig__n { color: var(--color-text); }
```
One fragment (the other six follow the same pattern):
```html
<figure>
  <div class="stage" data-visual="product" aria-hidden="true">
    <div class="frag-pos pos-b"><div class="frag w-card">
      <div class="frag__body">
        <div class="row"><span class="big">INV-0142</span><span class="chip chip--due">Due Tue, Oct&nbsp;13</span></div>
        <div class="row"><span class="muted">Subtotal</span><span class="num">$12,640.00</span></div>
        <div class="row"><span class="muted">Deposit paid, 30%</span><span class="num">&minus;$3,792.00</span></div>
        <div class="row"><span class="strong">Balance due</span><span class="num big">$8,848.00</span></div>
      </div>
    </div></div>
  </div>
  <figcaption class="fig"><span class="fig__n">FIG 0.3</span><span>Invoice INV&#8209;0142, balance after deposit. Sample data.</span></figcaption>
</figure>
```
Notes that matter:
- `data-visual` goes on the **stage**, the cropping window, so the check measures what is seen. On the shell it would count the overflow that is clipped.
- No whitespace between the caption's two spans: the gap supplies the space (the lint's `double-space` check fails a flex or grid gap plus a space). Non-breaking hyphens keep "INV&#8209;0142" whole.
- The bento:
```css
.bento { display: grid; gap: var(--space-5); }
@media (min-width: 768px) { .bento { grid-template-columns: 1fr 1fr; } }
.card { display: grid; grid-template-rows: auto 1fr; border: 1px solid var(--color-border);
        border-radius: var(--radius-xl); overflow: clip; background: var(--color-surface); }
.card__head { padding: var(--space-6) var(--space-6) var(--space-5); }
.card .stage { border: 0; border-radius: 0; block-size: var(--stage-sm); }
.pos-a { left: var(--space-8); top: var(--space-7); }
.pos-b { left: var(--space-10); top: var(--space-7); }
```
- Layering in the hero: the window starts at `calc(var(--space-11) + var(--space-9))`, its rail is `--fragment-rail` wide, and the card at `--space-8` is `--fragment-toast` wide, so the card ends inside the rail: it covers 144px of sidebar and no data.

## 3. The phone and tablet crops (crop, never drop)
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .stage--hero { --fragment-scale: 0.7; block-size: var(--stage-md); }
  .hero .pos-app { left: calc(-1 * var(--space-9)); top: var(--space-6); }
  .hero .pos-toast { left: var(--space-11); top: calc(var(--space-11) + var(--space-10) + var(--space-3)); }
}
@media (max-width: 767px) {
  :root { --fragment-scale: 0.72; --stage-lg: 420px; --stage-md: 340px; --stage-sm: 240px; --stage-xs: 240px; }
  .stage--hero { --fragment-scale: 0.6; }
  .hero .pos-app { left: calc(-1 * var(--space-10)); top: var(--space-6); }
  .hero .pos-toast { left: var(--space-11); top: calc(var(--space-11) + var(--space-9)); }
  .pos-a, .pos-b { left: var(--space-5); top: var(--space-6); }
}
```
How to pick the numbers: (1) name the meaningful region of each fragment (the invoice column, the totals); (2) choose the scale so that region's width fits the stage: 0.6 x the 920px window puts the invoice column (about 500px at scale 1) at about 300px inside a 358px stage; (3) translate so the region's left edge sits about `--space-5` inside the stage; chrome falls off the left; (4) move the front fragment so it still overlaps chrome (here, the window's bottom edge), not a row. A 12px row text renders at 7 to 9px after scaling: decoration, readable as texture, and the facts are in the section copy.

Lint note: with `transform: scale()` the lint's `word-break` check compares scaled glyphs against unscaled padding and reports chips as 2px tight at 390. The fixture sets `data-lint-skip="word-break"` on each stage and says why in a comment; the same chips pass at 1440 where the scale is 1.

## 4. Captions: one figure system
- Number every visual on the page in order ("FIG 0.1" to "FIG 0.8"), mono, `--text-xs`, the number in `--color-text`, the description in `--color-text-muted`. Linear's version sits top-left above each figure (`linear-home.md`, Layout).
- The caption does three jobs at once: it is the `aria-hidden` fragment's accessible description, it carries the "Sample data" label, and it makes a mock-up read as evidence rather than decoration (opinion).
- One caption style for fragments, charts, photos and renders. A second caption style is a second treatment.

## 5. Photography in the plan
When photos are part of the set (02 for picking and cropping):
- **One grade** (one LUT, or monochrome or duotone for mixed sources), **one light direction** (side light from one window side across the set), **one background tone per section** (Apple shoots its product on one gradient field matched to the product color; `apple-macbook-air.md`, Imagery). Write the three in the treatment line: `--visual-treatment: warm-grade` plus the grade, the light side and the background token.
- Photos and fragments share the stage radius and the caption; a photo never gets the fragment's drop shadow (it is a window, not an object) (opinion).
- Mercury unifies 16 photos with one warm, soft, desaturated grade (`motion-imagery.md` section 3). Five filters from five sources is five treatments.

## 6. Photography-grade visuals with no image host
When there is no photo and no image host, render objects in HTML, CSS or SVG, openly as renders (fundamental 1). What makes a render read as finished rather than as a placeholder (opinion, built on 04 recipes 4 and 7 and on Stripe's gradient-rendered issuing card, `stripe-home-1440-light.jpg`):
1. **One light, stated once.** `--light-angle: 160deg` (light from the top left) used by every gradient on every rendered object; one direction across the page, as Apple holds one lighting setup per section.
2. **Real proportions**: `aspect-ratio` from the object (a payment card is 85.60 by 53.98 mm, the ISO/IEC 7810 ID-1 format, about 1.586:1; https://www.iso.org/standard/70483.html).
3. **Two-layer below-only shadow** from the fragment recipe, plus a 1px top highlight (`--highlight`) for the edge catching the light.
4. **Material**: grain at 5 to 12% opacity (04 recipe 4) on matte surfaces; none on glass or screens.
5. **The brand fill as the object's surface** (Stripe's card carries the hero gradient), so the render joins the treatment.
6. **Live HTML for every word on the object** (the label, the name, the last four digits), set on the type scale.
7. **Caption it as a render**: "FIG 0.4 Card render. Sample data."
```css
:root { --light-angle: 160deg; }   /* light from the top left, for every rendered object */
.render-card { aspect-ratio: 1.586; border-radius: var(--radius-xl);
  background: linear-gradient(var(--light-angle), rgb(255 255 255 / 0.35), transparent 40%), var(--visual-fill);
  box-shadow: var(--highlight), var(--elevation-fragment); }
```
Never imitate a photo of a real person or place in CSS or with a generator presented as real (01, 04, design-graphic 03).

## Signature moves (each with its reason)
1. **Echo the hero fill behind every fragment** (Stripe): one color budget, twelve mock-ups, one family.
2. **Stage, position, shell**: three wrappers with three jobs (crop and fill, scale and place, be the product), so the 390 crop is two custom properties, not a redesign.
3. **The back fragment bleeds, the front one carries the number** (Stripe's checkout cut at "$150." behind a terminal whose $5.46 foots): cropping is allowed to cut what another fragment states whole.
4. **One dataset across the page**: Q-0088 to INV-0142 to the $8,848.00 deposit. A reader who checks one number meets it again, adding up; the benchmark's figures were true per card and false across the page.
5. **Verb fragments**: the fragment shows the section's verb at its moment, so the bento reads as a sentence of steps rather than five screenshots.
6. **Scale variety inside one family**: full window, card crops, a small notification, a chart. Variety of scale is what makes many mock-ups feel art-directed (opinion).
7. **Mock-up type on the scale, scaled by transform**: the lint and the exemplars agree; the eye gets 9px, the computed style stays 12px.
8. **Name the beat**: a deliberate empty slice with a name is composition; an unnamed one is a gap.

## Do and don't
| Do | Don't |
|---|---|
| `data-visual` on the cropping stage | `data-visual` on a shell that overflows its stage |
| A fragment per feature, showing the feature's verb | The same dashboard screenshot under every heading |
| Scale 0.72 and crop to the totals at 390 | `display: none` on the bento at 390 |
| Front card over the back window's sidebar | Front card over the back window's line items |
| `--visual-fill` defined once, used everywhere | A new gradient per card |
| "FIG 0.3 Invoice INV&#8209;0142. Sample data." | No caption, and real-looking data no one is told is invented |
| 12px computed, rendered 9px by `transform` | `font-size: 9px` inside the mock-up |
| A `div` styled as "Pay $8,848.00" | A real `button` inside an `aria-hidden` mock-up |

## Worked example 2: a physical product with photos (Ember and Oak, from 01 and 02)
Plan rows: hero, the bag photographed on the oak bench in side light from the left, its live HTML label (04, expert move 14), kind photo; origins, three contour tiles (data art, kind illustration); process, the roaster photo cropped to the drum door (photo); the roast curve (chart); subscription, a type beat ("subscription") with the price at display size; footer, the roastery's coordinates (illustration). Treatment: `warm-grade`: warm monochrome for people and places, true color for beans and bags, light from the left in every frame, the warm 50 background tone per section, contour lines at one 1px weight. 390: the bag photo moves to its 4:5 crop with `object-position` on the label; the contour tiles become a horizontal row of three at 1:1, never hidden. Coverage is planned at 5 of 6 slices.

## Worked example 3: a developer tool, dark (Linear-like)
Plan rows: hero, the full app window (issue view) with an agent panel over its right rail (product); principles, three wireframe line figures at one weight, captioned FIG 0.1 to 0.3 (illustration); intake, a thread fragment beside a board fragment (product, two crops); a changelog list fragment (product); a customer quote (type beat "quote"). Treatment: `stepped-dark`: surfaces stepped 1 to 3 lightness points, white-alpha hairlines, half-pixel inner highlight on panels, no drop shadows, mono captions (`linear-home.md`). 390: the hero window scales to about 0.6 and crops to the issue column; the agent panel moves below, overlapping the window's bottom edge; the three figures stack at full width (Linear at 390: 5 of 7 slices, 4 fragments, `motion-imagery.md`).

## Where this domain is usually wrong
- **"One strong hero image is enough."** Measured exemplars put a visual on 71% (Vercel, the floor) to 100% (Framer) of screens; the one-hero page is the benchmark's 1 of 7 (`motion-imagery.md` section 1).
- **"Simplify the phone page: drop the mock-ups."** Stripe's phone page has more mock-ups (14) than its desktop (12) and higher cover (81% median) (same file). Cropping keeps the proof; deleting it loses the argument where most visitors read.
- **"Mock-ups must be readable."** They are decoration with the facts repeated in text; Stripe renders them at 9 to 12px, Framer 10 to 13px (`stripe-home.md`, `framer-home.md`). Readable and decorative are different jobs; give each to the right element.
- **"Imagery on about every other section."** This skill's own earlier rule (01, before v0.2) plans about half the sections with a picture, under every measured exemplar including Vercel's 71% floor. Replaced by the 70% visual plan.
- **"Screenshots are the honest way to show software."** A raster screenshot cannot crop per breakpoint, scale crisply, follow the theme or carry the brand fill; Stripe, Linear and Framer rebuild the product in HTML (`motion-imagery.md` section 3). Use real product data shapes, labelled as sample.

## Hand-offs
- **design-motion**: a fragment that changes state is a product scene (FOUNDATIONS: beats 1.2 to 4.5s, holds of at least 1s, a loop of 12s or less, a still frame under reduced motion; `assets/scene.js`). The still is the frame this plan names. A scene only animates inside the stage; the stage itself never moves.
- **design-copy**: fragment data and section copy agree; dates, money and no-break rules from FOUNDATIONS content mechanics.
- **design-layout**: the bento and split grids, stage heights at each width, column starts.
- **design-color**: `--visual-fill` and the illustration tokens in both themes; chart marks at 3:1 (the fixture's bars: violet 400 on white 3.54:1).
- **dataviz**: a chart readers take values from; its labels are live HTML.
- **design-frontend**: `overflow: clip` and transforms do not create scroll; renders stay inline under the SVG budget (04).
