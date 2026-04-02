import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeBg() {
  return (
    <LinearGradient
      colors={['#fff', '#f3fbfc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFillObject,
  },
});
