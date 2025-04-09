import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href, useNavigation } from 'expo-router';

import { Search } from '@/components/Search';
import Alerts from '@/components/Alerts';
import AppBar from '@/components/AppBar';

import { AutocompleteDropdownContextProvider } from '@/lib/autocomplete';
import { SCREENS } from '@/lib/layout/constants';
import { AppDispatch, RootState } from '@/lib/store';
import { setLocation } from '@/lib/store/location.slice';
import { Place } from '@/lib/geo/places';
import { CommonActions } from '@react-navigation/native';

const appBackground = require('@/assets/new-glass-bg.png');

const SearchScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, lat, lon } = useSelector((state: RootState) => state.location);
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={name ? name : 'Search location'} />
          <Alerts lat={lat} lon={lon} location={name} />
          <Search
            location={name}
            setLocation={
              (place: Place) => {
                console.log('[UI] dispatching setLocation with:', place);
                dispatch(setLocation({ name: place.name, lat: place.latitude, lon: place.longitude }));
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'index' }],
                  })
                );
              }
            }
          />
        </ImageBackground>
      </View>
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
  bg: {
    height: '100%',
  }
})