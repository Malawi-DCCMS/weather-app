import { DateTime } from 'luxon';

// Pure decision logic for the in-app review prompt — no storage, no native
// calls, so every rule is unit-testable (see policy.test.ts). lib/review
// wires it to storage and expo-store-review.

export type ReviewState = {
  firstOpenedAt?: string;     // ISO timestamp of the first recorded open
  lastUsedDay?: string;       // ISO date (yyyy-MM-dd, device local) of the last open
  daysUsed: number;           // distinct days the app was opened on
  lastPromptAt?: string;      // ISO timestamp of the last ask
  promptsTotal: number;       // lifetime asks
  promptedVersions: string[]; // app versions already asked in
};

export const EMPTY_REVIEW_STATE: ReviewState = { daysUsed: 0, promptsTotal: 0, promptedVersions: [] };

export type ReviewThresholds = {
  minDaysUsed: number;
  minDaysSinceInstall: number;
  minDaysBetweenPrompts: number;
  maxPrompts: number;
};

export type ReviewContext = {
  // A forecast just loaded successfully (fresh data, so the device is online
  // and the user has just been shown what they came for).
  forecastLoaded: boolean;
  // A warning covers the user's location. Never ask then.
  hasActiveWarning: boolean;
  appVersion: string;
};

export type ReviewDecision = { ok: true } | { ok: false; reason: string };

// Counts an app open. Several opens on the same day count once, so
// infrequent-but-regular users (e.g. weekly checks) aren't out-counted by
// someone opening it ten times in one afternoon.
export function recordOpen(state: ReviewState, now: DateTime): ReviewState {
  const day = now.toISODate()!;
  return {
    ...state,
    firstOpenedAt: state.firstOpenedAt ?? now.toISO()!,
    daysUsed: state.lastUsedDay === day ? state.daysUsed : state.daysUsed + 1,
    lastUsedDay: day,
  };
}

export function recordPrompt(state: ReviewState, now: DateTime, appVersion: string): ReviewState {
  return {
    ...state,
    lastPromptAt: now.toISO()!,
    promptsTotal: state.promptsTotal + 1,
    promptedVersions: state.promptedVersions.includes(appVersion)
      ? state.promptedVersions
      : [...state.promptedVersions, appVersion],
  };
}

const daysBetween = (fromIso: string, now: DateTime) => now.diff(DateTime.fromISO(fromIso), 'days').days;

export function shouldRequestReview(
  state: ReviewState,
  context: ReviewContext,
  thresholds: ReviewThresholds,
  now: DateTime,
): ReviewDecision {
  if (!context.forecastLoaded) return { ok: false, reason: 'no freshly loaded forecast' };
  if (context.hasActiveWarning) return { ok: false, reason: 'a warning is active for this location' };
  if (!state.firstOpenedAt) return { ok: false, reason: 'no recorded app opens yet' };

  const sinceInstall = daysBetween(state.firstOpenedAt, now);
  if (sinceInstall < thresholds.minDaysSinceInstall) {
    return { ok: false, reason: `installed ${Math.floor(sinceInstall)} of ${thresholds.minDaysSinceInstall} days ago` };
  }
  if (state.daysUsed < thresholds.minDaysUsed) {
    return { ok: false, reason: `used on ${state.daysUsed} of ${thresholds.minDaysUsed} days` };
  }
  if (state.promptsTotal >= thresholds.maxPrompts) {
    return { ok: false, reason: `already asked ${state.promptsTotal} times (max ${thresholds.maxPrompts})` };
  }
  if (state.promptedVersions.includes(context.appVersion)) {
    return { ok: false, reason: `already asked in version ${context.appVersion}` };
  }
  if (state.lastPromptAt) {
    const sincePrompt = daysBetween(state.lastPromptAt, now);
    if (sincePrompt < thresholds.minDaysBetweenPrompts) {
      return { ok: false, reason: `last asked ${Math.floor(sincePrompt)} of ${thresholds.minDaysBetweenPrompts} days ago` };
    }
  }
  return { ok: true };
}
