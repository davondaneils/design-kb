# Brief 03: Common app data models

Question: what do the standard building blocks of a SaaS or content app look like as tables?
After reading, the designer can: model users vs profiles vs auth identities, orgs/workspaces with memberships and roles, invitations, Stripe billing with entitlements, content with drafts/versions/slugs, audit logs, and deletion.
Must cover: never extend the auth provider's user table directly, use a profiles table keyed by the auth id; org-owned data (B2B) from day one; membership table with role and unique (org, user); invitations with hashed token and expiry; billing as a cache of Stripe with one sync function; subscription statuses that grant access; content statuses, slugs, revisions; soft delete trade-offs and the deleted_record pattern; audit log shape.
Test briefs: "B2B SaaS with teams and seats"; "Newsletter/content site with paid tier".
