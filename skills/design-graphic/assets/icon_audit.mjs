#!/usr/bin/env node
// Icon set audit: the blur-and-squint review of design-graphic references/02, as numbers.
//
// Usage (from the design-kb repo root, so tools/browser.mjs resolves):
//   node skills/design-graphic/assets/icon_audit.mjs page.html [--selector "svg.i"] [--json out.json]
//
// For every distinct small icon on the page (default: inline svg 12 to 24px with stroked or filled shapes),
// it resolves the page CSS onto the icon (stroke, width, caps, joins, fill), renders it alone, black on white,
// at DPR 1 and 2, and reports:
//   size       rendered box in CSS px
//   stroke     resolved stroke width in CSS px, and caps/joins
//   pad        smallest gap between ink and the box edge, CSS px (live area: at least 1px on a 16 box)
//   ink        share of the box covered by ink (optical volume); outliers are more than 35% off the set median
//              for that size (solid status icons are reported separately: they are meant to be heavier)
//   soft@1x, soft@2x  share of ink pixels that are partial (10 to 90% coverage): blur. Straight stems off the
//              device grid push this up; curves and diagonals always add some
//   colors     hard-coded fill or stroke colors (anything but none, currentColor or inherit): a theming bug
// Exit 1 if caps or joins are mixed, a color is hard-coded, or pad is under 1px on a 16 or 24 box.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const { launch, toUrl } = await import(pathToFileURL(path.join(root, 'tools/browser.mjs')).href);
const args = process.argv.slice(2);
const target = args.find((a, i) => !a.startsWith('--') && !['--selector', '--json'].includes(args[i - 1]));
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
if (!target) { console.error('Usage: node skills/design-graphic/assets/icon_audit.mjs page.html [--selector "svg.i"] [--json out.json]'); process.exit(2); }
const selector = opt('--selector', 'svg');

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(toUrl(target));
const icons = await page.evaluate((sel) => {
  const seen = new Map();
  // Logos are not icons (same rule as tools/lint.mjs): an SVG inside an element whose class or id names logo, brand or
  // wordmark is skipped, so the default selector works on a page with a logo (benchmark round 1 builder note).
  const isLogo = (el) => { for (let n = el; n && n.nodeType === 1; n = n.parentElement) if (/logo|brand|wordmark/i.test((n.getAttribute('class') || '') + ' ' + (n.id || ''))) return true; return false; };
  for (const svg of document.querySelectorAll(sel)) {
    if (isLogo(svg)) continue;
    const r = svg.getBoundingClientRect();
    if (r.width < 10 || r.width > 28 || r.height < 10 || r.height > 28) continue;
    if (svg.closest('svg') !== svg) continue;
    const clone = svg.cloneNode(true);
    const src = [...svg.querySelectorAll('*')];
    const dst = [...clone.querySelectorAll('*')];
    const colors = new Set();
    let caps = new Set(), joins = new Set(), stroke = 0;
    src.forEach((el, i) => {
      for (const a of ['fill', 'stroke']) {
        const v = el.getAttribute(a);
        if (v && !/^(none|currentColor|inherit|url\(.*\))$/i.test(v)) colors.add(`${a}=${v}`);
      }
      if (!(el instanceof SVGGeometryElement)) return;
      const cs = getComputedStyle(el);
      const d = dst[i];
      const hasStroke = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0;
      d.setAttribute('fill', cs.fill === 'none' ? 'none' : '#000');
      d.setAttribute('stroke', hasStroke ? '#000' : 'none');
      d.setAttribute('stroke-width', cs.strokeWidth);
      d.setAttribute('stroke-linecap', cs.strokeLinecap);
      d.setAttribute('stroke-linejoin', cs.strokeLinejoin);
      d.setAttribute('fill-rule', cs.fillRule);
      if (cs.vectorEffect && cs.vectorEffect !== 'none') d.setAttribute('vector-effect', cs.vectorEffect);
      if (hasStroke) { caps.add(cs.strokeLinecap); joins.add(cs.strokeLinejoin); stroke = Math.max(stroke, parseFloat(cs.strokeWidth)); }
    });
    clone.setAttribute('width', r.width); clone.setAttribute('height', r.height);
    clone.removeAttribute('class'); clone.removeAttribute('style');
    const key = clone.outerHTML;
    if (seen.has(key)) { seen.get(key).count++; continue; }
    const host = svg.dataset.icon ? null : svg.closest('[class]');
    const solid = !stroke;
    seen.set(key, { html: key, w: r.width, h: r.height, stroke, caps: [...caps], joins: [...joins], colors: [...colors], solid,
      where: svg.dataset.icon || (host ? host.tagName.toLowerCase() + '.' + [...host.classList].slice(0, 2).join('.') : svg.parentElement.tagName.toLowerCase()), count: 1 });
  }
  return [...seen.values()];
}, selector);

