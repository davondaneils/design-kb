#!/usr/bin/env python3
"""Print an SVG feColorMatrix that maps an image to a duotone between two brand colors.

Each output channel c = shadow_c + (highlight_c - shadow_c) * L, where L is the pixel's luminance
with Rec. 709 / WCAG weights (0.2126, 0.7152, 0.0722). With color-interpolation-filters="sRGB" the weights
are applied to gamma-encoded sRGB values, so L is a perceptual approximation, not linear-light luminance;
that is the usual duotone look and keeps midtones open. Works in the filter's color space; add
color-interpolation-filters="sRGB" so the colors you pass come out as the hex values you chose.

Usage:
  python3 duotone_matrix.py SHADOW_HEX HIGHLIGHT_HEX [--id duotone]

Example:
  python3 duotone_matrix.py "#27201a" "#f9f6f4"
"""
import argparse

W = (0.2126, 0.7152, 0.0722)


def hex01(h):
    h = h.lstrip('#')
    return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]


def main():
    p = argparse.ArgumentParser()
    p.add_argument('shadow')
    p.add_argument('highlight')
    p.add_argument('--id', default='duotone')
    a = p.parse_args()
    s, hi = hex01(a.shadow), hex01(a.highlight)
    rows = []
    for c in range(3):
        d = hi[c] - s[c]
        rows.append(f'{d * W[0]:.4f} {d * W[1]:.4f} {d * W[2]:.4f} 0 {s[c]:.4f}')
    rows.append('0 0 0 1 0')
    values = '\n          '.join(rows)
    print(f'''<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
  <filter id="{a.id}" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values="
          {values}"/>
  </filter>
</svg>
<!-- use: img {{ filter: url(#{a.id}); }} -->''')


if __name__ == '__main__':
    main()
