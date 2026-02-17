//Home screen background
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeBg() {
  return (
    <LinearGradient
      colors={["#49A3BD", "#69B2C7", "#83C3D5","#A1D9D0"]}
      start={{ x: 0, y: 0 }}
      style={ styles.card }
      end= {{ x: 1, y:0 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    // absolutely fills the entire screen
   ...StyleSheet.absoluteFillObject
  },
});
