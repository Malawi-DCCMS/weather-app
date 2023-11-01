import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getCurrentPosition } from '../services/location.service';
import { snapToPlace } from '../utils/places';
import { DEFAULT_PLACE } from '../common';

export function useCurrentPlace(): Place {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);

  useEffect(() => {
    getCurrentPosition()
      .then(location => {
        const closestPlace = snapToPlace({
          name: '',
          position: { lat: location.lat, long: location.long },
        });
        if (closestPlace?.name.length) {
          setPlace(closestPlace);
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  }, []);

  return place;
}
