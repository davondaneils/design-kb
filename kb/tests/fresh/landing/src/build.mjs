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
// Inlined scripts must not close their own <script> element (moments.js shows a shot plan tag in a comment).
const kit = (f) => fs.readFileSync(path.resolve(here, '../../../../../skills/design-motion/assets', f), 'utf8').replace(/<\/script/g, '<\\/script');
const b64 = (f) => asset(f).toString('base64');

// ---------- helpers ----------
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const AX0 = mins(D.axis.from), AX1 = mins(D.axis.to), SPAN = AX1 - AX0;
const frac = (t) => (mins(t) - AX0) / SPAN;
const pct = (t) => +(frac(t) * 100).toFixed(2) + '%';
const nb = (s) => s.replace(/ /g, '&nbsp;');
// The hero sweep runs on --ease-standard (cubic-bezier(0.2, 0, 0, 1)): fast across the morning, easing out at the right
// edge. sweepAt(x) is the fraction of the sweep's duration at which the line reaches x (0 to 1 across the day), so
// whatever the line finds can land exactly as it passes.
const bez = (p1, p2) => (s) => 3 * (1 - s) ** 2 * s * p1 + 3 * (1 - s) * s * s * p2 + s ** 3;
const SX = bez(0.2, 0), SY = bez(0, 1);
const sweepAt = (x) => { let lo = 0, hi = 1; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (SY(m) < x) lo = m; else hi = m; } return +SX(lo).toFixed(3); };

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
    return `<span class="bar${over ? ' bar--over' : ''}" style="--x:${((w.h * 60 - AX0) / SPAN * 100).toFixed(2)}%;--w:${(60 / SPAN * 100).toFixed(3)}%;--v:${(w.kn / D.windMax).toFixed(3)};--g:${(w.gust / D.windMax).toFixed(3)};--i:${i};--tb:${sweepAt((w.h * 60 + 30 - AX0) / SPAN)}"></span>`;
  }).join('')}</div>`;
}
function lightTrack({ labels = true, latest = false } = {}) {
  return `<div class="track track--light" data-lane="light"><span class="night g" style="--x0:0%;--x1:${pct(D.sun.rise)}"></span><span class="night g" style="--x0:${pct(D.sun.set)};--x1:100%"></span>${labels ? `
      <span class="tag tag--low tag--start" style="--x:${pct(D.sun.rise)}">${icon('sun', 'icon--sm')}${D.sun.rise}</span>
      <span class="tag tag--low tag--end" style="--x:${pct(D.sun.set)}">${D.sun.set}</span>` : ''}${latest ? `
      <span class="mark" style="--x:${pct(D.latestLeave)}"></span>` : ''}</div>`;
}
function rowTrack(row, { cls = '' } = {}) {
  const cuts = row.cuts.map((c) => `<i class="cut cut--${c.why}" style="--x0:${pct(c.from)};--x1:${pct(c.to)};--d:${sweepAt(frac(c.from))}"></i>`).join('');
  return `<div class="track track--row${cls ? ' ' + cls : ''}">${cuts}${row.lost ? `<i class="lost" style="--x0:${pct(row.lost[0])};--x1:${pct(row.lost[1])}"></i>` : ''}<span class="win" style="--x0:${pct(row.win[0])};--x1:${pct(row.win[1])};--row:${row.i}"></span></div>`;
}

// ---------- the moment kit (design-motion assets/moments.js): swap values and stack items, authored on a frame ----------
// moments.js picks the value to show from data-seen; the HTML is written on the frame it is built for (the still frame on
// the page, each frame on the state sheet), so it is right without JavaScript and under reduced motion.
const lastSeen = (list, seen) => { let i = -1; for (const st of seen) { const k = list.indexOf(st); if (k !== -1) i = k; } return Math.max(0, i); };
function swap(list, values, seen, { group = 0, cls = '', style = '' } = {}) {
  return `<span class="swap${cls ? ' ' + cls : ''}" data-swap="${list.join(' ')}"${group ? ` data-swap-group="${group}"` : ''} style="--swap-i:${lastSeen(list, seen)};--swap-count:${values.length}${style ? ';' + style : ''}"><span class="swap-track">${values.map((v, k) => `<span${k === lastSeen(list, seen) ? ' data-on' : ''}>${v}</span>`).join('')}</span></span>`;
}
const sceneAttrs = (beats, seen, { id, rest, still, loop = true }) => `${id ? `id="${id}" ` : ''}data-scene data-beats="${beats.map(([s, ms]) => s + ':' + ms).join(' ')}"${loop ? ` data-rest="${rest}"` : ' data-loop="false"'} data-still="${still}" data-state="${seen.at(-1)}" data-seen="${seen.join(' ')}"`;
const seenTo = (beats, state) => beats.slice(0, beats.findIndex(([s]) => s === state) + 1).map(([s]) => s);
const plan = (shots) => `<script type="application/json" data-shot-plan>${JSON.stringify({ shots })}</script>`;
const CURSOR = '<span class="shot-cursor" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3 2l13 7.5-5.6 1.4 3.2 6-2.4 1.2-3.2-6L3 16z" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const tm = (t) => `<time datetime="2026-10-24T${t}+01:00">${t}</time>`;

// The hero plot: lanes plus the two rows, with the sweep that the scene drives.
function heroPlot(seen = HERO_BEATS.map(([s]) => s)) {
  const rows = D.rows.map((r) => `
      <div class="row-head"><span class="row-name"><b>${r.name}</b> ${r.leg}</span>${swap(['aim', 'press'], ['<span class="s-none">Not checked</span>', `<span class="s-win">Leave ${r.win[0]} to ${r.win[1]}</span>`], seen, { cls: 'row-slot roll', style: `--row:${r.i}` })}</div>
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
// Route chart: West Solent, x = (lon + 1.60) * 1266, y = (50.80 - lat) * 2000. The planned track is drawn faint; each
// leg is its own path that appears when the boat reaches the mark at its end (route scene). Returns the boat position
// at each mark in the SVG's own units (CSS transforms on SVG elements use user units).
const ROUTE_W = 443, ROUTE_H = 220;
const routeXY = (lo, la) => P(lo, la, -1.60, 50.80, 2000);
const LEG_TRACK = { jack: [0, 2], hamstead: [2, 3], gurnard: [3, 4], cowes: [4, 5] }; // track indices per leg
function routeChart() {
  const W = ROUTE_W, H = ROUTE_H, f = routeXY;
  const main = poly([...D.route.mainland, [-1.25, 50.85], [-1.60, 50.85]], f);
  const iow = poly([...D.route.wight, [-1.60, 50.65], [-1.25, 50.65]], f);
  const pts = D.route.track.map(([lo, la]) => f(lo, la));
  const line = (a, b) => 'M' + pts.slice(a, b + 1).map((p) => p.join(' ')).join('L');
  const legs = Object.entries(LEG_TRACK).map(([st, [a, b]]) => `<path class="route leg" data-leg="${st}" d="${line(a, b)}"/>`).join('');
  const wps = D.route.waypoints.map((w, k, all) => { const [x, y] = f(w.lon, w.lat); return `<circle class="wp${k === all.length - 1 ? ' wp--end' : ''}" cx="${x}" cy="${y}" r="4"/>`; }).join('');
  const labels = D.route.labels.map((l) => { const [x, y] = f(l.lon, l.lat); return `<span class="maplab${l.water ? ' maplab--water' : ''}${l.minor ? ' maplab--minor' : ''}${l.wide ? ' maplab--wide' : ''}${l.anchor ? ' maplab--' + l.anchor : ''}" style="--x:${(x / W * 100).toFixed(2)}%;--y:${(y / H * 100).toFixed(2)}%">${l.name}</span>`; }).join('');
  return `<div class="map map--route" style="--ar:${W}/${H}">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
        <path class="land" d="${main}"/><path class="land" d="${iow}"/>
        <path class="route route--plan" d="${line(0, pts.length - 1)}"/>${legs}${wps}
        <g class="boat-g"><circle class="boat" cx="0" cy="0" r="6"/></g>
      </svg>
      ${labels}
    </div>`;
}

