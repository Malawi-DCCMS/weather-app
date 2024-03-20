import React, { useMemo } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import { Icon } from 'react-native-paper';

import {getGeonames} from '../../src/services/geonames.service';
import locationAnchor from '../../assets/location-anchor.png';
import { GlassView } from '../components/GlassView';

type SearchProps = {
  location: string;
  setLocation: (place: Geoname) => void;
};

export const Search = ({location, setLocation}: SearchProps) => {
  const geonames = useMemo(() => getGeonames(), []);
  const dataset = useMemo(() => getDataset(geonames), [])

  const handleSelect = (item: TAutocompleteDropdownItem) => {
    if (item && item.title !== null) {
      setLocation(geonames[item.title]);
    }
  };

  return (
    <GlassView containerStyle={styles.container} glassStyle={styles.glassCcontainer} blurStyle={{blurAmount: 25, blurType: 'light'}}>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={false}
        closeOnSubmit={false}
        textInputProps={{ placeholder: 'Search location', placeholderTextColor: 'white', style: styles.textStyle }}
        onSelectItem={handleSelect}
        dataSet={[...dataset]}
        inputContainerStyle={styles.searchBar}
        debounce={200}
        showChevron={false}
        showClear={false}
        // RightIconComponent={<TouchableOpacity onPress={() => {}}><Icon source={locationAnchor} size={24}/></TouchableOpacity>}
        LeftComponent={<TouchableOpacity onPress={() => {}}><Icon source={'magnify'} color='white' size={24}/></TouchableOpacity>}
        useFilter={true}
        suggestionsListContainerStyle={styles.suggestionListStyle}
        suggestionsListTextStyle={styles.textStyle}
      />
    </GlassView>
  );
};

function getDataset(geonames: Record<string, Geoname>) {
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
});
