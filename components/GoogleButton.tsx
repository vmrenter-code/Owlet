import { StyleSheet, Image, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type Props = {
  onPress?: () => void;
};

export default function GoogleButton({ onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
      accessibilityHint="Opens Google sign in"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={[styles.googleButton, animatedStyle]} collapsable={false}>
        <Image
          source={{
            uri: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
          }}
          style={styles.googleIcon}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#ffffff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleIcon: {
    width: 24,
    height: 24,
  },
});