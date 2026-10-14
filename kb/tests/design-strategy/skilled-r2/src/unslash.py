# Instance Atkinson Hyperlegible Next at one weight and replace the slashed zero with a plain one
# (inner counter = outer contour scaled to the measured counter box, reversed). OFL: modified version, renamed.
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
src, wght, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
f = instancer.instantiateVariableFont(TTFont(src), {'wght': wght})
glyf = f['glyf']
for name in ('zero', 'zero.tf'):
    g = glyf[name]
    coords, ends, flags = g.getCoordinates(glyf)
    c = list(coords); st = 0; contours = []
    for e in ends:
        contours.append((c[st:e+1], list(flags[st:e+1]))); st = e + 1
    outer, oflags = contours[0]
    inners = [p for cc, _ in contours[1:] for p in cc]
    ox0, ox1 = min(p[0] for p in outer), max(p[0] for p in outer); oy0, oy1 = min(p[1] for p in outer), max(p[1] for p in outer)
    ix0, ix1 = min(p[0] for p in inners), max(p[0] for p in inners); iy0, iy1 = min(p[1] for p in inners), max(p[1] for p in inners)
    sx = (ix1 - ix0) / (ox1 - ox0); sy = (iy1 - iy0) / (oy1 - oy0)
    cx, cy = (ix0 + ix1) / 2, (iy0 + iy1) / 2; ocx, ocy = (ox0 + ox1) / 2, (oy0 + oy1) / 2
    inner = [(round(cx + (x - ocx) * sx), round(cy + (y - ocy) * sy)) for x, y in outer][::-1]
    iflags = oflags[::-1]
    g.coordinates = GlyphCoordinates(outer + inner)
    g.flags = bytearray(oflags + iflags)
    g.endPtsOfContours = [len(outer) - 1, len(outer) + len(inner) - 1]
    g.numberOfContours = 2
    from fontTools.ttLib.tables import ttProgram
    g.program = ttProgram.Program(); g.program.fromBytecode(b'')
    g.recalcBounds(glyf)
f.save(out)
print(out, 'ok')
