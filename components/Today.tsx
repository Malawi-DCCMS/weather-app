import React, { JSX, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { ForecastDayRecord } from '@/lib/forecast/types';
import { getDayParts } from '@/lib/forecast/day-parts';
import CurrentConditionsCard from './CurrentConditionsCard';
import DayPartsGrid from './DayPartsGrid';
import FiveHourSummary from './FiveHourSummary';
import { ThemeColors, Fonts, Spacing, tempSize } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type TodaysForecastProps = {
  daySummary: ForecastDayRecord | undefined;
  location: string;
  tempFontSize?: number;
  // Small breakpoint (<360dp) — tighter margins to fit entry-level phones.
  compact?: boolean;
};

// The single-column (phone) composition of Today's screen. The XL/tablet
// two-pane layout is assembled directly in app/(tabs)/index.tsx from the
// same CurrentConditionsCard/DayPartsGrid pieces, since it needs different
// grouping (conditions+wind on the left, day-parts+5-day list on the right).
function Today({ daySummary, location, tempFontSize = tempSize.large, compact }: TodaysForecastProps): JSX.Element {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!daySummary) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.todaysHeader}>{t("forecast.states.unavailable")}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
      <CurrentConditionsCard daySummary={daySummary} location={location} tempFontSize={tempFontSize} compact={compact} />
      <DayPartsGrid dayParts={getDayParts(daySummary)} columns={2} />
      <FiveHourSummary daySummary={daySummary} location={location} />
    </View>
  );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  // Negative margin paired with equal padding expands the ViewGroup bounds
  // so Android does not clip child card elevation shadows on any side while
  // keeping exact layout alignment with app/(tabs)/index.tsx's contentWrapper.
  wrapper: {
    marginTop: 0,
  },
  wrapperCompact: {
    marginTop: 0,
  },
  todaysHeader: {
    fontSize: 20,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
});

export default Today;
