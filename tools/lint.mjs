#!/usr/bin/env node
// Fundamentals lint: the automated half of the fundamentals checklist in kb/FOUNDATIONS.md (v0.3).
//
// Usage:
//   node tools/lint.mjs <html[?query]> [--json out.json] [--quiet] [--states state=a,state=b] [--no-fallback]
//
//   --states   also lint each query variant of the page (one report per variant): page.html?state=a, ...
//   --json     JSON path (single target only). Default: <page>.lint.json, or <page>.<query-slug>.lint.json
//
// Hard gates (fail):
//   axe          axe-core WCAG 2.0/2.1/2.2 A and AA rules, light and dark, 390 and 1440 (includes contrast)
//   overlay      text axe could not decide (text over images, textures, gradients, overlaps): the worst pixel
//                under each text box, measured on a render with all text hidden, against 4.5:1 (3:1 large)
//   targets      interactive targets at least 24x24 CSS px (inline text links exempt); warn under 44x44 at 390px
//   measure      body paragraphs 45 to 75 characters per line at 1440px; at most 75 at 390px
//   type-scale   every text size on the FOUNDATIONS scale; fluid clamp() sizes of 39px and up allowed (warn);
//                SVG text renders at 12px or more
//   spacing      margin, padding and gap on the FOUNDATIONS scale
//   overflow     no horizontal scroll at 390px
//   focus        every element in the tab order shows a visible focus style (element or up to 4 ancestors)
//   focus-shape  focus never changes a painted control's radius, border width, padding, weight or size
//   state-shift  hover never changes a control's size or border width
//   radius       every border radius on the family 0 4 8 12 16 full (or a nested outer-minus-inset value)
//   color-scheme a page with dark styles sets color-scheme (property or meta)
//   motion       if the page animates, prefers-reduced-motion removes movement
//
// Warnings (judged by a person; each one is a likely defect):
//   typography   straight quotes, hyphen in number ranges, x between numbers, uppercased units,
//                faked bold or italic, doubled list markers (marker plus a typed numeral)
//   heading-wrap h1 to h3 whose last line is one word, at 390 and 1440
//   tabular      numbers in tables, prices, KPIs and times without tabular figures
//   svg-overlap  text partly covered by an SVG or image that is not its background
//   shadows      more than 5 distinct shadows, upward shadows, alpha over 0.25, drop shadows in dark
//   icon-stroke  small inline icons whose stroke is far from the adjacent Inter text stem
//   weight       inline SVG over 150 KB, page HTML over 1.5 MB
//   fallback     layout shift when the web fonts are removed (metric fallbacks kept) over 8px
//   sticky-focus a focused element sits under a sticky or fixed bar (WCAG 2.4.11)
//
// Exit code: 0 when no check fails, 1 when any check fails, 2 on usage error.
// Opt out for one element (use sparingly, explain in the test report):
//   data-lint-skip="measure spacing type-scale targets focus overlay radius typography svg-overlap tabular"
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { launch, toUrl, splitTarget } from './browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const TYPE_SCALE = [12, 14, 16, 20, 25, 31, 39, 49, 61];
const SPACE_SCALE = [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
const RADII = [0, 4, 8, 12, 16];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
// Inter stem width as a share of font size, measured by design-polish (kb/research/polish/scripts/measure.mjs).
const STEM = { 300: 0.07, 400: 0.088, 500: 0.107, 600: 0.127, 700: 0.147, 800: 0.165 };

const args = process.argv.slice(2);
const valueFlags = new Set(['--json', '--states']);
const positional = args.filter((a, i) => !a.startsWith('--') && !valueFlags.has(args[i - 1]));
const target = positional[0];
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const quiet = args.includes('--quiet');
const noFallback = args.includes('--no-fallback');
const states = args.includes('--states') ? args[args.indexOf('--states') + 1].split(',').filter(Boolean) : [];
if (!target) {
  console.error('Usage: node tools/lint.mjs <html[?query]> [--json out.json] [--quiet] [--states state=a,state=b] [--no-fallback]');
  process.exit(2);
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
    // Visible text nodes outside code-like elements.
    textNodes(root) {
      const out = [];
      const w = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const el = n.parentElement;
        if (!el || !n.textContent.trim()) continue;
        if (el.closest('script, style, template, noscript, code, pre, kbd, samp, textarea, [aria-hidden="true"] title')) continue;
        if (!this.visible(el)) continue;
        out.push(n);
      }
      return out;
    },
    // Simulate an anchor jump or Shift+Tab: scroll the element to the top (scroll-padding is honored), then look for bars over it.
    coveredAtTop(el) {
      if (el.closest('dialog, [role=dialog]')) return null;
      const y = scrollY;
      el.scrollIntoView({ block: 'start' });
      const er = el.getBoundingClientRect();
      let hit = null;
      for (const b of document.querySelectorAll('body *')) {
        const s = getComputedStyle(b);
        if (s.position !== 'sticky' && s.position !== 'fixed') continue;
        if (b.contains(el) || !this.visible(b)) continue;
        const br = b.getBoundingClientRect();
        if (br.height > innerHeight * 0.5) continue;
        const ix = Math.min(er.right, br.right) - Math.max(er.left, br.left);
        const iy = Math.min(er.bottom, br.bottom) - Math.max(er.top, br.top);
        if (ix > 1 && iy > 1) { hit = this.sel(b) + ' (scrolled to top)'; break; }
      }
      scrollTo(0, y);
      return hit;
    },
    // Lines of an element's text, as word counts per rendered line.
    lines(el) {
      const lines = new Map();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const re = /\\S+/g; let m;
        while ((m = re.exec(n.textContent))) {
          range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
          const rc = range.getClientRects()[0];
          if (!rc || !rc.width) continue;
          const key = Math.round(rc.bottom / 4);
          const cur = lines.get(key) || { words: 0, chars: 0 };
          cur.words++; cur.chars += m[0].length + 1;
          lines.set(key, cur);
        }
      }
      return [...lines.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);
    },
  };
