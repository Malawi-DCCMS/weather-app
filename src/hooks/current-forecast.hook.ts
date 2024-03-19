import { useEffect, useState } from 'react';

import { WeatherForecast } from '../utils/locationforecast';

type ReturnType = [
  loading: boolean,
  forecast?: WeatherForecast,
  error?: Error,
];

export function useForecast(latitude: number, longitude: number): ReturnType {
  const [forecast, setForecast] = useState<WeatherForecast>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

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
      .then(data => {
        setLoading(false);
        setForecast(data);
      })
      .catch(error => (setError(error), setLoading(false)));
  }, [latitude, longitude]);

  return [loading, forecast, error];
}
