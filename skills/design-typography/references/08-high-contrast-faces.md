# High-contrast faces: Didones, hairlines and optical size

Bodoni, Didot, Walbaum, Bodoni Moda, Playfair Display, Fraunces and GT Super at display size, and every fashion serif or high-contrast sans, carry their elegance in a hairline that is a few thousandths of an em thick. That hairline is the first thing to disappear at the size the reader actually sees. The held-out test lost it: the "Set in Stone" poster set its Bodoni Moda wordmark at opsz 48 on a 1080 canvas, and in a phone feed the hairlines rendered at about 0.36 CSS px and faded out (`kb/tests/heldout.md` section 5). This chapter is the rule that prevents it. Tool: `assets/hairline.py`.

## Floor (non-negotiable)

1. **Size the hairline, not the font.** For any face whose stem-to-hairline contrast is above about 8:1, compute the hairline at the size it is seen: `hairline seen = hairline per em x font size x display scale`, where display scale is 1 on a web page and `view width / canvas width` on a poster or social image (0.361 for a 1080 post in a 390px feed; design-graphic 05). `[judged]`, measured with `assets/hairline.py`.
2. **Screen floor: 0.5 CSS px seen.** That is one device pixel at 2x and 1.5 at 3x (opinion: a stroke under one device pixel antialiases to a pale gray, so the letter breaks into stems; Wikipedia's Bodoni article calls the effect "dazzle" and notes that "the hairline strokes can recede to being hard to see" when a display cut is used small, https://en.wikipedia.org/wiki/Bodoni, accessed 2026-10-11). For a page that must hold on 1x desktop screens, use 1 CSS px. `[judged]`
3. **Print floor: 0.25 pt (0.088 mm) dark on light, 0.5 pt reversed.** Prepress shops agree: "lines should be at least 0.25 pt thick", "White or light line on a dark background: 0.5 pt" (ePrinting Service, "Hairlines, small text and fine detail", 2025, https://eprintingservice.com/9263902-hairlines-small-text-fine-detail-minimum-sizes-print); "Positive lines min. 0,1 mm, negative lines min. 0,15 mm" (STI Group prepress guidelines); Tradeprint recommends "at least 0.25pt" (https://help.tradeprint.co.uk/hairlines). Uncoated stock needs about 20 percent more (Lion Paper offset guide, 2026). `[judged]`
4. **Minimum text sizes still apply on top:** 14 CSS px seen on screen and 40px on a 1080 canvas (`canvas-text` in `tools/lint.mjs`, FOUNDATIONS checklist row 6); 7 to 8 pt for serif and light text in print (ePrinting Service: "Serif fonts and light weights: 7 to 8 pt, because thin serifs and hairline strokes are the first thing to break up"). A Didone usually needs far more than these floors; the hairline rule is the binding one. `[lint]` for the text floor, `[judged]` for the hairline.

## Numbers: Bodoni Moda, measured

Measured with `assets/hairline.py` on `@fontsource-variable/bodoni-moda` 5.3.0 (Owen Earl, indestructible type, OFL; opsz axis 6 to 96, default 11, Google Fonts METADATA). Hairline is the thinnest of the "o" top and the "H" bar, in thousandths of an em. The stem barely changes (100 to 105 at wght 400, 148 to 150 at 700).

| opsz | Hairline /1000 em | Contrast at wght 700 | Smallest size with a 0.5 CSS px hairline, web page | Same on a 1080 canvas in a 390 feed | Smallest print size for 0.25 pt |
|---|---|---|---|---|---|
| 6 | 36.0 | 4.1:1 | 14px | 38px | 7pt |
| 11 | 19.3 | 7.7:1 | 26px | 72px | 13pt |
| 18 | 12.2 | 12.3:1 | 41px | 114px | 21pt |
| 24 | 8.9 | 16.8:1 | 56px | 156px | 28pt |
| 36 | 4.5 | 33.5:1 | 111px | 309px | 56pt |
| 48 | 3.6 | 42.0:1 | 139px | 388px | 70pt |
| 72 | 2.7 | 56.4:1 | 185px | 521px | 94pt |
| 96 | 2.0 | about 75:1 | 250px | 692px | 125pt |

Two things in this table a generalist does not expect:
- **Weight does not thicken the hairline.** wght 400 and 700 give the same hairline at every opsz (36.0 and 36.0 at opsz 6, 3.5 and 3.6 at opsz 48); bold only fattens the stems, so contrast goes up, not down. Bolding a Didone to "make it read" makes the dazzle worse. Only a lower optical size, or a bigger size, saves the hairline.
- **The hairline falls 18 times from opsz 6 to 96** while the stem stays put. Optical size is the hairline control.

## Decision rules

- **If** the face is a Didone or any face over about 8:1 contrast **then** run `python3 assets/hairline.py Face.woff2 --axes wght=<w> --size <px> [--canvas 1080 --view 390]` (or `--pt <pt>` for print) for every size the face is used at, and pick the highest opsz that still clears the floor.
- **On screen, pick opsz by the size seen, then go lower.** CSS maps `opsz` to CSS px automatically (`font-optical-sizing: auto`), and on a canvas that maps to the canvas size, not the feed size: a 200px canvas headline gets opsz 96 and is seen at 72px. Set it by hand: `font-variation-settings: "opsz" N` with N at most the seen size, and for Didones about a third to a quarter of the font size on screen (a Bodoni user on the CSSWG: "I typically have to set `opsz` to a third or a quarter of the actual font size because of the very thin hairlines", csswg-drafts issue 13331, January 2026). Then check with the tool.
- **In print, opsz is the point size** (the axis is specified in points; the browser px mapping is the unresolved CSSWG issue 4430), then check 0.25 pt. An A2 poster headline at 300pt holds at opsz 48 (1.08 pt hairline); 24pt event details at opsz 48 print a 0.09 pt hairline and break up: use opsz 11 (0.46 pt).
- **Feed and social images:** a Didone line seen under about 72 CSS px needs opsz 24 or lower; under 40 CSS px seen, opsz 11 or a text cut. Never let a hairline carry information alone (the bar of an "e", a numeral's join) at feed size.
- **Outlined wordmarks bake in one opsz.** When a wordmark is outlined from a variable Didone, the opsz is frozen at outlining time: choose it for the smallest size the mark is used large (feed, OG card), and draw a separate small-size master for favicon and 16 to 32px tiers (design-graphic `references/01-logo-identity.md`, responsive tiers).
- **Static families with Display and Text cuts** (Didot HTF's seven sizes 6 to 96 point, ITC Bodoni 6, 12 and 72): use the cut whose point size is at or below the seen size. A display cut used small is the classic failure (Wikipedia, Bodoni; Hoefler&Co draws Didot in "6, 11, 16, 24, 42, 64, and 96 points" to keep hairlines crisp, quoted by UCF Libraries typography guide).
- **Reversed type** (light on dark): double the floor, 1 CSS px seen on screen, 0.5 pt in print; ink and light both spread into a reversed hairline.
- **No opsz axis and no text cut:** keep the face at sizes where the measured hairline clears the floor, and set everything smaller in the companion sans. Opinion: with a face like Playfair Display, that is 40px and up on a page.

## Do and don't

| Do | Don't |
|---|---|
| Measure the hairline at the size it is seen, with the tool | Judge the hairline on a 1080 artboard at 100 percent zoom |
| Lower opsz on a feed image (opsz 18 to 24 for a 200px canvas headline) | Leave `font-optical-sizing: auto` on a canvas: it maps to canvas px |
| Use weight for hierarchy in the sans, opsz for survival in the Didone | Bold a Didone to make the hairlines read |
| Double the floor for reversed type | Set 24pt Didone details at a display opsz on a poster |

## Worked example: the held-out "Set in Stone" poster

The wordmark is Bodoni Moda 700 outlined at opsz 48, cap height 0.75 em. On the 1080 x 1350 post the sheet wordmark's em is about 274 canvas px, seen at about 99 CSS px in a 390 feed. Hairline: 3.6/1000 x 99 = 0.36 CSS px, under the 0.5 floor, which is what the self-critic saw as "Bodoni hairlines thin at feed size". Fix: outline the feed and OG versions at opsz 18 to 24 (0.88 to 1.2 CSS px seen at that size per the tool), keep opsz 48 for the A2 print (274 canvas px on 1191 is about 274pt: a 0.99 pt hairline, well above 0.25).

## Hand-offs
- design-graphic: wordmark outlining, responsive logo tiers, `references/05-composition-social.md` thumbnail math.
- design-playbook-brand: concept legibility (a hairline that vanishes can make a letter read as a different letter).
- `tools/lint.mjs` canvas mode: the text-size floor on fixed canvases.