// ---------- scenes (design-motion v0.4: shot plan, moment kit) ----------
// Each builder writes the scene on one frame: the page gets the still frame (id, shot plan, cursor), the state sheet
// gets every frame. Beats are per scene (FOUNDATIONS: never tokens).
// aim: the card settles, the hand sets off from beside the button and presses at 1200ms (on a replay, the last result
// resets in place first, about 0.6s). press: the line sweeps the day alone (bars turn as it passes); only when it
// arrives do the Out row, the Back row, the count and the button land, --offset apart; settled by 2100ms, the found
// windows hold 1s. window: the plan's values land in their reserved row, its own beat, held with nothing moving.
const HERO_BEATS = [['aim', 1200], ['press', 3100], ['window', 4400]];
function heroScene(state = 'window', { id = 'hero-scene' } = {}) {
  const seen = seenTo(HERO_BEATS, state);
  const shots = [
    { state: 'aim', owner: '.app', aim: '.find' },
    { state: 'press', owner: '.app', press: '.find' },
    { state: 'window', owner: '.plan', read: '.plan__head' },
  ];
  return `<div class="scene" ${sceneAttrs(HERO_BEATS, seen, { id, rest: 4000, still: 'window' })}>
            ${id ? plan(shots) : ''}
            <div class="frag app">
              <div class="app__bar">
                <div class="app__title"><b>Lymington to Cowes and back</b><span class="muted">Sat&nbsp;24&nbsp;Oct · BST</span></div>
                <div class="status">
                  ${swap(['aim', 'press'], ['Ready to check', '2 windows found'], seen, { cls: 'status__slot roll' })}
                </div>
              </div>
              <div class="app__limits"><span class="chip">Wren, 7.9&nbsp;m sloop</span><span class="chip">Wind ≤&nbsp;20&nbsp;kn</span><span class="chip">Against tide ≤&nbsp;12&nbsp;kn</span><span class="chip">Home by sunset</span><span class="find">${swap(['aim', 'press', 'window'], ['Find windows', 'Checking', 'Find windows'], seen, { cls: 'roll' })}</span></div>
              <div class="app__plot">${heroPlot(seen)}</div>
              <div class="plan">
                <div class="plan__head"><b>Proposed plan</b><span><span class="muted">Daylight to spare</span><b class="spare pv"><span>3&nbsp;h 46&nbsp;min</span></b></span></div>
                <ol class="plan__legs">
                  <li><span>Leave Lymington</span><b class="pv" style="--i:0"><span>08:30</span></b></li>
                  <li><span>Arrive Cowes</span><b class="pv" style="--i:1"><span>10:10</span></b></li>
                  <li><span>Leave Cowes</span><b class="pv" style="--i:2"><span>12:30</span></b></li>
                  <li><span>Home</span><b class="pv" style="--i:3"><span>14:10</span></b></li>
                </ol>
              </div>
            </div>
            ${CURSOR}
          </div>`;
}

