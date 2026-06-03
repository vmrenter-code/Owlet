import { useEffect, useState } from 'react';
import type { ChildAvatarKey } from '../utils/childAvatars';
import { getChildAvatarKey } from '../utils/childAvatarStorage';

export function useChildAvatarKey(childId: string | null | undefined) {
  const [avatarKey, setAvatarKey] = useState<ChildAvatarKey | null>(null);

  useEffect(() => {
    if (!childId) {
      setAvatarKey(null);
      return;
    }
    let cancelled = false;
    getChildAvatarKey(childId).then((key) => {
      if (!cancelled) setAvatarKey(key);
    });
    return () => {
      cancelled = true;
    };
  }, [childId]);

  return avatarKey;
}
