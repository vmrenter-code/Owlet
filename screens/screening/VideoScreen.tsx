import { View, Text, StyleSheet, Pressable, Platform, Modal, ActivityIndicator } from 'react-native';
import { API_BASE_URL as BASE_URL } from '../../src/config/apiBaseUrl';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission, useVideoOutput, type CameraRef } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { startScreeningRecording, stopScreeningRecording, isCurrentlyRecording, setVideoOutput, setCameraReady, setCameraNotReady } from '../../src/services/screeningRecordingService';
import { useScreening, calculateRMSSD } from '../../context/ScreeningContext';

// Video sources for each screening video
const videoSources: { [key: number]: any } = {
    1: require('../../assets/videos/Video1.mp4'),
    2: require('../../assets/videos/Video2.mp4'),
    3: require('../../assets/videos/Video3.mp4'),
    4: require('../../assets/videos/Video4.mp4'),
    5: require('../../assets/videos/Video5.mp4'),
};
import { uploadScreeningVideo } from '../../src/services/uploadService';
import LandscapeStage from '../../components/LandscapeStage';
import TroubleshootingOverlay from '../../components/TroubleshootingOverlay';

const createLocalScreeningId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// This screen plays videos during the screening process
// Shows 5 videos sequentially with Stop and Save / Next buttons

