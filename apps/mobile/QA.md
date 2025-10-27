# Mobile QA Checklist

1. Install & Run
- pnpm install
- pnpm --filter @museum/mobile start

2. Permissions
- Location permission request displayed
- Push notifications permission displayed

3. Ordering flow
- Create order: address, floor, type, comment
- Payment screen opens (mock)
- Webhook simulates assignment

4. Courier mode
- Start tracking sends periodic location to server
- Nearby orders listed on courier UI (server stub)

5. Devices
- Test on Android emulator and physical device


