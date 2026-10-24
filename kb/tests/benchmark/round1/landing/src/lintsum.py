# Summarises tools/lint.mjs JSON reports: every fail, and warning counts per check.
import json, glob, sys
for f in sorted(glob.glob(sys.argv[1] if len(sys.argv) > 1 else 'lint/*.json')):
    d = json.load(open(f))
    s = d['summary']
    print('==', f, s.get('result'), 'fails', s.get('fails'), 'warns', s.get('warns'))
    for name, c in d['checks'].items():
        if not isinstance(c, dict): continue
        fl, wr = c.get('fail', []), c.get('warn', [])
        if fl:
            print('  FAIL', name, len(fl))
            seen = set()
            for i in fl:
                m = (i.get('message', '') + ' ' + str(i.get('target') or i.get('sel') or ''))[:230]
                if m in seen: continue
                seen.add(m); print('     x', m, i.get('scheme', ''), i.get('width', ''))
                if len(seen) > 10: break
        if wr and (len(sys.argv) > 2):
            for i in wr: print('     !', name, (i.get('message', '') + ' ' + str(i.get('target') or i.get('sel') or ''))[:230])
        elif wr: print('  warn', name, len(wr))
