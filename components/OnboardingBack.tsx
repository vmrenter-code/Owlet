import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onPress?: () => void;
};

export default function OnboardingBack({ onPress }: Props) {
  const navigation = useNavigation<any>();

  if (!onPress && !navigation.canGoBack()) return null;

  return (
    <Pressable
      style={({ pressed }) => [pressed && { opacity: 0.5 }]}
      onPress={onPress ?? (() => navigation.goBack())}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={24} color="#0a0a0a" />
    </Pressable>
  );
}
