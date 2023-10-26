import React, { useEffect, useState } from 'react';
import {Alert} from 'react-native';

import { getCurrentPosition } from './src/services/location.service';
import { snapToPlace } from './utils/places';

import MenuBar from './components/MenuBar';
import { DEFAULT_PLACE } from './src/common';

function App(): JSX.Element {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);

  useEffect(() => {
    getCurrentPosition()
      .then(location => {
        const closestPlace = snapToPlace({
          name: '',
          position: {lat: location.lat, long: location.long},
        });
        if (closestPlace?.name.length) {
          setPlace(closestPlace);
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  }, [setPlace]);

  return (
    <MenuBar location={place.name}/>
  );
}

export default App;
