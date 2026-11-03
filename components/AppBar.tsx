import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

import { useNavigation, useRouter, Href } from 'expo-router';

import { SCREENS } from '@/lib/layout/constants';
import { useTranslation } from 'react-i18next';
import { ThemeColors, Fonts, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

const backArrow = require('@/assets/icons8-back-100_2.png');

type AppBarProps = {
  location: string,
  // True only on the Today screen, where the title IS the place name and
  // should be tappable to switch location — other screens use `location`
  // as a plain screen title (e.g. "Settings", "Warnings").
  isPlace?: boolean,
  hideSettings?: boolean,
  // Top-level tab screens that must never show a back arrow.
  hideBack?: boolean,
  // Icon shown before a plain (non-place) title, same size/colour as the
  // place pin.
  titleIcon?: string,
  onBack?: () => void,
};

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const AppBar = (props: AppBarProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Whether there's anywhere to go back to, kept in state and refreshed on
  // focus / navigation changes. Reading navigation.canGoBack() during render
  // went stale: a screen re-rendered while covered (e.g. Today re-rendering
  // on a language change while Settings was open on top) kept a back arrow
  // after the cover was popped, and tapping it threw "GO_BACK was not
  // handled by any navigator".
  const [canGoBack, setCanGoBack] = useState(() => navigation.canGoBack());
  useEffect(() => {
    const update = () => setCanGoBack(navigation.canGoBack());
    update();
    const unsubscribeFocus = navigation.addListener('focus', update);
    const unsubscribeState = navigation.addListener('state', update);
    return () => {
      unsubscribeFocus();
      unsubscribeState();
    };
  }, [navigation]);

  const onBack = () => {
    if (props.onBack) {
      props.onBack();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const titleBlock = (
    <>
      {(props.isPlace || props.titleIcon) && <Icon size={18} color={colors.primary} source={props.titleIcon ?? 'map-marker'} />}
      <View style={styles.titleTextBlock}>
        <ThemedText type="default" themeColor="textStrong" style={styles.appTitle} numberOfLines={1}>{props.location || "Climweb Weather App"}</ThemedText>
        {props.isPlace && <ThemedText type="small" themeColor="primary" style={styles.placeSubtitle}>{t("places.tapToChange")}</ThemedText>}
      </View>
    </>
  );

  return (
    <ThemedView type="bg" style={styles.appBar}>
      <View style={styles.appTitleContainer}>
        {!props.hideBack && (canGoBack || !!props.onBack) &&
          <TouchableOpacity accessible={true} accessibilityLabel={t('Go back')} onPress={onBack} style={styles.backButton}>
            <Icon size={28} color={colors.primary} source={backArrow} />
          </TouchableOpacity>}
        {props.isPlace
          ? <TouchableOpacity
              style={styles.titleTouchable}
              accessible={true}
              accessibilityLabel={`${props.location}. ${t("places.tapToChange")}`}
              onPress={() => router.push(SCREENS.Search.toString() as Href)}
            >
              {titleBlock}
            </TouchableOpacity>
          : <View style={styles.titleTouchable}>{titleBlock}</View>
        }
      </View>

      {!props.hideSettings && (
        <TouchableOpacity
          style={styles.settingsButton}
          accessible={true}
          accessibilityLabel={t("settings.title")}
          onPress={() => router.push(SCREENS.Settings.toString() as Href)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon size={26} color={colors.primary} source="cog-outline" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

export default AppBar;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: touchTarget.nav + Spacing.lg,
  },
  appTitleContainer: {
    paddingLeft: Spacing.md,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButton: {
    minWidth: touchTarget.nav,
    minHeight: touchTarget.nav,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
    minHeight: touchTarget.nav,
    paddingVertical: Spacing.md,
    marginLeft: Spacing.md,
  },
  titleTextBlock: {
    flexShrink: 1,
    marginRight: Spacing.lg,
  },
  appTitle: {
    fontSize: 20,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  placeSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.primary,
  },
  settingsButton: {
    width: touchTarget.nav,
    height: touchTarget.nav,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  warningIcons: {
    flexDirection: 'row',
    flex: 1,
    height: 30,
  },
});
