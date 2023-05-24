import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import Home from './components/Home';
import Detailed from './components/forecast/Detailed';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Home'}}
          />
          <Stack.Screen name="7 days forecast" component={Detailed} />
        </Stack.Navigator>
      </NavigationContainer>
    </AutocompleteDropdownContextProvider>
  );
}

export default App;
