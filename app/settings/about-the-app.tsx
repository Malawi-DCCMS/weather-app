import React, { JSX } from 'react';
import { StyleSheet, View, Linking, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { useTheme } from "@/lib/hooks/use-theme";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
  Radius,
} from "@/lib/theme";

import AppBar from "@/components/AppBar";
import { useTranslation } from "react-i18next";

const PARTNERS = [
  'Norwegian Meteorological Institute',
  'NORAD',
  'NORCAP',
  'World Meteorological Organisation',
  'Save the Children',
];

export default function AboutTheAppScreen(): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  const onClickURL = (url: string) => Linking.openURL(url);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <AppBar location={t("aboutApp.title")} hideSettings />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Main About the App Section */}
          <ThemedView type="bg" style={[styles.card, { marginTop: 16 }]}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="information-circle-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('aboutApp.forecasts.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('aboutApp.forecasts.description')}
            </ThemedText>
          </ThemedView>

          {/* Partners Section */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="people-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t("aboutApp.partners")}
              </ThemedText>
            </View>
            <View style={styles.partnersList}>
              {PARTNERS.map((partner) => (
                <View key={partner} style={styles.partnerItem}>
                  <Ionicons name="ellipse" size={6} color={theme.textSubtle} style={styles.bullet} />
                  <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
                    {partner}
                  </ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>

          {/* Icons Section */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="images-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t("aboutApp.icons")}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t("icons.disclaimer")}{' '}
              <ThemedText 
                type="default" 
                style={[styles.link, { color: theme.primary }]}
                onPress={() => onClickURL('https://yr.no/NRK')}
              >
                yr.no/NRK
              </ThemedText>.
              {'\n\n'}
              {t('warning.icons.disclaimer')}
            </ThemedText>
          </ThemedView>

          {/* Geographical Data Section */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="map-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t("aboutApp.geographicalData")}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('geographical.data.disclaimer')}{' '}
              <ThemedText 
                type="default" 
                style={[styles.link, { color: theme.primary }]}
                onPress={() => onClickURL('https://download.geonames.org/export/dump/MW.zip')}
              >
                Geonames
              </ThemedText>.
            </ThemedText>
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
    gap: Spacing.md,
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
  link: {
    textDecorationLine: 'underline',
  },
  partnersList: {
    gap: Spacing.sm,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bullet: {
    marginTop: 2,
  },
});
