#!/usr/bin/env node
// Builds kb/tests/fresh/landing/halyard.html and halyard-states.html from page.html and states.html.
// One dataset (data.mjs) feeds every fragment, so every number on the page comes from one place:
// Saturday 24 October 2026, Lymington, BST. Sample data, labelled on the page.
// Usage: node kb/tests/fresh/landing/src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as D from './data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const asset = (f) => fs.readFileSync(path.join(here, 'assets', f));
const b64 = (f) => asset(f).toString('base64');

// ---------- helpers ----------
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const AX0 = mins(D.axis.from), AX1 = mins(D.axis.to), SPAN = AX1 - AX0;
const frac = (t) => (mins(t) - AX0) / SPAN;
const pct = (t) => +(frac(t) * 100).toFixed(2) + '%';
const nb = (s) => s.replace(/ /g, '&nbsp;');

// Icons: one 16px grid, 1.5 stroke, round caps and joins, currentColor (FOUNDATIONS Icons).
const ICONS = {
  pause: '<path d="M5.5 3.5v9M10.5 3.5v9"/>',
  play: '<path d="M5 3.5 12 8l-7 4.5z"/>',
  plus: '<path d="M8 3v10M3 8h10"/>',
  check: '<path d="m3.5 8.5 3 3 6-7"/>',
  minus: '<path d="M3.5 8h9"/>',
  warn: '<path d="M8 2.5 14 13H2z"/><path d="M8 6.5v3M8 11.5v.01"/>',
  menu: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/>',
  close: '<path d="m4 4 8 8M12 4l-8 8"/>',
  arrow: '<path d="M3 8h10M9 4l4 4-4 4"/>',
  phone: '<path d="M5 1.5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z"/><path d="M7 12.5h2"/>',
  bell: '<path d="M4 11.5V7a4 4 0 0 1 8 0v4.5l1 1H3z"/><path d="M6.5 14h3"/>',
  sun: '<path d="M8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1"/>',
  spinner: '<path d="M8 2a6 6 0 1 0 6 6"/>',
};
const icon = (n, cls = '') => `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${ICONS[n]}</svg>`;

// ---------- tide ----------
const tideExt = D.tides.map((x) => ({ t: mins(x.t) + (x.day || 0) * 1440, h: x.h }));
const tideAt = (t) => {
  for (let i = 0; i < tideExt.length - 1; i++) {
    const a = tideExt[i], b = tideExt[i + 1];
    if (t >= a.t && t <= b.t) return a.h + (b.h - a.h) * (1 - Math.cos(Math.PI * (t - a.t) / (b.t - a.t))) / 2;
  }
  return tideExt.at(-1).h;
};
// viewBox 0 0 900 100: x is minutes from 05:00, y maps 0 to 3.2 m onto 96 to 6.
const ty = (h) => +(96 - (h / 3.2) * 90).toFixed(2);
function tidePath() {
  const pts = [];
  for (let m = 0; m <= SPAN; m += 5) pts.push([m, ty(tideAt(AX0 + m))]);
  const line = 'M' + pts.map(([x, y]) => `${x} ${y}`).join('L');
  return { line, area: `${line}L${SPAN} 100L0 100Z` };
}
const TP = tidePath();
const tideSvg = (cls = '') => `<svg class="tide ${cls}" viewBox="0 0 ${SPAN} 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="tide__area" d="${TP.area}"/><path class="tide__line" d="${TP.line}"/></svg>`;

// ---------- lanes (HTML, one geometry for every fragment) ----------
const axisRow = (ticks = D.axis.ticks) => `<div class="axis">${ticks.map((t) => `<span style="--x:${pct(t)}">${t}</span>`).join('')}</div>`;

