import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Search } from '@/components/Search';
import Alerts from '@/components/Alerts';
import AppBar from '@/components/AppBar';

import { useLocationStore } from '@/lib/store/location.store';
import { Place } from '@/lib/geo/places';
import { ThemeColors, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

const SearchScreen = () => {
  const name = useLocationStore(s => s.name);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);
  const setLocation = useLocationStore(s => s.setLocation);
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={name ? name : 'Search location'} />
          <View style={styles.alertsWrapper}>
            <Alerts lat={lat} lon={lon} location={name} />
          </View>
          <Search
            location={name}
            setLocation={
              (place: Place) => {
                setLocation({ name: place.name, lat: place.latitude, lon: place.longitude });
                router.replace('/');
              }
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SearchScreen;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: colors.bgAlt,
  },
  bg: {
    height: '100%',
    backgroundColor: colors.bgAlt,
  },
  alertsWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: Spacing.lg,
  },
})
