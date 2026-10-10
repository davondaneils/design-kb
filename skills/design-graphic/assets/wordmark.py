#!/usr/bin/env python3
"""Outline a wordmark from a font into SVG paths, with custom spacing.

A wordmark is artwork, not live text: outlining fixes the letterforms, lets you
space every pair by eye, and swap one glyph for a drawn or borrowed form (the one
ownable detail). Check the font license allows logo use (OFL does: the outlined
logo is artwork, not a font, so the Reserved Font Name rule does not bite).

Usage:
  python3 wordmark.py FONT.ttf "Ember & Oak" [--axes wght=480,opsz=72]
      [--track -10] [--kern "Em=-20,k.=-30"] [--swap "&=ITALIC.ttf"]
      [--slot O] [--cap 100] [--json out.json] > wordmark.svg

  --axes   variable font instance (fontTools instancer), for example wght=480,opsz=72
  --track  tracking in font units added after every glyph (display sizes want
           negative tracking; on a 2000-unit font, -10 to -40)
  --kern   extra per-pair adjustment in font units, on top of the font's own
           kerning: two characters, =, the value (comma separated list)
  --swap   take one character from another font (for example the italic
           ampersand), same axes; must share units per em with the main font
  --slot   leave this character's advance empty and report its box in the JSON
           (x, width, ink bounds, and the glyph's own outline as slotPath), so a
           custom drawing can be placed there
  --cap    output scale: the cap height becomes this many SVG units (default 100)

Output: one SVG on stdout. viewBox runs from 4 percent of cap height above the
cap line to 4 percent below the baseline (room for overshoot; descenders are
clipped by design, so check the text has none or raise the box). Each glyph is
its own <path data-char>. --json writes capHeight, xHeight, width, height,
baseline, advances and the slot box. Use cap height as the clear-space unit.
"""
import argparse
import json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen


def load(path, axes):
    f = TTFont(path)
    if axes and 'fvar' in f:
        f = instancer.instantiateVariableFont(f, axes, inplace=False)
    return f


def kern_value(font, left, right):
    """Pair kerning (GPOS PairPos format 1 and 2, extension lookups included). 0 if none."""
    if 'GPOS' not in font:
        return 0
    for lookup in font['GPOS'].table.LookupList.Lookup:
        if lookup.LookupType not in (2, 9):
            continue
        total = 0
        for st in lookup.SubTable:
            if lookup.LookupType == 9:
                if st.ExtensionLookupType != 2:
                    continue
                st = st.ExtSubTable
            cov = st.Coverage.glyphs
            if left not in cov:
                continue
            if st.Format == 1:
                for pvr in st.PairSet[cov.index(left)].PairValueRecord:
                    if pvr.SecondGlyph == right and pvr.Value1 is not None:
                        total += getattr(pvr.Value1, 'XAdvance', 0) or 0
                        break
            elif st.Format == 2:
                c1 = st.ClassDef1.classDefs.get(left, 0)
                c2 = st.ClassDef2.classDefs.get(right, 0)
                rec = st.Class1Record[c1].Class2Record[c2]
                if rec.Value1 is not None:
                    total += getattr(rec.Value1, 'XAdvance', 0) or 0
        if total:
            return total
    return 0


def num(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def outline(font, gname, dx, scale, base):
    gs = font.getGlyphSet()
    pen = SVGPathPen(gs, ntos=num)
    gs[gname].draw(TransformPen(pen, (scale, 0, 0, -scale, dx * scale, base)))
    bp = BoundsPen(gs)
    gs[gname].draw(bp)
    return pen.getCommands(), bp.bounds


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('font')
    ap.add_argument('text')
    ap.add_argument('--axes', default='')
    ap.add_argument('--track', type=float, default=0)
    ap.add_argument('--kern', default='')
    ap.add_argument('--swap', default='')
    ap.add_argument('--slot', default='')
    ap.add_argument('--cap', type=float, default=100)
    ap.add_argument('--json')
    a = ap.parse_args()
    axes = {k: float(v) for k, v in (p.split('=') for p in a.axes.split(',') if p)}
    font = load(a.font, axes)
    swaps = {}
    for p in filter(None, a.swap.split(',')):
        ch, path = p.split('=', 1)
        swaps[ch] = load(path, axes)
    extra = {}
    for p in filter(None, a.kern.split(',')):
        pair, v = p.rsplit('=', 1)
        extra[pair] = float(v)
    # Measure cap and x height from H and x in this instance: OS/2 values describe the
    # default instance only, and optical size axes change them.
    gset, cm = font.getGlyphSet(), font.getBestCmap()

    def ymax(ch, fallback):
        if ord(ch) not in cm:
            return fallback
        bp = BoundsPen(gset)
        gset[cm[ord(ch)]].draw(bp)
        return bp.bounds[3] if bp.bounds else fallback

    os2 = font['OS/2']
    cap = ymax('H', os2.sCapHeight or 1400)
    xh = ymax('x', os2.sxHeight or 0)
    scale = a.cap / cap
    pad = cap * 0.04
    base = (cap + pad) * scale
    x = 0.0
    parts, adv, slot, prev = [], [], None, None
    for ch in a.text:
        f = swaps.get(ch, font)
        g = f.getBestCmap()[ord(ch)]
        if prev is not None:
            pf, pg, pch = prev
            if pf is f:
                x += kern_value(f, pg, g)
            x += extra.get(pch + ch, 0)
        w = f['hmtx'][g][0]
        if ch == a.slot and slot is None:
            d, b = outline(f, g, x, scale, base)
            slot = {'char': ch, 'x': round(x * scale, 2), 'width': round(w * scale, 2),
                    'ink': [round(b[0] * scale + x * scale, 2), round(base - b[3] * scale, 2),
                            round(b[2] * scale + x * scale, 2), round(base - b[1] * scale, 2)] if b else None,
                    'slotPath': d}
        elif ch != ' ':
            d, _ = outline(f, g, x, scale, base)
            parts.append(f'<path data-char="{ch}" d="{d}"/>')
        adv.append(round(x * scale, 2))
        x += w + a.track
        prev = (f, g, ch)
    width = (x - a.track) * scale
    height = (cap + 2 * pad) * scale
    meta = {'capHeight': a.cap, 'xHeight': round(xh * scale, 2), 'scale': scale,
            'width': round(width, 2), 'height': round(height, 2), 'baseline': round(base, 2),
            'advances': adv, 'slot': slot}
    print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(width)} {num(height)}">'
          + ''.join(parts) + '</svg>')
    if a.json:
        with open(a.json, 'w') as fh:
            json.dump(meta, fh, indent=1)


if __name__ == '__main__':
    main()
