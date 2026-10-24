#!/usr/bin/env python3
"""Build home.html from home.src.html: inline fonts, outlined lockup, chart and favicons.

Run: python3 build.py <fonts-dir>   (fonts-dir holds lit.css, atk.css, wm.svg from font_kit.py and wordmark.py)
Writes ../home.html, ../mark.svg, ../mark-small.svg, ../favicon.svg.
"""
import base64, math, os, re, sys

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.dirname(here)
fonts = sys.argv[1]

src = open(os.path.join(here, 'home.src.html')).read()

def sub(key, val):
    global src
    assert src.count(key) >= 1, key
    src = src.replace(key, val)

# ---------- fonts ----------
sub('%%FONTS%%', open(os.path.join(fonts, 'lit.css')).read() + open(os.path.join(fonts, 'atk.css')).read())

# ---------- the plot symbol ----------
def plot(points, r, sw, cls='plot'):
    """Open rings joined by lines that stop at the ring edges (the audiogram's own notation)."""
    parts = []
    for (x1, y1), (x2, y2) in zip(points, points[1:]):
        d = math.hypot(x2 - x1, y2 - y1); ux, uy = (x2 - x1) / d, (y2 - y1) / d
        a = (x1 + ux * r, y1 + uy * r); b = (x2 - ux * r, y2 - uy * r)
        parts.append(f'M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}')
    rings = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y in points)
    return (f'<g class="{cls}" fill="none" stroke-width="{sw}" stroke-linecap="round">'
            f'<path d="{"".join(parts)}"/>{rings}</g>')

# lockup in wordmark units: cap height 100, baseline 104, descender to about 136
wm = open(os.path.join(fonts, 'wm.svg')).read()
wm_paths = ''.join(re.findall(r'<path [^>]*/>', wm))
wm_w = float(re.search(r'viewBox="0 0 ([\d.]+)', wm).group(1))
sym_pts = [(18, 26), (84, 40), (150, 92)]
sym = plot(sym_pts, 15, 10)
gap = 214
lockup_w = gap + wm_w
lockup = (f'<svg viewBox="0 0 {lockup_w:.0f} 140" aria-hidden="true" focusable="false">{sym}'
          f'<g fill="currentColor" transform="translate({gap} 0)">{wm_paths}</g></svg>')
sub('%%LOCKUP%%', lockup)
sub('%%FOOTMARK%%', lockup.replace('aria-hidden="true"', 'role="img" aria-label="Halden Hearing"'))

open(os.path.join(out, 'mark.svg'), 'w').write(
    lockup.replace('aria-hidden="true" focusable="false"', 'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Halden Hearing"')
          .replace('class="plot" fill="none"', 'class="plot" fill="none" stroke="#24211e"')
          .replace('fill="currentColor"', 'fill="#24211e"'))

# small-size symbol (tier 4): fewer, heavier parts on its own ochre-900 field
def favicon(size=48):
    pts = [(9, 15), (24, 20), (39, 34)]
    g = plot(pts, 4.5, 3.5).replace('class="plot"', 'stroke="#e4b977"')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="{size}" height="{size}">'
            f'<rect width="48" height="48" rx="10" fill="#492b00"/>{g}</svg>')
fav = favicon()
open(os.path.join(out, 'favicon.svg'), 'w').write(fav)
open(os.path.join(out, 'mark-small.svg'), 'w').write(fav)
sub('%%FAVICON_SVG%%', 'data:image/svg+xml;base64,' + base64.b64encode(fav.encode()).decode())
png = os.path.join(out, 'favicon-48.png')
sub('%%FAVICON_PNG%%', 'data:image/png;base64,' + (base64.b64encode(open(png, 'rb').read()).decode() if os.path.exists(png) else ''))

# ---------- the example chart ----------
W, H = 400, 300
X0, X1, Y0, Y1 = 8, 392, 8, 292
freqs = 6
def X(i): return X0 + i * (X1 - X0) / (freqs - 1)
def Y(db): return Y0 + db * (Y1 - Y0) / 100
grid = ''.join(f'M{X0} {Y(d):.1f}H{X1}' for d in range(0, 101, 20)) + ''.join(f'M{X(i):.1f} {Y0}V{Y1}' for i in range(freqs))
line_db = [15, 15, 20, 30, 50, 60]
pts = [(X(i), Y(d)) for i, d in enumerate(line_db)]
missed = f'M{X0} {Y0}' + ''.join(f'L{x:.1f} {y:.1f}' for x, y in [(X0, pts[0][1])] + pts + [(X1, pts[-1][1])]) + f'L{X1} {Y0}Z'
chart = (f'<path class="missed" d="{missed}"/>'
         f'<path class="grid" d="{grid}" fill="none"/>'
         f'<path class="line" d="M{"L".join(f"{x:.1f} {y:.1f}" for x, y in pts)}" vector-effect="non-scaling-stroke"/>'
         + ''.join(f'<circle class="ring" cx="{x:.1f}" cy="{y:.1f}" r="7"/>' for x, y in pts))
sub('%%CHART%%', chart)

def interp(i):
    a = int(math.floor(i)); f = i - a
    return line_db[a] + (line_db[min(a + 1, freqs - 1)] - line_db[a]) * f
sounds = [  # (label, frequency index, dB) ; positions follow common "familiar sounds" audiograms (approximate)
    ('Birdsong', 3.2, 12),
    ('s, f and th', 4.3, 30),
    ('Voices', 1.6, 50),
    ('A dog barking', 1.1, 76),
]
labels = []
for text, i, db in sounds:
    missed_ = db < interp(i)
    left = X(i) / W * 100; top = Y(db) / H * 100
    labels.append(f'<span class="sound{" is-missed" if missed_ else ""}" style="left:{left:.1f}%;top:{top:.1f}%" aria-hidden="true">{text}</span>')
sub('%%LABELS%%', '\n          '.join(labels))

open(os.path.join(out, 'home.html'), 'w').write(src)
print('built', len(src) // 1024, 'KB')
