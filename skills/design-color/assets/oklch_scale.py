#!/usr/bin/env python3
"""OKLCH color scale generator and contrast checker. No dependencies.

Usage:
  python3 oklch_scale.py scale --hue 260 --chroma 0.20 [--name blue] [--css] [--shift 8] [--neutral]
  python3 oklch_scale.py check "#1c69e3" "#ffffff"
  python3 oklch_scale.py check "oklch(0.55 0.2 260)" "#fff"
  python3 oklch_scale.py hex2oklch "#ffc20e"

The scale uses a fixed lightness ladder (see references/palette-building.md).
Chroma follows a curve that peaks near 500 to 600 and is reduced until the
color fits sRGB, so the hex values are safe fallbacks. Contrast is WCAG 2.x
(sRGB relative luminance) plus APCA Lc (APCA-W3 0.0.98G constants), which is
informative only and not a conformance test.
"""
import math, re, sys, argparse

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
LIGHTNESS = [0.975, 0.935, 0.88, 0.81, 0.72, 0.635, 0.53, 0.46, 0.39, 0.32, 0.25]
CHROMA_SHAPE = [0.12, 0.28, 0.5, 0.75, 0.95, 1.0, 1.0, 0.92, 0.8, 0.65, 0.5]
# Neutral ramps only: two extra dark-theme surface steps below 950.
NEUTRAL_EXTRA = [(975, 0.215, 0.45), (990, 0.18, 0.4)]

def oklch_to_linear(L, C, H):
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)

def linear_to_oklch(r, g, b):
    l = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(A, B), math.degrees(math.atan2(B, A)) % 360

def in_srgb(L, C, H, eps=1e-4):
    return all(-eps <= x <= 1 + eps for x in oklch_to_linear(L, C, H))

def encode(x):
    x = min(max(x, 0.0), 1.0)
    return 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055

def decode(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def oklch_to_rgb(L, C, H):
    """Reduce chroma (keep L and H) until the color fits sRGB."""
    while C > 0 and not in_srgb(L, C, H):
        C = max(0.0, C - 0.001)
    return tuple(round(encode(x) * 255) for x in oklch_to_linear(L, C, H)), C

def parse(color):
    color = color.strip().lower()
    m = re.match(r"oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)", color)
    if m:
        L = float(m.group(1)) / (100 if m.group(2) else 1)
        return oklch_to_rgb(L, float(m.group(3)), float(m.group(4)))[0]
    h = color.lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def to_hex(rgb):
    return "#%02x%02x%02x" % rgb

def luminance(rgb):
    r, g, b = (decode(c / 255) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def wcag(a, b):
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

def apca(text, bg):
    def y(rgb):
        r, g, b = ((c / 255) ** 2.4 for c in rgb)
        v = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b
        return v + (0.022 - v) ** 1.414 if v < 0.022 else v
    yt, yb = y(text), y(bg)
    if abs(yb - yt) < 0.0005:
        return 0.0
    if yb > yt:
        s = (yb ** 0.56 - yt ** 0.57) * 1.14
        return 0.0 if s < 0.1 else (s - 0.027) * 100
    s = (yb ** 0.65 - yt ** 0.62) * 1.14
    return 0.0 if s > -0.1 else (s + 0.027) * 100

def verdict(r):
    # WCAG thresholds are not rounded: 4.499 fails 4.5.
    if r >= 7: return "AAA text"
    if r >= 4.5: return "AA text"
    if r >= 3: return "AA large text / UI only"
    return "fails"

def scale(hue, chroma, name, css, shift=0.0, neutral=False):
    """shift: degrees of hue rotation from step 50 to step 950 (optional).
    neutral: add steps 975 and 990 for dark theme surfaces."""
    white = (255, 255, 255)
    rows = []
    for i, (step, L, k) in enumerate(zip(STEPS, LIGHTNESS, CHROMA_SHAPE)):
        h = (hue + shift * (i / (len(STEPS) - 1) - 0.5)) % 360
        rgb, c = oklch_to_rgb(L, chroma * k, h)
        rows.append((step, L, c, h, rgb))
    if neutral:
        for step, L, k in NEUTRAL_EXTRA:
            h = (hue + shift * 0.5) % 360
            rgb, c = oklch_to_rgb(L, chroma * k, h)
            rows.append((step, L, c, h, rgb))
    s50, s950 = rows[0][4], rows[len(STEPS) - 1][4]
    if css:
        for step, L, c, h, rgb in rows:
            print(f"  --color-{name}-{step}: oklch({L*100:.1f}% {c:.3f} {h:.1f}); /* {to_hex(rgb)} */")
        return
    print(f"{'step':>4}  {'oklch':<24} {'hex':<8} {'vs white':>8} {'vs 50':>6} {'vs 950':>6}")
    for step, L, c, h, rgb in rows:
        print(f"{step:>4}  oklch({L*100:.1f}% {c:.3f} {h:.1f}){'':<3} {to_hex(rgb):<8} "
              f"{wcag(rgb, white):8.2f} {wcag(rgb, s50):6.2f} {wcag(rgb, s950):6.2f}")

def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("scale"); a.add_argument("--hue", type=float, required=True)
    a.add_argument("--chroma", type=float, default=0.18); a.add_argument("--name", default="color")
    a.add_argument("--css", action="store_true")
    a.add_argument("--shift", type=float, default=0.0, help="hue rotation in degrees across the scale")
    a.add_argument("--neutral", action="store_true", help="add 975 and 990 dark surface steps")
    b = sub.add_parser("check"); b.add_argument("fg"); b.add_argument("bg")
    c = sub.add_parser("hex2oklch"); c.add_argument("color")
    args = p.parse_args()
    if args.cmd == "scale":
        scale(args.hue, args.chroma, args.name, args.css, args.shift, args.neutral)
    elif args.cmd == "check":
        fg, bg = parse(args.fg), parse(args.bg)
        r = wcag(fg, bg)
        print(f"{to_hex(fg)} on {to_hex(bg)}: WCAG {r:.2f}:1 ({verdict(r)}), APCA Lc {apca(fg, bg):.1f}")
    else:
        rgb = parse(args.color)
        L, C, H = linear_to_oklch(*(decode(v / 255) for v in rgb))
        print(f"{to_hex(rgb)} = oklch({L*100:.1f}% {C:.3f} {H:.1f})")

if __name__ == "__main__":
    main()
