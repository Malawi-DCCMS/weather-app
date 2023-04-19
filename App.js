import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WeatherIcon } from './src/weathericon';
import { Forecaster } from './src/locationforecast';
import { useEffect, useState } from 'react';

export default function App() {
  const [forecast, setForecast] = useState<WeatherForecast|undefined>(undefined);

  const updateForecast = async () => {
    let forecaster = new Forecaster("met_malawi")
    const f = await forecaster.getForecast(-15.7861, 35.0058)
    setForecast(f)
  }

  useEffect(() => {
    updateForecast()
  }, [])

  return (
    <View style={styles.container}>
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