`;

async function lintOne(browser, target, outPath) {
  const report = { file: target, date: new Date().toISOString(), checks: {}, summary: {} };
  const add = (check, level, message, detail) => {
    report.checks[check] ??= { fail: [], warn: [], pass: true };
    if (level === 'fail') report.checks[check].pass = false;
    report.checks[check][level].push(detail ? { message, ...detail } : { message });
  };
  const ok = (check) => { report.checks[check] ??= { fail: [], warn: [], pass: true }; };

  async function openPage(width, scheme, reducedMotion = 'no-preference', extra = {}) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion, deviceScaleFactor: 1, ...extra });
    const page = await context.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.addScriptTag({ content: helpers });
    return { context, page };
  }

  // 1. axe-core, both schemes, both widths; then the worst-pixel overlay check on what axe could not decide.
  ok('axe'); ok('overlay');
  const seen = new Set();
  for (const scheme of ['light', 'dark']) {
    for (const width of [390, 1440]) {
      const { context, page } = await openPage(width, scheme);
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(async (tags) => {
        // eslint-disable-next-line no-undef
        const r = await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
        const slim = (list, n = 8) => list.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, n).map((x) => ({ target: x.target.join(' '), summary: (x.failureSummary || '').split('\n').slice(0, 2).join(' ') })), count: v.nodes.length }));
        return { violations: slim(r.violations), incomplete: slim(r.incomplete, 60) };
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
        if (v.id === 'color-contrast') continue; // measured below instead of left to the eye
        const key = `inc|${v.id}|${scheme}`;
        if (seen.has(key)) continue;
        seen.add(key);
        add('axe', 'warn', `needs review by eye, ${v.id}: ${v.help} (${v.count} nodes)`, { scheme, width, targets: v.nodes.slice(0, 3).map((n) => n.target) });
      }
      const cc = res.incomplete.find((v) => v.id === 'color-contrast');
      if (cc) await overlayCheck(page, cc.nodes.map((n) => n.target), scheme, width, add);
      await context.close();
    }
  }

  // 2 to 6 plus static polish and typography checks, at 390 and 1440, light scheme.
  for (const width of [390, 1440]) {
    const { context, page } = await openPage(width, 'light');
    const r = await page.evaluate(({ width, TYPE_SCALE, SPACE_SCALE, RADII, STEM }) => {
      const L = window.__lint;
      const out = { targets: [], measure: [], type: [], spacing: [], overflow: null, fluid: false, headings: [] };
      const all = [...document.body.querySelectorAll('*')].filter((el) => !el.closest('svg, head, script, style, template') || el.tagName.toLowerCase() === 'svg');

      // Targets.
      const interactive = all.filter((el) => el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [tabindex]:not([tabindex="-1"])') && L.visible(el) && !L.skipped(el, 'targets'));
      for (const el of interactive) {
        const rc = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (el.tagName === 'A' && s.display === 'inline') {
          const parentText = (el.parentElement?.textContent || '').trim().length;
          if (parentText > (el.textContent || '').trim().length + 20) continue;
        }
        let w = rc.width, h = rc.height;
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
        if (/flex|grid/.test(getComputedStyle(el).display)) continue; // a layout of separate items, not running text
        const text = el.textContent.replace(/\s+/g, ' ').trim();
        if (text.length < 60) continue;
        const counts = L.lines(el).map((l) => l.chars);
        if (counts.length < 2) continue;
        const full = counts.slice(0, -1);
        const avg = Math.round(full.reduce((a, b) => a + b, 0) / full.length);
        out.measure.push({ sel: L.sel(el), cpl: avg, widest: Math.max(...full), lines: counts.length, fontSize: parseFloat(getComputedStyle(el).fontSize) });
      }

      // Type scale.
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
        if (!TYPE_SCALE.some((v) => Math.abs(v - fs) <= 0.5)) out.type.push({ size: fs, count: sels.length, examples: sels.slice(0, 4) });
      }
      out.svgText = [];
      for (const t of document.querySelectorAll('svg text')) {
        if (L.skipped(t, 'type-scale')) continue;
        const rc = t.getBoundingClientRect();
        if (!rc.width || !t.textContent.trim()) continue;
        const ctm = t.getScreenCTM();
        const scale = ctm ? Math.hypot(ctm.a, ctm.b) : 1;
        const px = Math.round(parseFloat(getComputedStyle(t).fontSize) * scale * 10) / 10;
        if (px < 11.5) out.svgText.push({ sel: L.sel(t), text: t.textContent.trim().slice(0, 20), px });
      }
      for (const sheet of document.styleSheets) {
        try { for (const rule of sheet.cssRules) if (/font-size:\s*clamp\(/.test(rule.cssText) || /--text-[\w-]+:\s*clamp\(/.test(rule.cssText)) out.fluid = true; } catch { /* cross-origin */ }
      }

      // Spacing (computed values via Typed OM so auto margins stay "auto").
      const props = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'row-gap', 'column-gap'];
      const bad = new Map();
      for (const el of all) {
        if (el.closest('svg') || !L.visible(el) || L.skipped(el, 'spacing')) continue;
        if (el.matches('input[type=checkbox], input[type=radio], input[type=range], input[type=color]')) continue;
        const map = el.computedStyleMap();
        const cs = getComputedStyle(el);
        for (const p of props) {
          const v = map.get(p);
          if (!v || v instanceof CSSKeywordValue) continue;
          let px;
          if (v instanceof CSSUnitValue) {
            if (v.unit === 'percent') continue;
            px = v.unit === 'px' ? v.value : parseFloat(cs.getPropertyValue(p));
          } else px = parseFloat(cs.getPropertyValue(p));
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
          const rc = el.getBoundingClientRect();
          if (rc.right > doc.clientWidth + 1 || rc.left < -1) offenders.push({ sel: L.sel(el), left: Math.round(rc.left), right: Math.round(rc.right) });
        }
      }
      out.overflow = { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: offenders.slice(0, 8) };

      // Heading wrap: last line holds one word.
      for (const h of document.querySelectorAll('h1, h2, h3')) {
        if (!L.visible(h)) continue;
        const ls = L.lines(h);
        if (ls.length >= 2 && ls[ls.length - 1].words === 1) out.headings.push({ sel: L.sel(h), lines: ls.length, text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) });
      }

      // SVG or image partly covering text that it is not the background of.
      out.overlap = [];
      if (true) {
        const art = [...document.querySelectorAll('svg, img, canvas')].filter((a) => !a.parentElement.closest('svg') && L.visible(a) && !L.skipped(a, 'svg-overlap')).map((a) => ({ a, r: a.getBoundingClientRect() })).filter((x) => x.r.width > 12 && x.r.height > 12);
        const range = document.createRange();
        const reported = new Set();
        for (const n of L.textNodes()) {
          const el = n.parentElement;
          if (el.closest('svg') || L.skipped(el, 'svg-overlap')) continue;
          const er = el.getBoundingClientRect();
          if (er.width <= 1 || er.height <= 1 || getComputedStyle(el).clip !== 'auto' || getComputedStyle(el).clipPath !== 'none') continue; // visually hidden text
          range.selectNodeContents(n);
          for (const tr of range.getClientRects()) {
            if (tr.width < 2 || tr.height < 2) continue;
            for (const { a, r } of art) {
              if (a.contains(el)) continue;
              const ix = Math.min(tr.right, r.right) - Math.max(tr.left, r.left);
              const iy = Math.min(tr.bottom, r.bottom) - Math.max(tr.top, r.top);
              if (ix < 2 || iy < 2) continue;
              const contains = r.left <= tr.left + 1 && r.right >= tr.right - 1 && r.top <= tr.top + 1 && r.bottom >= tr.bottom - 1;
              if (contains) continue; // the art is the text's background: the overlay check measures it
              // Ignore art that is painted below the text's own opaque box (a card covering the art).
              const key = L.sel(el) + '|' + L.sel(a);
              if (reported.has(key)) continue;
              reported.add(key);
              out.overlap.push({ sel: L.sel(el), art: L.sel(a), text: n.textContent.trim().slice(0, 30), px: `${Math.round(ix)}x${Math.round(iy)}` });
            }
          }
        }
      }

      if (width !== 1440) return out;

      // ---- 1440-only static checks ----
      // Radius family.
      out.radius = [];
      const els = all.filter((e) => !e.closest('svg') && L.visible(e) && !L.skipped(e, 'radius'));
      const radOK = (el, px) => {
        if (RADII.some((x) => Math.abs(x - px) < 0.5)) return true;
        const rc = el.getBoundingClientRect();
        if (px >= Math.min(rc.width, rc.height) / 2 - 0.5) return true; // pill or circle
        // Nested: outer radius minus the inset to an ancestor's corner.
        let a = el.parentElement;
        for (let i = 0; a && i < 4; i++, a = a.parentElement) {
          const R = parseFloat(getComputedStyle(a).borderTopLeftRadius) || 0;
          if (!R) continue;
          const ar = a.getBoundingClientRect();
          const inset = Math.min(Math.abs(rc.left - ar.left), Math.abs(rc.top - ar.top));
          if (Math.abs(R - inset - px) <= 1) return true;
        }
        return false;
      };
      for (const el of els) {
        const s = getComputedStyle(el);
        for (const v of [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius]) {
          if (v === '0px' || v.endsWith('%')) continue;
          const px = parseFloat(v.split(' ')[0]);
          if (!radOK(el, px)) { out.radius.push({ sel: L.sel(el), value: px }); break; }
        }
      }

      // color-scheme.
      let darkRules = false;
      const walkDark = (rules) => { for (const ru of rules) { if (ru.media && /prefers-color-scheme:\s*dark/.test(ru.media.mediaText)) darkRules = true; if (ru.cssRules) walkDark(ru.cssRules); } };
      for (const s of document.styleSheets) { try { walkDark(s.cssRules); } catch { /* cross-origin */ } }
      const meta = document.querySelector('meta[name=color-scheme]');
      out.scheme = { darkRules, property: getComputedStyle(document.documentElement).colorScheme, meta: meta ? meta.content : null };

      // Typography details on visible text.
      const typo = { quotes: [], ranges: [], times: [], units: [], marker: [], faked: [] };
      const UNIT = /[\d,.]*\d[\s  ]?(mg|kg|g|ml|l|km|cm|mm|m|h|min|ms|s|oz|lb)\b/;
      for (const n of L.textNodes()) {
        const el = n.parentElement;
        if (L.skipped(el, 'typography') || el.closest('svg title, svg desc')) continue;
        const t = n.textContent;
        const snip = (i) => t.slice(Math.max(0, i - 18), i + 18).replace(/\s+/g, ' ').trim();
        const q = t.search(/['"]/);
        if (q !== -1) typo.quotes.push({ sel: L.sel(el), text: snip(q) });
        const words = t.split(/\s+/).filter((w) => !/[/@:]/.test(w)).join(' ');
        const rg = words.match(/(?<![\d.,:-])\d{1,4}(?:[.,]\d+)?\s?-\s?\d{1,4}(?:[.,]\d+)?(?![\d-])/);
        if (rg) typo.ranges.push({ sel: L.sel(el), text: rg[0] });
        const tm = words.match(/\d+\s?x\s?\d+/);
        if (tm) typo.times.push({ sel: L.sel(el), text: tm[0] });
        if (getComputedStyle(el).textTransform === 'uppercase') {
          const u = t.match(UNIT);
          if (u) typo.units.push({ sel: L.sel(el), text: u[0] });
        }
      }
      for (const li of document.querySelectorAll('li')) {
        if (!L.visible(li) || L.skipped(li, 'typography')) continue;
        const s = getComputedStyle(li);
        if (s.display !== 'list-item' || s.listStyleType === 'none') continue;
        const mk = getComputedStyle(li, '::marker').content;
        if (mk === 'none' || mk === '""') continue;
        const first = li.textContent.trim();
        const firstEl = li.firstElementChild;
        if (/^(\d{1,3}|[ivxIVX]{1,4})[.)]?(\s|$)/.test(first) || (firstEl && /^\d{1,3}[.)]?$/.test(firstEl.textContent.trim()))) typo.marker.push({ sel: L.sel(li), text: first.slice(0, 20) });
      }
      // Faked bold or italic: only for families the page loads as web fonts (system fonts cannot be inspected).
      const faces = new Map();
      for (const f of document.fonts) {
        const fam = f.family.replace(/^["']|["']$/g, '');
        if (!faces.has(fam)) faces.set(fam, []);
        const ws = String(f.weight).split(/\s+/).map(Number);
        faces.get(fam).push({ style: f.style, min: ws[0], max: ws[ws.length - 1] ?? ws[0], status: f.status });
      }
      const fakedSeen = new Set();
      for (const n of L.textNodes()) {
        const el = n.parentElement;
        const s = getComputedStyle(el);
        const fam = s.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
        const list = faces.get(fam);
        if (!list) continue;
        const w = parseInt(s.fontWeight, 10);
        const italic = s.fontStyle !== 'normal';
        const styleFaces = list.filter((f) => (italic ? f.style !== 'normal' : f.style === 'normal'));
        let why = null;
        if (italic && !styleFaces.length) why = 'italic with no italic face';
        else if (styleFaces.length && w >= 600 && !styleFaces.some((f) => f.max >= w - 100)) why = `weight ${w} with no face above ${Math.max(...styleFaces.map((f) => f.max))}`;
        if (!why) continue;
        const key = fam + why;
        if (fakedSeen.has(key)) continue;
        fakedSeen.add(key);
        typo.faked.push({ sel: L.sel(el), text: `${fam}: ${why}${s.fontSynthesis === 'none' ? ' (font-synthesis: none, so it renders as the wrong style)' : ' (synthesized by the browser)'}` });
      }
      out.typo = typo;

      // Tabular figures where numbers align or change.
      out.tab = [];
      for (const el of document.querySelectorAll('td, th, [class*=price], [class*=kpi] dd, [class*=value], .num, time, [data-num]')) {
        if (!L.visible(el) || L.skipped(el, 'tabular') || !/\d/.test(el.textContent)) continue;
        const chars = el.textContent.replace(/\s+/g, '');
        if ((chars.match(/\d/g) || []).length / chars.length < 0.3) continue; // a label that mentions a number, not a figure
        const s = getComputedStyle(el);
        if (!/tabular-nums/.test(s.fontVariantNumeric) && !/"tnum"(?! 0)/.test(s.fontFeatureSettings)) out.tab.push(L.sel(el));
      }

      // Shadows (light).
      out.shadows = {};
      out.shadowBad = [];
      for (const el of els) {
        const sh = getComputedStyle(el).boxShadow;
        if (!sh || sh === 'none') continue;
        const layers = sh.split(/,(?![^(]*\))/);
        const real = layers.some((l) => !/inset/.test(l) && !/^\s*0px 0px 0px/.test(l.replace(/^\s*(rgba?|oklch|color)\([^)]*\)\s*/, '')));
        if (real) out.shadows[sh] = (out.shadows[sh] || 0) + 1; // rings and inset highlights are edges, not elevation
        for (const layer of sh.split(/,(?![^(]*\))/)) {
          if (/inset/.test(layer)) continue;
          const am = layer.match(/rgba?\(([^)]*)\)/);
          let alpha = 1;
          if (am) { const parts = am[1].split(/[\s,/]+/).filter(Boolean); alpha = parts.length >= 4 ? parseFloat(parts[3]) : 1; }
          const nums = (layer.replace(/rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)/g, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
          const [x = 0, y = 0, blur = 0] = nums;
          if (blur === 0 && x === 0 && y === 0) continue; // ring
          if (y < 0) out.shadowBad.push({ sel: L.sel(el), why: `shadow falls up (y ${y})` });
          else if (alpha > 0.25) out.shadowBad.push({ sel: L.sel(el), why: `shadow alpha ${alpha} over 0.25` });
        }
      }

      // Icon stroke against the adjacent Inter text stem.
      out.icon = [];
      for (const svg of document.querySelectorAll('svg')) {
        if (!L.visible(svg)) continue;
        const br = svg.getBoundingClientRect();
        if (br.width > 28 || br.height > 28 || br.height < 10) continue;
        const host = svg.parentElement; if (!host) continue;
        const hs = getComputedStyle(host);
        if (!/Inter/i.test(hs.fontFamily) || !host.textContent.trim()) continue;
        const shapes = [...svg.querySelectorAll('path, line, polyline, circle, rect, polygon')].filter((s) => { const c = getComputedStyle(s); return c.stroke !== 'none' && parseFloat(c.strokeWidth) > 0 && c.fill === 'none'; });
        if (!shapes.length) continue;
        const ns = getComputedStyle(shapes[0]);
        const ctm = shapes[0].getScreenCTM();
        const scale = ns.vectorEffect === 'non-scaling-stroke' ? 1 : (ctm ? Math.hypot(ctm.a, ctm.b) : 1);
        const stroke = Math.round(parseFloat(ns.strokeWidth) * scale * 100) / 100;
        const w = Math.min(800, Math.max(300, Math.round(parseInt(hs.fontWeight, 10) / 100) * 100));
        const stem = Math.round(parseFloat(hs.fontSize) * (STEM[w] || 0.1) * 100) / 100;
        if (Math.abs(stroke - stem) > 0.35) out.icon.push({ sel: L.sel(svg), stroke, stem, text: `${hs.fontSize} ${hs.fontWeight}` });
      }

      // Weight.
      let svgBytes = 0;
      for (const svg of document.querySelectorAll('svg')) if (!svg.parentElement.closest('svg')) svgBytes += svg.outerHTML.length;
      out.weight = { html: document.documentElement.outerHTML.length, svg: svgBytes };
      return out;
    }, { width, TYPE_SCALE, SPACE_SCALE, RADII, STEM });

    ok('targets');
    for (const t of r.targets) {
      if (t.w < 24 || t.h < 24) add('targets', 'fail', `target under 24x24 at ${width}px`, t);
      else if (width === 390 && (t.w < 44 || t.h < 44)) add('targets', 'warn', 'touch target under 44x44 at 390px', t);
    }
    ok('measure');
    for (const m of r.measure) {
      if (m.cpl > 75) add('measure', 'fail', `line length ${m.cpl} characters at ${width}px (max 75)`, m);
      else if (width === 1440 && m.cpl < 45 && m.lines >= 3) add('measure', 'fail', `line length ${m.cpl} characters at 1440px (min 45)`, m);
      else if (width === 390 && m.cpl < 30 && m.lines >= 3) add('measure', 'warn', `short line length ${m.cpl} characters at 390px`, m);
    }
    ok('type-scale');
    for (const t of r.type) {
      if (t.size >= 39 && r.fluid) add('type-scale', 'warn', `fluid display size ${t.size}px at ${width}px (clamp() present)`, t);
      else add('type-scale', 'fail', `font size ${t.size}px off the type scale at ${width}px`, t);
    }
    for (const t of r.svgText) add('type-scale', 'fail', `SVG text renders at ${t.px}px at ${width}px (min 12)`, t);
    ok('spacing');
    for (const s of r.spacing) add('spacing', 'fail', `${s.value}px off the spacing scale at ${width}px`, s);
    ok('overflow');
    if (width === 390 && r.overflow.scrollWidth > r.overflow.clientWidth + 1) add('overflow', 'fail', `horizontal overflow at 390px: page is ${r.overflow.scrollWidth}px wide`, { offenders: r.overflow.offenders });
    ok('heading-wrap');
    for (const h of r.headings) add('heading-wrap', 'warn', `heading ends on a one-word line at ${width}px ("${h.text}")`, h);
    ok('svg-overlap');
    for (const o of r.overlap) add('svg-overlap', 'warn', `text "${o.text}" partly covered by ${o.art} (${o.px}px) at ${width}px`, { sel: o.sel });

    if (width === 1440) {
      ok('radius');
      for (const x of r.radius) add('radius', 'fail', `radius ${x.value}px off the family (0 4 8 12 16 full, or outer minus inset)`, x);
      ok('color-scheme');
      if (r.scheme.darkRules && r.scheme.property === 'normal' && !r.scheme.meta) add('color-scheme', 'fail', 'page has dark styles but no color-scheme (scrollbars and native controls stay light)');
      ok('typography');
      const T = r.typo;
      for (const x of T.quotes.slice(0, 10)) add('typography', 'warn', `straight quote or apostrophe: "${x.text}" (use ’ ‘ “ ”)`, { sel: x.sel });
      for (const x of T.ranges) add('typography', 'warn', `hyphen in a number range "${x.text}" (use an en dash or "to")`, { sel: x.sel });
      for (const x of T.times) add('typography', 'warn', `"x" between numbers "${x.text}" (use ×)`, { sel: x.sel });
      for (const x of T.units) add('typography', 'warn', `unit uppercased by text-transform: "${x.text}" (wrap units in text-transform: none)`, { sel: x.sel });
      for (const x of T.marker) add('typography', 'warn', `list shows its marker and a typed numeral ("${x.text}"); set list-style: none`, { sel: x.sel });
      for (const x of T.faked) add('typography', 'warn', `faked style: ${x.text}`, { sel: x.sel });
      ok('tabular');
      if (r.tab.length) add('tabular', 'warn', `${r.tab.length} numeric elements without tabular figures`, { examples: r.tab.slice(0, 5) });
      ok('shadows');
      const distinct = Object.keys(r.shadows).length;
      if (distinct > 5) add('shadows', 'warn', `${distinct} distinct drop shadows, rings and inset highlights not counted (FOUNDATIONS gives 5)`);
      for (const x of r.shadowBad.slice(0, 6)) add('shadows', 'warn', x.why, { sel: x.sel });
      ok('icon-stroke');
      for (const i of r.icon) add('icon-stroke', 'warn', `icon stroke ${i.stroke}px vs text stem ${i.stem}px (${i.text})`, { sel: i.sel });
      ok('weight');
      if (r.weight.svg > 150_000) add('weight', 'warn', `inline SVG is ${Math.round(r.weight.svg / 1000)} KB (over 150 KB); reuse with <use> or simplify paths`);
      if (r.weight.html > 1_500_000) add('weight', 'warn', `page HTML is ${Math.round(r.weight.html / 1000)} KB (over 1.5 MB)`);
      report.summary.weightKB = { html: Math.round(r.weight.html / 1000), svg: Math.round(r.weight.svg / 1000) };
    }
    await context.close();
  }

  // Dark: drop shadows on dark surfaces.
  {
    const { context, page } = await openPage(1440, 'dark');
    const heavy = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!window.__lint.visible(el)) continue;
        const sh = getComputedStyle(el).boxShadow;
        if (!sh || sh === 'none') continue;
        for (const layer of sh.split(/,(?![^(]*\))/)) {
          if (/inset/.test(layer)) continue;
          const nums = (layer.replace(/rgba?\([^)]*\)|oklch\([^)]*\)/g, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
          if ((nums[2] || 0) > 4) { out.push(window.__lint.sel(el)); break; }
        }
      }
      return out;
    });
    if (heavy.length) add('shadows', 'warn', `${heavy.length} drop shadows in the dark scheme (lift with a lighter surface, ring and highlight)`, { examples: heavy.slice(0, 4) });
    await context.close();
  }

  // Focus visible, focus shape, sticky bars over focus: tab through the page.
  ok('focus'); ok('focus-shape'); ok('sticky-focus');
  {
    const { context, page } = await openPage(1440, 'light', 'reduce');
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    const styleOf = `(el) => {
      const one = (e) => { const s = getComputedStyle(e); return { outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 ? s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor : 'none', outlineWidth: parseFloat(s.outlineWidth) || 0, shadow: s.boxShadow, border: s.borderColor, bg: s.backgroundColor, deco: s.textDecorationLine + s.textDecorationThickness + s.textDecorationColor }; };
      const r = one(el);
      const anc = []; let a = el.parentElement;
      for (let i = 0; a && a !== document.body && i < 4; i++, a = a.parentElement) { const o = one(a); anc.push(o.outline, o.shadow, o.border, o.bg); }
      r.ancestors = JSON.stringify(anc);
      const s = getComputedStyle(el);
      const paints = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || parseFloat(s.borderTopWidth) > 0 || (s.boxShadow !== 'none');
      r.shape = { radius: s.borderTopLeftRadius + ' ' + s.borderBottomRightRadius, border: s.borderTopWidth + ' ' + s.borderLeftWidth, pad: s.paddingTop + ' ' + s.paddingLeft, weight: s.fontWeight, w: el.offsetWidth, h: el.offsetHeight, paints };
      return r;
    }`;
    const count = await page.evaluate(() => document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]').length);
    const seenEls = new Set();
    for (let i = 0; i < Math.min(count + 2, 200); i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(`(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const f = (${styleOf})(el);
        el.dataset.lintFocusIndex = el.dataset.lintFocusIndex || String(Math.random());
        // Sticky or fixed bars that cover the focused element.
        const er = el.getBoundingClientRect();
        let covered = null;
        for (const b of document.querySelectorAll('body *')) {
          const s = getComputedStyle(b);
          if (s.position !== 'sticky' && s.position !== 'fixed') continue;
          if (b.contains(el) || !window.__lint.visible(b)) continue;
          if (el.closest('dialog, [role=dialog]')) continue;
          const br = b.getBoundingClientRect();
          if (br.height > window.innerHeight * 0.5) continue; // side rails and drawers, not bars
          const ix = Math.min(er.right, br.right) - Math.max(er.left, br.left);
          const iy = Math.min(er.bottom, br.bottom) - Math.max(er.top, br.top);
          if (ix > 1 && iy > 1) { covered = window.__lint.sel(b); break; }
        }
        return { sel: window.__lint.sel(el), key: el.dataset.lintFocusIndex, f, skipped: window.__lint.skipped(el, 'focus'), covered: covered || window.__lint.coveredAtTop(el) };
      })()`);
      if (!info) continue;
      if (seenEls.has(info.key)) break;
      seenEls.add(info.key);
      const unf = await page.evaluate(`(() => {
        const el = document.querySelector('[data-lint-focus-index="${info.key}"]');
        el.blur();
        const u = (${styleOf})(el);
        el.focus({ focusVisible: true });
        return u;
      })()`);
      if (info.covered) add('sticky-focus', 'warn', `focused element sits under ${info.covered} (WCAG 2.4.11); add scroll-padding-top`, { target: info.sel });
      if (info.skipped) continue;
      const f = info.f;
      const visible = (f.outline !== 'none' && f.outlineWidth >= 1) || f.shadow !== unf.shadow || f.border !== unf.border || f.bg !== unf.bg || f.deco !== unf.deco || f.ancestors !== unf.ancestors;
      if (!visible) add('focus', 'fail', 'no visible focus style', { target: info.sel });
      else if (f.outline !== 'none' && f.outlineWidth < 2 && f.shadow === unf.shadow) add('focus', 'warn', `thin focus outline (${f.outline}); FOUNDATIONS default is 2px`, { target: info.sel });
      // Focus shape: a painted control keeps its radius, border width, padding, weight and size.
      const a = unf.shape, b = f.shape;
      const diffs = [];
      if (a.paints && b.paints && a.radius !== b.radius) diffs.push(`radius ${a.radius} to ${b.radius}`);
      if (a.border !== b.border) diffs.push(`border ${a.border} to ${b.border}`);
      if (a.pad !== b.pad) diffs.push(`padding ${a.pad} to ${b.pad}`);
      if (a.weight !== b.weight) diffs.push(`weight ${a.weight} to ${b.weight}`);
      if (Math.abs(a.w - b.w) > 0.5 || Math.abs(a.h - b.h) > 0.5) diffs.push(`size ${a.w}x${a.h} to ${b.w}x${b.h}`);
      if (diffs.length) add('focus-shape', 'fail', `focus changes ${diffs.join(', ')}`, { target: info.sel });
    }
    report.summary.focusables = seenEls.size;
    await context.close();
  }

  // State shift: hover must not change a control's size or border.
  ok('state-shift');
  {
    const { context, page } = await openPage(1440, 'light', 'reduce');
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    const n = await page.evaluate(() => {
      const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])')].filter((e) => window.__lint.visible(e));
      els.forEach((e, i) => e.setAttribute('data-lint-hover', i));
      return Math.min(els.length, 150);
    });
    const measure = (i) => page.evaluate((i) => { const el = document.querySelector(`[data-lint-hover="${i}"]`); const s = getComputedStyle(el); return { w: el.offsetWidth, h: el.offsetHeight, border: s.borderTopWidth + ' ' + s.borderLeftWidth, sel: window.__lint.sel(el) }; }, i);
    for (let i = 0; i < n; i++) {
      const before = await measure(i);
      try {
        await page.locator(`[data-lint-hover="${i}"]`).hover({ timeout: 800 });
        const hovered = await measure(i);
        if (Math.abs(before.w - hovered.w) > 0.5 || Math.abs(before.h - hovered.h) > 0.5 || before.border !== hovered.border) add('state-shift', 'fail', `hover changes layout (${before.w}x${before.h} to ${hovered.w}x${hovered.h}, border ${before.border} to ${hovered.border})`, { target: before.sel });
        await page.mouse.move(0, 0);
      } catch { /* not hoverable: covered, off screen or inert */ }
    }
    await context.close();
  }

  // Fallback reflow: remove web font faces (url() sources), keep local metric fallbacks, compare section tops.
  if (!noFallback) {
    ok('fallback');
    for (const width of [390, 1440]) {
      const { context, page } = await openPage(width, 'light');
      const res = await page.evaluate(async () => {
        const pick = () => [...document.querySelectorAll('header, main > *, section, footer, h1, h2')].filter((e) => window.__lint.visible(e)).map((e) => ({ sel: window.__lint.sel(e), top: e.getBoundingClientRect().top + scrollY }));
        let removed = 0;
        const before = pick();
        const docH = document.documentElement.scrollHeight;
        for (const sheet of document.styleSheets) {
          let rules; try { rules = sheet.cssRules; } catch { continue; }
          for (let i = rules.length - 1; i >= 0; i--) {
            if (rules[i] instanceof CSSFontFaceRule && /url\(/.test(rules[i].style.getPropertyValue('src'))) { sheet.deleteRule(i); removed++; }
          }
        }
        if (!removed) return null;
        for (const f of [...document.fonts]) if (f.status === 'loaded' && !/local/.test(String(f.family))) { /* faces from deleted rules drop out of the set on their own */ }
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const after = pick();
        let worst = { shift: 0 };
        before.forEach((b, i) => { const a = after[i]; if (a && Math.abs(a.top - b.top) > Math.abs(worst.shift)) worst = { sel: b.sel, shift: Math.round(a.top - b.top) }; });
        return { removed, worst, docShift: document.documentElement.scrollHeight - docH };
      });
      if (res) {
        report.summary[`fallbackShift${width}`] = res.worst.shift;
        if (Math.abs(res.worst.shift) > 8) add('fallback', 'warn', `layout moves ${res.worst.shift}px at ${width}px when the web fonts fail (worst: ${res.worst.sel}); add metric fallbacks (size-adjust, ascent-override)`, res.worst);
      }
      await context.close();
    }
  }

  // Reduced motion.
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
        if (/prefers-reduced-motion/.test(document.documentElement.innerHTML)) mediaRule = true;
        return { anims, trans, mediaRule };
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

  // Summary and output.
  let fails = 0, warns = 0;
  for (const [name, c] of Object.entries(report.checks)) {
    fails += c.fail.length; warns += c.warn.length;
    report.summary[name] = c.pass ? (c.warn.length ? `pass (${c.warn.length} warn)` : 'pass') : `FAIL (${c.fail.length})`;
  }
  report.summary.result = fails ? 'FAIL' : 'PASS';
  report.summary.fails = fails;
  report.summary.warns = warns;
  if (outPath) fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (!quiet) {
    console.log(`\nFundamentals lint: ${path.basename(target)}  ->  ${report.summary.result} (${fails} fail, ${warns} warn)\n`);
    for (const [name, c] of Object.entries(report.checks)) {
      console.log(`  ${c.pass ? 'pass' : 'FAIL'}  ${name}${c.warn.length ? `  (${c.warn.length} warn)` : ''}`);
      const where = (f) => (f.target ? '  [' + f.target + ']' : f.sel ? '  [' + f.sel + ']' : f.examples ? '  [' + f.examples.join(', ') + ']' : '');
      for (const f of c.fail.slice(0, 12)) console.log(`        x ${f.message}${where(f)}${f.why ? '  ' + f.why : ''}`);
      if (c.fail.length > 12) console.log(`        ... ${c.fail.length - 12} more`);
      for (const w of c.warn.slice(0, 5)) console.log(`        ! ${w.message}${where(w)}`);
      if (c.warn.length > 5) console.log(`        ... ${c.warn.length - 5} more warnings`);
    }
    if (outPath) console.log(`\n  JSON: ${outPath}`);
  }
  return fails;
}

// Worst-pixel contrast for text that axe could not decide (WCAG F83, G18), measured in the page:
// record each text box and color, hide all text, screenshot, decode in a canvas, take the minimum ratio.
async function overlayCheck(page, targets, scheme, width, add) {
  const items = await page.evaluate((targets) => {
    const toRGB = (c) => (c.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
    const out = [];
    for (const t of targets) {
      let el; try { el = document.querySelector(t); } catch { continue; }
      if (!el || window.__lint.skipped(el, 'overlay')) continue;
      if (el.closest('[disabled], [aria-disabled="true"]')) continue; // exempt from 1.4.3
      const s = getComputedStyle(el);
      const isSvgText = el instanceof SVGElement;
      const rgb = toRGB(isSvgText ? s.fill : s.color);
      if (isSvgText && !/^rgb/.test(s.fill)) continue; // gradient or pattern fill: judged by eye
      if (rgb.length === 4 && rgb[3] === 0) continue;
      const size = parseFloat(s.fontSize);
      const bold = parseInt(s.fontWeight, 10) >= 700;
      const min = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
      const rects = [];
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.textContent.trim() || n.parentElement !== el) continue;
        range.selectNodeContents(n);
        // Clip to scrolling or clipping ancestors: text scrolled out of its region is not on screen.
        let clip = { l: -Infinity, t: -Infinity, r: Infinity, b: Infinity };
        for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
            const ar = a.getBoundingClientRect();
            clip = { l: Math.max(clip.l, ar.left), t: Math.max(clip.t, ar.top), r: Math.min(clip.r, ar.right), b: Math.min(clip.b, ar.bottom) };
          }
        }
        for (const b of range.getClientRects()) {
          const l = Math.max(b.left, clip.l), t = Math.max(b.top, clip.t), r = Math.min(b.right, clip.r), btm = Math.min(b.bottom, clip.b);
          if (r - l >= 2 && btm - t >= 2) rects.push({ x: l + scrollX, y: t + scrollY, w: r - l, h: btm - t });
        }
      }
      if (rects.length) out.push({ target: t, rgb: rgb.slice(0, 3), min, rects: rects.slice(0, 6), text: el.textContent.trim().slice(0, 30) });
    }
    return out;
  }, targets);
  if (!items.length) return;
  const style = await page.addStyleTag({ content: 'svg text, svg tspan { fill: transparent !important; stroke: transparent !important; } *, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; caret-color: transparent !important; }' });
  const png = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await style.evaluate((n) => n.remove());
  const results = await page.evaluate(async ({ b64, items }) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return items.map((it) => {
      const lt = lum(...it.rgb);
      let worst = 99;
      for (const r of it.rects) {
        // Inset by 1px so anti-aliased edges of neighbouring boxes do not count.
        const x = Math.max(0, Math.round(r.x) + 1), y = Math.max(0, Math.round(r.y) + 1);
        const w = Math.min(c.width - x, Math.round(r.w) - 2), h = Math.min(c.height - y, Math.round(r.h) - 2);
        if (w < 1 || h < 1) continue;
        const d = ctx.getImageData(x, y, w, h).data;
        for (let i = 0; i < d.length; i += 4) {
          const l = lum(d[i], d[i + 1], d[i + 2]);
          const ratio = (Math.max(l, lt) + 0.05) / (Math.min(l, lt) + 0.05);
          if (ratio < worst) worst = ratio;
        }
      }
      return { target: it.target, text: it.text, min: it.min, worst: Math.round(worst * 100) / 100 };
    });
  }, { b64: png.toString('base64'), items });
  for (const r of results) {
    if (r.worst === 99) continue;
    if (r.worst < r.min) add('overlay', 'fail', `text over art "${r.text}": worst pixel ${r.worst}:1 (min ${r.min}) in ${scheme} at ${width}px`, { target: r.target, scheme, width });
  }
}

// Run: the target, then each --states variant.
const browser = await launch();
let total = 0;
try {
  const targets = [target, ...states.map((s) => `${target}${target.includes('?') ? '&' : '?'}${s}`)];
  for (const t of targets) {
    let outPath = null;
    if (!/^https?:/.test(t)) {
      if (jsonOut && targets.length === 1) outPath = jsonOut;
      else {
        const { file, slug } = splitTarget(t);
        outPath = file.replace(/\.html?$/, '') + (slug ? '.' + slug : '') + '.lint.json';
      }
    }
    total += await lintOne(browser, t, outPath);
  }
} finally {
  await browser.close();
}
process.exit(total ? 1 : 0);
