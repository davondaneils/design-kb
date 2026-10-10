#!/usr/bin/env python3
"""Contrast of a favicon color against light and dark tab strips (WCAG 2 ratio).

Usage:
  python3 tab_contrast.py "#f26b21" [--strips "#ffffff,#f1f3f4,#dee1e6,#35363a,#202124,#1e1e1e"]

Default strips are typical browser tab and toolbar grays, light and dark (opinion: sampled from common
default themes, not from a spec; pass your own). A favicon is a graphical object that identifies the page,
so aim for 3:1 (WCAG 1.4.11 level) against every strip. Prints each ratio and the minimum; exit 1 under 3.0.
"""
import argparse
import sys


def lum(hex_):
    h = hex_.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('color')
    ap.add_argument('--strips', default='#ffffff,#f1f3f4,#dee1e6,#35363a,#202124,#1e1e1e')
    a = ap.parse_args()
    rs = [(s, ratio(a.color, s)) for s in a.strips.split(',')]
    for s, r in rs:
        print(f'{a.color} on {s}: {r:.2f}:1')
    m = min(r for _, r in rs)
    print(f'min {m:.2f}:1 ->', 'PASS' if m >= 3 else 'FAIL (use a two-tone mark on its own field)')
    sys.exit(0 if m >= 3 else 1)


if __name__ == '__main__':
    main()