const WARN_BEATS = [['fri18', 2600], ['saved', 3000], ['fri21', 4500]];
function warnScene(state = 'fri21', { id = 'warn-scene' } = {}) {
  const seen = seenTo(WARN_BEATS, state);
  const F = D.forecast, list = ['fri18', 'fri21'];
  const back = D.rows[1];
  const was = mins(F.before.closes) - mins(back.win[0]), now = mins(back.win[1]) - mins(back.win[0]);
  const windCut = back.cuts.find((c) => c.why === 'wind');
  const cutNow = mins(windCut.to) - mins(windCut.from), cutWas = mins(windCut.to) - mins(F.before.closes);
  const lostMin = mins(F.before.closes) - mins(F.after.closes);
  // The plan is saved (one line), then the 21:00 forecast moves the card first (badge, end time, bar trim, --offset
  // apart) and only then does the note swap to "Back window moved", so it never explains a change not yet on screen.
  // Plays once and holds the end state (no loop, so no reset through a blank card).
  const shots = [
    { state: 'fri18', owner: '.warn-panel', read: '.wp-win' },
    { state: 'saved', owner: '.notes', read: '.face--saved .alert__msg' },
    { state: 'fri21', owner: '.notes', read: '.alert__lead' },
  ];
  const note = (cls, time, body) => `<div class="face ${cls}"><div class="alert__app"><span>{{SYMBOL_SMALL}}Halyard</span><span class="muted">Fri ${time}</span></div><div class="alert__msg">${body}</div></div>`;
  return `<div class="warn-stage" ${sceneAttrs(WARN_BEATS, seen, { id, still: 'fri21', loop: false })} style="--was:${(was / now).toFixed(4)};--cut-was:${(cutWas / cutNow).toFixed(4)}">
              ${id ? plan(shots) : ''}
              <div class="frag warn-panel">
                <div class="frag__head"><b>Back: Cowes to Lymington</b><span class="chip chip--forecast">${swap(list, [`Forecast Fri ${F.before.issued}`, `Forecast Fri ${F.after.issued}`], seen)}</span></div>
                <div class="frag__body">
                  <div class="wwin">
                    <div class="wwin__head"><span class="muted">Window</span><b class="wp-win">Leave ${back.win[0]} to ${swap(list, [F.before.closes, F.after.closes], seen)}</b></div>
                    <div class="plot plot--warn"><span class="lab"></span>${axisRow(['06:00', '12:00', '18:00'])}<span class="lab">Back</span>${rowTrack({ ...back, lost: [F.after.closes, F.before.closes] }, { cls: 'track--moves' })}</div>
                  </div>
                  <div class="warn-row">${swap(list, [tm(F.before.against), tm(F.after.against)], seen, { cls: 'warn-t' })}<span><b>Wind against tide</b><br><span class="muted">W 15&nbsp;kn on a 2.4&nbsp;kn W-going stream</span></span></div>
                  <div class="warn-row"><span class="warn-t">${tm('16:00')}</span><span><b>Gusts 23&nbsp;kn</b><br><span class="muted">Limit 20&nbsp;kn</span></span></div>
                  <div class="warn-row"><span class="warn-t">${tm(D.latestLeave)}</span><span><b>Latest to leave Cowes</b><br><span class="muted">Sunset ${D.sun.set}</span></span></div>
                </div>
              </div>
              <ol class="notes">
                <li class="frag alert">
                  ${note('face--saved', F.savedAt, `<b>Plan saved.</b> Out ${D.rows[0].win[0]}, back ${back.win[0]}.`)}
                  ${note('face--moved', F.alertAt, `<span class="alert__lead"><b>Back window moved</b>Now closes ${F.after.closes}, ${lostMin} minutes earlier.</span> The ${F.after.issued} forecast brings the wind on sooner. Your 12:30 start still works.`)}
                </li>
              </ol>
            </div>`;
}

