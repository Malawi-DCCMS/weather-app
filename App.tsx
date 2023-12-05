import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HourScreen from './src/screens/hour.screen';
import MainScreen from './src/screens/main.screen';
import NoLocationScreen from './src/screens/no-location.screen';
import SearchScreen from './src/screens/search.screen';
import { SCREENS } from './src/constants/screens.constant';
import FeedbackScreen from './src/screens/feedback.screen';

const Drawer = createDrawerNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={SCREENS.home} screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#E4E5D6',
          width: 240,
        },
      }}>
        <Drawer.Screen name={SCREENS.home} component={MainScreen} />
        <Drawer.Screen name={SCREENS.feedback} component={FeedbackScreen} />
        <Drawer.Screen name={SCREENS.nolocation} component={NoLocationScreen} options={{drawerItemStyle: { height: 0 }}} />
        <Drawer.Screen name={SCREENS.hourly} component={HourScreen} options={{drawerItemStyle: { height: 0 }}} />
        <Drawer.Screen name={SCREENS.search} component={SearchScreen} options={{drawerItemStyle: { height: 0 }}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
