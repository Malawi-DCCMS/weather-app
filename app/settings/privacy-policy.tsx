import React, { JSX } from 'react';
import { StyleSheet, View, ScrollView } from "react-native";
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

export default function PrivacyPolicyScreen(): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <AppBar location={t("privacy.title")} hideSettings />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Overview / Intro */}
          <ThemedView type="bg" style={[styles.card, { marginTop: 16 }]}>
            <View style={styles.sectionHeaderContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.primary + '26' },
                ]}
              >
                <Ionicons name="information-circle-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t("privacy.title")}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.intro')}
            </ThemedText>
          </ThemedView>

          {/* Data Collected */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="server-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.dataCollected.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.dataCollected.text')}
            </ThemedText>
          </ThemedView>

          {/* Location */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="location-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.location.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.location.text')}
            </ThemedText>
          </ThemedView>

          {/* Favourites */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="star-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.favourites.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.favourites.text')}
            </ThemedText>
          </ThemedView>

          {/* Security */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="lock-closed-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.security.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.security.text')}
            </ThemedText>
          </ThemedView>

          {/* Children's Privacy */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="people-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.children.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.children.text')}
            </ThemedText>
          </ThemedView>

          {/* Third-Party Services */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="link-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.thirdParty.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.thirdParty.text')}
            </ThemedText>
          </ThemedView>

          {/* Changes */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="time-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.changes.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.changes.text')}
            </ThemedText>
          </ThemedView>

          {/* Contact Us */}
          <ThemedView type="bg" style={styles.card}>
            <View style={styles.sectionHeaderContainer}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                <Ionicons name="mail-outline" size={22} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {t('privacy.contact.title')}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSubtle" type="default" style={styles.paragraph}>
              {t('privacy.contact.text')}
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
});
