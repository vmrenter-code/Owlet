import { ReactNode } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';

type Props = {
  icon?: any; 
  children?: ReactNode;
  onPress?: () => void;
};

export default function ToolButton({ icon, children, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9, transform: [{ scale: 1.02 }] }]}>
      <View style={styles.content}>
        {icon && (
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        )}
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2fdff',
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    width: 130,
    height: 130
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },

  icon: {
    width: 50,
    height: 50
  }
});