import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { locationReducer } from './location.slice';
import { forecastReducer } from './forecast.slice';
import { alertsReducer } from './alert.slice';
import { SettingsReducer } from './settings.slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings'],
};

const reducers = {
  location: locationReducer,
  forecast: forecastReducer,
  alerts: alertsReducer,
  settings: SettingsReducer,
};
const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
});
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {location: LocationState}
export type AppDispatch = typeof store.dispatch