const results = [];
for (const dpr of [1, 2]) {
  const p = await browser.newPage({ viewport: { width: 64, height: 64 }, deviceScaleFactor: dpr });
  for (const [n, ic] of icons.entries()) {
    await p.setContent(`<body style="margin:0;background:#fff"><div style="padding:8px">${ic.html}</div></body>`);
    const buf = await p.screenshot({ clip: { x: 8, y: 8, width: ic.w, height: ic.h } });
    const m = await p.evaluate(async (b64) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, img.width, img.height).data;
      let ink = 0, inkPx = 0, soft = 0, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
      for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
        const v = 1 - d[(y * img.width + x) * 4] / 255;
        if (v > 0.1) { inkPx++; if (v < 0.9) soft++; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
        ink += v;
      }
      return { ink: ink / (img.width * img.height), soft: inkPx ? soft / inkPx : 0, pad: Math.min(minX, minY, img.width - 1 - maxX, img.height - 1 - maxY), W: img.width };
    }, buf.toString('base64'));
    results[n] = results[n] || { ...ic };
    results[n]['ink' + dpr] = m.ink; results[n]['soft' + dpr] = m.soft;
    if (dpr === 2) results[n].pad = m.pad / 2;
  }
  await p.close();
}
await browser.close();

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const groups = {};
for (const r of results) { const k = `${r.w}${r.solid ? 's' : ''}`; (groups[k] = groups[k] || []).push(r.ink2); }
const allCaps = new Set(results.flatMap((r) => r.caps)), allJoins = new Set(results.flatMap((r) => r.joins));
let fail = false;
const pct = (v) => (v * 100).toFixed(0).padStart(3) + '%';
console.log(`icons: ${results.length} distinct (${results.reduce((s, r) => s + r.count, 0)} on page)`);
console.log('  size  stroke  pad   ink   soft@1x soft@2x  flags   where');
for (const r of results) {
  const flags = [];
  const med = median(groups[`${r.w}${r.solid ? 's' : ''}`]);
  if (med && Math.abs(r.ink2 - med) / med > 0.35) flags.push('volume');
  if ((r.w >= 16) && r.pad < 1) { flags.push('pad'); fail = true; }
  if (r.colors.length) { flags.push('color:' + r.colors.join('|')); fail = true; }
  r.flags = flags;
  console.log(`  ${String(r.w).padStart(4)}  ${r.solid ? 'solid ' : (r.stroke.toFixed(2) + '  ')} ${r.pad.toFixed(1).padStart(4)}  ${pct(r.ink2)}  ${pct(r.soft1)}    ${pct(r.soft2)}    ${flags.join(',') || '-'}  ${r.where} x${r.count}`);
}
if (allCaps.size > 1) { console.log(`FAIL mixed caps: ${[...allCaps].join(', ')}`); fail = true; }
if (allJoins.size > 1) { console.log(`FAIL mixed joins: ${[...allJoins].join(', ')}`); fail = true; }
if (!fail) console.log('PASS (volume flags are prompts to look, not fails)');
const json = opt('--json');
if (json) fs.writeFileSync(json, JSON.stringify(results.map(({ html, ...r }) => r), null, 1));
process.exit(fail ? 1 : 0);
