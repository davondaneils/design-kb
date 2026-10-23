#!/usr/bin/env node
// Fundamentals lint: the automated half of the fundamentals checklist in kb/FOUNDATIONS.md (v0.4.5).
//
// Usage:
//   node tools/lint.mjs <html[?query]> [--json out.json] [--out-dir dir] [--quiet] [--states state=a,state=b]
//                       [--widths 390,768,1024,1440] [--ticks 3] [--tick-ms 61000] [--no-fallback] [--no-truth]
//
//   --states   also lint each query variant of the page (one report per variant): page.html?state=a, ...
//   --json     JSON path (single target only). Default: <page>.lint.json, or <page>.<query-slug>.lint.json
//   --out-dir  write the JSON reports into this folder instead of beside the page
//   --widths   widths for the layout checks below (default 390,768,1024,1440: tablet collisions are invisible
//              at 390 and 1440, round 3 critic)
//   --ticks    live updates the truth check drives (fake clock advanced by --tick-ms each time); 0 skips them
//   --canvas   fixed canvas WxH (posters, social images, OG cards), or data-canvas="1080x1350" on any element of the
//              page. Every check runs at that one size (viewport W x H); measure, type-scale, heading-wrap, nav-parity
//              and the 390 overflow and touch checks are skipped; canvas-text replaces type-scale. --canvas-view N
//              (data-canvas-view) sets the width the canvas is seen at (default 390, a phone feed); --print WxH in mm
//              (data-canvas-print) judges text in printed points, --distance CM (data-canvas-distance, default 100)
//   canvas-text  (canvas mode) text seen under 14 CSS px in the feed fails (40px on a 1080 canvas); in print, under 7pt
//              fails and under 7pt x distance / 40cm warns. Sources in canvasText() below
//
// Rotated, mirrored and vertical text (rotate, transform, scale -1, writing-mode) is exempt from the geometry checks
// (measure, squash, run-together, word-break, grid-edge, heading-wrap, svg-overlap, double-space): its client rects
// are the turned box, not the lines. Contrast, overlay, canvas-text and focus still run on it. A skip link parked off
// screen or clipped is not counted by primary.
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
//   motion       if the page animates, prefers-reduced-motion removes movement: under reduce, no animation whose
//                keyframes move, scale, rotate or resize anything; opacity and color animations up to 150ms are allowed
//                (FOUNDATIONS Motion and accessibility.md), longer ones warn
//   skip-link    when focusable elements come before <main>, the first one is a same-page link to main (or a landmark
//                that holds it) and it is visible when focused (WCAG 2.4.1)
//   icons        small icons (10 to 28px inline SVG) use one stroke cap and one join across the page, and no icon
//                hard-codes a fill or stroke color (ported from skills/design-graphic/assets/icon_audit.mjs).
//                Logos are not icons: SVG inside an element whose class or id names logo, brand or wordmark is skipped
//   occlusion, squash, sticky-header, overflow, run-together, word-break, grid-edge   layout at every --widths
//                width: controls covered by other elements, fixed-size flex children squashed, sticky top bars
//                taller than scroll-padding-top, text in separate boxes touching ("Sep 30$2.62"), words broken
//                inside controls and cells, sibling columns off a shared edge (tools/lint-layout.mjs)
//   double-space a flex or grid gap plus a no-break space at an item's edge, or two uncollapsible spaces in a row
//                ("Invite&nbsp;&nbsp;&nbsp;a teammate"; tools/lint-layout.mjs)
//   undefined-var  a var(--name) with no fallback whose property is declared nowhere: the declaration paints nothing
//                (the sheet's empty warning meter, round 4 critic; tools/lint-tokens.mjs)
//   state-layer  hover and pressed backgrounds use --state-hover and --state-pressed (8 and 10 percent) or a
//                --color-*-hover token, never a raw color-mix() or color (tools/lint-tokens.mjs)
//   primitive-in-component  a declaration outside a :root or theme block reads a color primitive
//                var(--color-{hue}-{n}); components use semantic tokens only (round 4.1 critic; tools/lint-tokens.mjs)
//   error-icon   a field error ([role=alert], an aria-errormessage target, or the aria-describedby target of an
//                aria-invalid control) carries an icon or a non-color marker besides its text (tools/lint-tokens.mjs)
//   hidden-content  a control whose text is transparent and that paints nothing inside (tools/lint-layout.mjs)
//   state-sheet  a state sheet shows a disabled, a busy and (with fields) an invalid control
//   truth        numbers stay true across states and live updates: repeated numbers change together, empty
//                states carry no numbers from the default state, caveated or stopped sources do not tick, and
//                the data-attribute contract (data-sum-of, data-derived-from, data-monotonic, data-source,
//                data-data="none") holds after each update (tools/lint-truth.mjs)
//   proportion   share columns do not sum to 100 over a subset; bars beside a percent are on a 0 to 100 scale
//   primary      at most one filled call to action per screen height at 390 and 1440, counting only the open modal
//                when one is open (FOUNDATIONS item 12; ported from design-conversion conversion-audit.mjs).
//                State sheets are exempt: <html data-lint-page="state-sheet"> or a <title> containing "state sheet"
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
//   sticky-focus a focused element sits under a sticky or fixed bar that paints above it (WCAG 2.4.11)
//   nav-parity   a header or nav destination shown at 1440 has no route at 390 (not visible, not in a menu
//                disclosure, not linked anywhere else on the page)
//   icons (warn) icons drawn through <use>: colors are read from the referenced symbol, caps cannot be confirmed
//
// Content behind an open modal dialog (or under [inert]) is skipped by every per-element check: it is inactive
// (WCAG 1.4.3 exempts it) and cannot be reached. Every page waits up to 2s for finite entrance animations to finish
// before anything is measured, so a dialog mid-entrance is not measured at 96 percent scale.

