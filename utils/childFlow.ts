export type ChildFlowMode = 'onboarding' | 'addChild';

export function isAddChildFlow(flow?: string): boolean {
  return flow === 'addChild';
}

/** Converts MM/DD/YYYY or ISO string to ISO YYYY-MM-DD for storage. */
export function birthdayToIso(dob: string | null | undefined): string | null {
  if (!dob) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) return dob;
  const parts = dob.split('/');
  if (parts.length === 3) {
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return null;
  const y = parsed.getFullYear();
  const mo = String(parsed.getMonth() + 1).padStart(2, '0');
  const da = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

export function birthdayFromApi(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export { avatarKeyForChildIndex as avatarIdForChildIndex } from './childAvatars';
