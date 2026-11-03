import { Alert, StyleSheet, View, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import SettingItem from "@/components/setting-item";
import { BottomTabInset, MaxContentWidth, Spacing, Radius } from "@/lib/theme";
import { useTheme } from "@/lib/hooks/use-theme";
import { useThemeToggle } from "@/lib/hooks/use-theme-toggle";
import { useLanguage } from "@/lib/hooks/use-language";
import { useUnitsStore } from "@/lib/store/units-store";
import { TEMPERATURE_SYMBOLS, WIND_SYMBOLS, PRECIPITATION_SYMBOLS } from "@/lib/units";
import AppBar from "@/components/AppBar";
import { useTranslation } from "react-i18next";
import { useOnboardingToggle } from "@/lib/hooks/use-onboarding-toggle";
import { openReviewPage, resetReviewState, reviewPageUrl } from "@/lib/review";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { isDarkMode, setIsDarkMode } = useThemeToggle();
  const { currentLanguage } = useLanguage();
  const temperatureUnit = useUnitsStore((s) => s.temperature);
  const windUnit = useUnitsStore((s) => s.wind);
  const precipitationUnit = useUnitsStore((s) => s.precipitation);
  const { alwaysShowOnboarding, setAlwaysShowOnboarding } = useOnboardingToggle();
  const theme = useTheme();
  const router = useRouter();
  // Hidden until the store links are set in app.json.
  const canRateApp = reviewPageUrl() !== null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <AppBar location={t("settings.title")} hideSettings />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >

          {/* Preferences Section */}
          <ThemedText
            type="smallBold"
            themeColor="textSubtle"
            style={styles.sectionHeader}
          >
            {t("settings.sections.preferences")}
          </ThemedText>

          <ThemedView type="bg" style={styles.card}>
            {/* Dark Mode Row */}
            <SettingItem
              label={t("settings.preferences.appearance.darkMode")}
              leftIcon="moon"
              leftIconColor="#f9ab00"
              leftIconBgColor="rgba(249, 171, 0, 0.15)"
              showChevron={false}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={(value) => setIsDarkMode(value)}
                  trackColor={{
                    false: theme.bgMuted,
                    true: "#34c759",
                  }}
                  thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                />
              }
            />

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.bgMuted },
              ]}
            />

            {/* Language Row */}
            <SettingItem
              label={t("settings.language.title")}
              leftIcon="language"
              leftIconColor="#1a73e8"
              leftIconBgColor="rgba(26, 115, 232, 0.15)"
              rightText={currentLanguage.nativeName}
              onPress={() => router.push("/settings/language")}
            />

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.bgMuted },
              ]}
            />

            {/* Units Row */}
            <SettingItem
              label={t("units.title")}
              leftIcon="speedometer"
              leftIconColor="#0b8043"
              leftIconBgColor="rgba(11, 128, 67, 0.15)"
              rightText={`${TEMPERATURE_SYMBOLS[temperatureUnit]} · ${WIND_SYMBOLS[windUnit]} · ${PRECIPITATION_SYMBOLS[precipitationUnit]}`}
              onPress={() => router.push("/settings/units" as Href)}
            />

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.bgMuted },
              ]}
            />

            {/* Onboarding Toggle Row */}
            <SettingItem
              label={t("settings.preferences.showOnboarding")}
              leftIcon="flag"
              leftIconColor={theme.primary}
              leftIconBgColor={theme.primary + "26"}
              showChevron={false}
              rightElement={
                <Switch
                  value={alwaysShowOnboarding}
                  onValueChange={(value) => setAlwaysShowOnboarding(value)}
                  trackColor={{
                    false: theme.bgMuted,
                    true: "#34c759",
                  }}
                  thumbColor={alwaysShowOnboarding ? "#fff" : "#f4f3f4"}
                />
              }
            />
          </ThemedView>

          {/* About Section */}
          <ThemedText
            type="smallBold"
            themeColor="textSubtle"
            style={styles.sectionHeader}
          >
            {t("settings.sections.about")}
          </ThemedText>

          <ThemedView type="bg" style={styles.card}>
            {/* About EMI Row */}
            <SettingItem
              label={t("aboutUs.title")}
              leftIcon="business"
              leftIconColor="#0B2C54"
              leftIconBgColor="rgba(11, 44, 84, 0.15)"
              onPress={() => router.push("/settings/about-us")}
            />

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.bgMuted },
              ]}
            />

            {/* About the App Row */}
            <SettingItem
              label={t("aboutApp.title")}
              leftIcon="information-circle"
              leftIconColor="#1a73e8"
              leftIconBgColor="rgba(26, 115, 232, 0.15)"
              onPress={() => router.push("/settings/about-the-app")}
            />

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.bgMuted },
              ]}
            />

            {/* Privacy Row */}
            <SettingItem
              label={t("privacy.title")}
              leftIcon="shield-checkmark"
              leftIconColor="#c5221f"
              leftIconBgColor="rgba(197, 34, 31, 0.15)"
              onPress={() => router.push("/settings/privacy-policy")}
            />

            {canRateApp && (
              <>
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: theme.bgMuted },
                  ]}
                />

                {/* Rate App Row: always-available route to the store's review
                    page, alongside the occasional automatic prompt. */}
                <SettingItem
                  label={t("settings.rateApp")}
                  leftIcon="star"
                  leftIconColor="#f9ab00"
                  leftIconBgColor="rgba(249, 171, 0, 0.15)"
                  onPress={() => openReviewPage()}
                />
              </>
            )}

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.bgMuted },
              ]}
            />

            {/* App Version Row */}
            <SettingItem
              label={t("settings.about.appVersion")}
              leftIcon="information-circle"
              leftIconColor="#5f6368"
              leftIconBgColor="rgba(95, 99, 104, 0.15)"
              rightText="1.0.0 (Build 42)"
              showChevron={false}
            />

            {__DEV__ && (
              <>
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: theme.bgMuted },
                  ]}
                />

                {/* Development builds only: start the review-prompt
                    counters over, for testing the prompt timing. */}
                <SettingItem
                  label="Reset review prompt (dev)"
                  leftIcon="refresh"
                  leftIconColor="#5f6368"
                  leftIconBgColor="rgba(95, 99, 104, 0.15)"
                  showChevron={false}
                  onPress={() => {
                    resetReviewState();
                    Alert.alert("Review prompt reset", "Counters cleared. Reopen the app to start counting again.");
                  }}
                />
              </>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: BottomTabInset + Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: 12,
  },
  card: {
    alignSelf: "stretch",
    borderRadius: Radius.large,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)",
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
