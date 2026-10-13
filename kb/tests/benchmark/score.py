#!/usr/bin/env python3
"""Measured scorecard: compare built pages with the exemplar set, on the same measure.mjs JSON.

Usage: python3 kb/tests/benchmark/score.py <job> <page.json> [<page.json> ...]
  job: landing (vs stripe, linear, vercel, ramp, mercury) or app (vs stripe and vercel dashboards, linear home app markup)
Each page.json comes from: node kb/teardowns/measure.mjs <page.html> <page.json>
Prints one markdown table per width (1440, 390) with the page next to the exemplar range, and a verdict per row:
  in   = inside the exemplar range (min to max of the set)
  near = within 15 percent of the range
  out  = outside it
Rows marked gate are judged pass or FAIL against FOUNDATIONS instead (contrast counts every text pair measure.mjs
finds, large text included, so a FAIL there is a lead to check with the lint, not a verdict on its own).
Rows marked gate are fundamentals (contrast, measure, spacing grid); the rest are craft signals, not rules.
"""
import json, re, sys, os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, '..', '..', 'teardowns', 'data')
SETS = {
    'landing': ['stripe-home', 'linear-home', 'vercel-home', 'ramp-home', 'mercury-home'],
    'app': ['stripe-docs-dashboard', 'vercel-docs-dashboard', 'linear-home'],
}

def px(s):
    m = re.match(r'(-?[\d.]+)px', s or '')
    return float(m.group(1)) if m else None

def parse_type(v):
    # "16px / lh 22.4px / w300 / ls -0.22px"
    parts = [p.strip() for p in v.split('/')]
    size = px(parts[0]); lh = px(parts[1].replace('lh ', '')) if len(parts) > 1 else None
    w = int(re.sub(r'\D', '', parts[2]) or 400) if len(parts) > 2 else 400
    ls = px(parts[3].replace('ls ', '')) if len(parts) > 3 else 0
    return size, lh, w, (ls or 0)

