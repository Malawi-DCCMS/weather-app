import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AppBar from "@/components/AppBar";
import { useTheme } from "@/lib/hooks/use-theme";
import { useUnitsStore } from "@/lib/store/units-store";
import { PRECIPITATION_UNITS, TEMPERATURE_UNITS, WIND_UNITS } from "@/lib/units";
import { BottomTabInset, MaxContentWidth, Spacing, Radius } from "@/lib/theme";

type UnitSectionProps<T extends string> = {
  title: string;
  options: T[];
  selected: T;
  onSelect: (unit: T) => void;
};

// One "pick one" list per quantity, styled like the Language screen.
function UnitSection<T extends string>({ title, options, selected, onSelect }: UnitSectionProps<T>) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSubtle" style={styles.sectionHeader}>
        {title}
      </ThemedText>
      <ThemedView type="bg" style={styles.card}>
        {options.map((unit, index) => {
          const isSelected = unit === selected;
          const label = t(`units.${unit}`);
          return (
            <View key={unit}>
              <Pressable
                onPress={() => onSelect(unit)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={label}
                style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
              >
                <ThemedText
                  type="default"
                  style={[styles.label, isSelected && { color: theme.primary, fontWeight: "700" }]}
                >
                  {label}
                </ThemedText>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color={theme.primary} />}
              </Pressable>
              {index < options.length - 1 && (
                <View style={[styles.separator, { backgroundColor: theme.bgMuted }]} />
              )}
            </View>
          );
        })}
      </ThemedView>
    </>
  );
}

export default function UnitsScreen() {
  const { t } = useTranslation();
  const temperature = useUnitsStore(s => s.temperature);
  const wind = useUnitsStore(s => s.wind);
  const precipitation = useUnitsStore(s => s.precipitation);
  const setTemperature = useUnitsStore(s => s.setTemperature);
  const setWind = useUnitsStore(s => s.setWind);
  const setPrecipitation = useUnitsStore(s => s.setPrecipitation);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <AppBar location={t("units.title")} hideSettings />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} bounces={false}>
          <UnitSection title={t("units.temperature")} options={TEMPERATURE_UNITS} selected={temperature} onSelect={setTemperature} />
          <UnitSection title={t("units.wind")} options={WIND_UNITS} selected={wind} onSelect={setWind} />
          <UnitSection title={t("units.precipitation")} options={PRECIPITATION_UNITS} selected={precipitation} onSelect={setPrecipitation} />
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
    marginTop: Spacing.lg,
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
    minHeight: 56,
  },
  pressedRow: {
    opacity: 0.6,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg,
  },
});
