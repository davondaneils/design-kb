// Sample run data for the ferry.html hero mock and crossing figure. All values are SAMPLE (fictional).
// Rates are sample mid-market rates (1 USD = x), not live quotes. Run: node src/data.mjs
const rates = { USD: 1, CAD: 1.3842, GBP: 0.7463, EUR: 0.8612, MXN: 18.214, BRL: 5.412, INR: 88.46 };
const people = [
  ['Dana Whitfield', 'Austin, US', 'USD', 9200],
  ['Theo Marchand', 'Lyon, FR', 'EUR', 6450],
  ['Priya Raman', 'Bengaluru, IN', 'INR', 412000],
  ['Lucas Ferreira', 'Recife, BR', 'BRL', 24800],
  ['Sofía Herrera', 'Guadalajara, MX', 'MXN', 68500],
  ['Grace Liang', 'Toronto, CA', 'CAD', 10900],
  ['Owen Price', 'Bristol, GB', 'GBP', 5350],
  ['Marcus Bell', 'Denver, US', 'USD', 7800],
  ['Hannah Kim', 'Seattle, US', 'USD', 8600],
  ['Jonah Weiss', 'Montréal, CA', 'CAD', 8200],
  ['Camille Dubois', 'Nantes, FR', 'EUR', 5900],
  ['Arjun Mehta', 'Pune, IN', 'INR', 365000],
];
let total = 0;
for (const [n, c, cur, amt] of people) {
  const usd = Math.round((amt / rates[cur]) * 100) / 100;
  total += usd;
  console.log(n.padEnd(16), cur, amt.toLocaleString('en-US'), '->', usd.toLocaleString('en-US', { minimumFractionDigits: 2 }));
}
console.log('TOTAL USD', (Math.round(total * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }));
const byCur = {};
for (const [, , cur, amt] of people) byCur[cur] = (byCur[cur] || 0) + Math.round((amt / rates[cur]) * 100) / 100;
console.log(byCur);
console.log('Pricing 12 people:', (12 - 3) * 12, 'USD/month');
console.log('Oct 30 2026 weekday:', new Date(Date.UTC(2026, 9, 30)).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }));
