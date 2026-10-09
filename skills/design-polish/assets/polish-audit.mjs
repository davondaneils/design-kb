#!/usr/bin/env node
// Polish audit: advisory checks for the design-polish checklist (references/06-polish-checklist.md).
// It does not replace tools/lint.mjs (the fundamentals gate). Run it after the lint passes.
//
// Usage (from the design-kb repo root, after `npm ci` in tools/):
//   node skills/design-polish/assets/polish-audit.mjs <page.html> [--json out.json]
//
// Checks (fail = polish bug, warn = look at it):
//   radius       every border-radius on the family 0 4 8 12 16 full; nested radius = outer minus gap (warn)
//   shadow       shadows fall one way (x = 0, y >= 0); distinct shadow count (warn above 6); heavy shadows in dark (warn)
//   focus-shape  :focus-visible must not change an element's radius, border width or layout size
//   state-shift  :hover must not change layout size (offsetWidth / offsetHeight)
//   hover-gate   :hover rules that move or lift (transform, box-shadow, translate, scale) sit inside @media (hover: hover) (warn)
//   icon-stroke  inline SVG stroke within 0.35px of the adjacent Inter text stem (warn; Inter only)
//   svg-hairline 1px horizontal SVG lines on integer y without crispEdges blur at 1x (warn)
//   color-scheme page with dark styles sets color-scheme (property or meta)
//   tabular      digits in td, th, .num, [class*=price], [class*=value], [class*=kpi] use tabular figures (warn)
//   heading-wrap h1 to h3 on 2+ lines use text-wrap: balance or pretty (warn)
//   forced-edge  in forced colors, inputs keep a border and shadow-only controls keep an edge (warn)
// Exit code: 1 if any fail, else 0.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { launch, toUrl } = await import(path.join(here, '../../../tools/browser.mjs'));

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--json');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
if (!target) { console.error('Usage: node skills/design-polish/assets/polish-audit.mjs <page.html> [--json out.json]'); process.exit(2); }

const RADII = [0, 4, 8, 12, 16];
// Inter stem width as a share of font size, measured (kb/research/polish/scripts/measure.mjs).
const STEM = { 300: 0.07, 400: 0.088, 500: 0.107, 600: 0.127, 700: 0.147, 800: 0.165 };

const report = { file: target, checks: {} };
const add = (check, level, message, detail) => {
  report.checks[check] ??= { fail: [], warn: [], info: [] };
  report.checks[check][level].push(detail ? { message, ...detail } : { message });
};
const ok = (c) => { report.checks[c] ??= { fail: [], warn: [], info: [] }; };

const helpers = `window.__pa = {
  vis(el){ const s=getComputedStyle(el); if(s.display==='none'||s.visibility==='hidden') return false; const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; },
  sel(el){ if(el.id) return '#'+el.id; const p=[]; let n=el; while(n&&n.nodeType===1&&p.length<3){ let s=n.tagName.toLowerCase(); if(n.classList.length) s+='.'+[...n.classList].slice(0,2).join('.'); p.unshift(s); if(n.id){p[0]='#'+n.id;break;} n=n.parentElement;} return p.join(' > '); }
};`;

