import React from 'react';
import { Stack } from 'expo-router';

// The 24-hour full hourly breakdown opens inside the Five Days tab's own stack
// so the tab bar stays visible (with Five Days selected), and back / swipe-back
// return to the Five Days list.
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function FiveDaysLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Hourly" />
    </Stack>
  );
}
