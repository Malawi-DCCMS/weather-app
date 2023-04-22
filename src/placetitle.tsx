import {View, Text} from 'react-native'
import {useState, useEffect} from 'react'
import * as Location from 'expo-location';

import { SnapToPlace } from '../utils/places';

export default function PlaceTitle() {
    const [place, setPlace] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});

            const place = await SnapToPlace({
                lat: location.coords.latitude,
                long:location.coords.longitude
            })
            if (typeof place != null){
                setPlace(place.name)
            }
        })()
    }, []);

    return (
        <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 26 }}>Position: { place }</Text>
        </View>
    )
}