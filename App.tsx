import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import Home from './components/Home';
import Detailed from './components/forecast/Detailed';
import MenuBar from './components/MenuBar';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <MenuBar />
  );
}

export default App;
