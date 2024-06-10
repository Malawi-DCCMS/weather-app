import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import appBackground from '../../assets/new-glass-bg.png';
import AppBar from '../components/AppBar';
import { Search } from '../components/Search';
import { SCREENS } from '../constants/screens.constant';
import { AppDispatch, RootState } from '../store';
import { setName, setLat, setLon } from '../store/location.slice';
import { setForecastError } from '../store/forecast.slice';
import { RootDrawerParamList } from '../common';
import Alerts from '../components/Alerts';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Search'>;
const SearchScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, lat, lon} = useSelector((state: RootState) => state.location);
  const { alerts } = useSelector((state: RootState) => state.alerts);

  return (
    <SafeAreaView>
      <AutocompleteDropdownContextProvider>
        <View style={styles.wrapper}>
          <ImageBackground source={appBackground} style={styles.bg}>
            <AppBar location={name} navigation={navigation} />
            <Alerts alerts={alerts[`${lat}${lon}`]} location={name} navigator={navigation} />
            <Search
              location={name}
              setLocation={
                place => {
                  // No need to reset forecast here.
                  dispatch(setForecastError(""))
                  dispatch(setName(place.name));
                  dispatch(setLat(place.position.lat));
                  dispatch(setLon(place.position.long));
                  navigation.navigate(SCREENS.Home);
                }
              }
            />
          </ImageBackground>
        </View>
      </AutocompleteDropdownContextProvider>
    </SafeAreaView>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  bg: {
    height: '100%',
  }
})