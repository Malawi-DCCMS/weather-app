import React, { JSX, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

import AppBar from '@/components/AppBar';
import Alerts from '@/components/Alerts';

import { useLocationStore } from '@/lib/store/location.store';
import { useTranslation } from 'react-i18next';
import { ThemeColors, Fonts, Spacing, Radius } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

function AboutUsScreen(): JSX.Element {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const lat = useLocationStore(s => s.lat);
  const lon = useLocationStore(s => s.lon);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <View style={styles.bg}>
          <AppBar location={t("aboutUs.title")} />
          <Alerts lat={lat} lon={lon} location={"About us"} />
          <View style={styles.container}>
            <View style={styles.opacity}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                  <View style={styles.card}>
                    <Text variant="bodyMedium">
                      <Text style={styles.title}>
                        {t("placeholders.appTitle")}
                      </Text>{"\n"}
                    </Text>
                    <Text variant="bodyMedium">
                      <Text style={styles.whiteHeader}>{t('how.we.started')}</Text>{"\n"}
                      <Text style={styles.whiteText}>
                        {t('how.we.started.desc')}
                      </Text>
                    </Text>
                    <Text variant="bodyMedium" style={{ marginTop: Spacing.xl }}>
                      <Text style={styles.whiteHeader}>{t('our.mandate')}</Text>{"\n"}
                      <Text style={styles.whiteText}>
                        {t('our.mandate.desc')}
                      </Text>
                    </Text>
                    <Text variant="bodyMedium" style={{ marginTop: Spacing.xl }}>
                      <Text style={styles.whiteHeader}>{t('our.mission')}</Text>{"\n"}
                      <Text style={styles.whiteText}>
                        {t('our.mission.desc')}
                      </Text>
                    </Text>
                    <Text variant="bodyMedium" style={{ marginTop: Spacing.xl }}>
                      <Text style={styles.whiteHeader}>{t('our.vision')}</Text>{"\n"}
                      <Text style={styles.whiteText}>
                        {t('our.vision.desc')}
                      </Text>
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  opacity: {
    flexDirection: 'column',
    flex: 1,
  },
  whiteHeader: {
    color: colors.textStrong,
    fontSize: 18,
    fontFamily: Fonts.sans.bold,
  },
  whiteText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.sans.regular,
  },
  title: {
    color: colors.textStrong,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.sans.bold,
  },
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    padding: Spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
});

export default AboutUsScreen;
