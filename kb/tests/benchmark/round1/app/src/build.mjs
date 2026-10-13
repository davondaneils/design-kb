#!/usr/bin/env node
// Builds kb/tests/benchmark/round1/app/run-review.html and run-review-states.html (run from the repo root:
//   node kb/tests/benchmark/round1/app/src/build.mjs).
// Inputs: data.mjs (sample run), app.css, page.mjs (markup), states.mjs (state sheet), icons.mjs (icon set, mark),
// fonts/inter-opsz-400-600.woff2 (Inter, OFL, from npm @fontsource-variable/inter 5.3.0, subset with
// skills/design-typography/assets/font_kit.py), wordmark.svg (skills/design-graphic/assets/wordmark.py).
// Every derived number (USD per currency, totals, shares, deltas) is computed here from data.mjs, never typed.
import fs from 'node:fs';
import path from 'node:path';
import { run, currencies, people, hire } from './data.mjs';
import { expandIcons, faviconSvg } from './icons.mjs';
import { renderPage } from './page.mjs';
import { renderStates } from './states.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.resolve(here, '..');
const c2 = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
const money = (x, d = 2) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const usd = (x) => (x < 0 ? '−$' : '$') + money(Math.abs(x));

// ---- the arithmetic ----
const cur = currencies.map((c) => {
  const ps = people.filter((p) => p.cur === c.code);
  const local = c2(ps.reduce((a, p) => a + p.amount, 0));
  const localSep = c2(ps.filter((p) => p.status !== 'hire').reduce((a, p) => a + p.amount, 0));
  return { ...c, count: ps.length, local, usd: c2(local / c.rate), usdSep: c2(localSep / c.sep), vsAvg: (c.avg30 / c.rate - 1) * 100 };
});
const total = c2(cur.reduce((a, c) => a + c.usd, 0));
const sepTotal = c2(cur.reduce((a, c) => a + c.usdSep, 0));
const delta = c2(total - sepTotal);
const gbp = cur.find((c) => c.code === 'GBP');
const hirePerson = people.find((p) => p.status === 'hire');
const hireUsd = c2(hirePerson.amount / gbp.rate);
const fx = c2(delta - hireUsd);
// shares: 1 decimal, largest remainder so the 7 shares sum to exactly 100.0
const raw = cur.map((c) => (c.usd / total) * 1000);
const fl = raw.map(Math.floor);
let left = 1000 - fl.reduce((a, b) => a + b, 0);
raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => fl[i]++);
cur.forEach((c, i) => { c.share = fl[i] / 10; });
const brl = cur.find((c) => c.code === 'BRL');
const brlPerson = people.find((p) => p.status === 'rate');
const brlAtAvg = c2(brlPerson.amount / brl.avg30);
const bankPerson = people.find((p) => p.status === 'bank');
const ctx = {
  run, cur, people, hire, total, sepTotal, delta, hireUsd, fx, brl, brlPerson, brlAtAvg, bankPerson, hirePerson,
  count: people.length, sepCount: people.filter((p) => p.status !== 'hire').length,
  converted: cur.filter((c) => c.code !== 'USD').length, attention: people.filter((p) => p.status !== 'ready').length,
  money, usd,
};

// ---- checks: fail the build if the story and the data disagree ----
const assert = (ok, msg) => { if (!ok) { console.error('ARITHMETIC FAIL: ' + msg); process.exit(1); } };
assert(people.length === 38, '38 people');
assert(currencies.length === 7, '7 currencies');
assert(Math.abs(c2(cur.reduce((a, c) => a + c.usd, 0)) - total) < 0.005, 'total = sum of currency USD');
assert(cur.every((c) => c.code === 'USD' || Math.abs(c2(c.local / c.rate) - c.usd) < 0.005), 'USD = local / rate');
assert(Math.abs(c2(hireUsd + fx) - delta) < 0.005, 'delta = hire + fx');
assert(c2(hire.monthly * hire.days / hire.of) === hirePerson.amount, 'proration');
assert(Math.round(cur.reduce((a, c) => a + c.share, 0) * 10) === 1000, 'shares sum to 100.0');
assert(ctx.attention === 3, '3 need attention');
fs.writeFileSync(path.join(here, 'arithmetic.json'), JSON.stringify({ total, sepTotal, delta, hireUsd, fx, brlAtAvg,
  brlVsAvgPct: +brl.vsAvg.toFixed(2), currencies: cur.map(({ code, count, local, rate, usd, sep, usdSep, share }) => ({ code, count, local, rate, usd, sepRate: sep, usdSep, share })) }, null, 2));

// ---- assets ----
const font = fs.readFileSync(path.join(here, 'fonts/inter-opsz-400-600.woff2')).toString('base64');
const fontCss = `@font-face { font-family: "Inter Var"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 400 600; font-style: normal; font-display: swap; }
@font-face { font-family: "Inter Fallback"; src: local("Arial"), local("Liberation Sans"); size-adjust: 107.59%; ascent-override: 90.04%; descent-override: 22.42%; line-gap-override: 0%; }`;
let word = fs.readFileSync(path.join(here, 'wordmark.svg'), 'utf8').trim();
// wordmark.py clips descenders (viewBox ends 4% under the baseline); "Ferry" has a y, so open the box to the descender.
word = word.replace(/viewBox="0 0 ([\d.]+) 108"/, 'viewBox="0 0 $1 132"').replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg class="logo-word" role="img" aria-label="Ferry"');
const favicon = 'data:image/svg+xml,' + encodeURIComponent(faviconSvg);
const faviconPng = fs.existsSync(path.join(here, 'favicon-64.png')) ? 'data:image/png;base64,' + fs.readFileSync(path.join(here, 'favicon-64.png')).toString('base64') : '';
const css = fs.readFileSync(path.join(here, 'app.css'), 'utf8');
const assets = { fontCss, css, word, favicon, faviconPng };

const page = expandIcons(renderPage(ctx, assets));
fs.writeFileSync(path.join(out, 'run-review.html'), page);
fs.writeFileSync(path.join(out, 'run-review-states.html'), expandIcons(renderStates(ctx, assets)));
fs.writeFileSync(path.join(here, 'favicon.svg'), faviconSvg);
console.log(`built run-review.html (${(page.length / 1024).toFixed(1)} KB): total ${usd(total)}, September ${usd(sepTotal)}, delta ${usd(delta)} = hire ${usd(hireUsd)} + rates ${usd(fx)}`);
