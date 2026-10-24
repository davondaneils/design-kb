#!/usr/bin/env node
// Operated checks: press every control on the live page, then re-check the page it leaves behind.
//
//   node tools/operate.mjs <html[?query]> [--states state=a,state=b] [--json out.json] [--log] [--max 60] [--quiet]
//
// tools/lint.mjs runs this pass on every target by default (skip with --no-operate). The standalone command adds
// --log: the visible text each action added and removed, for a critic to read instead of clicking.
//
// Why it exists: benchmark round 2 fixed every round 1 gate fail and then failed the gate on things nobody could see
// in a screenshot: a stepper whose buttons did nothing, the wrong button disabling at 200, focus landing under an open
// drawer, a dialog that says "Everyone is paid" above the person who is not, a rate lock that grows after Retry, a
// label that reads 3 and 38 after a filter (kb/reviews/benchmark-round2-*.md; kb/tests/benchmark/RESULTS.md). Every one
// was found by a critic operating the page. This pass does that operating on every build.
//
// Checks (each fails unless noted; exempt an element with data-lint-skip="<check>"):
//   dead-control    every enabled button, summary, tab, switch, checkbox and radio changes the page when clicked
//                   (DOM, attribute, input value or URL). Run at 1440, and at 390 for controls only shown there.
//   press-state     a button held down looks different from rest (fail) and from hover (warn), and a filled
//                   button's pressed fill is delta E (CIE76) 15 or more from its disabled fill (design-polish 01 rule
//                   3; round 1's pressed primary read as disabled at delta E 6.5).
//   disclosure      a control that opens something (aria-expanded, <summary>) looks different once open, with and
//                   without reduced motion; aria-expanded flips. Round 1's phone "Menu" looked the same open and
//                   closed; round 2's open FAQ row kept its "+" under reduced motion.
//   focus-obscured  Tab through the page, and through it again after each control that opens a panel or dialog, at
//                   390 and 1440: no focused element may be entirely covered by other content (WCAG 2.2 SC 2.4.11).
//   stepper         a number input with buttons: each button moves the value by one step and changes the text it
//                   drives; at max the increase button disables (never the decrease button), at min the reverse.
//   countdown       a "N min left" figure never grows after an action, unless the action is a refresh or requote.
//   label-number    after an action, one label never shows two different numbers ("People in this run 3" beside
//                   "People in this run 38"). A filtered view says "3 of 38".
//   stale-commit    after a commit action (Approve, Pay, Send, Confirm, Submit, Transfer) completes, nothing still
//                   says "until you approve", "before you approve" or "approve by", and no button still offers it.
//   contradiction   a universal ("everyone", "every person") never shares a dialog or section with its exception
//                   ("not sent", "can't be paid", "held"); page-wide it warns. "Nobody has been paid" never sits
//                   beside a "paid" count above 0. Run on the loaded page and on every state an action leaves.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { launch, toUrl } from './browser.mjs';
import { helpers, settle } from './lint-helpers.mjs';

export const OPERATE_CHECKS = ['dead-control', 'press-state', 'disclosure', 'focus-obscured', 'stepper', 'countdown', 'label-number', 'stale-commit', 'contradiction'];

