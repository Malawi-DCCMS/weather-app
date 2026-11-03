import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTime } from "luxon";
import { useIsFocused, useLocalSearchParams, useNavigation, usePreventRemove, useRouter, Href } from 'expo-router';

import AppBar from '@/components/AppBar';
import HourlyTable from '@/components/HourlyTable';
import Alerts from '@/components/Alerts';

import { SCREENS } from '@/lib/layout/constants';
import { useLocationStore } from '@/lib/store/location.store';
import { useForecastQuery } from '@/lib/hooks/current-forecast.hook';
import { ForecastDayRecord } from '@/lib/forecast/types';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { ThemeColors, Fonts, navRailWidth, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

function HourlyScreen(): JSX.Element {
  const { location: location_name, dayString, startAtCurrentTime, title } =
          useLocalSearchParams<{location: string, dayString: string, startAtCurrentTime: string, title: string}>()

  const navigation = useNavigation();
  const router = useRouter();
  const isFocused = useIsFocused();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isXL = useBreakpoint() === 'xl';
  const store_location_name = useLocationStore(s => s.name);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);
  const { data: forecast } = useForecastQuery(lat, lon);

  const resetFiveDaysStack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof (navigation as any).dispatch === 'function') {
      (navigation as any).dispatch({ type: 'RESET', payload: { index: 0, routes: [{ name: 'index' }] } });
    }
  }, [navigation]);

  // When opened from Today, this screen leaves either back to Today (back
  // button, hardware back, swipe-back) or by resetting the Five Days stack
  // when another tab is picked. Swipe-back and other stack pops are blocked
  // and redirected to Today; setting `exit` lifts the block, and the effect
  // below navigates once it's lifted so our own pop isn't intercepted.
  const [exit, setExit] = useState<'today' | 'reset' | null>(null);
  usePreventRemove(startAtCurrentTime === 'yes' && isFocused && exit === null, ({ data, repeat }) => {
    if (data.action.type === 'GO_BACK' || data.action.type === 'POP') {
      setExit('today');
    } else {
      repeat();
    }
  });

  useEffect(() => {
    if (exit === null) return;
    resetFiveDaysStack();
    if (exit === 'today') {
      router.navigate(SCREENS.Home as Href);
    }
  }, [exit, resetFiveDaysStack, router]);

  const handleBack = useCallback(() => {
    if (startAtCurrentTime === 'yes') {
      setExit('today');
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/FiveDays' as Href);
    }
  }, [navigation, router, startAtCurrentTime]);

  // When opened from Today's "Today, hour by hour" card (startAtCurrentTime === "yes"):
  // 1. Hardware back / swipe-back returns to Today instead of landing on Five Days.
  // 2. Switching to another tab resets the Five Days stack in the background
  //    so Five Days isn't left showing Today's hourly view.
  useEffect(() => {
    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (typeof (navigation as any).isFocused === 'function' && !(navigation as any).isFocused()) {
        return false;
      }
      handleBack();
      return true;
    });

    if (startAtCurrentTime !== 'yes') {
      return () => backSub.remove();
    }

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setExit((current) => current ?? 'reset');
    });
    return () => {
      backSub.remove();
      unsubscribeBlur();
    };
  }, [handleBack, navigation, startAtCurrentTime]);

  let daySummary: ForecastDayRecord | undefined = undefined;
  if (forecast && dayString && location_name === store_location_name) {
    const day = DateTime.fromISO(dayString);
    const dayRecord = forecast.days.find(d => DateTime.fromISO(d.day).hasSame(day, "day"));

    if (dayRecord) {
      if (startAtCurrentTime === "yes") {
        const nowISO = DateTime.now().toISO()!;
        daySummary = { ...dayRecord, steps: dayRecord.steps.filter(s => s.time > nowISO) };
      } else {
        daySummary = dayRecord;
      }
    }
  }

  let mainContent: React.JSX.Element = <View style={styles.wrapper} />;

  if (daySummary) {
    mainContent = (
      <HourlyTable daySummary={daySummary} day={DateTime.fromISO(daySummary.day)} title={title} />
    );
  } else {
    mainContent = (
      <Text style={{ color: colors.text, fontFamily: Fonts.sans.regular, fontSize: 16, padding: 40 }}>Something unforseen has happened and the forecast table can not be presented. Go back and please try again later!</Text>
    );
  }

  return (
    // Lives in the Five Days tab's stack: no bottom edge (the tab bar pads
    // for the home indicator) and room for the nav rail at XL, like the tabs.
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={location_name} onBack={handleBack} />
          <View style={styles.alertsWrapper}>
            <Alerts lat={lat} lon={lon} location={location_name} />
          </View>
          {mainContent}
        </View>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
    overflow: 'scroll',
    backgroundColor: colors.bgAlt,
  },
  bg: {
    height: '100%',
    backgroundColor: colors.bgAlt,
  },
  xlPadding: {
    paddingLeft: navRailWidth,
  },
  alertsWrapper: {
    marginLeft: Spacing.lg,
    marginRight: Spacing.lg,
    marginTop: Spacing.lg,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
});

export default HourlyScreen;
