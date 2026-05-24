import { ReactNode, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScreening } from '../context/ScreeningContext';
import { useAppStackNavigation } from '../hooks/useAppStackNavigation';

type Props = {
  childName?: string;
  children?: ReactNode;
};

export default function BeginCard({ childName }: Props) {
  const appNav = useAppStackNavigation();
  const { startScreening } = useScreening();
  const scale = useSharedValue(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasIncompleteScreening, setHasIncompleteScreening] = useState(false);
  const [incompleteVideoNumber, setIncompleteVideoNumber] = useState(1);
  const [incompleteScreeningId, setIncompleteScreeningId] = useState<string | null>(null);

  useEffect(() => {
    // Only show resume modal if progress was saved in the last 24 hours
    const checkIncompleteScreening = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('screeningProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          const age = Date.now() - (progress.timestamp ?? 0);
          const oneDayMs = 24 * 60 * 60 * 1000;
          if (progress.videoNumber && !progress.completed && age < oneDayMs) {
            setHasIncompleteScreening(true);
            setIncompleteVideoNumber(progress.videoNumber);
            setIncompleteScreeningId(progress.screeningId ?? null);
          } else {
            // Stale or completed — clear it
            await AsyncStorage.removeItem('screeningProgress');
          }
        }
      } catch (e) {}
    };
    checkIncompleteScreening();
  }, []);

  const handlePress = () => {
    if (hasIncompleteScreening) {
      setShowResumeModal(true);
      return;
    }
    appNav.navigate('ScreeningInstructions' as never, { screeningID: startScreening() } as never);
  };

  const handleResume = () => {
    setShowResumeModal(false);
    setTimeout(() => {
      appNav.navigate('VideoScreen' as never, {
        videoNumber: incompleteVideoNumber,
        screeningId: incompleteScreeningId,
      } as never);
    }, 300);
  };

  const handleStartNew = async () => {
    setShowResumeModal(false);
    try {
      await AsyncStorage.removeItem('screeningProgress');
      setHasIncompleteScreening(false);
    } catch (e) {}
    const screeningID = startScreening();
    setTimeout(() => {
      appNav.navigate('ScreeningInstructions' as never, { screeningID } as never);
    }, 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardContent = (
    <View style={styles.content}>
      <View style={styles.textContainer}>
        <Text style={styles.subHeader}>10 minutes</Text>
        <Text style={styles.header}>Begin Screening</Text>
        <Text style={styles.description}>Start early-sign check.</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Svg width={30} height={30} viewBox="0 0 24 24">
          <Path
            fill="#FFFFFF"
            d="M6 4.75C6 3.7 7.187 3.1 8.04 3.697l11.05 7.25a1.75 1.75 0 0 1 0 2.906l-11.05 7.25C7.187 21.9 6 21.3 6 20.25V4.75Z"
          />
        </Svg>
      </View>
    </View>
  );

  return (
    <>
    <Pressable
      onPress={handlePress}
      onPressIn={Platform.OS === 'web' ? undefined : () => { scale.value = withSpring(0.97); }}
      onPressOut={Platform.OS === 'web' ? undefined : () => { scale.value = withSpring(1); }}
      accessibilityRole="button"
      accessibilityLabel="Begin screening, takes about 10 minutes"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [Platform.OS === 'web' && pressed && { opacity: 0.92 }]}
    >
      {Platform.OS === 'web' ? (
        <View style={styles.container}>{cardContent}</View>
      ) : (
        <Animated.View style={[styles.container, animatedStyle]}>{cardContent}</Animated.View>
      )}
    </Pressable>

    <Modal
      visible={showResumeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowResumeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Incomplete Screening Found</Text>
          <Text style={styles.modalMessage}>
            You have an unfinished screening in progress. Would you like to resume where you left off or start a new screening?
          </Text>
          <Text style={styles.modalNote}>
            Starting a new screening will discard your previous progress.
          </Text>
          
          <View style={styles.modalButtons}>
            <Pressable 
              style={styles.resumeButton}
              onPress={handleResume}
              accessibilityRole="button"
              accessibilityLabel="Resume screening"
            >
              <Text style={styles.resumeButtonText}>Resume</Text>
            </Pressable>
            <Pressable 
              style={styles.startNewButton}
              onPress={handleStartNew}
              accessibilityRole="button"
              accessibilityLabel="Start a new screening"
            >
              <Text style={styles.startNewButtonText}>Start New</Text>
            </Pressable>
          </View>
          
          <Pressable 
            style={styles.cancelButton}
            onPress={() => setShowResumeModal(false)}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#5058b4',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2d3058',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: 22,
  },

  textContainer: {
    flex: 1,
  },

  subHeader: {
  fontSize: 13,
  fontFamily: 'NotoSans-Regular',
  color: 'rgba(255,255,255,0.7)',
  letterSpacing: 0.6,
},

header: {
  fontSize: 18,
  fontFamily: 'NotoSans-Bold',
  color: '#ffffff',
  letterSpacing: -0.3,
},

description: {
  fontSize: 15,
  fontFamily: 'NotoSans-Regular',
  color: 'rgba(255,255,255,0.75)',
  lineHeight: 21,
  letterSpacing: 0.1,
},

  childCaption: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'NotoSans-Regular',
  },

  buttonWrapper: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  modalMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },

  modalNote: {
    fontSize: 13,
    color: '#e67e22',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 19,
    fontStyle: 'italic',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },

  resumeButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#4a8f8f',
    alignItems: 'center',
  },

  resumeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  startNewButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
  },

  startNewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },

  cancelButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  cancelButtonText: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'underline',
  },
});