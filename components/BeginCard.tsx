import { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

type Props = {
  children?: ReactNode;
};

export default function BeginCard({ children }: Props) {
  const navigation = useNavigation<any>();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => navigation.replace('ScreeningInstructions')}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.subHeader}>10 minutes</Text>
            <Text style={styles.header}>Begin Screening</Text>
            <Text style={styles.description}>
                Start early-sign check.
            </Text>
          </View>

          <View style={styles.buttonWrapper}>
            <Svg width={30} height={30} viewBox="0 -960 960 960">
              <Path
                fill="#FFFFFF"
                d="M360-240c-24 14-40 4-40-24v-432c0-28 16-38 40-24l336 216c20 12 20 36 0 48L360-240Z"
              />
            </Svg>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#84BEC4',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },

  textContainer: {
    flex: 1,
  },

  subHeader: {
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#ffffff',
    marginBottom: 2,
  },

  header: {
    fontSize: 20,
    fontFamily: 'NotoSans-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },

  description: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: '#f0f0f0',
    lineHeight: 20,
  },

  buttonWrapper: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#ffffff00',
    alignItems: 'center',
    justifyContent: 'center',
  },
});