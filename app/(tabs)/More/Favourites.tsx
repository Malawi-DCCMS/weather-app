import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text } from 'react-native-paper';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';

import AppBar from '@/components/AppBar';
import LocationRow from '@/components/LocationRow';
import LastUpdatedFooter from '@/components/LastUpdatedFooter';
import StatusCard from '@/components/StatusCard';

import { useFavourites } from '@/lib/hooks/favourites.hook';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { useLocationRowErrors } from '@/lib/hooks/location-row-errors.hook';
import { forecastQueryKey } from '@/lib/hooks/current-forecast.hook';
import { useLocationStore } from '@/lib/store/location.store';
import { SCREENS } from '@/lib/layout/constants';
import { Place } from '@/lib/geo/places';
import { ForecastRecord } from '@/lib/forecast/types';
import { ThemeColors, Fonts, navRailWidth, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

const FavouritesScreen = () => {
  const { t } = useTranslation();
  const setLocation = useLocationStore(s => s.setLocation);
  const queryClient = useQueryClient();
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isXL = useBreakpoint() === 'xl';

  const [favouritesLoading, favourites] = useFavourites();
  const { hasErrors, onErrorChange, retryAll } = useLocationRowErrors();
  const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({});

  const onLoadingChange = useCallback((id: string, loading: boolean) => {
    setLoadingRows(prev => {
      if (!!prev[id] === loading) return prev;
      const next = { ...prev };
      if (loading) {
        next[id] = true;
      } else {
        delete next[id];
      }
      return next;
    });
  }, []);

  // Check both synchronous cache state (so the first render frame doesn't
  // flash the already-cached first element before child effects run) and
  // the live loading state reported by each LocationRow.
  const anyRowUncached = favourites.some(place => {
    const state = queryClient.getQueryState(forecastQueryKey(place.latitude, place.longitude));
    return !state || (!state.data && state.status !== 'error');
  });
  const isRowsLoading = favourites.length > 0 && (anyRowUncached || Object.keys(loadingRows).length > 0);

  const onSelectPlace = (place: Place, forecast: ForecastRecord) => {
    // LocationRow already fetched this place's forecast to render its
    // preview card — seed the query cache with it under Home's query key
    // so navigating there doesn't re-fetch data we already have.
    queryClient.setQueryData(forecastQueryKey(place.latitude, place.longitude), forecast);
    setLocation({ name: place.name, lat: place.latitude, lon: place.longitude });
    router.push(SCREENS.Home.toString() as Href);
  };

  const onEdit = () => {
    router.push(SCREENS.EditFavourites.toString() as Href);
  };

  return (
    // No bottom edge: the tab bar already pads for the home indicator, so
    // insetting here too leaves a blank strip above the bar.
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={t('Favourites')} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {favouritesLoading ? (
              <View style={styles.loader}>
                <ActivityIndicator animating={true} color={colors.primary} size='large' />
              </View>
            ) : favourites.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon source="map-marker-off-outline" size={32} color={colors.textSubtle} />
                <Text style={styles.emptyTitle}>{t('places.empty.title')}</Text>
                <Text style={styles.emptyText}>{t('places.empty.text')}</Text>
                <TouchableOpacity style={styles.setButton} onPress={onEdit} accessibilityLabel={t('places.setFavourites')}>
                  <Text style={styles.setButtonText}>{t('places.setFavourites')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {isRowsLoading && (
                  <View style={styles.loader}>
                    <ActivityIndicator animating={true} color={colors.primary} size='large' />
                  </View>
                )}
                <View style={isRowsLoading ? styles.hidden : undefined}>
                  <View style={styles.header}>
                    <Text style={styles.headerText}>{t('places.yourPlaces')}</Text>
                    <TouchableOpacity
                      onPress={onEdit}
                      accessibilityLabel={t('places.edit')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Icon source="pencil-outline" size={22} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  {hasErrors && (
                    <StatusCard
                      icon="cloud-off-outline"
                      iconColor={colors.danger}
                      title={t('forecast.error.title')}
                      text={t("forecast.error.generic") + '.'}
                      onRetry={retryAll}
                    />
                  )}
                  {favourites.map((place, idx) => (
                    <LocationRow
                      key={`${place.name}-${place.latitude}-${place.longitude}-${idx}`}
                      id={String(idx)}
                      district={{ name: place.name, lat: place.latitude, lon: place.longitude }}
                      onPress={(forecast: ForecastRecord) => onSelectPlace(place, forecast)}
                      onErrorChange={onErrorChange}
                      onLoadingChange={onLoadingChange}
                    />
                  ))}
                  <LastUpdatedFooter />
                </View>
              </>
            )}
            {favourites.length === 0 && !favouritesLoading && <LastUpdatedFooter />}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FavouritesScreen;

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
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  loader: {
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  hidden: {
    display: 'none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerText: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  setButton: {
    marginTop: Spacing.lg,
    minHeight: 44,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.medium,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonText: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textInverse,
  },
  xlPadding: {
    paddingLeft: navRailWidth,
  },
});
