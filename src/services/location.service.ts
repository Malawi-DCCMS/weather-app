import Geolocation from '@react-native-community/geolocation';

export function getCurrentPosition(): Promise<Location> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }),
      error => reject(error),
      {enableHighAccuracy: true},
    );
  });
}
