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
      onPress={() => navigation.navigate('ScreeningInstructions')}
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
            <Svg width={30} height={30} viewBox="0 0 24 24">
              <Path
                fill="#FFFFFF"
                d="M6 4.75C6 3.7 7.187 3.1 8.04 3.697l11.05 7.25a1.75 1.75 0 0 1 0 2.906l-11.05 7.25C7.187 21.9 6 21.3 6 20.25V4.75Z"
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
    backgroundColor: '#90d3d3',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: 22,
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
    fontSize: 18,
    fontFamily: 'NotoSans-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  description: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: '#ffffff',
    lineHeight: 20,
  },

  buttonWrapper: {
    borderRadius: 14,
    backgroundColor: '#ffffff00',
    alignItems: 'center',
    justifyContent: 'center',
  },
});