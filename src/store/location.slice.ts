import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestMultiple, PERMISSIONS, Permission, openSettings, checkMultiple } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';

import { DISTRICTS } from '../constants/districts.constant';
import { LOGGER } from '../lib';
import { snapToPlace } from '../utils/places';

const checkPermissions = async (permissions: Array<Permission>): Promise<boolean> => {
  const statuses = await checkMultiple(permissions);
  return Object.values(statuses).reduce((acc, val) => acc && val === 'granted', true);
}

const requestPermissions = async (permissions: Array<Permission>): Promise<boolean> => {
  const alreadyGranted = await checkPermissions(permissions);
  if (alreadyGranted) {
    return true;
  }

  const requests = await requestMultiple(permissions);
  const granted = Object.values(requests).reduce((acc, val) => acc && val === 'granted', true);
  if (!granted) {
    const errors = Object.entries(requests).map(([k, v]) => `${k}: ${v}`).join('\n');
    throw new Error(errors);
  }

  return true;
}

const requestAndroid = async (): Promise<boolean> => {
  const needed = [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  return await requestPermissions(needed);
};

const requestIOS = async () => {
  const needed = [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];
  return await requestPermissions(needed);
};

function queryLocation(): Promise<{ lat: number, lon: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      error => reject(error),
      { enableHighAccuracy: true },
    );
  });
}

const getClosestPlace = (lat: number, lon: number): Place|undefined => {
  const place: Place = { name: '', position: { lat, long: lon } };
  return snapToPlace(place);
}

export const getPreciseLocation = createAsyncThunk('location/getPreciseLocation', async (): Promise<Place> => {
  Platform.OS === 'ios' ? await requestIOS() : await requestAndroid();
  const location = await queryLocation();
  const closest = getClosestPlace(location.lat, location.lon);
  if (!closest) {
    throw new Error('Failed to get closest location.');
  }

  return closest as Place;
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