// In-page helpers for this pass (window.__op). Needs window.__lint (lint-helpers.mjs) for visible, inactive, sel, skipped.
const OP = `
  window.__op = {
    CONTROLS: 'button, summary, [role=button], [role=tab], [role=switch], [role=menuitem], input[type=checkbox], input[type=radio]',
    pick(scope) {
      const L = window.__lint;
      const root = scope ? document.querySelector(scope) : document;
      if (!root) return [];
      return [...root.querySelectorAll(this.CONTROLS)].filter((el) => L.visible(el) && !L.inactive(el) && !L.skipped(el, 'dead-control')
        && !el.matches('[disabled], [aria-disabled=true]') && !el.closest('[disabled], dialog:not([open])'));
    },
    snap() {
      let x = 0;
      const str = document.documentElement.outerHTML.replace(/ data-op="1"/g, '') + location.href
        + [...document.querySelectorAll('input, select, textarea')].map((e) => (e.type === 'checkbox' || e.type === 'radio' ? e.checked : e.value)).join('|');
      for (let i = 0; i < str.length; i++) x = (x * 31 + str.charCodeAt(i)) | 0;
      return x;
    },
    // Any CSS color string to [r, g, b, a] in sRGB, through a canvas pixel (handles oklch, lab, color-mix).
    rgb(str) {
      const c = this._c || (this._c = document.createElement('canvas'));
      c.width = c.height = 1;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.clearRect(0, 0, 1, 1); g.fillStyle = '#000'; g.fillStyle = str; g.fillRect(0, 0, 1, 1);
      const d = g.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    },
    look(el) {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, bgi: s.backgroundImage, color: s.color, border: s.borderTopColor + ' ' + s.borderBottomColor + ' ' + s.borderTopWidth,
        shadow: s.boxShadow, transform: s.transform, scale: s.scale, filter: s.filter, opacity: s.opacity, weight: s.fontWeight, deco: s.textDecorationLine };
    },
    // The fill a disabled copy of this control would show, blended over the page when disabled uses opacity.
    disabledFill(el) {
      const c = el.cloneNode(true);
      c.removeAttribute('id'); c.removeAttribute('data-op'); c.disabled = true; c.setAttribute('aria-disabled', 'true'); c.setAttribute('tabindex', '-1');
      c.style.position = 'absolute'; c.style.left = '-9999px';
      el.parentElement.appendChild(c);
      const s = getComputedStyle(c);
      const bg = this.rgb(s.backgroundColor), op = Number(s.opacity);
      c.remove();
      const page = this.rgb(getComputedStyle(document.body).backgroundColor);
      const base = page[3] ? page : [255, 255, 255, 1];
      const a = bg[3] * op;
      return [0, 1, 2].map((i) => Math.round(bg[i] * a + base[i] * (1 - a)));
    },
    countdowns() {
      const t = document.body.innerText;
      const out = [...t.matchAll(/(\\d+)\\s*(?:min|mins|minutes)\\s+(?:left|remaining)/gi)].map((m) => Number(m[1]));
      return out;
    },
    // Short visible strings that hold one number: label (words only) to the set of numbers shown with it.
    labelNums(skip) {
      const L = window.__lint, map = {};
      // A term and its first visible value read as one string ("People paid" + "38"), whatever else the group holds.
      const pairs = [...document.querySelectorAll('dt')].filter((dt) => L.visible(dt) && !L.inactive(dt)).map((dt) => {
        let dd = dt.nextElementSibling;
        while (dd && !(dd.tagName === 'DD' && L.visible(dd))) dd = dd.nextElementSibling;
        return dd ? { el: dt, t: (dt.innerText + ' ' + dd.innerText).replace(/\\s+/g, ' ').trim() } : null;
      }).filter(Boolean);
      for (const el of [...pairs, ...document.body.querySelectorAll('*')]) {
        if (el.t) {
          const nums = el.t.match(/[$€£]?\\d[\\d,]*(?:\\.\\d+)?%?/g);
          if (!nums || nums.length !== 1 || el.t.length > 48) continue;
          const label = el.t.replace(nums[0], ' ').toLowerCase().replace(/[^a-z\\s]/g, ' ').replace(/\\s+/g, ' ').trim();
          if (label.split(' ').filter((w) => w.length > 1).length < 2) continue;
          const e = (map[label] ||= { nums: [], texts: [], sel: L.sel(el.el) });
          if (!e.nums.includes(nums[0])) e.nums.push(nums[0]);
          if (!e.texts.includes(el.t)) e.texts.push(el.t);
          continue;
        }
        if (/^(SCRIPT|STYLE|TEMPLATE|svg|path|INPUT|SELECT|TEXTAREA|OPTION)$/i.test(el.tagName)) continue;
        if (skip && (el === skip || el.contains(skip) || skip.contains(el))) continue;
        if (el.closest('tbody, [data-lint-skip~="label-number"]') || !L.visible(el) || L.inactive(el)) continue;
        const list = el.closest('ul, ol');
        if (list && list.children.length >= 4) continue;
        const t = (el.innerText || '').replace(/\\s+/g, ' ').trim();
        if (!t || t.length > 48) continue;
        const nums = t.match(/[$€£]?\\d[\\d,]*(?:\\.\\d+)?%?/g);
        if (!nums || nums.length !== 1) continue;
        const label = t.replace(nums[0], ' ').toLowerCase().replace(/[^a-z\\s]/g, ' ').replace(/\\s+/g, ' ').trim();
        const words = label.split(' ').filter((w) => w.length > 1);
        if (words.length < 2) continue;
        const e = (map[label] ||= { nums: [], texts: [], sel: L.sel(el) });
        if (!e.nums.includes(nums[0])) e.nums.push(nums[0]);
        if (!e.texts.includes(t)) e.texts.push(t);
      }
      return map;
    },
    contradictions() {
      const L = window.__lint, out = [];
      const UNI = /\\b(everyone|everybody|every person|every payee|every employee|all your people)\\b(?! (who|whose|with|that)\\b)/i;
      const EXC = /\\b(not (be )?(sent|paid)|can['’]?t be paid|cannot be paid|won['’]?t be paid|(is|are) held|on hold|excluded|has no bank details|have no bank details|skipped)\\b/i;
      const sentences = (t) => t.split(/(?<=[.!?])\\s+|\\n+/).map((s) => s.trim()).filter(Boolean);
      const seen = new Set();
      const scopes = [...document.querySelectorAll('dialog[open], [role=dialog], [aria-modal=true], section, article, aside, form, [role=region]')].filter((s) => L.visible(s) && !L.inactive(s));
      for (const s of scopes) {
        const ss = sentences(s.innerText || '');
        const u = ss.find((x) => UNI.test(x)), e = ss.find((x) => EXC.test(x) && !UNI.test(x));
        if (u && e && !seen.has(u)) { seen.add(u); out.push({ level: 'fail', msg: '"' + u.slice(0, 70) + '" shares ' + (s.matches('dialog, [role=dialog], [aria-modal=true]') ? 'a dialog' : 'a section') + ' with its exception "' + e.slice(0, 70) + '"; write "37 of 38" or name who is left out', sel: L.sel(s) }); }
      }
      const all = sentences(document.body.innerText);
      const u = all.find((x) => UNI.test(x)), e = all.find((x) => EXC.test(x) && !UNI.test(x));
      if (u && e && !seen.has(u)) out.push({ level: 'warn', msg: '"' + u.slice(0, 70) + '" and "' + e.slice(0, 70) + '" are on the same page; a universal never shares a screen with its exception' });
      const nobody = document.body.innerText.match(/\\b(nobody|no one)\\b[^.\\n]{0,40}?\\b(?:has|have|was|were|is|are)\\s+(?:been\\s+|yet\\s+)?(\\w+)/i);
      if (nobody) {
        const verb = nobody[2].toLowerCase();
        // A count of the same verb: "People paid 38" (the number follows the verb and ends the string).
        const re = new RegExp('\\\\b' + verb + '\\\\s+([\\\\d,]+)$', 'i');
        for (const v of Object.values(this.labelNums())) {
          const m = v.texts.map((t) => t.match(re)).find((m) => m && Number(m[1].replace(/,/g, '')) > 0);
          if (m) out.push({ level: 'fail', msg: '"' + nobody[0].trim() + '" sits on the same screen as "' + m.input + '"', sel: v.sel });
        }
      }
      return out;
    },
    // The focused element is entirely covered when every probe point lands on something that is neither it, inside
    // it, nor an ancestor of it (WCAG 2.2 SC 2.4.11, Minimum: not entirely hidden).
    focusProbe() {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      const r = el.getBoundingClientRect();
      if (r.width <= 2 || r.height <= 2) return null;
      const W = innerWidth, H = innerHeight;
      if (r.right <= 0 || r.bottom <= 0 || r.left >= W || r.top >= H) return null;
      const cl = (v, lo, hi) => Math.max(lo + 1, Math.min(hi - 1, v));
      const pts = [[(r.left + r.right) / 2, (r.top + r.bottom) / 2], [r.left + 2, r.top + 2], [r.right - 2, r.bottom - 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.top + 2]]
        .map(([x, y]) => [cl(x, 0, W), cl(y, 0, H)]);
      let cover = null;
      for (const [x, y] of pts) {
        const hit = document.elementFromPoint(x, y);
        if (!hit || hit === el || el.contains(hit) || hit.contains(el)) return null;
        cover = hit;
      }
      const L = window.__lint;
      if (L.skipped(el, 'focus-obscured')) return null;
      return { sel: L.sel(el), text: (el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 40), cover: L.sel(cover.closest('[id]') || cover) };
    },
    lines() { return (document.body.innerText || '').split('\\n').map((s) => s.replace(/\\s+/g, ' ').trim()).filter(Boolean); },
  };
`;

