import { JSX, useEffect, useRef } from 'react';

type AlertAreaMapProps = {
  polygon: unknown;
  color: string;
  showUserLocation?: boolean;
  onMapLoaded?: () => void;
};

// react-native-maps has no working web implementation in this project's
// react-native-web setup (its native component files call
// codegenNativeComponent() at module scope, which crashes the web bundle
// even when the component itself never renders on web) — Metro's platform
// extension picks this file over AlertAreaMap.tsx for web builds
// specifically so that import chain never gets pulled in. Native-only
// feature; omitted entirely on web rather than shown broken.
function AlertAreaMap({ onMapLoaded }: AlertAreaMapProps): JSX.Element | null {
  // Never renders a map, so there's nothing to wait for — signal "loaded"
  // immediately so a caller doing an off-screen snapshot (AlertShareCard)
  // doesn't sit through its full timeout on every web share.
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      onMapLoaded?.();
    }
  }, [onMapLoaded]);

  return null;
}

export default AlertAreaMap;
