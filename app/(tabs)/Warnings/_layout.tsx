import React from 'react';
import { Stack } from 'expo-router';

// Warning details open inside the Alerts tab's own stack so the tab bar
// stays visible (with Alerts selected), and back / swipe-back return to
// the Alerts list.
export const unstable_settings = {
  // Keeps the Alerts list underneath when details are opened from another
  // tab (Today's banner, Five Days) or a deep link, so back lands on it.
  initialRouteName: 'index',
};

export default function WarningsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="WeatherWarning" />
    </Stack>
  );
}
