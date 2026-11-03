import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTime } from "luxon";
import { ActivityIndicator } from 'react-native';
import { useRouter, useNavigation, Href, Redirect } from 'expo-router';
import { isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';

import AppBar from '@/components/AppBar';
import Today from '@/components/Today';
import Alerts from '@/components/Alerts';
import CurrentConditionsCard from '@/components/CurrentConditionsCard';
import DayPartsGrid from '@/components/DayPartsGrid';
import FiveDays from '@/components/FiveDays';
import LastUpdatedFooter from '@/components/LastUpdatedFooter';
import StatusCard from '@/components/StatusCard';

import { SCREENS } from '@/lib/layout/constants';
import { useLocationStore } from '@/lib/store/location.store';
import { useForecastQuery } from '@/lib/hooks/current-forecast.hook';
import { useAlertsQuery } from '@/lib/hooks/alerts.hook';
import { CAPAlert, alertInLocation } from '@/lib/alerts/providers/cap-alerts/alert';
import { useOnboarding } from '@/lib/hooks/onboarding.hook';
import { useOnboardingToggle } from '@/lib/hooks/use-onboarding-toggle';
import { useFavourites } from '@/lib/hooks/favourites.hook';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { getDayParts } from '@/lib/forecast/day-parts';
import { ThemeColors, Fonts, navRailWidth, Spacing, tempSize } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useReviewPrompt } from '@/lib/hooks/use-review';

// Module-level, not component state — persists only for the lifetime of
// the JS process. Resets on a real app relaunch (cold start), but not
// when the user navigates away from and back to Home within the same
// session, which is what makes "always show start page" mean "once per
// launch" rather than "every time you land on Home."
let hasShownStartPageThisLaunch = false;

const MainScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [onboardingLoading, hasOnboarded] = useOnboarding();
  const { alwaysShowOnboarding: alwaysShowStartPage } = useOnboardingToggle();
  const [favouritesLoading, favourites] = useFavourites();
  const breakpoint = useBreakpoint();
  const isXL = breakpoint === 'xl';

  const location = useLocationStore(s => s.name);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);
  const locationLoading = useLocationStore(s => s.loading);
  const locationError = useLocationStore(s => s.error);
  const getPreciseLocation = useLocationStore(s => s.getPreciseLocation);
  const resetLocationError = useLocationStore(s => s.resetError);
  const { data: forecast, isLoading: loading, error: forecastErrorObj, refetch: refetchForecast, dataUpdatedAt: forecastUpdatedAt } = useForecastQuery(lat, lon);
  const forecastError = forecastErrorObj?.message;
  const { data: alerts = [], refetch: refetchAlerts } = useAlertsQuery();
  const [refreshing, setRefreshing] = React.useState(false);

  // Whether to force Welcome, decided ONCE per mount as real state rather
  // than re-derived every render from onboarding/alwaysShow — onboarding/
  // alwaysShow resolve synchronously from storage, but GPS location
  // resolution is still async, and re-deriving "should show welcome" fresh
  // on every render meant the locationError-triggered re-render that
  // follows could see a freshly-mutated hasShownStartPageThisLaunch and
  // flip the decision to false before the Redirect ever actually took
  // hold — silently cancelling it. Storing the decision in state makes it
  // stick for the lifetime of this mount once made.
  const [welcomeDecision, setWelcomeDecision] = React.useState<'pending' | 'show' | 'skip'>('pending');

  useEffect(() => {
    if (onboardingLoading) return;
    if (!hasOnboarded) {
      setWelcomeDecision('show');
    } else if (alwaysShowStartPage && !hasShownStartPageThisLaunch) {
      hasShownStartPageThisLaunch = true;
      setWelcomeDecision('show');
    } else {
      setWelcomeDecision('skip');
    }
  }, [onboardingLoading, hasOnboarded, alwaysShowStartPage]);

  const onRefresh = async () => {
    if (isUndefined(lat) || isUndefined(lon)) {
      return;
    }

    setRefreshing(true);
    await Promise.all([refetchForecast(), refetchAlerts()]);
    setRefreshing(false);
  };

  const onTryAgain = () => {
    if (isUndefined(lat) || isUndefined(lon)) {
      return;
    }

    refetchForecast();
    refetchAlerts();
  }

  // Get GPS location after first(empty)render.
  useEffect(() => {
    if (isUndefined(lat) || isUndefined(lon)) {
      getPreciseLocation();
    }
  }, []);

  // If GPS/location resolution fails, send the user to their saved
  // favourite places instead of the generic city list, when they have any.
  // Waits until welcomeDecision has settled, and skips entirely when it's
  // 'show', so this can't race a forced Welcome redirect for the same
  // navigation.
  useEffect(() => {
    if (welcomeDecision !== 'skip') return;
    if (locationError && !navigation.canGoBack() && !favouritesLoading) {
      resetLocationError();
      router.replace((favourites.length > 0 ? SCREENS.Favourites : SCREENS.NoLocation).toString() as Href);
    }
  }, [locationError, favouritesLoading, favourites, welcomeDecision]);

  // Store review prompt: only after a fresh forecast has loaded on this
  // screen, and never while a warning covers the user's location.
  const hasActiveWarning = !!lat && !!lon && alerts.some(alert => alertInLocation(alert, { latitude: lat, longitude: lon }));
  useReviewPrompt({
    enabled: welcomeDecision === 'skip',
    hasForecast: !!forecast && !forecastErrorObj,
    forecastUpdatedAt,
    hasActiveWarning,
  });

  if (welcomeDecision === 'pending') {
    return null;
  }

  if (welcomeDecision === 'show') {
    return <Redirect href="/Welcome" />;
  }

  const today = DateTime.now();
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
    });

  let relevantAlerts: CAPAlert[] = [];
  if (lat && lon) {
    relevantAlerts = alerts.filter(alert => alertInLocation(alert, { latitude: lat, longitude: lon }));
  }

  // empty page as default content
  let mainContent: React.JSX.Element = (
    <View style={styles.opacity}>
    </View>
  )

  if (loading || locationLoading) {
    mainContent = (
      <View style={styles.opacity}>
        <TouchableOpacity onPress={() => { }}>
          <View style={styles.loader}>
            <ActivityIndicator animating={true} color={colors.primary} size='large' />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  // Reachable whenever this screen renders with no coordinates and nothing
  // in flight — e.g. GPS was denied and the user tab-navigated here
  // directly instead of picking a place on NoLocation/Favourites.
  if (!loading && !locationLoading && (isUndefined(lat) || isUndefined(lon))) {
    mainContent = (
      <StatusCard
        icon="map-marker-off-outline"
        title={t('location.notSet.title')}
        text={t('location.notSet.text')}
        actionLabel={t('location.notSet.action')}
        onRetry={() => router.push(SCREENS.Search.toString() as Href)}
      />
    )
  }

  if (forecast) {
    const todaySummary = forecast.days.find(d => DateTime.fromISO(d.day).hasSame(today, "day"));

    if (isXL && todaySummary) {
      mainContent = (
        <View style={styles.xlRow}>
          <View style={styles.xlLeftPane}>
            <Alerts lat={lat} lon={lon} location={location} />
            <CurrentConditionsCard daySummary={todaySummary} location={location} tempFontSize={tempSize.xl} showWindSummary />
          </View>
          <View style={styles.xlRightPane}>
            <DayPartsGrid dayParts={getDayParts(todaySummary)} columns={4} />
            <View style={styles.xlFiveDaysSection}>
              <Text style={styles.xlSectionHeader}>{t("time.nextFiveDays")}</Text>
              <FiveDays name={location} startDate={today.plus({ days: 1 })} forecast={forecast} onClick={onSelectDay} alerts={relevantAlerts} onSelectAlert={onSelectAlert} />
            </View>
          </View>
        </View>
      )
    } else {
      mainContent = (
        <View style={styles.opacity}>
          <Today daySummary={todaySummary} location={location} tempFontSize={tempSize[breakpoint]} compact={breakpoint === 'small'} />
        </View>
      )
    }
  }

  if (forecastError) {
    mainContent = (
      <StatusCard
        icon="cloud-off-outline"
        iconColor={colors.danger}
        title={t('forecast.error.title')}
        text={forecastError}
        onRetry={onTryAgain}
      />
    )
  }

  return (
    // No bottom edge: the tab bar already pads for the home indicator, so
    // insetting here too leaves a blank strip above the bar.
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={location} isPlace />
          {!isXL && relevantAlerts.length > 0 &&
            <View style={styles.alertsWrapper}>
              <Alerts lat={lat} lon={lon} location={location} />
            </View>
          }
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} snapToStart={false} accessible={true} accessibilityLabel='Landing page' refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }>
            <View style={styles.contentWrapper}>
              {mainContent}
              <LastUpdatedFooter />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MainScreen;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: colors.bgAlt,
  },
  bg: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    paddingRight: Spacing.lg,
    paddingLeft: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  alertsWrapper: {
    paddingRight: Spacing.lg,
    paddingLeft: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  opacity: {},
  loader: {
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xxxl,
  },
  xlRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xl,
  },
  xlLeftPane: {
    flex: 1,
  },
  xlRightPane: {
    flex: 1.3,
  },
  xlFiveDaysSection: {
    marginTop: Spacing.xl,
  },
  xlSectionHeader: {
    fontSize: 20,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    marginBottom: Spacing.sm,
  },
  xlPadding: {
    paddingLeft: navRailWidth,
  },
});
