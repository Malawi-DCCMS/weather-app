import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { WARNING_COLORS } from '@/lib/alerts/providers/cap-alerts/icons';
import { ThemeColors, Fonts, Colors, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

// "Green" isn't a real CAP severity in this app's data (only Red/Orange/
// Yellow have icon assets and are commonly issued) — it stands for "no
// warnings right now", which the legend spells out for the traffic-light
// mental model even though it's never a rendered alert band. `success` is
// identical in both palettes, so it's safe to read from the fixed light
// palette here rather than the hook.
const ROWS: { color: string; labelKey: string; descriptionKey: string }[] = [
  { color: WARNING_COLORS.Red, labelKey: 'legend.red.label', descriptionKey: 'legend.red.description' },
  { color: WARNING_COLORS.Orange, labelKey: 'legend.orange.label', descriptionKey: 'legend.orange.description' },
  { color: WARNING_COLORS.Yellow, labelKey: 'legend.yellow.label', descriptionKey: 'legend.yellow.description' },
  { color: Colors.light.success, labelKey: 'legend.green.label', descriptionKey: 'legend.green.description' },
];

function AlertLegend() {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('legend.title')}</Text>
      {ROWS.map(row => (
        <View key={row.labelKey} style={styles.row}>
          <View style={[styles.swatch, { backgroundColor: row.color }]} />
          <View style={styles.textBlock}>
            <Text style={styles.label}>{t(row.labelKey)}</Text>
            <Text style={styles.description}>{t(row.descriptionKey)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    padding: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: Radius.small,
    marginTop: 3,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
    marginTop: 2,
  },
});

export default AlertLegend;
