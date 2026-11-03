import { Stack } from 'expo-router';
// import AppbarHeaderBack from '@/components/appbar-header-back';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="about-us" options={{ title: 'About Us' }} />
      <Stack.Screen name="language" options={{ title: 'Language' }} />
      <Stack.Screen name="units" options={{ title: 'Units' }} />
    </Stack>
  );
}
