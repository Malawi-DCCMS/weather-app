import React, {useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, Alert} from 'react-native';
import styled from 'styled-components/native';

import {getCurrentPosition} from '../services/location.service';
import {CurrentForecast} from './forecast/Current';
import {ForecastSearch} from './forecast/Search';
import backgroundImage from '../assets/6.png';
import {snapToPlace} from '../utils/places';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

type HomeProps = {navigation: NavigationProp<ParamListBase>};

const Home = ({navigation}: HomeProps) => {
  const [place, setPlace] = useState<Place>({
    name: 'Blantyre',
    position: {lat: -15.786111, long: 35.005833},
  });

  useEffect(() => {
    getCurrentPosition()
      .then(location => {
        const closestPlace = snapToPlace({
          name: '',
          position: {lat: location.lat, long: location.long},
        });
        if (closestPlace?.name.length) {
          setPlace(closestPlace);
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  }, [setPlace]);

  const setLocation = (location: Geoname) => {
    setPlace({
      name: location.name,
      position: {lat: location.lat, long: location.long},
    });
  };

  return (
    <Container>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ForecastSearch location={place.name} setLocation={setLocation} />
        <CurrentForecast
          navigation={navigation}
          lat={place.position.lat}
          long={place.position.long}
          locationName={place.name}
        />
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentContainerFlexGrow: {
    flexGrow: 1,
  },
  contentContainerFlex: {
    flex: 1,
  },
});

export default Home;
