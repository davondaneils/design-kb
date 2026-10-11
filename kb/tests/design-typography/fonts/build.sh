#!/bin/sh
# Rebuilds the self-hosted font subsets used by the design-typography test pages.
# Sources: OFL fonts from the Fontsource npm packages (npm pack @fontsource-variable/newsreader
# @fontsource-variable/inter), unpacked to $SRC. No font CDN involved.
# Run from this folder: SRC=/path/to/unpacked sh build.sh
set -e
KIT=../../../../skills/design-typography/assets/font_kit.py
SRC=${SRC:-/tmp/claude-0/-home-claude-design-kb/7d54560a-30fa-5288-8002-e57a005c7126/scratchpad/fonts}

# Display serif for the coffee page: axes pinned to the one instance used (opsz 48, wght 400).
python3 -I "$KIT" subset "$SRC/news/package/files/newsreader-latin-opsz-normal.woff2" newsreader-display-roman.woff2 --axes wght=400,opsz=48 --family "Newsreader Display" --inline > newsreader-display-roman.css
python3 -I "$KIT" subset "$SRC/news/package/files/newsreader-latin-opsz-italic.woff2" newsreader-display-italic.woff2 --axes wght=400,opsz=48 --family "Newsreader Display" --style italic --inline > newsreader-display-italic.css
# UI face for the dashboard: weight axis narrowed to the 400 to 600 the page uses.
python3 -I "$KIT" subset "$SRC/inter/package/files/inter-latin-wght-normal.woff2" inter-text.woff2 --axes wght=400:600 --family "Inter Var" --inline > inter-text.css
# Metric-matched local fallbacks (Liberation fonts share Arial and Times New Roman metrics).
python3 -I "$KIT" fallback "$SRC/inter/package/files/inter-latin-wght-normal.woff2" /usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf --local-name "Arial,Liberation Sans" --family "Inter Fallback" > inter-fallback.css
python3 -I "$KIT" fallback newsreader-display-roman.woff2 /usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf --local-name "Times New Roman,Liberation Serif" --family "Newsreader Fallback" > newsreader-fallback.css

# The italic needs its own fallback face, or the fallback renders upright under font-synthesis: none.
python3 -I "$KIT" fallback newsreader-display-italic.woff2 /usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf --local-name "Times New Roman Italic,TimesNewRomanPS-ItalicMT,Liberation Serif Italic" --family "Newsreader Fallback" --style italic > newsreader-fallback-italic.css

# Measured, not shipped (2026-10-09): the designer's own Inter 4.0 release (Debian fonts-inter) keeps
# 40 OpenType features (case, zero, ss01 to ss08, cv01 to cv13, smcp, sups); the Fontsource build keeps 7
# (calt, dnom, frac, locl, numr, pnum, tnum). Subset static cuts from the full release cost 38 to 41 KB
# each (Regular, Medium, SemiBold, Display SemiBold: 161 KB), against 27 KB for the variable 400 to 600 file.
# To rebuild them: python3 -I "$KIT" subset /usr/share/fonts/opentype/inter/Inter-Regular.otf inter-regular.woff2 --inline

rm -f ./*.woff2   # the pages inline the base64 CSS; the binaries are build intermediates
ls -la