const browser = await launch();
try {
  // Static checks at 1440 light.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.addScriptTag({ content: helpers });
    const r = await page.evaluate(({ RADII, STEM }) => {
      const P = window.__pa;
      const out = { radius: [], nested: [], radiusSet: {}, shadows: {}, shadowDir: [], hoverGate: [], icon: [], svgLine: [], scheme: null, tab: [], heading: [] };
      const els = [...document.body.querySelectorAll('*')].filter((e) => !e.closest('svg') && P.vis(e));
      const rad = (el) => { const s = getComputedStyle(el); return ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map((k) => s[k]); };
      for (const el of els) {
        const r = el.getBoundingClientRect();
        for (const v of rad(el)) {
          if (v === '0px') continue;
          if (v.endsWith('%')) { out.radiusSet['full (' + v + ')'] = (out.radiusSet['full (' + v + ')'] || 0) + 1; continue; }
          const px = parseFloat(v);
          const isFull = px >= Math.min(r.width, r.height) / 2 - 0.5;
          const key = isFull ? 'full' : String(px);
          out.radiusSet[key] = (out.radiusSet[key] || 0) + 1;
          if (!isFull && !RADII.some((x) => Math.abs(x - px) < 0.5)) out.radius.push({ sel: P.sel(el), value: px });
        }
        // Nested radius: child whose top-left corner sits inside the parent's rounded corner at an even inset.
        const R = parseFloat(getComputedStyle(el).borderTopLeftRadius);
        if (R > 4 && !getComputedStyle(el).borderTopLeftRadius.endsWith('%')) {
          for (const c of el.querySelectorAll(':scope > *, :scope > * > *')) {
            if (c.closest('svg') || !P.vis(c)) continue;
            const cr = c.getBoundingClientRect();
            const dx = Math.round(cr.left - r.left), dy = Math.round(cr.top - r.top);
            if (dx <= 0 || dy <= 0 || Math.abs(dx - dy) > 1 || dx >= R) continue;
            const rc = parseFloat(getComputedStyle(c).borderTopLeftRadius);
            if (!rc) continue;
            const expected = Math.max(R - dx, 0);
            if (Math.abs(rc - expected) > 2 && !(expected <= 4 && rc <= 4)) out.nested.push({ sel: P.sel(c), outer: R, gap: dx, inner: rc, expected });
          }
        }
        const sh = getComputedStyle(el).boxShadow;
        if (sh && sh !== 'none') {
          out.shadows[sh] = (out.shadows[sh] || 0) + 1;
          for (const layer of sh.split(/,(?![^(]*\))/)) {
            if (/inset/.test(layer)) continue;
            const nums = (layer.replace(/rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)/g, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
            const [x = 0, y = 0, blur = 0] = nums;
            if (x !== 0 || y < 0) out.shadowDir.push({ sel: P.sel(el), layer: layer.trim(), x, y, blur });
          }
        }
      }
      // Hover gating.
      const moving = /transform|translate|scale|rotate|box-shadow|top|margin|width|height/;
      const walk = (rules, gated) => {
        for (const rule of rules) {
          if (rule.cssRules && rule.media) walk(rule.cssRules, gated || /hover:\s*hover/.test(rule.media.mediaText));
          else if (rule.cssRules && rule.conditionText !== undefined) walk(rule.cssRules, gated || /hover:\s*hover/.test(rule.conditionText));
          else if (rule.selectorText && /:hover/.test(rule.selectorText) && !gated) {
            const props = [...rule.style].filter((p) => moving.test(p));
            if (props.length) out.hoverGate.push({ selector: rule.selectorText.slice(0, 80), props: props.slice(0, 4).join(' ') });
          }
        }
      };
      for (const s of document.styleSheets) { try { walk(s.cssRules, false); } catch { /* cross-origin */ } }
      // Icon stroke vs adjacent text.
      for (const svg of document.querySelectorAll('svg')) {
        if (!P.vis(svg)) continue;
        const br = svg.getBoundingClientRect();
        if (br.width > 28 || br.height > 28 || br.height < 10) continue; // skip large art and legend swatches
        const host = svg.parentElement; if (!host) continue;
        const hs = getComputedStyle(host);
        if (!/Inter/i.test(hs.fontFamily) || !host.textContent.trim()) continue;
        const shapes = [...svg.querySelectorAll('path, line, polyline, circle, rect, polygon')].filter((n) => getComputedStyle(n).stroke !== 'none' && parseFloat(getComputedStyle(n).strokeWidth) > 0 && getComputedStyle(n).fill === 'none');
        if (!shapes.length) continue;
        const n = shapes[0]; const ns = getComputedStyle(n);
        const ctm = n.getScreenCTM(); const scale = ns.vectorEffect === 'non-scaling-stroke' ? 1 : (ctm ? Math.hypot(ctm.a, ctm.b) : 1);
        const stroke = Math.round(parseFloat(ns.strokeWidth) * scale * 100) / 100;
        const w = Math.min(800, Math.max(300, Math.round(parseInt(hs.fontWeight, 10) / 100) * 100));
        const stem = Math.round(parseFloat(hs.fontSize) * (STEM[w] || 0.1) * 100) / 100;
        const caps = new Set(shapes.map((s) => getComputedStyle(s).strokeLinecap));
        out.icon.push({ sel: P.sel(svg), stroke, stem, text: `${hs.fontSize} ${hs.fontWeight}`, caps: [...caps].join('/') });
      }
      // SVG 1px horizontal lines on integer device rows (DPR 1).
      for (const ln of document.querySelectorAll('svg line')) {
        const s = getComputedStyle(ln);
        if (s.shapeRendering === 'crispEdges' || s.stroke === 'none') continue;
        const ctm = ln.getScreenCTM(); if (!ctm) continue;
        const sw = parseFloat(s.strokeWidth) * Math.hypot(ctm.a, ctm.b);
        const y1 = ln.y1.baseVal.value, y2 = ln.y2.baseVal.value;
        if (Math.abs(sw - 1) > 0.05 || y1 !== y2) continue;
        const sy = ctm.d * y1 + ctm.f;
        if (Math.abs(sy - Math.round(sy)) < 0.01) out.svgLine.push({ sel: P.sel(ln.ownerSVGElement), y: sy });
      }
      // color-scheme.
      let darkRules = false;
      const walkDark = (rules) => { for (const r of rules) { if (r.media && /prefers-color-scheme:\s*dark/.test(r.media.mediaText)) darkRules = true; if (r.cssRules) walkDark(r.cssRules); } };
      for (const s of document.styleSheets) { try { walkDark(s.cssRules); } catch {} }
      const meta = document.querySelector('meta[name=color-scheme]');
      out.scheme = { darkRules, property: getComputedStyle(document.documentElement).colorScheme, meta: meta ? meta.content : null };
      // Tabular figures.
      for (const el of document.querySelectorAll('td, th, .num, [class*=price], [class*=value], [class*=kpi] dd, time')) {
        if (!P.vis(el) || !/\d/.test(el.textContent)) continue;
        const s = getComputedStyle(el);
        if (!/tabular-nums/.test(s.fontVariantNumeric) && !/"tnum"(?! 0)/.test(s.fontFeatureSettings)) out.tab.push(P.sel(el));
      }
      // Headings.
      for (const h of document.querySelectorAll('h1, h2, h3')) {
        if (!P.vis(h)) continue;
        const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize) * 1.2;
        const lines = Math.round(h.getBoundingClientRect().height / lh);
        const tw = getComputedStyle(h).textWrapStyle || getComputedStyle(h).textWrap || '';
        if (lines >= 2 && !/balance|pretty/.test(tw)) out.heading.push({ sel: P.sel(h), lines, wrap: tw });
      }
      return out;
    }, { RADII, STEM });

    ok('radius');
    for (const x of r.radius) add('radius', 'fail', `radius ${x.value}px is off the family (0 4 8 12 16 full)`, x);
    for (const x of r.nested) add('radius', 'warn', `nested radius ${x.inner}px; outer ${x.outer} minus gap ${x.gap} = ${x.expected}`, x);
    add('radius', 'info', `census: ${Object.entries(r.radiusSet).map(([k, v]) => `${k}${/full/.test(k) ? '' : 'px'} x${v}`).join(', ') || 'none'}`);
    ok('shadow');
    for (const x of r.shadowDir) add('shadow', 'fail', `shadow does not fall down (x ${x.x}, y ${x.y})`, x);
    const distinct = Object.keys(r.shadows);
    if (distinct.length > 6) add('shadow', 'warn', `${distinct.length} distinct box-shadow values (tokens give 5 plus rings)`);
    add('shadow', 'info', `distinct shadows: ${distinct.length}`);
    ok('hover-gate');
    for (const x of r.hoverGate) add('hover-gate', 'warn', `:hover moves or lifts outside @media (hover: hover): ${x.props}`, x);
    ok('icon-stroke');
    const capSets = new Set(r.icon.map((i) => i.caps));
    if (capSets.size > 1) add('icon-stroke', 'warn', `mixed stroke caps across icons: ${[...capSets].join(', ')}`);
    for (const i of r.icon) if (Math.abs(i.stroke - i.stem) > 0.35) add('icon-stroke', 'warn', `icon stroke ${i.stroke}px vs text stem ${i.stem}px (${i.text})`, i);
    add('icon-stroke', 'info', `icons checked: ${r.icon.length}`);
    ok('svg-hairline');
    for (const x of r.svgLine) add('svg-hairline', 'warn', `1px SVG line on integer y ${x.y} blurs to 2 gray rows at 1x (use y + 0.5 or crispEdges)`, x);
    ok('color-scheme');
    if (r.scheme.darkRules && r.scheme.property === 'normal' && !r.scheme.meta) add('color-scheme', 'fail', 'page has dark styles but no color-scheme (scrollbars and native controls stay light)');
    ok('tabular');
    if (r.tab.length) add('tabular', 'warn', `${r.tab.length} numeric cells without tabular figures`, { examples: r.tab.slice(0, 5) });
    ok('heading-wrap');
    for (const h of r.heading) add('heading-wrap', 'warn', `heading on ${h.lines} lines without text-wrap: balance`, h);
    await ctx.close();
  }

  // Headings at 390: a heading that fits on one line at 1440 often orphans a word on a phone.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.addScriptTag({ content: helpers });
    const hs = await page.evaluate(() => [...document.querySelectorAll('h1, h2, h3')].filter((h) => window.__pa.vis(h)).map((h) => {
      const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize) * 1.2;
      const tw = getComputedStyle(h).textWrapStyle || getComputedStyle(h).textWrap || '';
      return { sel: window.__pa.sel(h), lines: Math.round(h.getBoundingClientRect().height / lh), wrap: tw };
    }).filter((h) => h.lines >= 2 && !/balance|pretty/.test(h.wrap)));
    ok('heading-wrap');
    for (const h of hs) add('heading-wrap', 'warn', `heading on ${h.lines} lines at 390px without text-wrap: balance`, h);
    await ctx.close();
  }

  // Interactive: focus shape and hover layout shift, 1440 light, transitions off.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await page.addScriptTag({ content: helpers });
    const n = await page.evaluate(() => {
      const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter((e) => window.__pa.vis(e));
      els.forEach((e, i) => e.setAttribute('data-pa', i));
      return Math.min(els.length, 120);
    });
    // A radius change only matters when the element paints something (fill, border or shadow); rounding the ring of a transparent link is fine.
    const measure = (i) => page.evaluate((i) => { const el = document.querySelector(`[data-pa="${i}"]`); const s = getComputedStyle(el); const paints = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== 'none'; return { w: el.offsetWidth, h: el.offsetHeight, radius: paints ? s.borderTopLeftRadius + ' ' + s.borderBottomRightRadius : 'n/a', border: s.borderTopWidth + ' ' + s.borderLeftWidth, pad: s.paddingTop + ' ' + s.paddingLeft, weight: s.fontWeight, sel: window.__pa.sel(el) }; }, i);
    ok('focus-shape'); ok('state-shift');
    let tested = 0;
    for (let i = 0; i < n; i++) {
      const before = await measure(i);
      await page.evaluate((i) => document.querySelector(`[data-pa="${i}"]`).focus({ focusVisible: true }), i);
      const focused = await measure(i);
      const diffs = ['radius', 'border', 'pad', 'weight'].filter((k) => before[k] !== focused[k] && !(k === 'radius' && (before[k] === 'n/a' || focused[k] === 'n/a')));
      if (Math.abs(before.w - focused.w) > 0.5 || Math.abs(before.h - focused.h) > 0.5) diffs.push('size');
      if (diffs.length) add('focus-shape', 'fail', `focus changes ${diffs.join(', ')}`, { sel: before.sel, before: diffs.map((d) => before[d] ?? `${before.w}x${before.h}`).join(' | '), after: diffs.map((d) => focused[d] ?? `${focused.w}x${focused.h}`).join(' | ') });
      await page.evaluate((i) => document.querySelector(`[data-pa="${i}"]`).blur(), i);
      try {
        await page.locator(`[data-pa="${i}"]`).hover({ timeout: 1000 });
        const hovered = await measure(i);
        if (Math.abs(before.w - hovered.w) > 0.5 || Math.abs(before.h - hovered.h) > 0.5 || before.border !== hovered.border) add('state-shift', 'fail', `hover changes layout (${before.w}x${before.h} to ${hovered.w}x${hovered.h}, border ${before.border} to ${hovered.border})`, { sel: before.sel });
        await page.mouse.move(0, 0);
      } catch { /* not hoverable (covered or off screen) */ }
      tested++;
    }
    add('focus-shape', 'info', `elements tested: ${tested}`);
    await ctx.close();
  }

  // Dark: heavy shadows on dark surfaces.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    const heavy = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const sh = getComputedStyle(el).boxShadow;
        if (!sh || sh === 'none') continue;
        for (const layer of sh.split(/,(?![^(]*\))/)) {
          if (/inset/.test(layer)) continue;
          const a = layer.match(/rgba?\([^)]*?([\d.]+)\)/);
          const nums = (layer.replace(/rgba?\([^)]*\)/g, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
          const alpha = a ? parseFloat(a[1]) : 1;
          if (nums[2] > 8 && alpha > 0.3) { out.push({ tag: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''), layer: layer.trim().slice(0, 60) }); break; }
        }
      }
      return out.slice(0, 10);
    });
    for (const h of heavy) add('shadow', 'warn', 'heavy shadow in dark scheme (lift with a lighter surface instead)', h);
    await ctx.close();
  }

  // Forced colors: edges that vanish.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active' });
    const page = await ctx.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    const lost = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea')) {
        const s = getComputedStyle(el);
        const ps = el.parentElement ? getComputedStyle(el.parentElement) : null;
        const parentEdge = ps && parseFloat(ps.borderTopWidth) > 0;
        if (parseFloat(s.borderTopWidth) === 0 && s.outlineStyle === 'none' && !parentEdge && el.getBoundingClientRect().width) out.push('input without border: ' + (el.id || el.name || el.type));
      }
      return out;
    });
    ok('forced-edge');
    for (const l of lost) add('forced-edge', 'warn', l);
    await ctx.close();
  }
} finally {
  await browser.close();
}

let fails = 0, warns = 0;
console.log(`\nPolish audit: ${path.basename(target)}\n`);
for (const [name, c] of Object.entries(report.checks)) {
  fails += c.fail.length; warns += c.warn.length;
  console.log(`  ${c.fail.length ? 'FAIL' : 'pass'}  ${name}${c.warn.length ? `  (${c.warn.length} warn)` : ''}`);
  for (const f of c.fail.slice(0, 10)) console.log(`        x ${f.message}${f.sel ? '  [' + f.sel + ']' : ''}${f.before ? '  ' + f.before + ' -> ' + f.after : ''}`);
  if (c.fail.length > 10) console.log(`        ... ${c.fail.length - 10} more`);
  for (const w of c.warn.slice(0, 6)) console.log(`        ! ${w.message}${w.sel ? '  [' + w.sel + ']' : ''}`);
  if (c.warn.length > 6) console.log(`        ... ${c.warn.length - 6} more warnings`);
  for (const i of c.info) console.log(`        i ${i.message}`);
}
report.summary = { result: fails ? 'FAIL' : 'PASS', fails, warns };
console.log(`\n  Result: ${report.summary.result} (${fails} fail, ${warns} warn)`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2));
process.exit(fails ? 1 : 0);
