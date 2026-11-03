import { Alert, Linking, Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';
import { DateTime } from 'luxon';

import { jsonStorage } from '@/lib/storage';
import {
  REVIEW_DEBUG,
  REVIEW_MAX_PROMPTS,
  REVIEW_MIN_DAYS_BETWEEN_PROMPTS,
  REVIEW_MIN_DAYS_SINCE_INSTALL,
  REVIEW_MIN_DAYS_USED,
} from '@/config';
import {
  EMPTY_REVIEW_STATE,
  recordOpen,
  recordPrompt,
  ReviewContext,
  ReviewState,
  ReviewThresholds,
  shouldRequestReview,
} from './policy';

// In-app store review prompt. The rules live in policy.ts; this module
// persists the counters and talks to expo-store-review. The OS decides
// whether the prompt actually appears (iOS: at most 3 times a year; Android:
// an undisclosed quota) and never reports back, so an "ask" here means we
// requested it, not that the user saw it.

const STATE_KEY = 'review-state';

export const REVIEW_THRESHOLDS: ReviewThresholds = {
  minDaysUsed: REVIEW_MIN_DAYS_USED,
  minDaysSinceInstall: REVIEW_MIN_DAYS_SINCE_INSTALL,
  minDaysBetweenPrompts: REVIEW_MIN_DAYS_BETWEEN_PROMPTS,
  maxPrompts: REVIEW_MAX_PROMPTS,
};

// Development builds only (see REVIEW_DEBUG in config).
const debug = __DEV__ && REVIEW_DEBUG;

function loadState(): ReviewState {
  try {
    const raw = jsonStorage.getItem(STATE_KEY);
    return raw ? { ...EMPTY_REVIEW_STATE, ...JSON.parse(raw) } : EMPTY_REVIEW_STATE;
  } catch {
    return EMPTY_REVIEW_STATE;
  }
}

function saveState(state: ReviewState): void {
  jsonStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function appVersion(): string {
  return Constants.expoConfig?.version ?? 'unknown';
}

export function getReviewState(): ReviewState {
  return loadState();
}

// Called on launch and whenever the app returns to the foreground.
export function recordAppOpen(now: DateTime = DateTime.now()): void {
  saveState(recordOpen(loadState(), now));
}

// One attempt per session at most: once it's been evaluated as "ask", later
// focus/refresh events in the same session don't re-check.
let askedThisSession = false;

export async function maybeRequestReview(context: Omit<ReviewContext, 'appVersion'>): Promise<void> {
  if (askedThisSession) return;

  const now = DateTime.now();
  const version = appVersion();
  const decision = shouldRequestReview(loadState(), { ...context, appVersion: version }, REVIEW_THRESHOLDS, now);

  if (!decision.ok) {
    if (debug) console.info(`[review] not asking: ${decision.reason}`);
    return;
  }

  askedThisSession = true;

  if (debug) {
    // Recorded like a real ask, so the per-version / gap / cap rules can be
    // exercised too. Reset from Settings (development builds) to try again.
    saveState(recordPrompt(loadState(), now, version));
    Alert.alert('Review prompt (debug)', 'All conditions are met: the store review prompt would be requested now.');
    return;
  }

  try {
    console.log(await StoreReview.isAvailableAsync(), await StoreReview.hasAction());
    if (!(await StoreReview.isAvailableAsync()) || !(await StoreReview.hasAction())) return;
    await StoreReview.requestReview();
    saveState(recordPrompt(loadState(), now, version));
  } catch (error) {
    console.warn('Requesting a store review failed.', error);
  }
}

// Development builds: start the counters over (Settings > Reset review prompt).
export function resetReviewState(): void {
  jsonStorage.removeItem(STATE_KEY);
  askedThisSession = false;
}

// The store's "write a review" page, for the Settings row. Null when the
// store URLs aren't configured in app.json (ios.appStoreUrl /
// android.playStoreUrl) — the row is hidden then.
export function reviewPageUrl(): string | null {
  const url = StoreReview.storeUrl();
  if (!url) return null;
  if (Platform.OS === 'ios') return `${url}${url.includes('?') ? '&' : '?'}action=write-review`;
  return url;
}

export async function openReviewPage(): Promise<void> {
  const url = reviewPageUrl();
  if (url) await Linking.openURL(url);
}
