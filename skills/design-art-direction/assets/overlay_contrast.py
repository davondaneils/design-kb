#!/usr/bin/env python3
"""Worst-pixel contrast check for text over an image, texture or gradient (WCAG F83 and G18).

Measures the WCAG 2 contrast ratio between one text color and every pixel of the background
area the text sits on, and reports the minimum, the 1st percentile and the share of pixels that fail.

Usage:
  python3 overlay_contrast.py IMAGE --box X Y W H --text "#1b1917" [--min 4.5] [--exclude-near 0]

  IMAGE    a PNG or JPEG of the background WITHOUT the text (render the page with the text set to
           `color: transparent`, or crop the source image to the text block's box).
           If you only have a screenshot with the text in it, pass --exclude-near 2.0 to skip pixels whose
           contrast with the text color is under 2.0 (these are the glyphs and their anti-aliasing).
  --box    the text block's box in image pixels (for a 2x screenshot, double the CSS box).
  --text   the text color as hex.
  --min    the threshold, 4.5 for body text, 3 for large text (24px, or 18.66px bold) and for 1.4.11.

Exit code 0 when the minimum passes, 1 when any pixel fails. Requires Pillow.
"""
import argparse
import sys

from PIL import Image


def channel(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = rgb[:3]
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def ratio(l1, l2):
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def hex_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(ch * 2 for ch in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('image')
    p.add_argument('--box', nargs=4, type=int, metavar=('X', 'Y', 'W', 'H'))
    p.add_argument('--text', required=True)
    p.add_argument('--min', type=float, default=4.5)
    p.add_argument('--exclude-near', type=float, default=0.0)
    a = p.parse_args()

    img = Image.open(a.image).convert('RGB')
    if a.box:
        x, y, w, h = a.box
        img = img.crop((x, y, x + w, y + h))
    lt = luminance(hex_rgb(a.text))
    ratios = []
    for px in img.getdata():
        cr = ratio(lt, luminance(px))
        if a.exclude_near and cr < a.exclude_near:
            continue
        ratios.append(cr)
    if not ratios:
        print('No background pixels left to measure.')
        return 2
    ratios.sort()
    n = len(ratios)
    worst = ratios[0]
    p1 = ratios[max(0, int(n * 0.01) - 1)]
    failing = sum(1 for r in ratios if r < a.min)
    print(f'pixels measured: {n}')
    print(f'worst pixel:     {worst:.2f}:1')
    print(f'1st percentile:  {p1:.2f}:1')
    print(f'median:          {ratios[n // 2]:.2f}:1')
    print(f'below {a.min}:1:    {failing} pixels ({100 * failing / n:.2f}%)')
    print('PASS' if worst >= a.min else 'FAIL: darken or lighten the area behind the text, add a solid panel, or move the text')
    return 0 if worst >= a.min else 1


if __name__ == '__main__':
    sys.exit(main())