const COMMIT = /^(approve|pay|send|confirm|submit|transfer|fund|place order|book|purchase|buy)\b/i;
const REFRESH = /\b(refresh|requote|re-quote|new quote|extend|restart|reset)\b/i;
const dE = (a, b) => {
  const lab = (c) => {
    const [r, g, b2] = c.map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    let x = (r * 0.4124 + g * 0.3576 + b2 * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b2 * 0.0722, z = (r * 0.0193 + g * 0.1192 + b2 * 0.9505) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    x = f(x); y = f(y); z = f(z);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };
  const p = lab(a), q = lab(b);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};

export async function operatePass(browser, target, add, ok, opts = {}) {
  const max = opts.max ?? 60;
  const VH = opts.vh ?? 900;
  const log = opts.log ? [] : null;
  for (const c of OPERATE_CHECKS) ok(c);
  const said = new Set();
  const once = (check, level, msg, detail) => { const k = check + level + msg; if (said.has(k)) return; said.add(k); add(check, level, msg, detail); };

  const ready = async (page) => {
    for (let i = 0; i < 3; i++) {
      try {
        if (!(await page.evaluate(() => !!window.__op && !!window.__lint))) { await page.addScriptTag({ content: helpers }); await page.addScriptTag({ content: OP }); }
        return;
      } catch { await page.waitForTimeout(300); try { await page.waitForLoadState('load', { timeout: 3000 }); } catch { /* still loading */ } }
    }
  };
  const open = async (width, reducedMotion = 'no-preference') => {
    const context = await browser.newContext({ viewport: { width, height: VH }, colorScheme: 'light', reducedMotion, deviceScaleFactor: 1 });
    const page = await context.newPage();
    return { context, page };
  };
  const load = async (page) => {
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await settle(page);
    await ready(page);
  };
  const after = async (page) => {
    await page.waitForTimeout(300);
    try { await page.waitForLoadState('load', { timeout: 3000 }); } catch { /* no navigation */ }
    await settle(page);
    await ready(page);
  };
  const ev = (page, fn, arg) => page.evaluate(fn, arg).catch(() => null);
  const calm = async (page) => { await page.mouse.move(0, 0); await ev(page, () => document.activeElement && document.activeElement.blur && document.activeElement.blur()); };
  // Two element screenshots look the same when they are the same size and at most a few pixels differ (anti-aliasing
  // and subpixel text shift byte-level PNGs between identical renders).
  const alike = async (page, a, b) => {
    if (a.equals(b)) return true;
    const r = await ev(page, async ([a, b]) => {
      const img = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = 'data:image/png;base64,' + src; });
      const [x, y] = await Promise.all([img(a), img(b)]);
      if (!x || !y || x.width !== y.width || x.height !== y.height) return { same: false };
      const px = (i) => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
      const p = px(x), q = px(y);
      let n = 0;
      for (let k = 0; k < p.length; k += 4) if (Math.abs(p[k] - q[k]) + Math.abs(p[k + 1] - q[k + 1]) + Math.abs(p[k + 2] - q[k + 2]) > 48) n++;
      return { same: n <= 8 };
    }, [a.toString('base64'), b.toString('base64')]);
    return !!(r && r.same);
  };
  const shot = async (page) => { try { return await page.locator('[data-op="1"]').first().screenshot({ animations: 'disabled', timeout: 2000 }); } catch { return null; } };

  // Tab through the page and report the first focused element that is entirely covered.
  const tabWalk = async (page, n, where, width) => {
    for (let i = 0; i < n; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(40);
      const hit = await ev(page, () => window.__op.focusProbe());
      if (hit) { once('focus-obscured', 'fail', `${where} at ${width}px: Tab ${i + 1} lands on "${hit.text}", entirely covered by ${hit.cover} (WCAG 2.4.11); make the open panel modal (showModal or inert on the rest) or keep focus clear of it`, { sel: hit.sel, width }); return; }
    }
  };

  // The checks that read the page an action leaves behind.
  const reread = async (page, label, before, width) => {
    const st = await ev(page, () => ({ modal: !!window.__lint.modal(), cd: window.__op.countdowns(), ln: window.__op.labelNums(), cx: window.__op.contradictions(), lines: window.__op.lines(),
      buttons: [...document.querySelectorAll('button, [role=button]')].filter((b) => window.__lint.visible(b) && !window.__lint.inactive(b) && !b.disabled).map((b) => b.innerText.replace(/\s+/g, ' ').trim()) }));
    if (!st) return null;
    if (before.cd.length && st.cd.length && Math.max(...st.cd) > Math.max(...before.cd) && !REFRESH.test(label)) once('countdown', 'fail', `after "${label}" the countdown reads ${Math.max(...st.cd)} min left where it read ${Math.max(...before.cd)} before; a lock never grows after an action (give the action its own post-action state)`, { width });
    for (const [lab, v] of Object.entries(st.ln)) {
      if (v.nums.length < 2 || lab.split(' ').length < 3) continue;
      const was = before.ln[lab];
      if (was && was.nums.length > 1) continue;
      once('label-number', 'fail', `after "${label}", "${lab}" reads ${v.nums.join(' and ')} on one screen; a filtered view says "3 of 38" and the label keeps one meaning`, { sel: v.sel, width });
    }
    const m = label.match(COMMIT);
    if (m && !st.modal) {
      const verb = m[1].toLowerCase().split(' ')[0];
      const re = new RegExp(`\\b(until|before) you ${verb}\\b|\\b${verb} by\\b|\\bneeds? (your )?${verb}al\\b`, 'i');
      const stale = st.lines.filter((l) => re.test(l));
      const offer = st.buttons.filter((b) => new RegExp(`^${verb}\\b`, 'i').test(b));
      if (stale.length) once('stale-commit', 'fail', `after "${label}" the page still says ${stale.slice(0, 3).map((s) => '"' + s.slice(0, 60) + '"').join(', ')}; every sentence is true after the action`, { width });
      if (offer.length && before.modal) once('stale-commit', 'fail', `after "${label}" the page still offers "${offer[0]}"`, { width });
    }
    for (const c of st.cx) {
      // A page-wide pair is reported once, not after every action that leaves it on screen.
      if (c.level === 'warn') { if (!said.has('cx' + c.msg)) { said.add('cx' + c.msg); add('contradiction', 'warn', c.msg, { width }); } }
      else if (!said.has('cx' + c.msg)) { said.add('cx' + c.msg); add('contradiction', 'fail', `after "${label}": ${c.msg}`, { sel: c.sel, width }); }
    }
    if (log) {
      const was = new Set(before.lines), now = new Set(st.lines);
      log.push({ width, action: label, added: st.lines.filter((l) => !was.has(l)).slice(0, 12), removed: before.lines.filter((l) => !now.has(l)).slice(0, 12) });
    }
    return st;
  };
  const state = (page) => ev(page, () => ({ modal: !!window.__lint.modal(), cd: window.__op.countdowns(), ln: window.__op.labelNums(document.querySelector('[data-op="1"]')), lines: window.__op.lines() }));

  // Mark the i-th control (optionally inside a scope), returning what is known about it at rest.
  const mark = (page, i, scope) => ev(page, ([i, scope]) => {
    document.querySelectorAll('[data-op]').forEach((e) => e.removeAttribute('data-op'));
    const el = window.__op.pick(scope)[i];
    if (!el) return null;
    el.setAttribute('data-op', '1');
    const r = el.getBoundingClientRect();
    return { sel: window.__lint.sel(el), text: (el.innerText || el.getAttribute('aria-label') || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      tag: el.tagName.toLowerCase(), button: el.matches('button, [role=button]') && !el.matches('summary'), expanded: el.getAttribute('aria-expanded'),
      disclosure: el.matches('summary, [aria-expanded]'), invalidSubmit: !!(el.form && el.type === 'submit' && !el.form.noValidate && !el.form.checkValidity()), y: r.top + scrollY, skipPress: window.__lint.skipped(el, 'press-state'), skipDisc: window.__lint.skipped(el, 'disclosure') };
  }, [i, scope]);

  // Press one marked control: rest, hover, held and released, with the press-state reading taken while held.
  const press = async (page, info, width, readPress, away = false) => {
    await ev(page, () => document.querySelector('[data-op="1"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
    const box = await page.locator('[data-op="1"]').first().boundingBox().catch(() => null);
    if (!box) return false;
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const onTop = await ev(page, ([x, y]) => { const h = document.elementFromPoint(x, y), el = document.querySelector('[data-op="1"]'); return !!h && (h === el || el.contains(h)); }, [x, y]);
    if (!onTop) { try { await page.click('[data-op="1"]', { timeout: 1500 }); return true; } catch { return false; } }
    if (readPress && info.button && !info.skipPress) {
      const rest = await ev(page, () => window.__op.look(document.querySelector('[data-op="1"]')));
      const dis = await ev(page, () => window.__op.disabledFill(document.querySelector('[data-op="1"]')));
      await page.mouse.move(x, y); await page.waitForTimeout(160);
      const hover = await ev(page, () => window.__op.look(document.querySelector('[data-op="1"]')));
      await page.mouse.down(); await page.waitForTimeout(160);
      const held = await ev(page, () => window.__op.look(document.querySelector('[data-op="1"]')));
      if (rest && hover && held) {
        const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        if (same(rest, held)) once('press-state', 'fail', `"${info.text}" looks the same held down as at rest; every custom button has a pressed state (design-polish 01 rule 3)`, { sel: info.sel, width });
        else if (same(hover, held) && !same(rest, hover)) once('press-state', 'warn', `"${info.text}" pressed looks the same as hover; pressed moves one step past hover`, { sel: info.sel, width });
        const fill = await ev(page, (c) => window.__op.rgb(c), held.bg);
        const restFill = await ev(page, (c) => window.__op.rgb(c), rest.bg);
        // Only where the control has a disabled look of its own (a segment that is never disabled has none).
        if (fill && restFill && fill[3] > 0.5 && dis && !same(rest, held) && dE(restFill.slice(0, 3), dis) >= 1) {
          const d = dE(fill.slice(0, 3), dis);
          if (d < 15) once('press-state', 'fail', `"${info.text}" pressed fill is delta E ${d.toFixed(1)} from its disabled fill (need 15 or more); a press reads as switching off`, { sel: info.sel, width });
        }
      }
      if (away) await page.mouse.move(0, 0); // release off the control: no click, no navigation
      await page.mouse.up();
      return true;
    }
    await page.mouse.click(x, y);
    return true;
  };

  const controlsSeen = new Set();
  for (const width of [1440, 390]) {
    const { context, page } = await open(width);
    try {
      await load(page);
      // Base page: contradictions as loaded, and a Tab walk for sticky bars and fixed panels.
      for (const c of (await ev(page, () => window.__op.contradictions())) || []) { if (said.has('cx' + c.msg)) continue; said.add('cx' + c.msg); add('contradiction', c.level, c.msg, { sel: c.sel, width }); }
      await tabWalk(page, 60, 'loaded page', width);
      await load(page);

      const list = (await ev(page, () => window.__op.pick().map((el) => window.__lint.sel(el) + '|' + el.getAttribute('aria-expanded')))) || [];
      const n = Math.min(list.length, max);
      if (list.length > max) once('dead-control', 'warn', `operated the first ${max} of ${list.length} controls at ${width}px`);
      for (let i = 0; i < n; i++) {
        const key = list[i].split('|')[0];
        const isNarrowOnly = !controlsSeen.has(key);
        if (width === 1440) controlsSeen.add(key);
        else if (!isNarrowOnly && list[i].split('|')[1] === 'null') continue; // already operated at 1440
        if (i) await load(page);
        const info = await mark(page, i);
        if (!info) continue;
        const before = await state(page);
        const snap0 = await ev(page, () => window.__op.snap());
        await calm(page);
        const img0 = info.disclosure && !info.skipDisc ? await shot(page) : null;
        if (!(await press(page, info, width, width === 1440))) continue;
        await after(page);
        const snap1 = await ev(page, () => window.__op.snap());
        if (snap1 !== null && snap1 === snap0 && !info.invalidSubmit) { once('dead-control', 'fail', `clicking "${info.text}" changes nothing on the page (no DOM, attribute, value or URL change)`, { sel: info.sel, width }); continue; }
        const st = await reread(page, info.text, before, width);
        if (!st) continue;
        // Disclosure: aria-expanded flips and the control looks open.
        if (info.disclosure && !info.skipDisc) {
          const exp = await ev(page, () => { const el = document.querySelector('[data-op="1"]'); return el ? el.getAttribute('aria-expanded') : 'gone'; });
          if (info.expanded === 'false' && exp === 'false') once('disclosure', 'fail', `"${info.text}" opens something but aria-expanded stays "false"`, { sel: info.sel, width });
          const opened = info.expanded === 'false' || (info.tag === 'summary' && (await ev(page, () => !!document.querySelector('[data-op="1"]').closest('details[open]'))));
          if (opened && img0) {
            await calm(page);
            const img1 = await shot(page);
            if (img1 && (await alike(page, img0, img1))) once('disclosure', 'fail', `"${info.text}" looks the same open as closed at ${width}px; show the open state on the control (Close, an X, a turned chevron, minus for plus)`, { sel: info.sel, width });
          }
        }
        // A control that opened a panel or a dialog: Tab from it and look for focus under the panel.
        const openedPanel = st.modal && !before.modal || (await ev(page, () => { const el = document.querySelector('[data-op="1"]'); return !!el && el.getAttribute('aria-expanded') === 'true'; }));
        if (openedPanel) {
          await ev(page, () => { const el = document.querySelector('[data-op="1"]'); if (el && !window.__lint.inactive(el)) el.focus(); });
          await tabWalk(page, 25, `after opening "${info.text}"`, width);
        }
        // One level down: the controls inside a dialog this control opened, each on a fresh replay.
        if (st.modal && !before.modal) {
          const inner = (await ev(page, () => { const m = window.__lint.modal(); m.setAttribute('data-op-modal', '1'); return window.__op.pick('[data-op-modal]').length; })) || 0;
          for (let j = 0; j < Math.min(inner, 8); j++) {
            await load(page);
            const again = await mark(page, i);
            if (!again) break;
            if (!(await press(page, again, width, false))) break;
            await after(page);
            const ok2 = await ev(page, () => { const m = window.__lint.modal(); if (!m) return false; m.setAttribute('data-op-modal', '1'); return true; });
            if (!ok2) break;
            const info2 = await mark(page, j, '[data-op-modal]');
            if (!info2) continue;
            const before2 = await state(page);
            const s0 = await ev(page, () => window.__op.snap());
            if (!(await press(page, info2, width, false))) continue;
            await after(page);
            const s1 = await ev(page, () => window.__op.snap());
            if (s1 !== null && s1 === s0) { once('dead-control', 'fail', `in the dialog from "${info.text}", clicking "${info2.text}" changes nothing`, { sel: info2.sel, width }); continue; }
            await reread(page, info2.text, before2, width);
          }
        }
      }

      // Steppers: number inputs with a pair of buttons.
      if (width === 1440) await steppers(page, load, ev, once, width);

      // Links drawn as buttons (a fill or a border): pressed state only, released off the link so nothing navigates.
      // Round 1's pressed primary was a link and read as disabled (delta E 6.5).
      if (width === 1440) {
        await load(page);
        const links = (await ev(page, () => [...document.querySelectorAll('a[href]')].filter((a) => {
          if (!window.__lint.visible(a) || window.__lint.inactive(a) || window.__lint.skipped(a, 'press-state')) return false;
          const s = getComputedStyle(a), bg = window.__op.rgb(s.backgroundColor);
          return bg[3] > 0.1 || (parseFloat(s.borderTopWidth) >= 1 && window.__op.rgb(s.borderTopColor)[3] > 0.1 && parseFloat(s.paddingLeft) >= 8);
        }).length)) || 0;
        for (let k = 0; k < Math.min(links, 20); k++) {
          const info = await ev(page, (k) => {
            document.querySelectorAll('[data-op]').forEach((e) => e.removeAttribute('data-op'));
            const a = [...document.querySelectorAll('a[href]')].filter((a) => {
              if (!window.__lint.visible(a) || window.__lint.inactive(a) || window.__lint.skipped(a, 'press-state')) return false;
              const s = getComputedStyle(a), bg = window.__op.rgb(s.backgroundColor);
              return bg[3] > 0.1 || (parseFloat(s.borderTopWidth) >= 1 && window.__op.rgb(s.borderTopColor)[3] > 0.1 && parseFloat(s.paddingLeft) >= 8);
            })[k];
            if (!a) return null;
            a.setAttribute('data-op', '1');
            return { sel: window.__lint.sel(a), text: a.innerText.replace(/\s+/g, ' ').trim().slice(0, 40), button: true, skipPress: false };
          }, k);
          if (!info) continue;
          await press(page, info, width, true, true);
          await page.mouse.move(0, 0);
        }
      }
    } finally {
      await context.close();
    }
  }

  // Disclosures again under reduced motion: the open state must survive the removal of the movement.
  {
    const { context, page } = await open(1440, 'reduce');
    try {
      await load(page);
      const list = (await ev(page, () => window.__op.pick().map((el, i) => (el.matches('summary, [aria-expanded="false"]') && !window.__lint.skipped(el, 'disclosure') ? i : -1)).filter((i) => i >= 0))) || [];
      for (const i of list.slice(0, 20)) {
        await load(page);
        const info = await mark(page, i);
        if (!info) continue;
        await calm(page);
        const img0 = await shot(page);
        if (!(await press(page, info, 1440, false))) continue;
        await after(page);
        await calm(page);
        const img1 = await shot(page);
        if (img0 && img1 && (await alike(page, img0, img1))) once('disclosure', 'fail', `under reduced motion, "${info.text}" looks the same open as closed; remove the transition, not the end state`, { sel: info.sel, width: 1440 });
      }
    } finally {
      await context.close();
    }
  }
  return log;
}

async function steppers(page, load, ev, once, width) {
  const found = (await ev(page, () => {
    const out = [];
    for (const input of document.querySelectorAll('input[type=number], [role=spinbutton]')) {
      if (!window.__lint.visible(input) || window.__lint.skipped(input, 'stepper')) continue;
      let box = input.parentElement, buttons = [];
      for (let k = 0; k < 4 && box; k++, box = box.parentElement) {
        buttons = [...box.querySelectorAll('button, [role=button]')].filter((b) => window.__lint.visible(b));
        if (buttons.length >= 2) break;
      }
      if (buttons.length < 2) continue;
      const name = (b) => (b.getAttribute('aria-label') || b.innerText || '').trim();
      let inc = buttons.find((b) => /\b(more|increase|add|plus|up|increment)\b|^\+$/i.test(name(b)));
      let dec = buttons.find((b) => /\b(fewer|less|decrease|remove|minus|down|decrement)\b|^[−-]$/i.test(name(b)));
      dec = dec || buttons[0]; inc = inc || buttons[buttons.length - 1];
      if (inc === dec) continue;
      const id = 'op-step-' + out.length;
      input.setAttribute('data-op-input', id); inc.setAttribute('data-op-inc', id); dec.setAttribute('data-op-dec', id); box.setAttribute('data-op-box', id);
      out.push({ id, sel: window.__lint.sel(input), inc: name(inc), dec: name(dec), min: input.getAttribute('min') ?? input.getAttribute('aria-valuemin'), max: input.getAttribute('max') ?? input.getAttribute('aria-valuemax'), step: Number(input.getAttribute('step')) || 1 });
    }
    return out;
  })) || [];
  const read = (id) => ev(page, (id) => {
    const i = document.querySelector(`[data-op-input="${id}"]`), box = document.querySelector(`[data-op-box="${id}"]`);
    const dis = (b) => b.disabled || b.getAttribute('aria-disabled') === 'true';
    const text = box.parentElement ? box.parentElement.innerText : box.innerText;
    return { v: Number(i.value ?? i.getAttribute('aria-valuenow')), text, incOff: dis(document.querySelector(`[data-op-inc="${id}"]`)), decOff: dis(document.querySelector(`[data-op-dec="${id}"]`)) };
  }, id);
  const tag = async () => { await load(page); return steppersRetag(page, ev, found); };
  for (const s of found) {
    await tag();
    const r0 = await read(s.id);
    if (!r0) continue;
    // One step each way.
    for (const [which, dir, name] of [['inc', 1, s.inc], ['dec', -1, s.dec]]) {
      await tag();
      const a = await read(s.id);
      if ((dir > 0 && s.max !== null && a.v >= Number(s.max)) || (dir < 0 && s.min !== null && a.v <= Number(s.min))) continue;
      try { await page.click(`[data-op-${which}="${s.id}"]`, { timeout: 1500 }); } catch { continue; }
      await page.waitForTimeout(250);
      const b = await read(s.id);
      if (!b) continue;
      if (b.v !== a.v + dir * s.step) once('stepper', 'fail', `"${name}" moves ${s.sel} from ${a.v} to ${b.v}, not ${a.v + dir * s.step}`, { sel: s.sel, width });
      else if (b.text === a.text) once('stepper', 'fail', `"${name}" changes ${s.sel} to ${b.v} but none of the text around it changes; the output is stale after the action`, { sel: s.sel, width });
    }
    // The bounds: typed max and min.
    for (const [bound, val] of [['max', s.max], ['min', s.min]]) {
      if (val === null || val === '') continue;
      await tag();
      try { await page.fill(`[data-op-input="${s.id}"]`, String(val)); await page.press(`[data-op-input="${s.id}"]`, 'Tab'); } catch { continue; }
      await page.waitForTimeout(250);
      const r = await read(s.id);
      if (!r) continue;
      const wrong = bound === 'max' ? r.decOff : r.incOff, right = bound === 'max' ? r.incOff : r.decOff;
      const wrongName = bound === 'max' ? s.dec : s.inc, rightName = bound === 'max' ? s.inc : s.dec;
      if (wrong) once('stepper', 'fail', `at the ${bound} (${val}) "${wrongName}" disables and "${rightName}" ${right ? 'also does' : 'stays enabled'}; the button that would leave the range is the one that disables`, { sel: s.sel, width });
      else if (!right) once('stepper', 'warn', `at the ${bound} (${val}) "${rightName}" stays enabled; disable it so the limit is visible`, { sel: s.sel, width });
    }
  }
}

// Re-apply the stepper markers after a reload, in the same order as found.
async function steppersRetag(page, ev, found) {
  return ev(page, (n) => {
    let k = 0;
    for (const input of document.querySelectorAll('input[type=number], [role=spinbutton]')) {
      if (!window.__lint.visible(input) || window.__lint.skipped(input, 'stepper')) continue;
      let box = input.parentElement, buttons = [];
      for (let j = 0; j < 4 && box; j++, box = box.parentElement) {
        buttons = [...box.querySelectorAll('button, [role=button]')].filter((b) => window.__lint.visible(b));
        if (buttons.length >= 2) break;
      }
      if (buttons.length < 2 || k >= n) continue;
      const name = (b) => (b.getAttribute('aria-label') || b.innerText || '').trim();
      const inc = buttons.find((b) => /\b(more|increase|add|plus|up|increment)\b|^\+$/i.test(name(b))) || buttons[buttons.length - 1];
      const dec = buttons.find((b) => /\b(fewer|less|decrease|remove|minus|down|decrement)\b|^[−-]$/i.test(name(b))) || buttons[0];
      if (inc === dec) continue;
      const id = 'op-step-' + k++;
      input.setAttribute('data-op-input', id); inc.setAttribute('data-op-inc', id); dec.setAttribute('data-op-dec', id); box.setAttribute('data-op-box', id);
    }
    return k;
  }, found.length);
}

// CLI.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const valueFlags = new Set(['--json', '--states', '--max']);
  const target = args.find((a, i) => !a.startsWith('--') && !valueFlags.has(args[i - 1]));
  if (!target) { console.error('Usage: node tools/operate.mjs <html[?query]> [--states state=a,state=b] [--json out.json] [--log] [--max 60] [--quiet]'); process.exit(2); }
  const flag = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
  const states = (flag('--states') || '').split(',').filter(Boolean);
  const withQuery = (t, s) => { const q = t.indexOf('?'); const p = new URLSearchParams(q === -1 ? '' : t.slice(q + 1)); for (const [k, v] of new URLSearchParams(s)) p.set(k, v); const qs = p.toString(); return (q === -1 ? t : t.slice(0, q)) + (qs ? '?' + qs : ''); };
  const browser = await launch();
  const all = [];
  let fails = 0;
  try {
    for (const t of [target, ...states.map((s) => withQuery(target, s))]) {
      const checks = {};
      const add = (c, level, message, d) => { checks[c] ??= { fail: [], warn: [], pass: true }; if (level === 'fail') checks[c].pass = false; checks[c][level].push({ message, ...(d || {}) }); };
      const ok = (c) => { checks[c] ??= { fail: [], warn: [], pass: true }; };
      const log = await operatePass(browser, t, add, ok, { log: args.includes('--log'), max: Number(flag('--max') || 60) });
      const f = Object.values(checks).reduce((n, c) => n + c.fail.length, 0), w = Object.values(checks).reduce((n, c) => n + c.warn.length, 0);
      fails += f;
      all.push({ target: t, checks, log });
      if (!args.includes('--quiet')) {
        console.log(`Operated checks: ${t}  ->  ${f ? 'FAIL' : 'PASS'} (${f} fail, ${w} warn)\n`);
        for (const [c, r] of Object.entries(checks)) {
          console.log(`  ${r.pass ? (r.warn.length ? 'warn' : 'pass') : 'FAIL'}  ${c}`);
          for (const x of [...r.fail, ...r.warn]) console.log(`        ${r.fail.includes(x) ? 'x' : '!'} ${x.message}${x.sel ? '  [' + x.sel + ']' : ''}`);
        }
        if (log) for (const e of log) console.log(`\n  ${e.width}px "${e.action}"\n${e.added.map((l) => '    + ' + l).join('\n')}\n${e.removed.map((l) => '    - ' + l).join('\n')}`);
        console.log('');
      }
    }
  } finally {
    await browser.close();
  }
  if (flag('--json')) fs.writeFileSync(flag('--json'), JSON.stringify(all, null, 2));
  process.exit(fails ? 1 : 0);
}
