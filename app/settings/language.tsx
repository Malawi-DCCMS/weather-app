import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AppBar from "@/components/AppBar";
import { useTranslation } from "react-i18next";

import { useLanguage } from "@/lib/hooks/use-language";
import { useTheme } from "@/lib/hooks/use-theme";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
  Radius,
} from "@/lib/theme";

export default function LanguageScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { languageCode, setLanguageCode, supportedLanguages } = useLanguage();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <AppBar location={t("settings.language.title")} hideSettings />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <ThemedText
            type="smallBold"
            themeColor="textSubtle"
            style={[styles.sectionHeader, { marginTop: 16 }]}
          >
            {t("settings.language.title")}
          </ThemedText>

          <ThemedView type="bg" style={styles.card}>
            {supportedLanguages.map((item, index) => {
              const isSelected = item.code === languageCode;
              return (
                <View key={item.code}>
                  <Pressable
                    onPress={() => setLanguageCode(item.code)}
                    style={({ pressed }) => [
                      styles.row,
                      pressed && styles.pressedRow,
                    ]}
                  >
                    <View style={styles.textContainer}>
                      <ThemedText
                        type="default"
                        style={[
                          styles.nativeName,
                          isSelected && { color: theme.primary, fontWeight: "700" },
                        ]}
                      >
                        {item.nativeName}
                      </ThemedText>
                      <ThemedText
                        type="small"
                        themeColor="textSubtle"
                        style={styles.englishName}
                      >
                        {item.name}
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.primary}
                      />
                    )}
                  </Pressable>
                  {index < supportedLanguages.length - 1 && (
                    <View
                      style={[
                        styles.separator,
                        { backgroundColor: theme.bgMuted },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    padding: Spacing.lg,
    paddingBottom: BottomTabInset + Spacing.xl,
  },
  sectionHeader: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  card: {
    borderRadius: Radius.large,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    minHeight: 64,
  },
  pressedRow: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  nativeName: {
    fontSize: 16,
  },
  englishName: {
    fontSize: 14,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg,
  },
});
