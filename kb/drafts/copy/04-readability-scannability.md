# Readability and scannability

## Principles
1. **People scan first and read second, if at all.** 79% scanned in NN/g's 1997 study; users read about 20% (at most 28%) of the words on an average page (NN/g 2008).
2. **Each added word costs attention.** Only about 18% of added text gets read (NN/g 2008). Cutting is the highest-return edit.
3. **Plain language is for everyone.** Experts prefer it too and read it faster (NN/g 2017). In a legal-language study 80% preferred clear English (GOV.UK).
4. **The first two words decide.** Scanners see about 2 words of each heading, link or list item (NN/g).

## Fundamentals (gate)
- **Front-load** every heading, link, list item, button and notification with the information-carrying words.
- **Sentences:** split any over 25 words (GOV.UK); aim for 15 to 20 on average (NN/g 2017). **Paragraphs:** one idea, at most 5 sentences, usually 1 to 3 on the web.
- **Plain words:** buy not purchase, help not assist, about not approximately, use not utilize (GOV.UK). Explain a specialist term the first time it appears.
- **Active voice** by default. Passive only when the actor is unknown or irrelevant ("Your card was declined" may be kinder than naming the bank).
- **Headings say something.** Statement or question, not a label: "How refunds work" beats "Refunds"; "Refunds take 5 to 10 days" beats both when that is the answer.
- **Numerals** for numbers, including 2 to 9 (GOV.UK). Write out a number that starts a sentence, or rewrite.
- **No all caps** for more than a short label; no italics for long text; underline only links (common style guide consensus; GOV.UK and Microsoft).

## Decision rules

### Target reading grade
| Audience | Target (Flesch-Kincaid grade) | Source |
|---|---|---|
| Consumer marketing, landing pages | 5 to 7 | Unbounce 2024: 11.1% conversion at grade 5 to 7 vs 7.1% at 8 to 9 vs 5.3% professional (correlation) |
| General public, public services | 6 to 8 or lower; GOV.UK targets plain English for all | NN/g 2017; GOV.UK |
| Specialists (developers, clinicians, finance) | 10 to 12 ceiling, plain structure still required | NN/g 2017 |
| Legal, terms | Same plain rules; add a plain summary at top | WCAG 3.1.5 (AAA): provide a simpler version above lower secondary level |
Readability scores are a smoke alarm, not a goal: a grade 4 page full of vague words still fails. Fix the hardest words first: difficult words were the factor most linked to lower conversion in Unbounce's data.

### Page shape
- **Inverted pyramid:** conclusion first, then supporting detail, then background.
- **Headings every 2 to 4 short paragraphs** on long pages (opinion), written so the headings alone tell the story.
- **Lists** for 3 or more parallel items or steps. Numbered only when order matters. Each item starts the same way (all verbs, or all nouns).
- **Tables** when comparing 2 or more things on 2 or more attributes.
- **Bold** for the 1 to 2 phrases a scanner must not miss per section, never whole sentences.
- **Summaries** at the top of anything over about 500 words.
- **Measure:** 45 to 75 characters, 66 ideal (shared foundation contract). Copy that needs a wider measure needs restructuring, not a wider column.

### Length by context
- Page reading data: half of a page's text is read only when the page has 111 words or fewer (NN/g 2008). So: put the must-read sentence in the first 111 words.
- A longer page is fine when the reader is deciding something expensive and scrolling by choice. Length is not the enemy; unscannable length is.

### FAQ and help
- Question in the user's words, as they would type it into search (GOV.UK: use the words users search for).
- Answer starts with the answer: "Yes. You can cancel anytime from Settings, Billing." then detail.
- Group by task, not by department.

### Abbreviations and terms
- Spell out on first use unless the abbreviation is better known than the full form (PDF, URL).
- No Latin abbreviations in UI for broad audiences (e.g., i.e., etc.): "for example", "that is" (GOV.UK style; opinion for brands).

## Do and don't
| Don't | Do |
|---|---|
| "In order to facilitate the processing of your refund request, please ensure that..." | "To get your refund, send us..." |
| Heading "Overview" | "What this plan includes" |
| "Click here to read our pricing information" | "See pricing" |
| A 9 line paragraph | 3 short paragraphs or a list |
| "Approximately five to seven business days" | "5 to 7 working days" |

## Worked example: pricing FAQ rewrite
Before: "Can I change plans? Our flexible pricing structure is designed to accommodate the evolving needs of your organization. Should you wish to upgrade or downgrade your subscription, this can be facilitated through the account management interface, with changes typically taking effect at the commencement of the next billing cycle." (52 words, about grade 16)
After: "Can I change plans? Yes, anytime. Go to Settings, then Billing. Upgrades start right away. Downgrades start on your next billing date." (23 words, about grade 4 to 5.) The answer is in the first word.

## Hand-offs
- design-typography: measure, line height, size; the shared contract sets 1.5 body line-height and 66 character ideal.
- design-search: headings and titles that match search language serve both readers and search engines.
- design-layout: whitespace and grouping make scannability visible.
