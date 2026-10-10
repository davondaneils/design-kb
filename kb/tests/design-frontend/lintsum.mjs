#!/usr/bin/env node
// Summarise lint JSON files: fails and warnings per check. Usage: node lintsum.mjs <dir-or-files...>
import fs from 'node:fs';
import path from 'node:path';
const files = process.argv.slice(2).flatMap((p) => fs.statSync(p).isDirectory() ? fs.readdirSync(p).filter((f) => f.endsWith('.lint.json')).map((f) => path.join(p, f)) : [p]);
for (const f of files.sort()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const fails = [], warns = [];
  for (const [k, c] of Object.entries(j.checks || {})) { for (const _ of c.fail || []) fails.push(k); for (const _ of c.warn || []) warns.push(k); }
  const tally = (a) => Object.entries(a.reduce((m, c) => ((m[c] = (m[c] || 0) + 1), m), {})).map(([k, n]) => `${k} ${n}`).join(', ');
  console.log(`${path.basename(f).padEnd(44)} fail ${String(fails.length).padStart(3)}  warn ${String(warns.length).padStart(3)}  ${tally(fails)}${warns.length ? ' | warn: ' + tally(warns) : ''}`);
}
