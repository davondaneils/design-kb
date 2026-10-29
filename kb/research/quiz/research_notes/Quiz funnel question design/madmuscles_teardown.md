# MadMuscles quiz funnel teardown (default-uni-soft)

Accessed 2026-10-29. Start URL: https://madmuscles.com/en/funnel/default-uni-soft/step-one

Client context: the client says this funnel is "doing crazy numbers right now". That is their claim, not verified here. Being studied for a faith-based men's personality quiz (four strength types, $27 30-day program, brand bans fake timers and fake scarcity).

## How this was captured, and where it stopped

- Tool: Playwright Chromium, phone context 390x844, isMobile, hasTouch, iPhone iOS 17.5 Safari user agent, en-US. Scripts in `/tmp/claude-0/-home-user-design-kb/948f11a1-c1f6-5dc2-a3ff-2427afb43271/scratchpad/madmuscles/` (`driver.js`, `render.py`, `extract.py`).
- Persona: man, 30-39, average build, goal "Gain Muscle Mass", target "Athlete".
- **Live walk, observed with screenshots:** the landing age screen plus quiz screens 1/35 to 11/35 (height).
- **Where it stopped:** step 11/35 "What is your height?". The site did not block automation. The page needs a health-data consent before it goes on. The consent checkbox is unticked by default. Pressing Continue without it opens a bottom sheet: "Consent required to continue. I agree to the processing of my personal health data (such as weight, BMI, and dietary preferences) to receive personalized plans and improve my user experience." with one button, "I agree". My session's permission system would not let me give that legal consent for the user, so I did not tick it or press "I agree". I also did not skip the gate by typing later step URLs.
- **Steps 12 to 35:** taken from the funnel's own config. The quiz page's server HTML ships the full step map for `default-uni-soft` as JSON (35 steps, every component, answer, condition and translation key). It is config name `default-uni-soft`, last modified 2026-06-23, status active. I resolved the copy from the translation dictionary on the same page. These steps are **recorded from config, not seen rendered**. Layout, animation and timing for them are not observed. The rendered dump is saved at `.../scratchpad/madmuscles/steps_rendered_from_config.txt`.
- **Result, offer and paywall:** not reached. The route is `/:locale/final/:finalId/:userId` (found in the JS route table). It needs a user ID, which only exists after the email is submitted. The paywall notes below come from strings in the same translation dictionary. That dictionary is shared across MadMuscles funnels, so treat these as "strings in the shipped bundle" and not as "what this funnel shows".
- To finish the walk, Davon (or someone he authorises) needs to tick the consent himself, or tell me in so many words that I may tick it for this test persona.

Screenshots (all 390x844 at 3x): `/tmp/claude-0/-home-user-design-kb/948f11a1-c1f6-5dc2-a3ff-2427afb43271/scratchpad/madmuscles/shots/`

## Global UI patterns (observed)

