export const RATE_LIMITS = {
  /** Per-IP guest create — short window. */
  init: 3,
  name: 10,
  device: 10,
  result: 20,
  /** Per-IP guest create — hourly ceiling (anti-bot). */
  initHourly: 15,
  leaderboard: 30,
} as const;

/** Client header (`X-Api-Key`); Express stores incoming names in lowercase. */
export const API_KEY_HEADER = 'x-api-key';

/** 23:59 on days 28–31; handler skips unless tomorrow is the 1st. */
export const PARTITION_CRON = '59 23 28-31 * *';

export const AUTH_TOKEN_CACHE_TTL_SECONDS = 300;

/** Reuse /health probe results so Docker + platform probes do not PING Redis every few seconds. */
export const HEALTH_CHECK_CACHE_MS = 10_000;

/** Process-local auth hits; still bounded by AUTH_TOKEN_CACHE_TTL_SECONDS. */
export const AUTH_TOKEN_LOCAL_CACHE_MAX_ENTRIES = 5_000;

/** Prisma interactive-TX limits for result submit (default timeout is 5s). */
export const SUBMIT_RESULT_TX = {
  maxWait: 10_000,
  timeout: 30_000,
} as const;
