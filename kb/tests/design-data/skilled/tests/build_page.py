#!/usr/bin/env python3
"""Inject the captured API responses (tests/fixtures/*.json) into the page template -> schedule.html."""
import json, pathlib
here = pathlib.Path(__file__).parent
fx = here / 'fixtures'
weeks = {}
for f in ['ready', 'empty', 'east-2026-10-05', 'east-2026-10-19', 'ridgeline-2026-10-12']:
    d = json.loads((fx / f'{f}.json').read_text())
    weeks[f"{d['location']['id']}|{d['period']['start_date']}"] = d
for f in ['past-due', 'lapsed']:
    weeks[f'state:{f}'] = json.loads((fx / f'{f}.json').read_text())
payload = json.dumps({'me': json.loads((fx / 'me.json').read_text()), 'weeks': weeks}, ensure_ascii=False, separators=(',', ':'))
payload = payload.replace('</', '<\\/')
tpl = (here / 'schedule.template.html').read_text()
assert tpl.count('/*FIXTURES*/') == 1
(here.parent / 'schedule.html').write_text(tpl.replace('/*FIXTURES*/', payload))
print('wrote', here.parent / 'schedule.html', len(payload), 'bytes of fixtures')
