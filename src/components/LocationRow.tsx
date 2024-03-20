import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { DateTime } from "luxon";
import { BlurView } from '@react-native-community/blur';

import { useForecast } from '../hooks/current-forecast.hook';
import { District } from '../constants/districts.constant';
import weatherIcons from '../constants/weathericons.constant';
import { Forecast } from '../utils/weatherData';
import { SCREENS } from '../constants/screens.constant';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setName, setLat, setLon } from '../store/location.slice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { setForecast } from '../store/forecast.slice';
import { ParamListBase } from '@react-navigation/native';


type LocationRowProps = {
  district: District;
  navigation: NativeStackNavigationProp<ParamListBase>
};
function LocationRow(props: LocationRowProps): JSX.Element {
  const [, forecast, error] = useForecast(props.district.lat, props.district.lon);

  const dispatch = useDispatch<AppDispatch>();

  if (error) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.glassWrapper}>
          <View style={styles.opacity}>
            <View style={styles.left}>
              <View>
                <Text style={styles.small}>There was an error getting the forecast.</Text>
              </View>
            </View>
          </View>
          <BlurView blurAmount={25} blurType='light' />
        </View>
      </View>
    )
  }

  if (forecast) {
    const today = new Forecast(forecast).atDay(DateTime.now())
    if (!today) {
      return (
        <View style={styles.wrapper}>
          <View style={styles.glassWrapper}>
            <View style={styles.opacity}>
              <View style={styles.left}>
                <Text>Forecast unavailable.</Text>
              </View>
            </View>
            <BlurView blurAmount={25} blurType='light' />
          </View>
        </View>
      )
    }

    return (
      <TouchableOpacity style={styles.wrapper}>
        <View style={styles.glassWrapper}>
          <View
            style={styles.opacity}
            onTouchStart={() => console.log(props.district)}
            onTouchEnd={() => {
              dispatch(setForecast(forecast))
              dispatch(setName(props.district.name));
              dispatch(setLat(props.district.lat));
              dispatch(setLon(props.district.lon));
              props.navigation.navigate(SCREENS.Home);
            }
            }
          >
            <View style={styles.left}>
              <View>
                <Text style={styles.header}>{props.district.name}</Text>
              </View>
              <View style={styles.smallContainer}>
                <Text style={styles.small}>&uarr;{Math.round(today.maxTemperature || 0)}&deg;  &darr;{Math.round(today.minTemperature || 0)}&deg;</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Icon source={weatherIcons[today.weatherSymbol || 'fair_day']} size={60} />
            </View>
          </View>
          <BlurView blurAmount={25} blurType='light' />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.glassWrapper}>
        <View style={styles.opacity}>
          <View style={styles.left}>
            <View>
              <ActivityIndicator animating={true} color={'white'} size={34} />
            </View>
          </View>
        </View>
        <BlurView blurAmount={25} blurType='light' />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: 17,
  },
  glassWrapper: {
    width: '100%',
    borderRadius: 4,
  },
  blurBar: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 0,
  },
  opacity: {
    backgroundColor: 'rgba(193, 193, 193, 0.5)',
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 1,
    borderRadius: 4,
  },
  left: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  header: {
    fontSize: 24,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    fontWeight: "400",
  },
  small: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    fontWeight: "400",
  },
  smallContainer: {
    marginTop: 5,
  },
});

export default LocationRow;
