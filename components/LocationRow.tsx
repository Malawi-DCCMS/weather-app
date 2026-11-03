import React, { JSX, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { DateTime } from 'luxon';

import { useForecast } from '@/lib/hooks/current-forecast.hook';
import { City } from '@/lib/geo/constants';
import weatherIcons from '@/lib/forecast/weathericons.constant';
import { ForecastRecord } from '@/lib/forecast/types';
import { useTranslation } from 'react-i18next';
import { ThemeColors, Fonts, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useUnits } from '@/lib/hooks/use-units';
import { conditionBucket, CONDITION_LABEL_KEYS } from '@/lib/forecast/day-parts';


type LocationRowProps = {
  district: City;
  onPress: (forecast: ForecastRecord) => void;
  // Identifies this row within the parent's list. When this row's fetch
  // fails, it renders nothing and instead reports itself (and how to
  // retry it) via onErrorChange, so the parent can show ONE consolidated
  // error card instead of one per failing row.
  id: string;
  onErrorChange?: (id: string, retry: (() => void) | undefined) => void;
  onLoadingChange?: (id: string, loading: boolean) => void;
};
function LocationRow(props: LocationRowProps): JSX.Element | null {
  const { t } = useTranslation();
  const units = useUnits();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { district, onPress, id, onErrorChange, onLoadingChange } = props;
  const [, forecast, error, retry] = useForecast(district.lat, district.lon);

  const today = forecast?.days.find(d => DateTime.fromISO(d.day).hasSame(DateTime.now(), "day"));
  const isError = !!error || (!!forecast && !today);
  const isLoading = !isError && !(forecast && today);

  useEffect(() => {
    onErrorChange?.(id, isError ? retry : undefined);
    // Only the error/OK transition should re-notify the parent — retry
    // and onErrorChange are stable enough in practice (same closure
    // shape every render) that re-running this on every render would
    // just be noise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, id]);

  useEffect(() => {
    onLoadingChange?.(id, isLoading);
    return () => {
      onLoadingChange?.(id, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, id]);

  if (isError) {
    return null;
  }

  if (forecast && today) {
    return (
      <TouchableOpacity style={styles.opacity} onPress={() => onPress(forecast)}>
        <View style={styles.left}>
          <View>
            <Text style={styles.header}>{district.name}</Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.small}>&uarr;{units.temp(today.maxTemperature || 0)}  &darr;{units.temp(today.minTemperature || 0)}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Icon source={weatherIcons[today.weatherSymbol || 'fair_day']} size={90} />
          <Text style={styles.small}>{t(CONDITION_LABEL_KEYS[conditionBucket(today.weatherSymbol)])}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (onLoadingChange) {
    return null;
  }

  return (
    <View style={styles.loadingWrapper}>
      <ActivityIndicator animating={true} color={colors.primary} size='large' />
    </View>
  )
}


const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  // Deliberately no card chrome (border/shadow/background) here, unlike
  // the loaded-row wrapper above — matches the plain floating spinner used
  // for the whole-page loading state on the Today tab, since this is the
  // spinner shown while Favourites/NoLocation's rows are individually loading.
  loadingWrapper: {
    width: '100%',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opacity: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: Spacing.lg,
    paddingRight: Spacing.lg,
    paddingLeft: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 1,
    borderRadius: Radius.large,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  left: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  small: {
    fontSize: 16,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
  },
  smallContainer: {
    marginTop: Spacing.sm,
  },
});

export default React.memo(LocationRow);
