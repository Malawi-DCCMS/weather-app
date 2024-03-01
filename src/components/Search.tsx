import React, { useMemo } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
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
  const map = geonames.reduce(
    (acc: Record<string, Geoname>, val) => ((acc[val.name] = val), acc),
    {},
  );

  const dataset = geonames.map((val, idx) => ({
    id: idx.toString(),
    title: val.name,
  }));

  const handleSelect = (item: TAutocompleteDropdownItem) => {
    if (item && item.title !== null) {
      setLocation(map[item.title]);
    }
  };

  return (
    <GlassView containerStyle={styles.container} glassStyle={styles.glassCcontainer} blurStyle={{blurAmount: 20, blurType: 'light'}}>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        textInputProps={{ placeholder: 'Search location', placeholderTextColor: 'white', style: styles.textStyle }}
        onSelectItem={handleSelect}
        dataSet={[{id: '9_000_000_000', title: location}, ...dataset]}
        inputContainerStyle={styles.searchBar}
        debounce={3000}
        showChevron={false}
        showClear={false}
        RightIconComponent={<TouchableOpacity onPress={() => {}}><Icon source={locationAnchor} size={24}/></TouchableOpacity>}
        LeftComponent={<TouchableOpacity onPress={() => {}}><Icon source={'magnify'} color='white' size={24}/></TouchableOpacity>}
        useFilter={true}
        suggestionsListContainerStyle={styles.suggestionListStyle}
        suggestionsListTextStyle={styles.textStyle}
      />
    </GlassView>
  );
};

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
