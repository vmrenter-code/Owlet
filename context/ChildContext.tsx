import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import { birthdayFromApi } from '../utils/childFlow';
import { normalizeAvatarKey, type ChildAvatarKey } from '../utils/childAvatars';
import {
  createChildForUser,
  fetchChildrenForUser,
  updateChildForUser,
} from '../src/services/childProfileService';

export type Child = {
  id: string;
  name?: string;
  birthday?: string | null;
  race?: string | null;
  ethnicity?: string | null;
  gender?: string | null;
  avatarKey?: string | null;
  medicalHistory?: string[] | string | null;
  medicalNotes?: string | null;
};

export type CreateChildPayload = {
  name: string;
  birthday?: string | null;
  race?: string;
  ethnicity?: string;
  gender?: string;
  medicalHistory?: string[];
  medicalNotes?: string;
};

export type CreateChildResult = {
  child: Child | null;
  error: string | null;
};

type ChildContextType = {
  children: Child[];
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  updateChildren: () => Promise<void>;
  createChild: (payload: CreateChildPayload) => Promise<CreateChildResult>;
  updateChildFields: (
    childId: string,
    fields: {
      name?: string;
      birthday?: string | null;
      avatarKey?: string;
    },
  ) => Promise<boolean>;
  setChildAvatar: (childId: string, avatarKey: string) => Promise<boolean>;
  getAvatarKey: (childId: string) => ChildAvatarKey | null;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

function firebaseErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Could not save your child\'s profile. Please try again.';
}

export function ChildProvider({ children: reactChildren }: { children: ReactNode }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  const applyChildrenList = useCallback((list: Child[], keepSelectedId?: string) => {
    setChildren(list);
    setSelectedChild((prev) => {
      const id = keepSelectedId ?? prev?.id;
      if (id) {
        const match = list.find((c) => c.id === id);
        if (match) return match;
      }
      return list[0] ?? null;
    });
  }, []);

  const getAvatarKey = useCallback(
    (childId: string): ChildAvatarKey | null => {
      const child = children.find((c) => c.id === childId);
      if (child?.avatarKey) return normalizeAvatarKey(child.avatarKey);
      return null;
    },
    [children],
  );

  const updateChildren = useCallback(async () => {
    if (!uid) return;
    try {
      const list = await fetchChildrenForUser(uid);
      applyChildrenList(list);
    } catch (err) {
      console.error('ChildContext fetch error:', err);
    }
  }, [uid, applyChildrenList]);

  const setChildAvatar = useCallback(
    async (childId: string, avatarKey: string): Promise<boolean> => {
      if (!uid) return false;
      const key = normalizeAvatarKey(avatarKey);
      if (!key) return false;

      try {
        const updated = await updateChildForUser(uid, childId, { avatarKey: key });
        if (!updated) return false;
        setChildren((current) =>
          current.map((c) => (c.id === childId ? updated : c)),
        );
        setSelectedChild((prev) => (prev?.id === childId ? updated : prev));
        return true;
      } catch {
        return false;
      }
    },
    [uid],
  );

  const createChild = useCallback(
    async (payload: CreateChildPayload): Promise<CreateChildResult> => {
      if (!uid) {
        return { child: null, error: 'You are not signed in. Please log in and try again.' };
      }

      try {
        const child = await createChildForUser(uid, payload);
        setChildren((current) => [...current, child]);
        setSelectedChild(child);
        return { child, error: null };
      } catch (err) {
        return { child: null, error: firebaseErrorMessage(err) };
      }
    },
    [uid],
  );

  const updateChildFields = useCallback(
    async (
      childId: string,
      fields: { name?: string; birthday?: string | null; avatarKey?: string },
    ): Promise<boolean> => {
      if (!uid) return false;

      try {
        const patched = await updateChildForUser(uid, childId, {
          ...fields,
          birthday:
            fields.birthday !== undefined && fields.birthday !== null
              ? birthdayFromApi(fields.birthday)
              : fields.birthday,
          avatarKey:
            fields.avatarKey !== undefined
              ? normalizeAvatarKey(fields.avatarKey) ?? undefined
              : undefined,
        });
        if (!patched) return false;

        setChildren((current) =>
          current.map((c) => (c.id === childId ? patched : c)),
        );
        setSelectedChild((prev) => (prev?.id === childId ? patched : prev));
        return true;
      } catch {
        return false;
      }
    },
    [uid],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setChildren([]);
        setSelectedChild(null);
        return;
      }

      setUid(user.uid);
      try {
        const list = await fetchChildrenForUser(user.uid);
        applyChildrenList(list);
      } catch (err) {
        console.error('ChildContext init error:', err);
      }
    });

    return unsubscribe;
  }, [applyChildrenList]);

  return (
    <ChildContext.Provider
      value={{
        children,
        selectedChild,
        setSelectedChild,
        updateChildren,
        createChild,
        updateChildFields,
        setChildAvatar,
        getAvatarKey,
      }}
    >
      {reactChildren}
    </ChildContext.Provider>
  );
}

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within ChildProvider');
  }
  return context;
};
