import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Child, CreateChildPayload } from '../../context/ChildContext';
import { normalizeAvatarKey } from '../../utils/childAvatars';
import { birthdayFromApi } from '../../utils/childFlow';

function storageKey(uid: string) {
  return `accountChildren:${uid}`;
}

function childrenCollection(uid: string) {
  return collection(db, 'users', uid, 'children');
}

function isPermissionDenied(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'permission-denied'
  );
}

function makeChildId() {
  return `child_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function docToChild(id: string, data: Record<string, unknown>): Child {
  const medical = data.medicalHistory;
  let medicalHistory: Child['medicalHistory'] = null;
  if (Array.isArray(medical)) {
    medicalHistory = medical as string[];
  } else if (typeof medical === 'string') {
    try {
      const parsed = JSON.parse(medical);
      medicalHistory = Array.isArray(parsed) ? parsed : medical;
    } catch {
      medicalHistory = medical;
    }
  }

  return {
    id,
    name: (data.name as string) ?? undefined,
    birthday: data.birthday ? birthdayFromApi(String(data.birthday)) : null,
    race: (data.race as string) ?? null,
    ethnicity: (data.ethnicity as string) ?? null,
    gender: (data.gender as string) ?? null,
    avatarKey: data.avatarKey
      ? normalizeAvatarKey(String(data.avatarKey)) ?? undefined
      : undefined,
    medicalHistory,
    medicalNotes: (data.medicalNotes as string) ?? null,
  };
}

async function loadLocalChildren(uid: string): Promise<Child[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Child[]) : [];
  } catch {
    return [];
  }
}

async function saveLocalChildren(uid: string, list: Child[]) {
  await AsyncStorage.setItem(storageKey(uid), JSON.stringify(list));
}

async function fetchChildrenFromFirestore(uid: string): Promise<Child[]> {
  const snap = await getDocs(childrenCollection(uid));
  return snap.docs
    .map((d) => docToChild(d.id, d.data()))
    .sort((a, b) => a.name?.localeCompare(b.name ?? '') ?? 0);
}

export async function fetchChildrenForUser(uid: string): Promise<Child[]> {
  try {
    return await fetchChildrenFromFirestore(uid);
  } catch (err) {
    if (isPermissionDenied(err)) {
      return loadLocalChildren(uid);
    }
    throw err;
  }
}

export async function createChildForUser(
  uid: string,
  payload: CreateChildPayload,
): Promise<Child> {
  const ref = doc(childrenCollection(uid));
  const child: Child = {
    id: ref.id,
    name: payload.name.trim(),
    birthday: payload.birthday ?? null,
    race: payload.race ?? null,
    ethnicity: payload.ethnicity ?? null,
    gender: payload.gender ?? null,
    medicalHistory: payload.medicalHistory ?? null,
    medicalNotes: payload.medicalNotes ?? null,
  };

  try {
    await setDoc(ref, {
      ...child,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return child;
  } catch (err) {
    if (!isPermissionDenied(err)) throw err;

    const localChild: Child = { ...child, id: makeChildId() };
    const existing = await loadLocalChildren(uid);
    await saveLocalChildren(uid, [...existing, localChild]);
    return localChild;
  }
}

export async function updateChildForUser(
  uid: string,
  childId: string,
  fields: Partial<Child>,
): Promise<Child | null> {
  const ref = doc(db, 'users', uid, 'children', childId);
  const patch: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (fields.name !== undefined) patch.name = fields.name;
  if (fields.birthday !== undefined) patch.birthday = fields.birthday;
  if (fields.avatarKey !== undefined) patch.avatarKey = fields.avatarKey;
  if (fields.race !== undefined) patch.race = fields.race;
  if (fields.ethnicity !== undefined) patch.ethnicity = fields.ethnicity;

  try {
    await updateDoc(ref, patch);
    const list = await fetchChildrenFromFirestore(uid);
    return list.find((c) => c.id === childId) ?? null;
  } catch (err) {
    if (!isPermissionDenied(err)) throw err;

    const existing = await loadLocalChildren(uid);
    const index = existing.findIndex((c) => c.id === childId);
    if (index < 0) return null;

    const updated: Child = {
      ...existing[index],
      ...(fields.name !== undefined ? { name: fields.name } : {}),
      ...(fields.birthday !== undefined ? { birthday: fields.birthday } : {}),
      ...(fields.avatarKey !== undefined ? { avatarKey: fields.avatarKey } : {}),
      ...(fields.race !== undefined ? { race: fields.race } : {}),
      ...(fields.ethnicity !== undefined ? { ethnicity: fields.ethnicity } : {}),
    };
    const next = [...existing];
    next[index] = updated;
    await saveLocalChildren(uid, next);
    return updated;
  }
}