// State sheet: one frame per beat, with what the viewer should see in it.
const FRAME_NOTES = {
  aim: 'Saturday loaded; plan row reserved; the hand beside the button', press: 'Pressed: the line alone, bars turn; then Out, Back, the count, the button',
  window: 'The plan lands in its reserved row (still)',
  fri18: '18:00 forecast: back window to 13:45', saved: 'Plan saved at 18:10: the note arrives', fri21: '21:00 forecast: card moves, then the alert (still)',
  leave: 'Leave Lymington 08:30', jack: 'At Jack in the Basket (the map carries it)', hamstead: 'At Hamstead Ledge',
  gurnard: 'At Gurnard', cowes: 'Arrive Cowes 10:10, 10.5 nm, 6.3 kn average (still)',
};
const frame = (html, st, beats) => {
  const i = beats.findIndex(([s]) => s === st);
  return `<figure class="frame"><div class="stage stage--side stage--flat" aria-hidden="true"${st === 'aim' || st === 'press' ? ' data-frame-aim=".find"' : ''}>${html}</div><figcaption class="frame-cap"><span>${i + 1} ${st}, ${beats[i][1]}&nbsp;ms</span><span>${FRAME_NOTES[st]}</span></figcaption></figure>`;
};

// Route: one beat per leg; the map carries the progress. Each leg is sailed in time scaled to its minutes (18, 29 and
// 42 min become 600, 800 and 1200ms, about 30ms a minute; the last 11 min, 400ms), on --ease-swap, so the boat eases
// out of each mark and decelerates into the next, with a short settle there. The readout shows the departure and the
// arrival only (a middle stop is too short to read three values; the map shows where the boat is): at Cowes the pin
// fills, the boat settles once (1.0 to 1.3 to 1.0), then "Arrive Cowes 10:10" lands, the values --offset/2 apart, and
// everything holds 3s+. The replay is in place: the line retracts to Lymington as the readout rolls back.
const LEG_MS = { jack: 600, hamstead: 800, gurnard: 1200, cowes: 400 };
const ROUTE_BEATS = [['leave', 2000], ['jack', 1200], ['hamstead', 1200], ['gurnard', 1600], ['cowes', 4400]];
function routeScene(state = 'cowes', { id = 'route-scene' } = {}) {
  const seen = seenTo(ROUTE_BEATS, state);
  const list = ['leave', 'cowes'];
  const first = D.marks[0], last = D.marks.at(-1);
  const total = D.legs.reduce((s, l) => s + (l.nm || 0), 0);
  const minutes = mins(last.t) - mins(first.t);
  const avg = (total / (minutes / 60)).toFixed(1);
  const at = D.marks.map((m) => { const w = D.route.waypoints[m.wp]; const [x, y] = routeXY(w.lon, w.lat); return `--at-${m.state}:translate(${x}px, ${y}px)`; }).join(';');
  const shots = D.marks.map((m, k) => (k === 0 ? { state: m.state, owner: '.boat', read: '.rs-time' } : k < D.marks.length - 1 ? { state: m.state, owner: '.boat' } : { state: m.state, owner: '.route-strip', read: '.rs-now' }));
  const legs = Object.entries(LEG_MS).map(([st, ms]) => st + ':' + ms).join(' ');
  return `<div class="frag route-card" ${sceneAttrs(ROUTE_BEATS, seen, { id, rest: 2400, still: 'cowes' })} data-legs="${legs}" style="${at}">
            ${id ? plan(shots) : ''}
            <div class="frag__head"><b>Out: Lymington to Cowes</b><span class="chip chip--win">Leave 08:30</span></div>
            {{ROUTE_CHART}}
            <div class="route-strip">
              <span class="rs-now">${swap(list, [first.label, last.label], seen, { cls: 'muted rs-label' })}<b class="rs-time" data-steps="${first.t} ${last.t}">${swap(list, [first.t, last.t], seen, { cls: 'rs-v', style: '--k:1' })}</b></span>
              <span><span class="muted">Distance sailed</span><b class="rs-nm" data-steps="0.0 ${total.toFixed(1)}">${swap(list, ['0.0&nbsp;nm', total.toFixed(1) + '&nbsp;nm'], seen, { cls: 'rs-v', style: '--k:2' })}</b></span>
              <span><span class="muted">Average speed</span><b class="rs-kn">${swap(list, ['0.0&nbsp;kn', avg + '&nbsp;kn'], seen, { cls: 'rs-v', style: '--k:3' })}</b></span>
            </div>
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
  HERO_SCENE: heroScene(),
  WARN_SCENE: warnScene(),
  ROUTE_SCENE: routeScene(),
  HERO_FRAMES: HERO_BEATS.map(([st]) => frame(heroScene(st, { id: '' }), st, HERO_BEATS)).join('\n'),
  WARN_FRAMES: WARN_BEATS.map(([st]) => frame(warnScene(st, { id: '' }), st, WARN_BEATS)).join('\n'),
  ROUTE_FRAMES: ROUTE_BEATS.map(([st]) => frame(routeScene(st, { id: '' }), st, ROUTE_BEATS)).join('\n'),
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
  // The moment kit, inlined from the skill so the page stays one file and never drifts from it.
  SCENE_JS: kit('scene.js'),
  MOMENTS_JS: kit('moments.js'),
  MOMENTS_CSS: kit('moments.css'),
};
const pageTpl = fs.readFileSync(path.join(here, 'page.html'), 'utf8');
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
