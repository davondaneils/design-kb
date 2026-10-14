// Critic scratch: operate every control by mouse, Enter, Space and touch tap; record before/after.
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const url = toUrl('/home/user/design-kb/kb/tests/fresh/landing/halyard.html');
const b = await launch();
const read = () => {
  const q = (s) => document.querySelector(s);
  const plus = q('#plus');
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none'; };
  return {
    billing: plus.dataset.billing,
    pressedM: q('[data-billing-set="month"]').getAttribute('aria-pressed'),
    pressedY: q('[data-billing-set="year"]').getAttribute('aria-pressed'),
    price: [...plus.querySelectorAll('.price .slot > *')].filter(vis).map(e=>e.innerText).join('|'),
    sub: [...plus.querySelectorAll('.price-sub .slot > *')].filter(vis).map(e=>e.innerText).join('|'),
    cta: q('[data-plus-cta]').innerText, href: q('[data-plus-cta]').getAttribute('href'), terms: q('[data-plus-terms]').innerText,
    faqOpen: [...document.querySelectorAll('.faq details')].map(d=>d.open?1:0).join(''),
    menu: q('[data-menu]').getAttribute('aria-expanded'), navShown: getComputedStyle(q('#site-nav')).display!=='none' && q('#site-nav').getBoundingClientRect().height>0,
    pause: q('[data-scene-pause]').getAttribute('aria-pressed'), pauseText: q('[data-scene-pause]').innerText, paused: q('#hero-scene').hasAttribute('data-scene-paused'), sceneState: q('#hero-scene').dataset.state,
    active: document.activeElement && (document.activeElement.innerText||document.activeElement.tagName).slice(0,40),
    focusOutline: document.activeElement ? getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth + ' ' + getComputedStyle(document.activeElement).outlineOffset + ' ' + getComputedStyle(document.activeElement).outlineColor : '',
  };
};
const controls = [
  ['pause', '[data-scene-pause]'], ['yearly', '[data-billing-set="year"]'], ['monthly-from-yearly', '[data-billing-set="month"]', '[data-billing-set="year"]'],
  ['monthly-when-monthly', '[data-billing-set="month"]'],
  ['faq1','.faq details:nth-child(1) summary'],['faq3','.faq details:nth-child(3) summary'],['faq5','.faq details:nth-child(5) summary'],
  ['faq1-close','.faq details:nth-child(1) summary','.faq details:nth-child(1) summary'],
  ['menu','[data-menu]'],
];
const rows = [];
for (const [w, mobile] of [[1440,false],[390,true]]) for (const [name, sel, pre] of controls) {
  if (name==='menu' && w===1440) continue;
  for (const how of ['mouse','Enter','Space', ...(mobile?['tap']:[])]) {
    const ctx = await b.newContext({ viewport:{width:w,height:w<600?844:900}, hasTouch: mobile, isMobile: mobile });
    const p = await ctx.newPage(); await p.goto(url); await p.waitForTimeout(200);
    if (pre) { await p.locator(pre).scrollIntoViewIfNeeded(); await p.click(pre); await p.waitForTimeout(400); }
    const before = await p.evaluate(read);
    const loc = p.locator(sel); await loc.scrollIntoViewIfNeeded();
    if (how==='mouse') await loc.click(); else if (how==='tap') await loc.tap(); else { await loc.focus(); await p.keyboard.press(how); }
    await p.waitForTimeout(450);
    const after = await p.evaluate(read);
    const diff = Object.fromEntries(Object.keys(after).filter(k=>after[k]!==before[k] && !['active','focusOutline','sceneState'].includes(k)).map(k=>[k,[before[k],after[k]]]));
    rows.push({w,name,how,diff, focus: how==='Enter'||how==='Space' ? after.focusOutline : ''});
    await ctx.close();
  }
}
// Menu: Escape closes and returns focus; clicking a nav link closes; Tab order from top
{
  const ctx = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const p = await ctx.newPage(); await p.goto(url);
  await p.locator('[data-menu]').tap(); await p.waitForTimeout(400);
  const navItems = await p.evaluate(()=>[...document.querySelectorAll('#site-nav a')].map(a=>{const r=a.getBoundingClientRect();return a.innerText+':'+Math.round(r.width)+'x'+Math.round(r.height)}));
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  const esc = await p.evaluate(()=>({menu:document.querySelector('[data-menu]').getAttribute('aria-expanded'), focusOnBtn: document.activeElement.matches('[data-menu]')}));
  await p.locator('[data-menu]').tap(); await p.waitForTimeout(400);
  await p.locator('#site-nav a', {hasText:'Pricing'}).tap().catch(e=>{});
  await p.waitForTimeout(400);
  const afterLink = await p.evaluate(()=>({url: location.href.slice(-30), hasMenu: !!document.querySelector('[data-menu]')}));
  rows.push({w:390,name:'menu extras',navItems,esc,afterLink});
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport:{width:1440,height:900} });
  const p = await ctx.newPage(); await p.goto(url);
  const order=[];
  for (let i=0;i<34;i++){ await p.keyboard.press('Tab'); order.push(await p.evaluate(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();const cs=getComputedStyle(a);return (a.innerText||a.getAttribute('aria-label')||a.tagName).trim().slice(0,28)+` [${cs.outlineStyle} ${cs.outlineWidth} off ${cs.outlineOffset}] y${Math.round(r.top+scrollY)} vis${r.top>=0&&r.bottom<=innerHeight?1:0}`})); }
  rows.push({w:1440,name:'tab order',order});
  await ctx.close();
}
console.log(JSON.stringify(rows,null,1));
await b.close();
