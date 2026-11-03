import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { isNil } from 'lodash';
import { Icon } from 'react-native-paper';

import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from '@/lib/autocomplete';

import { placeByCurrentLocation } from '@/lib/geo/location';
import { Place } from '@/lib/geo/places';

import geonames from '@/assets/geonames.json'
import { useTranslation } from 'react-i18next';
import { ThemeColors, Fonts, Radius, shadow, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
const locationAnchor = require('@/assets/location-anchor.png');

type SearchProps = {
  location: string;
  setLocation: (place: Place) => void;
};

type GPS = "INACTIVE" | "SEARCHING" | "FAILED";

export const Search = ({ setLocation }: SearchProps) => {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [gpsSearch, setGPSSearch] = useState<GPS>("INACTIVE");

  const handleSelect = (item: TAutocompleteDropdownItem) => {
    if (item) {
      setLocation(geonames[item.id]);
    }
  };

  const handlePlaceByCurrentLocation = async () => {
    setGPSSearch("SEARCHING")

    try {
      const place = await placeByCurrentLocation()
      if (place) {
        setGPSSearch("INACTIVE")
        setLocation(place)
      }
    } catch {
      setGPSSearch("FAILED")
      showDialog();
      console.error("Not able to set closest place to current location.")
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <AutocompleteDropdown
          clearOnFocus={true}
          closeOnBlur={false}
          closeOnSubmit={true}
          textInputProps={{ placeholder: t("places.searchLocation"), placeholderTextColor: colors.textMuted, style: styles.textStyle }}
          onSelectItem={handleSelect}
          inputContainerStyle={styles.searchBar}
          debounce={100}
          showChevron={false}
          showClear={false}
          RightIconComponent={<TouchableOpacity accessible={true} accessibilityLabel='Go to current location' onPress={handlePlaceByCurrentLocation} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}><Icon source={locationAnchor} size={24} /></TouchableOpacity>}
          LeftComponent={<TouchableOpacity accessible={true} accessibilityLabel='Search' onPress={() => { }} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}><Icon source={'magnify'} color={colors.primary} size={24} /></TouchableOpacity>}
          useFilter={true}
          suggestionsListContainerStyle={styles.suggestionListStyle}
          suggestionsListTextStyle={styles.textStyle}
          containerStyle={{ zIndex: 1 }}
          inputHeight={48}
          renderItem={(item: any) => <Text style={{ color: colors.text, fontFamily: Fonts.sans.regular, fontSize: 16, padding: 15, width: '100%', flexGrow: 1, flexShrink: 0 }}>{isNil(item.region) ? item.title : `${item.title}, ${item.region}`}</Text>}
        />
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialogStyle}>
          <Dialog.Title style={styles.whiteText}>{t("common.alerts.title")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.whiteText}>{t("places.locationError.message")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} style={styles.dialogButton}><Text style={styles.whiteText}>{t("common.actions.dismiss")}</Text></Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <GPSFeedback status={gpsSearch} />
    </View>
  );
};

type GPSFeedbackProps = {
  status: GPS
}

const GPSFeedback = ({ status }: GPSFeedbackProps) => {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (status === "SEARCHING") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} color={colors.primary} size='large' />
      </View>
    )
  }

  return (
    <View>
    </View>
  )
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  searchBar: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderRadius: Radius.small,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: Fonts.sans.regular,
    fontSize: 16,
    color: colors.text,
  },
  dialogStyle: {
    backgroundColor: colors.bg,
    borderRadius: Radius.medium,
    ...shadow.md,
  },
  dialogButton: {
    minHeight: touchTarget.nav,
    justifyContent: 'center',
  },
  whiteText: {
    color: colors.text,
    fontFamily: Fonts.sans.regular,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  textStyle: {
    fontFamily: Fonts.sans.regular,
    fontSize: 16,
    color: colors.text,
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
  loader: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxxl,
  },
  gpsfeedback: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxxl,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: Spacing.xl,
  }
});

export default Search;
