import BackgroundFetch from "react-native-background-fetch";

import { store, } from '../store';
import { getLocationAlerts } from '../store/alert.slice';
import AsyncStorage from "@react-native-async-storage/async-storage";

const getLatLon = async () => {
  const lat = await AsyncStorage.getItem('lat');
  const lon = await AsyncStorage.getItem('lon');
  return [Number(lat), Number(lon)];
}

export const AlertsTask = () => {

  const start = async (interval = 16) => {
    const status = await BackgroundFetch.configure({
      minimumFetchInterval: interval,
      stopOnTerminate: false,
      startOnBoot: true,
    }, async taskId => {
      console.log('[BackgroundFetch] starting alerts task with identifier taskId: ', taskId);
      const [lat, lon] = await getLatLon();
      if (!lat || !lon) {
        console.log('[BackgroundFetch] no location set. Exiting task...');
      }
      console.log('Dispatching get location alerts for ', lat, ',', lon);
      store.dispatch(getLocationAlerts({ lat, lon }));

      console.log('Task complete.')
      BackgroundFetch.finish(taskId);
    }, async (taskId) => {
      console.log('Task has timed out. Exiting...');
      BackgroundFetch.finish(taskId);
    });

    console.log('[BackgroundFetch] Alerts task status is ', status);
  };

  return { start };
};
