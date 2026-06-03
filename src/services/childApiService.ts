import { API_BASE_URL } from '../config/apiBaseUrl';
import { auth } from '../config/firebase';
import type { Child } from '../../context/ChildContext';
import { birthdayFromApi } from '../../utils/childFlow';

export type CreateChildPayload = {
  name: string;
  birthday?: string | null;
  race?: string;
  ethnicity?: string;
  gender?: string;
  medicalHistory?: string[];
  medicalNotes?: string;
};

async function authHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export function mapChildFromApi(raw: Record<string, unknown>): Child {
  return {
    id: String(raw.id),
    name: (raw.name as string) ?? undefined,
    birthday: raw.birthday ? birthdayFromApi(String(raw.birthday)) : null,
  };
}

/** Ensure the Firebase user exists in Prisma before child/screening APIs. */
export async function syncUserToBackend(): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}/users/sync`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to sync user');
  }
}

export async function fetchChildrenFromApi(): Promise<Child[]> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}/children`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch children');
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((row) => mapChildFromApi(row as Record<string, unknown>));
}

export async function createChildViaApi(
  payload: CreateChildPayload,
): Promise<Child> {
  const headers = {
    ...(await authHeaders()),
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${API_BASE_URL}/children`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create child');
  }
  const data = await res.json();
  if (!data?.success || !data.child) {
    throw new Error('Server did not return the new child profile');
  }
  return mapChildFromApi(data.child as Record<string, unknown>);
}

export async function updateChildViaApi(
  childId: string,
  fields: {
    name?: string;
    birthday?: string | null;
    race?: string | null;
    avatarKey?: string;
  },
): Promise<Child | null> {
  const headers = {
    ...(await authHeaders()),
    'Content-Type': 'application/json',
  };
  const body: Record<string, unknown> = {};
  if (fields.name !== undefined) body.name = fields.name;
  if (fields.birthday !== undefined && fields.birthday !== null) {
    body.birthday = fields.birthday;
  }
  if (fields.race !== undefined) body.race = fields.race;

  const res = await fetch(`${API_BASE_URL}/children/${childId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update child');
  }
  const data = await res.json();
  if (!data?.success || !data.child) return null;
  return mapChildFromApi(data.child as Record<string, unknown>);
}
