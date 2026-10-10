#!/usr/bin/env node
// Claims inventory for design-copy (references/06-copy-in-context.md, "Every number is a claim").
// Lists every visible sentence on a page that carries a checkable claim (a number, percent, price, date,
// weekday, duration or comparison) so a reviewer can tick each one against the data it summarises.
// It also flags three mechanical errors on its own:
//   WEEKDAY  a "Wed, Oct 7" style date whose weekday is wrong for --year
//   RELATIVE a relative day word ("this Friday", "tomorrow") in money, shipping or deadline copy (schedules such as
//            "every Tuesday" pass; low-stakes recency such as "roasted Tuesday" passes unless the sentence names money or shipping)
//   CLOCK    a 24-hour time ("14:05") when the page also uses am/pm, or vice versa (one clock per page)
// Two warnings (judged; added after the round 3 critic, kb/reviews/round3-critic.md, gate item 16):
//   PROMISE  one promise said with different values or units: shipping time ("48 h", "shipped in 48 hours", "ship
//            the next day", "roasted Tue, Oct 13, ships by Thu, Oct 15"), tasting or checking counts ("tasted twice"
//            against "Two of us taste"), trial, refund and reply windows, free-shipping thresholds. Each promise
//            gets one wording and one number (FOUNDATIONS Content mechanics, Truth)
//   PERIOD   more than one comparison basis on one page ("Compared to: previous 12 weeks" on the control, "vs last
//            week" on every KPI): name the basis beside each delta and make the control drive them
// Reads static HTML (scripts, styles and SVG removed; aria-label, alt and placeholder text included).
// Strings built by JavaScript at runtime are not seen unless you pass --render (Chromium via tools/browser.mjs reads
// the rendered text, so ?state= URLs work too).
//
// Usage: node skills/design-copy/assets/claims_inventory.mjs page.html[?state=x] [--year 2026] [--render] [--strict]
// Exit code: 0 when nothing is flagged, 1 when a WEEKDAY, RELATIVE or CLOCK flag fires (or, with --strict, a PROMISE
// or PERIOD warning), 2 on usage error.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--year');
const yi = args.indexOf('--year');
const year = yi >= 0 ? Number(args[yi + 1]) : new Date().getFullYear();
const render = args.includes('--render');
const strict = args.includes('--strict');
const filePath = file ? file.split('?')[0] : '';
if (!file || !fs.existsSync(filePath)) { console.error('Usage: node claims_inventory.mjs page.html[?state=x] [--year 2026] [--render] [--strict]'); process.exit(2); }

