import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Paragraph, Text } from 'react-native-paper';

import appBackground from '../../assets/appbackground.png';
import AppBar from '../components/AppBar';
import { RootDrawerParamList } from '../common';
import { GlassView } from '../components/GlassView';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'AboutUs'>;
function AboutUsScreen({ navigation }: ScreenProps): JSX.Element {
  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={"About us"} navigation={navigation} />
          <GlassView glassStyle={styles.container} containerStyle={styles.container} blurStyle={{ blurAmount: 25, blurType: 'light' }}>
            <View style={styles.opacity}>
              <ScrollView>
                <View style={styles.content}>
                  <Paragraph>
                    <Text style={styles.title}>
                      Department of Climate Change and Meteorological Services (DCCMS)
                    </Text>{"\n"}
                  </Paragraph>
                  <Paragraph>
                    <Text style={styles.whiteHeader}>How we started</Text>{"\n"}
                    <Text style={styles.whiteText}>
                      We began with volunteers and enthusiasts in the 1890s.
                      Later in the 1940s, we started providing weather services for local aviation.
                      Today, we provide reliable weather services across globe.
                      We cover aviation, marine, agriculture, livestock management, and more.
                    </Text>
                  </Paragraph>
                  <Paragraph style={{ marginTop: 40 }}>
                    <Text style={styles.whiteHeader}>Our mandate</Text>{"\n"}
                    <Text style={styles.whiteText}>
                      To monitor, predict and provide
                      information an weather and climate, that would contribute towards the socio-economic development of the country.
                    </Text>
                  </Paragraph>
                  <Paragraph style={{ marginTop: 40 }}>
                    <Text style={styles.whiteHeader}>Our mission</Text>{"\n"}
                    <Text style={styles.whiteText}>
                      To provide reliable, responsive and high quality weather and climate services to meet national, regional and
                      international obligations through timely dissemination of accurate and up to-date data and information
                      for socio-economic development.
                    </Text>
                  </Paragraph>
                  <Paragraph style={{ marginTop: 40 }}>
                    <Text style={styles.whiteHeader}>Our vision</Text>{"\n"}
                    <Text style={styles.whiteText}>
                      A Responsive Nation to Weather and Climate Change Impacts
                    </Text>
                  </Paragraph>
                </View>
              </ScrollView>
            </View>
          </GlassView>
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
    backgroundColor: 'rgba(217, 217, 217, .1)',
  },
  whiteHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'OpenSans',
  },
  whiteText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'OpenSans',
  },
  title: {
    color: 'white',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "600",
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
});

export default AboutUsScreen;
