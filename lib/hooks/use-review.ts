import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { maybeRequestReview, recordAppOpen } from '@/lib/review';

// Wait this long after the screen settles before asking, so the prompt never
// lands on top of content the user is still taking in.
const PROMPT_DELAY_MS = 4000;
// A forecast counts as "just loaded" (so the device is online and the user
// has just been shown fresh data) if it was fetched within this window.
const FRESH_FORECAST_MS = 2 * 60 * 1000;

// Mounted once at the app root: counts the launch, and each return to the
// foreground (a long-lived session spanning days still counts each day).
export function useRecordAppOpens(): void {
  useEffect(() => {
    recordAppOpen();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') recordAppOpen();
    });
    return () => subscription.remove();
  }, []);
}

type ReviewPromptOptions = {
  // False while Today isn't really showing yet (e.g. onboarding redirect pending).
  enabled: boolean;
  hasForecast: boolean;
  forecastUpdatedAt: number;
  hasActiveWarning: boolean;
};

// Used on Today: after a successful, fresh forecast load, and only while the
// screen is focused, ask the review policy whether to prompt.
export function useReviewPrompt({ enabled, hasForecast, forecastUpdatedAt, hasActiveWarning }: ReviewPromptOptions): void {
  useFocusEffect(
    useCallback(() => {
      if (!enabled || !hasForecast) return;
      const timer = setTimeout(() => {
        const forecastLoaded = Date.now() - forecastUpdatedAt < FRESH_FORECAST_MS;
        maybeRequestReview({ forecastLoaded, hasActiveWarning });
      }, PROMPT_DELAY_MS);
      return () => clearTimeout(timer);
    }, [enabled, hasForecast, forecastUpdatedAt, hasActiveWarning])
  );
}
