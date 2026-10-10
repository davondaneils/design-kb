#!/usr/bin/env node
// Measure a live page's computed CSS for an exemplar teardown.
//
// Usage: node kb/teardowns/measure.mjs <url> <out.json> [--widths 1440,390]
//   Works on a local file too (a path or file: URL), which is how the head capture was tested while exemplar hosts
//   were blocked.
//
// Reads getComputedStyle on every visible element at each width (light scheme,
// motion allowed so transitions are reported), and writes one JSON file:
// type scale by characters set, colors by characters and by area, contrast of
// the main text pairs, radii, shadows, transitions, container widths, section
// padding, spacing values, root custom properties, headings and CTA copy.
// Head (once per URL, from the first width): Open Graph and Twitter card tags, JSON-LD blocks (parsed, with
// @type and parse errors), favicons and touch icons, canonical, robots, lang, viewport, theme-color, and the
// head order twice: as rendered (DOM after scripts) and as served (raw HTML, the crawler's first read), with the
// position of the title, description, canonical, first og tag, first JSON-LD, first stylesheet, first script and
// first inline block over 10 KB. Feeds design-search reference 07 (head order, social cards, favicons).
import fs from 'node:fs';
import path from 'node:path';
import { launch, toUrl, splitTarget } from '../../tools/browser.mjs';

const args = process.argv.slice(2);
const url = args[0];
const out = args[1];
const wi = args.indexOf('--widths');
const widths = wi > -1 ? args[wi + 1].split(',').map(Number) : [1440, 390];
if (!url || !out) { console.error('Usage: node kb/teardowns/measure.mjs <url> <out.json>'); process.exit(2); }

