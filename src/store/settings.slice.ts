import { createSlice } from '@reduxjs/toolkit';

import { LANGUAGES } from '../common';

type AppSettings = {
  language?: string,
};

type InitialState = {
  error?: string,
  loading: boolean,
  appSettings: AppSettings,
};
const initialState: InitialState = {
  error: undefined,
  loading: false,
  appSettings: {
    language: LANGUAGES.Chichewa
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    persistLanguage: (state, action) => { state.appSettings.language = action.payload },
  }
});

export const { persistLanguage } = settingsSlice.actions;
export const { reducer: SettingsReducer } = settingsSlice;
