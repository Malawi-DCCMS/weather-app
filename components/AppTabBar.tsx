import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge, Icon, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalSearchParams, useRouter, Href } from 'expo-router';

import { useAlertsQuery } from '@/lib/hooks/alerts.hook';
import { useBreakpoint } from '@/lib/hooks/breakpoint.hook';
import { ThemeColors, Fonts, navRailWidth, Radius, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

// Loosely typed on purpose: this is assigned the real BottomTabBarProps at
// the call site (app/(tabs)/_layout.tsx), whose exact shape isn't reliably
// importable across expo-router versions. Since expo-router 58 the tab bar
// gets no `navigation` prop — tab presses go through emitter/navigateToTab,
// and each tab's own navigation object (in descriptors) dispatches to its
// nested stack.
type TabBarProps = {
  state: any;
  descriptors: Record<string, { navigation: any }>;
  emitter: any;
  navigateToTab: (routeKey: string) => void;
};

const ICONS: Record<string, string> = {
  index: 'weather-sunny',
  FiveDays: 'calendar-month',
  Warnings: 'alert',
  More: 'tune',
};

const LABEL_KEYS: Record<string, string> = {
  index: 'time.today',
  FiveDays: 'time.fiveDays',
  Warnings: 'alerts.title',
  More: 'More',
};

// Renders as a bottom bar on phones and a left nav rail at the XL
// breakpoint (>=600dp), per the responsive viewport guide (Step 8). The
// rail is absolutely positioned over the left edge — screens are
// responsible for adding paddingLeft: navRailWidth at the XL breakpoint so
// content doesn't render underneath it (see useBreakpoint() call sites).
function AppTabBar({ state, descriptors, emitter, navigateToTab }: TabBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const globalParams = useGlobalSearchParams<{ startAtCurrentTime?: string }>();
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const breakpoint = useBreakpoint();
  const isRail = breakpoint === 'xl';

  const { data: alerts = [] } = useAlertsQuery();

  const activeTabRoute = state.routes[state.index];
  const activeNestedRoute = activeTabRoute?.state?.routes?.[activeTabRoute.state.index ?? 0];
  const nestedScreenName =
    activeNestedRoute?.name ??
    activeTabRoute?.params?.screen;
  const startAtCurrentTime =
    activeNestedRoute?.params?.startAtCurrentTime ??
    activeTabRoute?.params?.params?.startAtCurrentTime ??
    activeTabRoute?.params?.startAtCurrentTime ??
    globalParams?.startAtCurrentTime;

  // When Hourly is opened from Today ("Today, hour by hour", startAtCurrentTime === 'yes'),
  // highlight Today in the bottom bar instead of Five Days.
  const isTodayHourly =
    activeTabRoute?.name === 'FiveDays' &&
    (nestedScreenName === 'Hourly' || activeTabRoute?.state === undefined) &&
    startAtCurrentTime === 'yes';
  const focusedRouteName = isTodayHourly ? 'index' : activeTabRoute?.name;

  // Returns a tab's nested stack to its first screen.
  const popToTop = (stackKey: string) =>
    descriptors[activeTabRoute.key]?.navigation.dispatch({ type: 'POP_TO_TOP', target: stackKey });

  const items = state.routes.map((route: { key: string; name: string; state?: { key: string; index?: number } }) => {
    const focused = route.name === focusedRouteName;
    const label = t(LABEL_KEYS[route.name] ?? route.name);
    const showAlertBadge = route.name === 'Warnings' && alerts.length > 0;

    const onPress = () => {
      const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (event.defaultPrevented) return;
      if (isTodayHourly) {
        if (route.name === 'FiveDays') {
          if (activeTabRoute?.state?.key && (activeTabRoute.state.index ?? 0) > 0) {
            popToTop(activeTabRoute.state.key);
          } else {
            router.replace('/FiveDays' as Href);
          }
        } else {
          if (activeTabRoute?.state?.key && (activeTabRoute.state.index ?? 0) > 0) {
            popToTop(activeTabRoute.state.key);
          }
          navigateToTab(route.key);
        }
        return;
      }
      if (!focused) {
        navigateToTab(route.key);
      } else if (route.state && (route.state.index ?? 0) > 0) {
        // Re-tapping the current tab while on a sub-page (e.g. a warning's
        // details, Favourites) returns to that tab's first screen, as the
        // standard tab bar does.
        popToTop(route.state.key);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        accessibilityLabel={showAlertBadge ? `${label} (${alerts.length})` : label}
        style={[styles.item, isRail && styles.itemRail, focused && styles.itemFocused]}
      >
        <View style={styles.iconWrapper}>
          <Icon source={ICONS[route.name] ?? 'circle'} size={22} color={focused ? colors.primary : colors.textSubtle} />
          {showAlertBadge && (
            <Badge size={16} style={styles.badge}>
              {alerts.length > 9 ? '9+' : alerts.length}
            </Badge>
          )}
        </View>
        <Text style={[styles.label, { color: focused ? colors.primary : colors.textSubtle }]} numberOfLines={1}>{label}</Text>
      </TouchableOpacity>
    );
  });

  if (isRail) {
    return (
      <View style={[styles.rail, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.railBadge}>
          <Icon source="weather-partly-cloudy" size={26} color={colors.textInverse} />
        </View>
        {items}
      </View>
    );
  }

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom, height: 56 + insets.bottom }]}>
      {items}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
  },
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: navRailWidth,
    backgroundColor: colors.bg,
    borderRightColor: colors.border,
    borderRightWidth: 1,
    alignItems: 'center',
    zIndex: 10,
  },
  railBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.extraLarge,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.sm,
    borderRadius: Radius.medium,
    minHeight: touchTarget.nav,
  },
  itemRail: {
    flex: 0,
    width: 72,
    borderRadius: Radius.medium,
    marginBottom: Spacing.md,
  },
  itemFocused: {
    backgroundColor: colors.bgTint,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.danger,
    color: colors.textInverse,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    marginTop: 2,
  },
});

export default AppTabBar;
