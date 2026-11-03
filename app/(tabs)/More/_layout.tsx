import React from 'react';
import { Stack } from 'expo-router';

// Pages under the More tab live in their own stack so the tab bar stays
// visible (with More selected) on sub-pages, and the Android back button
// / iOS swipe-back pop to "More conditions" instead of leaving the tab.
export const unstable_settings = {
  // Keeps "More conditions" underneath when a sub-page is opened directly
  // (deep link, /Places redirect), so back still lands on it.
  initialRouteName: 'index',
};

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Favourites" />
    </Stack>
  );
}
