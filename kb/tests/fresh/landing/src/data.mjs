// The one sample dataset behind every Halyard fragment: Saturday 24 October 2026, Lymington, BST (UTC+1; BST ends
// Sunday 25 October 2026). Sample data for a design test, labelled on the page. Not for navigation.
// Sunrise 07:33 and sunset 17:56 are given in the brief (kb/tests/fresh/briefs.md).

export const axis = { from: '05:00', to: '20:00', ticks: ['06:00', '09:00', '12:00', '15:00', '18:00'] };

// Tide extremes at Lymington (sample). day: -1 is Friday 23 October.
export const tides = [
  { t: '22:58', day: -1, h: 2.7, kind: 'HW' },
  { t: '05:12', h: 0.7, kind: 'LW' },
  { t: '10:58', h: 2.8, kind: 'HW' },
  { t: '17:31', h: 0.6, kind: 'LW' },
  { t: '23:18', h: 2.9, kind: 'HW' },
];

// Solent stream (sample): direction it runs towards, max rate.
export const stream = [
  { from: '05:00', to: '05:40', dir: 'W', max: 0.4 },
  { from: '05:40', to: '11:10', dir: 'E', max: 1.9, label: true },
  { from: '11:10', to: '17:50', dir: 'W', max: 2.6, label: true },
  { from: '17:50', to: '20:00', dir: 'E', max: 1.2 },
];

// Boat and limits.
export const boat = { name: 'Wren', length: '7.9 m', type: 'sloop', wind: 20, against: 12 };
export const windMax = 25; // top of the wind lane, knots

// Hourly wind for the hour starting at h (sample). against: wind blows against the west-going stream.
export const wind = [
  { h: 5, dir: 'SW', kn: 7, gust: 10 }, { h: 6, dir: 'SW', kn: 8, gust: 11 }, { h: 7, dir: 'SW', kn: 8, gust: 12 },
  { h: 8, dir: 'SW', kn: 9, gust: 13 }, { h: 9, dir: 'SW', kn: 10, gust: 14 }, { h: 10, dir: 'SW', kn: 10, gust: 15 },
  { h: 11, dir: 'WSW', kn: 11, gust: 16 }, { h: 12, dir: 'WSW', kn: 11, gust: 17 }, { h: 13, dir: 'WSW', kn: 12, gust: 18 },
  { h: 14, dir: 'W', kn: 12, gust: 19, against: true }, { h: 15, dir: 'W', kn: 15, gust: 20, against: true },
  { h: 16, dir: 'W', kn: 17, gust: 23, against: true }, { h: 17, dir: 'W', kn: 17, gust: 22, against: true },
  { h: 18, dir: 'W', kn: 16, gust: 22 }, { h: 19, dir: 'W', kn: 15, gust: 21 },
];

export const sun = { rise: '07:33', set: '17:56' };
export const passage = { nm: 10.5, minutes: 100 }; // each way, about 1 h 40 min
export const latestLeave = '16:16'; // leave Cowes after this and you arrive after sunset (17:56 minus 1 h 40 min)

// Departure rows: when you can leave, and why other times are cut.
export const rows = [
  { i: 0, name: 'Out', short: 'Out', leg: 'Lymington to Cowes', win: ['07:33', '09:30'],
    cuts: [{ why: 'tide', from: '05:00', to: '05:40' }, { why: 'light', from: '05:40', to: '07:33' }, { why: 'tide', from: '09:30', to: '20:00' }] },
  { i: 1, name: 'Back', short: 'Back', leg: 'Cowes to Lymington', win: ['11:10', '13:20'],
    cuts: [{ why: 'tide', from: '05:00', to: '11:10' }, { why: 'wind', from: '13:20', to: '16:10' }, { why: 'tide', from: '16:10', to: '20:00' }, { why: 'light', from: '16:16', to: '20:00' }] },
];

