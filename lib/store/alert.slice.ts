import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CAPAlert, alertLevel } from '@/lib/alerts/alert';
import { CAPCollector } from '../alerts/collector';

const levelYellowAndAbove = (alert: CAPAlert): boolean => {
  if (!alert.info || !alert.info.length) {
    return false;
  }
  switch (alertLevel(alert.info[0])) {
    case 'Red':
    case 'Orange':
    case 'Yellow':
      return true;
    default:
      return false;
  };
}

export const getAlerts = createAsyncThunk('alerts/getActiveAlerts', async (): Promise<Array<CAPAlert>> => {
  const RSS_FEED_URL = 'https://www.metmalawi.gov.mw/api/cap/rss.xml';
  const collector = new CAPCollector(RSS_FEED_URL);
  await collector.update();

  const filteredMessages = collector.activeMessages()
    .filter(levelYellowAndAbove);
  return filteredMessages;
});

type InitialState = {
  loading: boolean;
  error?: string;
  alerts: Array<CAPAlert> ;
};
const initialState: InitialState = {
  loading: false,
  error: undefined,
  alerts: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlerts: (state, action) => { state.alerts = action.payload },
    setAlertsError: (state, action) => { state.error = action.payload },
    setAlertsLoading: (state) => { state.alerts = []; state.loading = true; },
  },
  extraReducers(builder) {
    builder.addCase(getAlerts.pending, state => {
      console.log('Loading alerts...');
      state.loading = true;
    });
    builder.addCase(getAlerts.fulfilled, (state, action) => {
      console.log('Loading alerts fulfilled.');
      state.loading = false;
      const alerts = action.payload;
      const withInfo = alerts.filter(alert => alert.info && alert.info.length);
      state.alerts = withInfo;
    });
    builder.addCase(getAlerts.rejected, (state, action) => {
      state.loading = false;
      console.error('Loading alerts rejected: ' + action.error.message);
      state.error = 'There was a problem getting the location alerts. Please try again later.';
    });
  },
})

export const { setAlerts, setAlertsError, setAlertsLoading } = alertSlice.actions;
export const { reducer: alertsReducer } = alertSlice;
