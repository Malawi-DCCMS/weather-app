import React from 'react';
import { ImageBackground, StyleSheet, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import AppBar from '@/components/AppBar';
import Alerts from '@/components/Alerts';

import { RootState } from '@/lib/store';
import { useTranslation } from 'react-i18next';

const appBackground = require('@/assets/new-glass-bg.png');

function AboutUsScreen(): JSX.Element {
  const { t } = useTranslation();
  const { lat, lon } = useSelector((state: RootState) => state.location);

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={t("About us")} />
          <Alerts lat={lat} lon={lon} location={"About us"} />
          <View style={styles.container}>
            <View style={styles.opacity}>
              <FlatList
                data={[{ key: 'data' }]}
                showsVerticalScrollIndicator={false}
                snapToStart={false}
                renderItem={() => (
                  <>
                    <View style={styles.content}>
                      <Paragraph>
                        <Text style={styles.title}>
                          {t('Department of Climate Change and Meteorological Services (DCCMS)')}
                        </Text>{"\n"}
                      </Paragraph>
                      <Paragraph>
                        <Text style={styles.whiteHeader}>{t('how.we.started')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          {t('how.we.started.desc')}
                        </Text>
                      </Paragraph>
                      <Paragraph style={{ marginTop: 40 }}>
                        <Text style={styles.whiteHeader}>{t('our.mandate')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          {t('our.mandate.desc')}
                        </Text>
                      </Paragraph>
                      <Paragraph style={{ marginTop: 40 }}>
                        <Text style={styles.whiteHeader}>{t('our.mission')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          {(t('our.mission.desc'))}
                        </Text>
                      </Paragraph>
                      <Paragraph style={{ marginTop: 40 }}>
                        <Text style={styles.whiteHeader}>{t('our.vision')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          {t('our.vision.desc')}{"\n"}{"\n"}
                        </Text>
                      </Paragraph>
                    </View>
                  </>
                )}
              />
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