// Coastline, Swanage to Selsey Bill, simplified by hand from the Ordnance Survey outline (illustration, not a chart).
export const coast = {
  mainland: [
    [-2.05, 50.585], [-2.03, 50.578], [-1.98, 50.588], [-1.957, 50.592], [-1.945, 50.598], [-1.94, 50.608], [-1.955, 50.613],
    [-1.935, 50.625], [-1.925, 50.641], [-1.945, 50.652], [-1.948, 50.676], [-1.975, 50.688], [-2.03, 50.698], [-2.01, 50.716],
    [-1.965, 50.712], [-1.944, 50.684], [-1.9, 50.703], [-1.85, 50.715], [-1.8, 50.72], [-1.75, 50.709], [-1.74, 50.72],
    [-1.7, 50.734], [-1.65, 50.736], [-1.59, 50.722], [-1.565, 50.714], [-1.551, 50.705], [-1.556, 50.718], [-1.53, 50.742],
    [-1.46, 50.758], [-1.405, 50.782], [-1.36, 50.786], [-1.31, 50.816], [-1.34, 50.85], [-1.39, 50.888], [-1.42, 50.905],
    [-1.37, 50.885], [-1.31, 50.856], [-1.3, 50.848], [-1.24, 50.82], [-1.2, 50.8], [-1.12, 50.786], [-1.112, 50.8],
    [-1.12, 50.835], [-1.08, 50.84], [-1.093, 50.8], [-1.08, 50.778], [-1.03, 50.784], [-0.98, 50.78], [-0.935, 50.776],
    [-0.93, 50.792], [-0.88, 50.822], [-0.905, 50.795], [-0.89, 50.775], [-0.84, 50.758], [-0.79, 50.72], [-0.76, 50.73], [-0.72, 50.752],
  ],
  wight: [
    [-1.59, 50.662], [-1.545, 50.68], [-1.53, 50.707], [-1.5, 50.708], [-1.433, 50.725], [-1.405, 50.728], [-1.36, 50.743],
    [-1.32, 50.757], [-1.3, 50.767], [-1.27, 50.758], [-1.23, 50.745], [-1.16, 50.733], [-1.11, 50.72], [-1.08, 50.69],
    [-1.07, 50.68], [-1.1, 50.665], [-1.15, 50.65], [-1.175, 50.63], [-1.21, 50.595], [-1.3, 50.576], [-1.33, 50.59],
    [-1.4, 50.63], [-1.47, 50.655], [-1.51, 50.667], [-1.56, 50.665],
  ],
};

// Coverage (sample): 14 tidal height stations, 8 tidal stream points, between Anvil Point and Selsey Bill.
export const coverage = {
  west: -1.957, east: -0.79,
  heights: [
    { name: 'Poole Town Quay', lon: -1.988, lat: 50.711 }, { name: 'Poole Harbour Entrance', lon: -1.948, lat: 50.679 },
    { name: 'Christchurch Entrance', lon: -1.745, lat: 50.719 }, { name: 'Hurst Point', lon: -1.551, lat: 50.706 },
    { name: 'Lymington', lon: -1.53, lat: 50.742 }, { name: 'Yarmouth', lon: -1.5, lat: 50.708 },
    { name: 'Bucklers Hard', lon: -1.42, lat: 50.8 }, { name: 'Cowes', lon: -1.298, lat: 50.765 },
    { name: 'Southampton', lon: -1.4, lat: 50.893 }, { name: 'Warsash', lon: -1.3, lat: 50.848 },
    { name: 'Portsmouth', lon: -1.108, lat: 50.8 }, { name: 'Ryde', lon: -1.16, lat: 50.733 },
    { name: 'Bembridge Harbour', lon: -1.095, lat: 50.697 }, { name: 'Chichester Harbour Entrance', lon: -0.935, lat: 50.776 },
  ],
  streams: [
    { name: 'Poole Harbour Entrance', lon: -1.925, lat: 50.668 }, { name: 'Christchurch Ledge', lon: -1.7, lat: 50.7 },
    { name: 'Needles Channel', lon: -1.61, lat: 50.67 }, { name: 'Hurst Narrows', lon: -1.535, lat: 50.7 },
    { name: 'West Solent off Hamstead', lon: -1.44, lat: 50.737 }, { name: 'Central Solent off Cowes', lon: -1.3, lat: 50.783 },
    { name: 'Spithead', lon: -1.1, lat: 50.76 }, { name: 'Chichester Bar', lon: -0.94, lat: 50.762 },
  ],
  labels: [
    { name: 'Poole', lon: -1.985, lat: 50.722, anchor: 'start' },
    { name: 'Lymington', lon: -1.53, lat: 50.762, anchor: 'end' },
    { name: 'Cowes', lon: -1.3, lat: 50.755, anchor: 'below' },
    { name: 'Portsmouth', lon: -1.1, lat: 50.83, anchor: 'start' },
    { name: 'Chichester Harbour', lon: -0.93, lat: 50.835, anchor: 'end', minor: true },
    { name: 'Isle of Wight', lon: -1.3, lat: 50.66, minor: true },
    { name: 'The Solent', lon: -1.42, lat: 50.752, water: true },
    { name: 'English Channel', lon: -1.5, lat: 50.6, water: true },
    { name: 'Not covered', lon: -2.0, lat: 50.6, minor: true, anchor: 'off-west' },
    { name: 'Not covered', lon: -0.76, lat: 50.66, minor: true, anchor: 'off-east' },
  ],
};

