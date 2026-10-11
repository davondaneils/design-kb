# Font selection and pairing

Read this when choosing typefaces for a brand, product or publication, or judging a proposed pairing.

## Principles
1. **Roles before fonts.** Decide which jobs type must do: text (long reading), display (voice, large sizes), functional (UI labels, data, forms), code. Then find the fewest families that do those jobs well (Pimp my Type uses display, body, functional).
2. **One family is the default.** A well-made superfamily or a variable family with an optical size axis covers text, display and UI with guaranteed harmony (Google Fonts Knowledge). A second family must earn its place by doing a job the first cannot.
3. **Pair on structure, contrast on one axis.** Match x-height, proportions and stroke logic; differ on one clear property (serif vs sans, width, or weight). Two faces that differ a little in many ways read as a mistake, not a choice (Seltzer: Brandon Grotesque + Proxima Nova).
4. **Fit the voice, then prove the function.** "Font follows feeling" (Schoendorfer), but a font that fails the function checks below is out, however well it fits the mood.

## Fundamentals (non-negotiable)
Before any face is proposed, it must pass every check:
- **Coverage:** every language and character the product needs (diacritics for names, currency signs such as the euro and rupee, arrows, math signs you use). Test real strings, including the longest local names.
- **Styles:** regular, a true italic (not a slanted roman), and the weights you need. UI needs at least 400, 500 or 600, and 700.
- **Figures:** lining and tabular figures available (`tnum`), for any number that updates or sits in a column.
- **Legibility at the smallest size you ship:** render 12 and 14px on Windows and macOS. Check confusables `Il1 O0 5S rn/m`. A face that fails is out for UI and for codes or passwords.
- **Weight floor:** Apple HIG advises avoiding Ultralight, Thin and Light weights, especially at small sizes. Our threshold (opinion): none of them below 24px.
- **Scripts:** for non-Latin content, a face with native support for that script, not browser fallback (see reference 01, Non-Latin scripts).
- **License covers every use:** web, app, desktop, ePub, ads (see 03).
- **Performance:** total font payload budget agreed (see 03). At most two families plus an optional mono.

## Decision rules
- **If** it is product UI where speed and native feel matter **then** consider `system-ui` first (web.dev). It costs zero bytes and matches the OS. Choose a custom face only if brand recognition across platforms matters more.
- **If** the brand needs a distinct voice **then** put the personality in display only, and keep text and UI in a calm workhorse. Expressive faces fail past one line of reading (Pimp my Type).
- **If** reading is long-form **then** pick a text face designed for reading at 16 to 20px: open apertures, moderate contrast, generous x-height, sturdy serifs or none. Prefer one with an `opsz` axis or separate Text and Display cuts.
- **If** the display face is condensed **then** never use it for numbers people glance at; condensed text took about 11% longer to read in glance tests (NN/g, MIT AgeLab). Use a regular-width face with tabular figures for values.
- **If** you pair a serif and a sans **then** match x-height ratio (normalize with `font-size-adjust: ex-height from-font` declared on the parent or `:root`, never on the second face itself, where it measures that face and does nothing; reference 06) and match the era or construction: humanist with humanist, geometric with geometric or a modern serif, grotesque with a transitional or Scotch serif (Seltzer, historical method; the specific era pairings are common practice, opinion).
- **If** two candidate faces are from the same category and look similar **then** do not pair them; use one in two weights instead.
- **If** the client says "make it look premium" **then** reduce, do not add: one family, fewer weights, more space, larger size contrast, tighter display tracking (opinion, consistent across top studios).
- **If** distinctiveness matters **then** avoid the defaults: Roboto, Open Sans and Poppins are among the most used families on the web (Web Almanac 2024). Inter is very common in product UI too. Common is fine for UI; it is weak for brand voice.

## Starting points by brief (opinion; verify each against the checks above)
All of these are OFL (free, self-hostable) unless marked commercial.

| Brief | Text / UI | Display | Mono or data | Why |
|---|---|---|---|---|
| Product UI, neutral | Inter (opsz 14 to 32), or `system-ui` | Same family, Display optical size | Geist Mono, JetBrains Mono | One family; Inter has tnum, case, slashed zero |
| Developer tool | Geist | Geist | Geist Mono | Designed as a set; high x-height, short descenders (basement.studio) |
| Corporate or technical | IBM Plex Sans | IBM Plex Sans or Plex Serif | IBM Plex Mono | Superfamily across sans, serif, mono |
| Long-read editorial | Source Serif 4 (opsz) or Newsreader (opsz) | Same family at display opsz | n/a | Optical sizes give delicate headlines and sturdy text from one file |
| Warm brand, expressive | Inter or a humanist sans | Fraunces (opsz, SOFT, WONK axes) | n/a | Voice lives in display axes only |
| Sports and stats | Inter or a regular-width grotesque with tnum | Barlow Condensed (headlines only) | Tabular figures in text face | Condensed for energy in headlines, regular width for glanceable numbers |
| Premium brand, budget available | Commercial grotesques such as Söhne (Klim) or GT America (Grilli Type) | Same family, display or condensed width | Söhne Mono | Commercial; license per use |

Practitioner leads for current taste (opinion, not rules): Brett from Designjoy's category lists on X, TypeTogether's pairing series, Typewolf and Fonts In Use for real-world pairings. Use them to widen the candidate list, then run the checks.

## How to test a pairing in 10 minutes
1. Set a real headline, dek, two paragraphs, a caption, a table row with numbers, and a button in both faces at the actual sizes.
2. Compare x-heights side by side at body size; if one looks a size smaller, normalize or reject.
3. Squint: you should see one texture for text and one clear accent for display, not two competing textures.
4. View on a low-resolution Windows screen and a phone.
5. Ask: does each face have a distinct job? If you cannot say the job in four words, cut one.

## Do and don't
- Do: one variable family at 400, 600 and display opsz. Don't: three families at four weights each.
- Do: serif display + sans text with matched x-heights. Don't: two geometric sans faces that differ only in the "a".
- Do: Light 300 at 48px and up. Don't: Light 300 for 14px secondary text.
- Do: `system-ui` for an internal admin tool. Don't: load a 200KB brand face nobody will notice in a table.

## Worked examples
1. **Hockey pool stats app (web and mobile).** Roles: UI, numbers, display. Choice: Inter for all UI and numbers (`font-variant-numeric: tabular-nums lining-nums` on every stat, score and clock), Barlow Condensed 700 uppercase only for team-page headlines and score banners over 31px, never for stat values. Why: condensed carries sports energy at display size; regular width reads faster at a glance (NN/g).
2. **Law firm long-read insights.** Roles: text and display. Choice: Source Serif 4 alone, text opsz for body at 20px, display opsz for headlines, Source Sans 3 only for UI chrome (nav, metadata). Superfamily harmony, credibility without stiffness.
3. **Fintech dashboard.** `system-ui` is tempting, but it resolves to a different font per OS (SF on Apple, Segoe UI on Windows, Roboto on Android), so widths and figure shapes differ and column layouts tuned on one platform shift on another (opinion based on that mechanism; test it). Choice: Inter with tnum for all data, which gives identical metrics everywhere. Trade-off accepted: one font download.

## Hand-offs
- Brand voice and positioning that should drive the font mood: use the website-strategy skill.
- Font color and contrast: design-color. Data tables: design-product-ui. Loading and licenses: reference 03 and design-frontend.