export default function VideoScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const isFocused = useIsFocused();

    const { screeningId: screeningID, heartRateLog, addHeartRateDataPoint, clearHeartRateLog, clearRrLog, setScreeningStartTime, heartRate, rrLog, connected, disconnect } = useScreening();
    const heartRateLogRef = useRef<typeof heartRateLog>([]);
    const heartRateRef = useRef<number | null>(null);

    useEffect(() => {
        heartRateRef.current = heartRate;
    }, [heartRate]);

    const currentScreeningID = screeningID || route.params?.screeningId;
    const videoNumber = route.params?.videoNumber || 1;

    useEffect(() => {
        if (videoNumber === 1) {
            clearHeartRateLog();
            clearRrLog();
            setScreeningStartTime(Date.now());
        }
    }, [videoNumber]);

    useEffect(() => {
        if (rrLog.length > 0) {
            AsyncStorage.setItem(
                `rrLog_${currentScreeningID}`,
                JSON.stringify(rrLog)
            ).catch(() => {});
        }
    }, [currentScreeningID, rrLog]);

    useEffect(() => {
        heartRateLogRef.current = heartRateLog;
    }, [heartRateLog]);

    useEffect(() => {
        if (!connected) return;
        const interval = setInterval(() => {
            const currentBpm = heartRateRef.current;
            if (currentBpm) addHeartRateDataPoint(currentBpm);
        }, 1000);
        return () => clearInterval(interval);
    }, [connected]);


    
    // Cleanup: stop video when component unmounts
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.stopAsync();
            }
        };
    }, []);

    // Pause/stop video when navigating away (e.g. going back to home)
    useFocusEffect(
        useCallback(() => {
            return () => {
                if (videoRef.current) {
                    videoRef.current.stopAsync().catch(() => {});
                }
            };
        }, [])
    );
    
    const { screeningId, videoNumber: initialVideoNumber = 1 } = route.params ?? {};
    const cameraRef = useRef<CameraRef>(null);
    const videoRef = useRef<Video>(null);
    const hasAttemptedRecordingStartRef = useRef(false);
    const { hasPermission: cameraGranted, requestPermission: requestCameraPermission } = useCameraPermission();
    const { hasPermission: micGranted, requestPermission: requestMicrophonePermission } = useMicrophonePermission();
    const frontDevice = useCameraDevice('front');
    const videoOutput = useVideoOutput({ enableAudio: true, fileType: 'mp4' });
    
    const totalVideos = 5;
    const [currentVideoNumber, setCurrentVideoNumber] = useState(initialVideoNumber);
    const [activeScreeningId, setActiveScreeningId] = useState<string | null>(screeningId ?? null);
    
    const [videoFinished, setVideoFinished] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // Track exit confirmation modal visibility
    const [showExitModal, setShowExitModal] = useState(false);
    const [showTroubleshooting, setShowTroubleshooting] = useState(false);
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
                    //
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
                //
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
                    //
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
                //
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
        if (!cameraGranted) {
            requestCameraPermission();
        }
        if (!micGranted) {
            requestMicrophonePermission();
        }
    }, [cameraGranted, micGranted]);
    
    const handleExitScreening = async () => {
        // Stop the video before exiting
        if (videoRef.current) {
            await videoRef.current.stopAsync();
        }
        setShowExitModal(false);
        navigation.navigate('MainTabs');
    };

    const handleCameraReady = () => {
        setCameraReady();
        setIsCameraReady(true);
        setIsCameraMounted(true);
        setIsRefReady(true);
    };

    // Only the first VideoScreen registers its output and owns the camera session
    useEffect(() => {
        if (!ownsRecordingSession) return;
        setVideoOutput(videoOutput);
        return () => setVideoOutput(null);
    }, [videoOutput, ownsRecordingSession]);

    // Camera mount state is only relevant for the screen that owns recording
    useEffect(() => {
        const mounted = ownsRecordingSession && cameraGranted && micGranted && !!frontDevice;
        setIsCameraMounted(mounted);
        setIsRefReady(mounted);
        if (!mounted) {
            setCameraNotReady();
            setIsCameraReady(false);
        }
    }, [ownsRecordingSession, cameraGranted, micGranted, frontDevice]);
    
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
                //
            }
        };
        saveProgress();
    }, [activeScreeningId, currentVideoNumber]);
    
    useEffect(() => {
        setVideoFinished(false);
    }, [currentVideoNumber, videoNumber]);

    const openTroubleshooting = async () => {
        const video = videoRef.current;
        if (video) {
            try {
                const status = await video.getStatusAsync();
                if (status.isLoaded && status.isPlaying) {
                    await video.pauseAsync();
                }
            } catch {
                // ignore pause errors
            }
        }
        setShowTroubleshooting(true);
    };

    const closeTroubleshooting = async () => {
        setShowTroubleshooting(false);
        setVideoFinished(false);

        const video = videoRef.current;
        if (!video) return;

        try {
            await video.setPositionAsync(0);
            await video.playAsync();
        } catch {
            // ignore restart errors
        }
    };

    const ownsRecordingSession = videoNumber === 1;

    // safe recording start -- only the first screen should own the recording session
    useEffect(() => {
        if (
            ownsRecordingSession &&
            isCameraReady &&
            isRefReady &&
            isCameraMounted &&
            cameraGranted &&
            micGranted &&
            !isCurrentlyRecording() &&
            !hasAttemptedRecordingStartRef.current
        ) {
            hasAttemptedRecordingStartRef.current = true;
            //
            const startTimer = setTimeout(() => {
                startScreeningRecording().then((started) => {
                    if (!started) {
                        hasAttemptedRecordingStartRef.current = false;
                    }
                });
            }, 250);

            return () => clearTimeout(startTimer);
        }
    }, [ownsRecordingSession, cameraGranted, isCameraMounted, isCameraReady, isRefReady, micGranted]);
    
    const handleNext = async () => {
    if (isUploading) {
        return;
    }

    // Stop the current video before navigating
    if (videoRef.current) {
        await videoRef.current.stopAsync();
    }

        if (videoNumber < totalVideos) {
        navigation.push('VideoScreen', { videoNumber: videoNumber + 1, screeningId: currentScreeningID });
    } else {
        //
        setIsUploading(true);
        try {
            let recordingPath: string | null = null;
            let uploadedObjectKey: string | null = null;
            const screeningIdForUpload = activeScreeningId ?? currentScreeningID;

            try {
                recordingPath = await Promise.race([
                    stopScreeningRecording(),
                    new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
                ]);
            } catch (e) {
                //
            }

            //

            // S3 Upload
            if (recordingPath && screeningIdForUpload) {
                const uploadResult = await uploadScreeningVideo({
                    baseUrl: BASE_URL,
                    screeningId: screeningIdForUpload,
                    videoNumber: totalVideos,
                    recordingUri: recordingPath,
                    contentType: 'video/mp4',
                });

                if (uploadResult.success) {
                    uploadedObjectKey = uploadResult.objectKey ?? null;
                    //
                } else {
                    //
                }
            } else {
                //
            }

            // Save screening progress
            try {
                await AsyncStorage.setItem('screeningProgress', JSON.stringify({
                    screeningId: screeningIdForUpload,
                    videoNumber: totalVideos,
                    completed: true,
                    timestamp: Date.now(),
                    recordingUri: recordingPath,
                    s3ObjectKey: uploadedObjectKey,
                }));
            } catch (e) {
                //
            }

            // Save heart rate log BEFORE disconnecting
            try {
                //
                await AsyncStorage.setItem(
                    `heartRateLog_${screeningIdForUpload}`,
                    JSON.stringify(heartRateLogRef.current)
                );
                await AsyncStorage.setItem(
                    `rrLog_${screeningIdForUpload}`,
                    JSON.stringify(rrLog)
                );
            } catch (e) {
                //
            }

            try {
                const rmssd = calculateRMSSD(rrLog);
                const response = await fetch(`${BASE_URL}/screening/${screeningIdForUpload}/heart-rate-csv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        videoNumber: totalVideos,
                        heartRateLog: heartRateLogRef.current,
                        rrLog,
                        rmssd,
                        completedAt: new Date().toISOString(),
                    }),
                });

                if (!response.ok) {
                    console.warn('Heart rate upload failed:', await response.text());
                }
            } catch (error) {
                console.warn('Heart rate upload error:', error);
            }

            disconnect(); // disconnect AFTER saving
            navigation.navigate('ScreeningComplete');
        } finally {
            setIsUploading(false);
        }
    }
};
//hidden camera. must have it to run without preview


    return (
        <View style={styles.container}>
            {ownsRecordingSession && cameraGranted && micGranted && frontDevice && (
                <Camera
                    ref={cameraRef}
                    style={styles.hiddenCamera}
                    device={frontDevice}
                    isActive={true}
                    outputs={[videoOutput]}
                    onStarted={handleCameraReady}
                    onStopped={() => {
                        setCameraNotReady();
                        setIsCameraReady(false);
                    }}
                />
            )}

            <LandscapeStage backgroundColor="#000">
                <View style={styles.videoContainer}>
                    <Video
                        ref={videoRef}
                        source={videoSources[videoNumber]}
                        style={styles.video}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={isFocused && !videoFinished}
                        isLooping={false}
                        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                            if (status.isLoaded && status.didJustFinish) {
                                setVideoFinished(true);
                            }
                        }}
                    />
                </View>

                <View style={styles.headerContainer}>
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
                                {index < 4 && (
                                    <View style={[
                                        styles.progressLine,
                                        num < currentVideoNumber && styles.progressLineComplete,
                                    ]} />
                                )}
                            </View>
                        ))}
                    </View>

                    <Pressable
                        style={styles.troubleshootButton}
                        onPress={openTroubleshooting}
                    >
                        <Text style={styles.troubleshootIcon}>!</Text>
                    </Pressable>
                </View>

                {!videoFinished ? (
                    <View style={styles.skipButtonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.skipButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={handleNext}
                        >
                            <Text style={styles.skipButtonText}>
                                {videoNumber < totalVideos ? 'Skip →' : 'Finish →'}
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.nextButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={handleNext}
                        >
                            <Text style={styles.buttonText}>
                                {currentVideoNumber < totalVideos ? 'Next' : 'Finish and Submit'}
                            </Text>
                        </Pressable>
                    </View>
                )}

                {connected && heartRate ? (
                    <View style={styles.heartRateContainer}>
                        <Text style={styles.heartRateLabel}> Heart Rate</Text>
                        <Text style={styles.heartRateValue}>{heartRate} BPM</Text>
                    </View>
                ) : null}

                {showExitModal ? (
                    <View style={styles.modalOverlay} pointerEvents="auto">
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
                ) : null}

                <Modal visible={isUploading} transparent statusBarTranslucent animationType="fade" onRequestClose={() => {}}>
                    <View style={styles.uploadOverlay}>
                        <View style={styles.uploadCard}>
                            <ActivityIndicator size="large" color="#5058b4" />
                            <Text style={styles.uploadTitle}>Video is uploading</Text>
                            <Text style={styles.uploadMessage}>Please stay on this screen until the upload finishes.</Text>
                        </View>
                    </View>
                </Modal>

                <TroubleshootingOverlay
                    visible={showTroubleshooting}
                    onClose={closeTroubleshooting}
                />
            </LandscapeStage>
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
        paddingTop: 16,
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
        backgroundColor: '#5058b4',
        borderWidth: 3,
        borderColor: '#ffffff',
    },

    progressDotComplete: {
        backgroundColor: '#5058b4',
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
        backgroundColor: '#5058b4',
    },

    progressNumber: {
        fontSize: 13,
        fontFamily: 'NotoSans-SemiBold',
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

    skipButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    },

skipIcon: {
    color: '#ffffff',
    fontSize: 18,
},

    videoContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 1,
        overflow: 'hidden',
    },

    video: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
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

    videoStatusText: {
        color: '#5058b4',
        fontSize: 16,
        fontFamily: 'NotoSans-SemiBold',
    },

    skipButtonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 10,
    },


    skipButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontFamily: 'NotoSans-SemiBold',
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },

    nextButton: {
        backgroundColor: '#5058b4',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 100,
        alignItems: 'center',
        minWidth: 160,
    },

    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        letterSpacing: 0.1,
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
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 50,
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
        fontSize: 18,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        marginBottom: 10,
        letterSpacing: -0.2,
    },

    modalMessage: {
        fontSize: 15,
        fontFamily: 'NotoSans-Regular',
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 22,
    },

    modalNote: {
        fontSize: 13,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 19,
    },

    modalButtons: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },

    uploadOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    uploadCard: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 24,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        backgroundColor: 'rgba(18, 20, 28, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },

    uploadTitle: {
        marginTop: 18,
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
    },

    uploadMessage: {
        marginTop: 10,
        color: 'rgba(255, 255, 255, 0.78)',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },

    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignItems: 'center',
    },

    cancelButtonText: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#555',
    },

    exitConfirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 100,
        backgroundColor: '#5058b4',
        alignItems: 'center',
    },

    exitConfirmButtonText: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#ffffff',
    },

    heartRateContainer: {
    position: 'absolute',
    top: 56,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    zIndex: 10,
},

heartRateLabel: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
},

heartRateValue: {
    color: '#ff6b6b',
    fontSize: 22,
    fontWeight: 'bold',
},
});