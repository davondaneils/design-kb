#!/usr/bin/env python3
"""Assemble home.html from build/home.src.html: inline fonts, mark and favicons (one self-contained file)."""
import base64, pathlib, re
here = pathlib.Path(__file__).parent
src = (here / 'home.src.html').read_text()
fonts = (here / 'lit-r.css').read_text() + '\n' + (here / 'lit-i.css').read_text()
mark = (here / 'mark-inline.txt').read_text()
fav_svg = 'data:image/svg+xml;base64,' + base64.b64encode((here.parent / 'favicon.svg').read_bytes()).decode()
fav_png = 'data:image/png;base64,' + base64.b64encode((here / 'fav192-192-light.png').read_bytes()).decode()
for k, v in {'{{FONTS}}': fonts, '{{MARK}}': mark, '{{FAVSVG}}': fav_svg, '{{FAVPNG}}': fav_png}.items():
    assert k in src, k
    src = src.replace(k, v)
assert '{{' not in src
(here.parent / 'home.html').write_text(src)
print('home.html', len(src.encode()), 'bytes')
