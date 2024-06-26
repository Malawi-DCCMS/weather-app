import { useEffect, useState } from 'react';
import Axios from 'axios';

import { LOGGER } from '../lib';
import { Forecast } from '../common';
import { Forecaster } from '../utils/locationforecast';

type ReturnType = [
  loading: boolean,
  forecast?: Forecast,
  error?: Error,
];

export function useForecast(latitude: number, longitude: number): ReturnType {
  const [forecast, setForecast] = useState<Forecast>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const fetchData = async () => {
      const forecaster = new Forecaster();
      try {
        setLoading(false);
        setForecast(await forecaster.getForecast(latitude, longitude));
      } catch (error) {
        setLoading(false);
        if (Axios.isAxiosError(error)) {
          LOGGER.error('Axios error:', error.response?.data || error.message);
        } else {
          LOGGER.error('Non-Axios error:' + error);
        }
        setError(new Error("There was a problem getting the weather. Please try again later."))
      }
    }
    fetchData()
  }, [latitude, longitude]);

  return [loading, forecast, error];
}
