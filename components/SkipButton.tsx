import { Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';

export default function SkipButton({ onPress, label, accessibilityLabel }: any) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Skip onboarding'}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label ?? 'Skip'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pressed: {
    opacity: 0.5,
  },

  label: {
    fontSize: 15,
    fontFamily: 'NotoSans-SemiBold',
    color: '#888',
    letterSpacing: 0,
  },
});