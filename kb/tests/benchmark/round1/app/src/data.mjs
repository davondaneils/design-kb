// Sample data for the Ferry October 2026 run review (Brief 2, kb/tests/benchmark/briefs.md).
// Every person, amount and rate is sample content. Amounts are what each person receives, in their pay currency.
// Rates are quoted as units of the pay currency per 1 USD (how FX desks quote USD pairs), 4 decimals.
// Ferry buys each currency in one trade, so the USD cost of a currency = its local total / rate, rounded to cents,
// and the funding total = the sum of those 7 USD amounts (no per-person rounding).

export const run = {
  month: 'October 2026',
  payDate: 'Fri, Oct 30, 2026',
  approveBy: 'Wed, Oct 28, 5 pm ET',
  ratesAsOf: '9:41 am ET, Tue, Oct 27',
  account: 'Chase operating ··4417',
  alertPct: 2.0,
};

export const currencies = [
  { code: 'USD', name: 'US dollar', rate: 1, sep: 1, avg30: 1 },
  { code: 'CAD', name: 'Canadian dollar', rate: 1.3990, sep: 1.3925, avg30: 1.3962 },
  { code: 'GBP', name: 'British pound', rate: 0.7510, sep: 0.7468, avg30: 0.7489 },
  { code: 'EUR', name: 'Euro', rate: 0.8605, sep: 0.8571, avg30: 0.8590 },
  { code: 'MXN', name: 'Mexican peso', rate: 18.4520, sep: 18.6130, avg30: 18.5310 },
  { code: 'BRL', name: 'Brazilian real', rate: 5.4760, sep: 5.5840, avg30: 5.6200 },
  { code: 'INR', name: 'Indian rupee', rate: 88.1500, sep: 87.9200, avg30: 88.0400 },
];

// status: ready | bank (missing bank details) | rate (paid at a rate above the alert) | hire (new hire, partial month)
export const people = [
  ['Leo Martin', 'Founder and CEO', 'Employee', 'United States', 'USD', 13333.33],
  ['Avery Brooks', 'Engineering manager', 'Employee', 'United States', 'USD', 12500.00],
  ['Dana Whitfield', 'Finance lead', 'Employee', 'United States', 'USD', 11666.67],
  ['Jordan Ellis', 'Senior engineer', 'Employee', 'United States', 'USD', 11250.00],
  ['Ethan Cole', 'Engineer', 'Employee', 'United States', 'USD', 10416.67],
  ['Caleb Turner', 'Engineer', 'Employee', 'United States', 'USD', 10000.00],
  ['Priya Raman', 'Product designer', 'Employee', 'United States', 'USD', 9375.00],
  ['Hannah Moore', 'Marketing manager', 'Employee', 'United States', 'USD', 9166.67],
  ['Marcus Hale', 'Account executive', 'Employee', 'United States', 'USD', 8750.00],
  ['Grace Kim', 'Data analyst', 'Employee', 'United States', 'USD', 8333.33],
  ['Sofia Delgado', 'Customer success lead', 'Employee', 'United States', 'USD', 7500.00],
  ['Noah Patel', 'Support engineer', 'Employee', 'United States', 'USD', 6666.67],
  ['Maya Chen', 'Recruiter', 'Contractor', 'United States', 'USD', 6250.00],
  ['Ruby Alvarez', 'Office operations', 'Contractor', 'United States', 'USD', 5833.33],
  ['Isla Fraser', 'Product manager', 'Employee', 'Canada', 'CAD', 10200.00],
  ['Olivia Tremblay', 'Senior engineer', 'Employee', 'Canada', 'CAD', 9800.00],
  ['Liam Gagnon', 'Engineer', 'Employee', 'Canada', 'CAD', 8500.00],
  ['Chloe Roy', 'Product designer', 'Employee', 'Canada', 'CAD', 7250.00],
  ['Owen MacLeod', 'Support engineer', 'Employee', 'Canada', 'CAD', 6400.00],
  ['George Walsh', 'Engineering manager', 'Employee', 'United Kingdom', 'GBP', 7400.00],
  ['Oliver Hughes', 'Senior engineer', 'Employee', 'United Kingdom', 'GBP', 6200.00],
  ['Freya Collins', 'Account executive', 'Employee', 'United Kingdom', 'GBP', 5100.00],
  ['Imogen Clarke', 'Customer success', 'Employee', 'United Kingdom', 'GBP', 4850.00],
  ['Amara Okafor', 'Engineer', 'Employee', 'United Kingdom', 'GBP', 2500.00, 'hire'],
  ['Sanne de Vries', 'Data engineer', 'Employee', 'Netherlands', 'EUR', 7100.00],
  ['Aoife Byrne', 'Engineer', 'Employee', 'Ireland', 'EUR', 6800.00],
  ['Lukas Becker', 'Engineer', 'Employee', 'Germany', 'EUR', 6300.00],
  ['Emma Laurent', 'Brand designer', 'Contractor', 'France', 'EUR', 5600.00],
  ['Lucía Fernández', 'Content strategist', 'Contractor', 'Spain', 'EUR', 5250.00, 'bank'],
  ['Matteo Rossi', 'QA engineer', 'Contractor', 'Italy', 'EUR', 4900.00],
  ['Mateo Herrera', 'Senior engineer', 'Employee', 'Mexico', 'MXN', 81200.00],
  ['Diego Ramírez', 'Engineer', 'Employee', 'Mexico', 'MXN', 68000.00],
  ['Valeria Cruz', 'Support engineer', 'Employee', 'Mexico', 'MXN', 54500.00],
  ['Camila Ortiz', 'Recruiting coordinator', 'Contractor', 'Mexico', 'MXN', 47800.00],
  ['Rafael Souza', 'Engineer', 'Contractor', 'Brazil', 'BRL', 26400.00, 'rate'],
  ['Ananya Iyer', 'Senior engineer', 'Employee', 'India', 'INR', 310000.00],
  ['Rohan Mehta', 'Engineer', 'Employee', 'India', 'INR', 265000.00],
  ['Kavya Nair', 'QA engineer', 'Contractor', 'India', 'INR', 228000.00],
].map(([name, role, type, country, cur, amount, status = 'ready']) => ({ name, role, type, country, cur, amount, status }));

// The new hire: annual salary GBP 66,000, monthly 5,500.00; started Mon, Oct 19; 10 of 22 working days in October.
export const hire = { monthly: 5500, days: 10, of: 22, start: 'Mon, Oct 19' };
