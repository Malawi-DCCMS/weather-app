import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Forecaster, WeatherForecast } from './src/locationforecast';
import { ForecastSummary } from './src/forecast';

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
      <ForecastSummary forecast={forecast} size={256} />
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
