/** Avatar keys shown on Pick Profile (1–6). */
export const CHILD_AVATAR_KEYS = ['1', '2', '3', '4', '5', '6'] as const;
export type ChildAvatarKey = (typeof CHILD_AVATAR_KEYS)[number];

const LEGACY_MAP: Record<string, ChildAvatarKey> = {
  babyy: '1',
  baby2: '2',
  baby3: '3',
};

export function isChildAvatarKey(key?: string | null): key is ChildAvatarKey {
  return !!key && (CHILD_AVATAR_KEYS as readonly string[]).includes(key);
}

export function normalizeAvatarKey(key?: string | null): ChildAvatarKey | null {
  if (isChildAvatarKey(key)) return key;
  if (key && LEGACY_MAP[key]) return LEGACY_MAP[key];
  return null;
}

export function avatarKeyForChildIndex(index: number): ChildAvatarKey {
  return CHILD_AVATAR_KEYS[index % CHILD_AVATAR_KEYS.length];
}
