/* Halyard plan screen. State from ?state= (default, empty, error, loading, nowindow, saved).
   Every time, window and warning on the page is derived from HALYARD (model.js) on every change, so nothing can drift.
   Motion: only a stepper press animates (the leg slides, the time rolls, a changed warning flashes once).
   Drag tracks the pointer 1:1 and every keyboard path is instant, so key repeat never queues animation. */
(() => {
  'use strict';
  const H = HALYARD;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const ms = (name) => parseFloat(css.getPropertyValue(name)) || 0;
  const EASE = css.getPropertyValue('--ease-standard').trim() || 'ease';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fmt = H.hhmm;
  const fmtIn = (a, b) => fmt(Math.ceil(a / 5) * 5) + ' to ' + fmt(Math.floor(b / 5) * 5);
  const fmtOut = (a, b) => fmt(Math.floor(a / 5) * 5) + ' to ' + fmt(Math.ceil(b / 5) * 5);
  const dur = (m) => (m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min');
  const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const compass = (d) => COMPASS[Math.round(((d % 360) + 360) % 360 / 22.5) % 16];
  const streamText = (s) => (Math.abs(s) < 0.2 ? 'Slack' : (s > 0 ? 'E ' : 'W ') + Math.abs(s).toFixed(1));
  const ov = (L, s) => L.dep < s[1] && L.arr > s[0];
  const ICON = {
    ok: '{{i:clear}}', warn: '{{i:warning}}', bad: '{{i:danger}}', unknown: '{{i:info}}',
    check: '{{i:check}}', menu: '{{i:menu}}', close: '{{i:close}}', retry: '{{i:retry}}', plus: '{{i:plus}}', sun: '{{i:sun}}', grip: '{{i:grip}}',
  };
  const STATES = ['default', 'empty', 'error', 'loading', 'nowindow', 'saved'];
  const WP = [['Lymington Yacht Haven', 0], ['Jack in the Basket', 1.1], ['Mid-Solent', 2.6], ['Yarmouth entrance', 4.2], ['Yarmouth Harbour', 4.5]];

  const tl = $('#tl'), live = $('#live'), main = $('#main');
  const plots = { axis: $('#p-axis'), tide: $('#p-tide'), stream: $('#p-stream'), wind: $('#p-wind'), plan: $('#p-plan') };

  let S;            // per-state data
  let plan;         // { out, back } minutes
  let saved = false, savedOnce = false;
  let dom = [0, 1440], PW = 0;
  const X = (t) => ((t - dom[0]) / (dom[1] - dom[0])) * PW;
  const T = (x) => dom[0] + (x / PW) * (dom[1] - dom[0]);
  let prevTones = {};
  let liveTimer = 0, animTimer = 0;

  /* ---------- state data ---------- */
  function setup(state) {
    const W = H.makeWind(state === 'nowindow' ? H.WIND_STORM : H.WIND);
    const CALM = { mean: () => 0, gust: () => 0, dir: () => 0 };
    const windOk = state !== 'error';
    const hasBoat = state !== 'empty';
    const WL = windOk ? W : CALM; // wind used for the limits
    const day = (s) => s[1] > H.SUNRISE && s[0] < H.SUNSET;
    const max = (f, a, b) => { let m = -Infinity; for (let t = a; t <= b; t++) m = Math.max(m, f(t)); return m; };
    const min = (f, a, b) => { let m = Infinity; for (let t = a; t <= b; t++) m = Math.min(m, f(t)); return m; };
    const D = { state, W, WL, windOk, hasBoat };
    D.outWins = hasBoat ? H.windows(WL, 1) : [];
    D.backWinsAll = hasBoat ? H.windows(WL, -1) : [];
    D.limitSpan = windOk ? H.spans(W, (t) => W.mean(t) > H.LIMITS.wind).filter(day)[0] : null;
    D.watSpan = windOk ? H.spans(W, (t) => H.watAt(W, t) > H.LIMITS.wat).filter(day)[0] : null;
    D.gustSpan = windOk && !D.limitSpan ? H.spans(W, (t) => W.gust(t) > H.LIMITS.wind).filter(day)[0] : null;
    if (D.limitSpan) { const [a, b] = D.limitSpan; D.limitMax = Math.round(max(W.mean, a, b)); D.limitGust = Math.round(max(W.gust, a, b)); }
    if (D.watSpan) { const [a, b] = D.watSpan; D.watMax = Math.round(max((t) => H.watAt(W, t), a, b)); }
    if (D.gustSpan) { const [a, b] = D.gustSpan; D.gustMax = Math.round(max(W.gust, a, b)); D.gustMeanLo = Math.round(min(W.mean, a, b)); D.gustMeanHi = Math.round(max(W.mean, a, b)); }
    D.hasPlan = hasBoat && state !== 'nowindow' && state !== 'loading';
    D.gustPeak = windOk ? Math.round(max(W.gust, H.SUNRISE, H.SUNSET + 120)) : 0;
    D.windMaxScale = windOk ? Math.max(25, Math.ceil(max(W.gust, 0, 1440) / 5) * 5) : 25;
    return D;
  }

  function calc() {
    const o = H.leg(S.WL, plan.out, 1), b = H.leg(S.WL, plan.back, -1);
    const earliest = o.arr + H.MIN_ASHORE;
    const backWins = S.backWinsAll.filter((w) => w[1] >= earliest).map((w) => [Math.max(w[0], earliest), w[1]]);
    const inWin = (t, wins) => wins.find((w) => t >= w[0] && t <= w[1]);
    const why = (L) => {
      const r = [];
      if (L.dep < H.SUNRISE) r.push('before sunrise');
      if (L.minFav < 0.5) r.push('stream against you');
      if (L.worstWind > H.LIMITS.wind) r.push('wind over 20 kn');
      if (L.worstWat > H.LIMITS.wat) r.push('wind against tide over 12 kn');
      if (L.arr > H.SUNSET) r.push('after sunset');
      return r;
    };
    return { o, b, backWins, oWin: inWin(plan.out, S.outWins), bWin: inWin(plan.back, backWins), oWhy: why(o), bWhy: why(b), margin: H.SUNSET - b.arr };
  }

  function bounds() {
    const outMin = 360;
    let outMax = plan.back - H.MIN_ASHORE - 40;
    while (outMax > outMin && H.leg(S.WL, outMax, 1).arr + H.MIN_ASHORE > plan.back) outMax--;
    return { out: [outMin, Math.max(outMin, outMax)], back: [H.leg(S.WL, plan.out, 1).arr + H.MIN_ASHORE, 1140] };
  }

  /* ---------- warnings ---------- */
  function where(span, c) {
    if (span[0] >= c.o.arr && span[1] <= c.b.dep) return 'you are ashore at Yarmouth';
    if (span[0] >= c.b.arr) return 'you are home before it starts';
    if (span[1] <= c.o.dep) return 'it is over before you leave';
    return 'neither leg crosses it';
  }
  const legNames = (ls, c) => ls.map((L) => (L === c.o ? 'out leg' : 'return')).join(' and ');
  function warnings(c) {
    const list = [];
    let n = 0;
    if (S.limitSpan) {
      list.push({ key: 'limit', n: ++n, sev: 'bad', span: S.limitSpan,
        title: `Wind above Wren’s 20 kn limit, ${fmtOut(...S.limitSpan)}`,
        body: `Mean wind up to ${S.limitMax} kn from the SW, gusting ${S.limitGust} kn. Wren’s limit is 20 kn true wind.`,
        eval: () => ({ tone: 'bad', word: 'No safe window', text: 'it covers the whole day, sunrise to sunset', short: 'wind over the limit all day' }) });
    }
    if (S.watSpan) {
      list.push({ key: 'wat', n: ++n, sev: 'bad', span: S.watSpan,
        title: `Wind against tide, ${fmtOut(...S.watSpan)}`,
        body: `The west-going stream runs against the SW wind: up to ${S.watMax} kn of wind against tide. Wren’s limit is 12 kn.`,
        eval: (c) => {
          if (!S.hasPlan) return { tone: 'bad', word: 'Over Wren’s limit', text: `up to ${S.watMax} kn`, short: 'wind against tide' };
          const hit = [c.o, c.b].filter((L) => ov(L, S.watSpan));
          return hit.length
            ? { tone: 'bad', word: 'Outside Wren’s limit', text: `your ${legNames(hit, c)} crosses it`, short: `wind against tide on the ${legNames(hit, c)}` }
            : { tone: 'ok', word: 'Clear of your plan', text: where(S.watSpan, c) };
        } });
    } else if (!S.windOk) {
      list.push({ key: 'wat', n: ++n, sev: 'unknown', span: null, title: 'Wind against tide', body: 'Halyard checks this against Wren’s 12 kn limit once the wind forecast loads.',
        eval: () => ({ tone: 'unknown', word: 'Not checked', text: 'the wind forecast didn’t load' }) });
    }
    if (S.gustSpan) {
      list.push({ key: 'gust', n: ++n, sev: 'warn', span: S.gustSpan,
        title: `Gusts above 20 kn, ${fmtOut(...S.gustSpan)}`,
        body: `Gusts to ${S.gustMax} kn. The mean wind stays at ${S.gustMeanLo} to ${S.gustMeanHi} kn, inside Wren’s 20 kn limit.`,
        eval: (c) => {
          const hit = [c.o, c.b].filter((L) => ov(L, S.gustSpan));
          if (!hit.length) return { tone: 'ok', word: 'Clear of your plan', text: where(S.gustSpan, c) };
          const L = hit[hit.length - 1];
          return { tone: 'warn', word: `Affects your ${legNames(hit, c)}`, text: `${fmt(L.dep)} to ${fmt(L.arr)}: reef before you leave ${L === c.o ? 'Lymington' : 'Yarmouth'}`, short: `gusts to ${S.gustMax} kn on the ${legNames(hit, c)}` };
        } });
    } else if (!S.windOk) {
      list.push({ key: 'gust', n: ++n, sev: 'unknown', span: null, title: 'Gusts', body: 'Halyard checks gusts above 20 kn once the wind forecast loads.',
        eval: () => ({ tone: 'unknown', word: 'Not checked', text: 'the wind forecast didn’t load' }) });
    }
    if (S.hasPlan) {
      list.push({ key: 'light', n: ++n, sev: null, span: null,
        title: '', body: 'Wren’s limit is to arrive by sunset, 17:56. Halyard flags any arrival with less than 30 min to spare, because a late start or a slow beat home uses it up.',
        eval: (c) => {
          if (c.o.dep < H.SUNRISE) return { tone: 'bad', word: 'Outside Wren’s limit', text: `you leave Lymington before sunrise, 07:33`, short: 'a start before sunrise', title: 'Leaving before sunrise' };
          const m = c.margin;
          if (m < 0) return { tone: 'bad', word: 'Outside Wren’s limit', text: `home ${fmt(c.b.arr)}, ${dur(-m)} after sunset`, short: `home ${dur(-m)} after sunset`, title: `Home ${dur(-m)} after sunset` };
          if (m < 30) return { tone: 'warn', word: 'Affects your return', text: `home ${fmt(c.b.arr)}, ${dur(m)} before sunset`, short: `home ${dur(m)} before sunset`, title: `Home ${dur(m)} before sunset` };
          return { tone: 'ok', word: 'Clear of your plan', text: `home ${fmt(c.b.arr)}, ${dur(m)} before sunset`, title: `Home ${dur(m)} before sunset` };
        } });
    }
    return list;
  }

  /* ---------- timeline, static layers ---------- */
  function svg(h, inner) { return `<svg viewBox="0 0 ${PW} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${inner}</svg>`; }
  const pathOf = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  function nightAndGrid(h) {
    let s = `<rect class="night" x="0" y="0" width="${Math.max(0, X(H.SUNRISE)).toFixed(1)}" height="${h}"/>`;
    s += `<rect class="night" x="${X(H.SUNSET).toFixed(1)}" y="0" width="${Math.max(0, PW - X(H.SUNSET)).toFixed(1)}" height="${h}"/>`;
    for (let t = dom[0] + 120; t < dom[1]; t += 120) s += `<line class="grid" x1="${X(t).toFixed(1)}" x2="${X(t).toFixed(1)}" y1="0" y2="${h}"/>`;
    return s;
  }
  const lbl = (text, x, y, cls = '') => `<span class="lbl ${cls}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px">${text}</span>`;
  const lblFit = (text, x, y, w, cls = '') => {
    if (x - w / 2 < 0) return lbl(text, Math.max(0, x), y, 'start ' + cls);
    if (x + w / 2 > PW) return lbl(text, Math.min(PW, x), y, 'end ' + cls);
    return lbl(text, x, y, cls);
  };
  function overlays() { return '<span class="cross"></span>' + (S.hasPlan ? ['o', 'b'] : []).map((k) => `<span class="guide leg-guide" data-g="${k}"></span>`).join(''); }

  function drawStatic() {
    PW = plots.tide.clientWidth;
    if (!PW) return;
    dom = PW < 560 ? [360, 1200] : [0, 1440];
    $('#tl-crop').textContent = dom[0] ? 'Showing 06:00 to 20:00. The hourly values below cover all 24 hours.' : '';
    // axis
    {
      const p = plots.axis; let s = '';
      const step = [120, 180, 240, 360].find((k) => X(dom[0] + k) >= 56) || 360;
      let lastX = -1e9;
      for (let t = dom[0]; t <= dom[1]; t += step) {
        const x = X(t);
        if (t + step > dom[1] && t !== dom[0] && X(dom[1]) - x < 0) break;
        if (x - lastX < 56) continue;
        if (t === dom[1] || PW - x < 28) { if (PW - lastX < 84) continue; }
        s += lblFit(fmt(t), x, 0, 36); lastX = x;
      }
            s += lbl('Sunrise 07:33', X(H.SUNRISE) + 4, 20, 'start ink');
      s += lbl('Sunset 17:56', X(H.SUNSET) - 4, 20, 'end ink');
      p.innerHTML = svg(40, nightAndGrid(40)) + s;
    }
    // tide
    {
      const p = plots.tide, h = p.clientHeight, y = (m) => 6 + ((3.2 - m) / 3.2) * (h - 12);
      const pts = []; for (let t = dom[0]; t <= dom[1]; t += 5) pts.push([X(t), y(H.tide(t))]);
      let s = nightAndGrid(h) + `<path class="wash tide" d="${pathOf(pts)}L${PW} ${h}L0 ${h}Z"/><path class="ln tide" d="${pathOf(pts)}"/>`;
      let l = '';
      for (const [t, m, type] of H.TIDE) {
        const x = X(t); if (x < 24 || x > PW - 24) continue;
        s += `<circle class="dot tide" cx="${x.toFixed(1)}" cy="${y(m).toFixed(1)}" r="3"/>`;
        l += lblFit(`<strong>${type}</strong> ${fmt(t)}, ${m.toFixed(1)} m`, x, type === 'HW' ? y(m) + 6 : y(m) - 22, 104);
      }
      p.innerHTML = svg(h, s) + l + overlays();
    }
    // stream
    {
      const p = plots.stream, h = p.clientHeight, z = h / 2, k = (h / 2 - 4) / 3, y = (v) => z - v * k;
      const pts = []; for (let t = dom[0]; t <= dom[1]; t += 5) pts.push([X(t), y(H.stream(t))]);
      let s = nightAndGrid(h) + `<path class="wash stream" d="${pathOf(pts)}L${PW} ${z}L0 ${z}Z"/><line class="zero" x1="0" x2="${PW}" y1="${z}" y2="${z}"/><path class="ln stream" d="${pathOf(pts)}"/>`;
      let l = '';
      const segs = [[-130, 210, -2.2], [210, 580, 2.3], [580, 950, -2.4], [950, 1320, 2.6], [1320, 1690, -2.2]];
      for (const [a, b, pk] of segs) {
        const t = (a + b) / 2, x = X(t); if (x < 40 || x > PW - 40) continue;
        l += lblFit(`${pk > 0 ? 'E' : 'W'} ${Math.abs(pk).toFixed(1)} kn`, x, pk > 0 ? z - 19 : z + 3, 60);
      }
      p.innerHTML = svg(h, s) + l + overlays();
    }
    // wind
    {
      const p = plots.wind, h = p.clientHeight;
      if (!S.windOk) {
        p.innerHTML = svg(h, nightAndGrid(h)) + `<div class="row-error">${ICON.bad}<span>Wind forecast not loaded. Tide and stream are up to date.</span></div>`;
      } else {
        const top = S.windMaxScale, y = (v) => 4 + ((top - v) / top) * (h - 8);
        const mp = [], gp = []; for (let t = dom[0]; t <= dom[1]; t += 10) { mp.push([X(t), y(S.W.mean(t))]); gp.push([X(t), y(S.W.gust(t))]); }
        let s = nightAndGrid(h) + `<path class="wash wind" d="${pathOf(mp)}L${PW} ${h}L0 ${h}Z"/>`;
        if (S.hasBoat) s += `<line class="limit" x1="0" x2="${PW}" y1="${y(20).toFixed(1)}" y2="${y(20).toFixed(1)}"/>`;
        s += `<path class="ln gust" d="${pathOf(gp)}"/><path class="ln wind" d="${pathOf(mp)}"/>`;
        let l = '';
        let gt = dom[0], gv = -1; for (let t = Math.max(dom[0], H.SUNRISE); t <= Math.min(dom[1], H.SUNSET + 120); t += 10) if (S.W.gust(t) > gv) { gv = S.W.gust(t); gt = t; }
        s += `<circle class="dot gust" cx="${X(gt).toFixed(1)}" cy="${y(gv).toFixed(1)}" r="3"/>`;
        l += lblFit(`Gust <strong>${Math.round(gv)} kn</strong>`, X(gt), y(gv) - 22, 80);
        if (S.hasBoat) l += lbl('Limit 20 kn', 2, y(20) + 2, 'start');
        let spans = '';
        for (const w of S.warns || []) {
          if (!w.span || w.key === 'light') continue;
          const a = X(Math.max(w.span[0], dom[0])), b = X(Math.min(w.span[1], dom[1]));
          spans += `<span class="span hatch${w.sev === 'bad' ? ' bad' : ''}" data-span="${w.n}" style="--x:${a.toFixed(1)}px;--w:${(b - a).toFixed(1)}px"></span>`;
          spans += `<span class="badge" data-tone="${w.sev}" style="left:${(a + 2).toFixed(1)}px;top:${h - 18}px" aria-hidden="true">${w.n}</span>`;
        }
        p.innerHTML = spans + svg(h, s) + l + overlays();
      }
    }
    // plan lane: static night and grid, the rest is dynamic
    {
      const p = plots.plan, h = p.clientHeight;
      let s = svg(h, nightAndGrid(h)) + '<div class="wins"></div>';
      if (S.hasPlan) {
        s += '<span class="margin-bracket" data-span="3"></span><span class="badge" data-badge="light" aria-hidden="true">3</span>';
        s += '<span class="leg" data-leg="o"></span><span class="leg" data-leg="b"></span><span class="leg-lbl" data-ll="o"></span><span class="leg-lbl" data-ll="b"></span>';
      } else {
        const msg = S.state === 'empty' ? `${ICON.plus}Add your boat and Halyard marks the out and back windows here.`
          : `${ICON.bad}No safe window: wind over 20 kn, ${fmtOut(...S.limitSpan)}.`;
        s += `<p class="lane-msg"${S.state === 'nowindow' ? ' data-tone="bad"' : ''}>${msg}</p>`;
      }
      p.innerHTML = s + overlays();
      if (S.hasPlan) for (const w of ['out', 'back']) p.append(handles[w]);
    }
    paint(false);
  }

  /* ---------- handles ---------- */
  const handles = {};
  for (const w of ['out', 'back']) {
    const el = document.createElement('div');
    el.className = 'handle'; el.tabIndex = 0; el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', w === 'out' ? 'Leave Lymington' : 'Leave Yarmouth');
    el.innerHTML = ICON.grip;
    el.addEventListener('keydown', (e) => {
      const b = bounds()[w]; let v = plan[w]; const s = e.shiftKey ? 30 : 5;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowUp': v += s; break;
        case 'ArrowLeft': case 'ArrowDown': v -= s; break;
        case 'PageUp': v += 60; break;
        case 'PageDown': v -= 60; break;
        case 'Home': v = b[0]; break;
        case 'End': v = b[1]; break;
        default: return;
      }
      e.preventDefault();
      setTime(w, v, 'key');
    });
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault(); el.focus({ preventScroll: true }); el.setPointerCapture(e.pointerId); el.dataset.dragging = '';
      delete tl.dataset.cross;
    });
    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      const r = plots.plan.getBoundingClientRect();
      setTime(w, Math.round(T(e.clientX - r.left) / 5) * 5, 'drag');
    });
    const end = (e) => { if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); delete el.dataset.dragging; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    handles[w] = el;
  }

  function setTime(w, v, src) {
    const b = bounds()[w];
    v = Math.min(b[1], Math.max(b[0], v));
    if (v === plan[w]) return;
    plan[w] = v;
    if (saved) unsave();
    paint(src === 'step');
  }

  /* ---------- dynamic paint ---------- */
  function setStack(el, text, animate) {
    if (el.dataset.v === text) return;
    const old = el.lastElementChild, up = old && text > old.textContent;
    el.dataset.v = text;
    const nu = document.createElement('span'); nu.textContent = text;
    if (!animate || !old || reduced.matches) { el.replaceChildren(nu); return; }
    $$('[aria-hidden]', el).forEach((n) => n.remove());
    old.setAttribute('aria-hidden', 'true');
    el.append(nu);
    const d = ms('--duration-slow'), k = up ? 1 : -1;
    nu.animate([{ transform: `translateY(${k * 100}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: d, easing: EASE });
    old.animate([{ transform: 'none', opacity: 1 }, { transform: `translateY(${-k * 100}%)`, opacity: 0 }], { duration: d, easing: EASE, fill: 'forwards' }).onfinish = () => old.remove();
  }
  const pos = (el, x, w) => { if (!el) return; el.style.setProperty('--x', x.toFixed(1) + 'px'); if (w != null) el.style.setProperty('--w', Math.max(0, w).toFixed(1) + 'px'); };

  function paint(animate) {
    if (S.state === 'loading') return;
    const c = S.hasPlan ? calc() : null;
    const ws = S.warns.map((w) => ({ w, r: w.eval(c) }));
    // facts and answer
    if (c) {
      const winNote = (wins, win, why, label) => (win
        ? `<span data-tone="ok">In the ${label}</span> ${fmtIn(...win)}`
        : `<span data-tone="bad">Outside the ${label}:</span> ${why.join(', ') || 'no window after you arrive'}`);
      const tideOnly = S.windOk ? '' : 'tide ';
      setStack($('[data-time="out"]'), fmt(plan.out), animate);
      setStack($('[data-time="back"]'), fmt(plan.back), animate);
      setStack($('[data-time="home"]'), fmt(c.b.arr), animate);
      $('[data-note="out"]').innerHTML = winNote(S.outWins, c.oWin, c.oWhy, tideOnly + 'out window');
      $('[data-note="back"]').innerHTML = winNote(c.backWins, c.bWin, c.bWhy, tideOnly + 'back window');
      const m = c.margin, mt = m < 0 ? 'bad' : m < 30 ? 'warn' : 'ok';
      $('[data-note="home"]').innerHTML = m < 0 ? `<span data-tone="bad">${dur(-m)} after sunset</span> (17:56)` : `<span data-tone="${mt}">${dur(m)} before sunset</span> (17:56)`;
      $('[data-note="legs"]').textContent = `Each way: ${c.o.mins} min out, ${c.b.mins} min back`;
      const bd = bounds();
      for (const btn of $$('[data-step]')) {
        const w = btn.dataset.step, by = +btn.dataset.by, v = plan[w];
        const off = by < 0 ? v <= bd[w][0] : v >= bd[w][1];
        if (off) btn.setAttribute('aria-disabled', 'true'); else btn.removeAttribute('aria-disabled');
      }
      // handles
      for (const w of ['out', 'back']) {
        const el = handles[w], win = w === 'out' ? c.oWin : c.bWin, why = w === 'out' ? c.oWhy : c.bWhy;
        el.setAttribute('aria-valuemin', bd[w][0]); el.setAttribute('aria-valuemax', bd[w][1]); el.setAttribute('aria-valuenow', plan[w]);
        el.setAttribute('aria-valuetext', `${fmt(plan[w])}, ${win ? 'inside the window' : 'outside the window: ' + (why.join(', ') || 'no window')}`);
      }
    }
    // verdict
    const bad = ws.filter((x) => x.r.tone === 'bad').length + (c && (!c.oWin || !c.bWin) ? 1 : 0);
    const cautions = ws.filter((x) => x.r.tone === 'warn').length;
    const affect = ws.filter((x) => x.r.tone !== 'ok').length;
    let vt, vtext;
    if (S.state === 'empty') { vt = null; }
    else if (S.state === 'nowindow') { vt = 'bad'; vtext = 'No safe window this day'; }
    else if (!S.windOk) { vt = 'unknown'; vtext = 'Wind not checked: tide and daylight only'; }
    else if (bad) { vt = 'bad'; vtext = 'Outside Wren’s limits'; }
    else if (cautions) { vt = 'warn'; vtext = `Inside Wren’s limits, ${cautions} caution${cautions > 1 ? 's' : ''}`; }
    else { vt = 'ok'; vtext = 'Inside Wren’s limits'; }
    const verdict = $('#verdict');
    verdict.hidden = !vt;
    if (vt) { verdict.dataset.tone = vt; verdict.innerHTML = ICON[vt] + `<span>${vtext}</span>`; }
    $('#answer').innerHTML = answer(c, ws);
    // warnings
    $('#w-count').textContent = S.state === 'nowindow' ? `${ws.length} warnings, no safe window this day`
      : !S.windOk ? `${ws.length} warnings, ${ws.filter((x) => x.r.tone === 'unknown').length} not checked`
        : `${ws.length} warnings, ${affect} affect${affect === 1 ? 's' : ''} your plan`;
    const changed = [];
    for (const { w, r } of ws) {
      const li = $(`#warn-${w.key}`); if (!li) continue;
      const title = r.title || w.title;
      $('h3', li).textContent = title;
      const eff = $('.effect', li), was = prevTones[w.key];
      const html = `<span class="word" data-tone="${r.tone}">${ICON[r.tone]}${r.word}</span><span>${r.text}</span>`;
      if (eff.dataset.html !== html) {
        eff.dataset.html = html;
        eff.innerHTML = html;
        if (was && was !== r.tone) {
          changed.push(`${title}: ${r.word}`);
          if (animate && !reduced.matches) {
            li.dataset.flash = '';
            setTimeout(() => delete li.dataset.flash, ms('--duration-slow'));
            eff.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms('--duration-base'), easing: EASE });
          }
        }
      }
      const badge = $('.badge', li); badge.dataset.tone = w.sev || r.tone;
      prevTones[w.key] = r.tone;
    }
    if (changed.length) { clearTimeout(liveTimer); liveTimer = setTimeout(() => { live.textContent = 'Warnings changed. ' + changed.join('. ') + '.'; }, 400); }
    // timeline dynamic
    if (c && PW) {
      const lane = plots.plan;
      $('.wins', lane).innerHTML = [...S.outWins, ...c.backWins].map((w) => {
        const a = X(Math.max(w[0], dom[0])), b = X(Math.min(w[1], dom[1]));
        return b > a ? `<span class="span window" style="--x:${a.toFixed(1)}px;--w:${(b - a).toFixed(1)}px"></span>` : '';
      }).join('');
      pos($('[data-leg="o"]', lane), X(c.o.dep), X(c.o.arr) - X(c.o.dep));
      pos($('[data-leg="b"]', lane), X(c.b.dep), X(c.b.arr) - X(c.b.dep));
      pos(handles.out, X(plan.out)); pos(handles.back, X(plan.back));
      const lo = $('[data-ll="o"]', lane), lb = $('[data-ll="b"]', lane);
      lo.hidden = false;
      lo.innerHTML = `Out ${fmt(c.o.dep)} <span>to ${fmt(c.o.arr)}</span>`; lb.innerHTML = `Back ${fmt(c.b.dep)} <span>to ${fmt(c.b.arr)}</span>`;
      const xb = Math.min(X(c.b.dep), PW - lb.offsetWidth);
      pos(lb, xb);
      let xo = X(c.o.dep);
      if (xo + lo.offsetWidth > xb - 8) lo.innerHTML = `Out ${fmt(c.o.dep)}`;
      if (xo + lo.offsetWidth > xb - 8) lo.hidden = true;
      pos(lo, xo);
      const m = c.margin, a = Math.min(c.b.arr, H.SUNSET), b = Math.max(c.b.arr, H.SUNSET);
      const br = $('.margin-bracket', lane);
      pos(br, X(a), X(b) - X(a)); br.dataset.tone = m < 0 ? 'bad' : m < 30 ? 'warn' : 'ok';
      const bdg = $('[data-badge="light"]', lane);
      bdg.dataset.tone = br.dataset.tone; bdg.style.left = Math.min(PW - 16, X(b) + 4).toFixed(1) + 'px'; bdg.style.top = '41px';
      const g = { o: c.o, b: c.b };
      for (const el of $$('.leg-guide', tl)) { const L = g[el.dataset.g]; pos(el, X(L.dep), X(L.arr) - X(L.dep)); }
    }
    // route times
    if (c) {
      const ot = legTimes(plan.out, 1), bt = legTimes(plan.back, -1);
      $('#wp-body').innerHTML = WP.map(([name, d], i) => `<tr><th scope="row">${name}</th><td>${d.toFixed(1)}</td><td>${fmt(ot[i])}</td><td>${fmt(bt[i])}</td></tr>`).join('');
      $$('[data-wp]').forEach((el) => { el.textContent = fmt(ot[+el.dataset.wp]); });
    }
    // save bar
    const sum = $('#savebar-sum');
    if (c) sum.innerHTML = `<strong>Out ${fmt(plan.out)} · Back ${fmt(plan.back)}</strong><span>Home ${fmt(c.b.arr)}${vt === 'warn' ? `, ${cautions} caution${cautions > 1 ? 's' : ''}` : vt === 'bad' ? ', outside limits' : ''}</span>`;
    else sum.innerHTML = S.state === 'empty' ? '<strong>No boat yet</strong><span>Add one to see windows</span>' : '<strong>No safe window</strong><span>Wind over 20 kn all day</span>';
    if (saved && c) noticeSaved(ws);
  }

  function legTimes(dep, dir) {
    const targets = WP.map(([, d]) => (dir > 0 ? d : H.DIST - d));
    const out = targets.map((d) => (d <= 0 ? dep : null));
    let d = 0, t = dep, steps = 0;
    while (d < H.DIST && steps < 600) {
      const sog = H.LIMITS.speed + 0.5 * (-dir * H.stream(t));
      d += sog / 60; t += 1; steps++;
      targets.forEach((g, i) => { if (out[i] == null && d >= g - 1e-9) out[i] = t; });
    }
    return out.map((v) => (v == null ? t : v));
  }

  function answer(c, ws) {
    if (S.state === 'empty') return '';
    if (S.state === 'nowindow') return `No safe window on Saturday 24 October. The mean wind is over Wren’s 20 kn limit from <strong>${fmtOut(...S.limitSpan)}</strong>, gusting ${S.limitGust} kn. Try another day, or sail somewhere more sheltered.`;
    const o = c.o, b = c.b;
    let s = `Leave Lymington at <strong>${fmt(o.dep)}</strong> and Yarmouth at <strong>${fmt(b.dep)}</strong>. `;
    const fo = o.minFav >= 0.5, fb = b.minFav >= 0.5;
    s += fo && fb ? 'The stream is with you both ways' : !fo && !fb ? 'The stream is against you both ways' : `The stream is against you on the ${fo ? 'return' : 'out leg'}`;
    if (!S.windOk) return s + `. The wind forecast didn’t load, so this checks the tide and daylight only: retry before you decide.`;
    s += Math.max(o.worstWind, b.worstWind) <= H.LIMITS.wind ? ' and the mean wind stays inside Wren’s 20 kn limit.' : ', and the mean wind goes over Wren’s 20 kn limit.';
    const wat = ws.find((x) => x.w.key === 'wat'), gust = ws.find((x) => x.w.key === 'gust');
    if (wat && wat.r.tone === 'bad') s += ` Your ${wat.r.short.replace('wind against tide on the ', '')} crosses up to ${S.watMax} kn of wind against tide, over the 12 kn limit.`;
    const m = c.margin, home = m >= 0 ? `gets you home ${dur(m)} before sunset` : `gets you home ${dur(-m)} after sunset`;
    if (gust && gust.r.tone === 'warn') s += ` The ${gust.r.short.split(' on the ')[1]} meets gusts to ${S.gustMax} kn and ${home}.`;
    else s += ` The return ${home}.`;
    return s;
  }

  /* ---------- warnings list ---------- */
  function buildWarnings() {
    const ol = $('#warnings');
    ol.innerHTML = S.warns.map((w) => `<li class="warn" id="warn-${w.key}" data-n="${w.n}">
      <div class="sev"><span class="badge" data-tone="${w.sev || 'warn'}" aria-hidden="true">${w.n}</span></div>
      <div><h3>${w.title}</h3><p>${w.body}</p></div>
      <p class="effect"></p>
    </li>`).join('');
    for (const li of $$('.warn', ol)) {
      li.addEventListener('pointerenter', () => { tl.dataset.hl = li.dataset.n; });
      li.addEventListener('pointerleave', () => { delete tl.dataset.hl; });
    }
  }

  /* ---------- primary action ---------- */
  function primaryHTML() {
    switch (S.state) {
      case 'loading': return '';
      case 'empty': return `<a class="btn btn-primary" href="/boats/new">${ICON.plus}Add your boat</a>`;
      case 'nowindow': return '<a class="btn btn-primary" href="/plans/new?date=2026-10-25">Choose another day</a>';
      case 'error': return `<button class="btn btn-primary" type="button" data-action="retry">${ICON.retry}<span class="label">Retry forecast</span><span class="spinner" aria-hidden="true"></span></button>`;
      default: return '<button class="btn btn-primary" type="button" data-action="save"><span class="label">Save plan</span><span class="spinner" aria-hidden="true"></span></button>';
    }
  }
  function setSaveButtons(mode) { // 'save' | 'busy' | 'saved'
    for (const btn of $$('[data-action="save"]')) {
      const label = $('.label', btn);
      btn.removeAttribute('aria-busy'); btn.removeAttribute('aria-disabled');
      $$('svg.i', btn).forEach((n) => n.remove());
      if (mode === 'busy') { btn.setAttribute('aria-busy', 'true'); btn.setAttribute('aria-disabled', 'true'); label.textContent = 'Save plan'; }
      else if (mode === 'saved') { btn.className = 'btn btn-secondary'; btn.setAttribute('aria-disabled', 'true'); btn.insertAdjacentHTML('afterbegin', ICON.check); label.textContent = 'Plan saved'; }
      else { btn.className = 'btn btn-primary'; label.textContent = 'Save plan'; }
    }
  }
  function setUsage(n) {
    $$('[data-usage]').forEach((el) => { el.textContent = `${n} of 3`; });
    const m = $('[data-meter]'); m.setAttribute('aria-valuenow', n); $('[data-meter-fill]').style.inlineSize = (n / 3 * 100).toFixed(3) + '%';
  }
  function noticeSaved(ws) {
    const open = ws.filter((x) => x.r.tone !== 'ok' && x.r.short).map((x) => x.r.short);
    const c = calc();
    if (!c.oWin) open.unshift(`out leg outside its window: ${c.oWhy.join(', ') || 'no window'}`);
    if (!c.bWin) open.unshift(`return outside its window: ${c.bWhy.join(', ') || 'no window after you arrive'}`);
    const n = $('#notice');
    n.hidden = false; n.dataset.tone = 'ok';
    n.innerHTML = `${ICON.ok}<div class="body"><p><strong>Plan saved.</strong> Find it in <a href="/plans">Saved plans</a>.</p>${open.length ? `<p class="muted">Still open: ${open.join('; ')}.</p>` : ''}</div>`;
  }
  function unsave() {
    saved = false;
    setSaveButtons('save');
    $('#notice').hidden = true;
    history.replaceState(null, '', location.pathname);
  }
  function save(btn) {
    if (btn.getAttribute('aria-disabled') === 'true') return;
    setSaveButtons('busy');
    live.textContent = 'Saving the plan.';
    setTimeout(() => {
      saved = true;
      if (!savedOnce) { savedOnce = true; setUsage(2); }
      setSaveButtons('saved');
      history.replaceState(null, '', '?state=saved');
      paint(false);
      toast(`Plan saved: out ${fmt(plan.out)}, back ${fmt(plan.back)}`);
      live.textContent = 'Plan saved.';
    }, ms('--duration-reveal'));
  }
  let toastTimer = 0;
  function toast(text) {
    const t = $('#toast');
    $('#toast-text').textContent = text;
    t.hidden = true; void t.offsetWidth; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 5000);
  }

  /* ---------- boot per state ---------- */
  function boot(state) {
    S = setup(state);
    plan = { out: 11 * 60 + 50, back: 16 * 60 + 44 };
    prevTones = {};
    saved = state === 'saved'; savedOnce = saved;
    const loading = state === 'loading';
    $('#skeleton').hidden = !loading; $('#content').hidden = loading;
    if (loading) main.setAttribute('aria-busy', 'true'); else main.removeAttribute('aria-busy');
    live.textContent = loading ? 'Loading the forecast.' : '';
    // boat and usage
    for (const el of $$('[data-boat-name]')) el.textContent = S.hasBoat ? 'Wren' : 'No boat yet';
    for (const el of $$('[data-boat-desc]')) el.textContent = S.hasBoat ? '7.9 m sloop, plans at 5.0 kn' : 'Add one to find windows';
    $('[data-boat-line]').textContent = S.hasBoat ? 'Wren, 7.9 m sloop' : 'No boat yet';
    setUsage(!S.hasBoat ? 0 : saved ? 2 : 1);
    // primary
    for (const slot of $$('[data-primary-slot]')) slot.innerHTML = primaryHTML();
    $('#savebar').hidden = loading;
    if (saved) setSaveButtons('saved');
    // sections per state
    $('#summary').hidden = !S.hasBoat;
    $('#facts').hidden = !S.hasPlan;
    $('#warnings-panel').hidden = !S.hasBoat;
    $('#limits').hidden = !S.hasBoat;
    $('#route').dataset.data = S.hasPlan ? '' : 'none';
    $('#wp-body').closest('table').hidden = !S.hasPlan;
    $$('[data-wp]').forEach((el) => { el.textContent = ''; });
    $('#route-cap').textContent = S.hasPlan ? 'Route schematic, not to scale and not for navigation. Times are for your out leg.' : 'Route schematic, not to scale and not for navigation.';
    $$('[data-plan-key]').forEach((el) => { el.hidden = !S.hasPlan; });
    $$('[data-plus]').forEach((el) => { el.hidden = !S.hasBoat; });
    $('#content').toggleAttribute('data-sample', !S.hasBoat);
    $$('[data-boat-key]').forEach((el) => { el.hidden = !S.hasBoat; });
    $('#tl-keys').hidden = !S.hasPlan;
    $('#tl-sub').textContent = S.hasPlan ? 'Times BST. Drag a departure, or focus it and use the arrow keys.' : 'Times BST, sample data.';
    $('#wind-sub').textContent = S.windOk ? 'From SW, knots' : 'Not loaded';
    $('#wind-desc').textContent = S.windOk ? `Wind, sample forecast, from the south-west: mean ${Math.round(S.W.mean(H.SUNRISE))} kn at sunrise rising to ${Math.round(S.W.mean(17 * 60))} kn at 17:00, gusts up to ${S.gustPeak} kn.${S.hasBoat && S.watSpan ? ` Wind against tide over Wren’s 12 kn limit ${fmtOut(...S.watSpan)}.` : ''}${S.gustSpan ? ` Gusts over 20 kn ${fmtOut(...S.gustSpan)}.` : ''}` : 'Wind forecast not loaded.';
    const n = $('#notice');
    n.hidden = true; n.removeAttribute('data-tone');
    if (state === 'error') {
      n.hidden = false; n.dataset.tone = 'bad';
      n.innerHTML = `${ICON.bad}<div class="body"><p><strong>The wind forecast didn’t load.</strong> Tide, stream and daylight are up to date, so the windows below check those only.</p><p class="muted">Halyard tries again on its own every 5 minutes.</p></div>`;
    } else if (state === 'empty') {
      n.hidden = false;
      n.innerHTML = `${ICON.unknown}<div class="body"><h2>Add your boat to see your windows</h2><p>Halyard finds windows from your boat’s speed and limits. The tide, stream and wind below are for Saturday 24 October (sample).</p><ol class="steps-list"><li>Add your boat: name, length and planning speed.</li><li>Set its limits: true wind, wind against tide, arrive by sunset.</li><li>Halyard marks the out and back windows and warns you when they close.</li></ol></div>`;
    }
    if (loading) return;
    S.warns = S.hasBoat ? warnings(null) : [];
    buildWarnings();
    drawStatic();
    hourly();
    if (saved) noticeSaved(S.warns.map((w) => ({ w, r: w.eval(calc()) })));
  }

  function hourly() {
    let s = '';
    for (let h = 0; h < 24; h++) {
      const t = h * 60;
      s += `<tr><th scope="row">${fmt(t)}</th><td>${H.tide(t).toFixed(1)}</td><td>${streamText(H.stream(t))}</td>`;
      s += S.windOk ? `<td>${Math.round(S.W.mean(t))}</td><td>${Math.round(S.W.gust(t))}</td><td>${compass(S.W.dir(t))} ${Math.round(S.W.dir(t))}°</td></tr>` : '<td colspan="3">Not loaded</td></tr>';
    }
    $('#hourly').innerHTML = s;
  }

  /* ---------- crosshair and readout ---------- */
  const readout = $('#readout');
  function cross(e) {
    if ($('.handle[data-dragging]') || e.pointerType === 'touch') return;
    if (e.target.closest('.handle')) { delete tl.dataset.cross; return; }
    const r = plots.tide.getBoundingClientRect(), tr = tl.getBoundingClientRect();
    const x = e.clientX - r.left; if (x < 0 || x > PW) { delete tl.dataset.cross; return; }
    const t = Math.round(T(x) / 5) * 5, xc = X(t);
    $$('.cross', tl).forEach((el) => pos(el, xc));
    const okText = (L) => { const ok = H.legOk(L, S.WL); return ok ? 'Inside limits' : L.dep < H.SUNRISE ? 'Before sunrise' : L.minFav < 0.5 ? 'Stream against' : L.worstWat > 12 ? 'Wind against tide' : L.worstWind > 20 ? 'Wind over limit' : 'After sunset'; };
    let rows = `<dt>Tide</dt><dd>${H.tide(t).toFixed(1)} m</dd><dt>Stream</dt><dd>${streamText(H.stream(t))}${Math.abs(H.stream(t)) < 0.2 ? '' : ' kn'}</dd>`;
    rows += S.windOk ? `<dt>Wind</dt><dd>${Math.round(S.W.mean(t))} kn ${compass(S.W.dir(t))}</dd><dt>Gust</dt><dd>${Math.round(S.W.gust(t))} kn</dd>` : '<dt>Wind</dt><dd>Not loaded</dd>';
    if (S.hasPlan) rows += `<dt>Leave Lymington</dt><dd>${okText(H.leg(S.WL, t, 1))}</dd><dt>Leave Yarmouth</dt><dd>${okText(H.leg(S.WL, t, -1))}</dd>`;
    readout.innerHTML = `<p class="rt">${fmt(t)}${t < H.SUNRISE || t > H.SUNSET ? ', dark' : ''}</p><dl>${rows}</dl>`;
    const left = r.left - tr.left + xc, w = readout.offsetWidth;
    pos(readout, left + 12 + w > tr.width - 8 ? left - 12 - w : left + 12);
    readout.style.top = ($('#tl-rows').offsetTop + 44) + 'px';
    tl.dataset.cross = '';
  }
  const rows = $('#tl-rows');
  rows.addEventListener('pointermove', cross);
  rows.addEventListener('pointerleave', () => { delete tl.dataset.cross; });

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (step) {
      if (step.getAttribute('aria-disabled') === 'true') return;
      tl.dataset.anim = '';
      clearTimeout(animTimer);
      animTimer = setTimeout(() => { delete tl.dataset.anim; }, ms('--duration-base') + 80);
      setTime(step.dataset.step, plan[step.dataset.step] + +step.dataset.by, 'step');
      return;
    }
    const act = e.target.closest('[data-action]');
    if (act && act.dataset.action === 'save') { save(act); return; }
    if (act && act.dataset.action === 'retry') {
      if (act.getAttribute('aria-busy') === 'true') return;
      history.replaceState(null, '', '?state=loading');
      boot('loading');
      setTimeout(() => { history.replaceState(null, '', location.pathname); boot('default'); live.textContent = 'Forecast loaded.'; }, ms('--duration-reveal') * 2);
      return;
    }
    const menu = e.target.closest('[data-menu]');
    if (menu) toggleMenu(menu.getAttribute('aria-expanded') !== 'true');
  });
  const menuBtn = $('[data-menu]'), panel = $('#nav-panel');
  function toggleMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    $('[data-menu-label]').textContent = open ? 'Close' : 'Menu';
    $('svg.i', menuBtn).outerHTML = open ? ICON.close : ICON.menu;
    if (open && !reduced.matches) panel.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: ms('--duration-slow'), easing: css.getPropertyValue('--ease-enter').trim() });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { toggleMenu(false); menuBtn.focus(); } });

  // The route draws once, the first time it is mostly on screen
  const map = $('#map');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { map.dataset.drawn = ''; io.disconnect(); } }, { threshold: 0.4 });
    io.observe(map);
  } else map.dataset.drawn = '';

  let raf = 0, lastW = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { const w = plots.tide.clientWidth; if (w && w !== lastW) { lastW = w; if (S.state !== 'loading') drawStatic(); } });
  }).observe(plots.tide);

  let start = new URLSearchParams(location.search).get('state');
  if (!STATES.includes(start)) start = 'default';
  boot(start);
})();
