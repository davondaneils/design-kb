#!/usr/bin/env python3
"""Inline fonts into a source HTML file.

Marker: /*@FONTS family=file.woff2;weightrange;style|...*/
Usage: inline.py src.html out.html fontsdir
"""
import base64, re, sys, pathlib

src, out, fdir = sys.argv[1], sys.argv[2], pathlib.Path(sys.argv[3])
html = pathlib.Path(src).read_text()
html = re.sub(r'/\*@INCLUDE (\S+)\*/', lambda m: (pathlib.Path(src).parent / m.group(1)).read_text(), html)

def repl(m):
    rules = []
    for spec in m.group(1).split('|'):
        spec = spec.strip()
        if not spec:
            continue
        fam, rest = spec.split('=', 1)
        parts = rest.split(';')
        fname = parts[0]
        weight = parts[1] if len(parts) > 1 else '400'
        style = parts[2] if len(parts) > 2 else 'normal'
        b64 = base64.b64encode((fdir / fname).read_bytes()).decode()
        rules.append(
            "@font-face{font-family:'%s';src:url(data:font/woff2;base64,%s) format('woff2');"
            "font-weight:%s;font-style:%s;font-display:block}" % (fam, b64, weight, style))
    return '\n'.join(rules)

html, n = re.subn(r'/\*@FONTS (.*?)\*/', repl, html, flags=re.S)
assert n == 1, f'expected one font marker, found {n}'
pathlib.Path(out).write_text(html)
print(out, len(html))
