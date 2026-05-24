import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScreeningLandscape } from '../../hooks/useScreeningLandscape';
import RotateDeviceOverlay from '../../components/RotateDeviceOverlay';

const troubleshootingOptions = [
  { id: 1, label: "I can't hear the sound" },
  { id: 2, label: 'The screen is frozen or not responding' },
  { id: 3, label: "I can't move to the next video" },
  { id: 4, label: 'My internet connection dropped' },
  { id: 5, label: 'Ran out of time' },
  { id: 6, label: 'Something else' },
];

export default function TroubleshootingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width, height } = useWindowDimensions();
  const isWide = width >= height;
  useScreeningLandscape();

  const videoNumber = route.params?.videoNumber || 1;

  const handleOptionPress = (option: (typeof troubleshootingOptions)[0]) => {
    navigation.navigate('TroubleshootingSolution', {
      issueId: option.id,
      issueLabel: option.label,
      videoNumber,
    });
  };

  return (
    <View style={styles.container}>
      {!isWide ? <RotateDeviceOverlay /> : null}

      {isWide ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>🛠 Troubleshooting</Text>
            <Text style={styles.subtitle}>
              We'll help you get back on track. Your progress is saved.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>What's going wrong?</Text>

          {troubleshootingOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.optionItem,
                pressed && styles.optionItemPressed,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <View style={styles.radioCircle} />
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionArrow}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionItemPressed: {
    backgroundColor: '#e8e8e8',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  optionArrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: '300',
  },
});
