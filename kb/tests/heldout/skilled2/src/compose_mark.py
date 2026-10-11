#!/usr/bin/env python3
"""Compose the Set in Stone mark from outlined Archivo 900 / wdth 62 words (wordmark.py output in wm/).

The mark is one course of ashlar: three stones (SET, IN, STONE) laid with lime joints.
Writes:
  wm/mark-line.html   inline SVG, one course, classes for CSS colouring (blocks, ink, joints)
  wm/mark-stack.html  inline SVG, two courses (SET | IN over STONE), the poster bond
  ../favicon.svg      the bond alone on a sandstone field (no letters: 16px cannot hold them)
Usage: python3 compose_mark.py   (run from this folder)
"""
import json, re, pathlib

here = pathlib.Path(__file__).parent
wm = here / 'wm'

def word(w):
    svg = (wm / f'{w}.svg').read_text()
    paths = re.findall(r'<path[^>]*/>', svg)
    width = json.loads((wm / f'{w}.json').read_text())['width']
    return ''.join(paths), width

PAD_X, PAD_Y, JOINT, CAP = 30, 30, 10, 100
BLOCK_H = CAP + 2 * PAD_Y

def stone(x, y, w, paths, ww, tone):
    bw = ww + 2 * PAD_X
    # glyph svg viewBox top is 4 units above the cap line
    return (f'<rect class="m-stone m-{tone}" x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{BLOCK_H}"/>'
            f'<g class="m-ink" transform="translate({x + PAD_X:.1f} {y + PAD_Y - 4:.1f})">{paths}</g>'), bw

words = {w: word(w) for w in ['SET', 'IN', 'STONE']}

def line():
    x, y, out = JOINT, JOINT, []
    for w, tone in [('SET', 'a'), ('IN', 'b'), ('STONE', 'c')]:
        s, bw = stone(x, y, w, *words[w], tone)
        out.append(s); x += bw + JOINT
    W, H = x, BLOCK_H + 2 * JOINT
    return W, H, out

def stack():
    # course 1: SET | IN stretched to the width of STONE; course 2: STONE
    sw = words['STONE'][1] + 2 * PAD_X
    W = sw + 2 * JOINT
    out = []
    set_w, in_w = words['SET'][1], words['IN'][1]
    extra = sw - (set_w + in_w + 4 * PAD_X + JOINT)
    # share the slack as extra padding inside each stone, so letters stay centred in their stone
    x = JOINT
    for w, tone, ww in [('SET', 'a', set_w), ('IN', 'b', in_w)]:
        bw = ww + 2 * PAD_X + extra / 2
        out.append(f'<rect class="m-stone m-{tone}" x="{x:.1f}" y="{JOINT}" width="{bw:.1f}" height="{BLOCK_H}"/>'
                   f'<g class="m-ink" transform="translate({x + (bw - ww) / 2:.1f} {JOINT + PAD_Y - 4:.1f})">{words[w][0]}</g>')
        x += bw + JOINT
    s, _ = stone(JOINT, 2 * JOINT + BLOCK_H, 'STONE', *words['STONE'], 'c')
    out.append(s)
    return W, 2 * BLOCK_H + 3 * JOINT, out

for name, (W, H, parts) in {'line': line(), 'stack': stack()}.items():
    svg = (f'<svg class="mark mark-{name}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" '
           f'role="img" aria-label="Set in Stone"><rect class="m-joint" width="{W:.1f}" height="{H:.1f}"/>{"".join(parts)}</svg>')
    (wm / f'mark-{name}.html').write_text(svg)
    print(name, round(W, 1), round(H, 1))

# favicon: the bond (two stones over one) on its own sandstone field, lime joints, readable at 16px
fav = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
       '<rect width="64" height="64" rx="10" fill="#e9d6c4"/>'
       '<rect x="5" y="5" width="34" height="25" fill="#8e3a25"/>'
       '<rect x="44" y="5" width="15" height="25" fill="#7f3220"/>'
       '<rect x="5" y="35" width="54" height="24" fill="#873421"/></svg>')
(here.parent / 'favicon.svg').write_text(fav)
print('favicon.svg')
