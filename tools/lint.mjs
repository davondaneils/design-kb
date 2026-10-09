#!/usr/bin/env node
// Fundamentals lint: the automated half of the fundamentals checklist in kb/FOUNDATIONS.md.
//
// Usage:
//   node tools/lint.mjs <html> [--json out.json] [--quiet]
//
// Checks (fail = hard gate, warn = judged by a person):
//   axe          axe-core WCAG 2.0/2.1/2.2 A and AA rules, light and dark scheme, 390 and 1440 (includes contrast)
//   targets      interactive targets at least 24x24 CSS px (inline text links exempt); warn under 44x44 at 390px
//   measure      body paragraphs 45 to 75 characters per line at 1440px; at most 75 at 390px
//   type-scale   every rendered text size on the FOUNDATIONS scale (12 14 16 20 25 31 39 49 61);
//                sizes of 39px and up may be fluid clamp() display sizes (warn)
//   spacing      margin, padding and gap on the FOUNDATIONS scale (0 2 4 8 12 16 24 32 48 64 96 128)
//   overflow     no horizontal scroll at 390px
//   focus        every element in the tab order shows a visible focus style
//   motion       if the page animates, prefers-reduced-motion removes movement
//
// Exit code: 0 when no check fails, 1 when any check fails, 2 on usage error.
// Opt out for one element (use sparingly, explain in the test report): data-lint-skip="measure spacing type-scale targets".
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { launch, toUrl } from './browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const TYPE_SCALE = [12, 14, 16, 20, 25, 31, 39, 49, 61];
const SPACE_SCALE = [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--json');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const quiet = args.includes('--quiet');
if (!target) {
  console.error('Usage: node tools/lint.mjs <html> [--json out.json] [--quiet]');
  process.exit(2);
}

const report = { file: target, date: new Date().toISOString(), checks: {}, summary: {} };
function add(check, level, message, detail) {
  report.checks[check] ??= { fail: [], warn: [], pass: true };
  if (level === 'fail') report.checks[check].pass = false;
  report.checks[check][level].push(detail ? { message, ...detail } : { message });
}
function ok(check) { report.checks[check] ??= { fail: [], warn: [], pass: true }; }

const browser = await launch();
async function openPage(width, scheme, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion });
  const page = await context.newPage();
  await page.goto(toUrl(target), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  return { context, page };
}

// Shared in-page helpers, injected as a string so they run in the browser.
const helpers = `
  window.__lint = {
    visible(el) {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    },
    skipped(el, check) {
      const host = el.closest('[data-lint-skip]');
      return !!host && host.getAttribute('data-lint-skip').split(/\\s+/).includes(check);
    },
    sel(el) {
      if (el.id) return '#' + el.id;
      const parts = [];
      let n = el;
      while (n && n.nodeType === 1 && parts.length < 4) {
        let p = n.tagName.toLowerCase();
        if (n.classList.length) p += '.' + [...n.classList].slice(0, 2).join('.');
        parts.unshift(p);
        if (n.id) { parts[0] = '#' + n.id; break; }
        n = n.parentElement;
      }
      return parts.join(' > ');
    },
  };
`;

