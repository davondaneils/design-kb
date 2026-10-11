#!/usr/bin/env python3
"""Hairline check for high-contrast faces (Didones such as Bodoni and Didot, display serifs, fashion sans).

Measures the thinnest stroke of a face (the top hairline of "o", the crossbar of "H") as a share of the em, at each
optical size of a variable font or for a static file, and prints the smallest size at which that hairline still clears
the floor where it will be seen (design-typography SKILL section 4, "High-contrast serifs"):

  screen   hairline seen >= 0.5 CSS px (1 device pixel at 2x; opinion: thinner strokes antialias to a pale gray)
  print    hairline >= 0.25 pt (0.088 mm) dark on light, >= 0.5 pt reversed (prepress minimums: Tradeprint,
           ePrinting Service 2025, STI Group prepress guidelines 0.1 mm and 0.15 mm)

Usage:
  python3 hairline.py Font.woff2                                   # table over opsz (variable) or one row (static)
  python3 hairline.py Font.woff2 --axes wght=700                    # pin other axes
  python3 hairline.py Font.woff2 --size 200 --canvas 1080 --view 390   # a 200px line on a 1080 post seen 390px wide
  python3 hairline.py Font.woff2 --pt 24 [--reversed]              # 24pt print
Needs: pip install fonttools brotli
"""
import argparse
import sys

from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont

try:
    from fontTools.varLib.instancer import instantiateVariableFont
except ImportError:  # very old fontTools
    instantiateVariableFont = None


class FlatPen(BasePen):
    """Flattens a glyph outline into line segments."""

    def __init__(self, glyphset):
        super().__init__(glyphset)
        self.segs, self.cur, self.start = [], None, None

    def _moveTo(self, p):
        self.cur = self.start = p

    def _lineTo(self, p):
        self.segs.append((self.cur, p))
        self.cur = p

    def _curveToOne(self, a, b, c):
        p0, prev = self.cur, self.cur
        for i in range(1, 41):
            t = i / 40
            pt = tuple((1 - t) ** 3 * p0[k] + 3 * (1 - t) ** 2 * t * a[k] + 3 * (1 - t) * t * t * b[k] + t ** 3 * c[k] for k in (0, 1))
            self.segs.append((prev, pt))
            prev = pt
        self.cur = c

    def _qCurveToOne(self, a, c):
        p0, prev = self.cur, self.cur
        for i in range(1, 41):
            t = i / 40
            pt = tuple((1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * a[k] + t * t * c[k] for k in (0, 1))
            self.segs.append((prev, pt))
            prev = pt
        self.cur = c

    def _closePath(self):
        if self.cur != self.start:
            self.segs.append((self.cur, self.start))


def crossings(segs, value, axis):
    other = 1 - axis
    out = []
    for a, b in segs:
        if (a[axis] - value) * (b[axis] - value) < 0:
            t = (value - a[axis]) / (b[axis] - a[axis])
            out.append(a[other] + t * (b[other] - a[other]))
    return sorted(out)


def outline(font, char):
    gs = font.getGlyphSet()
    name = font.getBestCmap().get(ord(char))
    if not name:
        return None
    pen = FlatPen(gs)
    gs[name].draw(pen)
    return pen.segs


def hairline(font):
    """Thinnest stroke in thousandths of an em: min of the o top hairline and the H crossbar."""
    upm = font['head'].unitsPerEm
    found = []
    o = outline(font, 'o')
    if o:
        xs = [p[0] for s in o for p in s]
        for dx in (0, 0.01, -0.01, 0.03, -0.03):
            yy = crossings(o, (min(xs) + max(xs)) / 2 + dx * (max(xs) - min(xs)), 0)
            if len(yy) >= 4:
                found.append(yy[-1] - yy[-2])
                break
    h = outline(font, 'H')
    if h:
        xs = [p[0] for s in h for p in s]
        yy = crossings(h, (min(xs) + max(xs)) / 2, 0)
        if len(yy) == 2:
            found.append(yy[1] - yy[0])
    return min(found) / upm * 1000 if found else None


def instance(path, axes):
    font = TTFont(path)
    if 'fvar' in font and axes and instantiateVariableFont:
        font = instantiateVariableFont(font, axes)
    return font


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('font')
    ap.add_argument('--axes', default='', help='pinned axes, e.g. wght=700,opsz=48')
    ap.add_argument('--size', type=float, help='CSS px font size on the page or canvas')
    ap.add_argument('--canvas', type=float, help='canvas width in px (posters, social images)')
    ap.add_argument('--view', type=float, default=390, help='CSS px width the canvas is seen at (default 390, a phone feed)')
    ap.add_argument('--pt', type=float, help='print size in points')
    ap.add_argument('--reversed', action='store_true', help='light type on a dark ground (print floor 0.5 pt)')
    a = ap.parse_args()

    pinned = {k: float(v) for k, v in (p.split('=') for p in a.axes.split(',') if p)}
    base = TTFont(a.font)
    opsz_axis = next((x for x in base['fvar'].axes if x.axisTag == 'opsz'), None) if 'fvar' in base else None
    if opsz_axis and 'opsz' not in pinned:
        steps = [v for v in (6, 8, 11, 14, 18, 24, 36, 48, 72, 96, 144) if opsz_axis.minValue <= v <= opsz_axis.maxValue]
    else:
        steps = [pinned.get('opsz')]
    if 'fvar' in base:
        for x in base['fvar'].axes:
            if x.axisTag not in pinned and x.axisTag != 'opsz':
                pinned[x.axisTag] = x.defaultValue

    scale = (a.view / a.canvas) if a.canvas else 1.0
    floor_pt = 0.5 if a.reversed else 0.25
    print(f'{a.font}: thinnest stroke (o top, H bar), floors: screen 0.5 CSS px seen, print {floor_pt} pt')
    print(f'{"opsz":>6} {"hairline/1000em":>16} {"min px (screen, seen)":>22} {"min pt (print)":>15}' + ('   at your size' if (a.size or a.pt) else ''))
    bad = False
    for opsz in steps:
        axes = dict(pinned)
        if opsz is not None:
            axes['opsz'] = opsz
        h = hairline(instance(a.font, axes))
        if h is None:
            print(f'{str(opsz):>6} {"n/a":>16}')
            continue
        min_px = 0.5 / (h / 1000) / scale
        min_pt = floor_pt / (h / 1000)
        note = ''
        if a.size:
            seen = a.size * scale * h / 1000
            note = f'   {seen:.2f} px seen ' + ('ok' if seen >= 0.5 else 'TOO THIN')
            bad |= seen < 0.5
        if a.pt:
            ptw = a.pt * h / 1000
            note += f'   {ptw:.3f} pt ' + ('ok' if ptw >= floor_pt else 'TOO THIN')
            bad |= ptw < floor_pt
        print(f'{str(opsz if opsz is not None else "-"):>6} {h:>16.1f} {min_px:>22.0f} {min_pt:>15.1f}{note}')
    if a.canvas:
        print(f'(canvas {a.canvas:.0f}px seen at {a.view:.0f}px: min px is on the canvas)')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
