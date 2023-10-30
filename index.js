import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider, configureFonts } from 'react-native-paper';

import { name as appName } from './app.json';
import App from './App';

const fontConfig = {
  notoHeader: {
    fontFamily: Platform.select({
      web: 'NotoSans',
      ios: 'NotoSans',
      default: 'NotoSans',
    }),
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 20,
  }
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
  fonts: configureFonts({config: fontConfig, isV3: true}),
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
