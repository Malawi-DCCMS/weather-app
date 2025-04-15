import React from 'react';
import { ImageBackground, StyleSheet, View, Linking, ListRenderItemInfo, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import AppBar from '@/components/AppBar';
import Alerts from '@/components/Alerts';

import { RootState } from '@/lib/store';
import { useTranslation } from 'react-i18next';

const bulletListIcon = require('@/assets/time-period-bullet.png');
const appBackground = require('@/assets/new-glass-bg.png');

function AboutTheAppScreen(): JSX.Element {
  const { t } = useTranslation();
  const { lat, lon } = useSelector((state: RootState) => state.location);

  const getPartners = (): Array<string> => ([
    'Norwegian Meteorological Institute',
    'NORAD',
    'NORCAP',
    'World Meteorological Organisation',
    'Save the Children'
  ]);

  const renderPartner = (item: ListRenderItemInfo<string>) => <View style={styles.partnerItem}>
    <Image style={styles.bulletStyle} source={bulletListIcon} /><Text style={styles.partnerText}> {item.item}</Text>
  </View>;

  const onClickURL = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={t("About the app")} />
          <Alerts lat={lat} lon={lon} location={"About the app"} />
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
                        <Text style={styles.title}>{t('app.and.forecasts')}</Text>
                      </Paragraph>
                      <Paragraph>
                        <Text style={styles.whiteText}>
                          {t('app.and.forecasts.desc')}
                        </Text>
                      </Paragraph>
                      <View>
                        <View>
                          <Text style={styles.whiteHeader}>
                            {"\n"}{t('partners')}:
                          </Text>
                          <FlatList data={getPartners()} renderItem={(item: ListRenderItemInfo<string>) => renderPartner(item)} key={new Date().toISOString()} />
                        </View>
                      </View>
                      <Paragraph>
                        <Text style={styles.whiteHeader}>{"\n"}{t('Icons')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          <Text style={styles.whiteText}>
                            {t("icons.disclaimer")} <Text onPress={() => onClickURL('https://yr.no/NRK')} style={{ ...styles.whiteText, ...styles.ln }}>yr.no/NRK</Text>.
                          </Text>{"\n"}{"\n"}
                          {t('warning.icons.disclaimer')}
                        </Text>
                      </Paragraph>
                      <Paragraph>
                        <Text style={styles.whiteHeader}>{"\n"}{t('Geographical Data')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          {t('geographical.data.disclaimer')} <Text onPress={() => onClickURL('https://download.geonames.org/export/dump/MW.zip')} style={{ ...styles.whiteText, ...styles.ln }}>Geonames</Text>.
                        </Text>
                      </Paragraph>
                      <Paragraph>
                        <Text style={styles.whiteHeader}>{"\n"}{t('Background photo')}</Text>{"\n"}
                        <Text style={styles.whiteText}>
                          {t('background.photo.disclaimer')}{"\n"}{"\n"}{"\n"}
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
