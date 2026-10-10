#!/usr/bin/env python3
"""Assemble the design-ux test sources from the combined baseline plus the parts in this folder.
Run from the repo root: python3 kb/tests/design-ux/parts/assemble.py
Writes kb/tests/design-ux/coffee.src.html and dashboard.src.html; build.mjs then inlines fonts and art."""
import re, pathlib
here = pathlib.Path(__file__).parent
base = here.parent.parent / 'combined'
P = lambda n: (here / n).read_text()

def sub(s, a, b, count=1):
    if a not in s:
        raise SystemExit('missing: ' + a[:80])
    return s.replace(a, b, count)

# ---------- coffee ----------
s = (base / 'coffee.src.html').read_text()
s = sub(s, "   Network limit:", "   design-ux (wave 2): the purchase flow and phone navigation are real states; see kb/tests/design-ux.md.\n   Network limit:")
s = sub(s, "--duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms; --duration-page: 600ms;",
        "--duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms; --duration-slow: 300ms; --duration-page: 600ms;")
s = sub(s, "  --elevation-card: var(--ring), var(--shadow-1);\n",
        "  --shadow-3: 0 2px 4px -1px rgb(var(--shadow-rgb) / 0.08), 0 12px 24px -6px rgb(var(--shadow-rgb) / 0.16);\n"
        "  --shadow-4: 0 4px 8px -2px rgb(var(--shadow-rgb) / 0.10), 0 24px 48px -12px rgb(var(--shadow-rgb) / 0.24);\n"
        "  --elevation-card: var(--ring), var(--shadow-1);\n")
s = sub(s, "    --shadow-1: none; --shadow-2: none;\n", "    --shadow-1: none; --shadow-2: none; --shadow-3: none; --shadow-4: none;\n")
s = sub(s, "@media (prefers-reduced-motion: reduce) { *, *::before, *::after", P('coffee-flow.css') + "\n@media (prefers-reduced-motion: reduce) { *, *::before, *::after")
s = re.sub(r'<header class="site-header">.*?</header>\n', lambda m: P('coffee-header.html'), s, count=1, flags=re.S)
s = sub(s, '<a class="btn btn-secondary" href="#shop">Buy a bag, $21</a>',
        '<button class="btn btn-secondary" type="button" data-quick="guji" aria-haspopup="dialog">Buy a bag, $21</button>')
s = re.sub(r'  <section class="feature" id="subscribe".*?</section>\n', lambda m: P('coffee-feature.html'), s, count=1, flags=re.S)
for key, name in [('guji', 'Ethiopia Guji'), ('huila', 'Colombia Huila'), ('oak', 'Oak Fire Espresso')]:
    s = re.sub(r'<button class="btn btn-secondary btn-sm add-btn" type="button"><span class="idle">Add to cart<span class="sr-only">: ' + name + r'</span></span>.*?</button>',
               '<button class="btn btn-secondary btn-sm add-btn" type="button" data-quick="' + key + '" aria-haspopup="dialog">Add to cart…<span class="sr-only"> ' + name + '</span></button>', s, count=1, flags=re.S)
s = sub(s, '<div class="sr-only" role="status" aria-live="polite" id="announce"></div>',
        P('coffee-dialogs.html') + '<div class="sr-only" role="status" aria-live="polite" id="announce"></div>')
s = re.sub(r'<script>.*?</script>\n', lambda m: P('coffee-script.html'), s, count=1, flags=re.S)
(here.parent / 'coffee.src.html').write_text(s)
print('wrote coffee.src.html')

# ---------- dashboard ----------
d = (base / 'dashboard.src.html').read_text()
if (here / 'dash-assemble.py').exists():
    ns = {'d': d, 'P': P, 'sub': sub, 're': re}
    exec((here / 'dash-assemble.py').read_text(), ns)
    d = ns['d']
(here.parent / 'dashboard.src.html').write_text(d)
print('wrote dashboard.src.html')
