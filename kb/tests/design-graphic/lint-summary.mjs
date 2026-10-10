// Prints one line per lint JSON in this folder (and before/): file, result, fails, warns, and the failing checks.
// Run from the repo root: node kb/tests/design-graphic/lint-summary.mjs
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
for (const dir of ['before', '.']) {
  const d = path.join(here, dir);
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.lint.json')).sort()) {
    const j = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
    const failing = Object.entries(j.summary).filter(([, v]) => typeof v === 'string' && v.startsWith('fail')).map(([k]) => k);
    console.log(`${dir === '.' ? '' : dir + '/'}${f}  ${j.summary.result}  fails ${j.summary.fails}  warns ${j.summary.warns}${failing.length ? '  [' + failing.join(', ') + ']' : ''}`);
  }
}