// Route out (sample): leg distances add up to the passage; times at about 6.4 kn over the ground with the stream.
export const legs = [
  { t: '08:30', name: 'Lymington Town Quay', nm: null },
  { t: '08:48', name: 'Jack in the Basket', nm: 1.5 },
  { t: '09:17', name: 'Hamstead Ledge', nm: 3.1 },
  { t: '09:59', name: 'Gurnard', nm: 4.6 },
  { t: '10:10', name: 'Cowes', nm: 1.3 },
];
export const route = {
  mainland: [[-1.6, 50.724], [-1.565, 50.714], [-1.551, 50.705], [-1.556, 50.718], [-1.54, 50.733], [-1.533, 50.74],
    [-1.538, 50.756], [-1.528, 50.757], [-1.522, 50.743], [-1.5, 50.746], [-1.46, 50.758], [-1.405, 50.782], [-1.36, 50.786], [-1.33, 50.8], [-1.31, 50.818], [-1.25, 50.83]],
  wight: [[-1.25, 50.765], [-1.27, 50.758], [-1.29, 50.765], [-1.3, 50.768], [-1.32, 50.757], [-1.36, 50.743], [-1.405, 50.728],
    [-1.433, 50.725], [-1.47, 50.712], [-1.5, 50.708], [-1.53, 50.707], [-1.545, 50.68], [-1.6, 50.67]],
  track: [[-1.532, 50.754], [-1.526, 50.744], [-1.52, 50.738], [-1.44, 50.734], [-1.33, 50.763], [-1.3, 50.772]],
  waypoints: [
    { lon: -1.532, lat: 50.754 }, { lon: -1.52, lat: 50.738 }, { lon: -1.44, lat: 50.734 }, { lon: -1.33, lat: 50.763 }, { lon: -1.3, lat: 50.772 },
  ],
  labels: [
    { name: 'Lymington', lon: -1.532, lat: 50.757, anchor: 'above' },
    { name: 'Hamstead Ledge', lon: -1.44, lat: 50.7265, anchor: 'below', minor: true },
    { name: 'Cowes', lon: -1.3, lat: 50.779, anchor: 'above' },
    { name: 'Yarmouth', lon: -1.5, lat: 50.711, anchor: 'above', minor: true, wide: true },
    { name: 'The Solent', lon: -1.43, lat: 50.762, water: true },
    { name: 'Isle of Wight', lon: -1.36, lat: 50.705, minor: true },
  ],
};

// The forecast change acted out in the warnings scene (sample). The Friday 18:00 forecast had the westerly over Wren's
// against-tide limit from 15:25, so the back window closed at 13:45 (15:25 minus the 1 h 40 min passage). The 21:00
// forecast brings it on at 15:00, so the window closes at 13:20, 25 minutes earlier. The alert goes out at 21:05.
export const forecast = {
  before: { issued: '18:00', closes: '13:45', against: '15:25' },
  after: { issued: '21:00', closes: '13:20', against: '15:00' },
  savedAt: '18:10', alertAt: '21:05',
};

// The route scene: the boat at each mark, the clock and the distance sailed so far (legs above, added up).
export const marks = [
  { state: 'leave', label: 'Leave Lymington', t: '08:30', wp: 0 },
  { state: 'jack', label: 'Jack in the Basket', t: '08:48', wp: 1 },
  { state: 'hamstead', label: 'Hamstead Ledge', t: '09:17', wp: 2 },
  { state: 'gurnard', label: 'Gurnard', t: '09:59', wp: 3 },
  { state: 'cowes', label: 'Arrive Cowes', t: '10:10', wp: 4 },
];
