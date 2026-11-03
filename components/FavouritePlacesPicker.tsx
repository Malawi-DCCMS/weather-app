import React, { JSX, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  AutocompleteDropdown,
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from '@/lib/autocomplete';

import geonames from '@/assets/geonames.json';
import { Place } from '@/lib/geo/places';
import { MAX_FAVOURITE_PLACES } from '@/lib/hooks/favourites.hook';
import { ThemeColors, Fonts, Colors, Radius, shadow, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type FavouritePlacesPickerProps = {
  initialSelected?: Place[];
  finishLabel: string;
  onFinish: (places: Place[]) => void;
  // 'dark' matches Welcome's language-selection screen (onboarding); the
  // default 'light' matches the rest of the app (editing favourites later).
  theme?: 'light' | 'dark';
};

function isSamePlace(a: Place, b: Place): boolean {
  return a.name === b.name && a.latitude === b.latitude && a.longitude === b.longitude;
}

function FavouritePlacesPicker({ initialSelected = [], finishLabel, onFinish, theme = 'light' }: FavouritePlacesPickerProps): JSX.Element {
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const themeColors = useTheme();
  // theme='dark' means "onboarding's colored hero", not the app's dark-mode
  // setting — that variant always renders against a fixed dark hero
  // (Welcome.tsx), so its base (non -Dark-suffixed) styles stay pinned to
  // the light palette regardless of the user's theme choice. theme='light'
  // (the default, used by EditFavourites) is a normal screen and follows
  // the active theme like everything else.
  const colors = isDark ? Colors.light : themeColors;
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [selected, setSelected] = useState<Place[]>(initialSelected);
  const controllerRef = useRef<AutocompleteDropdownRef | null>(null);

  const atMax = selected.length >= MAX_FAVOURITE_PLACES;

  const handleSelect = (item: TAutocompleteDropdownItem) => {
    if (!item) return;
    const place: Place = geonames[item.id];

    setSelected(prev => {
      if (prev.some(p => isSamePlace(p, place)) || prev.length >= MAX_FAVOURITE_PLACES) {
        return prev;
      }
      return [...prev, place];
    });
    controllerRef.current?.clear();
  };

  const removePlace = (place: Place) => {
    setSelected(prev => prev.filter(p => !isSamePlace(p, place)));
  };

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{t('places.pickerSubtitle')}</Text>

      {atMax ? (
        <Text style={styles.maxReachedText}>{t('places.maxReached')}</Text>
      ) : (
        <View style={styles.searchContainer}>
          <AutocompleteDropdown
            controller={c => (controllerRef.current = c)}
            clearOnFocus={true}
            closeOnBlur={false}
            closeOnSubmit={true}
            textInputProps={{ placeholder: t("places.searchLocation"), placeholderTextColor: colors.textMuted, style: styles.textStyle }}
            onSelectItem={handleSelect}
            inputContainerStyle={styles.searchBar}
            debounce={100}
            showChevron={false}
            showClear={false}
            LeftComponent={<Icon source="magnify" color={colors.primary} size={24} />}
            useFilter={true}
            suggestionsListContainerStyle={styles.suggestionListStyle}
            suggestionsListTextStyle={styles.textStyle}
            containerStyle={{ zIndex: 1 }}
            inputHeight={48}
            renderItem={(item: any) => (
              <Text style={styles.itemText}>{isNil(item.region) ? item.title : `${item.title}, ${item.region}`}</Text>
            )}
          />
        </View>
      )}

      <Text style={[styles.countText, isDark && styles.countTextDark]}>{t('places.selectedCount', { count: selected.length })}</Text>

      {selected.length > 0 && (
        <View style={styles.chipRow}>
          {selected.map(place => (
            <View key={`${place.name}-${place.latitude}-${place.longitude}`} style={styles.chip}>
              <Text style={styles.chipText} numberOfLines={1}>{place.name}</Text>
              <TouchableOpacity
                onPress={() => removePlace(place)}
                accessibilityLabel={t('places.removeChip', { name: place.name })}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon source="close" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.finishButton, isDark && styles.finishButtonDark]}
        onPress={() => onFinish(selected)}
        accessibilityLabel={finishLabel}
      >
        <Text style={[styles.finishButtonText, isDark && styles.finishButtonTextDark]}>{finishLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default FavouritePlacesPicker;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
    marginBottom: Spacing.lg,
  },
  subtitleDark: {
    color: colors.textInverse,
  },
  searchContainer: {
    zIndex: 1,
  },
  searchBar: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderRadius: Radius.small,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: Fonts.sans.regular,
    fontSize: 16,
    color: colors.text,
  },
  textStyle: {
    fontFamily: Fonts.sans.regular,
    fontSize: 16,
    color: colors.text,
  },
  itemText: {
    color: colors.text,
    fontFamily: Fonts.sans.regular,
    fontSize: 16,
    padding: 15,
    width: '100%',
    flexGrow: 1,
    flexShrink: 0,
  },
  suggestionListStyle: {
    marginTop: -2,
    padding: 0,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.small,
    ...shadow.sm,
  },
  maxReachedText: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    color: colors.textSubtle,
    padding: Spacing.md,
    textAlign: 'center',
    backgroundColor: colors.bgTint,
    borderRadius: Radius.small,
  },
  countText: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    color: colors.textSubtle,
    marginTop: Spacing.lg,
  },
  countTextDark: {
    color: colors.textInverse,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: colors.bgTint,
    borderRadius: Radius.extraLarge,
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    color: colors.primary,
    maxWidth: 200,
  },
  finishButton: {
    marginTop: Spacing.xl,
    minHeight: touchTarget.nav,
    borderRadius: Radius.medium,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonDark: {
    backgroundColor: colors.bg,
  },
  finishButtonText: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textInverse,
  },
  finishButtonTextDark: {
    color: colors.primary,
  },
});
