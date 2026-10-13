// Sample run math for the Ferry page. All figures are sample content.
// Mid-market rates per 1 USD are assumptions, not quotes. Ferry's sample spread: 0.4%.
const SPREAD = 0.004;
const rows = [
  ['USD', 'United States', 3, 24500, 1],
  ['CAD', 'Canada', 1, 9200, 1.38],
  ['GBP', 'United Kingdom', 2, 11400, 0.75],
  ['EUR', 'Portugal', 2, 10850, 0.86],
  ['MXN', 'Mexico', 1, 78000, 18.40],
  ['BRL', 'Brazil', 2, 41000, 5.40],
  ['INR', 'India', 1, 310000, 88.0],
];
const f2 = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let total = 0, people = 0;
for (const [cur, country, n, local, mid] of rows) {
  const eff = cur === 'USD' ? 1 : mid * (1 - SPREAD);
  const usd = Math.round((local / eff) * 100) / 100;
  total += usd; people += n;
  console.log(cur.padEnd(4), country.padEnd(15), String(n).padStart(2), f2(local).padStart(12), ('1 USD = ' + eff.toFixed(4)).padStart(18), ('$' + f2(usd)).padStart(12));
}
console.log('people', people, 'total USD', '$' + f2(total));
for (const p of [1, 3, 4, 5, 12, 25, 50, 200]) console.log('plan', p, 'people ->', '$' + Math.max(0, p - 3) * 12, '/mo');
const d = new Date(Date.UTC(2026, 9, 30)); console.log('Oct 30 2026 is', d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }));
const d2 = new Date(Date.UTC(2026, 9, 28)); console.log('Oct 28 2026 is', d2.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }));
