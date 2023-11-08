import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import HourlyScreen from './src/screens/hourly.screen';
import HomeScreen from './src/screens/home.screen';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <HomeScreen />
    </SafeAreaView>
  );
}

export default App;
