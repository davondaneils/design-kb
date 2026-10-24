// Sample data for the Ferry October 2026 run (Brief 2). Every name and amount is sample content.
// Amounts are monthly net pay in the person's pay currency. Rates are units of the currency per 1 USD,
// quoted at 10:48 am ET on Tue, Oct 13, 2026 (sample). USD cost of a payment = local / rate, rounded to cents;
// the total to fund is the sum of those rounded cents, so every subtotal and the total add up exactly.

export const RATES = {
  USD: { rate: 1, name: 'US dollar' },
  CAD: { rate: 1.3712, name: 'Canadian dollar' },
  GBP: { rate: 0.7486, name: 'British pound' },
  EUR: { rate: 0.8594, name: 'Euro' },
  MXN: { rate: 18.4120, name: 'Mexican peso' },
  BRL: { rate: 5.3480, avg30: 5.4600, name: 'Brazilian real' },
  INR: { rate: 88.6450, name: 'Indian rupee' },
};
export const CCY_ORDER = ['USD', 'CAD', 'GBP', 'EUR', 'MXN', 'BRL', 'INR'];
export const ALERT_THRESHOLD_PCT = 2; // rate alert when a currency costs this much more than its 30-day average

// flag: bank = missing bank details, rate = currency above the alert threshold, prorated = partial month
export const PEOPLE = [
  ['Maya Okafor', 'Head of Engineering', 'United States', 'USD', 15400],
  ['Daniel Brooks', 'Staff Engineer', 'United States', 'USD', 13850],
  ['Hannah Lee', 'Product Designer', 'United States', 'USD', 10200],
  ['Marcus Bell', 'Account Executive', 'United States', 'USD', 9750],
  ['Rachel Kim', 'Finance Lead', 'United States', 'USD', 11300],
  ['Jordan Price', 'Support Engineer', 'United States', 'USD', 7450],
  ['Samira Haddad', 'Data Engineer', 'United States', 'USD', 12100],
  ['Ethan Walsh', 'Engineer', 'United States', 'USD', 10950],
  ['Grace Turner', 'Recruiter', 'United States', 'USD', 7900],
  ['Leo Martinez', 'Engineer', 'United States', 'USD', 11250],
  ['Olivia Grant', 'Marketing Lead', 'United States', 'USD', 10600],
  ['Noah Fischer', 'Solutions Engineer', 'United States', 'USD', 9900],
  ['Chloe Tremblay', 'Engineer', 'Canada', 'CAD', 12800],
  ['Liam Gagnon', 'Engineer', 'Canada', 'CAD', 11950],
  ['Ava Singh', 'Product Manager', 'Canada', 'CAD', 13400],
  ['Owen MacLeod', 'Support Lead', 'Canada', 'CAD', 8750],
  ['Zoe Roy', 'Designer', 'Canada', 'CAD', 10300],
  ['Oliver Hughes', 'Engineering Manager', 'United Kingdom', 'GBP', 8900],
  ['Amelia Clarke', 'Engineer', 'United Kingdom', 'GBP', 7350],
  ['Harry Patel', 'Engineer', 'United Kingdom', 'GBP', 7100],
  ['Isla Morgan', 'Content Designer', 'United Kingdom', 'GBP', 5850],
  ['George Evans', 'Sales Engineer', 'United Kingdom', 'GBP', 6900],
  ['Freya Shaw', 'People Partner', 'United Kingdom', 'GBP', 6250],
  ['Jonas Weber', 'Engineer', 'Germany', 'EUR', 7600],
  ['Lena Hoffmann', 'Engineer', 'Germany', 'EUR', 7250],
  ['Lucía Navarro', 'Designer', 'Spain', 'EUR', 5400],
  ['Pablo Ortega', 'Engineer', 'Spain', 'EUR', 5900],
  ['Inês Carvalho', 'Engineer', 'Portugal', 'EUR', 5150],
  ['Sanne de Vries', 'Product Manager', 'Netherlands', 'EUR', 7800],
  ['Ciara Byrne', 'Support Engineer', 'Ireland', 'EUR', 5600],
  ['Valeria Ruiz', 'Engineer', 'Mexico', 'MXN', 78000],
  ['Tomás Herrera', 'Support Engineer', 'Mexico', 'MXN', 64500, 'bank'],
  ['Diego Castillo', 'QA Engineer', 'Mexico', 'MXN', 59800],
  ['Lucas Moreira', 'Engineer, contractor', 'Brazil', 'BRL', 38500, 'rate'],
  ['Arjun Mehta', 'Engineer', 'India', 'INR', 420000],
  ['Kavya Iyer', 'Engineer', 'India', 'INR', 385000],
  ['Rohan Desai', 'Data Analyst', 'India', 'INR', 298000],
  ['Aditi Rao', 'Engineer, new hire', 'India', 'INR', 360000, 'prorated'],
].map(([name, role, country, ccy, monthly, flag]) => ({ name, role, country, ccy, monthly, flag: flag || null }));

// New hire: started Mon, Oct 19, 2026, paid for Oct 19 to 31: 13 of 31 calendar days.
export const PRORATE = { start: 'Mon, Oct 19', days: 13, of: 31 };

const cents = (x) => Math.round(x * 100);

export function compute() {
  const people = PEOPLE.map((p, i) => {
    const local = p.flag === 'prorated' ? Math.round((p.monthly * PRORATE.days / PRORATE.of) * 100) / 100 : p.monthly;
    const usdCents = cents(local / RATES[p.ccy].rate);
    return { ...p, id: 'p' + (i + 1), local, usdCents };
  });
  const byCcy = CCY_ORDER.map((c) => {
    const rows = people.filter((p) => p.ccy === c);
    const localCents = rows.reduce((a, p) => a + cents(p.local), 0);
    const usdCents = rows.reduce((a, p) => a + p.usdCents, 0);
    return { ccy: c, count: rows.length, localCents, usdCents, rate: RATES[c].rate };
  });
  const totalCents = people.reduce((a, p) => a + p.usdCents, 0);
  // Rate alert: BRL is dearer than its 30-day average (fewer reais per dollar). Extra USD cost on this run:
  const brl = people.find((p) => p.flag === 'rate');
  const brlAtAvgCents = cents(brl.local / RATES.BRL.avg30);
  const brlExtraCents = brl.usdCents - brlAtAvgCents;
  const brlPct = (RATES.BRL.avg30 / RATES.BRL.rate - 1) * 100;
  const held = people.find((p) => p.flag === 'bank');
  const newHire = people.find((p) => p.flag === 'prorated');
  return { people, byCcy, totalCents, brl, brlAtAvgCents, brlExtraCents, brlPct, held, newHire };
}

if (process.argv[1] && process.argv[1].endsWith('data.mjs')) {
  const d = compute();
  const f = (c) => (c / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  console.log('people', d.people.length, 'currencies', new Set(d.people.map((p) => p.ccy)).size);
  for (const r of d.byCcy) console.log(r.ccy, r.count, (r.localCents / 100).toFixed(2), r.rate, f(r.usdCents));
  console.log('total', f(d.totalCents), 'sum of currencies', f(d.byCcy.reduce((a, r) => a + r.usdCents, 0)));
  console.log('BRL', d.brlPct.toFixed(2) + '%', 'extra', f(d.brlExtraCents), 'held', d.held.name, d.held.local, f(d.held.usdCents));
  console.log('new hire', d.newHire.local, f(d.newHire.usdCents));
}
