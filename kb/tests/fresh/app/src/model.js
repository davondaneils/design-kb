/* Halyard plan model (sample data). Pure functions, no DOM. Times are minutes after 00:00 BST on Saturday 24 October 2026. */
const HALYARD = (() => {
  const SUNRISE = 7 * 60 + 33, SUNSET = 17 * 60 + 56;
  const DIST = 4.5;               // nm each way, Lymington Yacht Haven to Yarmouth Harbour
  const MIN_ASHORE = 30;          // minutes at Yarmouth before the return can start
  const STREAM_SHARE = 0.5;       // share of the Needles Channel stream that acts along the track (sample model)
  // Tidal stream turns at the Needles Channel (sample). Sign: + east-going, - west-going. Peak in knots.
  const STREAM = [
    [-130, 3 * 60 + 30, -2.2],
    [3 * 60 + 30, 9 * 60 + 40, 2.3],
    [9 * 60 + 40, 15 * 60 + 50, -2.4],
    [15 * 60 + 50, 22 * 60, 2.6],
    [22 * 60, 28 * 60 + 10, -2.2],
  ];
  // Wind (sample forecast): hour, mean kn, gust kn, from degrees
  const WIND = [
    [0, 7, 11, 230], [3, 6, 10, 220], [6, 7, 11, 215], [8, 9, 13, 220], [10, 10, 14, 225], [12, 11, 16, 225],
    [13, 11.5, 17, 230], [14, 13, 18, 230], [15, 15, 18, 230], [16, 16, 20, 235], [17, 18, 23, 235],
    [18, 17, 22, 240], [19, 15, 20, 240], [21, 12, 17, 245], [24, 10, 14, 245],
  ];
  const WIND_STORM = WIND.map(([h, m, g, d]) => [h, h >= 6 && h <= 20 ? Math.max(m + 9, 21) : m + 6, (h >= 6 && h <= 20 ? Math.max(m + 9, 21) : m + 6) + 7, d]);
  // Tide at Lymington (sample): extremes [minute, metres, 'HW'|'LW']
  const TIDE = [[-2 * 60 - 45, 2.9, 'HW'], [3 * 60 + 5, 0.6, 'LW'], [9 * 60 + 20, 2.8, 'HW'], [15 * 60 + 30, 0.7, 'LW'], [21 * 60 + 40, 2.9, 'HW'], [27 * 60 + 50, 0.6, 'LW']];
  const LIMITS = { wind: 20, wat: 12, speed: 5.0 };
  const lerpTable = (tbl, h, i) => {
    for (let k = 0; k < tbl.length - 1; k++) if (h >= tbl[k][0] && h <= tbl[k + 1][0]) {
      const f = (h - tbl[k][0]) / (tbl[k + 1][0] - tbl[k][0]);
      return tbl[k][i] + f * (tbl[k + 1][i] - tbl[k][i]);
    }
    return tbl[tbl.length - 1][i];
  };
  const stream = (t) => { for (const [a, b, p] of STREAM) if (t >= a && t < b) return p * Math.sin(Math.PI * (t - a) / (b - a)); return 0; };
  const tide = (t) => { for (let k = 0; k < TIDE.length - 1; k++) { const [a, ha] = TIDE[k], [b, hb] = TIDE[k + 1]; if (t >= a && t <= b) { const f = (t - a) / (b - a); return ha + (hb - ha) * (1 - Math.cos(Math.PI * f)) / 2; } } return 1.5; };
  const makeWind = (tbl) => ({ mean: (t) => lerpTable(tbl, t / 60, 1), gust: (t) => lerpTable(tbl, t / 60, 2), dir: (t) => lerpTable(tbl, t / 60, 3) });
  // Wind against tide: SW wind blows toward the north-east, so a west-going stream of 0.5 kn or more opposes it.
  const watAt = (w, t) => (stream(t) <= -0.5 ? w.mean(t) : 0);
  function leg(w, dep, dir) { // dir +1 out (westward, helped by west-going), -1 back (eastward)
    let d = 0, t = dep, worstWind = 0, worstGust = 0, worstWat = 0, minFav = 99, steps = 0;
    while (d < DIST && steps < 600) {
      const fav = -dir * stream(t);
      const sog = LIMITS.speed + STREAM_SHARE * fav;
      worstWind = Math.max(worstWind, w.mean(t)); worstGust = Math.max(worstGust, w.gust(t)); worstWat = Math.max(worstWat, watAt(w, t)); minFav = Math.min(minFav, fav);
      d += sog / 60; t += 1; steps++;
    }
    return { dep, arr: t, mins: t - dep, worstWind, worstGust, worstWat, minFav };
  }
  function legOk(L, w) { return L.minFav >= 0.5 && L.worstWind <= LIMITS.wind && L.worstWat <= LIMITS.wat && L.dep >= SUNRISE && L.arr <= SUNSET; }
  function windows(w, dir) {
    const out = []; let cur = null;
    for (let t = SUNRISE; t <= SUNSET; t += 1) {
      const ok = legOk(leg(w, t, dir), w);
      if (ok && !cur) cur = [t, t]; else if (ok) cur[1] = t; else if (cur) { out.push(cur); cur = null; }
    }
    if (cur) out.push(cur);
    return out;
  }
  function spans(w, test) { const out = []; let cur = null; for (let t = 0; t <= 1440; t++) { const ok = test(t); if (ok && !cur) cur = [t, t]; else if (ok) cur[1] = t; else if (cur) { out.push(cur); cur = null; } } if (cur) out.push(cur); return out; }
  const hhmm = (m) => { m = Math.round(m); const h = Math.floor(m / 60), mm = m % 60; return String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0'); };
  return { SUNRISE, SUNSET, DIST, MIN_ASHORE, LIMITS, TIDE, stream, tide, makeWind, WIND, WIND_STORM, watAt, leg, legOk, windows, spans, hhmm };
})();
if (typeof module !== 'undefined') module.exports = HALYARD;
