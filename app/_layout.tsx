import { Buffer } from 'buffer';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SystemBars } from '@/components/SystemBars';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persistOptions } from '@/lib/query/client';
import { MD3LightTheme, MD3DarkTheme, PaperProvider, configureFonts } from 'react-native-paper';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
} from '@expo-google-fonts/open-sans';

import '../lib/localization/i18n';
import { AutocompleteDropdownContextProvider } from "@/lib/autocomplete";
import { Fonts } from '@/lib/theme';
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router/react-navigation';
import { useColorScheme } from '@/lib/hooks/use-color-scheme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useRecordAppOpens } from '@/lib/hooks/use-review';

global.Buffer = global.Buffer || Buffer;

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const scheme = useColorScheme();
  // Counts days used, for deciding when to ask for a store review.
  useRecordAppOpens();
  const colors = useTheme();

  const theme = {
    ...(scheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(scheme === 'dark' ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: colors.primary,
      secondary: colors.accent,
      error: colors.danger,
      background: colors.bg,
      surface: colors.bg,
      onSurface: colors.text,
    },
    fonts: configureFonts({ config: { fontFamily: Fonts.sans.regular } }),
  };

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={theme}>
        <AutocompleteDropdownContextProvider>
          {/* Default follows the resolved theme; Welcome/OnboardingPlaces (dark
              background regardless of theme) push their own "light" override
              while mounted. */}
          <SystemBars style={scheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{
            // Hide the default expo header
            headerShown: false,
          }} >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings" />
          </Stack>
        </AutocompleteDropdownContextProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        <AppContent />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