- Dark theme: near-black background, orange (#FF4500-ish) accent and CTA, white geometric bold headline (Jost-like), Inter-like body. Logo centred, "Help" link and hamburger menu top right, round back button top left from step 1.
- Progress: a thin orange bar with a numeric counter "N/35" on the right. The counter counts interstitials too (the nutrition interstitial took slot 7). On interstitials and on the name, birth date and email screens, config sets `hideProgressBarTrack: true`, so the bar is hidden there. The total "35" includes conditional steps (event date, equipment) and the loading step, so a real path can skip numbers.
- Single-choice answers auto-advance (`submitOnChange`). Measured in page: tap on "7-10 glasses" to the next screen being rendered took 45 to 72 ms, so there is no confirm delay at all.
- Multi-select, slider, number inputs and interstitials use a full-width orange pill CTA pinned to the bottom ("Continue" or "Got it").
- Answer cards: dark grey rounded rectangles, about 64 to 128 px tall. Image questions put an illustrated male body on the right of each card.
- Every header animates in (`hasAnimation: true`).
- The water and frequency steps have "you vs other users" feedback blocks in config. On auto-advance steps they never showed. I tapped and timed it, and the next screen replaced the page in under 0.1 s. That suggests a leftover from another variant (observation).

## Step by step

Legend: AA = auto-advances on tap. CTA = needs a button. Source L = seen live, C = from config only.

| # | Counter | Type | Headline / subtext | Options | Advance | Images | Src |
|---|---|---|---|---|---|---|---|
| 0 | none | Image question (landing) | "BUILD YOUR PERFECT BODY" / "Complete this quiz and choose your paid subscription plan". Label "SELECT YOUR AGE". Footer: "By continuing, you agree to our Terms of service, Privacy policy, Cookie policy (including the use of tracking technologies, e.g. Meta Pixel) and acknowledge our Subscription terms (incl. pricing offers)". "This site does not provide medical advice..." | 18-29, 30-39, 40-49, 50+ | AA | Photo of a man in a tactical vest and a tattooed woman in sportswear (unisex funnel) | L |
| 1 | 1/35 | Image question | "Choose your gender" | Male, Female (Female branches to a women's funnel) | AA | Illustrated body per option | L |
| 2 | 2/35 | Image question | "Choose your body type" | Slim, Average, Big, Heavy | AA | Illustrated male body at four fat levels | L |
| 3 | 3/35 | Image question | "Choose your goal" | Lose Weight, Gain Muscle Mass, Get Shredded | AA | Shirtless illustrated physiques | L |
| 4 | 4/35 | Image question (branched by goal) | "Choose the body you want" | Muscle: Athlete, Hero, Bodybuilder. Weight loss: Slim body, Slim, shredded body. Shredded: Beach body, Workout body, Cross-fit body | AA | Physique per option | L |
| 5 | 5/35 | Slider | "Choose your level of body fat" | 8 stops: 5-9%, 10-14%, 15-19%, 20-24% (default), 25-29%, 30-34%, 35-39%, >40%. End labels "5-9%" and ">40%", value bubble above the thumb | CTA "Continue" | Large illustrated torso that changes with the slider, blue gradient backdrop | L |
| 6 | 6/35 | Multi-select with body map | "Select problem areas" | Chest, Arms, Belly, Legs, Full body (Full body selects all). Zones light up on the figure | CTA "Continue" | Muscled figure (thor3.png) with tap zones | L |
| 7 | 7/35 (bar hidden) | Interstitial (education) | "Nutrition plays a major role in your results" / "To make the most gains in muscle mass and strength, you need:" ✓ "Enough total calories each day." ✓ "Adequate protein to actually rebuild more muscle tissue." | none | CTA "Got it" | Lottie before/after body morph in a rounded card | L |
| 8 | 8/35 | Question | "Do you follow any of these diets?" | Vegetarian (Excludes meat), Vegan (Excludes all animal products), Keto (Low-carb, high-fat), Mediterranean (Rich in plant-based foods), No, I haven't | AA | none | L |
| 9 | 9/35 | Question | "How often do you have sugary foods or drinks?" | Not often. I'm not big on sweets / 3-5 times a week / Pretty much every day | AA | none | L |
| 10 | 10/35 | Question | "How much water do you drink daily?" | Less than 2 glasses (up to 0,5 l / 17 oz), 2-6 glasses (0,5-1,5 l / 17-50 oz), 7-10 glasses (1,5-2,5 l / 50-85 oz), More than 10 glasses (more than 2,5 l / 85 oz), I drink only coffee or tea. Config feedback, not displayed: "You drink more water than 23% / 73% / 92% of users*", "*users of MadMuscles who took the quiz in 2025" | AA | none | L |
| 11 | 11/35 | Number input + consent | "What is your height?" Units toggle "ft, in" / "cm". Field "Height (ft, in)", mask "_ ft __ in". Checkbox "I consent to MadMuscles processing my health onboarding data to provide services and enhance my user experience. Privacy Policy." "To withdraw consent, contact us anytime." Without the tick, Continue opens the "Consent required to continue" sheet with "I agree" | numeric keypad | CTA | none | L (**walk stopped here**) |
| 12 | 12/35 | Number input | "What's your current weight?" kg / lb toggle | number | CTA | none | C |
| 13 | 13/35 | Number input + feedback | "What's your target weight?" Feedback: "Calculating your body mass index. BMI is widely used as a risk indicator..." or, if target equals current, "Great! We're glad to see you're already at your ideal weight..." | number | CTA | none | C |
| 14 | 14/35 | Question | "Do you have an important event coming up?" / "Having something to look forward to can be a great motivator for reaching your goal" | Vacation, Holiday, Birthday, Family occasion, Wedding, Competition, Extreme sports, Other, No special events | AA. "No special events" skips step 15 | none | C |
| 15 | 15/35 (conditional) | Date input | "When is your event?" / "We will keep this important event in mind for your journey". Trust line: "We will keep your data safe and not use it for advertising." | date | "Skip" + "Continue" inline | none | C |
| 16 | 16/35 | Question with captions | "What's your level of fitness?" | Beginner ("Whenever I sit on the floor, it's hard for me to stand up."), Amateur ("I try to exercise once a week, but still not regular."), Advanced ("I'm on fire! I'm in the best shape of my life.") | AA | none | C |
| 17 | 17/35 | Image swipe-card | "Like it or dislike it" | One card at a time: Cardio, Yoga / Stretching, Lifting weights, Pull-ups. Each takes Like / Neutral / Dislike (thumb icons) | AA per card | Photo per activity (312x272) | C |
| 18 | 18/35 | Multi-select | "What sports are you interested in?" | Gym Workouts, Workouts at home, Boxing, Other martial arts, Jogging, None of the above | CTA | none | C |
| 19 | 19/35 | Multi-select + empathy feedback | "Have you experienced any of these issues in your previous fitness attempts?" Feedback after selecting: "Thanks for sharing! We have learned that a lot of people have faced the same setbacks. MadMuscles has a clear workout plan that is easy to follow..." | Lack of motivation, Didn't have a clear plan, My workouts were too hard, Bad coaching, High cholesterol, No, I haven't | CTA "Continue", then "Got it" | none | C |
| 20 | 20/35 (bar hidden) | Interstitial (milestone + reframe) | Pre-title "Halfway there!" with radial progress animation. "Why do people give up on exercise?" / "The #1 reason is starting too big too quickly. You'll achieve much more than just a few weeks of exercising. Real change takes time. Our program focuses on building habits that stick." | none | CTA "Got it" | Lottie radial chart | C |
| 21 | 21/35 | Multi-select | "Tick your additional goals below:" | Improve sleep, Form a physical habit, Feel healthier, Reduce Stress, Increase energy, Boost metabolism, None of the above | CTA | none | C |
| 22 | 22/35 (bar hidden) | Interstitial (care / disclaimer) | "We care about your health" / "If you have any of the following conditions: Heart disease, Severe scoliosis, Spinal damage, Benign or malignant tumor, Hypertension. Please contact your physician before starting to follow the MadMuscles program." Image caption "Can you touch your toes?" | none | CTA "Got it" | health-status image | C |
| 23 | 23/35 | Question | "How many push-ups can you do in one round?" | Less than 10, 10 to 20, 21 to 30, More than 30 | AA | none | C |
| 24 | 24/35 | Question | "How many pull-ups can you do in one round?" | I can't do a single pull-up, Less than 5, 5 to 10, More than 10 | AA | none | C |
| 25 | 25/35 | Question | "Choose your workout location" | Home, Gym, Mixed (Home or Mixed go to step 26) | AA | none | C |
| 26 | 26/35 (conditional) | Question | "Which type of equipment do you have access to?" | No equipment, Basic equipment (Resistance band, dumbbells), Full equipment (... parallel and horizontal bars) | AA | none | C |
| 27 | 27/35 | Question + social comparison | "How many times per week have you trained in the last 3 months?" | Not at all ("I haven't trained, but I will after claiming my workout program!"), 1-2 times a week, 3 times a week, More than 3 times a week. Feedback per answer: "54% of users* responded in the same way..." / "You've worked out more than 54% / 76% / 88% of users*" + "*users of MadMuscles who took the quiz in 2025" | CTA "Continue", then "Got it" | none | C |
| 28 | 28/35 | Question | "How long do you want your workouts to be?" | 10-15, 20-30, 30-40, 40-60 minutes, Let MadMuscles decide | AA | none | C |
| 29 | 29/35 | Question | "How much time are you ready to spend per meal prep?" | Less than 30 min, 30-60 min, More than 1 hour, I prefer to order meals or go out to eat | AA | none | C |
| 30 | 30/35 | Long multi-select chips | "Choose the products you like" + toggle "Let MadMuscles choose" | Groups: Veggies (10), Grain (9), Ingredients (11), Meat & Fish (6, Optional), Fruit & Berries (11, Optional) | Sticky CTA | none | C |
| 31 | 31/35 | Question | "In addition to your goal, what challenge would you like to join?" | Walk it! (10,000 steps for 7 days), Burpee Monster (25 burpees for 10 days), 21 days no sugar, I'll take on all the challenges!, None of the above | CTA | none | C |
| 32 | 32/35 (bar hidden) | Data capture | Banner "✅ Your workout plan is ready!" then "What's your name?" | text field "Name" | CTA | none | C |
| 33 | 33/35 (bar hidden) | Data capture | Banner "✅ Your workout plan is ready!" then "What's your date of birth?" | date field | CTA | none | C |
| 34 | 34/35 (bar hidden) | **Email gate** | Banner "✅ Your workout plan is ready!" then "Enter your email". Placeholder "name@example.com". Lock icon line "We respect your privacy and take protecting it very seriously, no spam" (a dash in the original) | email field, required, validated | CTA "Continue" | none | C |
| 35 | 35/35 | Loading / analysing + commitment | QuizLoadingStep. Caption sequence in the dictionary: "Analyzing data", "Measuring body profile", "Building goal achievement path", "Suggesting workout program", "Meal planning", "Your workout plan is ready!". Embedded question: "Almost done!" / "Are you ready to make the commitment?" with "Yes! I will do my first workout today! 😎", "Yes, I will do my first workout tomorrow 👌", "I'm not ready to make the commitment" | AA on choice | not observed | C, timing not observed |
| 36 | none | Result + offer + paywall | `/final/:finalId/:userId`. Not reached | | | | not reached |

Timing of loading screens: not observed, because the walk stopped before step 35. The loader component is lazy-loaded and was not in the downloaded code. The only timing constants on the page are for a chat-style component that this funnel does not use: `messagePauseMs 2000, typingDotCycleMs 800, typingDurationMs 1000`.

## Summary

**Count.** 36 screens on the longest path (landing + 35 counted steps), then the result/paywall. The shortest path is 34 (no event date, no equipment).
- Real inputs: 32. That is 22 choice questions (13 single tap, 7 multi-select, 1 swipe-card set, 1 slider), 5 typed or date inputs (height, weight, target weight, event date, birth date), name, email, plus the commitment choice inside the loader.
- Pure interstitials: 3 (nutrition, halfway, health care), each about 10 steps apart (slots 7, 20, 22).
- Inline feedback blocks: 4 (water, target weight/BMI, workout issues, frequency).
- Loading/commitment: 1.

**Where personal data is asked.**
- Age range: the landing screen, before anything else.
- Gender: 1. Body type: 2. Goal: 3. Dream body: 4. Body fat: 5. Problem areas: 6.
- Height plus a health-data legal consent: 11. Weight: 12. Target weight: 13.
- Event date: 15. Fitness level and strength numbers: 16, 23, 24.
- Name: 32. Date of birth: 33. Email: 34.
- Age is asked twice: a range on the landing screen and the exact birth date at 33.

**How answers are played back.**
- In the quiz (observed and config):
  - The nutrition interstitial copy matches the "Gain Muscle Mass" goal.
  - The target-body options change with the goal.
  - The slider redraws your body as you move it.
  - The problem-area zones light up on the figure.
  - The event date is promised back: "We will keep this important event in mind for your journey".
  - The frequency answer is benchmarked against "users who took the quiz in 2025".
- In the result (dictionary strings, not seen in this funnel):
  - "Personal summary based on your answers"
  - "Shredded plan for {Name} is ready!"
  - Current BMI with labels Underweight to Obese, plus "Your BMI is {number}, considered {bmiLabel}"
  - "Daily calorie intake", "Daily water intake" with "You need to drink more water" or "You drink more water than 75% of users who took the quiz"
  - A plan card with Goal, Fitness Level, Place to Workout, Workout Duration, Workout Frequency
  - "Goals for the next 6 months also include:" with the additional goals ticked at step 21
- So the "because you said" pattern is mostly implicit. Your name, your numbers and your picks come back as labelled facts, not as sentences that start "because you said".

**Email gate.** It sits at 34 of 35, after 31 investment steps and after name and birth date. Three screens in a row show the banner "✅ Your workout plan is ready!", so the plan is framed as finished and waiting. Headline "Enter your email". The only reassurance is "We respect your privacy and take protecting it very seriously, no spam" (a dash in the original). There is no skip. The progress bar is hidden on these three screens, so the user cannot see they are at the end, only that the plan is "ready". The loader comes after the gate, not before it.

**Price and plan framing (dictionary strings, not observed in this funnel).**
- Timers: "Discount reserved for", "Discount expires in:", "Discount expires".
- Discounts: "SAVE {percent}%", with prices shown "per day".
- Plan ladder: "Just try it" (1 week or 7-day trial), "Ready to commit" (1 month), "3 month plan", "Change your life" (6 months), "Lifetime plan", with a "recommended" badge. Plus "People using plan for 3 months achieve twice as many results as for 1 month *According to a study by Mad Muscles, 2022".
- Social proof: "{1103} people bought a workout plan in the last day", "1100+ people bought workout", "We helped over ... people", "Join over 2 000 000 members of MadMuscles family", "67 million men have chosen us". These numbers do not agree with each other.
- Reviews: "Hear success stories from our users", four named short reviews, and before/after photos with the disclaimer "*The image is not intended to represent the user. Results vary per person and are not guaranteed."
- Risk reversal: "100% Money-Back Guarantee ... if you don't see visible results and can prove that you followed our plan".
- Renewal small print: "if you don't cancel at least 24 hours prior to the end of the 7-day trial, you will automatically be charged {price} every month".
- Extra lines: "Fees & taxes" and "Additional Fees" added at checkout.

**Context.** The FTC sued Genesis Tech, the group behind MadMuscles, Harna and Unimeal, on 2026-06-17. The suit alleges products sold as "free or available for a low, one-time cost, often with a money-back guarantee" while auto-renewal is obscured. These are allegations, not findings. Source: [FTC press release, 2026-06-17](https://ftc.gov/news-events/news/press-releases/2026/06/ftc-sues-stop-sprawling-enterprise-operating-unlawful-subscription-schemes); [The Next Web](https://thenextweb.com/news/ftc-genesis-tech-subscription-schemes). The landing line "Complete this quiz and choose your paid subscription plan" and the health consent sheet both read like post-lawsuit compliance additions. That is opinion; I have not seen an earlier version to compare.

## 10 most transferable tactics for the Stand Firm strength-type quiz

Opinion, ranked by how much they should lift completion without breaking the brand rules.

1. **First tap on the landing page.** The ad lands on a question, not a pitch: big promise headline, four big age buttons, legal line in the footer. For us: "Which strength do you lead with?" and four type-flavoured choices, or an easy opener like age, as the hero.
2. **Auto-advance every single-choice question with zero delay.** Measured at under 0.1 s. Keep a CTA only for multi-select and typed answers. Over 8 to 12 questions this is the biggest friction cut.
3. **Visible "N/total" counter, hidden at the gate.** It shows progress early and drops the bar once the "plan is ready" framing begins. For us: show "3 of 10" honestly through the questions and keep it true. Do not hide it to blur how many steps are left (see the cautions below).
4. **Identity-first picture questions.** "Choose the body you want" uses aspirational pictures. For us: four strength-type portraits or scenes ("the Protector", etc.) to choose from, with the next options branching on that choice the way target-body branches on goal.
5. **Interstitials about every 6 to 10 screens, each doing one job.** One teaches (nutrition), one marks the milestone and reframes failure ("Halfway there!" plus "the #1 reason is starting too big"), one shows care (health disclaimer). For us: one Scripture or principle card, one "halfway" card that reframes past failure as a starting point, one short testimony.
6. **Blameless obstacle question followed by empathy.** "Have you experienced any of these issues..." then "Thanks for sharing! A lot of people have faced the same setbacks." Ask about the obstacle once, never shame, and answer it at once with "you are not alone, here is the plan".
7. **Ask for a near-term anchor and promise to use it.** "Do you have an important event coming up?" plus "We will keep this important event in mind". For us: "What season are you in?" (new baby, new job, recovering from a loss) and actually name it in the result and the program's day 1.
8. **Name before email, with "your plan is ready".** Asking his name first makes the email feel like claiming something already his, and the name then shows up in the result headline ("{Name}'s Protector profile"). We can say "your profile is ready" truthfully, because the result is computed by then.
9. **Commitment micro-question inside the loader.** "Are you ready to make the commitment?" with "today / tomorrow / not ready". For us: "When will you start day 1?" with "Today / Tomorrow / This Sunday". It is a real implementation intention we can use in the email sequence. Keep the loader short and the captions true to what is being computed.
10. **Result as a labelled summary of his own answers, then the offer.** Plan card fields (Goal, Level, Place, Duration, Frequency) built from his answers, plus "Goals for the next 30 days also include:" from a multi-select. For us: strength type, secondary strength, the stated obstacle, the season he named, his start day, then the $27 30-day program shown as the plan for exactly that profile. A risk-reversal block works if the guarantee is simple and unconditional.

Honourable mentions: a slider with a live picture (we could use a "how often do you feel..." slider with changing art), and a body-map multi-select (could become "where does pressure hit hardest: home, work, faith, health").

## Manipulative or off-brand for a brand that bans fake timers and fake scarcity

- **"Discount reserved for" / "Discount expires in" countdowns.** Fake urgency unless a real, enforced deadline exists. Banned for us.
- **"{1103} people bought a workout plan in the last day".** A templated number in braces. Unverifiable live-counter scarcity. Banned.
- **Contradictory scale claims** ("2 000 000 members" vs "67 million men have chosen us" vs "We helped over X people"). Off-brand. Use one sourced, true number or none.
- **"According to a study by Mad Muscles, 2022" (3 months gives twice the results).** A self-cited study used as an upsell anchor. Do not copy.
- **"x% of users" benchmarks that flatter every answer** (54/76/88%, 23/73/92%). Unsourced and built to please. For us, only state comparisons we can prove from our own data, or drop them.
- **"Your workout plan is ready!" shown before email, and the loader after it.** The plan cannot be built yet (DOB and the email come after). Mildly misleading. For us, compute the result before the gate and only then say it is ready.
- **Hiding the progress bar exactly where the user is asked for name, DOB and email.** Removes his sense of where the end is. Keep it visible.
- **Age asked twice** (range, then exact DOB) for data, not for the user. Ask once, and only what changes the result.
- **Trial-to-monthly auto-renew, "Fees & taxes" added at checkout, and a money-back guarantee that requires proof of following the plan.** These match the pattern the FTC complaint targets. Stand Firm's $27 should be a one-time price, all-in, with a plain guarantee.
- **Fitness level captions that mock the low option** ("Whenever I sit on the floor, it's hard for me to stand up"). Off-brand for a dignity-first men's brand.
- **Before/after imagery that "is not intended to represent the user".** If we show transformation stories, they must be real men, named with permission.

## Sources

- Live session, 2026-10-29: https://madmuscles.com/en/funnel/default-uni-soft/step-one and `https://madmuscles.com/en/funnel/default-uni-soft/quiz/default-uni-soft?stepId=...` for step-gender through step-measures-consent-modal.
- Funnel config and translation strings embedded in the server HTML of the quiz page (Next.js flight data), fetched 2026-10-29. Rendered copy saved at `/tmp/claude-0/-home-user-design-kb/948f11a1-c1f6-5dc2-a3ff-2427afb43271/scratchpad/madmuscles/steps_rendered_from_config.txt`.
- FTC press release, 2026-06-17: https://ftc.gov/news-events/news/press-releases/2026/06/ftc-sues-stop-sprawling-enterprise-operating-unlawful-subscription-schemes
- The Next Web coverage: https://thenextweb.com/news/ftc-genesis-tech-subscription-schemes
