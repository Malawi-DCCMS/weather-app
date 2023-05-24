import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';

import {getGeonames} from '../../src/services/geonames.service';

type SearchProps = {
  location: string;
  setLocation: Function;
};

export const ForecastSearch = ({location, setLocation}: SearchProps) => {
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
    <Container>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        initialValue={{id: '9_000_000', title: location}}
        onSelectItem={handleSelect}
        dataSet={dataset}
        inputContainerStyle={styles.searchBar}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'white',
    height: 50,
    paddingTop: 5,
    borderRadius: 20,
    width: '95%',
  },
});

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
`;
