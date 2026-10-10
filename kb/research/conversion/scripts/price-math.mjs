#!/usr/bin/env node
// Derived numbers for the coffee test page (researcher rule: compute, do not estimate).
// Run: node kb/research/conversion/scripts/price-math.mjs
const shop = 21, sub = 18, ship = 6, freeOver = 40; // shop bag price, subscription bag price, one-off shipping, free-shipping threshold (test-brief values)
const pct = (a, b) => ((1 - a / b) * 100).toFixed(2);
console.log(`Subscription vs shop price: $${shop - sub} a bag, ${pct(sub, shop)}% off (the baseline page claimed 15%)`);
console.log(`Subscription vs one-off with shipping ($${shop + ship}): $${shop + ship - sub} a bag, ${pct(sub, shop + ship)}% off`);
// Cups: 340 g bag at 17 g a cup (a common 1:16 brew ratio for 270 ml) = 20 cups.
const cups = Math.floor(340 / 17);
console.log(`Cups per 340 g bag at 17 g: ${cups}; per cup: $${(sub / cups).toFixed(2)} subscribed, $${(shop / cups).toFixed(2)} one-off`);
// Cadence: 2 weeks vs 4 weeks, one bag. Yearly cost.
for (const weeks of [2, 4]) console.log(`Every ${weeks} weeks, 1 bag: ${Math.round(52 / weeks)} bags a year, $${(52 / weeks * sub).toFixed(0)} a year`);
console.log(`Two bags reach the $${freeOver} free-shipping line one-off? ${2 * shop >= freeOver}`);
