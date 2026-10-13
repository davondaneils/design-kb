# design-data test brief (fresh, written 2026-10-13 before any build)

Never used in an earlier test. All names and facts are fictional.

## Brief: Crux, class booking for climbing gyms
Crux is a small software product that climbing gyms sign up for. Each gym (a tenant) has one or more walls (locations), staff and members.

- Staff publish classes: a type (Intro to Bouldering, Lead Climbing Course, Youth Club), a location, a start and end time, an instructor and a capacity (usually 8 to 12).
- Members book classes from their phone. A full class has a waitlist; when someone cancels, the first person on the waitlist gets the place. Members can cancel up to 12 hours before the start; later cancellations count as a no-show.
- Members pay for a monthly pass (unlimited classes) or a 10-class pack, through Stripe. A member whose payment fails keeps access for 7 days.
- Staff check members in at the desk. Gym owners see attendance for the last 30 days.
- A member can belong to more than one gym. Staff of one gym must never see another gym's members.

## Deliverables
1. The data model for Postgres (Supabase is fine): SQL DDL with keys, constraints and indexes, plus the access rules.
2. The API surface the member app and staff desk need (method, path, status codes, error shape).
3. The member's **class schedule screen** for one week at one location, as one self-contained HTML file at 390 and 1440 wide, light and dark. It shows only what the data model can actually supply, in every state that data allows (loading, nothing scheduled, a class with places left, a full class with a waitlist position, a booked class, a class you can no longer cancel for free, payment past due). Each state reachable by `?state=` in the URL.
4. A short hand-over: the decisions you made and what you would test before launch.

## Rubric (critic, blind to which version is which)
1. **Data fundamentals gate** (pass or fail per item): keys, declared foreign keys with indexes, correct types (time, money), NOT NULL by default, uniqueness in the database, tenant isolation enforced at the data layer, no secret in the client, safe-to-retry booking and payment endpoints, paginated lists, machine-readable errors.
2. **Correctness under concurrency**: can two members take the last place at once? Can the waitlist promote two people into one place? Can a member book twice?
3. **Data and screen agree**: every number, label and state on the screen is something the model stores or can compute; nothing on screen the data cannot supply; every state the data allows is designed. Times shown in the location's time zone.
4. **Screen fundamentals**: `node tools/lint.mjs` result and the design fundamentals gate (contrast, hierarchy, spacing, states).
5. **Expert moves**: what would a senior engineer at Stripe or Supabase, and a senior product designer at Linear, learn or object to?
Scores 1 to 10 per area; any gate fail caps the area at 5.
