import { createMMKV } from 'react-native-mmkv';

// createMMKV() resolves to the native Nitro binding on iOS/Android, and
// to react-native-mmkv's own localStorage-backed implementation on web
// (createMMKV.web.ts) via Metro's platform-specific file resolution.
const mmkv = createMMKV();

// Expo Router's web build renders once on the server before the browser
// hydrates it, and react-native-mmkv's web implementation (backed by
// `localStorage`) throws synchronously there, since `localStorage` doesn't
// exist in that environment. Treat that as "no stored value yet" — the
// same lazy `useState(() => storage.getX(...))` initializer runs again on
// the client during hydration, where `localStorage` is real, and picks up
// the actual stored value then.
function safely<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export const storage = {
  getString: (key: string): string | undefined => safely(() => mmkv.getString(key), undefined),
  getBoolean: (key: string): boolean | undefined => safely(() => mmkv.getBoolean(key), undefined),
  set: (key: string, value: string | number | boolean): void => safely(() => mmkv.set(key, value), undefined),
};

// Web Storage-shaped (getItem/setItem/removeItem, string-only) adapter for
// libraries that expect that interface rather than MMKV's native one —
// TanStack Query's persister and Zustand's persist middleware both target
// it, and both serialize their state to a JSON string before storing.
export const jsonStorage = {
  getItem: (key: string): string | null => safely(() => mmkv.getString(key) ?? null, null),
  setItem: (key: string, value: string): void => safely(() => mmkv.set(key, value), undefined),
  removeItem: (key: string): void => safely<void>(() => { mmkv.remove(key); }, undefined),
};
