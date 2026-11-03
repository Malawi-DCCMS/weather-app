import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { useTheme } from "@/lib/hooks/use-theme";
import InfoItem from "@/components/info-item";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
  Radius,
} from "@/lib/theme";

import AppBar from "@/components/AppBar";
import { useTranslation } from "react-i18next";

export default function AboutUsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <AppBar location={t("aboutUs.title")} hideSettings />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* About EMI Section */}
          <ThemedView type="bg" style={[styles.card, { marginTop: 16 }]}>
            <View style={styles.sectionHeaderContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.primary + '26' },
                ]}
              >
                <Ionicons name="business" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t("aboutUs.emi.title")}
              </ThemedText>
            </View>

            <ThemedText
              themeColor="textSubtle"
              type="default"
              style={styles.paragraph}
            >
              {t("aboutUs.emi.description")}
            </ThemedText>

            <InfoItem
              title={t("aboutUs.emi.mission.title")}
              description={t("aboutUs.emi.mission.description")}
              icon="ribbon-outline"
              iconColor={theme.primary}
            />
          </ThemedView>

          {/* Forecast Services Section */}
          <ThemedText
            type="smallBold"
            themeColor="textSubtle"
            style={styles.groupHeader}
          >
            {t("aboutUs.forecastServices.title")}
          </ThemedText>

          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.primary + '26' },
                ]}
              >
                <Ionicons
                  name="thunderstorm-outline"
                  size={22}
                  color={theme.primary}
                />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t("aboutUs.forecastServices.products.title")}
              </ThemedText>
            </View>

            <ThemedText
              themeColor="textSubtle"
              type="default"
              style={styles.paragraph}
            >
              {t("aboutUs.forecastServices.products.description")}
            </ThemedText>

            {/* Nowcast Item */}
            <InfoItem
              title={t("aboutUs.forecastServices.nowcasting.title")}
              description={t("aboutUs.forecastServices.nowcasting.description")}
              icon="time-outline"
              iconColor={theme.primary}
            />

            <View style={[styles.itemSeparator, { backgroundColor: theme.bgMuted }]} />

            {/* Daily Item */}
            <InfoItem
              title={t("aboutUs.forecastServices.daily.title")}
              description={t("aboutUs.forecastServices.daily.description")}
              icon="today-outline"
              iconColor={theme.primary}
            />

            <View style={[styles.itemSeparator, { backgroundColor: theme.bgMuted }]} />

            {/* Seasonal Item */}
            <InfoItem
              title={t("aboutUs.forecastServices.seasonal.title")}
              description={t("aboutUs.forecastServices.seasonal.description")}
              icon="calendar-outline"
              iconColor={theme.primary}
            />
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
    paddingTop: Spacing.md,
    paddingBottom: BottomTabInset + Spacing.xl,
    gap: Spacing.xl,
  },
  groupHeader: {
    marginTop: Spacing.lg,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: 12,
  },
  card: {
    alignSelf: "stretch",
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.xl,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)",
    gap: Spacing.lg,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.small,
    justifyContent: "center",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
  },
  highlightBox: {
    flexDirection: "row",
    borderRadius: Radius.small,
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  itemSeparator: {
    height: 1,
    marginVertical: Spacing.sm,
  },
});
