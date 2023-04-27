import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import * as Location from 'expo-location';

const GPSLocation = () => {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View>
      <Text>Your location:</Text>
      <Text>{text}</Text>
    </View>
  );
};

export default GPSLocation;
