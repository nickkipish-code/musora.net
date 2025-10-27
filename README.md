# Museum Delivery — Monorepo

Monorepo scaffold for the Museum-branded on-demand heavy-trash pickup service.

Quickstart

1. Install dependencies

```bash
pnpm install
```

2. Configure env (see `.env.example`)

3. Run migrations & seed

```bash
pnpm db:migrate
pnpm seed
```

4. Start dev

```bash
pnpm dev
```

**Mobile app (Expo):**
- Установите Expo Go на телефон (Play Store / App Store)
- Запустите: `cd apps/mobile && pnpm dev`
- Отсканируйте QR-код из терминала в Expo Go
- 📱 [Подробная инструкция по запуску в Expo Go](apps/mobile/EXPO_GO_GUIDE.md)

Environment

Create a `.env` file in the repo root with the following variables (example in `.env.example`):

```
NODE_ENV=development
API_PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/museum_delivery
API_JWT_SECRET=supersecret
API_BASE_URL=http://localhost:4000
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_MAPS_KEY
PAYMENT_MONOBANK_JAR_URL=https://send.monobank.ua/jar/XXXXXXXX
```

Deployment notes

- Admin (Next.js): deploy to Vercel. Set `API_BASE_URL` env in Vercel to point to server.
- Server (NestJS): deploy to Render or any Node host, set `DATABASE_URL` and `API_JWT_SECRET`.
- Mobile (Expo): use EAS for production builds. Store `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and `EXPO_PUBLIC_API_BASE_URL` in EAS secrets.

CI/CD

- See `.github/workflows/ci.yml` for basic CI and `.github/workflows/deploy.yml` for deploy templates.

Secrets

- Store `DATABASE_URL`, `API_JWT_SECRET` in server host (Render) settings.
- Store `VERCEL_TOKEN` in GitHub secrets to enable automatic admin deploys.
- Store `RENDER_API_KEY` and `RENDER_SERVICE_ID` in GitHub secrets if you want to trigger Render deploys from Actions.
- Store `EAS_TOKEN` in GitHub secrets to enable automatic EAS builds.

Sentry

- To enable server error monitoring set `SENTRY_DSN` in server env.
- To enable client monitoring for admin set `NEXT_PUBLIC_SENTRY_DSN` in Vercel.
- To enable mobile monitoring set `SENTRY_DSN` in EAS secrets.

Release helpers

- `pnpm changelog` — generate CHANGELOG.md from git messages
- `pnpm release:prepare` — run changelog + tests
- `pnpm release:tag` — create and push annotated git tag using current package.json version



```