function tideTrack({ labels = true } = {}) {
  const hw = D.tides.find((x) => x.t === '10:58'), lw = D.tides.find((x) => x.t === '17:31');
  return `<div class="track track--tide" data-lane="tide">${tideSvg('g')}${labels ? `
      <span class="tag tag--top" style="--x:${pct(hw.t)}">HW ${hw.t} · ${nb(hw.h.toFixed(1) + ' m')}</span>
      <span class="tag tag--bot tag--end" style="--x:${pct(lw.t)}">LW ${lw.t} · ${nb(lw.h.toFixed(1) + ' m')}</span>` : ''}</div>`;
}
function streamTrack({ text = true, fair = '' } = {}) {
  return `<div class="track track--stream" data-lane="stream">${D.stream.map((s) => {
    const a = frac(s.from < D.axis.from ? D.axis.from : s.from), b = frac(s.to > D.axis.to ? D.axis.to : s.to);
    const isFair = fair && s.from === fair;
    return `<span class="seg seg--${s.dir.toLowerCase()}${isFair ? ' seg--fair' : ''}" style="--x0:${(a * 100).toFixed(2)}%;--x1:${(b * 100).toFixed(2)}%">${text && s.label ? `<b>${s.dir} ${nb(s.max + ' kn')}</b>` : ''}</span>`;
  }).join('')}</div>`;
}
function windTrack({ limit = true, from = 5, to = 19 } = {}) {
  const hours = D.wind.filter((w) => w.h >= from && w.h <= to);
  return `<div class="track track--wind" data-lane="wind">${limit ? `<span class="limit" style="--y:${(D.boat.wind / D.windMax * 100).toFixed(1)}%"></span>` : ''}${hours.map((w, i) => {
    const over = w.gust > D.boat.wind || (w.against && w.kn > D.boat.against);
    return `<span class="bar${over ? ' bar--over' : ''}" style="--x:${((w.h * 60 - AX0) / SPAN * 100).toFixed(2)}%;--w:${(60 / SPAN * 100).toFixed(3)}%;--v:${(w.kn / D.windMax).toFixed(3)};--g:${(w.gust / D.windMax).toFixed(3)};--i:${i}"></span>`;
  }).join('')}</div>`;
}
function lightTrack({ labels = true, latest = false } = {}) {
  return `<div class="track track--light" data-lane="light"><span class="night g" style="--x0:0%;--x1:${pct(D.sun.rise)}"></span><span class="night g" style="--x0:${pct(D.sun.set)};--x1:100%"></span>${labels ? `
      <span class="tag tag--low tag--start" style="--x:${pct(D.sun.rise)}">${icon('sun', 'icon--sm')}${D.sun.rise}</span>
      <span class="tag tag--low tag--end" style="--x:${pct(D.sun.set)}">${D.sun.set}</span>` : ''}${latest ? `
      <span class="mark" style="--x:${pct(D.latestLeave)}"></span>` : ''}</div>`;
}
function rowTrack(row) {
  const cuts = row.cuts.map((c) => `<i class="cut cut--${c.why}" style="--x0:${pct(c.from)};--x1:${pct(c.to)};--d:${frac(c.from).toFixed(3)}"></i>`).join('');
  return `<div class="track track--row">${cuts}<span class="win" style="--x0:${pct(row.win[0])};--x1:${pct(row.win[1])};--i:${row.i}"></span></div>`;
}

// The hero plot: lanes plus the two rows, with the sweep that the scene drives.
function heroPlot() {
  const rows = D.rows.map((r) => `
      <div class="row-head"><span class="row-name"><b>${r.name}</b> ${r.leg}</span><span class="slot row-slot"><span class="s-check">Checking</span><span class="s-win">Leave ${r.win[0]} to ${r.win[1]}</span></span></div>
      <span class="lab lab--row"></span>${rowTrack(r)}`).join('');
  return `<div class="plot">
      <span class="lab"></span>${axisRow()}
      <span class="lab">Tide</span>${tideTrack()}
      <span class="lab">Stream</span>${streamTrack({ fair: '' })}
      <span class="lab">Wind</span>${windTrack()}
      <span class="lab">Light</span>${lightTrack()}
      <span class="plot__rule"></span>${rows}
      <span class="sweep-lane" aria-hidden="true"><span class="sweep"></span></span>
    </div>`;
}
// Final band mini strip: rows only, still frame.
function miniPlot() {
  return `<div class="plot plot--mini">
      <span class="lab"></span>${axisRow()}
      <span class="lab">Light</span>${lightTrack({ labels: false })}
      ${D.rows.map((r) => `<span class="lab lab--row">${r.short}</span>${rowTrack(r)}`).join('')}
    </div>`;
}

