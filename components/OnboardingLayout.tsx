import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeBg from './HomeBg';
import BackArrow from './BackArrow';
import PrimaryBlueButton from './PrimaryBlueButton';

type Props = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onNext: () => void;
  canProceed: boolean;
  nextLabel?: string;
  children: React.ReactNode;
};

export default function OnboardingLayout({ step, totalSteps, onBack, onNext, canProceed, nextLabel = 'Next', children }: Props) {
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.formatBg} pointerEvents="none">
        <HomeBg />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
  
  {step > 1 && onBack ? <BackArrow /> : null}

  <View style={styles.progressRow}>
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
    </View>

    <Text style={styles.stepLabel}>
      {step} of {totalSteps}
    </Text>
  </View>

</View>

      <View style={[styles.content, { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 80 }]}>
        {children}
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryBlueButton onPress={onNext} fullWidth disabled={!canProceed}>
          {nextLabel}
        </PrimaryBlueButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formatBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 0,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 12,
    gap: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
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

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});