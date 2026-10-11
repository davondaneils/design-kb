#!/usr/bin/env node
// Conversion audit: advisory checks for design-conversion (SKILL.md section 1). Run after tools/lint.mjs passes.
// It does not replace the lint or a person's judgement; it catches the conversion floor items a script can see.
//
// Usage (from the design-kb repo root, after `npm ci` in tools/):
//   node skills/design-conversion/assets/conversion-audit.mjs <page.html[?state=x]> [--json out.json]
//
// Checks (fail = floor miss, warn = look at it):
//   primary-per-screen  more than one filled call to action inside one screen height, at 390 and 1440 (fail)
//   cta-label           generic labels: Get started, Learn more, Click here, Submit, Continue, Start now (warn)
//   form-label          a visible field without a programmatic label, or with a placeholder as its only label (fail)
//   autocomplete        a personal-data field (email, tel, name, address, postal code, card) without an autocomplete token (fail)
//   card-number-type    a card, CVC or postal field with type=number (fail)
//   paste-block         onpaste / oncopy handlers on fields (fail)
//   preticked           a checkbox checked by default whose label mentions a price or an add-on (fail)
//   sub-terms           a subscribe, trial or upgrade button whose section does not state a price, a cadence and how to cancel (fail)
//   pay-total           a "Pay" button without an amount in its label or a total in its form (fail)
//   rating-count        a star rating or "x.x out of 5" with no review count beside it (fail)
//   cart-shipping       add-to-cart controls on a page that never mentions shipping near them (warn)
//   urgency             urgency or scarcity phrases (only N left, hurry, ends in, last chance, N people viewing) (warn: real or fake?)
// Exit code: 1 if any check fails, else 0.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { launch, toUrl } = await import(path.join(here, '../../../tools/browser.mjs'));

const args = process.argv.slice(2);
const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--json');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
if (!target) { console.error('Usage: node skills/design-conversion/assets/conversion-audit.mjs <page.html[?state=x]> [--json out.json]'); process.exit(2); }

const CHECKS = ['primary-per-screen', 'cta-label', 'form-label', 'autocomplete', 'card-number-type', 'paste-block', 'preticked', 'sub-terms', 'pay-total', 'rating-count', 'cart-shipping', 'urgency'];
const report = { file: target, date: new Date().toISOString(), checks: Object.fromEntries(CHECKS.map((c) => [c, { fail: [], warn: [] }])) };

