import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { normalizeAvatarKey, type ChildAvatarKey } from './childAvatars';

function storageKey(uid: string) {
  return `childAvatars:${uid}`;
}

async function loadMap(uid: string): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function getChildAvatarKey(
  childId: string,
): Promise<ChildAvatarKey | null> {
  const user = getAuth().currentUser;
  if (!user || !childId) return null;
  const map = await loadMap(user.uid);
  const key = map[childId];
  return key ? normalizeAvatarKey(key) : null;
}

export async function setChildAvatarKey(
  childId: string,
  avatarKey: string,
): Promise<boolean> {
  const user = getAuth().currentUser;
  const normalized = normalizeAvatarKey(avatarKey);
  if (!user || !normalized) return false;

  const map = await loadMap(user.uid);
  map[childId] = normalized;
  await AsyncStorage.setItem(storageKey(user.uid), JSON.stringify(map));
  return true;
}
