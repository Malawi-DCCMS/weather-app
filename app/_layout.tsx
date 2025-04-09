import { Stack } from "expo-router";
import { store } from '@/lib/store';
import { Provider as StoreProvider } from 'react-redux';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

import '../lib/localization/i18n';
import { AutocompleteDropdownContextProvider } from "@/lib/autocomplete";

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
        <AutocompleteDropdownContextProvider>
          <Stack screenOptions={{
            // Hide the default expo header
            headerShown: false,
          }} />
        </AutocompleteDropdownContextProvider>
      </PaperProvider>
    </StoreProvider>
  );
}
