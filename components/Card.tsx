import { ReactNode } from 'react';
import { View, StyleSheet, Pressable, Text } from "react-native";

type Props = {
  children?: ReactNode;
  onPress?: () => void;
}

export default function Card({ children, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9, transform: [{ scale: 1.02 }] }]}>
      
      {/* Top green section */}
      <View style={styles.topSection} />

      {/* Bottom white section */}
      <View style={styles.bottomSection}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.cardHeader}>No Screenings Yet</Text>
            <Text style={styles.cardText}>
              Your child’s completed screenings will appear here for easy review.
            </Text>
          </View>
        </View>
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    backgroundColor: '#fff'
  },

  topSection: {
    height: 110,
    backgroundColor: '#E4FAF5'
  },

  bottomSection: {
    backgroundColor: '#f2fdff',
    paddingVertical: 6,
    paddingHorizontal: 20
  },

  content: {
    paddingHorizontal: 2,
    paddingVertical: 8
  },

  cardHeader: {
    fontSize: 20,
    color: '#737373',
    fontWeight: '400'
  },

  cardText: {
    fontSize: 12,
    color: '#737373'
  },

  textContainer: {
    flexDirection: 'column',
    gap: 3.5
  }
});