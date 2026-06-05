import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../src/config/apiBaseUrl';

export type Child = {
  id: string;
  name?: string;
  birthday?: string | null;
  race?: string | null;
  ethnicity?: string | null;
};

type ChildContextType = {
  children: Child[];
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  selectChild: (child: Child | null) => Promise<void>;
  updateChildren: () => Promise<void>;
  updateChildName: (childId: string, newName: string) => void;
  updateChildBirthDate: (childId: string, birthday: string | null) => void;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

const SELECTED_CHILD_KEY = 'selectedChildId';

export const ChildProvider = ({ children: ReactChildren }: { children: React.ReactNode }) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const selectChild = async (child: Child | null) => {
    setSelectedChild(child);

    if (child?.id) {
      await AsyncStorage.setItem(SELECTED_CHILD_KEY, child.id);
    } else {
      await AsyncStorage.removeItem(SELECTED_CHILD_KEY);
    }
  };

  const updateChildren = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE_URL}/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!data || !Array.isArray(data)) return;

    setChildren(data);

    setSelectedChild((prev) => {
      if (!prev) return data[0] ?? null;
      const match = data.find((c: Child) => c.id === prev.id);
      return match ?? data[0] ?? null;
    });
  };

  const updateChildName = (childId: string, newName: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId ? { ...child, name: newName } : child,
      ),
    );

    setSelectedChild((prev) =>
      prev && prev.id === childId ? { ...prev, name: newName } : prev,
    );
  };

  const updateChildBirthDate = (childId: string, birthday: string | null) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId ? { ...child, birthday } : child,
      ),
    );

    setSelectedChild((prev) =>
      prev && prev.id === childId ? { ...prev, birthday } : prev,
    );
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChildren([]);
        await AsyncStorage.removeItem(SELECTED_CHILD_KEY);
        setSelectedChild(null);
        return;
      }

      try {
        const token = await user.getIdToken();

        const syncController = new AbortController();
        const syncTimeout = setTimeout(() => syncController.abort(), 8000);
        try {
          await fetch(`${API_BASE_URL}/users/sync`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            signal: syncController.signal,
          });
        } finally {
          clearTimeout(syncTimeout);
        }

        const childController = new AbortController();
        const childTimeout = setTimeout(() => childController.abort(), 8000);
        let res: Response;
        try {
          res = await fetch(`${API_BASE_URL}/children`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: childController.signal,
          });
        } finally {
          clearTimeout(childTimeout);
        }
        const childrenData = await res.json();
        if (!Array.isArray(childrenData)) {
          console.error('ChildContext init error: /children did not return an array', JSON.stringify(childrenData));
          return;
        }

        setChildren(childrenData);

        const savedChildId = await AsyncStorage.getItem(SELECTED_CHILD_KEY);
        const restoredChild =
          childrenData.find((c: Child) => c.id === savedChildId) ||
          childrenData[0] ||
          null;

        setSelectedChild(restoredChild);
        if (restoredChild?.id) {
          await AsyncStorage.setItem(SELECTED_CHILD_KEY, restoredChild.id);
        }
      } catch (err) {
        console.error('ChildContext init error:', err);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ChildContext.Provider
      value={{
        children,
        selectedChild,
        setSelectedChild,
        selectChild,
        updateChildren,
        updateChildName,
        updateChildBirthDate,
      }}
    >
      {ReactChildren}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within ChildProvider');
  }
  return context;
};
