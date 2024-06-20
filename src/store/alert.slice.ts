import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { LOGGER } from '../lib';
import { CAPAlert } from '../lib/cap-client/alert';
import { CAPCollector } from '../lib/cap-client/collector';

type AlertPayload = { lat: number, lon: number };
export const getLocationAlerts = createAsyncThunk('alerts/getActiveAlerts', async ({ lat, lon }: AlertPayload): Promise<[string, Array<CAPAlert>]> => {
  const RSS_FEED_URL = 'https://www.metmalawi.gov.mw/api/cap/rss.xml';
  const collector = new CAPCollector(RSS_FEED_URL);
  await collector.update();
  return [`${lat}${lon}`, collector.activeMessages({ latitude: lat, longitude: lon })]; 
});

type InitialState = {
  loading: boolean;
  error?: string;
  alerts: {[key: string]: Array<CAPAlert>};
};
const initialState: InitialState = {
  loading: false,
  error: undefined,
  alerts: {},
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlerts: (state, action) => { state.alerts = action.payload },
    setAlertsError: (state, action) => { state.error = action.payload },
    setAlertsLoading: (state) => { state.alerts = {}; state.loading = true; },
  },
  extraReducers(builder) {
    builder.addCase(getLocationAlerts.pending, state => {
      LOGGER.info('Loading location alerts...');
      state.loading = true;
    });
    builder.addCase(getLocationAlerts.fulfilled, (state, action) => {
      LOGGER.info('Loading location alerts fulfilled.');
      state.loading = false;
      const [location, alerts] = action.payload;
      const withInfo = alerts.filter(alert => alert.info && alert.info.length);
      state.alerts[location] = withInfo;
    });
    builder.addCase(getLocationAlerts.rejected, (state, action) => {
      state.loading = false;
      LOGGER.error('Loading location alerts rejected: ' + action.error);
      state.error = 'There was a problem getting the location alerts. Please try again later.';
    });
  },
})

export const { setAlerts, setAlertsError, setAlertsLoading } = alertSlice.actions;
export const { reducer: alertsReducer } = alertSlice;
