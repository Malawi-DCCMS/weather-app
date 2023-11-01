import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import HourlyScreen from './src/screens/hourly.screen';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <HourlyScreen />
    </SafeAreaView>
  );
}

export default App;
