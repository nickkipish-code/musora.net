# Mobile Release (EAS) — Museum Mobile

1. Configure `eas.json` build profiles and ensure `app.json` contains correct package/bundle identifiers.
2. Run `eas build --platform android --profile production` with `EAS_TOKEN` set in CI.
3. Upload resulting `.aab` to Play Console.

Notes:
- Provide `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and `EXPO_PUBLIC_API_BASE_URL` as EAS secrets.