// Exit code: 0 when no check fails, 1 when any check fails, 2 on usage error.
// Opt out for one element (use sparingly, explain in the test report):
//   data-lint-skip="canvas-text measure spacing type-scale targets focus overlay radius typography svg-overlap tabular icons primary
//                   occlusion squash sticky-header run-together word-break grid-edge hidden-content double-space"
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { launch, toUrl, splitTarget, readCanvas } from './browser.mjs';
import { layoutChecks, reportLayout, pageChecks } from './lint-layout.mjs';
import { truthPass } from './lint-truth.mjs';
import { tokenChecks, errorIconChecks } from './lint-tokens.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const TYPE_SCALE = [12, 14, 16, 20, 25, 31, 39, 49, 61];
const SPACE_SCALE = [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
const RADII = [0, 4, 8, 12, 16];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
// Inter stem width as a share of font size, measured by design-polish (kb/research/polish/scripts/measure.mjs).
const STEM = { 300: 0.07, 400: 0.088, 500: 0.107, 600: 0.127, 700: 0.147, 800: 0.165 };

const args = process.argv.slice(2);
const valueFlags = new Set(['--json', '--states', '--widths', '--ticks', '--tick-ms', '--out-dir', '--canvas', '--canvas-view', '--print', '--distance']);
const positional = args.filter((a, i) => !a.startsWith('--') && !valueFlags.has(args[i - 1]));
const target = positional[0];
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const quiet = args.includes('--quiet');
const noFallback = args.includes('--no-fallback');
const states = args.includes('--states') ? args[args.indexOf('--states') + 1].split(',').filter(Boolean) : [];
const flag = (name, dflt) => (args.includes(name) ? args[args.indexOf(name) + 1] : dflt);
const layoutWidths = flag('--widths', '390,768,1024,1440').split(',').map(Number).filter((n) => n > 0);
const ticks = Number(flag('--ticks', '3'));
const tickMs = Number(flag('--tick-ms', '61000'));
const outDir = flag('--out-dir', null);
const noTruth = args.includes('--no-truth');
const canvasFlags = { canvas: flag('--canvas', null), view: flag('--canvas-view', null), print: flag('--print', null), distance: flag('--distance', null) };
if (!target) {
  console.error('Usage: node tools/lint.mjs <html[?query]> [--json out.json] [--quiet] [--states state=a,state=b] [--no-fallback] [--canvas 1080x1350 [--canvas-view 390] [--print 420x594 --distance 100]]');
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
      if (host && host.getAttribute('data-lint-skip').split(/\\s+/).includes(check)) return true;
      // Rotated, mirrored or vertical text: its client rects are the axis-aligned box of the turned text, so line
      // counts, widths and edges read wrong (the held-out poster's -1.2deg sheet reported 9 characters per line on
      // one-line text). Geometry checks skip it; contrast, overlay, canvas-text and focus still run.
      if (this.GEOMETRY.includes(check) && this.transformed(el)) return true;
      return false;
    },
    GEOMETRY: ['measure', 'squash', 'run-together', 'word-break', 'grid-edge', 'heading-wrap', 'svg-overlap', 'double-space'],
    // 'rotated', 'mirrored' or 'vertical' when the element or an ancestor turns or flips its text, else null.
    transformed(el) {
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.rotate && s.rotate !== 'none' && parseFloat(s.rotate.trim().split(/\\s+/).pop())) return 'rotated';
        if (s.scale && s.scale !== 'none' && s.scale.split(/\\s+/).map(parseFloat).some((v) => v < 0)) return 'mirrored';
        if (s.transform && s.transform !== 'none') {
          const m = new DOMMatrixReadOnly(s.transform);
          if (Math.abs(m.b) > 1e-3 || Math.abs(m.c) > 1e-3) return 'rotated';
          if (m.a < 0 || m.d < 0) return 'mirrored';
        }
        if (/vertical|sideways/.test(s.writingMode)) return 'vertical';
      }
      return null;
    },
    // The open modal dialog, if any: native dialog shown with showModal(), or a visible [aria-modal=true] element.
    modal() {
      for (const d of document.querySelectorAll('dialog[open]')) { try { if (d.matches(':modal')) return d; } catch { /* old engines */ } }
      return [...document.querySelectorAll('[aria-modal="true"]')].find((d) => this.visible(d)) || null;
    },
    // Inactive content: behind an open modal, or inside [inert]. Exempt from contrast (WCAG 1.4.3) and unreachable.
    inactive(el) {
      if (el.closest('[inert]')) return true;
      const m = this.modal();
      return !!m && !m.contains(el);
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
    // Does bar b paint above el where their boxes intersect? Sample the middle of the intersection with
    // elementsFromPoint (stacking-aware), so a skip link with a higher z-index over a sticky header is not "under" it.
    paintsOver(b, el) {
      const er = el.getBoundingClientRect(), br = b.getBoundingClientRect();
      const l = Math.max(er.left, br.left, 0), r = Math.min(er.right, br.right, innerWidth - 1);
      const t = Math.max(er.top, br.top, 0), btm = Math.min(er.bottom, br.bottom, innerHeight - 1);
      if (r - l <= 1 || btm - t <= 1) return false;
      for (const [x, y] of [[(l + r) / 2, (t + btm) / 2], [l + 1, t + 1], [r - 1, btm - 1]]) {
        for (const hit of document.elementsFromPoint(x, y)) {
          if (hit === el || el.contains(hit) || hit.contains(el)) break;
          if (b === hit || b.contains(hit)) return true;
        }
      }
      return false;
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
        if (ix > 1 && iy > 1 && this.paintsOver(b, el)) { hit = this.sel(b) + ' (scrolled to top)'; break; }
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

// Wait for finite animations (entrances, reveals) to finish, capped at 2s, so nothing is measured mid-transition.
async function settle(page) {
  await page.evaluate(() => Promise.race([
    Promise.all(document.getAnimations().filter((a) => { const t = a.effect && a.effect.getComputedTiming(); return t && Number.isFinite(t.endTime); }).map((a) => a.finished.catch(() => null))),
    new Promise((r) => setTimeout(r, 2000)),
  ])).catch(() => null);
}

// Canvas text: the size each run of text is SEEN at, not its canvas px.
//   Feed (default): seen px = canvas px x view / canvas width. Floor 14 CSS px, the foundation's smallest readable step
//   (--text-sm; design-graphic 05: 39 to 42px on a 1080 canvas shown at about 390px wide). A 1080 post is shown about
//   360 to 430px wide in a phone feed; Instagram feed sizes 1080x1080 and 1080x1350 (design-graphic 05 [S5]).
//   Print (--print WxH mm): printed pt = canvas px x (print width mm / canvas width) / 0.3528. Hard floor 7pt, the
//   prepress minimum for serif and light text (ePrinting Service, "Hairlines, small text and fine detail", 2025: sans
//   6pt, serif and light weights 7 to 8pt). The floor scales with viewing distance (a 7pt line read at 40cm subtends the
//   same angle as 7 x distance / 40 pt at the poster's distance; derived arithmetic): text under that size warns.
// Visually hidden text (clipped or 1px boxes) and data-lint-skip="canvas-text" are exempt.
async function canvasText(page, canvas) {
  const found = await page.evaluate(() => {
    const L = window.__lint;
    const out = [];
    const scaleOf = (el) => {
      let k = 1;
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.transform && s.transform !== 'none') { const m = new DOMMatrixReadOnly(s.transform); k *= Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); }
        if (s.scale && s.scale !== 'none') { const v = s.scale.split(/\s+/).map(parseFloat); k *= Math.sqrt(Math.abs(v[0] * (v.length > 1 ? v[1] : v[0]))); }
        if (s.zoom && s.zoom !== 'normal' && Number(s.zoom) > 0) k *= Number(s.zoom);
      }
      return k;
    };
    const hidden = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width <= 2 || r.height <= 2 || (s.clipPath && s.clipPath !== 'none' && /inset\(50%/.test(s.clipPath)) || (s.clip && s.clip !== 'auto'); };
    const seen = new Set();
    for (const n of L.textNodes()) {
      const el = n.parentElement;
      if (seen.has(el) || L.skipped(el, 'canvas-text') || hidden(el)) continue;
      seen.add(el);
      const px = el.closest('svg') && el.getScreenCTM
        ? parseFloat(getComputedStyle(el).fontSize) * Math.hypot(el.getScreenCTM().a, el.getScreenCTM().b)
        : parseFloat(getComputedStyle(el).fontSize) * scaleOf(el);
      out.push({ sel: L.sel(el), px: Math.round(px * 10) / 10, text: n.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) });
    }
    return out;
  });
  const res = [];
  for (const t of found) {
    if (canvas.print) {
      const pt = Math.round((t.px * (canvas.print.w / canvas.w) / 0.3528) * 10) / 10;
      const far = Math.round(7 * canvas.distance / 40 * 10) / 10;
      if (pt < 7) res.push({ ...t, level: 'fail', message: `"${t.text}" prints at ${pt}pt on ${canvas.print.w}x${canvas.print.h} mm (min 7pt)` });
      else if (pt < far) res.push({ ...t, level: 'warn', message: `"${t.text}" prints at ${pt}pt; read at ${canvas.distance} cm it needs ${far}pt to match 7pt at 40 cm` });
    } else {
      const seenPx = Math.round(t.px * canvas.view / canvas.w * 10) / 10;
      if (seenPx < 14) res.push({ ...t, level: 'fail', message: `"${t.text}" is ${t.px}px on the ${canvas.w}px canvas, seen at ${seenPx}px in a ${canvas.view}px feed (min 14; ${Math.ceil(14 * canvas.w / canvas.view)}px on this canvas)` });
    }
  }
  return res;
}

