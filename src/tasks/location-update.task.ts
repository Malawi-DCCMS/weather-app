import BackgroundFetch from "react-native-background-fetch";

import { store, } from '../store';
import { getPreciseLocation, saveLocation } from "../store/location.slice";

export const LocationUpdateTask = () => {

  const start = async (interval = 15) => {
    const status = await BackgroundFetch.configure({
      minimumFetchInterval: interval,
      stopOnTerminate: false,
      startOnBoot: true,
    }, async taskId => {
      console.log('[BackgroundFetch] starting location task with identifier taskId: ', taskId);
      console.log('Dispatching get location...');
      const locationAction = await store.dispatch(getPreciseLocation());
      if (locationAction.meta.requestStatus === 'fulfilled') {
        console.log('Precise location successfully gotten. Dispatching save location...');
        const location = locationAction.payload as Place;
        const saveLocationAction = await store.dispatch(saveLocation(location));
        if (saveLocationAction.meta.requestStatus === 'fulfilled') {
          console.log('Precise location successfully saved.');
        }
      }
      console.log('Task complete.')
      BackgroundFetch.finish(taskId);
    }, async (taskId) => {
      console.log('Task has timed out. Exiting...');
      BackgroundFetch.finish(taskId);
    });

    console.log('[BackgroundFetch] Location update task status is ', status);
  };

  return { start };
};
