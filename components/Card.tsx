import { ReactNode } from 'react';
import { View, StyleSheet, Text } from "react-native";
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
      <View
        onTouchStart={() => { scale.value = withSpring(0.95); }}
        onTouchEnd={() => { scale.value = withSpring(1); }}
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
                    strokeWidth={2.7}
                  />
                  <Path
                    d="M12 7v5.5l3.5 3.5"
                    stroke="#161B1A"
                    strokeWidth={2.7}
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

            <Svg height="30px" width="30px" viewBox="0 -960 960 960" fill="#0d0e0d">
              <Path d="M380-720 620-480 380-240 340-280 540-480 340-680Z"/>
            </Svg>

          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
    backgroundColor: '#fff'
  },

  topSection: {
    height: 200,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#f3edf7'
  },

  bottomSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 25
  },

  subHeader: {
    fontSize: 14,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    marginBottom: 4
  },

  cardHeader: {
    fontSize: 18,
    color: '#161B1A',
    fontFamily: 'NotoSans-SemiBold',
    marginBottom: 4
  },

  cardText: {
    fontSize: 16,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    lineHeight: 22,
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