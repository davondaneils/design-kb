// Seeded 20 percent sample of the graphic research citations for the critic's re-fetch (seed 20261010, mulberry32).
import fs from 'node:fs';
const urls = fs.readFileSync(new URL('./urls.txt', import.meta.url), 'utf8').trim().split('\n');
let s = 20261010;
const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const n = Math.max(5, Math.ceil(urls.length * 0.2));
const pool = [...urls]; const out = [];
while (out.length < n) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
console.log(urls.length, 'urls, sample', n); console.log(out.join('\n'));
