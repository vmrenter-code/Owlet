import { View, Text, StyleSheet, Pressable, Modal, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { startScreeningRecording, stopScreeningRecording, isCurrentlyRecording, initializeCameraRef, setCameraReady, setCameraNotReady } from '../../src/services/screeningRecordingService';
import { useScreening } from '../../context/ScreeningContext';

// Video sources for each screening video
const videoSources: { [key: number]: any } = {
    1: require('../../assets/videos/Video1.mp4'),
    2: require('../../assets/videos/Video2.mp4'),
    3: require('../../assets/videos/Video3.mp4'),
    4: require('../../assets/videos/Video4.mp4'),
    5: require('../../assets/videos/Video5.mp4'),
};
import { uploadScreeningVideo } from '../../src/services/uploadService';

const createLocalScreeningId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// This screen plays videos during the screening process
// Shows 5 videos sequentially with Stop and Save / Next buttons

export default function VideoScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    // Get screeningID from context (primary) or route params (fallback)
    const { screeningID } = useScreening();
    const videoNumber = route.params?.videoNumber || 1;
    
    // Use context screeningID, or fall back to route params if available
    const currentScreeningID = screeningID || route.params?.screeningId;
    
    // Log screeningID for debugging
    useEffect(() => {
        console.log('VideoScreen - Current Screening ID:', currentScreeningID);
        console.log('VideoScreen - Video Number:', videoNumber);
    }, [currentScreeningID, videoNumber]);
    
    // Cleanup: stop video when component unmounts
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.stopAsync();
            }
        };
    }, []);
    
    const { screeningId, videoNumber: initialVideoNumber = 1 } = route.params ?? {};
    const cameraRef = useRef<CameraView>(null);
    const videoRef = useRef<Video>(null);
    const hasAttemptedRecordingStartRef = useRef(false);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const BASE_URL =
        process.env.EXPO_PUBLIC_API_BASE_URL ??
        (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
    
    const totalVideos = 5;
    const [currentVideoNumber, setCurrentVideoNumber] = useState(initialVideoNumber);
    const [activeScreeningId, setActiveScreeningId] = useState<string | null>(screeningId ?? null);
    
    // Track if video is playing or finished
    const [isPlaying, setIsPlaying] = useState(true);
    
    // Track exit confirmation modal visibility
    const [showExitModal, setShowExitModal] = useState(false);
    const [isCameraMounted, setIsCameraMounted] = useState(false);

    // added readiness tracking to ensure we don't try to start recording before camera is fully ready, which was causing crashes before
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isRefReady, setIsRefReady] = useState(false);

    useEffect(() => {
        setCurrentVideoNumber(initialVideoNumber);
    }, [initialVideoNumber]);

    useEffect(() => {
        if (screeningId) {
            setActiveScreeningId(screeningId);
        }
    }, [screeningId]);

    useEffect(() => {
        let isMounted = true;

        const ensureScreeningId = async () => {
            if (activeScreeningId) {
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/screening`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ startedAt: new Date().toISOString() }),
                });

                if (!response.ok) {
                    console.log('Failed to create screening session:', response.status);
                    if (isMounted) {
                        setActiveScreeningId(createLocalScreeningId());
                    }
                    return;
                }

                const payload = await response.json();
                const createdId = payload?.screening?.id ?? createLocalScreeningId();
                if (isMounted) {
                    setActiveScreeningId(createdId);
                }
            } catch (error) {
                console.log('Error creating screening session in VideoScreen:', error);
                if (isMounted) {
                    setActiveScreeningId(createLocalScreeningId());
                }
            }
        };

        ensureScreeningId();

        return () => {
            isMounted = false;
        };
    }, [activeScreeningId, BASE_URL]);

    useEffect(() => {
        if (cameraPermission?.status === 'undetermined') {
            requestCameraPermission?.();
        }

        if (microphonePermission?.status === 'undetermined') {
            requestMicrophonePermission?.();
        }
    }, [cameraPermission?.status, microphonePermission?.status, requestCameraPermission, requestMicrophonePermission]);
    
    const handleExitScreening = async () => {
        // Stop the video before exiting
        if (videoRef.current) {
            await videoRef.current.stopAsync();
        }
        setShowExitModal(false);
        navigation.navigate('MainTabs');
    };

    const handleCameraReady = () => {
        console.log('Camera ready! videoNumber:', currentVideoNumber);
        setCameraReady();
        setIsCameraReady(true);
    };

    // Initialize camera ref
    const handleCameraRef = useCallback((ref: CameraView | null) => {
        if (ref) {
            cameraRef.current = ref;
            initializeCameraRef(ref);
            setIsRefReady(true);
            setIsCameraMounted(true);
        } else {
            setCameraNotReady();
            setIsCameraMounted(false);
            setIsRefReady(false);
            setIsCameraReady(false);
        }
    }, []);
    
    // Save progress when entering this screen
    useEffect(() => {
        const saveProgress = async () => {
            try {
                await AsyncStorage.setItem('screeningProgress', JSON.stringify({
                    screeningId: activeScreeningId,
                    videoNumber: currentVideoNumber,
                    completed: false,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.log('Error saving progress');
            }
        };
        saveProgress();
    }, [activeScreeningId, currentVideoNumber]);
    
    // Reset playing state when video number changes
    useEffect(() => {
        setIsPlaying(true);
        const timer = setTimeout(() => {
            setIsPlaying(false);
        }, 5000); // Video "finishes" after 3 seconds
        
        return () => clearTimeout(timer);
    }, [currentVideoNumber]);

    // safe recording start
    useEffect(() => {
        if (
            isCameraReady &&
            isRefReady &&
            isCameraMounted &&
            cameraPermission?.granted &&
            microphonePermission?.granted &&
            !isCurrentlyRecording() &&
            !hasAttemptedRecordingStartRef.current
        ) {
            hasAttemptedRecordingStartRef.current = true;
            console.log('Starting screening recording safely...');
            const startTimer = setTimeout(() => {
                startScreeningRecording().then((started) => {
                    if (!started) {
                        hasAttemptedRecordingStartRef.current = false;
                    }
                });
            }, 250);

            return () => clearTimeout(startTimer);
        }
    }, [cameraPermission?.granted, isCameraMounted, isCameraReady, isRefReady, microphonePermission?.granted]);
    
    const handleNext = async () => {
        // Stop the current video before navigating
        if (videoRef.current) {
            await videoRef.current.stopAsync();
        }
        
        if (videoNumber < totalVideos) {
            // Go to next video - use replace to keep same screen instance for continuous recording
            navigation.replace('VideoScreen', { videoNumber: videoNumber + 1, screeningId: currentScreeningID });
        } else {
            // All videos complete - stop recording and save
            console.log('Video 5 completed, stopping recording...');
            let recordingPath: string | null = null;
            let uploadedObjectKey: string | null = null;

            if (!isCurrentlyRecording()) {
                console.log('Recording not active at finish. Attempting recovery start...');
                const recovered = await startScreeningRecording();
                if (recovered) {
                    await new Promise((resolve) => setTimeout(resolve, 1200));
                }
            }

            try {
                // iOS can occasionally hang while stopping camera recording.
                // Use a timeout fallback so the user is never stuck on this screen.
                recordingPath = await Promise.race([
                    stopScreeningRecording(),
                    new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
                ]);
            } catch (e) {
                console.log('Error stopping recording, continuing to completion');
            }

            console.log('Recording saved to:', recordingPath);

            if (recordingPath && activeScreeningId) {
                const uploadResult = await uploadScreeningVideo({
                    baseUrl: BASE_URL,
                    screeningId: activeScreeningId,
                    videoNumber: totalVideos,
                    recordingUri: recordingPath,
                    contentType: 'video/mp4',
                });

                if (uploadResult.success) {
                    uploadedObjectKey = uploadResult.objectKey ?? null;
                    console.log('S3 upload complete. Processing will start automatically:', uploadResult.objectKey);
                } else {
                    console.log('S3 upload failed:', uploadResult.error);
                }
            } else {
                console.log('Skipping upload. Missing recording or screeningId.');
            }
            
            try {
                await AsyncStorage.setItem('screeningProgress', JSON.stringify({
                    screeningId: activeScreeningId,
                    videoNumber: totalVideos,
                    completed: true,
                    timestamp: Date.now(),
                    recordingUri: recordingPath,
                    s3ObjectKey: uploadedObjectKey,
                }));
            } catch (e) {
                console.log('Error saving completion progress');
            }
            navigation.navigate('ScreeningComplete');
        }
    };

    return (
        <View style={styles.container}>
            {/* Hidden camera for recording - only records, no preview shown */}
            {cameraPermission?.granted && microphonePermission?.granted && (
                <CameraView
                    ref={handleCameraRef}
                    style={styles.hiddenCamera}
                    facing="front"
                    mode="video"
                    mute={false}
                    onCameraReady={handleCameraReady}
                />
            )}

            {/* Header with exit, progress and troubleshooting */}
            <View style={styles.headerContainer}>
                {/* Exit button on the far left */}
                <Pressable 
                    style={styles.exitButton}
                    onPress={() => setShowExitModal(true)}
                >
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path 
                            d="M18 6L6 18M6 6l12 12" 
                            stroke="#ffffff" 
                            strokeWidth={2.5} 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>

                {/* Progress indicators */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4, 5].map((num, index) => (
                        <View key={num} style={styles.progressItemContainer}>
                            <View
                                style={[
                                    styles.progressDot,
                                    num === currentVideoNumber && styles.progressDotActive,
                                    num < currentVideoNumber && styles.progressDotComplete,
                                    num > currentVideoNumber && styles.progressDotPending,
                                ]}
                            >
                                <Text style={[
                                    styles.progressNumber,
                                    num === currentVideoNumber && styles.progressNumberActive,
                                    num < currentVideoNumber && styles.progressNumberComplete,
                                    num > currentVideoNumber && styles.progressNumberPending,
                                ]}>
                                    {num < currentVideoNumber ? '✓' : num}
                                </Text>
                            </View>
                            {/* Connecting line (except after last dot) */}
                            {index < 4 && (
                                <View style={[
                                    styles.progressLine,
                                    num < currentVideoNumber && styles.progressLineComplete,
                                ]} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Troubleshooting button on the right */}
                <Pressable 
                    style={styles.troubleshootButton}
                    onPress={() => navigation.navigate('TroubleshootingScreen', { videoNumber: currentVideoNumber })}
                >
                    <Text style={styles.troubleshootIcon}>!</Text>
                </Pressable>
            </View>

            {/* Video Player */}
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    source={videoSources[videoNumber]}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={isPlaying}
                    isLooping={false}
                    onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                        if (status.isLoaded && status.didJustFinish) {
                            setIsPlaying(false);
                        }
                    }}
                />
            </View>

            {/* Skip button - always visible */}
            <View style={styles.skipButtonContainer}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.skipButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleNext}
                >
                    <Text style={styles.skipButtonText}>
                        {videoNumber < totalVideos ? 'Skip →' : 'Finish →'}
                    </Text>
                </Pressable>
                <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoPlaceholderText}>
                        Video {currentVideoNumber} of {totalVideos}
                    </Text>
                </View>
            </View>

            {/* Bottom button - only show when video finishes */}
            {!isPlaying && (
                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.nextButton,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>
                            {currentVideoNumber < totalVideos ? 'Next' : 'Finish and Submit'}
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* Exit Confirmation Modal */}
            <Modal
                visible={showExitModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowExitModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Exit Screening?</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to exit the screening process?
                        </Text>
                        <Text style={styles.modalNote}>
                            Don't worry — your completed videos are automatically saved. You can resume from where you left off anytime.
                        </Text>
                        
                        <View style={styles.modalButtons}>
                            <Pressable 
                                style={styles.cancelButton}
                                onPress={() => setShowExitModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable 
                                style={styles.exitConfirmButton}
                                onPress={handleExitScreening}
                            >
                                <Text style={styles.exitConfirmButtonText}>Exit</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2a2a',
    },

    hiddenCamera: {
        position: 'absolute',
        width: 10,
        height: 10,
        opacity: 0.1,
    },

    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        zIndex: 10,
    },

    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    progressItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    progressDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    progressDotActive: {
        backgroundColor: '#5fd4d4',
        borderWidth: 3,
        borderColor: '#ffffff',
    },

    progressDotComplete: {
        backgroundColor: '#5fd4d4',
    },

    progressDotPending: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },

    progressLine: {
        width: 12,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 2,
    },

    progressLineComplete: {
        backgroundColor: '#5fd4d4',
    },

    progressNumber: {
        fontSize: 14,
        fontWeight: '600',
    },

    progressNumberActive: {
        color: '#ffffff',
    },

    progressNumberComplete: {
        color: '#ffffff',
    },

    progressNumberPending: {
        color: 'rgba(255, 255, 255, 0.5)',
    },

    troubleshootButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
    },

    troubleshootIcon: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    videoContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        overflow: 'hidden',
        top: 100,
    },

    video: {
        position: 'absolute',
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width,
        transform: [{ rotate: '90deg' }],
    },

    videoLabelContainer: {
        position: 'absolute',
        top: 110,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },

    videoLabelText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '500',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },

    videoPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#4a4a4a',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    videoPlaceholderText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },

    videoStatusText: {
        color: '#5fd4d4',
        fontSize: 18,
    },

    skipButtonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 10,
    },

    skipButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },

    skipButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 50,
        paddingBottom: 80,
        zIndex: 10,
    },

    nextButton: {
        backgroundColor: '#f0a090',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    buttonPressed: {
        backgroundColor: '#e8958a',
        transform: [{ scale: 0.98 }],
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },

    exitButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
        color: '#7FB8C4',
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

    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },

    exitConfirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#e74c3c',
        alignItems: 'center',
    },

    exitConfirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});