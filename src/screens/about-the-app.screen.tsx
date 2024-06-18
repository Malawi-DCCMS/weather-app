import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView, TouchableOpacity, Linking, ListRenderItemInfo, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Paragraph, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import appBackground from '../../assets/new-glass-bg.png';
import AppBar from '../components/AppBar';
import { RootDrawerParamList } from '../common';
import Alerts from '../components/Alerts';
import { RootState } from '../store';
import bulletListIcon from '../../assets/time-period-bullet.png';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'AboutTheApp'>;
function AboutTheAppScreen({ navigation }: ScreenProps): JSX.Element {
  const { alerts } = useSelector((state: RootState) => state.alerts);
  const { lat, lon } = useSelector((state: RootState) => state.location);

  const getPartners = (): Array<string> => ([
    'Nowergian Meteorological Institute',
    'NORAD',
    'NORCAP',
    'World Meteorological Organisation',
    'Save the Chidlren'
  ]);

  const renderPartner = (item: ListRenderItemInfo<string>) => <View style={styles.partnerItem}>
    <Image style={styles.bulletStyle} source={bulletListIcon}/><Text style={styles.partnerText}> {item.item}</Text>
  </View>;

  const onClickYrURL = () => Linking.openURL('https://yr.no/NRK');

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={"About us"} navigation={navigation} />
          <Alerts alerts={alerts[`${lat}${lon}`]} location={"About the app"} navigator={navigation} />
          <View style={styles.container}>
            <View style={styles.opacity}>
              <ScrollView showsVerticalScrollIndicator={false} snapToStart={false}>
                <View style={styles.content}>
                  <Paragraph>
                    <Text style={styles.title}>The app and its forecasts</Text>
                  </Paragraph>
                  <Paragraph>
                    <Text style={styles.whiteText}>
                      The app development is led by {"\n"}DCCMS - Department of Climate Change 
                      and Meteorological Services Malawi.{"\n"}{"\n"}
                      All forecasts are issued by DCCMS.
                    </Text>
                  </Paragraph>
                  <View>
                    <View>
                    <Text style={styles.whiteHeader}>
                      {"\n"}Partners in this project have been:
                    </Text>
                      <FlatList data={getPartners()} renderItem={(item: ListRenderItemInfo<string>) =>renderPartner(item)} key={new Date().toISOString()}/>
                      </View>
                  </View>
                  <Paragraph>
                    <Text style={styles.whiteHeader}>{"\n"}Icons</Text>{"\n"}
                    <Text style={styles.whiteText}>
                    <TouchableOpacity onPress={() => onClickYrURL()}><Text style={{...styles.whiteText, ...styles.ln}}>Weather icons are licensed by yr.no/NRK.</Text></TouchableOpacity>{"\n"}{"\n"}
                      Warning icons are contributed by the World Meteorological Organisation.
                    </Text>
                  </Paragraph>
                  <Paragraph>
                    <Text style={styles.whiteHeader}>{"\n"}Background photo</Text>{"\n"}
                    <Text style={styles.whiteText}>
                      Background photo is by:{"\n"}
                      Craig Manners - Unsplash{"\n"}{"\n"}{"\n"}
                    </Text>
                  </Paragraph>
                </View>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  opacity: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'rgba(100, 100, 100, .1)',
  },
  whiteHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24.51,
    fontFamily: 'OpenSans',
  },
  whiteText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21.79,
    fontWeight: '400',
    fontFamily: 'OpenSans',
  },
  title: {
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
    fontFamily: 'OpenSans',
  },
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
    overflow: 'scroll',
  },
  bg: {
    height: '100%',
  },
  content: {
    marginTop: 26,
    marginLeft: 45,
    marginRight: 45,
  },
  ln: {
    textDecorationLine: 'underline',
    color: 'rgba(174, 209, 255, 1)',
  },
  partnerItem: {
    flexDirection: 'row',
  },
  partnerText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 25,
    fontFamily: 'OpenSans',
  },
  bulletStyle: {
    height: 7,
    width: 7,
    alignSelf: 'center',
  },
});

export default AboutTheAppScreen;
