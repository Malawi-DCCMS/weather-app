import { Stack } from "expo-router";
import { store } from '@/lib/store';
import { Provider as StoreProvider } from 'react-redux';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

import '../lib/localization/i18n';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

export default function RootLayout() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{
          // Hide the default expo header
          headerShown: false,
        }} />
      </PaperProvider>
    </StoreProvider>
  );
}
