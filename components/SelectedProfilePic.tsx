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


export default function SelectedProfilePic({ children, onPress }: Props) {
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
                  scale.value = withSpring(0.95);
                }}
                onPressOut={() => {
                  scale.value = withSpring(1);
                }}
                onPress={onPress}
                style={{ flex: 1 }}

                
              >
            <View style={styles.card}>
                    <View style={styles.content}>
                        {children}
                    </View>
                    </View>

              </Pressable>
       
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    width: 140,
    height: 140,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 2.5,
    borderColor: '#F0F1F1',
    borderWidth: 0.5,
    elevation: 2
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})