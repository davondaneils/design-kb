#!/usr/bin/env node
// Claims inventory for design-copy (references/06-copy-in-context.md, "Every number is a claim").
// Lists every visible sentence on a page that carries a checkable claim (a number, percent, price, date,
// weekday, duration or comparison) so a reviewer can tick each one against the data it summarises.
// It also flags three mechanical errors on its own:
//   WEEKDAY  a "Wed, Oct 7" style date whose weekday is wrong for --year
//   RELATIVE a relative day word ("this Friday", "tomorrow") in money, shipping or deadline copy (schedules such as
//            "every Tuesday" pass; low-stakes recency such as "roasted Tuesday" passes unless the sentence names money or shipping)
//   CLOCK    a 24-hour time ("14:05") when the page also uses am/pm, or vice versa (one clock per page)
// Reads static HTML (scripts, styles and SVG removed; aria-label, alt and placeholder text included).
// Strings built by JavaScript at runtime are not seen: list those from the string table instead.
//
// Usage: node skills/design-copy/assets/claims_inventory.mjs page.html [--year 2026]
// Exit code: 0 when nothing is flagged, 1 when a WEEKDAY, RELATIVE or CLOCK flag fires, 2 on usage error.
import fs from 'node:fs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const yi = args.indexOf('--year');
const year = yi >= 0 ? Number(args[yi + 1]) : new Date().getFullYear();
if (!file || !fs.existsSync(file)) { console.error('Usage: node claims_inventory.mjs page.html [--year 2026]'); process.exit(2); }

let html = fs.readFileSync(file, 'utf8');
const attrs = [...html.matchAll(/\s(?:aria-label|alt|placeholder)="([^"]+)"/g)].map((m) => m[1]);
html = html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
const decode = (s) => s.replace(/&nbsp;|&#8239;|&thinsp;| | /g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·')
  .replace(/&amp;/g, '&').replace(/&times;|&#215;/g, '×').replace(/&[a-z]+;|&#\d+;/g, ' ');
const blocks = html.split(/<\/(?:p|li|h[1-6]|td|th|dt|dd|caption|figcaption|button|a|label|strong|span|div)>/i)
  .map((b) => decode(b.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()).filter(Boolean)
  .concat(attrs.map(decode));

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

console.log(`Claims inventory: ${file} (${rows.length} strings to check against the data)\n`);
rows.forEach((r, i) => console.log(String(i + 1).padStart(3) + '  ' + r));
console.log('');
if (flags.length) { flags.forEach((f) => console.log(f)); process.exit(1); }
console.log('No mechanical flags. Now tick every line above against its source: chart data, price list, policy, log.');
