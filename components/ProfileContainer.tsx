import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    children?: ReactNode;
}


export default function ProfileContainer({ children }: Props) {
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignSelf: "center",
    shadowColor: '#000',
    shadowOffset: {width: 0, height:3},
    shadowOpacity: 0.30,
    shadowRadius: 6,
    flex: 1,

  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 28,
  }
});
