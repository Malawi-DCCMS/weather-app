import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';

import { LOGGER } from '../lib';
import { WeatherForecast } from '../utils/locationforecast';

type ForecastPayload = { lat: number, lon: number };
export const getLocationForecast = createAsyncThunk('forecast/getLocationForecast', async ({ lat, lon }: ForecastPayload): Promise<WeatherForecast> => {
  const API_URL = 'https://api.met.no/weatherapi/locationforecast/2.0';
  // const API_URL = 'http://10.0.2.2/forecast'
  const USER_AGENT = 'met_malawi';
  const url = `${API_URL}?lat=${lat}&lon=${lon}`
  LOGGER.info(url)
  // Request forecast with 20 seconds timeout
  const { data } = await Axios.get(url, { timeout: 20000, headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip'} });
  return data;
});

type InitialState = {
  loading: boolean;
  error?: string;
  forecast?: WeatherForecast;
};
const initialState: InitialState = {
  loading: false,
  error: undefined,
  forecast: undefined,
};

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    setForecast: (state, action) => { state.forecast = action.payload },
    setForecastError: (state, action) => { state.error = action.payload}
  },
  extraReducers(builder) {
    builder.addCase(getLocationForecast.pending, state => {
      LOGGER.info('Loading forecast...');
      state.loading = true;
    });
    builder.addCase(getLocationForecast.fulfilled, (state, action) => {
      LOGGER.info('Loading forecast fulfilled.');
      state.loading = false;
      state.forecast = action.payload;
    });
    builder.addCase(getLocationForecast.rejected, (state, action) => {
      state.loading = false;
      let err = ""
      if (action.error.name === 'AxiosError') {
        // Handle Axios-specific errors
        err = action.error.response?.data || action.error.message;
      } else if(action.error.message){
        // Handle other types of errors
        err = action.error.message;
      }
      LOGGER.error('Loading forecast rejected: ' + err);
      state.error = 'There was a problem getting the weather. Please try again later.';
    });
  },
})

export const { setForecast, setForecastError } = forecastSlice.actions;
export const { reducer: forecastReducer } = forecastSlice;
