import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScreenBg() {
  return (
    <LinearGradient
      colors={['#eafdff',  '#fff7ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.2 }}
      style={styles.card}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFillObject,
  },
});
