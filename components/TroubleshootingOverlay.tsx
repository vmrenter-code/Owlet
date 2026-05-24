import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

export const troubleshootingOptions = [
  { id: 1, label: "I can't hear the sound" },
  { id: 2, label: 'The screen is frozen or not responding' },
  { id: 3, label: "I can't move to the next video" },
  { id: 4, label: 'My internet connection dropped' },
  { id: 5, label: 'Ran out of time' },
  { id: 6, label: 'Something else' },
];

const solutions: { [key: number]: { title: string; steps: string[] } } = {
  1: {
    title: "Can't hear the instructions",
    steps: [
      'Check that your device volume is turned up',
      'Make sure your device is not on silent/mute mode',
      'Try using headphones or external speakers',
      'Restart the app and try again',
    ],
  },
  2: {
    title: 'Screen frozen or not responding',
    steps: [
      'Wait a few seconds - the app may be loading',
      'Try tapping the screen gently',
      'Close the app completely and reopen it',
      'Restart your device if the issue persists',
    ],
  },
  3: {
    title: "Can't move to the next video",
    steps: [
      "Make sure you've completed the current video",
      'Wait for any video/audio to finish playing',
      'Check your internet connection',
      'Try refreshing or restarting the app',
    ],
  },
  4: {
    title: 'Internet connection dropped',
    steps: [
      'Check your Wi-Fi or cellular connection',
      'Move closer to your router if using Wi-Fi',
      'Try switching between Wi-Fi and cellular data',
      'Your progress is saved - reconnect and continue',
    ],
  },
  5: {
    title: 'Ran out of time',
    steps: [
      "Don't worry - your completed progress has been saved",
      'You can restart from where you left off',
      'Try to find a quieter time to complete the screening',
    ],
  },
  6: {
    title: 'Something else',
    steps: [
      'Try restarting the app',
      'Check for app updates in your app store',
      'Make sure your device software is up to date',
      'Contact our support team for help',
    ],
  },
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function TroubleshootingOverlay({ visible, onClose }: Props) {
  const { width, height } = useWindowDimensions();
  const isWide = width >= height;
  const [step, setStep] = useState<'list' | 'solution'>('list');
  const [issueId, setIssueId] = useState(6);

  useEffect(() => {
    if (visible) {
      setStep('list');
      setIssueId(6);
    }
  }, [visible]);

  const solution = solutions[issueId] || solutions[6];

  const handleClose = () => {
    setStep('list');
    onClose();
  };

  const cardMaxWidth = isWide ? Math.min(480, width * 0.55) : Math.min(400, width * 0.9);
  const cardMaxHeight = isWide ? height * 0.82 : height * 0.75;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.scrim}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close troubleshooting menu"
        />

        <View
          style={[styles.card, { maxWidth: cardMaxWidth, maxHeight: cardMaxHeight }]}
          onStartShouldSetResponder={() => true}
        >
          {step === 'list' ? (
            <>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🛠 Troubleshooting</Text>
                <Pressable style={styles.iconButton} onPress={handleClose}>
                  <Text style={styles.iconButtonText}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.cardSubtitle}>
                We'll help you get back on track. Your progress is saved.
              </Text>

              <Text style={styles.sectionTitle}>What's going wrong?</Text>

              <ScrollView
                style={styles.optionsScroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {troubleshootingOptions.map((option) => (
                  <Pressable
                    key={option.id}
                    style={({ pressed }) => [
                      styles.optionItem,
                      pressed && styles.optionItemPressed,
                    ]}
                    onPress={() => {
                      setIssueId(option.id);
                      setStep('solution');
                    }}
                  >
                    <View style={styles.radioCircle} />
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionArrow}>›</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <View style={styles.cardHeader}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => setStep('list')}
                >
                  <Text style={styles.backArrow}>‹</Text>
                </Pressable>
                <Pressable style={styles.iconButton} onPress={handleClose}>
                  <Text style={styles.iconButtonText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView
                style={styles.solutionScroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <Text style={styles.cardTitle}>{solution.title}</Text>
                <Text style={styles.sectionTitle}>Try these steps:</Text>

                {solution.steps.map((stepText, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{stepText}</Text>
                  </View>
                ))}

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.primaryButtonPressed,
                  ]}
                  onPress={handleClose}
                >
                  <Text style={styles.primaryButtonText}>Back to Screening</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={() => {}}>
                  <Text style={styles.secondaryButtonText}>
                    Still need help? Contact us
                  </Text>
                </Pressable>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  optionsScroll: {
    maxHeight: 280,
  },
  solutionScroll: {
    maxHeight: 320,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionItemPressed: {
    backgroundColor: '#ececec',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  optionArrow: {
    fontSize: 18,
    color: '#999',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  backArrow: {
    fontSize: 22,
    color: '#666',
    fontWeight: '300',
    marginTop: -2,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5fd4d4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#f0a090',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 22,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
    minWidth: 160,
  },
  primaryButtonPressed: {
    backgroundColor: '#e8958a',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 4,
  },
  secondaryButtonText: {
    color: '#5fd4d4',
    fontSize: 13,
    fontWeight: '500',
  },
});
