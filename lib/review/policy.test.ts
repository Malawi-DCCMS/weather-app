import { DateTime } from 'luxon';

import {
  EMPTY_REVIEW_STATE,
  recordOpen,
  recordPrompt,
  ReviewContext,
  ReviewState,
  ReviewThresholds,
  shouldRequestReview,
} from './policy';

const thresholds: ReviewThresholds = {
  minDaysUsed: 5,
  minDaysSinceInstall: 7,
  minDaysBetweenPrompts: 90,
  maxPrompts: 3,
};

const context: ReviewContext = { forecastLoaded: true, hasActiveWarning: false, appVersion: '1.7.1' };

const install = DateTime.fromISO('2026-01-01T09:00:00');

// Opens the app once on each of `days` consecutive days from install.
function usedOnDays(days: number): ReviewState {
  let state = EMPTY_REVIEW_STATE;
  for (let i = 0; i < days; i++) state = recordOpen(state, install.plus({ days: i }));
  return state;
}

const eligible = usedOnDays(5);
const later = install.plus({ days: 10 });

describe('recordOpen', () => {
  test('counts distinct days, not opens', () => {
    let state = recordOpen(EMPTY_REVIEW_STATE, install);
    state = recordOpen(state, install.plus({ hours: 3 }));
    state = recordOpen(state, install.plus({ hours: 8 }));
    expect(state.daysUsed).toBe(1);

    state = recordOpen(state, install.plus({ days: 1 }));
    expect(state.daysUsed).toBe(2);
  });

  test('keeps the first open as the install date', () => {
    const state = recordOpen(recordOpen(EMPTY_REVIEW_STATE, install), install.plus({ days: 3 }));
    expect(state.firstOpenedAt).toBe(install.toISO());
  });
});

describe('shouldRequestReview', () => {
  test('asks once usage thresholds are met', () => {
    expect(shouldRequestReview(eligible, context, thresholds, later)).toEqual({ ok: true });
  });

  test('never asks during an active warning', () => {
    const decision = shouldRequestReview(eligible, { ...context, hasActiveWarning: true }, thresholds, later);
    expect(decision.ok).toBe(false);
  });

  test('never asks without a freshly loaded forecast (error, offline, stale cache)', () => {
    const decision = shouldRequestReview(eligible, { ...context, forecastLoaded: false }, thresholds, later);
    expect(decision.ok).toBe(false);
  });

  test('waits for enough days since install', () => {
    expect(shouldRequestReview(eligible, context, thresholds, install.plus({ days: 6 })).ok).toBe(false);
    expect(shouldRequestReview(eligible, context, thresholds, install.plus({ days: 7 })).ok).toBe(true);
  });

  test('waits for enough distinct days used', () => {
    expect(shouldRequestReview(usedOnDays(4), context, thresholds, later).ok).toBe(false);
  });

  test('never asks twice in the same app version', () => {
    const asked = recordPrompt(eligible, later, '1.7.1');
    const muchLater = later.plus({ days: 365 });
    expect(shouldRequestReview(asked, context, thresholds, muchLater).ok).toBe(false);
    expect(shouldRequestReview(asked, { ...context, appVersion: '1.8.0' }, thresholds, muchLater).ok).toBe(true);
  });

  test('respects the gap between asks, even in a new version', () => {
    const asked = recordPrompt(eligible, later, '1.7.1');
    const nextVersion = { ...context, appVersion: '1.8.0' };
    expect(shouldRequestReview(asked, nextVersion, thresholds, later.plus({ days: 89 })).ok).toBe(false);
    expect(shouldRequestReview(asked, nextVersion, thresholds, later.plus({ days: 90 })).ok).toBe(true);
  });

  test('stops after the lifetime cap', () => {
    let state = eligible;
    ['1.7.1', '1.8.0', '1.9.0'].forEach((v, i) => {
      state = recordPrompt(state, later.plus({ days: i * 100 }), v);
    });
    const decision = shouldRequestReview(state, { ...context, appVersion: '2.0.0' }, thresholds, later.plus({ days: 1000 }));
    expect(decision.ok).toBe(false);
  });

  test('never asks before any app open is recorded', () => {
    expect(shouldRequestReview(EMPTY_REVIEW_STATE, context, thresholds, later).ok).toBe(false);
  });

  test('zero thresholds (local testing) ask straight away', () => {
    const zero: ReviewThresholds = { minDaysUsed: 0, minDaysSinceInstall: 0, minDaysBetweenPrompts: 0, maxPrompts: 3 };
    const justInstalled = recordOpen(EMPTY_REVIEW_STATE, install);
    expect(shouldRequestReview(justInstalled, context, zero, install).ok).toBe(true);
  });
});
