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
      onPressIn={() => { scale.value = withSpring(0.7); }}
      onPressOut={() => { scale.value = withSpring(1); }}
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
    borderRadius: 100,
    alignSelf: 'center',
    width: 60,
    height: 60,
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    borderColor: '#F0F1F1',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleIcon: {
    width: 24,
    height: 24,
  },
});