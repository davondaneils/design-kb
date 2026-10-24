#!/usr/bin/env python3
"""Build the self-hosted font CSS for ferry.html (design-typography reference 06, mixed path).

Sources: OFL fonts from the Fontsource npm packages, fetched with
  npm pack @fontsource-variable/inter @fontsource-variable/source-serif-4
and unpacked into src/fonts/. No font CDN.

Outputs (src/css/): fonts.css with inline base64 WOFF2 @font-face rules plus metric-matched fallbacks.

Reserved Font Name: Source Serif 4 is OFL "with Reserved Font Name 'Source'". A subset or an
axis-limited instance is a Modified Version (OFL FAQ 2.6, 2.7), so the shipped file is renamed
"Ferry Serif" inside its name table, not only in CSS. Inter declares no RFN.

Run: python3 -I src/build-fonts.py   (from the landing folder)
"""
import base64
import io
import os
import subprocess
import sys

from fontTools.ttLib import TTFont
from fontTools import subset as ftsubset
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.normpath(os.path.join(HERE, "../../../../../../skills/design-typography/assets/font_kit.py"))
INTER = os.path.join(HERE, "fonts/fontsource-variable-inter-5.3.0/package/files")
SERIF = os.path.join(HERE, "fonts/fontsource-variable-source-serif-4-5.3.1/package/files")
OUT = os.path.join(HERE, "css")
os.makedirs(OUT, exist_ok=True)

sys.path.insert(0, os.path.dirname(KIT))
from font_kit import unicodes, unicode_range  # noqa: E402  (reuse the kit's Latin core set)

LATIN = unicodes("")
RUPEE = [0x20B9]


def rename(font, new_family):
    """Replace every 'Source Serif 4' / 'SourceSerif4' string in the name table (RFN rule)."""
    for rec in font["name"].names:
        s = rec.toUnicode()
        t = s.replace("Source Serif 4", new_family).replace("SourceSerif4", new_family.replace(" ", ""))
        t = t.replace("Source Serif", new_family)
        if t != s:
            rec.string = t


def build(src, axes, cps, family, style, rename_to=None, weight=None):
    font = TTFont(src)
    font = instancer.instantiateVariableFont(font, axes)
    tmp = io.BytesIO(); font.flavor = None; font.save(tmp); tmp.seek(0)
    font = TTFont(tmp)
    opts = ftsubset.Options()
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    sub = ftsubset.Subsetter(options=opts)
    sub.populate(unicodes=cps)
    sub.subset(font)
    if rename_to:
        rename(font, rename_to)
    buf = io.BytesIO(); font.flavor = "woff2"; font.save(buf)
    data = buf.getvalue()
    if weight is None:
        if "fvar" in font:
            ax = {a.axisTag: a for a in font["fvar"].axes}
            weight = f"{int(ax['wght'].minValue)} {int(ax['wght'].maxValue)}" if "wght" in ax else str(font["OS/2"].usWeightClass)
        else:
            weight = str(font["OS/2"].usWeightClass)
    present = sorted(set(cps) & set(font.getBestCmap()))
    print(f"{family} {style} {os.path.basename(src)}: {len(data)/1024:.1f} KB, {len(present)} glyph code points", file=sys.stderr)
    return ("@font-face {\n"
            f'  font-family: "{family}";\n'
            f'  src: url("data:font/woff2;base64,{base64.b64encode(data).decode()}") format("woff2");\n'
            f"  font-weight: {weight};\n"
            f"  font-style: {style};\n"
            "  font-display: swap;\n"
            f"  unicode-range: {unicode_range(present)};\n"
            "}\n"), data


css = []
# Text and UI: Inter, weight 400 to 600, optical size kept 14 to 32 (font-optical-sizing: auto picks it).
c, inter_latin = build(f"{INTER}/inter-latin-opsz-normal.woff2", {"wght": (400, 600), "opsz": 16}, LATIN, "Inter Var", "normal")
css.append(c)
c, _ = build(f"{INTER}/inter-latin-ext-opsz-normal.woff2", {"wght": (400, 600), "opsz": 16}, RUPEE, "Inter Var", "normal")
css.append(c)
# Display: Source Serif 4 at display optical size, one weight, roman and italic. Renamed (RFN).
for style, name in (("normal", "normal"), ("italic", "italic")):
    c, data = build(f"{SERIF}/source-serif-4-latin-opsz-{name}.woff2", {"wght": 420, "opsz": 60}, LATIN, "Ferry Serif", style, rename_to="Ferry Serif", weight="400")
    css.append(c)
    with open(os.path.join(OUT, f"ferry-serif-{name}.woff2"), "wb") as fh:
        fh.write(data)
    c, _ = build(f"{SERIF}/source-serif-4-latin-ext-opsz-{name}.woff2", {"wght": 420, "opsz": 60}, RUPEE, "Ferry Serif", style, rename_to="Ferry Serif", weight="400")
    css.append(c)
with open(os.path.join(OUT, "inter.woff2"), "wb") as fh:
    fh.write(inter_latin)

# Metric-matched fallbacks (Liberation shares Arial and Times New Roman metrics).
LIB = "/usr/share/fonts/truetype/liberation"
fallbacks = [
    (os.path.join(OUT, "inter.woff2"), f"{LIB}/LiberationSans-Regular.ttf", "Arial,Liberation Sans", "Inter Fallback", "normal"),
    (os.path.join(OUT, "ferry-serif-normal.woff2"), f"{LIB}/LiberationSerif-Regular.ttf", "Times New Roman,Liberation Serif", "Ferry Serif Fallback", "normal"),
    (os.path.join(OUT, "ferry-serif-italic.woff2"), f"{LIB}/LiberationSerif-Italic.ttf",
     "Times New Roman Italic,TimesNewRomanPS-ItalicMT,Liberation Serif Italic", "Ferry Serif Fallback", "italic"),
]
for web, loc, names, fam, style in fallbacks:
    out = subprocess.run([sys.executable, "-I", KIT, "fallback", web, loc, "--local-name", names, "--family", fam, "--style", style],
                         check=True, capture_output=True, text=True).stdout
    css.append(out)

with open(os.path.join(OUT, "fonts.css"), "w") as fh:
    fh.write("".join(css))
for f in ("inter.woff2", "ferry-serif-normal.woff2", "ferry-serif-italic.woff2"):
    os.remove(os.path.join(OUT, f))  # intermediates: the page inlines the base64 CSS
print(f"fonts.css: {os.path.getsize(os.path.join(OUT, 'fonts.css'))/1024:.1f} KB", file=sys.stderr)
