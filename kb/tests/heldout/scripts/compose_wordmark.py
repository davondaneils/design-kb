#!/usr/bin/env python3
"""Compose the Set in Stone wordmark from outlined words (wordmark.py output).

Detail (the one quirk): the S of Stone is drawn mirror-reversed, as it sits on a litho stone.
Writes skilled/wm-line.html, skilled/wm-stack.html (inline SVG snippets, fill currentColor,
italic 'in' filled with --color-logo-accent) and sfonts/favicon.svg.
"""
import json, re, pathlib

B = pathlib.Path(__file__).parent
F = B / 'sfonts'

def load(name):
    svg = (F / f'w-{name}.svg').read_text()
    meta = json.loads((F / f'w-{name}.json').read_text())
    paths = re.findall(r'<path data-char="([^"]*)" d="([^"]+)"/>', svg)
    return paths, meta

set_p, set_m = load('set')
in_p, in_m = load('in')
st_p, st_m = load('stone')

def group(paths, meta, dx, dy, cls='', mirror_first=False):
    out = []
    adv = meta['advances'] + [meta['width']]
    for i, (ch, d) in enumerate(paths):
        if mirror_first and i == 0:
            w = adv[1] - adv[0]
            out.append(f'<path transform="translate({w:.1f} 0) scale(-1 1)" d="{d}"/>')
        else:
            out.append(f'<path d="{d}"/>')
    c = f' class="{cls}"' if cls else ''
    return f'<g transform="translate({dx:.1f} {dy:.1f})"{c}>' + ''.join(out) + '</g>'

H = 108
# one line: Set in Stone
gap = 30
x_in = set_m['width'] + gap
x_st = x_in + in_m['width'] + gap - 6
line_w = x_st + st_m['width']
line = (f'<svg class="wordmark wordmark-line" viewBox="0 0 {line_w:.1f} {H}" fill="currentColor" aria-hidden="true">'
        + group(set_p, set_m, 0, 0) + group(in_p, in_m, x_in, 0, 'wm-in') + group(st_p, st_m, x_st, 0, mirror_first=True) + '</svg>')
(B / 'skilled' / 'wm-line.html').write_text(line + '\n')

# stacked: "Set in" over "Stone", line gap 0.95 of cap+descent
lead = 116
stack_w = max(set_m['width'] + gap + in_m['width'], st_m['width'])
stack = (f'<svg class="wordmark wordmark-stack" viewBox="0 0 {stack_w:.1f} {H + lead:.1f}" fill="currentColor" aria-hidden="true">'
         + group(set_p, set_m, 0, 0) + group(in_p, in_m, set_m['width'] + gap, 0, 'wm-in')
         + group(st_p, st_m, 0, lead, mirror_first=True) + '</svg>')
(B / 'skilled' / 'wm-stack.html').write_text(stack + '\n')

# favicon: mirrored S on the sandstone field (tier 4, own ground)
s_d = st_p[0][1]
s_w = st_m['advances'][1]
scale = 64 / 100
fav = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='16' fill='#8e3a25'/>"
       f"<g transform='translate({50 + s_w*scale/2:.1f} {18 - 4*scale:.1f}) scale({-scale:.3f} {scale:.3f})'><path fill='#f4f0e8' d='{s_d}'/></g></svg>")
(F / 'favicon.svg').write_text(fav)
print('line', round(line_w, 1), 'stack', round(stack_w, 1), 'S adv', s_w)
