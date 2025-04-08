import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dropdown from 'react-native-input-select';

import Alerts from '@/components/Alerts';
import AppBar from '@/components/AppBar';

import { RootState } from '@/lib/store';
import { useTranslation } from 'react-i18next';

const appBackground = require('@/assets/new-glass-bg.png');

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();

  const options = [
    { label: 'English', value: 'en' },
    { label: 'Chichewa', value: 'chi' },
  ];

  const handleChangeLanguage = (lang: string) => (i18n.changeLanguage(lang), setLanguage(lang));

  const [language, setLanguage] = useState<string>();
  const { name, lat, lon } = useSelector((state: RootState) => state.location);

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={t('Settings')} />
          <Alerts lat={lat} lon={lon} location={name} />
          <View style={styles.container}>
            <View style={styles.opacity}>
              <View style={styles.content}>
                <Paragraph>
                  <Text style={styles.title}>
                    {t('Language')}
                  </Text>
                </Paragraph>
                <Dropdown
                  label={t('Language')}
                  placeholder={t('select.language.placeholder')}
                  options={options}
                  selectedValue={i18n.language}
                  onValueChange={value => handleChangeLanguage(value as string)}
                  primaryColor={'#313131'}
                  dropdownStyle={styles.dropdownStyle}
                  placeholderStyle={{ color: 'white' }}
                  selectedItemStyle={{ color: 'white' }}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default SettingsScreen;

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
  dropdownStyle: {
    flexDirection: 'column',
    flex: 1,
    verticalAlign: 'middle',
    backgroundColor: 'rgba(100, 100, 100, .1)',
    borderColor: 'white',
  },
  whiteHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
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
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
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
    marginTop: 24,
    marginLeft: 32,
    marginRight: 58,
  },
});