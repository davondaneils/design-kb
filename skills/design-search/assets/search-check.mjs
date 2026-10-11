#!/usr/bin/env node
// search-check: the design-search page gate, run on a built HTML page (local file or URL).
// Validates JSON-LD locally (JSON parse, JSON-LD shape, schema.org vocabulary, Google feature requirements,
// visible-content match) and checks titles, meta, canonical, robots, headings, links, Open Graph and head order.
//
// Usage (from the repo root):
//   node skills/design-search/assets/search-check.mjs <page.html> [--expect public|private]
//        [--base https://example.com/] [--assets <dir>] [--json out.json] [--quiet]
//   --expect private  for pages behind a login: noindex required, no structured data, no social card with private data.
//   --base            the production origin the page will live on (to resolve relative og:image and canonical checks).
//   --assets          local folder that holds the files the base URL serves (to measure og:image and favicon files).
// Exit code 1 on any fail. Warnings never fail.
// Sources and dates for every rule: skills/design-search/references/07-page-build.md (facts checked 2026-10-10).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { launch, toUrl, splitTarget } = await import(path.join(here, '../../../tools/browser.mjs'));
const vocab = JSON.parse(fs.readFileSync(path.join(here, 'schemaorg-vocab.json'), 'utf8'));

const args = process.argv.slice(2);
const opt = { expect: 'public', base: null, assets: null, json: null, quiet: false };
const targets = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--expect') opt.expect = args[++i];
  else if (a === '--base') opt.base = args[++i];
  else if (a === '--assets') opt.assets = args[++i];
  else if (a === '--json') opt.json = args[++i];
  else if (a === '--quiet') opt.quiet = true;
  else targets.push(a);
}
if (!targets.length) { console.error('Usage: node search-check.mjs <page.html> [--expect public|private] [--base URL] [--assets dir] [--json out] [--quiet]'); process.exit(2); }

const report = { file: targets[0], expect: opt.expect, date: new Date().toISOString(), checks: {} };
const check = (name) => (report.checks[name] ??= { fail: [], warn: [], info: [] });
const fail = (c, m, x = {}) => check(c).fail.push({ message: m, ...x });
const warn = (c, m, x = {}) => check(c).warn.push({ message: m, ...x });
const info = (c, m, x = {}) => check(c).info.push({ message: m, ...x });

// ---------- schema.org helpers ----------
const DATATYPES = new Set(['Text', 'URL', 'Number', 'Integer', 'Float', 'Date', 'DateTime', 'Time', 'Boolean', 'CssSelectorType', 'XPathType', 'PronounceableText', 'DataType']);
const strip = (t) => String(t).replace(/^(https?:\/\/schema\.org\/|schema:)/, '');
function ancestors(t, seen = new Set()) {
  if (seen.has(t)) return seen;
  seen.add(t);
  for (const p of vocab.types[t] || []) ancestors(p, seen);
  return seen;
}
const isA = (t, parent) => ancestors(t).has(parent);
function propApplies(prop, types) {
  const d = vocab.props[prop]?.d || [];
  return types.some((t) => d.some((dom) => isA(t, dom)));
}
function rangeOk(prop, value) {
  const r = vocab.props[prop]?.r || [];
  if (!r.length) return true;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    if (r.some((x) => DATATYPES.has(x) || isA(x, 'DataType'))) return true;
    const member = strip(value);
    if (vocab.members[member]) return vocab.members[member].some((enumType) => r.some((x) => isA(enumType, x)));
    return 'loose'; // a string where a Thing is expected: schema.org allows it, Google features often do not
  }
  if (value && typeof value === 'object') {
    if (value['@id'] && Object.keys(value).length === 1) return true; // reference, checked separately
    const vt = [].concat(value['@type'] || []).map(strip);
    if (!vt.length) return 'untyped';
    return vt.some((t) => r.some((x) => isA(t, x)));
  }
  return true;
}

