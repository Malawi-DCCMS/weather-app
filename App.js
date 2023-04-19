import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WeatherIcon } from './src/weathericon';

import GPSLocation from './components/GPSLocation';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <View>
        <GPSLocation />
      </View>
      <Text>Open up ApP.js to start working on your app!</Text>
      <WeatherIcon size={256} symbol_code='lightsnow' />
      <StatusBar style="auto" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
