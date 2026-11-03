import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { placeByCurrentLocation } from '@/lib/geo/location';
import { jsonStorage } from '@/lib/storage';

type LocationState = {
  name: string;
  lat?: number;
  lon?: number;
  loading: boolean;
  error?: string;
};

type LocationActions = {
  setName: (name: string) => void;
  setLat: (lat: number) => void;
  setLon: (lon: number) => void;
  setLocation: (location: { name: string; lat: number; lon: number }) => void;
  resetError: () => void;
  // Resolves the device's GPS position to the nearest known place (see
  // lib/geo/location.ts) — an offline lookup, not a network call.
  getPreciseLocation: () => Promise<void>;
};

export const useLocationStore = create<LocationState & LocationActions>()(
  persist(
    (set) => ({
      name: '',
      lat: undefined,
      lon: undefined,
      loading: false,
      error: undefined,

      setName: (name) => set({ name }),
      setLat: (lat) => set({ lat }),
      setLon: (lon) => set({ lon }),
      setLocation: ({ name, lat, lon }) => set({ name, lat, lon }),
      resetError: () => set({ error: undefined }),

      getPreciseLocation: async () => {
        set({ loading: true });
        try {
          const place = await placeByCurrentLocation();
          set({ loading: false, name: place.name, lat: place.latitude, lon: place.longitude });
        } catch (error) {
          console.error('Loading location rejected.', error);
          set({ loading: false, error: 'There was a problem figuring out where you are, :(.' });
        }
      },
    }),
    {
      name: 'location-store',
      storage: createJSONStorage(() => jsonStorage),
      // loading/error are per-session, not something a restart should
      // resurrect — only the resolved location itself is worth persisting,
      // so the app can render a last-known place instantly on cold start
      // instead of waiting on GPS.
      partialize: (state) => ({ name: state.name, lat: state.lat, lon: state.lon }),
    }
  )
);
