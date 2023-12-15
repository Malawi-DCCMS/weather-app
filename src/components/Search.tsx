import React, { useMemo } from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';

import {getGeonames} from '../../src/services/geonames.service';

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
    <View style={styles.container}>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        initialValue={{id: '9_000_000_000', title: location}}
        onSelectItem={handleSelect}
        dataSet={dataset}
        inputContainerStyle={styles.searchBar}
        debounce={3000}
        showChevron={true}
        showClear={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    width: '90%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
