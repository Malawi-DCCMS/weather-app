import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon, Paragraph, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-native-input-select';

import appBackground from '../../assets/new-glass-bg.png';
import AppBar from '../components/AppBar';
import { LANGUAGES, RootDrawerParamList } from '../common';
import Alerts from '../components/Alerts';
import { AppDispatch, RootState } from '../store';
import { persistLanguage } from '../store/settings.slice';
import { useTranslation } from 'react-i18next';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Settings'>;
function SettingsScreen({ navigation }: ScreenProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();
  const { alerts } = useSelector((state: RootState) => state.alerts);
  const { lat, lon } = useSelector((state: RootState) => state.location);
  const { language: lang } = useSelector((state: RootState) => state.settings.appSettings);
  const [language, setLanguage] = React.useState<string>(lang || LANGUAGES.English);

  useEffect(() => {
    if (!language) {
      return;
    }
    i18n.changeLanguage(language).then(() => dispatch(persistLanguage(language))).catch(console.error);
  }, [language]);

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={"Settings"} navigation={navigation} />
          <Alerts alerts={alerts[`${lat}${lon}`]} location={"Settings"} navigator={navigation} />
          <View style={styles.container}>
            <View style={styles.opacity}>
              <View style={styles.content}>
                <Paragraph>
                  <Text style={styles.title}>
                   {t('Language')}
                  </Text>
                </Paragraph>
                <Dropdown
                  label="Language"
                  placeholder="Select a language..."
                  options={[
                    { label: t('Chichewa'), value: 'chichewa' },
                    { label: t('English'), value: 'english' },
                  ]}
                  selectedValue={language}
                  onValueChange={value => setLanguage(value as string)}
                  primaryColor={'#313131'}
                  dropdownStyle={styles.dropdownStyle}
                  placeholderStyle={{ color: 'white' }}
                  selectedItemStyle={{ color: 'white' }}
                  dropdownIconStyle={{ borderColor: 'white', borderWidth: 1, borderRadius: 1000 }}
                  dropdownIcon={<Icon source={'chevron-down'} color='white' size={24} />}
                />
              </View>
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
    fontSize: 18,
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
    marginTop: 24,
    marginLeft: 32,
    marginRight: 58,
  },
});

export default SettingsScreen;
