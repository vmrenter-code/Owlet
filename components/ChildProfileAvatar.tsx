import type { ComponentType } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { normalizeAvatarKey, type ChildAvatarKey } from '../utils/childAvatars';

type Props = {
  avatarKey?: string | null;
  /** Shown when no avatar has been chosen yet. */
  name?: string | null;
  size?: number;
};

function Heart({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#FDE7EC" />
      <Path
        d="M28 40s-12-7.2-12-16a7.5 7.5 0 0 1 13.5-4.5L28 21l-1.5-1.5A7.5 7.5 0 0 1 40 24c0 8.8-12 16-12 16z"
        fill="#E63956"
      />
    </Svg>
  );
}

function Star({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#FFF6D6" />
      <Path
        d="M28 14l3.95 8.45 9.05 1.05-6.7 6.4 1.8 9.1L28 34.7l-8.1 4.3 1.8-9.1-6.7-6.4 9.05-1.05L28 14z"
        fill="#F5B400"
      />
    </Svg>
  );
}

function Diamond({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#E3F4FF" />
      <Path d="M28 12l14 16-14 16-14-16z" fill="#3FB6F0" />
    </Svg>
  );
}

function Sun({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#FFF0E0" />
      <Circle cx={28} cy={28} r={10} fill="#FF9F43" />
      <Path
        stroke="#FF9F43"
        strokeWidth={2.5}
        strokeLinecap="round"
        d="M28 8v6M28 42v6M8 28h6M42 28h6M13.5 13.5l4.2 4.2M38.3 38.3l4.2 4.2M42.5 13.5l-4.2 4.2M17.7 38.3l-4.2 4.2"
      />
    </Svg>
  );
}

function Leaf({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#E8F8EE" />
      <Path
        d="M34 18c-10 2-16 10-16 18 0-8 8-14 16-16 2 8 6 14 16 16 10-2 16-10 16-18-8 0-14-6-16-16z"
        fill="#2ECC71"
      />
    </Svg>
  );
}

function Moon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#F0E8FF" />
      <Path
        d="M32 16a12 12 0 1 1-14 18 14 14 0 0 0 14-18z"
        fill="#7C5CBF"
      />
    </Svg>
  );
}

const RENDERERS: Record<ChildAvatarKey, ComponentType<{ size: number }>> = {
  '1': Heart,
  '2': Star,
  '3': Diamond,
  '4': Sun,
  '5': Leaf,
  '6': Moon,
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
    const AvatarArt = RENDERERS[resolved];
    return <AvatarArt size={size} />;
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
