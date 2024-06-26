import BackgroundFetch from "react-native-background-fetch";

import { store, } from '../store';
import { getPreciseLocation, saveLocation } from "../store/location.slice";
import { LOGGER } from "../lib";
import { getLocationAlerts } from "../store/alert.slice";

export const LocationUpdateTask = () => {

  const start = async (interval = 15) => {
    const status = await BackgroundFetch.configure({
      minimumFetchInterval: interval,
      stopOnTerminate: false,
      startOnBoot: true,
    }, async taskId => {
      LOGGER.info('[BackgroundFetch] starting location update and alerts task with identifier taskId:', taskId);
      const locationAction = await store.dispatch(getPreciseLocation());
      if (locationAction.meta.requestStatus === 'fulfilled') {
        const location = locationAction.payload as Place;
        await store.dispatch(saveLocation(location));
        LOGGER.info(`Dispatching get location alerts for ${location.position.lat}, ${location.position.long}`);
        await store.dispatch(getLocationAlerts({ lat: location.position.lat, lon: location.position.long }));
      }
      LOGGER.info('Task complete.')
      BackgroundFetch.finish(taskId);
    }, async (taskId) => {
      LOGGER.info('Task has timed out. Exiting...');
      BackgroundFetch.finish(taskId);
    });

    LOGGER.info('[BackgroundFetch] Location update and alerts task status is ', status);
  };

  return { start };
};
