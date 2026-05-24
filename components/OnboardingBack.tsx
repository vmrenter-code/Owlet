import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BackArrow({ onPress }: { onPress?: () => void }) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  if (!onPress && !navigation.canGoBack()) return null;

  return (
    <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        onPress={onPress ?? (() => navigation.goBack())}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        accessibilityHint="Navigates to the previous screen"
      >
        <Ionicons name="chevron-back" size={24} color="#0a0a0a" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonPressed: {
    opacity: 0.5,
  },
});