def metrics(w):
    out = {}
    ts = [(parse_type(e['v']), e['n']) for e in w.get('typeScale', [])]
    total = sum(n for _, n in ts) or 1
    sig = [(t, n) for t, n in ts if n / total >= 0.01]
    sizes = sorted({round(t[0]) for t, _ in sig})
    out['type steps (>=1% of text)'] = len(sizes)
    out['largest step px'] = max(sizes) if sizes else None
    out['weights in use'] = len({t[2] for t, _ in sig})
    # Step ratio: median ratio between neighbouring sizes
    ratios = [b / a for a, b in zip(sizes, sizes[1:]) if a]
    out['median step ratio'] = round(sorted(ratios)[len(ratios) // 2], 3) if ratios else None
    # Body: the size carrying the most characters
    body = max(sig, key=lambda x: x[1])[0] if sig else None
    if body:
        out['body px'] = body[0]
        out['body line height'] = round(body[1] / body[0], 2) if body[1] else None
    # Display tracking: every entry 32px and up, character weighted, in em
    disp = [(t, n) for t, n in ts if t[0] and t[0] >= 32]
    if disp:
        dn = sum(n for _, n in disp)
        out['display tracking em'] = round(sum(t[3] / t[0] * n for t, n in disp) / dn, 4)
        out['display line height'] = round(sum((t[1] or t[0] * 1.2) / t[0] * n for t, n in disp) / dn, 2)
    h = w.get('h1Style') or {}
    m = re.search(r'([\d.]+)px/([\d.]+)px w(\d+) ls (-?[\d.]+)px', h.get('font', '') or '')
    if m:
        s, lh, wt, ls = map(float, m.groups())
        out['h1 px'] = s
        out['h1 line height'] = round(lh / s, 2)
        out['h1 tracking em'] = round(ls / s, 4)
        out['h1 weight'] = int(wt)
    meas = w.get('measure') or {}
    out['body chars per line'] = meas.get('charsPerLine')
    # Contrast: character weighted share of text in pairs under 4.5:1, and the lowest pair carrying >=1% of text
    cp = w.get('contrastPairs', [])
    ctot = sum(e['n'] for e in cp) or 1
    low = 0; mins = []
    for e in cp:
        r = float(re.sub(r':1$', '', e.get('ex', '0')) or 0)
        if r < 4.5: low += e['n']
        if e['n'] / ctot >= 0.01: mins.append(r)
    out['text under 4.5:1 (% chars)'] = round(100 * low / ctot, 1)
    out['lowest main pair'] = min(mins) if mins else None
    tc = w.get('textColors', [])
    tt = sum(e['n'] for e in tc) or 1
    out['text colors (>=1%)'] = len([e for e in tc if e['n'] / tt >= 0.01])
    # Spacing rhythm: share of padding, gap and margin uses on the 4px grid (1px and 2px hairline offsets excluded)
    on = off = 0; distinct = set()
    for key in ('paddings', 'gaps', 'margins'):
        for e in w.get(key, []):
            for tok in re.findall(r'(-?[\d.]+)px', e['v']):
                v = abs(float(tok))
                if v <= 2: continue
                distinct.add(v)
                if abs(v / 4 - round(v / 4)) < 0.01: on += e['n']
                else: off += e['n']
    out['spacing on 4px grid (%)'] = round(100 * on / ((on + off) or 1), 1)
    out['distinct spacing values'] = len(distinct)
    out['distinct radii'] = len(w.get('radii', []))
    out['distinct shadows'] = len(w.get('shadows', []))
    durs = set(); eases = set()
    for e in w.get('transitions', []):
        for d in re.findall(r'([\d.]+)s\b', e['v']):
            if float(d) > 0: durs.add(float(d))
        for c in re.findall(r'cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|linear|ease', e['v']):
            eases.add(c)
    out['transition durations'] = len(durs)
    out['longest transition s'] = max(durs) if durs else 0
    out['easing curves'] = len(eases)
    out['families'] = len(w.get('families', []))
    out['page height / width'] = round(w.get('pageHeight', 0) / w.get('width', 1), 1)
    return out

GATE = {'text under 4.5:1 (% chars)', 'lowest main pair', 'body chars per line', 'spacing on 4px grid (%)', 'body line height'}

# Gate rows are judged against FOUNDATIONS, not the exemplar range: several exemplars fail them (kb/teardowns/INDEX.md section 3).
ABS = {
    'text under 4.5:1 (% chars)': lambda v: v == 0,
    'lowest main pair': lambda v: v >= 4.5,
    'body chars per line': lambda v: 40 <= v <= 75,
    'spacing on 4px grid (%)': lambda v: v >= 95,
    'body line height': lambda v: 1.4 <= v <= 1.7,
}

def verdict(v, lo, hi, k=None):
    if k in ABS and v is not None: return 'pass' if ABS[k](v) else 'FAIL'
    if v is None or lo is None: return ''
    if lo <= v <= hi: return 'in'
    span = max(abs(hi - lo), abs(hi) * 0.15, 1e-6)
    return 'near' if (lo - 0.15 * span <= v <= hi + 0.15 * span) else 'out'

def main():
    job, pages = sys.argv[1], sys.argv[2:]
    ex = {s: json.load(open(os.path.join(DATA, s + '.json'))) for s in SETS[job]}
    for width in ('1440', '390'):
        exm = {s: metrics(d['widths'][width]) for s, d in ex.items() if width in d['widths']}
        pm = {os.path.basename(p).replace('.json', ''): metrics(json.load(open(p))['widths'][width]) for p in pages}
        keys = list(next(iter(exm.values())).keys())
        print(f'\n### {width} wide\n')
        print('| Measure | ' + ' | '.join(pm) + ' | Exemplar range | ' + ' | '.join(exm) + ' | Verdict |')
        print('|' + '---|' * (len(pm) + len(exm) + 3))
        for k in keys:
            vals = [m.get(k) for m in exm.values() if m.get(k) is not None]
            lo, hi = (min(vals), max(vals)) if vals else (None, None)
            pv = [m.get(k) for m in pm.values()]
            vd = ', '.join(verdict(v, lo, hi, k) for v in pv)
            name = k + (' (gate)' if k in GATE else '')
            print(f'| {name} | ' + ' | '.join(str(v) for v in pv) + f' | {lo} to {hi} | ' + ' | '.join(str(m.get(k)) for m in exm.values()) + f' | {vd} |')

if __name__ == '__main__':
    main()
