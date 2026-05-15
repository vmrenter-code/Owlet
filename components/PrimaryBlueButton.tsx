import { Pressable, Text, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  fullWidth?: boolean;
};

export default function PrimaryBlueButton({ children, onPress, accessibilityLabel, fullWidth }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={fullWidth && styles.fullWidth}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.text}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },

  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: '#4a8f8f',
    shadowColor: '#2a5f5f',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },

  text: {
    fontSize: 15,
    fontFamily: 'NotoSans-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});