// Google rich result requirements, as documented on 2026-10-10 (see reference 07 for quotes and URLs).
const googleRules = {
  Product: (n, ctx) => {
    if (!n.name) ctx.fail('Product: `name` is required');
    if (!n.offers && !n.review && !n.aggregateRating) ctx.fail('Product: needs `offers`, `review` or `aggregateRating`');
    if (n.offers && !n.image) ctx.fail('Product with offers (merchant listing): `image` is required');
  },
  Offer: (n, ctx) => {
    const price = n.price ?? n.priceSpecification?.price;
    const cur = n.priceCurrency ?? n.priceSpecification?.priceCurrency;
    if (price === undefined) ctx.fail('Offer: `price` (or priceSpecification.price) is required');
    else if (!(Number(price) > 0)) ctx.fail('Offer: merchant listings need a price greater than zero');
    if (!cur) ctx.fail('Offer: `priceCurrency` is required');
    if (typeof price === 'string' && /[^0-9.]/.test(price)) ctx.fail('Offer: `price` must be a number with a dot decimal, no currency symbol');
    if (!n.availability) ctx.warn('Offer: `availability` recommended');
  },
  LocalBusiness: (n, ctx) => {
    if (!n.name) ctx.fail('LocalBusiness: `name` is required');
    if (!n.address) ctx.fail('LocalBusiness: `address` is required');
    const g = n.geo;
    if (g) for (const k of ['latitude', 'longitude']) {
      const dec = (String(g[k] ?? '').split('.')[1] || '').length;
      if (dec < 5) ctx.warn(`LocalBusiness: geo.${k} should have at least 5 decimal places (has ${dec})`);
    }
    if (n.url && !/^https?:\/\//.test(n.url)) ctx.fail('LocalBusiness: `url` must be fully qualified');
  },
  Organization: (n, ctx) => {
    if (!n.name) ctx.warn('Organization: `name` recommended');
    if (!n.logo) ctx.warn('Organization: `logo` recommended (at least 112x112px)');
    if (n.url && !/^https?:\/\//.test(n.url)) ctx.fail('Organization: `url` must be absolute');
  },
  WebSite: (n, ctx) => {
    if (!n.name) ctx.fail('WebSite (site name): `name` is required');
    if (!n.url) ctx.fail('WebSite (site name): `url` is required');
  },
  FAQPage: (n, ctx) => ctx.warn('FAQPage: FAQ rich results were removed from Google Search on 2026-05-07. Keep only if the visible page is a real FAQ; it earns no rich result'),
  HowTo: (n, ctx) => ctx.warn('HowTo: rich results deprecated (2023). No payoff in Google Search'),
};

// ---------- run ----------
const target = targets[0];
const { file } = splitTarget(target);
const raw = /^https?:/.test(target) ? null : fs.readFileSync(file, 'utf8');
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(toUrl(target), { waitUntil: 'load' });

const dom = await page.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const meta = (n) => q(`meta[name="${n}"], meta[property="${n}"]`).map((m) => m.getAttribute('content'));
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('.sr-only'); };
  // Largest visible text in the first screen, to compare with the H1.
  let biggest = { size: 0, text: '' };
  for (const el of q('body *')) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight || !visible(el)) continue;
    const s = parseFloat(getComputedStyle(el).fontSize);
    if (s > biggest.size) biggest = { size: s, text: el.textContent.trim().slice(0, 60), inH1: !!el.closest('h1') };
  }
  return {
    lang: document.documentElement.lang,
    titles: q('title').map((t) => t.textContent),
    descriptions: meta('description'),
    robots: meta('robots').concat(meta('googlebot')),
    canonicals: q('link[rel~="canonical"]').map((l) => l.getAttribute('href')),
    icons: q('link[rel~="icon"], link[rel="apple-touch-icon"]').map((l) => ({ rel: l.rel, href: l.getAttribute('href'), type: l.type, sizes: l.getAttribute('sizes') })),
    og: Object.fromEntries(q('meta[property^="og:"], meta[name^="twitter:"]').map((m) => [m.getAttribute('property') || m.getAttribute('name'), m.getAttribute('content')])),
    headings: q('h1,h2,h3,h4,h5,h6').map((h) => ({ level: +h.tagName[1], text: h.textContent.replace(/\s+/g, ' ').trim(), visible: visible(h), size: parseFloat(getComputedStyle(h).fontSize), inFooter: !!h.closest('footer') })),
    biggest,
    links: q('a').map((a) => ({ href: a.getAttribute('href'), text: (a.getAttribute('aria-label') || a.textContent).replace(/\s+/g, ' ').trim(), nav: !!a.closest('nav, header, footer') })),
    jsonld: q('script[type="application/ld+json"]').map((s) => s.textContent),
    text: document.body.innerText.replace(/\s+/g, ' '),
    times: q('time').map((t) => ({ dt: t.getAttribute('datetime'), text: t.textContent })),
    relDates: (() => {
      const out = [];
      const re = /\b(today|tomorrow|yesterday|this (week|weekend|month|friday|monday|tuesday|wednesday|thursday|saturday|sunday)|(on |roasted |ships? |by )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent;
        const m = t.match(re);
        if (!m) continue;
        const p = n.parentElement;
        if (p.closest('time[datetime], script, style, [aria-hidden="true"]')) continue;
        out.push({ phrase: m[0], context: t.trim().slice(0, 80) });
      }
      return out;
    })(),
  };
});
await browser.close();

