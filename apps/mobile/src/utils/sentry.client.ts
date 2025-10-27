import * as Sentry from 'sentry-expo';

export function initMobileSentry(dsn?: string) {
  if (!dsn) return;
  Sentry.init({ dsn, enableInExpoDevelopment: true, debug: false });
}


