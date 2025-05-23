import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Dialog, Paragraph, Portal, Button, Text } from 'react-native-paper';
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
const locationAnchor = require('@/assets/location-anchor.png');

type SearchProps = {
  location: string;
  setLocation: (place: Place) => void;
};

type GPS = "INACTIVE" | "SEARCHING" | "FAILED";

export const Search = ({ setLocation }: SearchProps) => {
  const { t } = useTranslation();
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
          textInputProps={{ placeholder: t('Search location'), placeholderTextColor: 'white', style: styles.textStyle }}
          onSelectItem={handleSelect}
          inputContainerStyle={styles.searchBar}
          debounce={100}
          showChevron={false}
          showClear={false}
          RightIconComponent={<TouchableOpacity accessible={true} accessibilityLabel='Go to current location' onPress={handlePlaceByCurrentLocation}><Icon source={locationAnchor} size={24} /></TouchableOpacity>}
          LeftComponent={<TouchableOpacity accessible={true} accessibilityLabel='Search' onPress={() => { }}><Icon source={'magnify'} color='white' size={24} /></TouchableOpacity>}
          useFilter={true}
          suggestionsListContainerStyle={styles.suggestionListStyle}
          suggestionsListTextStyle={styles.textStyle}
          containerStyle={{ zIndex: 1 }}
          inputHeight={48}
          renderItem={(item: any) => <Text style={{ color: 'white', fontSize: 16, padding: 15, width: '100%', flexGrow: 1, flexShrink: 0 }}>{isNil(item.region) ? item.title : `${item.title}, ${item.region}`}</Text>}
        />
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialogStyle}>
          <Dialog.Title style={styles.whiteText}>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.whiteText}>Not able to use your location to find the closest place.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}><Text style={styles.whiteText}>Dismiss</Text></Button>
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
  if (status === "SEARCHING") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} color={'white'} size={34} />
      </View>
    )
  }

  return (
    <View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'rgba(217, 217, 217, 0.50)',
    shadowColor: 'rgba(217, 217, 217, 0.50)',
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 4,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: 'white',
  },
  blurBar: {
    position: 'absolute',
    backgroundColor: 'rgba(217, 217, 217, 0.50)',
    top: 0,
    width: '90%',
    height: '100%',
    borderRadius: 4,
    zIndex: 0,
  },
  dialogStyle: {
    backgroundColor: 'rgba(217, 217, 217, .5)',
    shadowColor: 'rgba(217, 217, 217, .5)',
    borderRadius: 4,
  },
  whiteText: {
    color: 'white',
    fontFamily: 'NotoSans-Regular',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  textStyle: {
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: 'white',
  },
  suggestionListStyle: {
    marginTop: -2,
    padding: 0,
    backgroundColor: 'rgba(217, 217, 217, .5)',
    shadowColor: 'rgba(217, 217, 217, .5)'
  },
  loader: {
    marginTop: 40,
    marginBottom: 80,
  },
  gpsfeedback: {
    marginTop: 40,
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 25,
  }
});

export default Search;