// ---------- maps ----------
// Coverage map: plate carree scaled by cos(50.7 deg); x = (lon + 2.05) * 633, y = (50.95 - lat) * 1000.
const P = (lon, lat, x0 = -2.05, y0 = 50.95, k = 1000) => [+((lon - x0) * k * 0.633).toFixed(1), +((y0 - lat) * k).toFixed(1)];
const poly = (pts, f) => pts.map(([lo, la], i) => (i ? 'L' : 'M') + f(lo, la).join(' ')).join('') + 'Z';
function coverageMap() {
  const W = 842, H = 380;
  const f = (lo, la) => P(lo, la);
  const main = poly([...D.coast.mainland, [-0.72, 50.95], [-2.05, 50.95]], f);
  const iow = poly(D.coast.wight, f);
  const west = P(D.coverage.west, 0)[0], east = P(D.coverage.east, 0)[0];
  const stations = D.coverage.heights.map((s) => { const [x, y] = f(s.lon, s.lat); return `<circle class="stn" cx="${x}" cy="${y}" r="5"/>`; }).join('');
  const streams = D.coverage.streams.map((s) => { const [x, y] = f(s.lon, s.lat); return `<path class="dia" d="M${x} ${y - 7}L${x + 7} ${y}L${x} ${y + 7}L${x - 7} ${y}Z"/>`; }).join('');
  const labels = D.coverage.labels.map((l) => { const [x, y] = f(l.lon, l.lat); return `<span class="maplab${l.water ? ' maplab--water' : ''}${l.minor ? ' maplab--minor' : ''}${l.anchor ? ' maplab--' + l.anchor : ''}" style="--x:${(x / W * 100).toFixed(2)}%;--y:${(y / H * 100).toFixed(2)}%">${l.name}</span>`; }).join('');
  return `<div class="map" style="--ar:${W}/${H}">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
        <defs><pattern id="hatch-map" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="hatch-line" d="M0 0V8"/></pattern></defs>
        <path class="land" d="${main}"/><path class="land" d="${iow}"/>
        <rect class="off" x="0" y="0" width="${west}" height="${H}" fill="url(#hatch-map)"/>
        <rect class="off" x="${east}" y="0" width="${W - east}" height="${H}" fill="url(#hatch-map)"/>
        <path class="edge" d="M${west} 0V${H}M${east} 0V${H}"/>
        ${streams}${stations}
      </svg>
      ${labels}
    </div>`;
}
// Route chart: West Solent, x = (lon + 1.60) * 1266, y = (50.80 - lat) * 2000.
function routeChart() {
  const W = 443, H = 220;
  const f = (lo, la) => P(lo, la, -1.60, 50.80, 2000);
  const main = poly([...D.route.mainland, [-1.25, 50.85], [-1.60, 50.85]], f);
  const iow = poly([...D.route.wight, [-1.60, 50.65], [-1.25, 50.65]], f);
  const pts = D.route.track.map(([lo, la]) => f(lo, la));
  const line = 'M' + pts.map((p) => p.join(' ')).join('L');
  const wps = D.route.waypoints.map((w) => { const [x, y] = f(w.lon, w.lat); return `<circle class="wp" cx="${x}" cy="${y}" r="4"/>`; }).join('');
  const labels = D.route.labels.map((l) => { const [x, y] = f(l.lon, l.lat); return `<span class="maplab${l.water ? ' maplab--water' : ''}${l.minor ? ' maplab--minor' : ''}${l.anchor ? ' maplab--' + l.anchor : ''}" style="--x:${(x / W * 100).toFixed(2)}%;--y:${(y / H * 100).toFixed(2)}%">${l.name}</span>`; }).join('');
  return `<div class="map map--route" style="--ar:${W}/${H}">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
        <path class="land" d="${main}"/><path class="land" d="${iow}"/>
        <path class="route" d="${line}"/>${wps}
      </svg>
      ${labels}
    </div>`;
}

// ---------- logo ----------
const wm = asset('wm.svg').toString().replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/ data-char="[^"]*"/g, '');
const wmJson = JSON.parse(asset('wm.json'));
// The y descender sits below the generated viewBox: extend the box so nothing clips.
const wordmark = (cls) => `<svg class="${cls}" viewBox="0 0 ${wmJson.width.toFixed(1)} 136" aria-hidden="true" focusable="false"><g fill="currentColor">${wm}</g></svg>`;
// Symbol: a dark field, the tide as a white wave, the window as a magenta bar.
const symbolPaths = `<rect class="logo__field" width="32" height="32" rx="8"/><path class="logo__wave" d="M5 18.5c3.2 0 4.6-6 8-6s4.6 6 7.5 6 3.8-3 6.5-3" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/><rect class="logo__win" x="10.5" y="22.5" width="10" height="3" rx="1.5"/>`;
const symbol = (cls) => `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${symbolPaths}</svg>`;

