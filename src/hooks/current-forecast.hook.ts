import { useEffect, useState } from 'react';
import Axios from 'axios';
import { LOGGER } from '../lib';

import { LocationForecast } from '../utils/locationforecast';

type ReturnType = [
  loading: boolean,
  forecast?: LocationForecast,
  error?: Error,
];

export function useForecast(latitude: number, longitude: number): ReturnType {
  const [forecast, setForecast] = useState<LocationForecast>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const API_URL = 'https://api.met.no/weatherapi/locationforecast/2.0';
  const USER_AGENT = 'met_malawi';

  useEffect(() => {
    const fetchData = async () => {
      const url = `${API_URL}?lat=${latitude}&lon=${longitude}`
      try {
        const response = await Axios.get(url, { timeout: 20000, headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip'} });
        setForecast(response.data)
        setLoading(false);
      
      } catch (error) {
        if (Axios.isAxiosError(error)) {
          LOGGER.error('Axios error:', error.response?.data || error.message);
        } else {
          LOGGER.error('Non-Axios error:' + error);
        }
      
        setError(new Error("There was a problem getting the weather. Please try again later."))
        setLoading(false)
      }
    }

    fetchData()
  }, [latitude, longitude]);

  return [loading, forecast, error];
}
