import React, { JSX, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SystemBars } from '@/components/SystemBars';
import { Icon, Text, Menu, Button } from 'react-native-paper';
import { useRouter, Redirect, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';

import { LANGUAGES, LanguageKey } from '@/lib/localization/translations';
import { SCREENS } from '@/lib/layout/constants';
import { useOnboarding } from '@/lib/hooks/onboarding.hook';
import { useOnboardingToggle } from '@/lib/hooks/use-onboarding-toggle';
import { useLanguage } from '@/lib/hooks/use-language';
// Fixed to the light palette, not the active theme: Welcome always renders
// its own dark-navy hero (see SystemBars override below) regardless of the
// user's in-app dark-mode setting — the design brief keeps this colored
// hero screen as-is in both themes.
import { Fonts, Colors, Radius, Spacing, touchTarget } from '@/lib/theme';

const colors = Colors.light;
const appName = Constants.expoConfig?.name ?? 'Weather App';

function WelcomeScreen(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const [onboardingLoading, hasOnboarded] = useOnboarding();
  const { alwaysShowOnboarding: alwaysShowStartPage } = useOnboardingToggle();

  const { languageCode: selectedLang, setLanguageCode: onSelectLanguage } = useLanguage();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Language is chosen here; favourite places are chosen on the next
  // onboarding step (OnboardingPlaces), which is the one that actually
  // marks onboarding complete. Uses replace (not push) so this screen
  // doesn't linger in history underneath Home once onboarding finishes.
  const onNext = () => {
    router.replace(SCREENS.OnboardingPlaces.toString() as Href);
  };

  // Guards against reaching this screen once onboarding is already done —
  // e.g. a stale back-navigation entry, or a direct/deep link to /Welcome.
  // Only index.tsx is allowed to legitimately land a fully-onboarded user
  // here, and only when "Always Show Start Page" is on; that case must
  // still render normally, so it's explicitly excluded.
  if (!onboardingLoading && hasOnboarded && !alwaysShowStartPage) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Always-dark navy background needs light status/nav bar icons,
          overriding the root layout's theme-driven default. */}
      <SystemBars style="light" />

      <View style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={styles.languageSelector}>
              <Icon source="earth" size={20} color={colors.textInverse} />
              <Text style={styles.languageSelectorText}>
                {LANGUAGES[selectedLang as LanguageKey]?.nativeName || LANGUAGES[selectedLang as LanguageKey]?.label || 'English'}
              </Text>
              <Icon source="chevron-down" size={20} color={colors.textInverse} />
            </TouchableOpacity>
          }
        >
          {(Object.keys(LANGUAGES) as LanguageKey[]).map(key => (
            <Menu.Item
              key={key}
              onPress={() => {
                onSelectLanguage(key);
                closeMenu();
              }}
              title={LANGUAGES[key].nativeName || LANGUAGES[key].label}
              leadingIcon={selectedLang === key ? "check" : undefined}
            />
          ))}
        </Menu>
      </View>

      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Icon source="weather-partly-cloudy" size={44} color={colors.bgOverlay} />
        </View>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={onNext} accessibilityLabel={t('welcome.next')}>
          <Text style={styles.getStartedText}>{t('welcome.next')}</Text>
          <Icon source="arrow-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.bgOverlay,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: Radius.extraLarge,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.sans.bold,
    color: colors.textInverse,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.sans.regular,
    color: colors.textInverse,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    zIndex: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  languageSelectorText: {
    color: colors.textInverse,
    fontFamily: Fonts.sans.bold,
    fontSize: 14,
  },
  footer: {
    padding: Spacing.xl,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    minHeight: touchTarget.nav,
    borderRadius: Radius.medium,
    backgroundColor: colors.bg,
  },
  getStartedText: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.primary,
  },
});
