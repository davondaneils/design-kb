#!/usr/bin/env python3
"""Build the self-contained festival pages: inline includes and the Archivo subset as base64.

Markers in src/*.html: /*@INCLUDE file*/ (recursive, relative to src/) and /*@FONT*/ (the @font-face rule).
Usage: python3 build.py   (writes ../<name>.html for every page listed below)
"""
import base64, re, pathlib

src = pathlib.Path(__file__).parent
out = src.parent
font = base64.b64encode((out / 'fonts' / 'archivo.woff2').read_bytes()).decode()
FACE = ("@font-face{font-family:'Archivo';src:url(data:font/woff2;base64,%s) format('woff2');"
        "font-weight:400 900;font-stretch:62%% 125%%;font-style:normal;font-display:block}" % font)

def include(text):
    for _ in range(4):
        text = re.sub(r'/\*@INCLUDE (\S+)\*/', lambda m: (src / m.group(1)).read_text().strip(), text)
    return text

for name in ['poster-social', 'poster-a2', 'event', 'event-states', 'og-card']:
    p = src / f'{name}.html'
    if not p.exists():
        continue
    html = include(p.read_text())
    html, n = re.subn(r'/\*@FONT\*/', lambda m: FACE, html)
    assert n == 1, (name, n)
    assert '@INCLUDE' not in html, name
    (out / f'{name}.html').write_text(html)
    print(name, len(html))