const hasNoindex = dom.robots.some((r) => /noindex|none/i.test(r || ''));
const absolute = (u) => /^https:\/\//.test(u || '');

// Size and head order (byte offsets in the raw file).
if (raw) {
  const bytes = Buffer.byteLength(raw);
  if (bytes > 2 * 1024 * 1024) fail('size', `HTML is ${(bytes / 1048576).toFixed(2)} MB uncompressed; Googlebot reads only the first 2 MB (Google, Googlebot doc, updated 2026-02-03)`);
  else if (bytes > 1024 * 1024) warn('size', `HTML is ${(bytes / 1048576).toFixed(2)} MB uncompressed; inlined fonts and images count toward Googlebot's 2 MB cut`);
  else info('size', `HTML ${(bytes / 1024).toFixed(0)} KB uncompressed (Googlebot cut: 2 MB)`);
  const headEnd = raw.search(/<\/head>/i);
  const firstBig = (() => { const re = /<(style|script)\b[^>]*>([\s\S]*?)<\/\1>/gi; let m; while ((m = re.exec(raw))) if (m[2].length > 4096 && !/ld\+json/.test(m[0].slice(0, 80))) return m.index; return -1; })();
  const tags = [...raw.matchAll(/<(title|meta|link)\b[^>]*>/gi)].filter((m) => m.index < headEnd && /<title|name="(description|robots)"|property="og:|name="twitter:|rel="canonical"/i.test(m[0]));
  const late = tags.filter((m) => firstBig !== -1 && m.index > firstBig);
  if (late.length) warn('head-order', `${late.length} search or social tags come after a large inline <style>/<script> (byte ${firstBig}). Link unfurlers read as little as they can (Slackbot uses Range requests); put title, description, canonical, robots and og/twitter tags first in <head>`, { tags: late.map((m) => m[0].slice(0, 60)) });
  else info('head-order', `search and social tags end by byte ${tags.length ? tags.at(-1).index : 0}${firstBig !== -1 ? `, before the first large inline block at byte ${firstBig}` : ''}`);
}

if (!dom.lang) fail('lang', '<html> has no lang');

