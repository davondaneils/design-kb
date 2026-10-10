#!/usr/bin/env node
// Lints every round 4 page, every review state and both state sheets with tools/lint.mjs (run from the repo root:
// node kb/tests/round4/lint-all.mjs). Writes <page>[.<state>].lint.json beside the pages and prints one line per run.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const rel = path.relative(process.cwd(), here);
const runs = [
  ['coffee.html', ''],
  ...['menu', 'quick', 'sub-error', 'plan-4', 'cart', 'cart-empty', 'removed', 'checkout', 'checkout-error', 'error', 'sending', 'subscribed'].map((s) => ['coffee.html', 'state=' + s]),
  ['coffee-states.html', ''],
  ['dashboard.html', ''],
  ...['loading', 'empty', 'partial', 'viewer', 'first-run', 'listening', 'check-failed', 'first-data', 'limit', 'limit-member'].map((s) => ['dashboard.html', 'state=' + s]),
  ['dashboard.html', 'density=compact'], ['dashboard.html', 'open=palette'], ['dashboard.html', 'open=sheet'], ['dashboard.html', 'metric=conv'],
  ['dashboard-states.html', ''],
];
const only = process.argv[2];
let failed = 0;
for (const [page, q] of runs) {
  if (only && !page.startsWith(only)) continue;
  const tag = q ? '.' + q.replace(/[=&]/g, '-') : '';
  const json = path.join(rel, page.replace('.html', '') + tag + '.lint.json');
  try { execFileSync('node', ['tools/lint.mjs', path.join(rel, page) + (q ? '?' + q : ''), '--json', json, '--quiet'], { stdio: 'pipe' }); } catch { /* exit 1 on fail; read the JSON */ }
  const r = JSON.parse(fs.readFileSync(json, 'utf8'));
  const fails = Object.entries(r.checks).flatMap(([k, v]) => (v.fail || []).map((f) => k + ': ' + f.message));
  if (fails.length) failed++;
  console.log(`${r.summary.result.padEnd(4)} ${String(r.summary.fails).padStart(2)} fail ${String(r.summary.warns).padStart(3)} warn  ${page}${q ? '?' + q : ''}`);
  for (const f of fails.slice(0, 6)) console.log('       ' + f.slice(0, 220));
}
console.log(failed ? `${failed} runs failed` : 'all runs pass');
process.exit(failed ? 1 : 0);
