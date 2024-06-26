import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';

import { name as appName } from './app.json';
import App from './App';
import { store } from './src/store';
import { LocationUpdateTask } from './src/tasks';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

export default function Main() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
}

LocationUpdateTask().start();

AppRegistry.registerComponent(appName, () => Main);
