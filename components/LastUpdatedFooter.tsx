import React, { JSX, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { useLocationStore } from '@/lib/store/location.store';
import { useForecastQuery } from '@/lib/hooks/current-forecast.hook';
import { APP_TIMEZONE } from '@/config';
import { ThemeColors, Fonts, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

// Shown at the bottom of Today, Five Days, Alerts and Favourites — a single,
// app-wide "how fresh is this data" indicator tied to the last time the
// current location's forecast query actually received data, not to
// whatever's currently rendered on screen. Reads the same query cache entry
// Today/5 Days/Hourly populate, so it reflects whichever of them fetched
// most recently. Renders nothing until the first successful fetch.
function LastUpdatedFooter(): JSX.Element | null {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);
  const { dataUpdatedAt } = useForecastQuery(lat, lon);

  if (!dataUpdatedAt) {
    return null;
  }

  const time = DateTime.fromMillis(dataUpdatedAt).setZone(APP_TIMEZONE).toFormat('yyyy-MM-dd h:mm a');

  return (
    <Text style={styles.footer}>{t('forecast.lastUpdated', { time })}</Text>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  footer: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
});

export default LastUpdatedFooter;
