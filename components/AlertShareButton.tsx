import React, { useRef, useState } from 'react';
import { ActivityIndicator, HostInstance, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import AlertShareCard from './AlertShareCard';
import { CAPAlert } from '@/lib/alerts/providers/cap-alerts/alert';
import { Radius } from '@/lib/theme';

type AlertShareButtonProps = {
  alert: CAPAlert;
  textColor: string;
  backgroundColor: string;
};

// The card embeds a live mini map (async tile loading) — wait for it to
// report ready before snapshotting, but never block sharing indefinitely
// on a slow/failed network fetch.
const MAP_READY_TIMEOUT_MS = 3000;

// Mounts the branded AlertShareCard off-screen only while a share is in
// progress, purely so it can be captured to a PNG — nothing here is ever
// visible to the user. Not kept mounted permanently: it now embeds a live
// MapLibre map, which is too heavy (GPU/network) to keep alive for every
// alert card just in case it's shared.
function AlertShareButton({ alert, textColor, backgroundColor }: AlertShareButtonProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HostInstance>(null);
  const readyResolveRef = useRef<(() => void) | null>(null);
  const [sharing, setSharing] = useState(false);

  const onShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await new Promise<void>(resolve => {
        readyResolveRef.current = resolve;
        setTimeout(resolve, MAP_READY_TIMEOUT_MS);
      });
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('alert.share.dialogTitle') });
      } else {
        console.warn(t('alert.share.unavailable'));
      }
    } catch (error) {
      console.error('Failed to share alert', error);
    } finally {
      readyResolveRef.current = null;
      setSharing(false);
    }
  };

  const handleCardReady = () => {
    readyResolveRef.current?.();
    readyResolveRef.current = null;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={onShare}
        disabled={sharing}
        accessibilityLabel={t('alert.share')}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {sharing ? <ActivityIndicator size="small" color={textColor} /> : <Icon source="share-variant" size={20} color={textColor} />}
      </TouchableOpacity>

      {sharing && (
        <View style={styles.offscreen} pointerEvents="none">
          <AlertShareCard ref={cardRef} alert={alert} onReady={handleCardReady} />
        </View>
      )}
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
  offscreen: {
    position: 'absolute',
    top: -9999,
    left: -9999,
  },
});

export default AlertShareButton;
