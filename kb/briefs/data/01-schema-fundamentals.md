# Brief 01: Schema fundamentals

Question: how do I turn an app idea into tables that stay correct as the app grows?
After reading, the designer can: list entities and relationships, pick primary keys, pick column types, write constraints that make bad data impossible, and decide when to denormalize or use jsonb.
Must cover: 1NF to 3NF in plain words; one fact in one place; surrogate vs natural keys; bigint identity vs UUIDv4 vs UUIDv7; types from the Postgres "Don't Do This" list (timestamptz, text, no money type, no serial, no char(n)); money as integer minor units; NOT NULL by default; CHECK, UNIQUE, FK with explicit ON DELETE; enums vs lookup tables vs CHECK; naming conventions; jsonb rules.
Test briefs: "Schema for a booking app for yoga studios"; "I store prices as float, is that ok?"; "Should I use UUIDs?"
