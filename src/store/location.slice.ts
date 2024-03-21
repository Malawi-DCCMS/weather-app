import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { DISTRICTS } from '../constants/districts.constant';
import { LOGGER } from '../lib';
import { placeByCurrentLocation } from '../utils/location';

export const getPreciseLocation = createAsyncThunk('location/getPreciseLocation', async (): Promise<Place> => {
  return placeByCurrentLocation()
});

type InitialState = {
  name: string;
  lat: number;
  lon: number;
  loading: boolean;
  error?: string;
};
const initialState: InitialState = {
  name: DISTRICTS[0].name,
  lat: DISTRICTS[0].lat,
  lon: DISTRICTS[0].lon,
  loading: false,
  error: undefined,
};
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setName: (state, action) => { state.name = action.payload },
    setLat: (state, action) => { state.lat = action.payload },
    setLon: (state, action) => { state.lon = action.payload },
  },
  extraReducers(builder) {
    builder.addCase(getPreciseLocation.pending, state => {
      LOGGER.info('Loading location...');
      state.loading = true;
    });
    builder.addCase(getPreciseLocation.fulfilled, (state, action) => {
        LOGGER.info('Loading location fulfilled.');
        state.loading = false;
        state.name = action.payload.name;
        state.lat = action.payload.position.lat;
        state.lon = action.payload.position.long;
    });
    builder.addCase(getPreciseLocation.rejected, (state, action) => {
      LOGGER.error('Loading location rejected.');
      LOGGER.error(action.error.message);
      state.error = 'There was a problem figuring out where you are, :(.';
    });
  },
})

export const { setName, setLat, setLon } = locationSlice.actions;
export const { reducer: locationReducer } = locationSlice;
