import 'react-native-reanimated'
import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { SCREENS } from './src/constants/screens.constant';
import HourScreen from './src/screens/hour.screen';
import MainScreen from './src/screens/main.screen';
import NoLocationScreen from './src/screens/no-location.screen';
import SearchScreen from './src/screens/search.screen';
import AboutUsScreen from './src/screens/about-us.screen';
import FeedbackScreen from './src/screens/feedback.screen';
import WeatherWarningScreen from './src/screens/weather-warning.screen';
import { RootDrawerParamList } from './src/common';


const Drawer = createDrawerNavigator<RootDrawerParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={SCREENS.Home} backBehavior='history' screenOptions={{
        headerShown: false
      }}>
        <Drawer.Screen name={SCREENS.Home} component={MainScreen} />
        <Drawer.Screen name={SCREENS.Feedback} component={FeedbackScreen} />
        <Drawer.Screen name={SCREENS.NoLocation} component={NoLocationScreen} />
        <Drawer.Screen name={SCREENS.Hourly} component={HourScreen} />
        <Drawer.Screen name={SCREENS.Search} component={SearchScreen} />
        <Drawer.Screen name={SCREENS.AboutUs} component={AboutUsScreen} />
        <Drawer.Screen name={SCREENS.WeatherWarning} component={WeatherWarningScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
