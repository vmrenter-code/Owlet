import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    children?: ReactNode;
}


export default function ToolButton({ children }: Props) {
return (
    <View style = {[styles.card]}>
      <View style = {styles.content}>
          { children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2fdffd3',
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: '#000',
    shadowOffset: {width: 0, height:3},
    shadowOpacity: 0.45,
    shadowRadius: 6,
    flex: 1,
    height: 90

  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 28,
  }
});
