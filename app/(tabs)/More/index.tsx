import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';

import AppBar from '@/components/AppBar';
import MoreCard from '@/components/MoreCard';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { useTheme } from '@/lib/hooks/use-theme';
import { SCREENS } from '@/lib/layout/constants';
import { ThemeColors, Fonts, navRailWidth, Spacing } from '@/lib/theme';

// "More conditions" — landing page of the More tab. Favourites stays the
// first card; further conditions (and country-specific cards) go below it.
export default function MoreConditionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isXL = useBreakpoint() === 'xl';

  return (
    <SafeAreaView style={[styles.wrapper, isXL && styles.xlPadding]} edges={['top', 'left', 'right']}>
      {/* Top-level tab: no back arrow even when tab history exists. */}
      <AppBar location={t('More conditions')} titleIcon="map-marker" hideBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>{t('more.intro')}</Text>
        <View style={styles.cards}>
          <MoreCard
            testID="more-favourites"
            icon="star"
            title={t('Favourites')}
            description={t('more.favourites.description')}
            onPress={() => router.push(SCREENS.Favourites.toString() as Href)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  intro: {
    fontSize: 16,
    fontFamily: Fonts.sans.regular,
    color: colors.textSubtle,
    marginBottom: Spacing.lg,
  },
  cards: {
    gap: 10,
  },
  xlPadding: {
    paddingLeft: navRailWidth,
  },
});
