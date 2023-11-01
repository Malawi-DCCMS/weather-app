import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { WeatherForecast } from '../utils/locationforecast';

export function useCurrentForecast(latitude: number, longitude: number): WeatherForecast {
  const [forecast, setForecast] = useState<WeatherForecast>();
  const API_URL = 'https://api.met.no/weatherapi/locationforecast/2.0';
  const USER_AGENT = 'met_malawi';

  useEffect(() => {
    fetch(
      `${API_URL}?lat=${latitude}&lon=${longitude}`,
      {
        headers: {'User-Agent': USER_AGENT},
      },
    )
      .then(res => res.json())
      .then(setForecast)
      .catch(error => Alert.alert(error.message));
  }, [latitude, longitude]);

  return forecast as WeatherForecast;
}
