# Museum Delivery — Release Checklist

1) Prepare code
- Ensure `main` branch is stable and tests pass.

2) Build admin (Next.js)
- `pnpm -w --filter @museum/admin build`
- Upload source maps to Sentry if enabled: use `sentry-cli` with `SENTRY_AUTH_TOKEN`.

3) Build server
- Deploy to Render: set `DATABASE_URL` and `API_JWT_SECRET`.

4) Build mobile (EAS)
- `eas build --platform android --profile production`
- Upload sourcemaps using `sentry-expo` or `eas-cli` integration.

5) Tag & release
- Create git tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
- Push: `git push --tags`

Commands

- Generate changelog: `pnpm changelog`
- Prepare release: `pnpm release:prepare` (runs changelog)
- Create tag and push: `pnpm release:tag`

6) Post-release
- Monitor Sentry and logs, ensure no critical errors.


