import { View, Text, StyleSheet } from 'react-native';
import { normalizeAvatarKey } from '../utils/childAvatars';
import { CHILD_AVATAR_COMPONENTS } from '../utils/childAvatarAssets';

type Props = {
  avatarKey?: string | null;
  name?: string | null;
  size?: number;
};

function InitialFallback({ name, size }: { name: string; size: number }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={[
        styles.initialCircle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initialText, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

export default function ChildProfileAvatar({ avatarKey, name, size = 56 }: Props) {
  const resolved = normalizeAvatarKey(avatarKey);
  if (resolved) {
    const AvatarSvg = CHILD_AVATAR_COMPONENTS[resolved];
    return <AvatarSvg width={size} height={size} />;
  }
  if (name?.trim()) {
    return <InitialFallback name={name} size={size} />;
  }
  return (
    <View
      style={[
        styles.emptyCircle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  initialCircle: {
    backgroundColor: '#dfe2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontFamily: 'NotoSans-SemiBold',
    color: '#5058b4',
  },
  emptyCircle: {
    backgroundColor: '#eae9fa',
  },
});