// ---------- headings: masked word rise ----------
// <h2 data-split>Ink sentence.|Muted continuation.</h2> becomes word spans; the muted part keeps its colour.
function splitHeadings(html) {
  return html.replace(/<h2([^>]*) data-split>([\s\S]*?)<\/h2>/g, (_, attrs, inner) => {
    let i = 0;
    const words = (s, cls) => s.trim().split(/\s+/).map((w) => `<span class="w${cls}"><span style="--i:${i++}">${w}</span></span>`).join(' ');
    const [ink, muted] = inner.split('|');
    const n = inner.replace('|', ' ').trim().split(/\s+/).length;
    // Keep one heading's spread near 240ms so headings revealed one after another never merge into one long
    // group: 40ms steps up to 7 words, 20ms steps above (both inside the 20 to 80ms stagger band); the CSS caps the
    // step count at 8, so no heading spreads past 320ms.
    const k = n <= 7 ? 1 : 0.5;
    return `<h2${attrs} style="--k:${k}">${words(ink, '')}${muted ? ' ' + words(muted, ' w--muted') : ''}</h2>`;
  });
}

// ---------- assemble ----------
const fonts = `
@font-face { font-family: "Literata Display"; font-style: normal; font-weight: 440 560; font-display: swap; src: url(data:font/woff2;base64,${b64('lit-roman.woff2')}) format("woff2"); }
@font-face { font-family: "Literata Display"; font-style: italic; font-weight: 440 560; font-display: swap; src: url(data:font/woff2;base64,${b64('lit-italic.woff2')}) format("woff2"); }
@font-face { font-family: "Literata Display Fallback"; font-style: normal; src: local("Times New Roman"), local("Liberation Serif"); size-adjust: 115.23%; ascent-override: 102.14%; descent-override: 26.73%; line-gap-override: 0%; }
@font-face { font-family: "Literata Display Fallback"; font-style: italic; src: local("Times New Roman Italic"), local("Liberation Serif Italic"); size-adjust: 112.04%; ascent-override: 105.05%; descent-override: 27.49%; line-gap-override: 0%; }
@font-face { font-family: "JetBrains Mono Halyard"; font-style: normal; font-weight: 450; font-display: swap; src: url(data:font/woff2;base64,${b64('jb-mono.woff2')}) format("woff2"); }`;

const fav = fs.existsSync(path.join(here, 'assets', 'favicon-96.png')) ? 'data:image/png;base64,' + b64('favicon-96.png') : '';

const vars = {
  FONTS: fonts,
  FAVICON: fav,
  SYMBOL: symbol('logo__symbol'),
  SYMBOL_PATHS: symbolPaths,
  WORDMARK: wordmark('logo__word'),
  WORDMARK_BIG: wordmark('signoff__word'),
  HERO_PLOT: heroPlot(),
  MINI_PLOT: miniPlot(),
  AXIS: axisRow(['06:00', '12:00', '18:00']),
  TIDE_TRACK: tideTrack(),
  STREAM_TRACK_FAIR: streamTrack({ fair: '05:40' }),
  WIND_TRACK: windTrack(),
  LIGHT_TRACK_LATEST: lightTrack({ latest: true }),
  BACK_ROW: rowTrack(D.rows[1]),
  SYMBOL_SMALL: symbol('alert__logo'),
  ROUTE_CHART: routeChart(),
  COVERAGE_MAP: coverageMap(),
  SCENE_JS: asset('scene.js').toString(),
};
const pageTpl = fs.readFileSync(path.join(here, 'page.html'), 'utf8');
vars.FRAME_BODY = pageTpl.match(/<div class="frag app">([\s\S]*?<div class="app__plot">\{\{HERO_PLOT\}\}<\/div>)/)[1];
function fill(tpl) {
  let html = tpl.replace(/\{\{icon:(\w+)(?::([\w-]+))?\}\}/g, (_, n, c) => icon(n, c || ''));
  for (let pass = 0; pass < 2; pass++) html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => { if (!(k in vars)) throw new Error('unknown placeholder ' + k); return vars[k]; });
  return splitHeadings(html);
}
for (const [src, dst] of [['page.html', 'halyard.html'], ['states.html', 'halyard-states.html'], ['og.html', 'src/og.built.html']]) {
  const p = path.join(here, src);
  if (!fs.existsSync(p)) continue;
  let tpl = fs.readFileSync(p, 'utf8');
  // the state sheet reuses the page's style block
  if (src !== 'page.html') tpl = tpl.replace('{{PAGE_CSS}}', fs.readFileSync(path.join(here, 'page.html'), 'utf8').match(/<style>([\s\S]*?)<\/style>/)[1]);
  const html = fill(tpl);
  if (/—/.test(html)) throw new Error(dst + ' contains an em dash');
  fs.writeFileSync(path.join(out, dst), html);
  console.log('wrote', dst, (html.length / 1024).toFixed(1) + ' KB');
}