if (opt.expect === 'private') {
  // App behind login: keep it out, keep it quiet.
  if (!hasNoindex) fail('robots', 'private page without meta robots noindex. Auth is the real control; noindex (meta here, X-Robots-Tag on every app response) is the backstop if a URL ever answers without auth');
  else info('robots', `robots: ${dom.robots.join(', ')}`);
  if (dom.jsonld.length) fail('structured-data', 'structured data on a private page: nothing to earn, and it can leak workspace data to any fetcher');
  const ogKeys = Object.keys(dom.og);
  if (ogKeys.length) warn('social', `social tags on a private page (${ogKeys.join(', ')}): unfurlers that get past auth would show workspace data. Serve a generic brand card from the login page instead`);
  if (dom.canonicals.length) warn('canonical', 'canonical on a noindexed private page is unused');
  info('title', `title "${dom.titles[0] || ''}" (shows in tabs, history and shared bookmarks; keep workspace secrets out of it)`);
} else {
  // ---- Title ----
  if (dom.titles.length !== 1) fail('title', `${dom.titles.length} <title> elements, want 1`);
  const title = (dom.titles[0] || '').trim();
  if (!title) fail('title', 'empty title');
  else {
    info('title', `"${title}" (${title.length} chars)`);
    if (title.length > 65) warn('title', `title is ${title.length} characters; Google truncates to the device width (no fixed limit), so put the distinguishing words first`);
    const words = title.toLowerCase().match(/[a-z]{4,}/g) || [];
    const dup = words.filter((w, i) => words.indexOf(w) !== i);
    if (dup.length) warn('title', `repeated words in title: ${[...new Set(dup)].join(', ')}`);
  }
  // ---- Description ----
  if (dom.descriptions.length !== 1) fail('description', `${dom.descriptions.length} meta descriptions, want 1`);
  else {
    const d = dom.descriptions[0] || '';
    info('description', `${d.length} chars`);
    if (d.length < 70 || d.length > 160) warn('description', `meta description is ${d.length} characters; about 120 to 160 shows whole on most results (practitioner, Google sets no limit)`);
    if (!/\d/.test(d)) warn('description', 'no number in the description: lead with comparable facts (price, place, date, spec)');
  }
  // ---- Robots ----
  if (hasNoindex) fail('robots', `public page carries noindex (${dom.robots.join(', ')})`);
  if (!dom.robots.some((r) => /max-image-preview:large/i.test(r || ''))) warn('robots', 'no max-image-preview:large: Google may show only a small thumbnail from this page');
  // ---- Canonical ----
  if (dom.canonicals.length !== 1) fail('canonical', `${dom.canonicals.length} canonical links, want exactly 1`);
  else if (!absolute(dom.canonicals[0])) fail('canonical', `canonical "${dom.canonicals[0]}" is not an absolute https URL`);
  const canonical = dom.canonicals[0];
  // ---- Headings ----
  const h1 = dom.headings.filter((h) => h.level === 1);
  if (h1.length !== 1) fail('headings', `${h1.length} h1 elements, want 1`);
  else if (!h1[0].visible) fail('headings', 'the h1 is not visible');
  if (h1.length && dom.biggest.size > h1[0].size + 0.5 && !dom.biggest.inH1) warn('headings', `text "${dom.biggest.text}" (${dom.biggest.size}px) is bigger than the h1 (${h1[0].size}px) in the first screen`);
  let prev = 0;
  for (const h of dom.headings) {
    if (!h.text) fail('headings', `empty h${h.level}`);
    if (prev && h.level > prev + 1) fail('headings', `heading level skips from h${prev} to h${h.level}: "${h.text.slice(0, 50)}"`);
    prev = h.level;
  }
  info('headings', dom.headings.map((h) => '  '.repeat(h.level - 1) + `h${h.level} ${h.text.slice(0, 70)}`).join('\n'));
  // ---- Links ----
  const dead = dom.links.filter((l) => !l.href || l.href === '#' || /^javascript:/i.test(l.href));
  if (dead.length) fail('links', `${dead.length} links with no real destination (href "#", empty or javascript:). Crawlers follow only real <a href> URLs`, { examples: dead.slice(0, 8).map((l) => l.text) });
  const vague = dom.links.filter((l) => /^(click here|here|read more|learn more|more|link|see more)$/i.test(l.text));
  if (vague.length) warn('links', `${vague.length} vague anchors: ${vague.map((l) => l.text).join(', ')}`);
  const inPage = dom.links.filter((l) => l.nav && /^#./.test(l.href || ''));
  if (inPage.length) warn('links', `${inPage.length} header/footer links point to #fragments, so the site's hub pages get no sitewide links: ${inPage.map((l) => l.text).join(', ')}`);
  info('links', `${dom.links.length} links, ${new Set(dom.links.map((l) => l.href)).size} unique destinations`);
  // ---- Dates ----
  if (dom.relDates.length) warn('dates', `${dom.relDates.length} relative dates outside <time datetime>: a quoted passage loses its week. ${dom.relDates.map((d) => `"${d.phrase}"`).join(', ')}`);
  // Valid machine dates: a date (2026-10-06), a date and time, or a week (2026-W41), per the HTML time element.
  for (const t of dom.times) if (!t.dt || !/^\d{4}-(\d{2}-\d{2}|W\d{2}$)/.test(t.dt)) fail('dates', `<time> "${t.text}" without a machine-readable datetime`);
  // ---- Social cards ----
  const og = dom.og;
  for (const k of ['og:title', 'og:type', 'og:image', 'og:url']) if (!og[k]) fail('social', `missing ${k} (one of the four required Open Graph properties)`);
  if (og['og:url'] && canonical && og['og:url'] !== canonical) fail('social', `og:url (${og['og:url']}) differs from the canonical (${canonical})`);
  if (og['og:image'] && !absolute(og['og:image'])) fail('social', 'og:image must be an absolute https URL: unfurlers do not resolve relative paths reliably');
  if (og['og:image'] && !og['og:image:alt']) fail('social', 'og:image without og:image:alt');
  if (og['og:image'] && (!og['og:image:width'] || !og['og:image:height'])) warn('social', 'og:image:width and og:image:height missing: first shares may render without the image until it is fetched');
  if (!og['twitter:card']) warn('social', 'no twitter:card; X falls back to a small summary card');
  if (og['og:image'] && opt.base && opt.assets) {
    const rel = og['og:image'].replace(opt.base, '');
    const p = path.join(opt.assets, rel);
    if (!fs.existsSync(p)) fail('social', `og:image file not found locally at ${p}`);
    else {
      const b = fs.readFileSync(p);
      const png = b.slice(1, 4).toString() === 'PNG';
      const w = png ? b.readUInt32BE(16) : 0, h = png ? b.readUInt32BE(20) : 0;
      if (png) {
        info('social', `og:image ${w}x${h}, ${(b.length / 1024).toFixed(0)} KB`);
        if (og['og:image:width'] && +og['og:image:width'] !== w) fail('social', `og:image:width says ${og['og:image:width']}, file is ${w}`);
        if (og['og:image:height'] && +og['og:image:height'] !== h) fail('social', `og:image:height says ${og['og:image:height']}, file is ${h}`);
        if (w < 1200) warn('social', `og:image is ${w}px wide; 1200px wide is the common safe size`);
        if (Math.abs(w / h - 1.91) > 0.05) warn('social', `og:image ratio ${(w / h).toFixed(2)}:1; 1.91:1 (1200x630) is the shared default`);
      }
      if (b.length > 1024 * 1024) warn('social', `og:image is ${(b.length / 1048576).toFixed(1)} MB: unfurlers fetch it on demand, keep it under 1 MB (opinion; platform caps are not documented in sources fetchable on 2026-10-10)`);
    }
  }
  // ---- Favicon ----
  if (!dom.icons.length) warn('favicon', 'no icon link; Google shows a favicon next to every result');
  else if (!dom.icons.some((i) => !/\.svg(\?|$)/i.test(i.href || ''))) warn('favicon', 'only an SVG icon: Google Search lists BMP, GIF, ICO, PNG, JPEG, PPM and TIFF (doc updated 2026-08-28). Add a PNG at a multiple of 48px');
}

// ---------- JSON-LD ----------
const nodes = [];
dom.jsonld.forEach((txt, i) => {
  let data;
  try { data = JSON.parse(txt); } catch (e) { fail('structured-data', `block ${i + 1}: JSON parse error: ${e.message}`); return; }
  const roots = [].concat(data);
  for (const r of roots) {
    const ctx = r['@context'];
    if (!ctx || !/schema\.org/.test(JSON.stringify(ctx))) fail('structured-data', `block ${i + 1}: @context is not schema.org`);
    if (typeof ctx === 'string' && /^http:/.test(ctx)) warn('structured-data', `block ${i + 1}: use https://schema.org`);
    const walk = (n, where) => {
      if (Array.isArray(n)) return n.forEach((x, j) => walk(x, `${where}[${j}]`));
      if (!n || typeof n !== 'object') return;
      if (n['@type']) nodes.push({ node: n, where });
      for (const [k, v] of Object.entries(n)) if (!k.startsWith('@') || k === '@graph') walk(v, `${where}.${k}`);
    };
    walk(r['@graph'] || r, `block${i + 1}`);
  }
});
if (opt.expect !== 'private' && !dom.jsonld.length) warn('structured-data', 'no JSON-LD');
// Optional full JSON-LD 1.1 expansion (npm ci in this folder). Offline: the schema.org context is stubbed to @vocab,
// which is how schema.org's own context maps terms. Catches what JSON.parse cannot: bad @id, @type or keyword use.
let jsonld = null;
try { jsonld = (await import(path.join(here, 'node_modules/jsonld/lib/index.js'))).default; } catch { /* optional */ }
if (jsonld && dom.jsonld.length) {
  const documentLoader = async (url) => {
    if (/^https?:\/\/schema\.org\/?$/.test(url)) return { contextUrl: null, documentUrl: url, document: { '@context': { '@vocab': 'https://schema.org/' } } };
    throw new Error(`offline: refusing to load ${url}`);
  };
  for (const [i, txt] of dom.jsonld.entries()) {
    try { JSON.parse(txt); } catch { continue; } // already reported as a parse error
    try {
      const expanded = await jsonld.expand(JSON.parse(txt), { documentLoader, safe: true });
      const quads = await jsonld.toRDF(expanded, { format: 'application/n-quads', safe: true });
      info('structured-data', `block ${i + 1}: JSON-LD 1.1 expansion ok (jsonld.js, safe mode), ${quads.trim().split('\n').length} triples`);
    } catch (e) { fail('structured-data', `block ${i + 1}: JSON-LD expansion error: ${e.message.split('\n')[0]}`); }
  }
} else if (dom.jsonld.length) info('structured-data', 'jsonld.js not installed: run npm ci in skills/design-search/assets for the expansion check');
const ids = new Map();
for (const { node } of nodes) if (node['@id']) {
  if (ids.has(node['@id'])) warn('structured-data', `@id ${node['@id']} defined twice; merge into one node`);
  ids.set(node['@id'], node);
}
const products = nodes.filter(({ node }) => [].concat(node['@type']).map(strip).some((t) => vocab.types[t] && isA(t, 'Product')));
const inList = products.filter(({ where }) => /itemListElement/.test(where));
if (products.length > 1 && inList.length === products.length) warn('structured-data', `${products.length} Products inside an ItemList: eligible only for Google's structured data carousels beta (EEA, Turkiye, South Africa; doc updated 2026-09-11), on a category page linking each detail page. Elsewhere it earns nothing`);
else if (products.length > 1) fail('structured-data', `${products.length} Product nodes on one page: Google product rich results only support pages that focus on a single product. Mark up each product page instead`);
const visibleText = dom.text.toLowerCase();
for (const { node, where } of nodes) {
  const types = [].concat(node['@type']).map(strip);
  const bad = types.filter((t) => !vocab.types[t]);
  if (bad.length) { fail('structured-data', `${where}: unknown type ${bad.join(', ')}`); continue; }
  for (const t of types) if (vocab.superseded[t]) warn('structured-data', `${where}: ${t} is superseded by ${vocab.superseded[t]}`);
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('@')) {
      if (k === '@id' && !/^https:\/\//.test(v)) warn('structured-data', `${where}: @id "${v}" is not an absolute URL; use canonical URL plus a #fragment`);
      continue;
    }
    if (!vocab.props[k]) { fail('structured-data', `${where}: unknown property "${k}" on ${types.join('/')}`); continue; }
    if (vocab.superseded[k]) warn('structured-data', `${where}: ${k} is superseded by ${vocab.superseded[k]}`);
    if (!propApplies(k, types)) fail('structured-data', `${where}: "${k}" is not a property of ${types.join('/')}`);
    for (const val of [].concat(v)) {
      const ok = rangeOk(k, val);
      if (ok === false) fail('structured-data', `${where}.${k}: value type ${[].concat(val['@type']).join('/')} not in range (${vocab.props[k].r.join(', ')})`);
      else if (ok === 'untyped') warn('structured-data', `${where}.${k}: nested object without @type`);
      else if (ok === 'loose' && !['url', 'sameAs', 'image', 'logo', 'item'].includes(k)) warn('structured-data', `${where}.${k}: text where ${vocab.props[k].r.join('/')} is expected`);
      if (val && typeof val === 'object' && val['@id'] && Object.keys(val).length === 1 && !ids.has(val['@id'])) info('structured-data', `${where}.${k}: reference ${val['@id']} is defined on another page`);
    }
  }
  // Google feature rules: apply the rule of every ancestor type that has one.
  const ctx = { fail: (m) => fail('google', `${where}: ${m}`), warn: (m) => warn('google', `${where}: ${m}`) };
  const ran = new Set();
  const local = types.some((t) => isA(t, 'LocalBusiness'));
  for (const t of types) for (const a of ancestors(t)) {
    if (!googleRules[a] || ran.has(a) || (a === 'Organization' && local)) continue; // a location node is judged by the LocalBusiness rules
    ran.add(a);
    googleRules[a](node, ctx);
  }
  // Markup must match visible content.
  const mustShow = [];
  if (typeof node.name === 'string' && !types.includes('WebSite')) mustShow.push(['name', node.name]);
  if (node.price !== undefined) mustShow.push(['price', String(node.price).replace(/\.00$/, '')]);
  if (typeof node.telephone === 'string') mustShow.push(['telephone', node.telephone]);
  if (typeof node.streetAddress === 'string') mustShow.push(['streetAddress', node.streetAddress]);
  for (const [k, v] of mustShow) {
    const norm = v.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!visibleText.includes(norm)) fail('visible-match', `${where}.${k} "${v}" does not appear in the visible page text`);
  }
}
info('structured-data', `${dom.jsonld.length} JSON-LD blocks, ${nodes.length} typed nodes: ${nodes.map(({ node }) => [].concat(node['@type']).join('/')).join(', ')}`);

// ---------- report ----------
let F = 0, W = 0;
for (const c of Object.values(report.checks)) { F += c.fail.length; W += c.warn.length; }
report.summary = { fail: F, warn: W, pass: F === 0 };
if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(report, null, 2));
if (!opt.quiet) {
  for (const [name, c] of Object.entries(report.checks)) {
    const st = c.fail.length ? 'FAIL' : c.warn.length ? 'warn' : 'pass';
    console.log(`${st.padEnd(4)} ${name}`);
    for (const f of c.fail) console.log(`     fail: ${f.message}${f.examples ? ' [' + f.examples.join(' | ') + ']' : ''}`);
    for (const w of c.warn) console.log(`     warn: ${w.message}`);
    for (const i of c.info) console.log(`     ${i.message.split('\n').join('\n     ')}`);
  }
}
console.log(`search-check ${report.summary.pass ? 'PASS' : 'FAIL'}: ${F} fail, ${W} warn (${opt.expect})`);
process.exit(F ? 1 : 0);
