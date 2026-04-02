//Styles and design for primary blue buttons. Easily use these by
//importing into your component!

//Note: This is just sets up the button. Formatting styles may have
//to be done within your components.
import { Pressable, Text, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

//Children allows us to type whatever we want in the button.
//For example, if you want a button that has the words "Hi" inside it,
// Simply do: <PrimaryBlueButton>Hi</PrimaryBlueButton>
export default function PrimaryBlueButton({ children, onPress }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.text}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

//Styles for the button
const styles = StyleSheet.create({
  container: {
    padding: 17,
    borderRadius: 100,
    backgroundColor: '#90d3d3',
    shadowColor: '#00000031',
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    borderColor: '#93d6d6',
    borderWidth: 2,
  },

  text: {
    fontSize: 16,
    fontFamily: 'NotoSans-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});