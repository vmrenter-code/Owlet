import { ReactNode } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  icon?: any; 
  children?: ReactNode;
  onPress?: () => void;
};

export default function ToolButton({ icon, children, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.8);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderColor: '#F0F1F1',
    borderWidth: 1,
    padding: 16,
    flex: 1,
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
});