import { ReactNode, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  children?: ReactNode;
};

export default function BeginCard({ children }: Props) {
  const navigation = useNavigation<any>();
  const scale = useSharedValue(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasIncompleteScreening, setHasIncompleteScreening] = useState(false);
  const [incompleteVideoNumber, setIncompleteVideoNumber] = useState(1);

  // Check for incomplete screening on mount
  useEffect(() => {
    const checkIncompleteScreening = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('screeningProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          if (progress.videoNumber && !progress.completed) {
            setHasIncompleteScreening(true);
            setIncompleteVideoNumber(progress.videoNumber);
          }
        }
      } catch (e) {
        console.log('Error checking screening progress');
      }
    };
    checkIncompleteScreening();
  }, []);

  const handlePress = () => {
    console.log('BeginCard pressed!');
    console.log('hasIncompleteScreening:', hasIncompleteScreening);
    if (hasIncompleteScreening) {
      console.log('Showing resume modal');
      setShowResumeModal(true);
    } else {
      console.log('Navigating to ScreeningInstructions');
      navigation.replace('ScreeningInstructions');
    }
  };

  const handleResume = () => {
    setShowResumeModal(false);
    navigation.navigate('VideoScreen', { videoNumber: incompleteVideoNumber });
  };

  const handleStartNew = async () => {
    setShowResumeModal(false);
    // Clear old progress and start fresh
    try {
      await AsyncStorage.removeItem('screeningProgress');
      setHasIncompleteScreening(false);
    } catch (e) {
      console.log('Error clearing progress');
    }
    navigation.replace('ScreeningInstructions');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
    <Pressable
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.subHeader}>10 minutes</Text>
            <Text style={styles.header}>Begin Screening</Text>
            <Text style={styles.description}>
                Start early-sign check.
            </Text>
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
      </Animated.View>
    </Pressable>

    {/* Resume or Start New Modal */}
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
            >
              <Text style={styles.resumeButtonText}>Resume</Text>
            </Pressable>
            <Pressable 
              style={styles.startNewButton}
              onPress={handleStartNew}
            >
              <Text style={styles.startNewButtonText}>Start New</Text>
            </Pressable>
          </View>
          
          <Pressable 
            style={styles.cancelButton}
            onPress={() => setShowResumeModal(false)}
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
    backgroundColor: '#90d3d3',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
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
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#ffffff',
    marginBottom: 2,
  },

  header: {
    fontSize: 18,
    fontFamily: 'NotoSans-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  description: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: '#ffffff',
    lineHeight: 20,
  },

  buttonWrapper: {
    borderRadius: 14,
    backgroundColor: '#ffffff00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },

  modalNote: {
    fontSize: 14,
    color: '#e67e22',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  resumeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#7FB8C4',
    alignItems: 'center',
  },

  resumeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  startNewButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },

  startNewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },

  cancelButton: {
    marginTop: 12,
    paddingVertical: 10,
  },

  cancelButtonText: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
});