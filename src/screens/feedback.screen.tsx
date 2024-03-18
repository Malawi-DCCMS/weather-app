import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Dialog, Icon, Text } from 'react-native-paper';

import appBackground from '../../assets/appbackground.png';
import loveActive from '../../assets/love-active.png';
import loveInactive from '../../assets/love-inactive.png';
import disableActive from '../../assets/disable-heart-active.png';
import disableInActive from '../../assets/disable-heart-inactive.png';
import submitSuccess from '../../assets/submit-success.png';
import AppBar from '../components/AppBar';
import { RootState } from '../store';
import { LOGGER } from '../lib';
import { RootDrawerParamList } from '../common';
import { SCREENS } from '../constants/screens.constant';
import { FadeIn } from '../components/FadeIn';
import { GlassView } from '../components/GlassView';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Feedback'>;
const FeedbackScreen = ({ navigation }: ScreenProps) => {
  const { name } = useSelector((state: RootState) => state.location);
  const [loved, setLoved] = useState<boolean>(false);
  const [notLoved, setNotLoved] = useState<boolean>(false);
  const [text, setText] = useState<string>('Write here...');
  const [showValidationError, setShowValidationError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    clear();
  }, []);

  const DEFAULT_TEXT = 'Write here...';

  const submit = () => {
    if ((!loved && !notLoved) || text === DEFAULT_TEXT) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    setSuccess(true);
    LOGGER.info('Submitting...', loved, notLoved, text);
  };

  const clear = () => {
    setLoved(false);
    setNotLoved(false);
    setText(DEFAULT_TEXT);
    setSuccess(false);
  };

  const cancel = () => {
    clear();
    navigation.goBack();
  };
  const close = () => {
    clear();
    navigation.navigate(SCREENS.Home);
  };

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={name} navigation={navigation} />
          <ScrollView contentContainerStyle={styles.outer} snapToStart={false}>
            {!success && <GlassView glassStyle={styles.container} containerStyle={styles.container} blurStyle={{ blurAmount: 8, blurType: 'light' }}>
              <View style={styles.opacity}>
                <View><Text style={styles.header}>Help us become better!</Text></View>
                <View style={styles.smileys}>
                  <TouchableOpacity onPress={() => (setLoved(true), setNotLoved(false))}><View style={styles.smiley}><Icon source={loved ? loveActive : loveInactive} size={50} /></View></TouchableOpacity>
                  <TouchableOpacity onPress={() => (setNotLoved(true), setLoved(false))}><View style={styles.smiley}><Icon source={notLoved ? disableActive : disableInActive} size={60} /></View></TouchableOpacity>
                </View>
                <View><Text style={styles.headerSmall}>Anything you would like to tell add?</Text></View>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <TextInput style={styles.saymore} multiline editable onChangeText={setText} underlineColorAndroid={'transparent'} placeholder='Write here...' defaultValue={text}></TextInput>
                </View>
                <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Button onPress={() => cancel()} style={styles.cancelButton} textColor='white'><Text style={styles.buttonText}>Cancel</Text></Button>
                  <Button onPress={() => submit()} style={styles.sendButton} textColor='white'><Text style={styles.buttonText}>Send</Text></Button>
                </View>
              </View>
            </GlassView>
            }
            {success && (<FadeIn style={styles.fadeInContainer}><GlassView glassStyle={styles.container} containerStyle={styles.container} blurStyle={{ blurAmount: 8, blurType: 'light' }}>
              <View style={styles.opacity}>
                <View style={styles.closeIcon}><TouchableOpacity onPress={() => close()}><Icon source='close' size={40} color='white' /></TouchableOpacity></View>
                <View><Text style={styles.successHeader}>Thank you!</Text></View>
                <View style={styles.smileys}>
                  <View style={styles.successIcon}><Icon source={submitSuccess} size={177} /></View>
                </View>
              </View>
            </GlassView></FadeIn>)
            }
          </ScrollView>
          <Dialog visible={showValidationError} onDismiss={() => setShowValidationError(false)}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Please make sure that you have filled the feedback form.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowValidationError(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </ImageBackground>
      </View>
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
    marginTop: 16,
    marginLeft: 19,
    marginRight: 19,
    width: '95%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: .1,
  },
  fadeInContainer: {},
  opacity: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, .1)',
    paddingBottom: 21,
  },
  outer: { flexDirection: 'column', alignItems: 'center' },
  bg: {
    height: '100%',
  },
  header: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    color: 'white',
    fontWeight: "400",
    marginTop: 32,
  },
  successHeader: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    color: 'white',
    fontWeight: "400",
    marginTop: 17,
  },
  header2: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 20,
    marginTop: 25,
  },
  headerSmall: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: 'white',
    fontWeight: "400",
    marginTop: 15,
    marginBottom: 5,
  },
  smileys: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    width: '70%',
  },
  successIcon: {
    marginTop: 50,
    marginBottom: 39,
  },
  closeIcon: {
    paddingRight: 13,
    paddingTop: 13,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smiley: {
    margin: 7,
  },
  saymore: {
    backgroundColor: 'rgba(255, 255, 255, 0.21)',
    color: 'white',
    width: '90%',
    margin: 10,
    borderRadius: 15,
    flexWrap: 'wrap',
    minHeight: 207,
    borderWidth: 0,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  submit: {
    flex: 1,
    justifyContent: 'flex-start',
    margin: 4,
  },
  cancel: {
    flex: 3.5,
    justifyContent: 'flex-end',
    margin: 4,
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'flex-start',
    marginRight: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.21)',
    fontFamily: 'OpenSans',
    borderRadius: 4,
    color: 'white',
    lineHeight: 27,
    fontSize: 20,
    padding: 1,
  },
  sendButton: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(71, 85, 105, 1)',
    fontFamily: 'OpenSans',
    borderRadius: 4,
    color: 'white',
    lineHeight: 27,
    fontSize: 20,
    padding: 1,
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  },
})