#!/usr/bin/env python3
"""Build the Halden mark from the outlined Literata wordmark (wordmark.py output).

Detail: the H crossbar is thickened to 12 units (cap = 100) and painted in the accent,
the 'gap made whole' from the concept. Writes mark.svg (primary), mark-reversed.svg,
mark-mono.svg, favicon.svg (tier 4: H alone on a damson field) and mark-inline.txt
(the inline SVG the page uses: ink currentColor, bar var(--color-logo-bar)).
Usage: python3 make_mark.py wm30.svg outdir
"""
import re, sys, pathlib
src, out = sys.argv[1], pathlib.Path(sys.argv[2])
svg = open(src).read()
paths = re.findall(r'<path data-char="(.)" d="([^"]+)"/>', svg)
vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
H = paths[0][1]
assert H.count('V48.1H79.9') == 1 and H.count('V57.6H38.7') == 1
H = H.replace('V48.1H79.9', 'V46.5H79.9').replace('V57.6H38.7', 'V58.5H38.7')
BAR = (38.7, 46.5, 79.9 - 38.7, 12.0)
rest = ''.join(f'<path d="{d}"/>' for c, d in paths[1:])
bar = lambda fill: f'<rect x="{BAR[0]}" y="{BAR[1]}" width="{BAR[2]:.1f}" height="{BAR[3]}" fill="{fill}"/>'
def mark(ink, accent, title='Halden'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}">'
            f'<g fill="{ink}"><path d="{H}"/>{rest}</g>{bar(accent)}</svg>\n')
out.mkdir(parents=True, exist_ok=True)
(out / 'mark.svg').write_text(mark('#361426', '#b97d00'))            # damson 950 ink, ochre 500 bar, on paper
(out / 'mark-reversed.svg').write_text(mark('#fcf6ea', '#e6b970'))   # paper ink, ochre 300 bar, on damson 900
(out / 'mark-mono.svg').write_text(mark('#000000', '#000000'))       # one colour, bar in the ink
# Tier 4: the H alone, centred on a rounded damson field (16 to 32px). H spans x 7.6..110.9, y 4..104.
hw, hh = 110.9 - 7.6, 100.0
size = 160; s = 0.62 * size / hh
tx = (size - hw * s) / 2 - 7.6 * s; ty = (size - hh * s) / 2 - 4 * s - 2   # optical: 2 units above centre
fav = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
       f'<rect width="{size}" height="{size}" rx="32" fill="#4f2038"/>'
       f'<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.4f})"><path d="{H}" fill="#fcf6ea"/>{bar("#e6b970")}</g></svg>\n')
(out / 'favicon.svg').write_text(fav)
inline = (f'<svg class="wordmark" viewBox="{vb}" aria-hidden="true" focusable="false">'
          f'<g fill="currentColor"><path d="{H}"/>{rest}</g>'
          f'<rect class="wordmark-bar" x="{BAR[0]}" y="{BAR[1]}" width="{BAR[2]:.1f}" height="{BAR[3]}"/></svg>')
(out / 'mark-inline.txt').write_text(inline)
print('wrote', *sorted(p.name for p in out.iterdir()))
