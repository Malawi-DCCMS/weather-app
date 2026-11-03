import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTime } from 'luxon';
import { useRouter, Href } from 'expo-router';
import { isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';

import AppBar from '@/components/AppBar';
import FiveDays from '@/components/FiveDays';
import LastUpdatedFooter from '@/components/LastUpdatedFooter';
import StatusCard from '@/components/StatusCard';

import { useLocationStore } from '@/lib/store/location.store';
import { SCREENS } from '@/lib/layout/constants';
import { useForecastQuery } from '@/lib/hooks/current-forecast.hook';
import { useAlertsQuery } from '@/lib/hooks/alerts.hook';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { CAPAlert, alertInLocation } from '@/lib/alerts/providers/cap-alerts/alert';
import { ThemeColors, Fonts, navRailWidth, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import Alerts from '@/components/Alerts';

const FiveDaysScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isXL = useBreakpoint() === 'xl';

  const location = useLocationStore(s => s.name);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);
  const { data: forecast, error: forecastErrorObj, refetch: refetchForecast } = useForecastQuery(lat, lon);
  const forecastError = forecastErrorObj?.message;
  const { data: alerts = [], refetch: refetchAlerts } = useAlertsQuery();
  const hasLocation = !isUndefined(lat) && !isUndefined(lon);

  const onRetry = () => {
    if (isUndefined(lat) || isUndefined(lon)) return;
    refetchForecast();
    refetchAlerts();
  };

  const today = DateTime.now();

  let relevantAlerts: CAPAlert[] = [];
  if (lat && lon) {
    relevantAlerts = alerts.filter(alert => alertInLocation(alert, { latitude: lat, longitude: lon }));
  }

  const onSelectDay = (day: DateTime) =>
    router.push({
      pathname: SCREENS.Hourly, params: {
        location: location,
        dayString: day.toISO(),
        startAtCurrentTime: "no",
        title: day.toLocaleString({ weekday: 'long' })
      }
    });

  const onSelectAlert = (alert: CAPAlert) =>
    router.push({
      pathname: SCREENS.WeatherWarning, params: { location, alertID: alert.identifier }
    } as Href);

  return (
    // No bottom edge: the tab bar already pads for the home indicator, so
    // insetting here too leaves a blank strip above the bar.
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={t("time.nextFiveDays")} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {!hasLocation ? (
              <View style={styles.alertsWrapper}>
                <StatusCard
                  icon="map-marker-off-outline"
                  title={t('location.notSet.title')}
                  text={t('location.notSet.text')}
                  actionLabel={t('location.notSet.action')}
                  onRetry={() => router.push(SCREENS.Search.toString() as Href)}
                />
              </View>
            ) : forecastError ? (
              <View style={styles.alertsWrapper}>
                <StatusCard
                  icon="cloud-off-outline"
                  iconColor={colors.danger}
                  title={t('forecast.error.title')}
                  text={forecastError}
                  onRetry={onRetry}
                />
              </View>
            ) : (
              <>
                <View style={styles.alertsWrapper}>
                  <Alerts lat={lat} lon={lon} location={location} />
                </View>
                <FiveDays name={location} startDate={today.plus({ days: 1 })} forecast={forecast} onClick={onSelectDay} alerts={relevantAlerts} onSelectAlert={onSelectAlert} />
              </>
            )}
            {/* Same side insets as the day cards, so the text spans the
                card width and wraps instead of running edge to edge. */}
            <View style={styles.footerWrapper}>
              <LastUpdatedFooter />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FiveDaysScreen;

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
  footnote: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  footerWrapper: {
    marginLeft: Spacing.xl,
    marginRight: Spacing.xl,
  },
  alertsWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  xlPadding: {
    paddingLeft: navRailWidth,
  },
});
