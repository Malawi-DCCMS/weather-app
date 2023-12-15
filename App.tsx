import 'react-native-reanimated'
import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import HourScreen from './src/screens/hour.screen';
import MainScreen from './src/screens/main.screen';
import NoLocationScreen from './src/screens/no-location.screen';
import SearchScreen from './src/screens/search.screen';
import { SCREENS } from './src/constants/screens.constant';
import FeedbackScreen from './src/screens/feedback.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DayScreen from './src/screens/day.screen';

const Drawer = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={SCREENS.home} screenOptions={{
        headerShown: false
      }}>
        <Drawer.Screen name={SCREENS.home} component={MainScreen} />
        <Drawer.Screen name={SCREENS.feedback} component={FeedbackScreen} />
        <Drawer.Screen name={SCREENS.nolocation} component={NoLocationScreen} />
        <Drawer.Screen name={SCREENS.hourly} component={HourScreen} />
        <Drawer.Screen name={SCREENS.day} component={DayScreen} />
        <Drawer.Screen name={SCREENS.search} component={SearchScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
