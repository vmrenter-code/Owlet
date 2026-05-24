import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryBlueButton({
  children,
  onPress,
  accessibilityLabel,
  fullWidth,
  disabled,
  loading,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textOpacity = useSharedValue(1);

  React.useEffect(() => {
    textOpacity.value = withTiming(loading ? 0 : 1, { duration: 150 });
  }, [loading]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPressIn={() => {
        if (!isDisabled) scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        if (!isDisabled) scale.value = withSpring(1);
      }}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      style={fullWidth && styles.fullWidth}
    >
      <Animated.View style={[styles.container, animatedStyle, isDisabled && styles.disabled]}>
        
        {/* Spinner sits absolutely centered so layout never shifts */}
        {loading && (
          <View style={styles.spinner}>
            <ActivityIndicator color="#fff" />
          </View>
        )}

        {/* Text fades out instead of disappearing instantly */}
        <Animated.Text style={[styles.text, textStyle]}>
          {children}
        </Animated.Text>

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
    backgroundColor: '#5058b4',

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#2d3058',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },

  text: {
    fontSize: 15,
    fontFamily: 'NotoSans-SemiBold',
    color: '#fff',
    letterSpacing: 0.1,
  },

  disabled: {
    opacity: 0.6,
  },

  spinner: {
    position: 'absolute',
  },
});