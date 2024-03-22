import React, { useMemo, useState } from 'react';
import {GestureResponderEvent, StyleSheet, TouchableOpacity, View} from 'react-native';
import { ActivityIndicator, IconButton, Paragraph } from 'react-native-paper';

import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import { Icon } from 'react-native-paper';

import {getGeonames} from '../../src/services/geonames.service';
import {placeByCurrentLocation} from '../utils/location';

import locationAnchor from '../../assets/location-anchor.png';
import { GlassView } from '../components/GlassView';
import { LOGGER } from '../lib';

type SearchProps = {
  location: string;
  setLocation: (place: Place) => void;
};

type GPS = "INACTIVE" | "SEARCHING" | "FAILED";

export const Search = ({location, setLocation}: SearchProps) => {
  const geonames = useMemo(() => getGeonames(), []);
  const dataset = useMemo(() => getDataset(geonames), [])

  const [gpsSearch, setGPSSearch] = useState<GPS>("INACTIVE");

  const handleSelect = (item: TAutocompleteDropdownItem) => {
    if (item && item.title !== null) {
      setLocation(geonames[item.title]);
    }
  };

  const handlePlaceByCurrentLocation = async (event:GestureResponderEvent) => {
    setGPSSearch("SEARCHING")

    try {
      const place = await placeByCurrentLocation()
      if (place){
        setGPSSearch("INACTIVE")
        setLocation(place)
      }
    } catch {
      setGPSSearch("FAILED")
      LOGGER.error("Not able to set closest place to current location.")
    }
  }

  return (
    <View>
      <GlassView containerStyle={styles.container} glassStyle={styles.glassCcontainer} blurStyle={{blurAmount: 25, blurType: 'light'}}>
        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={false}
          closeOnSubmit={false}
          textInputProps={{ placeholder: 'Search location', placeholderTextColor: 'white', style: styles.textStyle }}
          onSelectItem={handleSelect}
          dataSet={[...dataset]}
          inputContainerStyle={styles.searchBar}
          debounce={100}
          showChevron={false}
          showClear={false}
          RightIconComponent={<TouchableOpacity onPress={handlePlaceByCurrentLocation}><Icon source={locationAnchor} size={24}/></TouchableOpacity>}
          LeftComponent={<TouchableOpacity onPress={() => {}}><Icon source={'magnify'} color='white' size={24}/></TouchableOpacity>}
          useFilter={true}
          suggestionsListContainerStyle={styles.suggestionListStyle}
          suggestionsListTextStyle={styles.textStyle}
        />
      </GlassView>
      <GPSFeedback status={gpsSearch}/>
    </View>

  );
};

type GPSFeedbackProps = {
  status: GPS
}

const GPSFeedback = ({status}: GPSFeedbackProps) => {
  if (status == "SEARCHING") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} color={'white'} size={34} />
      </View>
    )
  }

  if(status == "FAILED") {
    return (
      <View style={styles.gpsfeedback}>
        <Paragraph style={{flex: 1, color: 'white', textAlign: 'center'}}>
          Not able to use your location to find the closest place.
        </Paragraph>
      </View>
    )
  }

  return (
    <View>
    </View>
  )
}

function getDataset(geonames: Record<string, Place>) {
  let dataset: Array<{ id: string, title: string }> = [];
  for (const [key] of Object.entries(geonames)) {
    dataset.push({
      id: key,
      title: key,
    })
  }

  return dataset
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'rgba(217, 217, 217, 0.50)',
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35
  },
  glassCcontainer: {
    alignItems: 'center',
    borderRadius: 4,
    padding: 0,
    margin: 0,
  },
  textStyle: {
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: 'white',
  },
  suggestionListStyle: {
    marginTop: -2,
    backgroundColor: 'rgba(217, 217, 217, .7)',
  },
  loader: {
    marginTop: 80,
    marginBottom: 80,
  },
  gpsfeedback: {
    marginTop: 80,
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'center',
  }
});
