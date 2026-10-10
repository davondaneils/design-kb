# Research: 01 CTA hierarchy and placement

Researcher, 2026-10-10. Method: WebFetch text extraction (curl to these hosts is blocked by the egress policy; WebFetch returns page text through a summarizing model, so every quote below was requested verbatim and is re-checked by the critic's 20% re-fetch). Claim IDs are global across the six notes.

## Key findings
1. Attention is front-loaded: 57% of page-viewing time above the fold, 74% in the first two screenfuls (C16). The primary action belongs in the first screen; repeats lower down serve the minority who scroll, so they go where a decision is likely (after price, after proof). The second half is opinion built on C16.
2. Vague labels draw clicks and then mislead: "Get Started" sends people into flows they did not expect (C17). Labels name the next step.
3. A page can look finished at the fold and stop people scrolling (C18): a full-bleed band that ends exactly at the fold hides the offer below.
4. Exemplars pair a commit CTA with a lower-commitment one: Linear "Get started" with "Contact sales" on Business; Vercel "Start a free trial" vs "Start deploying" vs "Get a demo"; Stripe "Get started" with "Contact sales" (C45, C46, C47). Each secondary is a different path, not the same path styled down.
5. Apple puts the money in the CTA zone: "from only $108.25 per month", interest-free financing, returns stated near the buy area (C49).

6. **Measured exemplars (added 2026-10-10 from the exemplar library, branch `claude/exemplar-library-xfa3bl` at 40d89cf, `kb/teardowns/*.md` and `kb/exemplars/shots/`, measured with Playwright; not committed to this branch):**
   - Apple MacBook Air: price and the only button share one pill panel on the first screen: "From $1299 or $108.25/mo. for 12 mo." beside a "Buy" pill (73x45, `#0071e3`) (C51).
   - Stripe home: two side-by-side actions, filled "Get started" (141x48) and outlined "Sign up with Google" (a zero-field path next to the primary); the logo strip sits at the fold, "Proof comes before features". The nav also carries a filled "Contact sales" (137x40), so the first screen has two filled buttons (C52).
   - Vercel home: filled "Deploy now" plus white ringed "Talk to sales", both pills, 40px (C53).
   - Raycast home: one button, then a mono requirement line under it ("macOS Tahoe and Apple Silicon required", "Install via Homebrew"): "The requirement line answers the first objection before it is asked" (C54).
   - Linear home: one hero button, "Get started", 127x44 pill (C55).

## Numbers
- 57% / 74% viewing time (C16).
- Primary target 44x44 at 390 (FOUNDATIONS item 4); 48 to 56px tall used on the combined page.

## Conflicting views
- "Above the fold" is sometimes called a myth because people scroll. C16 says they do scroll, but attention still falls off; both are true. Do not cram; do put the primary in screen one.
- Sticky phone CTAs: no tier 1 to 3 source found in this pass. Treat any rule as opinion.

## Claim table
| ID | Claim | Quote | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| C16 | Attention concentrates above the fold and in two screens | "57% of their page-viewing time above the fold" ; "74% of the viewing time was spent in the first two screenfuls" | https://www.nngroup.com/articles/scrolling-and-attention/ | 2026-10-10 | 3 | consensus |
| C17 | Generic "Get Started" misleads | "A generic Get Started call-to-action attracts clicks, but also misleads users" (sentence continues) | https://www.nngroup.com/articles/get-started/ | 2026-10-10 | 3 | consensus |
| C18 | Illusion of completeness stops scrolling | "causes users to believe that they are seeing all there is" | https://www.nngroup.com/videos/illusion-completeness/ | 2026-10-10 | 3 | consensus |
| C45 | Linear pricing: per-user monthly price with "Billed yearly"; CTAs "Get started" and "Contact sales"; proof line | "$10 per user/month" ; "Billed yearly" ; "Trusted by more than 40,000 companies" | https://linear.app/pricing | 2026-10-10 | 2 (text only) | measured |
| C46 | Vercel pricing: trial CTA, "Popular" badge, usage as included plus rate, taxes excluded | "Start a free trial" ; "1M / month included" ; "Starting at $0.40 per 1M" | https://vercel.com/pricing | 2026-10-10 | 2 (text only) | measured |
| C47 | Stripe pricing: one price line, two CTAs, numeric proof | "2.9% + 30¢" ; "Contact sales" ; "99.999% average historical uptime" | https://stripe.com/pricing | 2026-10-10 | 2 (text only) | measured |
| C51 | Apple: price and Buy in one panel on the first screen | "Price is on the first screen." ; "then price and Buy in one pill-shaped panel" | origin/claude/exemplar-library-xfa3bl:kb/teardowns/apple-macbook-air.md (screenshot `kb/exemplars/shots/apple-macbook-air-1440-light.jpg`) | 2026-10-10 | 2 (measured) | measured |
| C52 | Stripe: two actions side by side incl. Google sign-up; proof at the fold; filled nav CTA | "Two primary actions ("Get started", "Sign up with Google") side by side." ; "Proof comes before features." | origin/claude/exemplar-library-xfa3bl:kb/teardowns/stripe-home.md | 2026-10-10 | 2 (measured) | measured |
| C53 | Vercel: product-led and sales actions | "Two actions: "Deploy now" (product-led) and "Talk to sales"." | origin/claude/exemplar-library-xfa3bl:kb/teardowns/vercel-home.md | 2026-10-10 | 2 (measured) | measured |
| C54 | Raycast: objection line under the one button | "The requirement line answers the first objection before it is asked." | origin/claude/exemplar-library-xfa3bl:kb/teardowns/raycast-home.md | 2026-10-10 | 2 (measured) | measured |
| C55 | Linear: one hero button | "Get started" 127x44 ... pill | origin/claude/exemplar-library-xfa3bl:kb/teardowns/linear-home.md | 2026-10-10 | 2 (measured) | measured |
| C49 | Apple buy page puts monthly price, financing and returns near purchase | "from only $108.25 per month" ; "you have the option to return it or exchange it." | https://www.apple.com/shop/buy-mac/macbook-air | 2026-10-10 | 2 (text only) | measured |
