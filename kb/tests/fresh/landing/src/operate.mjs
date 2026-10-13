#!/usr/bin/env node
// Operates every control on halyard.html by mouse, Enter and Space, on a fresh load each time, and records what
// changed. Also re-adds every total from the figures as displayed. Writes reports/operate.json and prints a table.
// Usage (repo root): node kb/tests/fresh/landing/src/operate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { launch } = await import(pathToFileURL(path.resolve(here, '../../../../../tools/browser.mjs')).href);
const page_url = pathToFileURL(path.resolve(here, '../halyard.html')).href;

// Each control: how to find it, what to read before and after, what the change must be.
const controls = [
  { name: 'Pause animation', width: 1440, sel: '[data-scene-pause]',
    read: () => ({ pressed: document.querySelector('[data-scene-pause]').getAttribute('aria-pressed'), paused: document.querySelector('#hero-scene').hasAttribute('data-scene-paused') }),
    expect: (a, b) => a.pressed === 'false' && b.pressed === 'true' && b.paused },
  { name: 'Billing: Yearly', width: 1440, sel: '[data-billing-set="year"]',
    read: () => ({ billing: document.getElementById('plus').dataset.billing, cta: document.querySelector('[data-plus-cta]').textContent, href: document.querySelector('[data-plus-cta]').getAttribute('href'), terms: document.querySelector('[data-plus-terms]').textContent.slice(0, 30), pressed: document.querySelector('[data-billing-set="year"]').getAttribute('aria-pressed') }),
    expect: (a, b) => a.billing === 'month' && b.billing === 'year' && b.cta === 'Get Plus, £39 a year' && b.href.includes('year') && b.terms.startsWith('Renews every year') && b.pressed === 'true' },
  { name: 'Billing: Monthly (from yearly)', width: 1440, sel: '[data-billing-set="month"]', pre: '[data-billing-set="year"]',
    read: () => ({ billing: document.getElementById('plus').dataset.billing, cta: document.querySelector('[data-plus-cta]').textContent }),
    expect: (a, b) => a.billing === 'year' && b.billing === 'month' && b.cta === 'Get Plus, £4.99 a month' },
  ...[1, 2, 3, 4, 5].map((n) => ({ name: `FAQ ${n}`, width: 1440, sel: `.faq details:nth-child(${n}) summary`,
    read: new Function(`return { open: document.querySelector('.faq details:nth-child(${n})').open };`),
    expect: (a, b) => !a.open && b.open })),
  { name: 'Menu (390)', width: 390, sel: '[data-menu]',
    read: () => ({ expanded: document.querySelector('[data-menu]').getAttribute('aria-expanded'), navShown: getComputedStyle(document.getElementById('site-nav')).display !== 'none' }),
    expect: (a, b) => a.expanded === 'false' && !a.navShown && b.expanded === 'true' && b.navShown },
];

const browser = await launch();
const rows = [];
for (const c of controls) {
  for (const how of ['mouse', 'Enter', 'Space']) {
    const ctx = await browser.newContext({ viewport: { width: c.width, height: c.width < 600 ? 844 : 900 } });
    const page = await ctx.newPage();
    await page.goto(page_url);
    if (c.pre) await page.click(c.pre);
    const before = await page.evaluate(c.read);
    if (how === 'mouse') await page.click(c.sel);
    else { await page.focus(c.sel); await page.keyboard.press(how); }
    await page.waitForTimeout(50);
    const after = await page.evaluate(c.read);
    const focusVisible = how === 'mouse' ? null : await page.evaluate((s) => document.activeElement === document.querySelector(s) && getComputedStyle(document.activeElement).outlineStyle !== 'none', c.sel);
    const ok = c.expect(before, after);
    rows.push({ control: c.name, how, ok, focusVisible, before, after });
    await ctx.close();
  }
}

// Escape closes the phone menu and returns focus to the button.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(page_url);
  await page.click('[data-menu]');
  await page.keyboard.press('Escape');
  const r = await page.evaluate(() => ({ expanded: document.querySelector('[data-menu]').getAttribute('aria-expanded'), focus: document.activeElement.matches('[data-menu]') }));
  rows.push({ control: 'Menu (390)', how: 'Escape closes', ok: r.expanded === 'false' && r.focus, after: r });
  await ctx.close();
}

// Totals re-added from the figures as displayed.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(page_url);
const sums = await page.evaluate(() => {
  const num = (t) => parseFloat(t.replace(/[^\d.]/g, ''));
  const txt = (s) => document.querySelector(s).textContent.trim();
  const legs = [...document.querySelectorAll('#legs .nm')].map((e) => num(e.textContent));
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const fmt = (m) => `${Math.floor(m / 60)} h ${m % 60} min`;
  const plan = [...document.querySelectorAll('.plan__legs b')].map((b) => b.textContent.trim());
  const times = [...document.querySelectorAll('#legs tbody time')].map((t) => t.textContent);
  return [
    { what: 'Leg distances add up to the total', shown: txt('#legs tfoot [data-sum-of]'), computed: legs.reduce((a, b) => a + b, 0).toFixed(1) },
    { what: 'Out passage time, first to last mark', shown: document.querySelector('#legs tfoot th').textContent.replace(/^Total, /, ''), computed: fmt(toMin(times.at(-1)) - toMin(times[0])) },
    { what: 'Out leg in the plan card (leave to arrive)', shown: '1 h 40 min', computed: fmt(toMin(plan[1]) - toMin(plan[0])) },
    { what: 'Back leg in the plan card (leave to home)', shown: '1 h 40 min', computed: fmt(toMin(plan[3]) - toMin(plan[2])) },
    { what: 'Daylight to spare: sunset 17:56 minus home', shown: txt('.plan__head .spare').replace(/\s+/g, ' '), computed: fmt(toMin('17:56') - toMin(plan[3])) },
    { what: 'Latest to leave Cowes: sunset minus passage', shown: '16:16', computed: (() => { const m = toMin('17:56') - 100; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; })() },
    { what: 'Yearly price per month: £39 / 12', shown: '£3.25', computed: '£' + (39 / 12).toFixed(2) },
    { what: 'Yearly saving: 12 x £4.99 minus £39', shown: '£20.88', computed: '£' + (12 * 4.99 - 39).toFixed(2) },
    { what: 'Back window moved: was 13:45, now 13:20', shown: '25 minutes', computed: (toMin('13:45') - toMin('13:20')) + ' minutes' },
    { what: 'Height stations listed', shown: '14', computed: String(document.querySelectorAll('.stations li').length) },
  ];
});
await browser.close();
for (const s of sums) s.ok = s.shown.replace(/\s+/g, ' ') === s.computed;
const out = path.resolve(here, '../reports/operate.json');
fs.writeFileSync(out, JSON.stringify({ controls: rows, totals: sums }, null, 2));
for (const r of rows) console.log(`${r.ok ? 'pass' : 'FAIL'}  ${r.control.padEnd(30)} ${r.how.padEnd(14)} ${typeof r.focusVisible === 'boolean' ? 'focus ring ' + (r.focusVisible ? 'yes' : 'NO') : ''}`);
for (const s of sums) console.log(`${s.ok ? 'pass' : 'FAIL'}  ${s.what}: shown ${s.shown}, re-added ${s.computed}`);
const fails = rows.filter((r) => !r.ok).length + sums.filter((s) => !s.ok).length;
console.log(fails ? `FAIL: ${fails}` : 'PASS: every control works by mouse, Enter and Space; every total re-adds');
process.exit(fails ? 1 : 0);
