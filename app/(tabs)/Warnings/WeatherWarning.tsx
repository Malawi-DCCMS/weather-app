import React, { JSX, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import AppBar from '@/components/AppBar';
import AlertCard from '@/components/AlertCard';

import { useAlertsQuery } from '@/lib/hooks/alerts.hook';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { ThemeColors, Fonts, navRailWidth, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import AlertLegend from '@/components/AlertLegend';

function WeatherWarningScreen(): JSX.Element {
  const { t } = useTranslation();
  const { location, alertID } = useLocalSearchParams<{ location: string, alertID: string }>()
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isXL = useBreakpoint() === 'xl';

  const { data: alerts = [] } = useAlertsQuery();
  const alert = alerts.find(alert => alert.identifier === alertID)

  return (
    // Lives in the Alerts tab's stack: no bottom edge (the tab bar pads for
    // the home indicator) and room for the nav rail at XL, like the tabs.
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={location} />
          {alert ? (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              <AlertCard alert={alert} />
              <View style={{ marginBottom: 14 }}></View>
              <AlertLegend />
            </ScrollView>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={styles.whiteText}>{t('alert.missing')}</Text>
            </View>
          )}
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
    backgroundColor: colors.bgAlt,
  },
  bg: {
    height: '100%',
    backgroundColor: colors.bgAlt,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 0,
    padding: Spacing.lg,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  xlPadding: {
    paddingLeft: navRailWidth,
  },
  whiteText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: Fonts.sans.regular,
  },
});

export default WeatherWarningScreen;
