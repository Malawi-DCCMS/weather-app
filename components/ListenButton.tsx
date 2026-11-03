import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Portal, Snackbar } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';

import { Radius } from '@/lib/theme';

// Maps i18next locale codes to expo-speech voice locales. Only English is a
// real locale today — Swahili is added here once Step 6 registers it so this
// doesn't need to change later.
const SPEECH_LANGUAGES: Record<string, string> = {
  en: 'en-US',
  sw: 'sw-KE',
};

type ListenButtonProps = {
  text: string;
  textColor: string;
  backgroundColor: string;
};

function ListenButton({ text, textColor, backgroundColor }: ListenButtonProps) {
  const { t, i18n } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const onSpeechEnd = () => {
    setSpeaking(false);
  };

  // Fires when the native TTS engine exists but rejects/fails the
  // utterance (Android only per expo-speech — iOS never calls this).
  const onSpeechFailure = (error?: Error) => {
    if (error) {
      console.warn('[ListenButton] TTS error:', error.message);
    }
    setSpeaking(false);
    setUnavailable(true);
  };

  const toggle = async () => {
    if (speaking) {
      await Speech.stop();
      onSpeechEnd();
      return;
    }

    setSpeaking(true);
    Speech.speak(text, {
      language: SPEECH_LANGUAGES[i18n.language] ?? 'en-US',
      onDone: onSpeechEnd,
      onStopped: onSpeechEnd,
      onError: onSpeechFailure,
      rate: .85,
      pitch: 1,
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={toggle}
        accessibilityLabel={speaking ? t('alert.stop') : t('alert.listen')}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon source={speaking ? 'stop' : 'volume-high'} size={20} color={textColor} />
      </TouchableOpacity>
      <Portal>
        <Snackbar visible={unavailable} onDismiss={() => setUnavailable(false)} duration={4000}>
          {t('alert.listen.unavailable')}
        </Snackbar>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: Radius.extraLarge,
  },
});

export default ListenButton;
