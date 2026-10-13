#!/usr/bin/env node
// Claims inventory for design-copy (references/06-copy-in-context.md, "Every number is a claim").
// Lists every visible sentence on a page that carries a checkable claim (a number, percent, price, date,
// weekday, duration or comparison) so a reviewer can tick each one against the data it summarises.
// It also flags three mechanical errors on its own:
//   WEEKDAY  a date with a weekday whose weekday is wrong: "Wed, Oct 7", "Friday, January 15, 2027" (US order) and
//            "Fri 15 January 2027", "Sat 17 April" (en-GB order) are all read. A year written in the date wins over
//            --year ("Fri, Jan 15, 2027" on a page checked with --year 2026 is a Friday, not a flag); a weekday-and-day
//            range borrows the month and year of its partner ("Sat 17 & Sun 18 April 2027"). A date with no year uses
//            --year; when its weekday fits a year the page writes elsewhere, the flag says so (pass that --year)
//   LOCALE   a date in the other locale's order for the page's <html lang> (FOUNDATIONS Content mechanics, Locale):
//            month-first ("Jan 15", "Fri, 15 Jan") or an ordinal ("15th") on an en-GB page, day-first ("15 January")
//            on an en-US page. No lang, or plain "en", reads as en-US. --lang en-GB overrides the attribute
//   RELATIVE a relative day word ("this Friday", "tomorrow") in money, shipping or deadline copy (schedules such as
//            "every Tuesday" pass; low-stakes recency such as "roasted Tuesday" passes unless the sentence names money or shipping)
//   CLOCK    a 24-hour time ("14:05") when the page also uses am/pm, or vice versa (one clock per page)
// A third warning, STYLE (judged): a date or time written in another locale's style: "10 am" or "Fri, 15 January" on
// en-GB (GOV.UK writes "10am", "5:30pm" and "by 11:59pm on Tuesday 14 June"), "10am" or "14:05" on en-US (house
// style "10 am", "2:05 pm"). Intl.DateTimeFormat('en-GB') prints "Fri, 15 January 2027" with a comma: drop it.
// Two warnings (judged; added after the round 3 critic, kb/reviews/round3-critic.md, gate item 16):
//   PROMISE  one promise said with different values or units: shipping time ("48 h", "shipped in 48 hours", "ship
//            the next day", "roasted Tue, Oct 13, ships by Thu, Oct 15"), tasting or checking counts ("tasted twice"
//            against "Two of us taste"), trial, refund and reply windows, free-shipping thresholds, and subscription
//            rights said as a verb list ("Skip, swap or cancel" against "Skip, pause or cancel"). Each promise
//            gets one wording and one number (FOUNDATIONS Content mechanics, Truth)
//   ZONE     a page that shows times in two or more zones or places has a time with neither ("lands 6:48 pm" beside
//            "8:52 am ET"); run with --render at 390 too, since reflow can cut the place column
//   PERIOD   more than one comparison basis on one page ("Compared to: previous 12 weeks" on the control, "vs last
//            week" on every KPI): name the basis beside each delta and make the control drive them
// Reads static HTML (scripts, styles and SVG removed; aria-label, alt and placeholder text included).
// Strings built by JavaScript at runtime are not seen unless you pass --render (Chromium via tools/browser.mjs reads
// the rendered text, so ?state= URLs work too).
//
// Usage: node skills/design-copy/assets/claims_inventory.mjs page.html[?state=x] [--year 2026] [--lang en-GB] [--render] [--strict]
//        node skills/design-copy/assets/claims_inventory.mjs --self-test   (runs the date parser's test cases)
// Exit code: 0 when nothing is flagged, 1 when a WEEKDAY, LOCALE, RELATIVE or CLOCK flag fires (or, with --strict, a PROMISE
// or PERIOD warning), 2 on usage error.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--year' && args[i - 1] !== '--lang');
const li = args.indexOf('--lang');
let lang = li >= 0 ? args[li + 1] : null;
const yi = args.indexOf('--year');
const year = yi >= 0 ? Number(args[yi + 1]) : new Date().getFullYear();
const render = args.includes('--render');
const strict = args.includes('--strict');
const filePath = file ? file.split('?')[0] : '';
if (args.includes('--self-test')) selfTest();
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
    if (!lang) lang = await page.evaluate(() => document.documentElement.lang);
    blocks = await page.evaluate(() => document.body.innerText.split(/\n+/)
      .concat([...document.querySelectorAll('[aria-label], [alt], [placeholder]')].map((e) => e.getAttribute('aria-label') || e.getAttribute('alt') || e.getAttribute('placeholder'))));
  } finally { await browser.close(); }
  blocks = blocks.map((b) => decode(b || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
} else {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!lang) lang = (html.match(/<html[^>]*\slang="([^"]+)"/i) || [])[1];
  const attrs = [...html.matchAll(/\s(?:aria-label|alt|placeholder)="([^"]+)"/g)].map((m) => m[1]);
  html = html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
  blocks = html.split(/<\/(?:p|li|h[1-6]|td|th|dt|dd|caption|figcaption|button|a|label|strong|span|div)>/i)
    .map((b) => decode(b.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()).filter(Boolean)
    .concat(attrs.map(decode));
}

// Day-first English locales; en-US (or no lang, or plain "en") is month-first. Clock style is checked for en-GB and en-US.
const us = !lang || /^en(?:-US)?$/i.test(lang);
const ukClock = /^en-GB/i.test(lang || '');
const gb = /^en-(?:GB|IE|AU|NZ|IN|ZA)\b/i.test(lang || '');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const claim = /\d|%|\$|×|\b(?:Mon|Tues?|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b|\btomorrow\b|\btoday\b|\byesterday\b|\b(?:under|over|faster|cheaper|more|less|fewer|up|down)\b/i;
const stakes = /\$|ship|deliver|arriv|order|pay|charge|renew|cancel|deadline|due|expire|refund/i;
// A bare or this/next weekday is relative; "every Tuesday" and "Tuesdays" are schedules and pass.
const relative = /(?<!every\s)\b(?:this\s|next\s|last\s)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b(?!s)|\btomorrow\b|\byesterday\b/i;

// Years the page writes in its dates: a weekday that is wrong for --year but right for one of them gets a hint.
const pageYears = [...new Set(blocks.flatMap((b) => parseDates(b, year).filter((d) => d.yearWritten).map((d) => d.y)))];
const seen = new Set();
const flags = [];
const rows = [];
let has24 = false, has12 = false;
const clockStyle = new Set();
for (const b of blocks) {
  if (seen.has(b) || !claim.test(b)) continue;
  seen.add(b);
  rows.push(b);
  for (const d of parseDates(b, year)) {
    if (d.wd !== undefined && d.wd !== d.real) {
      const fits = d.yearWritten ? [] : pageYears.filter((y) => y !== d.y && new Date(Date.UTC(y, d.mo, d.d)).getUTCDay() === d.wd);
      flags.push(`WEEKDAY  "${d.text}" is a ${DAYS[d.real]} in ${d.y}${fits.length ? ` (right in ${fits[0]}, which the page writes: if that is the year, run with --year ${fits[0]})` : ''}: ${b}`);
    }
    const wd = d.wd !== undefined ? DAYS[d.real] : '';
    if (ukClock && d.order === 'gb' && d.wd !== undefined && /^[A-Za-z]+,/.test(d.text)) clockStyle.add(`"${d.text}" (en-GB: no comma after the weekday, "Tuesday 14 June"; GOV.UK)`);
    if (gb && d.order === 'us') flags.push(`LOCALE   "${d.text}" is month-first; with lang="${lang}" write "${wd ? wd + ' ' : ''}${d.d} ${MONTH_NAMES[d.mo]}${d.yearWritten ? ' ' + d.y : ''}": ${b}`);
    if (us && d.order === 'gb') flags.push(`LOCALE   "${d.text}" is day-first; with lang="${lang || 'en-US'}" write "${wd ? wd + ', ' : ''}${MONTH_NAMES[d.mo].slice(0, 3)} ${d.d}${d.yearWritten ? ', ' + d.y : ''}", or set lang="en-GB" if the audience is British: ${b}`);
  }
  if (gb) for (const m of b.matchAll(/\b\d{1,2}(?:st|nd|rd|th)\s+(?:of\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/g)) flags.push(`LOCALE   "${m[0]}" uses an ordinal; en-GB dates take none (GOV.UK, "17 April"): ${b}`);
  if (ukClock && /\b\d{1,2}(?::\d\d)?\s(?:am|pm)\b/i.test(b)) clockStyle.add(`"${b.match(/\b\d{1,2}(?::\d\d)?\s(?:am|pm)\b/i)[0]}" (en-GB writes "10am", "5:30pm", no space; GOV.UK)`);
  if (us && /\b\d{1,2}(?::\d\d)?(?:am|pm)\b/i.test(b)) clockStyle.add(`"${b.match(/\b\d{1,2}(?::\d\d)?(?:am|pm)\b/i)[0]}" (en-US house style is "10 am", "2:05 pm"; Mailchimp)`);
  if (us && /\b(?:1[3-9]|2[0-3]):[0-5]\d\b/.test(b)) clockStyle.add(`"${b.match(/\b(?:1[3-9]|2[0-3]):[0-5]\d\b/)[0]}" (en-US uses the 12-hour clock; Polaris)`);
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
const RIGHT_VERB = /\b(?:skip|swap|pause|cancel|resume|change|edit|delay|move|return|exchange)\b/gi;
const RV = '(?:skip|swap|pause|cancel|resume|change|edit|delay|move|return|exchange)';
const RIGHTS = new RegExp('\\b' + RV + '(?:(?:\\s*,\\s*|\\s+)(?:(?:or|and)\\s+)?' + RV + ')+\\b', 'gi');
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
  const dates = parseDates(b, year).filter((d) => d.wd !== undefined);
  let rest = b;
  if (dates.length >= 2 && TOPICS[0].key.test(b.slice(dates[0].index, dates[dates.length - 1].index))) {
    const at = (d) => Date.UTC(d.y, d.mo, d.d);
    const days = Math.round((at(dates[dates.length - 1]) - at(dates[0])) / 864e5);
    if (days > 0 && days < 60) note('shipping time', days * 24 + ' h', b);
    for (const d of [...dates].reverse()) rest = rest.slice(0, d.index) + ' ' + rest.slice(d.index + d.text.length);
  }
  // Account rights said as a verb list ("Skip, swap or cancel online" against "Skip, pause or cancel online"): the
  // set of verbs is the promise, so two lists with different verbs are two promises (round 4.1 critic, coffee item 16).
  // Read before the comma split below, which would cut the list apart.
  for (const m of b.matchAll(RIGHTS)) note('subscription rights', [...new Set(m[0].toLowerCase().match(RIGHT_VERB))].sort().join(', '), b);
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
if (clockStyle.size) warns.push(`STYLE    dates or times written in another locale's style for ${lang || 'en-US'}: ${[...clockStyle].slice(0, 4).join('; ')}. FOUNDATIONS Content mechanics, Locale.`);
for (const [topic, vals] of Object.entries(promises)) {
  const keys = Object.keys(vals);
  if (keys.length < 2) continue;
  warns.push(`PROMISE  ${topic} has ${keys.length} different values: ` + keys.map((k) => `${k} in "${[...vals[k]][0]}"`).join('; ') + '. One promise, one wording, one number.');
}

// ---- ZONE: on a page with times in more than one zone, every time names its zone or place ----
// The benchmark hero card printed "lands 6:48 pm" beside "Rates locked 8:52 am ET" once its place column was cut at 390
// (kb/reviews/benchmark-round1-landing.md, gate 16). A time followed by a zone, "local", or "in <Place>" counts as labelled.
const TIME = /\b\d{1,2}(?::\d\d)?\s?(?:am|pm)\b|\b(?:[01]?\d|2[0-3]):[0-5]\d\b/gi;
const ZONE = /^\s*(?:\(?\b(?:[ECMP][SD]?T|UTC|GMT|BST|CES?T|IST|BRT|AES?T|JST|SGT|HKT|[A-Z]{2,4}[SD]?T)\b|(?:,?\s*)?(?:local|your time|their time|in\s+[A-Z][a-z]+|[A-Z][a-z]+ time))/;
const zones = new Set(); const bare = [];
for (const b of blocks) {
  for (const m of b.matchAll(TIME)) {
    const after = b.slice(m.index + m[0].length, m.index + m[0].length + 24);
    const z = after.match(ZONE);
    if (z) zones.add(z[0].trim().replace(/^\(|,\s*/g, '').split(/\s+/)[0].toLowerCase() === 'in' ? 'place' : z[0].trim().replace(/^\(|,\s*/g, ''));
    else bare.push(`"${m[0]}" in "${b.slice(0, 60)}"`);
  }
}
if (zones.size > 1 && bare.length) warns.push(`ZONE     ${zones.size} zones or places on the page (${[...zones].slice(0, 4).join(', ')}) but ${bare.length} time${bare.length > 1 ? 's' : ''} with none: ${[...new Set(bare)].slice(0, 4).join('; ')}. Label every time with its zone or place, and check each reflowed width with --render (FOUNDATIONS Content mechanics).`);

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

// ---- Dates: US order ("Fri, Jan 15, 2027", "Friday, January 15") and en-GB order ("Fri 15 January 2027", "Sat 17 Apr") ----
function parseDates(text, fallbackYear) {
  const WD = '(Mon(?:day)?|Tue(?:s|sday)?|Wed(?:nesday)?|Thu(?:r|rs|rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)';
  const MO = '(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
  const ORD = '(?:st|nd|rd|th)?';
  const out = [];
  const taken = [];
  const free = (i, len) => !taken.some(([a, b]) => i < b && i + len > a);
  const push = (index, str, o) => {
    if (!free(index, str.length)) return;
    taken.push([index, index + str.length]);
    const mo = monthIndex(o.mo);
    const y = o.year ? Number(o.year) : fallbackYear;
    const d = Number(o.day);
    if (mo === undefined || d < 1 || d > 31) return;
    out.push({ index, text: str.trim(), wd: o.wd ? dayIndex(o.wd) : undefined, mo, d, y, yearWritten: !!o.year, order: o.order, real: new Date(Date.UTC(y, mo, d)).getUTCDay() });
  };
  // A weekday-and-day range borrows its partner's month and year: "Sat 17 & Sun 18 April 2027", "Sat 17 to Sun 18 April".
  const range = new RegExp(`\\b${WD}\\s+(\\d{1,2})${ORD}\\s*(?:&|and|to|-|–|/)\\s*${WD}\\s+(\\d{1,2})${ORD}\\s+${MO}\\b\\.?(?:,?\\s+(\\d{4})\\b)?`, 'dg');
  for (const m of text.matchAll(range)) {
    const end = m.index + m[0].length, second = m.indices[3][0];
    if (!free(m.index, m[0].length)) continue;
    const o = { mo: m[5], year: m[6], order: 'gb' };
    push(m.index, text.slice(m.index, m.indices[2][1]), { ...o, wd: m[1], day: m[2] });
    push(second, text.slice(second, end), { ...o, wd: m[3], day: m[4] });
  }
  // US: weekday, month day[, year]
  for (const m of text.matchAll(new RegExp(`\\b${WD},?\\s+${MO}\\.?\\s+(\\d{1,2})${ORD}\\b(?:,?\\s+(\\d{4})\\b)?`, 'g'))) push(m.index, m[0], { wd: m[1], mo: m[2], day: m[3], year: m[4], order: 'us' });
  // en-GB: weekday[,] day month[ year]  (a comma after the weekday is still day-first)
  for (const m of text.matchAll(new RegExp(`\\b${WD},?\\s+(\\d{1,2})${ORD}\\s+(?:of\\s+)?${MO}\\b\\.?(?:,?\\s+(\\d{4})\\b)?`, 'g'))) push(m.index, m[0], { wd: m[1], day: m[2], mo: m[3], year: m[4], order: 'gb' });
  // No weekday: "January 15, 2027", "Jan 15" (US) and "15 January 2027", "15 Jan" (en-GB). Checked for order only.
  for (const m of text.matchAll(new RegExp(`\\b${MO}\\.?\\s+(\\d{1,2})${ORD}\\b(?!\\s*(?:%|:|\\d))(?:,?\\s+(\\d{4})\\b)?`, 'g'))) push(m.index, m[0], { mo: m[1], day: m[2], year: m[3], order: 'us' });
  for (const m of text.matchAll(new RegExp(`\\b(\\d{1,2})${ORD}\\s+${MO}\\b\\.?(?:,?\\s+(\\d{4})\\b)?`, 'g'))) push(m.index, m[0], { day: m[1], mo: m[2], year: m[3], order: 'gb' });
  return out.sort((a, b) => a.index - b.index);
}
function monthIndex(name) { return ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(String(name).slice(0, 3).toLowerCase()) === -1 ? undefined : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(String(name).slice(0, 3).toLowerCase()); }
function dayIndex(name) { return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(String(name).slice(0, 3).toLowerCase()); }

function selfTest() {
  // [text, fallback year, expected list of {d, mo, y, order, ok}] where ok = weekday matches the date.
  const cases = [
    ['Due Fri, Jan 15, 2027', 2026, [{ d: 15, mo: 0, y: 2027, order: 'us', ok: true }]], // the held-out false positive
    ['Due Fri, Jan 15', 2027, [{ d: 15, mo: 0, y: 2027, order: 'us', ok: true }]],
    ['Due Fri, Jan 15', 2026, [{ d: 15, mo: 0, y: 2026, order: 'us', ok: false }]], // no year written: --year applies
    ['Friday, January 15, 2027', 2026, [{ d: 15, mo: 0, y: 2027, order: 'us', ok: true }]],
    ['Tue, Oct 13', 2026, [{ d: 13, mo: 9, y: 2026, order: 'us', ok: true }]],
    ['Fri 15 January 2027', 2026, [{ d: 15, mo: 0, y: 2027, order: 'gb', ok: true }]],
    ['Fri 15 Jan', 2027, [{ d: 15, mo: 0, y: 2027, order: 'gb', ok: true }]],
    ['Saturday 17 April', 2027, [{ d: 17, mo: 3, y: 2027, order: 'gb', ok: true }]],
    ['Sun 18 April 2027', 2026, [{ d: 18, mo: 3, y: 2027, order: 'gb', ok: true }]],
    ['Sat 17 April 2027', 2026, [{ d: 17, mo: 3, y: 2027, order: 'gb', ok: true }]],
    ['Fri 17 April 2027', 2026, [{ d: 17, mo: 3, y: 2027, order: 'gb', ok: false }]],
    ['Sat 17 & Sun 18 April 2027', 2026, [{ d: 17, mo: 3, y: 2027, order: 'gb', ok: true }, { d: 18, mo: 3, y: 2027, order: 'gb', ok: true }]],
    ['Sat 17 to Mon 18 April 2027', 2026, [{ d: 17, mo: 3, y: 2027, order: 'gb', ok: true }, { d: 18, mo: 3, y: 2027, order: 'gb', ok: false }]],
    ['Doors 17 April 2027', 2026, [{ d: 17, mo: 3, y: 2027, order: 'gb' }]],
    ['Ships January 15', 2026, [{ d: 15, mo: 0, y: 2026, order: 'us' }]],
    ['Fri, 15 Jan 2027', 2026, [{ d: 15, mo: 0, y: 2027, order: 'gb', ok: true }]],
    ['Up 12% in May 2026', 2026, []],
  ];
  let bad = 0;
  for (const [text, yr, want] of cases) {
    const got = parseDates(text, yr).map((x) => ({ d: x.d, mo: x.mo, y: x.y, order: x.order, ...(x.wd !== undefined ? { ok: x.wd === x.real } : {}) }));
    const pass = JSON.stringify(got) === JSON.stringify(want);
    if (!pass) bad++;
    console.log(`${pass ? 'pass' : 'FAIL'}  ${text} (--year ${yr})${pass ? '' : `\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`}`);
  }
  console.log(bad ? `${bad} of ${cases.length} date cases failed` : `all ${cases.length} date cases pass`);
  process.exit(bad ? 1 : 0);
}
