import { ReactNode } from 'react';
import { View, StyleSheet, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Svg, Path } from 'react-native-svg';

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
        onTouchStart={() => { scale.value = withSpring(0.8); }}
        onTouchEnd={() => { scale.value = withSpring(1); }}
      >
        <View style={styles.topSection} />

        <View style={styles.bottomSection}>
          <View style={styles.row}>

            <View style={styles.textContainer}>
              <Text style={styles.subHeader}>No Results Yet</Text>
              <View style={styles.headerRow}>
                <Text style={styles.cardHeader}>Past Screenings</Text>
                <Svg height="24px" viewBox="0 -960 960 960" width="21px" fill="#161B1A">
                  <Path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/>
                </Svg>
              </View>
              <Text style={styles.cardText}>
                Your child’s recent screening will appear here.
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
    overflow: 'hidden',
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    backgroundColor: '#fff'
  },

  topSection: {
    height: 200,
    backgroundColor: '#E7DDED'
  },

  bottomSection: {
    backgroundColor: '#ffffff',
    padding: 16
  },

  subHeader: {
    fontSize: 15,
    color: '#5A5F5E',
    fontFamily: 'NotoSans-Regular',
    marginBottom: 4
  },

  cardHeader: {
    fontSize: 20,
    color: '#161B1A',
    fontFamily: 'NotoSans-SemiBold',
    marginBottom: 6
  },

  cardText: {
    fontSize: 17,
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