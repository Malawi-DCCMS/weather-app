import 'react-native-reanimated'
import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import HourScreen from './src/screens/hour.screen';
import MainScreen from './src/screens/main.screen';
import NoLocationScreen from './src/screens/no-location.screen';
import SearchScreen from './src/screens/search.screen';
import AboutUsScreen from './src/screens/about-us.screen';
import FeedbackScreen from './src/screens/feedback.screen';
import { SCREENS } from './src/constants/screens.constant';
import { RootDrawerParamList } from './src/common';


const Stack = createStackNavigator<RootDrawerParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={SCREENS.Home} screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name={SCREENS.Home} options={TransitionPresets.SlideFromRightIOS} component={MainScreen} />
        <Stack.Screen name={SCREENS.Feedback} options={TransitionPresets.SlideFromRightIOS} component={FeedbackScreen} />
        <Stack.Screen name={SCREENS.NoLocation} options={TransitionPresets.SlideFromRightIOS} component={NoLocationScreen} />
        <Stack.Screen name={SCREENS.Hourly} options={TransitionPresets.SlideFromRightIOS} component={HourScreen} />
        <Stack.Screen name={SCREENS.Search} options={TransitionPresets.SlideFromRightIOS} component={SearchScreen} />
        <Stack.Screen name={SCREENS.AboutUs} options={TransitionPresets.SlideFromRightIOS} component={AboutUsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
