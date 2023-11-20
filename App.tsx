import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import HourScreen from './src/screens/hour.screen';
import MainScreen from './src/screens/main.screen';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <MainScreen />
    </SafeAreaView>
  );
}

export default App;