const decode = (s) => s.replace(/&nbsp;|&#8239;|&thinsp;| | | /g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·')
  .replace(/&amp;/g, '&').replace(/&times;|&#215;/g, '×').replace(/&[a-z]+;|&#\d+;/g, ' ');
let blocks;
if (render) {
  // Rendered text: one block per line of innerText, plus aria-label, alt and placeholder values.
  const here = path.dirname(fileURLToPath(import.meta.url));
  const { launch, toUrl } = await import(pathToFileURL(path.resolve(here, '../../../tools/browser.mjs')).href);
  const browser = await launch();
  try {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
    await page.goto(toUrl(file), { waitUntil: 'load' });
    await page.waitForTimeout(300);
    blocks = await page.evaluate(() => document.body.innerText.split(/\n+/)
      .concat([...document.querySelectorAll('[aria-label], [alt], [placeholder]')].map((e) => e.getAttribute('aria-label') || e.getAttribute('alt') || e.getAttribute('placeholder'))));
  } finally { await browser.close(); }
  blocks = blocks.map((b) => decode(b || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
} else {
  let html = fs.readFileSync(filePath, 'utf8');
  const attrs = [...html.matchAll(/\s(?:aria-label|alt|placeholder)="([^"]+)"/g)].map((m) => m[1]);
  html = html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
  blocks = html.split(/<\/(?:p|li|h[1-6]|td|th|dt|dd|caption|figcaption|button|a|label|strong|span|div)>/i)
    .map((b) => decode(b.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()).filter(Boolean)
    .concat(attrs.map(decode));
}

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Sept: 8, Oct: 9, Nov: 10, Dec: 11 };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const claim = /\d|%|\$|×|\b(?:Mon|Tues?|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b|\btomorrow\b|\btoday\b|\byesterday\b|\b(?:under|over|faster|cheaper|more|less|fewer|up|down)\b/i;
const stakes = /\$|ship|deliver|arriv|order|pay|charge|renew|cancel|deadline|due|expire|refund/i;
// A bare or this/next weekday is relative; "every Tuesday" and "Tuesdays" are schedules and pass.
const relative = /(?<!every\s)\b(?:this\s|next\s|last\s)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b(?!s)|\btomorrow\b|\byesterday\b/i;

const seen = new Set();
const flags = [];
const rows = [];
let has24 = false, has12 = false;
for (const b of blocks) {
  if (seen.has(b) || !claim.test(b)) continue;
  seen.add(b);
  rows.push(b);
  for (const m of b.matchAll(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+([A-Z][a-z]{2,3})\s+(\d{1,2})\b/g)) {
    const mo = MONTHS[m[2]];
    if (mo === undefined) continue;
    const real = DAYS[new Date(Date.UTC(year, mo, Number(m[3]))).getUTCDay()];
    if (real !== m[1]) flags.push(`WEEKDAY  "${m[0]}" is a ${real} in ${year}: ${b}`);
  }
  const unscheduled = b.replace(/\bevery\s+\w+day(?:s)?(?:(?:,\s*|\s+and\s+|\s+or\s+)\w+day(?:s)?)*/gi, ' ');
  if (relative.test(unscheduled) && stakes.test(b)) flags.push(`RELATIVE "${unscheduled.match(relative)[0].trim()}" in stakes copy, use an absolute date: ${b}`);
  if (/\b(?:1[3-9]|2[0-3]):[0-5]\d\b/.test(b)) has24 = true;
  if (/\b\d{1,2}(?::\d\d)?\s?(?:am|pm)\b/i.test(b)) has12 = true;
}
if (has24 && has12) flags.push('CLOCK    the page mixes 24-hour and am/pm times; pick one clock');

// ---- PROMISE: one promise, one value ----
const WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, fourteen: 14, thirty: 30 };
const num = (w) => (/^\d/.test(w) ? parseFloat(w) : WORDS[w.toLowerCase()]);
const NUMW = '(\\d+(?:\\.\\d+)?|a|an|one|two|three|four|five|six|seven|eight|nine|ten|twelve|fourteen|thirty)';
const timeOf = (c) => {
  const out = [];
  for (const m of c.matchAll(new RegExp('\\b' + NUMW + '[\\s-]*(?:h|hrs?|hours?)\\b', 'gi'))) out.push(num(m[1]) + ' h');
  for (const m of c.matchAll(new RegExp('\\b' + NUMW + '[\\s-]*(business |working )?days?\\b', 'gi'))) out.push(num(m[1]) * 24 + ' h' + (m[2] ? ' (business)' : ''));
  for (const m of c.matchAll(new RegExp('\\b' + NUMW + '[\\s-]*weeks?\\b', 'gi'))) out.push(num(m[1]) * 168 + ' h');
  for (const m of c.matchAll(new RegExp('\\b' + NUMW + '[\\s-]*months?\\b', 'gi'))) out.push(num(m[1]) * 720 + ' h');
  if (/\bnext[\s-]day\b|\bovernight\b|\bwithin a day\b|\bthe day after\b/i.test(c)) out.push('24 h');
  if (/\bsame[\s-]day\b/i.test(c)) out.push('0 h (same day)');
  return out;
};
const countOf = (c) => {
  const out = [];
  if (/\btwice\b/i.test(c)) out.push('2 times');
  if (/\bonce\b/i.test(c)) out.push('1 time');
  for (const m of c.matchAll(new RegExp('\\b' + NUMW + '\\s+times\\b', 'gi'))) out.push(num(m[1]) + ' times');
  for (const m of c.matchAll(new RegExp('\\b' + NUMW + '\\s+(?:of us|people|tasters|roasters|cuppers|reviewers)\\b', 'gi'))) out.push(num(m[1]) + ' people');
  return out;
};
const moneyOf = (c) => [...c.matchAll(/\$\s?(\d[\d,]*(?:\.\d+)?)/g)].map((m) => '$' + m[1]);
const TOPICS = [
  { name: 'shipping time', key: /\b(?:ship(?:s|ped|ping)?|dispatch(?:ed|es)?|leaves?|deliver(?:s|ed|y)?|arriv(?:es|e|al))\b/i, qty: timeOf },
  { name: 'tasting or checking count', key: /\b(?:tast(?:e|es|ed|ing)|cupp?(?:ed|ing)|check(?:s|ed)?|inspect(?:s|ed)?)\b/i, qty: countOf },
  { name: 'trial length', key: /\btrial\b|\bfree for\b/i, qty: timeOf },
  { name: 'refund or guarantee window', key: /refund|money[\s-]back|guarantee|\breturns?\b/i, qty: timeOf },
  { name: 'reply time', key: /\b(?:reply|replies|respond|responds|response)\b/i, qty: timeOf },
  { name: 'free-shipping threshold', key: /free (?:shipping |delivery )?(?:over|on orders over|above|from)/i, qty: moneyOf },
];
const DATE = /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+([A-Z][a-z]{2,3})\s+(\d{1,2})\b/g;
const promises = {};
const note = (topic, value, text) => { ((promises[topic] ||= {})[value] ||= new Set()).add(text.slice(0, 90)); };
const seenP = new Set();
for (let i = 0; i < blocks.length; i++) {
  let b = blocks[i];
  // A label and its value in separate elements ("Roast to ship" then "48 h"): read them together.
  if (b.split(' ').length <= 4 && blocks[i + 1] && /^[\d$]/.test(blocks[i + 1]) && blocks[i + 1].split(' ').length <= 3) b = b + ' ' + blocks[i + 1];
  if (seenP.has(b)) continue;
  seenP.add(b);
  // Two dates around a shipping verb: the interval is the promise ("roasted Tue, Oct 13, ships by Thu, Oct 15").
  const dates = [...b.matchAll(DATE)];
  let rest = b;
  if (dates.length >= 2 && TOPICS[0].key.test(b.slice(dates[0].index, dates[dates.length - 1].index))) {
    const d = (m) => Date.UTC(year, MONTHS[m[2]], Number(m[3]));
    const days = Math.round((d(dates[dates.length - 1]) - d(dates[0])) / 864e5);
    if (days > 0 && days < 60) note('shipping time', days * 24 + ' h', b);
    rest = b.replace(DATE, ' ');
  }
  // Clauses: split on commas, semicolons and "and", so "roast on Tuesdays and Fridays and ship the next day" keeps
  // "ship the next day" apart from the roast days.
  for (const c of rest.split(/[,;:.](?!\d)|\s+and\s+|\s+but\s+|\s+then\s+/i)) {
    for (const t of TOPICS) {
      if (!t.key.test(c)) continue;
      for (const v of t.qty(c)) note(t.name, v, b);
    }
  }
}
const warns = [];
for (const [topic, vals] of Object.entries(promises)) {
  const keys = Object.keys(vals);
  if (keys.length < 2) continue;
  warns.push(`PROMISE  ${topic} has ${keys.length} different values: ` + keys.map((k) => `${k} in "${[...vals[k]][0]}"`).join('; ') + '. One promise, one wording, one number.');
}

// ---- PERIOD: one comparison basis per page ----
const joined = blocks.join(' ');
const bases = new Map();
for (const m of joined.matchAll(/\b(?:vs\.?|versus|compared (?:to|with)|against|than|from|over)\s*:?\s*(?:vs\.?\s*)?(?:the\s+)?(last|previous|prev\.?|prior|same)\s+(?:(\d+)\s+)?(day|week|month|quarter|year|period)s?\b/gi)) {
  const unit = m[3].toLowerCase();
  const count = Number(m[2] || 1);
  const key = m[1].toLowerCase() === 'same' ? `same ${unit}` : `${count} ${unit}${count > 1 ? 's' : ''}`;
  if (!bases.has(key)) bases.set(key, m[0]);
}
if (bases.size > 1) warns.push(`PERIOD   ${bases.size} comparison bases on one page: ${[...bases.values()].map((v) => '"' + v + '"').join(', ')}. Name the basis beside every delta, and make the comparison control drive all of them.`);

console.log(`Claims inventory: ${file} (${rows.length} strings to check against the data)\n`);
rows.forEach((r, i) => console.log(String(i + 1).padStart(3) + '  ' + r));
console.log('');
if (warns.length) { warns.forEach((w) => console.log(w)); console.log(''); }
if (flags.length) { flags.forEach((f) => console.log(f)); process.exit(1); }
if (strict && warns.length) process.exit(1);
console.log(`No mechanical flags${warns.length ? ` (${warns.length} judged warning${warns.length > 1 ? 's' : ''} above: fix each or name it in the hand-over)` : ''}. Now tick every line above against its source: chart data, price list, policy, log.`);
