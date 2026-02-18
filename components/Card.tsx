import { ReactNode } from 'react';
import { View, StyleSheet } from "react-native";

type Props = {
    children?: ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <View style = {styles.card}>
      <View style = {styles.content}>
          { children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2fdffc7",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height:3},
    shadowOpacity: 0.45,
    shadowRadius: 6,
    alignSelf: "center",
    padding: 60,
    width: '100%',

  },

  content: {
    paddingHorizontal: 28,
    paddingVertical: 28,
  }
});
