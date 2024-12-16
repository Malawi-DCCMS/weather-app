import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';

import { Forecast } from '@/lib/forecast/types';
import { Forecaster } from '@/lib/forecast/locationforecast';

type ForecastPayload = { lat: number, lon: number };
export const getLocationForecast = createAsyncThunk('forecast/getLocationForecast', async ({ lat, lon }: ForecastPayload): Promise<Forecast> => {
  const forecaster = new Forecaster();
  return await forecaster.getForecast(lat, lon);
});

type InitialState = {
  loading: boolean;
  error?: string;
  forecast?: Forecast;
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
    setForecastLoading: (state) => { state.forecast = undefined; state.error = undefined; state.loading = true; },
    setForecast: (state, action) => { state.forecast = action.payload },
    setForecastError: (state, action) => { state.error = action.payload },
  },
  extraReducers(builder) {
    builder.addCase(getLocationForecast.pending, state => {
      console.log('Loading forecast...');
      state.loading = true;
    });
    builder.addCase(getLocationForecast.fulfilled, (state, action) => {
      console.log('Loading forecast fulfilled.');
      state.loading = false;
      state.forecast = action.payload;
    });
    builder.addCase(getLocationForecast.rejected, (state, action) => {
      state.loading = false;
      let err = ""
      if (Axios.isAxiosError(action.error)) {
        // Handle Axios-specific errors
        err = action.error.response?.data || action.error.message;
      } else if(action.error.message){
        // Handle other types of errors
        err = action.error.message;
      }
      console.error('Loading forecast rejected: ' + err);
      state.error = 'There was a problem getting the weather. Please try again later.';
    });
  },
})

export const { setForecast, setForecastError, setForecastLoading } = forecastSlice.actions;
export const { reducer: forecastReducer } = forecastSlice;