async function lintOne(browser, target, outPath) {
  const report = { file: target, date: new Date().toISOString(), checks: {}, summary: {} };
  // Fixed canvas (poster, social image, OG card): one size, no responsive checks (see readCanvas in browser.mjs).
  const canvas = readCanvas(target.split('?')[0], canvasFlags);
  const NARROW = canvas ? canvas.w : 390;
  const WIDE = canvas ? canvas.w : 1440;
  const MAIN = canvas ? [canvas.w] : [390, 1440];
  const LAYOUT = canvas ? [canvas.w] : layoutWidths;
  const VH = canvas ? canvas.h : 900;
  if (canvas) report.summary.canvas = `${canvas.w}x${canvas.h}, ${canvas.print ? `print ${canvas.print.w}x${canvas.print.h} mm read at ${canvas.distance} cm` : `seen at ${canvas.view}px wide`}; skipped: measure, type-scale, heading-wrap, nav-parity, 390 overflow and touch warnings`;
  const add = (check, level, message, detail) => {
    report.checks[check] ??= { fail: [], warn: [], pass: true };
    if (level === 'fail') report.checks[check].pass = false;
    report.checks[check][level].push(detail ? { message, ...detail } : { message });
  };
  const ok = (check) => { report.checks[check] ??= { fail: [], warn: [], pass: true }; };

  async function openPage(width, scheme, reducedMotion = 'no-preference', extra = {}) {
    const context = await browser.newContext({ viewport: { width, height: VH }, colorScheme: scheme, reducedMotion, deviceScaleFactor: 1, ...extra });
    const page = await context.newPage();
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await settle(page);
    await page.addScriptTag({ content: helpers });
    return { context, page };
  }

  // 1. axe-core, both schemes, both widths; then the worst-pixel overlay check on what axe could not decide.
  ok('axe'); ok('overlay');
  const seen = new Set();
  for (const scheme of ['light', 'dark']) {
    for (const width of MAIN) {
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

  // 2 to 6 plus static polish and typography checks, at 390 and 1440 (or the canvas size), light scheme.
  const navByWidth = {};
  for (const width of MAIN) {
    const { context, page } = await openPage(width, 'light');
    const r = await page.evaluate(({ width, WIDE, TYPE_SCALE, SPACE_SCALE, RADII, STEM }) => {
      const L = window.__lint;
      const out = { targets: [], measure: [], type: [], spacing: [], overflow: null, fluid: false, headings: [] };
      const all = [...document.body.querySelectorAll('*')].filter((el) => !el.closest('svg, head, script, style, template') || el.tagName.toLowerCase() === 'svg');

      // Targets.
      const interactive = all.filter((el) => el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [tabindex]:not([tabindex="-1"])') && L.visible(el) && !L.skipped(el, 'targets') && !L.inactive(el));
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
        if (!L.visible(h) || L.skipped(h, 'heading-wrap')) continue;
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
          if (el.closest('svg') || L.skipped(el, 'svg-overlap') || L.inactive(el)) continue;
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

      // Primary per screen: filled, opaque controls that stand off their backdrop by 2:1 or more, grouped by screen
      // height. Only the open modal counts when one is open. Same rule as design-conversion conversion-audit.mjs.
      out.primary = [];
      out.stateSheet = document.documentElement.dataset.lintPage === 'state-sheet' || /state sheet/i.test(document.title);
      if (!out.stateSheet) {
        const rgb = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
        const lumc = ({ r, g, b }) => { const f = (x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const ratio = (a, b) => { const [x, y] = [lumc(a), lumc(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
        const bgOf = (el) => { for (let n = el.parentElement; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c.a > 0.5) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
        // A skip link parked off screen or clipped until focus is not a call to action in any screen (held-out test).
        const offscreen = (el) => { const rc = el.getBoundingClientRect(); const cs = getComputedStyle(el); return rc.right <= 0 || rc.bottom + scrollY <= 0 || rc.left >= document.documentElement.scrollWidth || (cs.clipPath !== 'none' && /inset\(50%|inset\(100%/.test(cs.clipPath)) || (cs.clip && cs.clip !== 'auto') || rc.width <= 2 || rc.height <= 2; };
        const ctas = [...document.querySelectorAll('a[href], button, [role=button], input[type=submit]')].filter((el) => L.visible(el) && !L.inactive(el) && !L.skipped(el, 'primary') && !el.closest('[hidden], dialog:not([open])') && !offscreen(el)).filter((el) => {
          const c = rgb(getComputedStyle(el).backgroundColor); if (!c || c.a < 0.9) return false;
          const rc = el.getBoundingClientRect(); if (rc.width < 96 || rc.height < 36) return false;
          return ratio(c, bgOf(el)) >= 2;
        });
        const slices = {};
        for (const el of ctas) { const k = Math.floor((el.getBoundingClientRect().top + scrollY) / innerHeight); (slices[k] ||= []).push(el); }
        for (const [k, list] of Object.entries(slices)) if (list.length > 1) out.primary.push({ screen: +k + 1, labels: list.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24)), sel: L.sel(list[1]) });
      }

      // Navigation destinations: header and nav links, and whether each is reachable at this width.
      const hrefOf = (a) => { try { const u = new URL(a.getAttribute('href'), location.href); return u.pathname === location.pathname && u.search === location.search ? (u.hash || '/') : u.pathname.split('/').slice(-2).join('/') + u.search + u.hash; } catch { return a.getAttribute('href'); } };
      const disclosed = (a) => { // inside a closed menu that a visible control opens
        if (a.closest('details')) return L.visible(a.closest('details'));
        for (let n = a.parentElement; n && n !== document.body; n = n.parentElement) {
          if (n.id && [...document.querySelectorAll('[aria-controls]')].some((b) => b.getAttribute('aria-controls').split(/\s+/).includes(n.id) && L.visible(b))) return true;
          if (n.matches('dialog, [popover]') && n.id && document.querySelector(`[popovertarget="${n.id}"], [aria-controls~="${n.id}"]`)) return true;
        }
        return false;
      };
      out.nav = { shown: [], reachable: [] };
      for (const a of document.querySelectorAll('header a[href], nav a[href]')) {
        const h = hrefOf(a);
        if (!h || /^#?$/.test(h) || a.closest('[data-lint-skip~="nav-parity"]')) continue;
        if (L.visible(a)) out.nav.shown.push({ href: h, text: a.textContent.trim().slice(0, 30) });
      }
      for (const a of document.querySelectorAll('a[href]')) {
        if (L.visible(a) || disclosed(a)) out.nav.reachable.push(hrefOf(a));
        // A same-page anchor whose section is on the page at this width is reachable by scrolling.
        const h = a.getAttribute('href') || '';
        if (h.startsWith('#') && h.length > 1) { let t = null; try { t = document.getElementById(decodeURIComponent(h.slice(1))); } catch { /* bad id */ } if (t && L.visible(t)) out.nav.reachable.push(hrefOf(a)); }
      }

      if (width !== WIDE) return out;

      // ---- 1440-only static checks ----
      // Icon set: one cap and one join for small stroked icons; no hard-coded colors (icon_audit.mjs hard checks).
      out.icons = { caps: {}, joins: {}, colors: [], use: [] };
      const okColor = (v) => /^(none|currentcolor|inherit|transparent|url\(.*\)|var\(.*\))$/i.test(v.trim());
      for (const svg of document.querySelectorAll('svg')) {
        if (svg.parentElement && svg.parentElement.closest('svg')) continue;
        if (!L.visible(svg) || L.skipped(svg, 'icons')) continue;
        // Logos and brand marks are not icons: exempt from the set rules (FOUNDATIONS, logo exemption).
        if (svg.closest('[class*=logo], [id*=logo], [class*=brand], [class*=wordmark], [data-logo]')) continue;
        const r = svg.getBoundingClientRect();
        if (r.width < 10 || r.width > 28 || r.height < 10 || r.height > 28) continue;
        const where = L.sel(svg);
        const use = svg.querySelector('use');
        const parts = [...svg.querySelectorAll('*')];
        if (use) {
          const ref = (use.getAttribute('href') || use.getAttribute('xlink:href') || '').replace(/^#/, '');
          const sym = ref && document.getElementById(ref);
          if (sym) parts.push(...sym.querySelectorAll('*'));
          out.icons.use.push(where);
        }
        for (const el of parts) {
          for (const a of ['fill', 'stroke']) {
            const v = el.getAttribute(a);
            if (v && !okColor(v) && r.width >= 12) out.icons.colors.push({ sel: where, text: `${el.tagName.toLowerCase()} ${a}="${v}"` });
          }
          if (!(el instanceof SVGGeometryElement) || el.closest('symbol, defs')) continue;
          const cs = getComputedStyle(el);
          if (cs.stroke === 'none' || !(parseFloat(cs.strokeWidth) > 0)) continue;
          const isClosed = el.matches('circle, ellipse, rect, polygon');
          if (!isClosed) (out.icons.caps[cs.strokeLinecap] ||= []).push(where);
          if (!el.matches('circle, ellipse, line')) (out.icons.joins[cs.strokeLinejoin] ||= []).push(where);
        }
      }
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
      if (el.matches('time') && el.closest('th')) continue; // a date as a row label is read, not compared (design-search note 10)
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
    }, { width, WIDE, TYPE_SCALE, SPACE_SCALE, RADII, STEM });

    ok('targets');
    for (const t of r.targets) {
      if (t.w < 24 || t.h < 24) add('targets', 'fail', `target under 24x24 at ${width}px`, t);
      else if (width === NARROW && !canvas && (t.w < 44 || t.h < 44)) add('targets', 'warn', 'touch target under 44x44 at 390px', t);
    }
    if (!canvas) ok('measure');
    for (const m of canvas ? [] : r.measure) {
      if (m.cpl > 75) add('measure', 'fail', `line length ${m.cpl} characters at ${width}px (max 75)`, m);
      else if (width === WIDE && m.cpl < 45 && m.lines >= 3) add('measure', 'fail', `line length ${m.cpl} characters at 1440px (min 45)`, m);
      else if (width === NARROW && m.cpl < 30 && m.lines >= 3) add('measure', 'warn', `short line length ${m.cpl} characters at 390px`, m);
    }
    if (canvas) {
      // A fixed canvas is not read at its own size: the UI type scale does not apply, the size it is seen at does.
      ok('canvas-text');
      for (const t of await canvasText(page, canvas)) add('canvas-text', t.level, t.message, { sel: t.sel, px: t.px });
    } else {
      ok('type-scale');
      for (const t of r.type) {
        if (t.size >= 39 && r.fluid) add('type-scale', 'warn', `fluid display size ${t.size}px at ${width}px (clamp() present)`, t);
        else add('type-scale', 'fail', `font size ${t.size}px off the type scale at ${width}px`, t);
      }
      for (const t of r.svgText) add('type-scale', 'fail', `SVG text renders at ${t.px}px at ${width}px (min 12)`, t);
    }
    ok('spacing');
    for (const s of r.spacing) add('spacing', 'fail', `${s.value}px off the spacing scale at ${width}px`, s);
    ok('overflow');
    if (width === NARROW && !canvas && r.overflow.scrollWidth > r.overflow.clientWidth + 1) add('overflow', 'fail', `horizontal overflow at 390px: page is ${r.overflow.scrollWidth}px wide`, { offenders: r.overflow.offenders });
    ok('heading-wrap');
    for (const h of canvas ? [] : r.headings) add('heading-wrap', 'warn', `heading ends on a one-word line at ${width}px ("${h.text}")`, h);
    ok('svg-overlap');
    for (const o of r.overlap) add('svg-overlap', 'warn', `text "${o.text}" partly covered by ${o.art} (${o.px}px) at ${width}px`, { sel: o.sel });
    ok('primary');
    for (const x of r.primary) add('primary', 'fail', `${x.labels.length} filled calls to action in screen ${x.screen} at ${width}px (${x.labels.map((l) => '"' + l + '"').join(', ')}); one primary per view`, { sel: x.sel });
    if (r.stateSheet) report.summary.stateSheet = true;
    navByWidth[width] = r.nav;

    if (width === WIDE) {
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
      ok('icons');
      const capKinds = Object.keys(r.icons.caps), joinKinds = Object.keys(r.icons.joins);
      if (capKinds.length > 1) add('icons', 'fail', `icons mix stroke caps: ${capKinds.map((k) => `${k} (${r.icons.caps[k].length}, e.g. ${r.icons.caps[k][0]})`).join(', ')}; one cap per set`);
      if (joinKinds.length > 1) add('icons', 'fail', `icons mix stroke joins: ${joinKinds.map((k) => `${k} (${r.icons.joins[k].length}, e.g. ${r.icons.joins[k][0]})`).join(', ')}; one join per set`);
      const colorSeen = new Set();
      for (const c of r.icons.colors) { const k = c.sel + c.text; if (colorSeen.has(k)) continue; colorSeen.add(k); add('icons', 'fail', `icon hard-codes a color: ${c.text} (use currentColor or a token)`, { sel: c.sel }); }
      if (r.icons.use.length) add('icons', 'warn', `${r.icons.use.length} icons drawn with <use>: colors read from the symbol, caps and joins not confirmed (run skills/design-graphic/assets/icon_audit.mjs)`, { examples: [...new Set(r.icons.use)].slice(0, 3) });
      ok('icon-stroke');
      for (const i of r.icon) add('icon-stroke', 'warn', `icon stroke ${i.stroke}px vs text stem ${i.stem}px (${i.text})`, { sel: i.sel });
      ok('weight');
      if (r.weight.svg > 150_000) add('weight', 'warn', `inline SVG is ${Math.round(r.weight.svg / 1000)} KB (over 150 KB); reuse with <use> or simplify paths`);
      if (r.weight.html > 1_500_000) add('weight', 'warn', `page HTML is ${Math.round(r.weight.html / 1000)} KB (over 1.5 MB)`);
      report.summary.weightKB = { html: Math.round(r.weight.html / 1000), svg: Math.round(r.weight.svg / 1000) };
    }
    await context.close();
  }

  // Layout at every width (default 390, 768, 1024, 1440): collisions, squashed children, sticky bars, text running
  // together, broken words, edges (tools/lint-layout.mjs; round 3 critic found these by eye at 768 and 1024).
  for (const c of ['occlusion', 'squash', 'sticky-header', 'run-together', 'word-break', 'grid-edge', 'hidden-content', 'double-space']) ok(c);
  for (const width of LAYOUT) {
    const { context, page } = await openPage(width, 'light');
    const r = await layoutChecks(page, width);
    reportLayout(r, width, add);
    if (width === WIDE || (width === LAYOUT[LAYOUT.length - 1] && !LAYOUT.includes(WIDE))) { await pageChecks(page, add); ok('undefined-var'); ok('state-layer'); ok('primitive-in-component'); ok('error-icon'); await tokenChecks(page, add); await errorIconChecks(page, add); }
    await context.close();
  }
  if (report.summary.stateSheet || report.checks['state-sheet']) ok('state-sheet');

  // State truth and proportion: numbers across states and live updates (tools/lint-truth.mjs).
  if (!noTruth) {
    ok('truth'); ok('proportion');
    await truthPass(browser, target, helpers, toUrl, { ticks, tickMs, viewport: { width: WIDE, height: VH } }, add);
  }

  // Nav parity: a header or nav destination shown at 1440 needs a route at 390.
  ok('nav-parity');
  if (!canvas && navByWidth[1440] && navByWidth[390]) {
    const reach = new Set(navByWidth[390].reachable);
    const seenHref = new Set();
    for (const l of navByWidth[1440].shown) {
      if (seenHref.has(l.href)) continue;
      seenHref.add(l.href);
      if (!reach.has(l.href)) add('nav-parity', 'warn', `nav destination "${l.text}" (${l.href}) shown at 1440 has no route at 390 (not visible, not in a menu, not linked elsewhere)`);
    }
  }

  // Dark: drop shadows on dark surfaces.
  {
    const { context, page } = await openPage(WIDE, 'dark');
    const heavy = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!window.__lint.visible(el)) continue;
        const sh = getComputedStyle(el).boxShadow;
        if (!sh || sh === 'none') continue;
        for (const layer of sh.split(/,(?![^(]*\))/)) {
          if (/inset/.test(layer)) continue;
          // Transparent layers paint nothing (FOUNDATIONS v0.4 dark shadows are transparent, not none, so lists compose).
          if (/transparent/.test(layer)) continue;
          const am = layer.match(/rgba?\(([^)]*)\)/);
          if (am) { const parts = am[1].split(/[\s,/]+/).filter(Boolean); if (parts.length >= 4 && parseFloat(parts[3]) === 0) continue; }
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
  ok('focus'); ok('focus-shape'); ok('sticky-focus'); ok('skip-link');
  {
    const { context, page } = await openPage(WIDE, 'light', 'reduce');
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
    // Skip link (WCAG 2.4.1): needed when something focusable comes before main.
    const before = await page.evaluate(() => {
      const main = document.querySelector('main, [role=main]');
      if (!main || window.__lint.modal()) return { main: !!main, count: 0 }; // an open modal owns the first Tab
      const f = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
        .filter((e) => window.__lint.visible(e) || e.matches('a[href^="#"]'))
        .filter((e) => !main.contains(e) && (main.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING));
      return { main: true, count: f.length };
    });
    for (let i = 0; i < Math.min(count + 2, 200); i++) {
      await page.keyboard.press('Tab');
      if (i === 0 && before.count > 0) {
        const sk = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return { ok: false, why: 'nothing takes focus on the first Tab' };
          const sel = window.__lint.sel(el);
          if (!el.matches('a[href^="#"]') || el.getAttribute('href').length < 2) return { ok: false, why: `first focusable is ${sel}, not a same-page link` };
          let target = null; try { target = document.getElementById(decodeURIComponent(el.getAttribute('href').slice(1))); } catch { /* bad id */ }
          const main = document.querySelector('main, [role=main]');
          if (!target) return { ok: false, why: `skip link ${sel} points at a missing id` };
          if (!(target === main || target.contains(main) || main.contains(target))) return { ok: false, why: `skip link ${sel} does not lead to main` };
          const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
          const shown = r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && cs.clip === 'auto' && cs.clipPath === 'none' && cs.opacity !== '0';
          if (!shown) return { ok: false, why: `skip link ${sel} stays hidden when focused` };
          return { ok: true };
        });
        if (!sk.ok) add('skip-link', 'fail', `${before.count} focusable elements before main and no working skip link: ${sk.why}`);
      }
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
          if (ix > 1 && iy > 1 && window.__lint.paintsOver(b, el)) { covered = window.__lint.sel(b); break; }
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
    const { context, page } = await openPage(WIDE, 'light', 'reduce');
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
    for (const width of MAIN) {
      const { context, page } = await openPage(width, 'light');
      const res = await page.evaluate(async () => {
        const pick = () => [...document.querySelectorAll('header, main > *, section, footer, h1, h2')].filter((e) => window.__lint.visible(e)).map((e) => ({ sel: window.__lint.sel(e), top: e.getBoundingClientRect().top + scrollY }));
        // Text blocks and their rendered line counts, to say which element re-wrapped (copy fix vs font fix).
        const texts = [...document.querySelectorAll('h1, h2, h3, h4, p, li, dt, dd, figcaption, label, button, blockquote, td, th')].filter((e) => window.__lint.visible(e) && e.textContent.trim().length > 2);
        const countLines = () => texts.map((e) => window.__lint.lines(e).length);
        let removed = 0;
        const before = pick();
        const linesBefore = countLines();
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
        const linesAfter = countLines();
        const rewrapped = [];
        texts.forEach((e, i) => { if (linesAfter[i] !== linesBefore[i]) rewrapped.push({ sel: window.__lint.sel(e), from: linesBefore[i], to: linesAfter[i], text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) }); });
        let worst = { shift: 0 };
        before.forEach((b, i) => { const a = after[i]; if (a && Math.abs(a.top - b.top) > Math.abs(worst.shift)) worst = { sel: b.sel, shift: Math.round(a.top - b.top) }; });
        return { removed, worst, rewrapped, docShift: document.documentElement.scrollHeight - docH };
      });
      if (res) {
        report.summary[`fallbackShift${width}`] = res.worst.shift;
        const rw = res.rewrapped.slice(0, 4).map((x) => `${x.sel} "${x.text}" ${x.from} to ${x.to} lines`).join('; ');
        if (Math.abs(res.worst.shift) > 8) add('fallback', 'warn', `layout moves ${res.worst.shift}px at ${width}px when the web fonts fail (worst: ${res.worst.sel}); add metric fallbacks (size-adjust, ascent-override)${res.rewrapped.length ? `. Line count changed in ${res.rewrapped.length} elements: ${rw}${res.rewrapped.length > 4 ? '; ...' : ''} (one element near a wrap point is a copy fix; many is a font metrics fix)` : ''}`, { ...res.worst, rewrapped: res.rewrapped.slice(0, 12) });
      }
      await context.close();
    }
  }

  // Reduced motion.
  ok('motion');
  {
    const probe = async (reducedMotion) => {
      const { context, page } = await openPage(WIDE, 'light', reducedMotion);
      await page.waitForTimeout(300);
      const res = await page.evaluate(() => {
        const moving = /transform|translate|scale|rotate|top|left|right|bottom|margin|width|height|all/;
        // Properties a keyframe may change under reduced motion: opacity and color only (FOUNDATIONS v0.4, Motion).
        const moveProp = /^(transform|translate|scale|rotate|offset|offset-.*|top|left|right|bottom|inset.*|margin.*|padding.*|width|height|inline-size|block-size|min-.*|max-.*|clip-path|perspective|background-position|zoom)$/;
        const keyframeProps = new Map();
        const walk = (rules) => { for (const ru of rules) { if (ru instanceof CSSKeyframesRule) { const props = new Set(); for (const k of ru.cssRules) for (let i = 0; i < k.style.length; i++) props.add(k.style[i]); keyframeProps.set(ru.name, [...props]); } else if (ru.cssRules) walk(ru.cssRules); } };
        for (const sheet of document.styleSheets) { try { walk(sheet.cssRules); } catch { /* cross-origin */ } }
        const anims = [];
        const trans = [];
        for (const el of document.querySelectorAll('*')) {
          const s = getComputedStyle(el);
          const durs = s.animationDuration.split(',').map(parseFloat);
          if (s.animationName === 'none') continue;
          s.animationName.split(',').map((x) => x.trim()).forEach((name, i) => {
            const d = durs[i % durs.length];
            if (!(d > 0.02)) return; // the common 0.01ms reduced-motion reset is not motion
            const props = keyframeProps.get(name) || ['unknown'];
            const moves = props.some((p) => moveProp.test(p) || p === 'unknown');
            if (d > 0.1 || moves) anims.push({ name, dur: d * 1000, iter: s.animationIterationCount, moves, props: props.slice(0, 6).join(' ') });
          });
        }
        for (const el of document.querySelectorAll('*')) {
          const s = getComputedStyle(el);
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
      for (const a of reduced.anims) {
        if (a.moves) add('motion', 'fail', `animation still moves with reduced motion: ${a.name} ${a.dur}ms (${a.props})`, a);
        else if (a.dur > 150 || a.iter === 'infinite') add('motion', 'warn', `opacity or color animation under reduced motion: ${a.name} ${a.dur}ms${a.iter === 'infinite' ? ', looping' : ''}; keep it at --duration-fast (150ms) or less, once`, a);
      }
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
      if (!el || window.__lint.skipped(el, 'overlay') || window.__lint.inactive(el)) continue;
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
  // A state replaces the same key in the target's own query instead of appending a second one
  // (page.html?state=removed --states state=checkout lints page.html?state=checkout, not ?state=removed&state=checkout).
  const withQuery = (t, s) => {
    const hash = t.indexOf('#') === -1 ? '' : t.slice(t.indexOf('#'));
    const bare = hash ? t.slice(0, t.indexOf('#')) : t;
    const q = bare.indexOf('?');
    const params = new URLSearchParams(q === -1 ? '' : bare.slice(q + 1));
    for (const [k, v] of new URLSearchParams(s)) params.set(k, v);
    const qs = params.toString();
    return (q === -1 ? bare : bare.slice(0, q)) + (qs ? '?' + qs : '') + hash;
  };
  const targets = [target, ...states.map((s) => withQuery(target, s))];
  for (const t of targets) {
    let outPath = null;
    if (!/^https?:/.test(t)) {
      if (jsonOut && targets.length === 1) outPath = jsonOut;
      else {
        const { file, slug } = splitTarget(t);
        outPath = file.replace(/\.html?$/, '') + (slug ? '.' + slug : '') + '.lint.json';
        if (outDir) { fs.mkdirSync(outDir, { recursive: true }); outPath = path.join(outDir, path.basename(outPath)); }
      }
    }
    total += await lintOne(browser, t, outPath);
  }
} finally {
  await browser.close();
}
process.exit(total ? 1 : 0);
