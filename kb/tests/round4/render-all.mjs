#!/usr/bin/env node
// Renders every round 4 page, state and state sheet with tools/render.mjs (run from the repo root, with the repo served
// over HTTP so lazy images load and fonts preload the way they would on the origin):
//   python3 -m http.server 8765 --bind 127.0.0.1 &   node kb/tests/round4/render-all.mjs
// Pages: 390, 768, 1024 and 1440, light and dark. States: 390 and 1440, light and dark. Sheets: 390 and 1440, both schemes.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const rel = path.relative(process.cwd(), here);
const base = 'http://127.0.0.1:' + (process.env.KB_PORT || 8765) + '/' + rel + '/';
const out = path.join(rel, 'shots');
const run = (url, widths, dir = out) => {
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('node', ['tools/render.mjs', base + url, dir, '--widths', widths], { stdio: 'inherit' });
};
run('coffee.html', '390,768,1024,1440');
run('dashboard.html', '390,768,1024,1440');
for (const s of ['menu', 'quick', 'sub-error', 'plan-4', 'cart', 'cart-empty', 'removed', 'checkout', 'checkout-error', 'error', 'sending', 'subscribed']) run('coffee.html?state=' + s, '390,1440', path.join(out, 'states'));
for (const s of ['state=loading', 'state=empty', 'state=partial', 'state=viewer', 'state=first-run', 'state=listening', 'state=check-failed', 'state=first-data', 'state=limit', 'state=limit-member', 'density=compact', 'open=palette', 'open=sheet', 'metric=conv']) run('dashboard.html?' + s, '390,1440', path.join(out, 'states'));
run('coffee-states.html', '390,1440');
run('dashboard-states.html', '390,1440');
