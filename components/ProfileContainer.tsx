import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    children?: ReactNode;
}

export default function ProfileContainer({ children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    width: 40,
    height: 40,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 2.5,
    borderColor: '#F0F1F1',
    borderWidth: 0.5,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});