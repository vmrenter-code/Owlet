import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type Props = {
  children?: ReactNode;
  onPress?: () => void;
};

export default function BeginScreenBtn({ children, onPress }: Props) {
  const navigation = useNavigation<any>();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (onPress) onPress();
    else navigation.replace('ScreeningInstructions');
  };

  return (
    <Animated.View style={[styles.button, animatedStyle]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          onTouchStart={() => { scale.value = withSpring(0.8); }}
          onTouchEnd={() => { scale.value = withSpring(1); handlePress(); }}
          onTouchCancel={() => { scale.value = withSpring(1); }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {children}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#8BC0CF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
});