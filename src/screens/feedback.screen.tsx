import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, ScrollView, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { Icon, Text } from 'react-native-paper';

import appBackground from '../../assets/app-bg-normal.png';
import smiley1 from '../../assets/smiley-1.png';
import smiley2 from '../../assets/smiley-2.png';
import smiley3 from '../../assets/smiley-3.png';
import smiley4 from '../../assets/smiley-4.png';
import smiley5 from '../../assets/smiley-5.png';
import AppBar from '../components/AppBar';
import { RootState } from '../store';
import { LOGGER } from '../lib';

type ScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}
const FeedbackScreen = ({ navigation }: ScreenProps) => {
  const { name } = useSelector((state: RootState) => state.location);
  const [text, setText] = useState<string>();
  const [smiley, setSmiley] = useState<string>();

  const submit = () => {
    LOGGER.error(text, smiley);
  };

  return (
    <SafeAreaView>
      <AutocompleteDropdownContextProvider>
        <View style={styles.wrapper}>
          <ImageBackground source={appBackground} style={styles.bg}>
            <AppBar location={name} navigation={navigation} />
            <ScrollView contentContainerStyle={styles.outer} snapToStart={false}>
              <View style={styles.container}>
                <View><Text style={styles.header}>Help us better!</Text></View>
                <View><Text style={styles.header2}>How satisfied are you with our services?</Text></View>
                <View style={styles.smileys}>
                  <View onTouchStart={() => setSmiley('smiley1')} style={styles.smiley}><Icon source={smiley1} size={50} /></View>
                  <View onTouchStart={() => setSmiley('smiley2')} style={styles.smiley}><Icon source={smiley2} size={50} /></View>
                  <View onTouchStart={() => setSmiley('smiley3')} style={styles.smiley}><Icon source={smiley3} size={50} /></View>
                  <View onTouchStart={() => setSmiley('smiley4')} style={styles.smiley}><Icon source={smiley4} size={50} /></View>
                  <View onTouchStart={() => setSmiley('smiley5')} style={styles.smiley}><Icon source={smiley5} size={50} /></View>
                </View>
                <View><Text style={styles.headerSmall}>Anything you would like to tell us?</Text></View>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <TextInput style={styles.saymore} multiline editable onChangeText={setText} underlineColorAndroid={'transparent'}></TextInput>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}><Text style={styles.submit} onPress={() => submit()}>Send </Text><Text style={styles.submitGt}>&gt;</Text></View>
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      </AutocompleteDropdownContextProvider>
    </SafeAreaView>
  );
}

export default FeedbackScreen;

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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
    width: '95%',
    backgroundColor: 'rgba(245, 245, 240, 0.90)',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: .1,
  },
  outer: { flexDirection: 'column', alignItems: 'center' },
  bg: {
    height: '100%',
  },
  header: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 20,
    marginTop: 10,
  },
  header2: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 20,
    marginTop: 25,
  },
  headerSmall: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  smileys: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    width: '90%',
  },
  smiley: {
    margin: 7,
  },
  saymore: {
    backgroundColor: 'white',
    width: '90%',
    margin: 10,
    borderRadius: 15,
    flexWrap: 'wrap',
    minHeight: 186,
    borderWidth: 0,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  submit: {
    textDecorationLine: 'underline',
    fontFamily: 'NotoSans-Regular',
    fontSize: 16,
    paddingTop: 8,
    paddingRight: 0,
    paddingBottom: 20,
  },
  submitGt: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 16,
    paddingRight: 8,
    paddingLeft: 0,
    paddingTop: 8,
    paddingBottom: 20,
    marginRight: 20,
  },
})