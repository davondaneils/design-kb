#!/usr/bin/env python3
"""font_kit.py: self-host a font without a font CDN.

Two jobs, both from local font files (no network):

  subset    Cut a font (static or variable, TTF/OTF/WOFF2) down to the characters a page uses,
            optionally narrow its variable axes, write WOFF2, and print an @font-face rule
            (file URL or inline base64 data URI).
  fallback  Compute size-adjust, ascent-override, descent-override and line-gap-override so a
            local fallback font (for example Times New Roman, Georgia, Arial) occupies the same
            space as the web font. The swap then shifts nothing.

Requires: pip install fonttools brotli

Usage:
  python3 font_kit.py subset  <font> <out.woff2> [--axes wght=300:600,opsz=6:72] [--text "extra chars"]
                              [--family "Name"] [--style normal|italic] [--inline]
  python3 font_kit.py fallback <webfont> <localfallback> --local-name "Times New Roman,Liberation Serif" [--family "Name"]
            (--local-name takes a comma list: the metric-compatible local fonts to try, in order)

License check first: under the SIL OFL a subset or an axis-limited instance is a Modified Version.
If the font's copyright line declares a Reserved Font Name, the modified file may not use that name
(OFL FAQ 2.6, 2.7). `--family` changes only the CSS family name, not the name table inside the file:
for a Reserved Font Name, rename the name table too (name IDs 1, 4, 6, 16 with fontTools) before shipping.
Commercial EULAs often forbid modification and inlining entirely. Read the license.
"""
import argparse
import base64
import io
import sys

from fontTools.ttLib import TTFont
from fontTools import subset as ftsubset

# Latin core plus the typographic characters a professional page uses. Dropping any of these makes
# the browser fall back to another font mid-word (reference 03, Subsetting).
LATIN_CORE = (
    [(0x20, 0x7E), (0xA0, 0xFF)]
    + [(c, c) for c in (0x131, 0x152, 0x153, 0x2C6, 0x2DA, 0x2DC)]
    + [(0x2009, 0x200B), (0x2013, 0x2014), (0x2018, 0x201E), (0x2020, 0x2022), (0x2026, 0x2026),
       (0x2030, 0x2030), (0x2032, 0x2033), (0x2039, 0x203A), (0x2044, 0x2044), (0x202F, 0x202F),
       (0x20AC, 0x20AC), (0x20B9, 0x20B9), (0x2122, 0x2122), (0x2190, 0x2193), (0x2212, 0x2212), (0x00D7, 0x00D7)]
)

# Sample used to compare average character widths (lowercase-heavy English, like body copy).
SAMPLE = "the quick brown fox jumps over the lazy dog while five wizards box and judge quietly, " \
         "Every coffee we roast ships within two days. Tasting notes: peach, jasmine, honey."


def unicodes(extra=""):
    out = set()
    for a, b in LATIN_CORE:
        out.update(range(a, b + 1))
    out.update(ord(c) for c in extra)
    return sorted(out)


def unicode_range(cps):
    """Collapse code points into a CSS unicode-range string."""
    parts, start, prev = [], None, None
    for cp in cps:
        if start is None:
            start = prev = cp
        elif cp == prev + 1:
            prev = cp
        else:
            parts.append((start, prev)); start = prev = cp
    if start is not None:
        parts.append((start, prev))
    return ", ".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in parts)


def cmd_subset(a):
    font = TTFont(a.font)
    weight_desc = None
    if a.axes:
        from fontTools.varLib import instancer
        limits = {}
        for item in a.axes.split(","):
            tag, rng = item.split("=")
            lo, _, hi = rng.partition(":")
            limits[tag] = (float(lo), float(hi)) if hi else float(lo)
        font = instancer.instantiateVariableFont(font, limits)
        tmp = io.BytesIO(); font.flavor = None; font.save(tmp); tmp.seek(0)
        font = TTFont(tmp)  # reload: the subsetter trips on lazily loaded tables after instancing
    if "fvar" in font:
        for ax in font["fvar"].axes:
            if ax.axisTag == "wght":
                weight_desc = f"{int(ax.minValue)} {int(ax.maxValue)}"
    if weight_desc is None:
        weight_desc = str(font["OS/2"].usWeightClass)
    cps = unicodes(a.text or "")
    opts = ftsubset.Options()
    opts.layout_features = ["*"]        # keep kern, liga, tnum, case, ss01... every feature the font has
    opts.name_IDs = ["*"]
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    opts.flavor = "woff2"
    sub = ftsubset.Subsetter(options=opts)
    sub.populate(unicodes=cps)
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    data = buf.getvalue()
    with open(a.out, "wb") as fh:
        fh.write(data)
    src = (f'url("data:font/woff2;base64,{base64.b64encode(data).decode()}") format("woff2")'
           if a.inline else f'url("{a.out}") format("woff2")')
    family = a.family or font["name"].getDebugName(1)
    print(f"/* {a.out}: {len(data)/1024:.1f} KB woff2, {len(cps)} code points */", file=sys.stderr)
    print("@font-face {\n"
          f'  font-family: "{family}";\n'
          f"  src: {src};\n"
          f"  font-weight: {weight_desc};\n"
          f"  font-style: {a.style};\n"
          "  font-display: swap;\n"
          f"  unicode-range: {unicode_range(cps)};\n"
          "}")


def avg_width(font):
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    widths = [hmtx[cmap[ord(c)]][0] for c in SAMPLE if ord(c) in cmap]
    return sum(widths) / len(widths) / font["head"].unitsPerEm


def cmd_fallback(a):
    web, loc = TTFont(a.webfont), TTFont(a.fallback)
    upm = web["head"].unitsPerEm
    size_adjust = avg_width(web) / avg_width(loc)
    hhea = web["hhea"]
    asc = hhea.ascent / upm / size_adjust
    desc = abs(hhea.descent) / upm / size_adjust
    gap = hhea.lineGap / upm / size_adjust
    family = a.family or (web["name"].getDebugName(1) + " Fallback")
    print("@font-face {\n"
          f'  font-family: "{family}";\n'
          f"  src: {', '.join(f'local(\"{n.strip()}\")' for n in a.local_name.split(','))};\n"
          f"  size-adjust: {size_adjust*100:.2f}%;\n"
          f"  ascent-override: {asc*100:.2f}%;\n"
          f"  descent-override: {desc*100:.2f}%;\n"
          f"  line-gap-override: {gap*100:.2f}%;\n"
          + (f"  font-style: {a.style};\n" if a.style != "normal" else "")
          + "}")
    print(f"/* average width web {avg_width(web):.4f}em vs fallback {avg_width(loc):.4f}em */", file=sys.stderr)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("subset")
    s.add_argument("font"); s.add_argument("out")
    s.add_argument("--axes"); s.add_argument("--text")
    s.add_argument("--family"); s.add_argument("--style", default="normal")
    s.add_argument("--inline", action="store_true")
    f = sp.add_parser("fallback")
    f.add_argument("webfont"); f.add_argument("fallback")
    f.add_argument("--local-name", required=True); f.add_argument("--family")
    f.add_argument("--style", default="normal")
    a = p.parse_args()
    {"subset": cmd_subset, "fallback": cmd_fallback}[a.cmd](a)


if __name__ == "__main__":
    main()
