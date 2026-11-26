// Figma shadow clip audit. Paste into a use_figma call (Plugin API, plain JavaScript with top-level await and return).
// Finds every layer whose drop shadow is cut off by an ancestor frame with "Clip content" on, and, with FIX = true,
// turns clipping off on the ancestors where that changes nothing except the shadow.
//
// Why it exists: figma.createFrame() and figma.createAutoLayout() make frames with clipsContent = true. A plain wrapper
// that is exactly as wide as the cards inside it then cuts their shadows on every side that touches its edge
// (VGC Home section 4, Nov. 26, 2026: the step cards' shadows were cut left, right and top by the frame that stacks them).
//
// Set these three before running:
const PAGE_ID = '2:7';                    // the page to check
const ROOT_IDS = ['2:25', '2:27', '2:29']; // device frames (their own edge is the screen edge, so it is reported apart, never unclipped); [] checks the whole page
const FIX = false;                        // true: unclip safe wrappers

const page = await figma.getNodeByIdAsync(PAGE_ID); await figma.setCurrentPageAsync(page);
// Reach per side: spread + half the blur, moved by the offset. Half the blur is where the shadow is still seen (same rule as tools/lint.mjs shadow-clip).
function reach(n) { const x = { l: 0, r: 0, t: 0, b: 0 }; for (const e of n.effects) if (e.type === 'DROP_SHADOW' && e.visible !== false) { const s = (e.spread || 0) + e.radius / 2; x.l = Math.max(x.l, s - e.offset.x); x.r = Math.max(x.r, s + e.offset.x); x.t = Math.max(x.t, s - e.offset.y); x.b = Math.max(x.b, s + e.offset.y); } return x; }
function audit(root) { const out = [];
  for (const n of root.findAll(n => 'effects' in n && n.visible && n.effects.some(e => e.type === 'DROP_SHADOW' && e.visible !== false))) {
    const bb = n.absoluteBoundingBox; if (!bb) continue; const x = reach(n);
    for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) { if (!p.clipsContent || !p.absoluteBoundingBox) continue; const a = p.absoluteBoundingBox;
      const cut = Math.round(Math.max(a.x - (bb.x - x.l), bb.x + bb.width + x.r - (a.x + a.width), a.y - (bb.y - x.t), bb.y + bb.height + x.b - (a.y + a.height), 0));
      if (cut >= 3) out.push({ node: n, by: p, cut }); } }
  return out; }
const roots = ROOT_IDS.length ? await Promise.all(ROOT_IDS.map(id => figma.getNodeByIdAsync(id))) : [page];
const isRoot = p => ROOT_IDS.includes(p.id);
const unclipped = [], kept = [];
if (FIX) for (const root of roots) for (const h of audit(root)) { const p = h.by; if (isRoot(p) || !p.clipsContent) continue; const a = p.absoluteBoundingBox;
  // Safe to unclip only when no layer's own box leaves the frame (so only shadows change) and the frame is not a rounded, filled shape that crops its content (a card, a photo).
  const over = p.findAll(c => c.visible && c.absoluteBoundingBox && (c.absoluteBoundingBox.x < a.x - 0.5 || c.absoluteBoundingBox.y < a.y - 0.5 || c.absoluteBoundingBox.x + c.absoluteBoundingBox.width > a.x + a.width + 0.5 || c.absoluteBoundingBox.y + c.absoluteBoundingBox.height > a.y + a.height + 0.5)).length;
  const shaped = (typeof p.cornerRadius !== 'number' || p.cornerRadius > 0) && Array.isArray(p.fills) && p.fills.some(f => f.visible !== false);
  if (!over && !shaped) { p.clipsContent = false; unclipped.push(p.id + ' ' + p.name.slice(0, 50)); } else kept.push(p.id + ' ' + p.name.slice(0, 50) + (shaped ? ' (rounded and filled: crops on purpose)' : ' (' + over + ' layers run past it)')); }
const left = []; for (const root of roots) for (const h of audit(root)) left.push(h.node.id + ' ' + h.node.name.slice(0, 36) + ': cut ' + h.cut + ' by ' + (isRoot(h.by) ? 'the device frame (screen edge)' : h.by.id + ' ' + h.by.name.slice(0, 36)));
return { unclipped, kept: [...new Set(kept)], stillCut: left };   // pass = stillCut holds only screen edges and crops you chose on purpose
