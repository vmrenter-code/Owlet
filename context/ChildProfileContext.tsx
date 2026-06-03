import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import ChildSwitcherSheet from '../components/ChildSwitcherSheet';
import { useChild } from './ChildContext';
import { birthdayFromApi } from '../utils/childFlow';

export type ChildProfile = {
  id: string;
  name: string;
};

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

const EMPTY_ACTIVE: ChildProfile = { id: '', name: 'Your child' };

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const {
    children: childList,
    selectedChild,
    selectChild,
    updateChildName: syncChildName,
    updateChildBirthDate: syncChildBirthDate,
  } = useChild();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  const profiles: ChildProfile[] = useMemo(
    () =>
      childList.map((c) => ({
        id: c.id,
        name: (c.name && c.name.trim()) || 'Child',
      })),
    [childList],
  );

  const birthDates = useMemo(() => {
    const map: Record<string, string> = {};
    childList.forEach((c) => {
      const iso = birthdayFromApi(c.birthday);
      if (iso) map[c.id] = iso;
    });
    return map;
  }, [childList]);

  const activeChildId = selectedChild?.id ?? profiles[0]?.id ?? '';
  const activeChild =
    profiles.find((p) => p.id === activeChildId) ?? profiles[0] ?? EMPTY_ACTIVE;

  const setActiveChildId = (id: string) => {
    const match = childList.find((c) => c.id === id);
    if (match) selectChild(match).catch(() => {});
  };

  const updateChildName = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    syncChildName(id, trimmed);
  };

  const updateChildBirthDate = (id: string, isoDate: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return;
    syncChildBirthDate(id, isoDate);
  };

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
      <ChildSwitcherSheet />
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
