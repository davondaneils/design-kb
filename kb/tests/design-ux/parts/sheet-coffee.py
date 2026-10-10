#!/usr/bin/env python3
"""One-off edit (kept for the record): extends kb/tests/design-ux/states.mjs, the coffee state sheet, with the purchase
flow controls (option cards, missing-answer group, stepper, close, remove and undo, phone menu toggle)."""
import pathlib
p = pathlib.Path(__file__).parent.parent / 'states.mjs'
s = p.read_text()
if 'id="g7"' in s:
    raise SystemExit('already extended')
s = s.replace("""    <div class="cell"><span>Added, 2 s, announced</span><button class="btn btn-secondary btn-sm add-btn" type="button" data-added><span class="idle">Add to cart</span><span class="done">${check}Added</span></button></div>\n""", "")
s = s.replace('<span class="idle">Add to cart</span>', '<span class="idle">Add to cart…</span>')
css_add = """
.opt.is-hover { background: color-mix(in oklch, var(--color-text) 4%, var(--color-surface)); }
.opt.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.sheet .opt { width: 220px; }
.sheet .opt-group { width: 460px; max-width: 100%; }
.stepper button.is-hover, .close.is-hover, .menu-toggle.is-hover { background: var(--state-hover); }
.stepper button.is-active, .close.is-active, .menu-toggle.is-active { background: var(--state-pressed); }
.link-btn.is-hover { color: var(--color-text); }
.sheet .menu-toggle { display: inline-flex; }
"""
anchor = ".reason { font-size: var(--text-xs); color: var(--color-text-muted); max-width: 20em; }\n"
assert anchor in s
s = s.replace(anchor, anchor + css_add, 1)

def radio(n, extra='', checked='', label='Pour-over', sub='Medium-fine'):
    return ('<label class="opt stack' + extra + '"><input type="radio" name="' + n + '" ' + checked + '><span><span class="name">'
            + label + '</span><span class="sub">' + sub + '</span></span></label>')
minus = '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9"/></svg>'
plus = '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9"/></svg>'
x = '<svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>'
def step(label, cls, n, mdis=False):
    return ('<div class="stepper" role="group" aria-label="Bags, ' + label + '"><button type="button" aria-label="One bag fewer"'
            + (' aria-disabled="true"' if mdis else '') + '>' + minus + '</button><output>' + n + '</output><button type="button" class="'
            + cls + '" aria-label="One bag more">' + plus + '</button></div>')
close = lambda cls, lbl: '<button class="close' + cls + '" type="button" aria-label="Close, ' + lbl + '">' + x + '</button>'

g = ''.join([
 '  <section class="group" aria-labelledby="g7"><h2 id="g7">Option (radio card)</h2><div class="row">\n',
 '    <div class="cell"><span>Rest</span>' + radio('s1') + '</div>\n',
 '    <div class="cell"><span>Hover</span>' + radio('s2', ' is-hover') + '</div>\n',
 '    <div class="cell"><span>Selected</span>' + radio('s3', '', 'checked') + '</div>\n',
 '    <div class="cell"><span>Focus (ring on the card)</span>' + radio('s4', ' is-focus', 'checked') + '</div>\n',
 '    <div class="cell"><span>Remembered</span><label class="opt stack"><input type="radio" name="s5" checked><span><span class="name">Pour-over</span><span class="sub">Medium-fine</span><span class="usual">Your usual</span></span></label></div>\n',
 '  </div></section>\n',
 '  <section class="group" aria-labelledby="g8"><h2 id="g8">Option group, missing answer (shown after submit only)</h2><div class="row">\n',
 '    <fieldset class="opt-group invalid" aria-describedby="sx-err"><legend>How do you brew?<span class="hint">We grind each bag for your brewer.</span></legend><p class="error" id="sx-err">${alertIcon}Choose how you brew, so we grind it right.</p><div class="opts cols-2">'
   + radio('s6') + radio('s6', '', '', 'Espresso', 'Fine') + '</div></fieldset>\n',
 '  </div></section>\n',
 '  <section class="group" aria-labelledby="g9"><h2 id="g9">Quantity stepper, close, remove and undo</h2><div class="row">\n',
 '    <div class="cell"><span>One bag (minus inactive)</span>' + step('one', '', '1', True) + '</div>\n',
 '    <div class="cell"><span>Plus hover</span>' + step('hover', 'is-hover', '2') + '</div>\n',
 '    <div class="cell"><span>Plus pressed</span>' + step('pressed', 'is-active', '2') + '</div>\n',
 '    <div class="cell"><span>Plus focus</span>' + step('focus', 'is-focus', '2') + '</div>\n',
 '    <div class="cell"><span>Close: rest, hover, pressed, focus</span><div class="row" style="gap:var(--space-3)">'
   + close('', 'rest') + close(' is-hover', 'hover') + close(' is-active', 'pressed') + close(' is-focus', 'focus') + '</div></div>\n',
 '    <div class="cell"><span>Remove: rest, hover, focus</span><div class="row" style="gap:var(--space-5)"><button class="link-btn" type="button">Remove</button><button class="link-btn is-hover" type="button">Remove</button><button class="link-btn is-focus" type="button">Remove</button></div></div>\n',
 '    <div class="cell" style="width:320px"><span>Removed row, undo in place</span><ul style="width:100%"><li class="line removed"><span>Removed Colombia Huila.</span><button class="link-btn" type="button">Undo</button></li></ul></div>\n',
 '  </div></section>\n',
 '  <section class="group" aria-labelledby="g10"><h2 id="g10">Phone menu toggle</h2><div class="row">\n',
 '    <div class="cell"><span>Rest</span><button class="menu-toggle" type="button" aria-expanded="false">Menu</button></div>\n',
 '    <div class="cell"><span>Hover</span><button class="menu-toggle is-hover" type="button" aria-expanded="false">Menu</button></div>\n',
 '    <div class="cell"><span>Open</span><button class="menu-toggle" type="button" aria-expanded="true">Menu</button></div>\n',
 '    <div class="cell"><span>Focus</span><button class="menu-toggle is-focus" type="button" aria-expanded="false">Menu</button></div>\n',
 '  </div></section>\n',
])
end = "</main>`,\n};"
i = s.index(end)
s = s[:i] + g + s[i:]
p.write_text(s)
print('extended coffee sheet')
