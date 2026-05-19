import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChildProfile = {
  id: string;
  name: string;
};

export const DEFAULT_CHILD_PROFILES: ChildProfile[] = [
  { id: 'babyy', name: 'Babyy' },
  { id: 'baby2', name: 'Baby2' },
  { id: 'baby3', name: 'Baby3' },
];

/** Backwards-compat re-export for existing imports. */
export const CHILD_PROFILES = DEFAULT_CHILD_PROFILES;

const ACTIVE_KEY = 'activeChildId';
const NAMES_KEY = 'childProfileNames';
const BIRTHDATES_KEY = 'childProfileBirthDates';
const DEFAULT_CHILD_ID = 'baby2';
const MAX_NAME_LENGTH = 30;

type ChildProfileContextType = {
  activeChildId: string;
  activeChild: ChildProfile;
  setActiveChildId: (id: string) => void;
  profiles: ChildProfile[];
  updateChildName: (id: string, name: string) => void;
  birthDates: Record<string, string>;
  updateChildBirthDate: (id: string, isoDate: string) => void;
  switcherOpen: boolean;
  openSwitcher: () => void;
  closeSwitcher: () => void;
};

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(undefined);

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const [activeChildId, setActiveChildIdState] = useState<string>(DEFAULT_CHILD_ID);
  const [profiles, setProfiles] = useState<ChildProfile[]>(DEFAULT_CHILD_PROFILES);
  const [birthDates, setBirthDates] = useState<Record<string, string>>({});
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [savedActive, savedNamesRaw, savedBirthDatesRaw] = await Promise.all([
          AsyncStorage.getItem(ACTIVE_KEY),
          AsyncStorage.getItem(NAMES_KEY),
          AsyncStorage.getItem(BIRTHDATES_KEY),
        ]);
        if (cancelled) return;

        if (savedNamesRaw) {
          try {
            const overrides = JSON.parse(savedNamesRaw) as Record<string, string>;
            setProfiles(
              DEFAULT_CHILD_PROFILES.map((p) =>
                overrides[p.id] && overrides[p.id].trim().length > 0
                  ? { ...p, name: overrides[p.id] }
                  : p,
              ),
            );
          } catch {
            // Ignore malformed override blob
          }
        }

        if (savedBirthDatesRaw) {
          try {
            const parsed = JSON.parse(savedBirthDatesRaw) as Record<string, string>;
            if (parsed && typeof parsed === 'object') {
              setBirthDates(parsed);
            }
          } catch {
            // Ignore malformed birth date blob
          }
        }

        if (savedActive && DEFAULT_CHILD_PROFILES.some((p) => p.id === savedActive)) {
          setActiveChildIdState(savedActive);
        }
      } catch {
        // Ignore: keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setActiveChildId = (id: string) => {
    setActiveChildIdState(id);
    AsyncStorage.setItem(ACTIVE_KEY, id).catch(() => {
      // Non-fatal
    });
  };

  const updateChildName = (id: string, name: string) => {
    const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
    if (!trimmed) return;
    setProfiles((current) => {
      const next = current.map((p) => (p.id === id ? { ...p, name: trimmed } : p));
      const overrides: Record<string, string> = {};
      next.forEach((p) => {
        const original = DEFAULT_CHILD_PROFILES.find((d) => d.id === p.id);
        if (original && original.name !== p.name) {
          overrides[p.id] = p.name;
        }
      });
      AsyncStorage.setItem(NAMES_KEY, JSON.stringify(overrides)).catch(() => {
        // Non-fatal
      });
      return next;
    });
  };

  const updateChildBirthDate = (id: string, isoDate: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return;
    setBirthDates((current) => {
      const next = { ...current, [id]: isoDate };
      AsyncStorage.setItem(BIRTHDATES_KEY, JSON.stringify(next)).catch(() => {
        // Non-fatal
      });
      return next;
    });
  };

  const activeChild = profiles.find((p) => p.id === activeChildId) ?? profiles[0];

  return (
    <ChildProfileContext.Provider
      value={{
        activeChildId,
        activeChild,
        setActiveChildId,
        profiles,
        updateChildName,
        birthDates,
        updateChildBirthDate,
        switcherOpen,
        openSwitcher: () => setSwitcherOpen(true),
        closeSwitcher: () => setSwitcherOpen(false),
      }}
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
