# WordPress Headless CMS integration

WordPress is **editorial-only**. Next.js + Supabase Auth + PostgreSQL + Prisma remain authoritative for users, jobs, applications, companies and payments.

## Setup (external/infrastructure action, not done in PR)
- Set unique WP_DB_PASSWORD and WP_DB_ROOT_PASSWORD in a noncommitted compose .env.
- Deploy isolated WordPress. Example compose binds 127.0.0.1:8080 only. Terminate TLS at reverse proxy; restrict wp-admin + GraphQL endpoint to intended networks where possible.
- Install and enable official WPGraphQL plugin in WordPress; optionally ACF + WPGraphQL integration for editorial fields.
- Configure HTTPS public/server-accessible GraphQL endpoint in WP_GRAPHQL_ENDPOINT.
- Configure WP_WEBHOOK_SECRET (>=32 chars) on Next server and WordPress webhook sender (custom integration). WordPress must send x-wp-signature: sha256=<HMAC_SHA256(secret, raw_json_body)> to POST /api/cms/revalidate.
- Publish a post, confirm /blog and /blog/<slug> show content, revalidation works, and outage does not affect /praca.

## Security
- Next uses server-to-server WPGraphQL fetch only (no WP auth token in client).
- CMS HTML is rendered as escaped plaintext to avoid unreviewed WordPress HTML XSS; formatted rich text needs an audited sanitization dependency and tests in follow-up.
- No WP user roles mapped to Prisma application roles. No payment or application data in WP.
- WP is NOT installed/deployed by this PR; docker compose is an example only.
