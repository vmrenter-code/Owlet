import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BackArrow() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  if (!navigation.canGoBack()) return null;

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        onPress={() => navigation.goBack()}
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
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  backButtonPressed: {
    opacity: 0.5,
  },
});