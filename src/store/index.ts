import { configureStore } from '@reduxjs/toolkit';
import { locationReducer } from './location.slice';
import { forecastReducer } from './forecast.slice';
import { alertsReducer } from './alert.slice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    forecast: forecastReducer,
    alerts: alertsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {location: LocationState}
export type AppDispatch = typeof store.dispatch
