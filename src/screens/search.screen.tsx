import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import appBackground from '../../assets/app-bg-normal.png';
import AppBar from '../components/AppBar';
import { Search } from '../components/Search';
import { SCREENS } from '../constants/screens.constant';
import { AppDispatch, RootState } from '../store';
import { setName, setLat, setLon } from '../store/location.slice';

type ScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
}
const SearchScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name } = useSelector((state: RootState) => state.location);

  return (
    <SafeAreaView>
      <AutocompleteDropdownContextProvider>
        <View style={styles.wrapper}>
          <ImageBackground source={appBackground} style={styles.bg}>
            <AppBar location={name} navigation={navigation} />
            <Search
              location={name}
              setLocation={
                place => {
                  dispatch(setName(place.name));
                  dispatch(setLat(place.lat));
                  dispatch(setLon(place.long));
                  navigation.navigate(SCREENS.home);
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