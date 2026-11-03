import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useRouter, Href} from 'expo-router';
import { useTranslation } from 'react-i18next';

import AppBar from '@/components/AppBar';
import LocationRow from '@/components/LocationRow';
import StatusCard from '@/components/StatusCard';

import CITIES from '@/assets/cities.json';
import { City } from '@/lib/geo/constants';
import { forecastQueryKey } from '@/lib/hooks/current-forecast.hook';
import { useLocationStore } from '@/lib/store/location.store';
import { SCREENS } from '@/lib/layout/constants';
import { ForecastRecord } from '@/lib/forecast/types';
import { useLocationRowErrors } from '@/lib/hooks/location-row-errors.hook';
import { ThemeColors, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

const NoLocationScreen = () => {
  const { t } = useTranslation();
  const setLocation = useLocationStore(s => s.setLocation);
  const queryClient = useQueryClient();
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { hasErrors, onErrorChange, retryAll } = useLocationRowErrors();

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location="Climweb Weather App" />
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} snapToStart={false}>
            {hasErrors && (
              <StatusCard
                icon="cloud-off-outline"
                iconColor={colors.danger}
                title={t('forecast.error.title')}
                text={t("forecast.error.generic") + '.'}
                onRetry={retryAll}
              />
            )}
            {
              (CITIES as City[]).map((city, idx) =>
                <LocationRow
                  key={idx}
                  id={String(idx)}
                  district={city}
                  onPress={(forecast: ForecastRecord): void => {
                    queryClient.setQueryData(forecastQueryKey(city.lat, city.lon), forecast);
                    setLocation({ name: city.name, lat: city.lat, lon: city.lon });
                    router.push(SCREENS.Home.toString() as Href);
                  }}
                  onErrorChange={onErrorChange}
                />)
            }
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default NoLocationScreen;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: colors.bgAlt,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  bg: {
    height: '100%',
    backgroundColor: colors.bgAlt,
  }
})
