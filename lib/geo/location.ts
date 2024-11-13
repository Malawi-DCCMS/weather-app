// import { requestMultiple, PERMISSIONS, Permission, openSettings, checkMultiple } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import { Place } from '@/lib/geo/places'

import { LOGGER } from '@/lib/utils/logger';
import { snapToPlace } from './places';

export type Location = {lat: number; long: number};


// const checkPermissions = async (permissions: Array<Permission>): Promise<boolean> => {
//     const statuses = await checkMultiple(permissions);
//     return Object.values(statuses).reduce((acc, val) => acc && val === 'granted', true);
//   }
  
//   const requestPermissions = async (permissions: Array<Permission>): Promise<boolean> => {
//     const alreadyGranted = await checkPermissions(permissions);
//     if (alreadyGranted) {
//       return true;
//     }
  
//     const requests = await requestMultiple(permissions);
//     const granted = Object.values(requests).reduce((acc, val) => acc && val === 'granted', true);
//     if (!granted) {
//       const errors = Object.entries(requests).map(([k, v]) => `${k}: ${v}`).join('\n');
//       throw new Error(errors);
//     }
  
//     return true;
//   }
  
  // const requestAndroid = async (): Promise<boolean> => {
  //   const needed = [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  //   return await requestPermissions(needed);
  // };
  
  // const requestIOS = async () => {
  //   const needed = [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];
  //   return await requestPermissions(needed);
  // };
  
  function queryLocation(): Promise<{ lat: number, lon: number }> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position =>
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
        error => reject(error),
        { enableHighAccuracy: false },
      );
    });
  }
  
  const getClosestPlace = (lat: number, lon: number): Place|undefined => {
    const location: Location = { lat, long: lon };
    return snapToPlace(location);
  }
  
  export const placeByCurrentLocation = async (): Promise<Place> => {
    try {
        // Platform.OS === 'ios' ? await requestIOS() : await requestAndroid();
        const location = await queryLocation();
        const closest = getClosestPlace(location.lat, location.lon);
        if (!closest) {
            throw new Error('Failed to get closest place to location.' + location);
        }
        return closest as Place;
    } catch (error) {
        LOGGER.error("Failed to get current location")
        throw error
    }
  }
