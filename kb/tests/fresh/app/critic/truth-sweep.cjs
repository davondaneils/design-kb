// Critic scratch: for every departure the page allows, compare the page's claimed peak (whole-span max) with the leg's own exposure.
const H = require('../src/model.js');
const W = H.makeWind(H.WIND), fmt = H.hhmm;
const spans = (f) => H.spans(W, f).filter((s) => s[1] > H.SUNRISE && s[0] < H.SUNSET)[0];
const wat = spans((t) => H.watAt(W, t) > 12), gust = spans((t) => W.gust(t) > 20);
const maxOver = (f, a, b) => { let m = -1; for (let t = a; t <= b; t++) m = Math.max(m, f(t)); return m; };
const watMax = Math.round(maxOver((t) => H.watAt(W, t), ...wat)), gustMax = Math.round(maxOver(W.gust, ...gust));
console.log('WAT span', wat.map(fmt), 'claimed max', watMax, '| gust span', gust.map(fmt), 'claimed max', gustMax);
const ov = (L, s) => L.dep < s[1] && L.arr > s[0];
let watFalse = [], gustFalse = [], slack = [];
for (let dep = 360; dep <= 1140; dep += 5) for (const dir of [1, -1]) {
  const L = H.leg(W, dep, dir);
  if (ov(L, wat)) { const own = Math.round(maxOver((t) => H.watAt(W, t), Math.max(L.dep, wat[0]), Math.min(L.arr, wat[1]))); if (own !== watMax) watFalse.push(`${dir > 0 ? 'out' : 'back'} ${fmt(dep)}: leg sees ${own}, page says ${watMax}`); }
  if (ov(L, gust)) { const own = Math.round(maxOver(W.gust, Math.max(L.dep, gust[0]), Math.min(L.arr, gust[1]))); if (own !== gustMax) gustFalse.push(`${dir > 0 ? 'out' : 'back'} ${fmt(dep)}: leg sees ${own}, page says ${gustMax}`); }
  if (L.minFav < 0.5 && L.minFav >= 0) slack.push(`${dir > 0 ? 'out' : 'back'} ${fmt(dep)}: min fair stream ${L.minFav.toFixed(2)} kn (never foul), page says "stream against you"`);
}
console.log('\nWAT claim false for', watFalse.length, 'departures, e.g.:', watFalse.slice(0, 6).join('; '));
console.log('\nGust claim false for', gustFalse.length, 'departures, e.g.:', gustFalse.slice(0, 4).join('; '), '...', gustFalse.slice(-3).join('; '));
console.log('\nSlack-but-fair labelled "against" for', slack.length, 'departures, e.g.:', slack.slice(0, 4).join('; '));
// hourly table vs sr description
for (const h of [0, 1, 2, 3]) console.log('stream at', fmt(h * 60), H.stream(h * 60).toFixed(2), '(sr text says east-going until 09:40)');
// default plan cross-check from displayed figures
const o = H.leg(W, 710, 1), b = H.leg(W, 1004, -1);
console.log('\ndefault out', fmt(o.dep), fmt(o.arr), o.mins, 'min; back', fmt(b.dep), fmt(b.arr), b.mins, 'min; margin', H.SUNSET - b.arr);
console.log('avg SOG out', (4.5 / (o.mins / 60)).toFixed(2), 'kn; back', (4.5 / (b.mins / 60)).toFixed(2), 'kn');
console.log('out windows', H.windows(W, 1).map((w) => w.map(fmt)), 'back windows', H.windows(W, -1).map((w) => w.map(fmt)));
