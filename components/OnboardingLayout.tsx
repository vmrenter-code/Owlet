import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeBg from './HomeBg';
import OnboardingBack from './OnboardingBack';
import PrimaryBlueButton from './PrimaryBlueButton';

type Props = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  /** Show back control on step 1 (e.g. child name entry). */
  showBackOnFirstStep?: boolean;
  onNext: () => void;
  canProceed: boolean;
  nextLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
};

export default function OnboardingLayout({
  step,
  totalSteps,
  onBack,
  showBackOnFirstStep = false,
  onNext,
  canProceed,
  nextLabel = 'Next',
  loading = false,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const progressAnim = useRef(new Animated.Value(step / totalSteps)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: step / totalSteps,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  }, [step]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const showBack = !!onBack && (step > 1 || showBackOnFirstStep);

  return (
    <View style={styles.root}>
      <View style={styles.formatBg} pointerEvents="none">
        <HomeBg />
      </View>

      <View
        style={[
          styles.shell,
          { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.backRow}>
            {showBack ? <OnboardingBack onPress={onBack} /> : <View style={styles.backSpacer} />}
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.stepLabel}>
              {step} of {totalSteps}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <PrimaryBlueButton
            onPress={onNext}
            fullWidth
            disabled={!canProceed || loading}
            loading={loading}
          >
            {nextLabel}
          </PrimaryBlueButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  formatBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  shell: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
    flexShrink: 0,
  },
  backRow: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backSpacer: {
    height: 44,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#5058b4',
  },
  stepLabel: {
    fontSize: 13,
    fontFamily: 'NotoSans-Regular',
    color: '#888',
    letterSpacing: 0.1,
    minWidth: 36,
    textAlign: 'right',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexShrink: 0,
    zIndex: 10,
  },
});
