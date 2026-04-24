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
// Simply do: <PrimaryWhiteButton>Hi</PrimaryWhiteButton>
export default function PrimaryWhiteButton({ children, onPress }: any) {
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
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 2.5,
    borderColor: '#F0F1F1',
    borderWidth: 1,
  },

  text: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: '#84BEC4',
    textAlign: 'center',
    fontWeight: '600',
  },
});