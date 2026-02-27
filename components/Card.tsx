import { ReactNode } from 'react';
import { View, StyleSheet, Pressable, Text, Image } from "react-native";

type Props = {
  children?: ReactNode;
  onPress?: () => void;
}

export default function Card({ children, onPress }: Props) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }: any) => [
        styles.card,
        pressed && { transform: [{ scale: 1.04 }], opacity: 0.90 }
      ]}
    >

      <View style={styles.topSection} />

      <View style={styles.bottomSection}>
        <View style={styles.row}>

          <View style={styles.textContainer}>
            <Text style={styles.cardHeader}>No Screenings Yet</Text>
            <Text style={styles.cardText}>
              Your child’s screenings will appear here.
            </Text>
          </View>

          <Image
            source={require('../assets/ChevronRight.png')}
            style={styles.chevron}
          />

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
    shadowOpacity: 0.30,
    shadowRadius: 7,
    backgroundColor: '#fff'
  },

  topSection: {
    height: 150,
    backgroundColor: '#E4FAF5'
  },

  bottomSection: {
    backgroundColor: '#f2fdff',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  cardHeader: {
    fontSize: 20,
    color: '#737373',
    fontWeight: '400'
  },

  cardText: {
    fontSize: 16,
    color: '#737373'
  },

  textContainer: {
    flexDirection: 'column',
    gap: 3.5,
    flexShrink: 1

  },

  chevron: {
    width: 28,
    height: 28,
    tintColor: '#737373'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});