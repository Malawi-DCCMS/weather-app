import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import appBackground from '../../assets/appbackground.png';
import AppBar from '../components/AppBar';
import LocationRow from '../components/LocationRow';
import { DISTRICTS } from '../constants/districts.constant';
import { RootState } from '../store';
import { RootDrawerParamList } from '../common';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'NoLocation'>;
const NoLocationScreen = ({ navigation }: ScreenProps) => {
  const { name } = useSelector((state: RootState) => state.location);

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={name} navigation={navigation} />
          <ScrollView contentContainerStyle={styles.container}>
            {
              DISTRICTS.map((district, idx) => <LocationRow key={idx} district={district} />)
            }
          </ScrollView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default NoLocationScreen;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 18,
    marginRight: 18,
  },
  bg: {
    height: '100%',
  }
})