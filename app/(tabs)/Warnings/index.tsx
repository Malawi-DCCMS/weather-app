import React, { useMemo } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter, Href } from 'expo-router';
import { isUndefined } from 'lodash';

import AppBar from '@/components/AppBar';
import AlertCard from '@/components/AlertCard';
import AlertLegend from '@/components/AlertLegend';
import LastUpdatedFooter from '@/components/LastUpdatedFooter';
import StatusCard from '@/components/StatusCard';

import { SCREENS } from '@/lib/layout/constants';
import { useLocationStore } from '@/lib/store/location.store';
import { useAlertsQuery } from '@/lib/hooks/alerts.hook';
import { CAPAlert, alertInLocation } from '@/lib/alerts/providers/cap-alerts/alert';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { ThemeColors, Fonts, navRailWidth, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type AlertSection = { title?: string; data: CAPAlert[] };

// Unlike the small Alerts banner (shown on Today/5 Days/etc., which stays
// location-sensitive), this tab is the canonical list of every valid
// alert the configured feed currently has — no location filtering. It's
// grouped into "Your area" vs "Elsewhere in the country" (when a location
// is set) so a long nationwide list doesn't bury what's actually relevant
// to the user behind everything else.
//
// Rendered via SectionList (not ScrollView + .map()) since this list is
// genuinely unbounded — a widespread severe-weather event is exactly the
// moment it could have a lot of active alerts, and exactly the moment
// this screen matters most.
const WarningsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isXL = useBreakpoint() === 'xl';

  const { data: alerts = [], error: alertsErrorObj, refetch: refetchAlerts } = useAlertsQuery();
  const alertsError = alertsErrorObj?.message;
  const location = useLocationStore(s => s.name);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);
  const hasLocation = !isUndefined(lat) && !isUndefined(lon);

  const yourAreaAlerts = hasLocation ? alerts.filter(alert => alertInLocation(alert, { latitude: lat, longitude: lon })) : [];
  const elsewhereAlerts = hasLocation ? alerts.filter(alert => !alertInLocation(alert, { latitude: lat, longitude: lon })) : alerts;

  const sections: AlertSection[] = hasLocation
    ? [
      ...(yourAreaAlerts.length > 0 ? [{ title: t('warnings.group.yourArea'), data: yourAreaAlerts }] : []),
      ...(elsewhereAlerts.length > 0 ? [{ title: t('warnings.group.elsewhere'), data: elsewhereAlerts }] : []),
    ]
    : (alerts.length > 0 ? [{ data: alerts }] : []);

  const onSelectAlert = (alert: CAPAlert) =>
    router.push({ pathname: SCREENS.WeatherWarning, params: { location, alertID: alert.identifier } } as Href);

  return (
    // No bottom edge: the tab bar already pads for the home indicator, so
    // insetting here too leaves a blank strip above the bar.
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={t("warnings.title")} />
          <SectionList
            sections={sections}
            keyExtractor={(alert, idx) => alert.identifier ?? String(idx)}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            renderSectionHeader={({ section }) =>
              section.title ? <Text style={styles.groupHeader}>{section.title}</Text> : null
            }
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <AlertCard alert={item} compact onPress={() => onSelectAlert(item)} />
              </View>
            )}
            ListHeaderComponent={
              alertsError ? (
                <StatusCard
                  icon="cloud-off-outline"
                  iconColor={colors.danger}
                  title={t('warnings.error.title')}
                  text={alertsError}
                  onRetry={() => refetchAlerts()}
                />
              ) : alerts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon source="shield-check" size={32} color={colors.success} />
                  <Text style={styles.emptyTitle}>{t('warnings.empty.title')}</Text>
                  <Text style={styles.emptyText}>{t('warnings.empty.text')}</Text>
                </View>
              ) : undefined
            }
            ListFooterComponent={
              <>
                <AlertLegend />
                <LastUpdatedFooter />
              </>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WarningsScreen;

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
  cardWrapper: {
    marginBottom: Spacing.lg,
  },
  groupHeader: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textSubtle,
    marginBottom: Spacing.md,
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
  xlPadding: {
    paddingLeft: navRailWidth,
  },
});
