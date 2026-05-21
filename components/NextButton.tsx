import { Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  onPress?: () => void;
};

export default function NextButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Continue to next onboarding screen"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>Next</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pressed: {
    opacity: 0.5,
  },

  label: {
    fontSize: 15,
    fontFamily: 'NotoSans-SemiBold',
    color: '#5058b4',
    letterSpacing: 0,
  },
});