function collect() {
  const vw = window.innerWidth;
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const hex = (c) => { const p = parse(c); if (!p) return c; const h = (n) => Math.round(n).toString(16).padStart(2, '0'); return '#' + h(p.r) + h(p.g) + h(p.b) + (p.a < 1 ? ' a' + (+p.a.toFixed(2)) : ''); };
  const lum = (p) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(p.r) + 0.7152 * f(p.g) + 0.0722 * f(p.b); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const p = parse(getComputedStyle(e).backgroundColor); if (p && p.a > 0.5) return p; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const visible = (el, cs) => { if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const bump = (m, k, n = 1, ex) => { if (!m[k]) m[k] = { n: 0, ex }; m[k].n += n; };
  const top = (m, k = 20) => Object.entries(m).sort((a, b) => b[1].n - a[1].n).slice(0, k).map(([v, o]) => ({ v, n: Math.round(o.n), ex: o.ex }));

  const type = {}, fam = {}, textColor = {}, bgArea = {}, radii = {}, shadows = {}, trans = {}, anim = {}, maxw = {}, gaps = {}, pads = {}, margins = {}, borders = {}, pairs = {};
  const els = document.querySelectorAll('body *');
  for (const el of els) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'svg', 'path'].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (!visible(el, cs)) continue;
    const r = el.getBoundingClientRect();
    let own = '';
    for (const n of el.childNodes) if (n.nodeType === 3) own += n.textContent;
    own = own.replace(/\s+/g, ' ').trim();
    if (own.length) {
      const key = `${cs.fontSize} / lh ${cs.lineHeight} / w${cs.fontWeight} / ls ${cs.letterSpacing}`;
      bump(type, key, own.length, `${el.tagName.toLowerCase()}: ${own.slice(0, 60)}`);
      bump(fam, cs.fontFamily.split(',').slice(0, 2).join(','), own.length);
      bump(textColor, hex(cs.color), own.length);
      let fg = parse(cs.color); const bg = bgOf(el);
      if (fg && fg.a < 1) fg = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 };
      if (fg) { const k = `${hex(cs.color)} on ${hex(`rgb(${bg.r},${bg.g},${bg.b})`)}`; bump(pairs, k, own.length, +ratio(fg, bg).toFixed(2) + ':1'); }
    }
    const bgp = parse(cs.backgroundColor);
    if (bgp && bgp.a > 0) bump(bgArea, hex(cs.backgroundColor), (r.width * r.height) / 1000);
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) bump(bgArea, cs.backgroundImage.slice(0, 140), (r.width * r.height) / 1000);
    if (cs.borderRadius !== '0px') bump(radii, cs.borderRadius, 1, el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 30));
    if (cs.boxShadow !== 'none') bump(shadows, cs.boxShadow, 1, el.tagName.toLowerCase());
    if (cs.transitionDuration !== '0s') bump(trans, `${cs.transitionProperty.slice(0, 50)} ${cs.transitionDuration} ${cs.transitionTimingFunction}`, 1, el.tagName.toLowerCase());
    if (cs.animationName !== 'none') bump(anim, `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} x${cs.animationIterationCount}`, 1);
    if (cs.maxWidth !== 'none' && r.width > vw * 0.4) bump(maxw, `${cs.maxWidth} (rendered ${Math.round(r.width)}px)`, 1, el.tagName.toLowerCase());
    if (cs.rowGap !== 'normal' && cs.rowGap !== '0px') bump(gaps, cs.rowGap + (cs.columnGap !== cs.rowGap ? ' / col ' + cs.columnGap : ''), 1);
    for (const s of ['paddingTop', 'paddingBottom', 'paddingLeft']) if (cs[s] !== '0px') bump(pads, cs[s], 1);
    for (const s of ['marginTop', 'marginBottom']) if (cs[s] !== '0px' && !cs[s].startsWith('-')) bump(margins, cs[s], 1);
    if (cs.borderTopWidth !== '0px' && cs.borderTopStyle !== 'none') bump(borders, `${cs.borderTopWidth} ${hex(cs.borderTopColor)}`, 1);
  }
  // Sections: large blocks spanning most of the width.
  const sections = {};
  for (const el of document.querySelectorAll('section, main > *, footer, header')) {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (r.width > vw * 0.8 && r.height > 150) bump(sections, `pt ${cs.paddingTop} pb ${cs.paddingBottom}`, 1);
  }
  // Body copy measure: the longest paragraph set at 15px or larger (skips legal footnotes).
  let measure = null; let best = null;
  for (const p of document.querySelectorAll('p')) { const t = p.textContent.trim(); const cs = getComputedStyle(p); if (visible(p, cs) && parseFloat(cs.fontSize) >= 15 && t.length > (best ? best.textContent.trim().length : 80)) best = p; }
  if (best) {
    const range = document.createRange(); range.selectNodeContents(best);
    const tops = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
    const cs = getComputedStyle(best); const t = best.textContent.replace(/\s+/g, ' ').trim();
    measure = { text: t.slice(0, 120), chars: t.length, lines: tops.size, charsPerLine: Math.round(t.length / Math.max(1, tops.size)), width: Math.round(best.getBoundingClientRect().width), fontSize: cs.fontSize, lineHeight: cs.lineHeight, color: hex(cs.color) };
  }
  // Root custom properties (same-origin or CORS-enabled sheets only).
  const vars = {}; let blockedSheets = 0; let reducedMotionRules = 0;
  const walk = (rules) => { for (const rule of rules) {
    if (rule.media && /prefers-reduced-motion/.test(rule.media.mediaText)) reducedMotionRules++;
    if (rule.cssRules && !rule.selectorText) walk(rule.cssRules);
    if (rule.selectorText && /^(:root|html|body)\b/.test(rule.selectorText)) for (const prop of rule.style) if (prop.startsWith('--')) vars[prop] = rule.style.getPropertyValue(prop).trim().slice(0, 120);
  } };
  for (const s of document.styleSheets) { try { walk(s.cssRules); } catch { blockedSheets++; } }
  const txt = (sel, n) => [...document.querySelectorAll(sel)].filter((e) => visible(e, getComputedStyle(e))).map((e) => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, n);
  const ctas = [...document.querySelectorAll('a, button')].filter((e) => { const cs = getComputedStyle(e); const b = parse(cs.backgroundColor); return visible(e, cs) && ((b && b.a > 0.5) || cs.borderTopStyle !== 'none'); }).map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return `${e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40)} [${Math.round(r.width)}x${Math.round(r.height)} bg ${hex(cs.backgroundColor)} fg ${hex(cs.color)} r ${cs.borderRadius} pad ${cs.padding} ${cs.fontSize}/${cs.fontWeight}]`; }).filter((s) => !s.startsWith(' [')).slice(0, 14);
  const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`);
  const h1el = document.querySelector('h1');
  const h1Style = h1el ? (() => { const cs = getComputedStyle(h1el); const r = h1el.getBoundingClientRect(); return { font: `${cs.fontFamily.split(',')[0]} ${cs.fontSize}/${cs.lineHeight} w${cs.fontWeight} ls ${cs.letterSpacing}`, color: hex(cs.color), top: Math.round(r.top + scrollY), width: Math.round(r.width), align: cs.textAlign }; })() : null;
  return {
    width: vw, h1Style, title: document.title, description: document.querySelector('meta[name=description]')?.content || '',
    pageHeight: document.documentElement.scrollHeight, bodyBg: hex(getComputedStyle(document.body).backgroundColor), htmlBg: hex(getComputedStyle(document.documentElement).backgroundColor),
    fontsLoaded: [...new Set(fonts)].slice(0, 30), families: top(fam, 8), typeScale: top(type, 24), textColors: top(textColor, 12), contrastPairs: top(pairs, 12), backgrounds: top(bgArea, 12),
    borders: top(borders, 8), radii: top(radii, 12), shadows: top(shadows, 8), transitions: top(trans, 12), animations: top(anim, 8), maxWidths: top(maxw, 10), sections: top(sections, 10),
    gaps: top(gaps, 14), paddings: top(pads, 18), margins: top(margins, 14), measure, rootVars: Object.fromEntries(Object.entries(vars).slice(0, 160)), blockedSheets, reducedMotionRules,
    h1: txt('h1', 3), h2: txt('h2', 16), h3: txt('h3', 16), nav: txt('header a, nav a', 16), ctas,
    media: { img: document.images.length, svg: document.querySelectorAll('svg').length, video: document.querySelectorAll('video').length, canvas: document.querySelectorAll('canvas').length },
  };
}

// Head tags as rendered. Runs in the page.
function collectHead() {
  const h = document.head;
  const attr = (el, a) => el.getAttribute(a) || '';
  const meta = (sel) => [...h.querySelectorAll(sel)].map((m) => ({ key: attr(m, 'property') || attr(m, 'name'), content: attr(m, 'content').slice(0, 300) }));
  const og = meta('meta[property^="og:"], meta[name^="og:"]');
  const twitter = meta('meta[name^="twitter:"], meta[property^="twitter:"]');
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s, i) => {
    const raw = s.textContent.trim();
    try {
      const data = JSON.parse(raw);
      const types = [];
      const walk = (n) => { if (Array.isArray(n)) n.forEach(walk); else if (n && typeof n === 'object') { if (n['@type']) types.push([].concat(n['@type']).join('+')); Object.values(n).forEach(walk); } };
      walk(data);
      return { index: i, inHead: h.contains(s), bytes: raw.length, types: [...new Set(types)].slice(0, 20), context: (data && data['@context']) || null };
    } catch (err) { return { index: i, inHead: h.contains(s), bytes: raw.length, error: String(err).slice(0, 120) }; }
  });
  const icons = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"], link[rel="mask-icon"], link[rel="manifest"]')]
    .map((l) => ({ rel: attr(l, 'rel'), type: attr(l, 'type'), sizes: attr(l, 'sizes'), media: attr(l, 'media'), href: l.href.startsWith('data:') ? l.href.slice(0, 40) + '... (data URI)' : l.href }));
  const order = [...h.children].map((el, i) => {
    const t = el.tagName.toLowerCase();
    let label = t;
    if (t === 'meta') label += attr(el, 'charset') ? ' charset' : ` ${attr(el, 'name') || attr(el, 'property') || attr(el, 'http-equiv')}`;
    else if (t === 'link') label += ` ${attr(el, 'rel')}${attr(el, 'as') ? ' as=' + attr(el, 'as') : ''}`;
    else if (t === 'script') label += el.src ? ` src${el.async ? ' async' : ''}${el.defer ? ' defer' : ''}${el.type === 'module' ? ' module' : ''}` : ` inline${el.type ? ' ' + el.type : ''} ${el.textContent.length}B`;
    else if (t === 'style') label += ` ${el.textContent.length}B`;
    return `${i} ${label}`;
  });
  const idx = (pred) => { const i = [...h.children].findIndex(pred); return i < 0 ? null : i; };
  const kids = [...h.children];
  const positions = {
    count: kids.length,
    title: idx((e) => e.tagName === 'TITLE'),
    description: idx((e) => e.matches('meta[name=description]')),
    canonical: idx((e) => e.matches('link[rel=canonical]')),
    firstOg: idx((e) => e.matches('meta[property^="og:"]')),
    firstJsonLd: idx((e) => e.matches('script[type="application/ld+json"]')),
    firstStylesheet: idx((e) => e.matches('link[rel=stylesheet], style')),
    firstScript: idx((e) => e.matches('script:not([type="application/ld+json"])')),
    firstLargeInline: idx((e) => e.matches('style, script:not([src])') && e.textContent.length > 10000),
  };
  return {
    lang: document.documentElement.lang || null,
    title: document.title,
    description: h.querySelector('meta[name=description]')?.content || null,
    canonical: h.querySelector('link[rel=canonical]')?.href || null,
    robots: h.querySelector('meta[name=robots]')?.content || null,
    viewport: h.querySelector('meta[name=viewport]')?.content || null,
    themeColor: [...h.querySelectorAll('meta[name=theme-color]')].map((m) => ({ content: m.content, media: m.media || null })),
    colorScheme: h.querySelector('meta[name=color-scheme]')?.content || null,
    og, twitter, jsonld, icons, order: order.slice(0, 80), positions,
    headBytes: h.outerHTML.length, htmlBytes: document.documentElement.outerHTML.length,
  };
}

// Head order as served: the raw HTML before any script runs (what a crawler parses first).
function rawHeadOrder(html) {
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '';
  const tags = [...head.matchAll(/<(title|meta|link|script|style|base|noscript)\b([^>]*)>/gi)].map((m, i) => {
    const a = m[2];
    const get = (n) => (a.match(new RegExp(`${n}\\s*=\\s*["']([^"']*)["']`, 'i')) || [])[1] || '';
    const t = m[1].toLowerCase();
    if (t === 'meta') return `${i} meta ${get('charset') ? 'charset' : get('name') || get('property') || get('http-equiv')}`;
    if (t === 'link') return `${i} link ${get('rel')}`;
    if (t === 'script') return `${i} script ${get('src') ? 'src' : 'inline'}${get('type') ? ' ' + get('type') : ''}`;
    return `${i} ${t}`;
  });
  return { bytes: html.length, headBytes: head.length, order: tags.slice(0, 80), over2MB: html.length > 2 * 1024 * 1024 };
}

const browser = await launch();
const result = { url, measuredAt: new Date().toISOString(), method: 'Playwright Chromium, getComputedStyle on visible elements, light scheme, after scroll-through and fonts.ready', widths: {} };
try {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light', locale: 'en-US',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
    const page = await ctx.newPage();
    try {
      const resp = await page.goto(toUrl(url), { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.evaluate(async () => { const step = innerHeight; const max = Math.min(document.body.scrollHeight, 20000); for (let y = 0; y < max; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } scrollTo(0, 0); }).catch(() => {});
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
      const data = await page.evaluate(collect);
      result.widths[width] = { status: resp ? resp.status() : null, finalUrl: page.url(), ...data };
      if (!result.head) {
        result.head = await page.evaluate(collectHead).catch((err) => ({ error: String(err).slice(0, 200) }));
        let raw = /^https?:/.test(url) && resp ? await resp.text().catch(() => null) : null;
        if (!/^https?:/.test(url)) { try { raw = fs.readFileSync(splitTarget(url).file, 'utf8'); } catch { raw = null; } }
        result.head.served = raw ? rawHeadOrder(raw) : { error: 'no response body' };
      }
      console.log(`measured ${url} at ${width}: status ${resp && resp.status()}`);
    } catch (err) {
      result.widths[width] = { error: String(err).slice(0, 300) };
      console.error(`failed ${url} at ${width}: ${err}`);
    }
    await ctx.close();
  }
} finally { await browser.close(); }
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(result, null, 1));
