import { ReactNode } from 'react';
import { View, StyleSheet, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Svg, Path, Circle } from 'react-native-svg';

type Props = {
  children?: ReactNode;
  onPress?: () => void;
}

export default function Card({ children, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        accessibilityRole="button"
        accessibilityLabel="Past screenings, no results yet"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.topSection} />

        <View style={styles.bottomSection}>
          <View style={styles.row}>

            <View style={styles.textContainer}>
              <Text style={styles.subHeader}>No Results Yet</Text>
              <View style={styles.headerRow}>
                <Text style={styles.cardHeader}>Past Screenings</Text>
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#161B1A"
                    strokeWidth={3}
                  />
                  <Path
                    d="M12 7v5.5l3.5 3.5"
                    stroke="#161B1A"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
              </View>
              <Text style={styles.cardText}>
                Your child's recent screening will appear here.
              </Text>
            </View>

            <Svg height="30px" width="30px" viewBox="0 -960 960 960" fill="#161B1A">
              <Path d="M380-720 620-480 380-240 340-280 540-480 340-680Z"/>
            </Svg>

          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    shadowColor: '#81738b',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: '#fff'
  },

  topSection: {
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#c7caf1'
  },

  bottomSection: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 20
  },

  subHeader: {
    fontSize: 13,
    color: '#bbb',
    fontFamily: 'NotoSans-Regular',
    letterSpacing: 0.6,
  },

  cardHeader: {
    fontSize: 18,
    color: '#1a1a1a',
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: -0.2,
  },

  cardText: {
    fontSize: 15,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    lineHeight: 21,
    letterSpacing: 0.1,
    maxWidth: '90%'
  },

  textContainer: {
    flexDirection: 'column',
    flexShrink: 1
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  }
});