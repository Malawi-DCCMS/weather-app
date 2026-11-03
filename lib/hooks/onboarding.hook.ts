import { useState } from 'react';

import { storage } from '@/lib/storage';

const ONBOARDED_KEY = 'settings.onboarded';

type ReturnType = [
  loading: boolean,
  hasOnboarded: boolean,
  markOnboarded: () => Promise<void>,
];

// Single app-level flag, not domain data, so it lives in storage rather
// than the location store. MMKV reads are synchronous, so `loading` is
// always false — kept in the tuple for API compatibility with call sites.
export function useOnboarding(): ReturnType {
  const [hasOnboarded, setHasOnboarded] = useState(() => storage.getBoolean(ONBOARDED_KEY) ?? false);

  const markOnboarded = async () => {
    setHasOnboarded(true);
    storage.set(ONBOARDED_KEY, true);
  };

  return [false, hasOnboarded, markOnboarded];
}
