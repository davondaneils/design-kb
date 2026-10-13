// Prints fail and warn counts and every message for each lint JSON given (run from the repo root).
import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
  const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  let fails = 0, warns = 0; const lines = [];
  for (const [k, v] of Object.entries(r.checks)) {
    for (const x of v.fail || []) { fails++; lines.push(`  FAIL ${k}: ${x.message} [${x.target || x.sel || ''}] ${x.width || ''} ${x.scheme || ''}`); }
    for (const x of v.warn || []) { warns++; lines.push(`  warn ${k}: ${x.message} [${x.target || x.sel || (x.targets || []).join(',')}] ${x.width || ''}`); }
  }
  console.log(`== ${f.split('/').pop()}: ${fails} fail, ${warns} warn`);
  const seen = new Set(); for (const l of lines) { const key = l.slice(0, 160); if (!seen.has(key)) { seen.add(key); console.log(l.slice(0, 260)); } }
}
