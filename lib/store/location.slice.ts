import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { placeByCurrentLocation } from '@/lib/geo/location';
import { Place } from '@/lib/geo/places';

export const getPreciseLocation = createAsyncThunk('location/getPreciseLocation', async (): Promise<Place> => {
  return placeByCurrentLocation()
});

type InitialState = {
  name: string;
  lat?: number;
  lon?: number;
  loading: boolean;
  error?: string;
};
const initialState: InitialState = {
  name: "",
  lat: undefined,
  lon: undefined,
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
    setLocation: (state, action) => {
      console.log('[Redux] setLocation called with:', action.payload);
      state.name = action.payload.name;
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
    },
    resetError: (state) => {
      console.log('[Redux] clearing location error...');
      state.error = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(getPreciseLocation.pending, state => {
      console.log('Loading location...');
      state.loading = true;
    });
    builder.addCase(getPreciseLocation.fulfilled, (state, action) => {
        console.log('Loading location fulfilled.');
        state.loading = false;
        state.name = action.payload.name;
        state.lat = action.payload.latitude;
        state.lon = action.payload.longitude;
    });
    builder.addCase(getPreciseLocation.rejected, (state, action) => {
      console.error('Loading location rejected.');
      console.error(action.error.message);
      state.error = 'There was a problem figuring out where you are, :(.';
    });
  },
})

export const { setName, setLat, setLon, setLocation, resetError } = locationSlice.actions;
export const { reducer: locationReducer } = locationSlice;
