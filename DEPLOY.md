# Deployment Guide — Museum Delivery

This document describes recommended steps to deploy each app.

Server (Render)
- Create a new Node service on Render pointing to this repo.
- Set build command: `pnpm install && pnpm -w --filter @museum/server build`
- Start command: `pnpm -w --filter @museum/server start`
- Env vars: `DATABASE_URL`, `API_JWT_SECRET`, `API_PORT` (optional)

CI Secrets Checklist
- `VERCEL_TOKEN` (Vercel deploy)
- `RENDER_API_KEY` and `RENDER_SERVICE_ID` (Render deploy)
- `EAS_TOKEN` (EAS builds)
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_PROJECT_MOBILE` (Sentry uploads)
- `STRIPE_SECRET_KEY` (Stripe payments)
- `SUPABASE_URL`, `SUPABASE_KEY` (optional for storage)


Admin (Vercel)
- Create a new Vercel project, point to `apps/admin`.
- Ensure `API_BASE_URL` env var is set in Vercel to the server URL.

Mobile (EAS)
- Configure EAS with `eas.json` in `apps/mobile`.
- Store secrets via `eas secret:create` for `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and `EXPO_PUBLIC_API_BASE_URL`.

CI
- See `.github/workflows/deploy.yml` as a template. Set secrets in GitHub repo settings.

Sentry alert suggestions
- Create alert for `error.rate` spike on `production` environment
- Create alert for `transaction.failed` events or high `checkout.session.completed` failures
- Integrate Slack or email integration to send urgent alerts to on-call