try {
  // 1. axe-core, both schemes, both widths.
  ok('axe');
  const seen = new Set();
  for (const scheme of ['light', 'dark']) {
    for (const width of [390, 1440]) {
      const { context, page } = await openPage(width, scheme);
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(async (tags) => {
        // eslint-disable-next-line no-undef
        const r = await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
        const slim = (list) => list.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 8).map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').split('\n').slice(0, 2).join(' ') })), count: v.nodes.length }));
        return { violations: slim(r.violations), incomplete: slim(r.incomplete) };
      }, AXE_TAGS);
      for (const v of res.violations) {
        for (const n of v.nodes) {
          const key = v.id === 'color-contrast' ? `${v.id}|${n.target}|${scheme}` : `${v.id}|${n.target}`;
          if (seen.has(key)) continue;
          seen.add(key);
          add('axe', 'fail', `${v.id}: ${v.help}`, { scheme, width, target: n.target, why: n.summary });
        }
      }
      for (const v of res.incomplete) {
        const key = `inc|${v.id}|${scheme}`;
        if (seen.has(key)) continue;
        seen.add(key);
        add('axe', 'warn', `needs review by eye, ${v.id}: ${v.help} (${v.count} nodes; axe could not decide, often text over images, gradients or overlapping layers)`, { scheme, width, targets: v.nodes.slice(0, 3).map((n) => n.target) });
      }
      await context.close();
    }
  }

  // 2 to 6: layout checks at 390 (mobile) and 1440 (desktop), light scheme.
  for (const width of [390, 1440]) {
    const { context, page } = await openPage(width, 'light');
    await page.addScriptTag({ content: helpers });
    const r = await page.evaluate(({ width, TYPE_SCALE, SPACE_SCALE }) => {
      const L = window.__lint;
      const out = { targets: [], measure: [], type: [], spacing: [], overflow: null, fluid: false };
      const all = [...document.body.querySelectorAll('*')].filter((el) => !el.closest('svg, head, script, style, template') || el.tagName.toLowerCase() === 'svg');

      // Targets.
      const interactive = all.filter((el) => el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [tabindex]:not([tabindex="-1"])') && L.visible(el) && !L.skipped(el, 'targets'));
      for (const el of interactive) {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        // WCAG 2.5.8 inline exception: a link inside a sentence.
        if (el.tagName === 'A' && s.display === 'inline') {
          const parentText = (el.parentElement?.textContent || '').trim().length;
          if (parentText > (el.textContent || '').trim().length + 20) continue;
        }
        let w = r.width, h = r.height;
        // A visually hidden checkbox or radio whose label is the target.
        if ((el.type === 'checkbox' || el.type === 'radio') && el.labels && el.labels[0]) {
          const lr = el.labels[0].getBoundingClientRect();
          w = Math.max(w, lr.width); h = Math.max(h, lr.height);
        }
        out.targets.push({ sel: L.sel(el), w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10 });
      }

      // Measure: paragraphs of running text with 2+ lines.
      for (const el of all.filter((e) => e.matches('p, li, dd, blockquote') && L.visible(e) && !L.skipped(e, 'measure'))) {
        if (el.closest('nav, table, button, [role=table], [role=grid]')) continue;
        if (el.matches('li') && el.querySelector('p')) continue;
        const text = el.textContent.replace(/\s+/g, ' ').trim();
        if (text.length < 60) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        // Count real characters per rendered line: measure each word, group by line top.
        const lines = new Map();
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const re = /\S+\s*/g;
          let m;
          while ((m = re.exec(n.textContent))) {
            range.setStart(n, m.index); range.setEnd(n, m.index + m[0].trimEnd().length);
            const rc = range.getClientRects()[0];
            if (!rc) continue;
            const key = Math.round(rc.bottom / 4);
            lines.set(key, (lines.get(key) || 0) + m[0].replace(/\s+/g, ' ').length);
          }
        }
        if (lines.size < 2) continue;
        const counts = [...lines.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);
        const full = counts.slice(0, -1); // last line is usually short
        const avg = Math.round(full.reduce((a, b) => a + b, 0) / full.length);
        const widest = Math.max(...full);
        out.measure.push({ sel: L.sel(el), cpl: avg, widest, lines: lines.size, fontSize: fs });
      }

      // Type scale: every element that renders its own text.
      const sizes = new Map();
      for (const el of all) {
        if (!L.visible(el) || L.skipped(el, 'type-scale')) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || el.matches('input, select, textarea, button');
        if (!own) continue;
        const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100;
        if (!sizes.has(fs)) sizes.set(fs, []);
        sizes.get(fs).push(L.sel(el));
      }
      for (const [fs, sels] of sizes) {
        const onScale = TYPE_SCALE.some((v) => Math.abs(v - fs) <= 0.5);
        if (!onScale) out.type.push({ size: fs, count: sels.length, examples: sels.slice(0, 4) });
      }
      for (const sheet of document.styleSheets) {
        try { for (const rule of sheet.cssRules) if (/font-size:\s*clamp\(/.test(rule.cssText) || /--text-[\w-]+:\s*clamp\(/.test(rule.cssText)) out.fluid = true; } catch { /* cross-origin */ }
      }

      // Spacing: computed (not used) values via Typed OM so auto margins stay "auto".
      const props = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'row-gap', 'column-gap'];
      const bad = new Map();
      for (const el of all) {
        if (el.closest('svg') || !L.visible(el) || L.skipped(el, 'spacing')) continue;
        if (el.matches('input[type=checkbox], input[type=radio], input[type=range], input[type=color]')) continue;
        const map = el.computedStyleMap();
        const cs = getComputedStyle(el);
        for (const p of props) {
          let v = map.get(p);
          if (!v) continue;
          if (v instanceof CSSKeywordValue) continue; // auto, normal
          let px;
          if (v instanceof CSSUnitValue) {
            if (v.unit === 'percent') continue;
            if (v.unit === 'px') px = v.value;
            else px = parseFloat(cs.getPropertyValue(p));
          } else {
            px = parseFloat(cs.getPropertyValue(p)); // calc() and friends: use resolved px
          }
          if (Number.isNaN(px)) continue;
          px = Math.round(Math.abs(px) * 100) / 100;
          if (SPACE_SCALE.some((s) => Math.abs(s - px) <= 0.5)) continue;
          const key = `${p}:${px}`;
          if (!bad.has(key)) bad.set(key, []);
          bad.get(key).push(L.sel(el));
        }
      }
      for (const [key, sels] of bad) out.spacing.push({ value: key, count: sels.length, examples: sels.slice(0, 4) });

      // Overflow.
      const doc = document.documentElement;
      const offenders = [];
      if (doc.scrollWidth > doc.clientWidth + 1) {
        for (const el of all) {
          if (!L.visible(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.right > doc.clientWidth + 1 || r.left < -1) offenders.push({ sel: L.sel(el), left: Math.round(r.left), right: Math.round(r.right) });
        }
      }
      out.overflow = { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: offenders.slice(0, 8) };
      return out;
    }, { width, TYPE_SCALE, SPACE_SCALE });

    // Targets.
    ok('targets');
    for (const t of r.targets) {
      if (t.w < 24 || t.h < 24) add('targets', 'fail', `target under 24x24 at ${width}px`, t);
      else if (width === 390 && (t.w < 44 || t.h < 44)) add('targets', 'warn', 'touch target under 44x44 at 390px', t);
    }
    // Measure.
    ok('measure');
    for (const m of r.measure) {
      if (m.cpl > 75) add('measure', 'fail', `line length ${m.cpl} characters at ${width}px (max 75)`, m);
      else if (width === 1440 && m.cpl < 45 && m.lines >= 3) add('measure', 'fail', `line length ${m.cpl} characters at 1440px (min 45)`, m);
      else if (width === 390 && m.cpl < 30 && m.lines >= 3) add('measure', 'warn', `short line length ${m.cpl} characters at 390px`, m);
    }
    // Type scale.
    ok('type-scale');
    for (const t of r.type) {
      if (t.size >= 39 && r.fluid) add('type-scale', 'warn', `fluid display size ${t.size}px at ${width}px (clamp() present)`, t);
      else add('type-scale', 'fail', `font size ${t.size}px off the type scale at ${width}px`, t);
    }
    // Spacing.
    ok('spacing');
    for (const s of r.spacing) add('spacing', 'fail', `${s.value}px off the spacing scale at ${width}px`, s);
    // Overflow.
    ok('overflow');
    if (width === 390 && r.overflow.scrollWidth > r.overflow.clientWidth + 1) {
      add('overflow', 'fail', `horizontal overflow at 390px: page is ${r.overflow.scrollWidth}px wide`, { offenders: r.overflow.offenders });
    }
    await context.close();
  }

  // 7. Focus visible: tab through the page, compare focused vs unfocused styles.
  ok('focus');
  {
    const { context, page } = await openPage(1440, 'light');
    await page.addScriptTag({ content: helpers });
    const styleOf = `(el) => { const s = getComputedStyle(el); return { outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 ? s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor : 'none', outlineWidth: parseFloat(s.outlineWidth) || 0, shadow: s.boxShadow, border: s.borderColor, bg: s.backgroundColor, deco: s.textDecorationLine + s.textDecorationThickness }; }`;
    const count = await page.evaluate(() => document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]').length);
    const seenEls = new Set();
    for (let i = 0; i < Math.min(count + 2, 200); i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(`(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const f = (${styleOf})(el);
        const sel = window.__lint.sel(el);
        el.dataset.lintFocusIndex = el.dataset.lintFocusIndex || String(Math.random());
        return { sel, key: el.dataset.lintFocusIndex, f, skipped: window.__lint.skipped(el, 'focus') };
      })()`);
      if (!info) continue;
      if (seenEls.has(info.key)) break;
      seenEls.add(info.key);
      // Unfocused style: blur a clone is unreliable, so blur and re-measure, then restore focus by tabbing on.
      const unf = await page.evaluate(`(() => {
        const el = document.querySelector('[data-lint-focus-index="${info.key}"]');
        el.blur();
        const u = (${styleOf})(el);
        el.focus({ focusVisible: true });
        return u;
      })()`);
      if (info.skipped) continue;
      const f = info.f;
      const visible = (f.outline !== 'none' && f.outlineWidth >= 1) || f.shadow !== unf.shadow || f.border !== unf.border || f.bg !== unf.bg || f.deco !== unf.deco;
      if (!visible) add('focus', 'fail', 'no visible focus style', { target: info.sel });
      else if (f.outline !== 'none' && f.outlineWidth < 2 && f.shadow === unf.shadow) add('focus', 'warn', `thin focus outline (${f.outline}); FOUNDATIONS default is 2px`, { target: info.sel });
    }
    report.summary.focusables = seenEls.size;
    await context.close();
  }

  // 8. Reduced motion.
  ok('motion');
  {
    const probe = async (reducedMotion) => {
      const { context, page } = await openPage(1440, 'light', reducedMotion);
      await page.waitForTimeout(300);
      const res = await page.evaluate(() => {
        const moving = /transform|translate|scale|rotate|top|left|right|bottom|margin|width|height|all/;
        const anims = [];
        const trans = [];
        for (const el of document.querySelectorAll('*')) {
          const s = getComputedStyle(el);
          const durs = s.animationDuration.split(',').map(parseFloat);
          if (s.animationName !== 'none' && Math.max(...durs) > 0.1) anims.push({ name: s.animationName, dur: s.animationDuration, iter: s.animationIterationCount });
          const tdurs = s.transitionDuration.split(',').map(parseFloat);
          const tprops = s.transitionProperty.split(',').map((x) => x.trim());
          tprops.forEach((p, i) => { const d = tdurs[i % tdurs.length]; if (d > 0.1 && moving.test(p)) trans.push({ prop: p, dur: d }); });
        }
        let mediaRule = false;
        for (const sheet of document.styleSheets) {
          try { for (const rule of sheet.cssRules) if (rule.media && /prefers-reduced-motion/.test(rule.media.mediaText)) mediaRule = true; } catch { /* ignore */ }
        }
        if (window.matchMedia && /prefers-reduced-motion/.test(document.documentElement.innerHTML)) mediaRule = true;
        return { anims, trans, mediaRule, running: document.getAnimations().filter((a) => a.playState === 'running').length };
      });
      await context.close();
      return res;
    };
    const normal = await probe('no-preference');
    report.summary.motionFound = { animations: normal.anims.length, movingTransitions: normal.trans.length };
    if (normal.anims.length || normal.trans.length) {
      const reduced = await probe('reduce');
      if (!normal.mediaRule) add('motion', 'fail', 'page animates but has no prefers-reduced-motion rule');
      for (const a of reduced.anims) add('motion', 'fail', `animation still runs with reduced motion: ${a.name} ${a.dur}`, a);
      if (reduced.trans.length) add('motion', 'warn', `${reduced.trans.length} movement transitions still over 100ms with reduced motion`, { examples: reduced.trans.slice(0, 4) });
    }
  }
} finally {
  await browser.close();
}

// Summary.
let fails = 0, warns = 0;
for (const [name, c] of Object.entries(report.checks)) {
  fails += c.fail.length; warns += c.warn.length;
  report.summary[name] = c.pass ? (c.warn.length ? `pass (${c.warn.length} warn)` : 'pass') : `FAIL (${c.fail.length})`;
}
report.summary.result = fails ? 'FAIL' : 'PASS';
report.summary.fails = fails;
report.summary.warns = warns;

const outPath = jsonOut || target.replace(/\.html?$/, '') + '.lint.json';
if (!/^https?:/.test(target)) fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!quiet) {
  console.log(`\nFundamentals lint: ${path.basename(target)}  ->  ${report.summary.result} (${fails} fail, ${warns} warn)\n`);
  for (const [name, c] of Object.entries(report.checks)) {
    console.log(`  ${c.pass ? 'pass' : 'FAIL'}  ${name}${c.warn.length ? `  (${c.warn.length} warn)` : ''}`);
    for (const f of c.fail.slice(0, 12)) console.log(`        x ${f.message}${f.target ? '  [' + f.target + ']' : f.sel ? '  [' + f.sel + ']' : f.examples ? '  [' + f.examples.join(', ') + ']' : ''}${f.why ? '  ' + f.why : ''}`);
    if (c.fail.length > 12) console.log(`        ... ${c.fail.length - 12} more`);
    for (const w of c.warn.slice(0, 5)) console.log(`        ! ${w.message}${w.sel ? '  [' + w.sel + ']' : w.target ? '  [' + w.target + ']' : ''}`);
    if (c.warn.length > 5) console.log(`        ... ${c.warn.length - 5} more warnings`);
  }
  console.log(`\n  JSON: ${outPath}`);
}
process.exit(fails ? 1 : 0);
