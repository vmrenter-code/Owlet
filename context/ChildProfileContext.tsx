import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChildProfile = {
  id: string;
  name: string;
};

export const CHILD_PROFILES: ChildProfile[] = [
  { id: 'babyy', name: 'Babyy' },
  { id: 'baby2', name: 'Baby2' },
  { id: 'baby3', name: 'Baby3' },
];

const STORAGE_KEY = 'activeChildId';
const DEFAULT_CHILD_ID = 'baby2';

type ChildProfileContextType = {
  activeChildId: string;
  activeChild: ChildProfile;
  setActiveChildId: (id: string) => void;
  profiles: ChildProfile[];
};

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(undefined);

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const [activeChildId, setActiveChildIdState] = useState<string>(DEFAULT_CHILD_ID);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && saved && CHILD_PROFILES.some((p) => p.id === saved)) {
          setActiveChildIdState(saved);
        }
      } catch {
        // Ignore: keep default
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setActiveChildId = (id: string) => {
    setActiveChildIdState(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {
      // Non-fatal
    });
  };

  const activeChild =
    CHILD_PROFILES.find((p) => p.id === activeChildId) ?? CHILD_PROFILES[0];

  return (
    <ChildProfileContext.Provider
      value={{ activeChildId, activeChild, setActiveChildId, profiles: CHILD_PROFILES }}
    >
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const ctx = useContext(ChildProfileContext);
  if (!ctx) {
    throw new Error('useChildProfile must be used within a ChildProfileProvider');
  }
  return ctx;
}
