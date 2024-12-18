import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LOGGER } from '@/lib/utils/logger';
import { placeByCurrentLocation } from '@/lib/geo/location';
import { Place } from '@/lib/geo/places';

export const getPreciseLocation = createAsyncThunk('location/getPreciseLocation', async (): Promise<Place> => {
  return placeByCurrentLocation()
});

export const saveLocation = createAsyncThunk('location/saveLocation', async (place: Place): Promise<Place> => {
  await AsyncStorage.setItem('location', `${place.name}`);
  await AsyncStorage.setItem('lat', `${place.latitude}`);
  await AsyncStorage.setItem('lon', `${place.longitude}`);
  return place;
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
        state.lat = action.payload.latitude;
        state.lon = action.payload.longitude;
    });
    builder.addCase(getPreciseLocation.rejected, (state, action) => {
      LOGGER.error('Loading location rejected.');
      LOGGER.error(action.error.message);
      state.error = 'There was a problem figuring out where you are, :(.';
    });
    builder.addCase(saveLocation.pending, () => {
      LOGGER.info('Saving location...');
    });
    builder.addCase(saveLocation.fulfilled, () => {
      LOGGER.info('Saving location fulfilled.')
    });
    builder.addCase(saveLocation.rejected, (_, action) => {
      LOGGER.error(`Failed to save location because of ${action.error.message}`)
    });
  },
})

export const { setName, setLat, setLon } = locationSlice.actions;
export const { reducer: locationReducer } = locationSlice;