// Runs in the page. Returns findings as [check, level, message, selector].
function audit() {
  const out = [];
  const vis = (el) => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('[hidden],[inert],dialog:not([open])'); };
  const sel = (el) => { const p = []; let n = el; while (n && n.nodeType === 1 && p.length < 3) { let s = n.tagName.toLowerCase(); if (n.id) { p.unshift('#' + n.id); break; } if (n.classList.length) s += '.' + [...n.classList].slice(0, 2).join('.'); p.unshift(s); n = n.parentElement; } return p.join(' > '); };
  const txt = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const rgb = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bgOf = (el) => { let n = el.parentElement; while (n) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c.a > 0.5) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const H = innerHeight;

  // primary-per-screen: filled, opaque controls that stand off their backdrop by 2:1 or more.
  const modal = [...document.querySelectorAll('dialog[open]')].find((d) => d.matches(':modal'));
  const ctas = [...document.querySelectorAll('a, button, [role=button], input[type=submit]')].filter(vis).filter((el) => !modal || modal.contains(el)).filter((el) => {
    const c = rgb(getComputedStyle(el).backgroundColor); if (!c || c.a < 0.9) return false;
    const r = el.getBoundingClientRect(); if (r.width < 96 || r.height < 36) return false;
    return ratio(c, bgOf(el)) >= 2;
  });
  const bySlice = {};
  for (const el of ctas) { const top = el.getBoundingClientRect().top + scrollY; const k = Math.floor(top / H); (bySlice[k] ||= []).push(el); }
  for (const [k, list] of Object.entries(bySlice)) if (list.length > 1) out.push(['primary-per-screen', 'fail', `${list.length} filled calls to action in screen ${+k + 1} (${list.map((e) => '"' + txt(e).slice(0, 24) + '"').join(', ')})`, sel(list[1])]);

  // cta-label
  for (const el of document.querySelectorAll('a.btn, button, [role=button], a[class*=cta]')) {
    if (!vis(el)) continue;
    if (/^(get started|learn more|click here|submit|continue|start now|read more)$/i.test(txt(el))) out.push(['cta-label', 'warn', `generic label "${txt(el)}": name the next step`, sel(el)]);
  }

  // Fields
  const fields = [...document.querySelectorAll('input, select, textarea')].filter((f) => !['hidden', 'submit', 'button', 'reset', 'image'].includes(f.type) && vis(f));
  const choice = (f) => f.type === 'checkbox' || f.type === 'radio';
  for (const f of fields) {
    const named = (f.labels && f.labels.length) || f.getAttribute('aria-labelledby') || f.getAttribute('aria-label') || f.closest('label');
    if (!named) out.push(['form-label', 'fail', f.placeholder ? `placeholder "${f.placeholder}" is the only label` : 'field has no label', sel(f)]);
    const key = [f.name, f.id, f.type, f.getAttribute('inputmode'), f.placeholder, f.labels && f.labels[0] ? txt(f.labels[0]) : ''].join(' ').toLowerCase();
    const personal = /email|e-mail|\btel\b|phone|full name|\bname\b|address|street|postal|zip|city|card|cc-|expir|cvc|cvv|security code/.test(key) && !/search|coupon|code\b(?!.*security)/.test(key.replace('security code', ''));
    const ac = (f.getAttribute('autocomplete') || '').trim();
    if (personal && !choice(f) && (!ac || ac === 'off' || ac === 'on')) out.push(['autocomplete', 'fail', `personal field "${(f.labels && f.labels[0] && txt(f.labels[0])) || f.name || f.id || f.placeholder}" has no autocomplete token (WCAG 1.3.5)`, sel(f)]);
    if (f.type === 'number' && /card|cc-|cvc|cvv|postal|zip/.test(key)) out.push(['card-number-type', 'fail', 'card, CVC or postal field uses type=number; use type=text with inputmode=numeric', sel(f)]);
    if (f.hasAttribute('onpaste') || f.hasAttribute('oncopy')) out.push(['paste-block', 'fail', 'paste or copy handler on a field (WCAG 3.3.8)', sel(f)]);
    if (f.type === 'checkbox' && f.defaultChecked) {
      const l = f.labels && f.labels[0] ? txt(f.labels[0]) : '';
      if (/\$|£|€|add|protect|insurance|gift wrap|upgrade|donat/i.test(l) && !/same as/i.test(l)) out.push(['preticked', 'fail', `checkbox "${l.slice(0, 40)}" is checked by default`, sel(f)]);
    }
  }

  // sub-terms: committing subscribe, trial or upgrade buttons (in-page anchors that only scroll are exempt).
  for (const el of document.querySelectorAll('a, button')) {
    if (!vis(el)) continue;
    const t = txt(el); if (!/subscri|free trial|start (a |my |your )?trial|upgrade to|start a plan/i.test(t)) continue;
    const href = el.getAttribute('href'); if (href && href.startsWith('#') && href.length > 1) continue;
    if (el.closest('nav, header, footer')) continue;
    if (el.tagName === 'A' && !/btn|button|cta/i.test(el.className) && el.getAttribute('role') !== 'button') continue; // plain text links are navigation
    const scope = el.closest('dialog, form, section, article, aside') || el.parentElement;
    const s = txt(scope);
    const miss = [];
    if (!/[$£€]\s?\d/.test(s)) miss.push('price');
    if (!/every|per (month|week|year)|a month|a week|a year|monthly|weekly|yearly|annually|\/\s?mo/i.test(s)) miss.push('cadence');
    if (!/cancel/i.test(s)) miss.push('how to cancel');
    if (miss.length) out.push(['sub-terms', 'fail', `"${t.slice(0, 32)}" without ${miss.join(', ')} in its section`, sel(el)]);
  }

  // pay-total
  for (const el of document.querySelectorAll('button, input[type=submit]')) {
    if (!vis(el)) continue;
    const t = txt(el) || el.value || ''; if (!/^pay\b/i.test(t)) continue;
    const form = el.closest('form, dialog') || el.parentElement;
    if (!/[$£€]\s?\d/.test(t) && !/total/i.test(txt(form))) out.push(['pay-total', 'fail', `"${t}" with no amount in the label and no total in its form`, sel(el)]);
  }

  // rating-count
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const n = walker.currentNode; const el = n.parentElement; if (!el || !vis(el)) continue;
    if (!/★|\b[1-5](\.\d)?\s*(out of 5|stars?)\b/i.test(n.textContent)) continue;
    let box = el; for (let i = 0; i < 3 && box.parentElement; i++) box = box.parentElement;
    if (seen.has(box)) continue; seen.add(box);
    if (!/\d[\d,]*\s+(\w+\s+){0,2}(reviews?|ratings?)/i.test(txt(box))) out.push(['rating-count', 'fail', 'rating without a review count beside it', sel(el)]);
  }

  // cart-shipping
  const adds = [...document.querySelectorAll('button, a')].filter((b) => vis(b) && /add to (cart|bag|basket)/i.test(txt(b)));
  if (adds.length) {
    const near = adds.some((b) => [b.closest('li, article'), b.closest('section'), b.parentElement].some((c) => c && /shipping|delivery/i.test(txt(c))));
    if (!near) out.push(['cart-shipping', 'warn', `${adds.length} add-to-cart controls with no shipping cost or threshold near them (Baymard: 64% look for it on the product)`, sel(adds[0])]);
  }

  // urgency
  const body = txt(document.body);
  const re = /(only \d+ left|hurry|ends in \d|offer ends|limited time|act now|last chance|selling fast|\d+ (people|others) (are )?(viewing|looking|bought))/gi;
  for (const m of body.matchAll(re)) out.push(['urgency', 'warn', `urgency phrase "${m[0]}": keep only if true and live`, 'body']);
  return out;
}

const browser = await launch();
try {
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const found = await page.evaluate(audit);
    for (const [check, level, message, s] of found) {
      const list = report.checks[check][level];
      if (!list.some((x) => x.message === message && x.sel === s)) list.push({ message, sel: s, width });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

let fails = 0;
for (const c of CHECKS) {
  const { fail, warn } = report.checks[c];
  fails += fail.length;
  console.log(`  ${fail.length ? 'FAIL' : 'pass'}  ${c}${warn.length ? `  (${warn.length} warn)` : ''}`);
  for (const f of fail) console.log(`        x ${f.message} @${f.width}  [${f.sel}]`);
  for (const w of warn.slice(0, 4)) console.log(`        ! ${w.message} @${w.width}  [${w.sel}]`);
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2));
console.log(fails ? `\n${fails} conversion fail(s)` : '\nconversion audit: no fails');
process.exit(fails ? 1 : 0);
