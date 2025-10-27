import * as Sentry from '@sentry/browser';

export function initClientSentry(dsn?: string) {
  if (!dsn) return;
  Sentry.init({ dsn, release: process.env.NEXT_PUBLIC_COMMIT_SHA });
}


