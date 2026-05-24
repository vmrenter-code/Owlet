import { View, Text, StyleSheet, Pressable, Modal, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { startScreeningRecording, stopScreeningRecording, isCurrentlyRecording, initializeCameraRef, setCameraReady, setCameraNotReady } from '../../src/services/screeningRecordingService';
import { useScreening, calculateRMSSD } from '../../context/ScreeningContext';
import { uploadScreeningVideo } from '../../src/services/uploadService';

const videoSources: { [key: number]: any } = {
    1: require('../../assets/videos/Video1.mp4'),
    2: require('../../assets/videos/Video2.mp4'),
    3: require('../../assets/videos/Video3.mp4'),
    4: require('../../assets/videos/Video4.mp4'),
    5: require('../../assets/videos/Video5.mp4'),
};

const createLocalScreeningId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function VideoScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const {
        screeningId: screeningID,
        heartRateLog,
        addHeartRateDataPoint,
        clearHeartRateLog,
        setScreeningStartTime,
        heartRate,
        connected,
        disconnect,
        rrInterval,
        rrLog,
        addRrInterval,
        clearRrLog,
    } = useScreening();

    const heartRateLogRef = useRef<typeof heartRateLog>([]);
    const heartRateRef = useRef<number | null>(null);
    const rrLogRef = useRef<number[]>([]);

    useEffect(() => { heartRateRef.current = heartRate; }, [heartRate]);
    useEffect(() => { heartRateLogRef.current = heartRateLog; }, [heartRateLog]);
    useEffect(() => { rrLogRef.current = rrLog; }, [rrLog]);

    // Track new RR intervals as they come in
    useEffect(() => {
        if (rrInterval && connected) {
            addRrInterval(rrInterval);
        }
    }, [rrInterval]);

    const currentScreeningID = screeningID || route.params?.screeningId;
    const videoNumber = route.params?.videoNumber || 1;

    useEffect(() => {
        console.log('VideoScreen - Current Screening ID:', currentScreeningID);
        console.log('VideoScreen - Video Number:', videoNumber);
    }, [currentScreeningID, videoNumber]);

    useEffect(() => {
        if (videoNumber === 1) {
            clearHeartRateLog();
            clearRrLog();
            setScreeningStartTime(Date.now());
        }
    }, [videoNumber]);

    useEffect(() => {
        if (!connected) return;
        const interval = setInterval(() => {
            const currentBpm = heartRateRef.current;
            if (currentBpm) {
                addHeartRateDataPoint(currentBpm);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [connected]);

    const loadMockHeartRateData = () => {
        const mockHeartRateLog = [
            { time: 0, bpm: 122 },
            { time: 1, bpm: 121 },
            { time: 2, bpm: 119 },
            { time: 3, bpm: 120 },
            { time: 4, bpm: 118 },
        ];
        const mockRrLog = [812, 798, 805, 790, 796, 802];

        heartRateLogRef.current = mockHeartRateLog;
        rrLogRef.current = mockRrLog;

        console.log('Mock heart-rate data loaded:', {
            heartRateCount: mockHeartRateLog.length,
            rrCount: mockRrLog.length,
        });
    };

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
    const [isPlaying, setIsPlaying] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [isCameraMounted, setIsCameraMounted] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isRefReady, setIsRefReady] = useState(false);

    useEffect(() => { setCurrentVideoNumber(initialVideoNumber); }, [initialVideoNumber]);

    useEffect(() => {
        if (screeningId) setActiveScreeningId(screeningId);
    }, [screeningId]);

    useEffect(() => {
        let isMounted = true;
        const ensureScreeningId = async () => {
            if (activeScreeningId) return;
            try {
                const response = await fetch(`${BASE_URL}/screening`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ startedAt: new Date().toISOString() }),
                });
                if (!response.ok) {
                    if (isMounted) setActiveScreeningId(createLocalScreeningId());
                    return;
                }
                const payload = await response.json();
                const createdId = payload?.screening?.id ?? createLocalScreeningId();
                if (isMounted) setActiveScreeningId(createdId);
            } catch (error) {
                if (isMounted) setActiveScreeningId(createLocalScreeningId());
            }
        };
        ensureScreeningId();
        return () => { isMounted = false; };
    }, [activeScreeningId, BASE_URL]);

    useEffect(() => {
        if (cameraPermission?.status === 'undetermined') requestCameraPermission?.();
        if (microphonePermission?.status === 'undetermined') requestMicrophonePermission?.();
    }, [cameraPermission?.status, microphonePermission?.status]);

    const handleExitScreening = async () => {
        if (videoRef.current) await videoRef.current.stopAsync();
        setShowExitModal(false);
        navigation.navigate('MainTabs');
    };

    const handleCameraReady = () => {
        setCameraReady();
        setIsCameraReady(true);
    };

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

    useEffect(() => {
        const saveProgress = async () => {
            try {
                await AsyncStorage.setItem('screeningProgress', JSON.stringify({
                    screeningId: activeScreeningId,
                    videoNumber: currentVideoNumber,
                    completed: false,
                    timestamp: Date.now(),
                }));
            } catch (e) {
                console.log('Error saving progress');
            }
        };
        saveProgress();
    }, [activeScreeningId, currentVideoNumber]);

    useEffect(() => {
        setIsPlaying(true);
        const timer = setTimeout(() => setIsPlaying(false), 5000);
        return () => clearTimeout(timer);
    }, [currentVideoNumber]);

    useEffect(() => {
        if (
            isCameraReady && isRefReady && isCameraMounted &&
            cameraPermission?.granted && microphonePermission?.granted &&
            !isCurrentlyRecording() && !hasAttemptedRecordingStartRef.current
        ) {
            hasAttemptedRecordingStartRef.current = true;
            const startTimer = setTimeout(() => {
                startScreeningRecording().then((started) => {
                    if (!started) hasAttemptedRecordingStartRef.current = false;
                });
            }, 250);
            return () => clearTimeout(startTimer);
        }
    }, [cameraPermission?.granted, isCameraMounted, isCameraReady, isRefReady, microphonePermission?.granted]);

    const handleNext = async () => {
        if (videoRef.current) await videoRef.current.stopAsync();

        //const { screeningID } = useScreening(); // get the current screening ID

        if (!screeningID) {
            console.error('No active screening ID.');
            return;
        }

        try {
            await fetch(`${BASE_URL}/screening/video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                screeningID,
                videoNumber,
                completedAt: new Date().toISOString(),
            }),
            });
            console.log(`Video ${videoNumber} logged successfully for screening ${screeningID}`);
        } catch (err) {
            console.error('Error logging video session:', err);
        }

        if (videoNumber < totalVideos) {
            navigation.replace('VideoScreen', { videoNumber: videoNumber + 1, screeningId: currentScreeningID });
        } else {
            console.log('Video 5 completed, stopping recording...');
            let recordingPath: string | null = null;
            let uploadedObjectKey: string | null = null;

            if (!isCurrentlyRecording()) {
                const recovered = await startScreeningRecording();
                if (recovered) await new Promise((resolve) => setTimeout(resolve, 1200));
            }

            try {
                recordingPath = await Promise.race([
                    stopScreeningRecording(),
                    new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
                ]);
            } catch (e) {
                console.log('Error stopping recording');
            }

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
                }
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

            // Save heart rate log
            try {
                await AsyncStorage.setItem(
                    `heartRateLog_${currentScreeningID}`,
                    JSON.stringify(heartRateLogRef.current)
                );
            } catch (e) {
                console.log('Error saving heart rate log');
            }

            // Save RR interval log for HRV calculation
            try {
                console.log('Saving RR log, length:', rrLogRef.current.length);
                await AsyncStorage.setItem(
                    `rrLog_${currentScreeningID}`,
                    JSON.stringify(rrLogRef.current)
                );
            } catch (e) {
                console.log('Error saving RR log');
            }

            // Upload heart rate and RR logs to S3 via backend (include RMSSD)
            if (currentScreeningID) {
                const rmssd = calculateRMSSD(rrLogRef.current ?? []);
                try {
                    const heartRateResponse = await fetch(`${BASE_URL}/screening/${currentScreeningID}/heart-rate-csv`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            videoNumber: totalVideos,
                            heartRateLog: heartRateLogRef.current,
                            rrLog: rrLogRef.current,
                            rmssd,
                            completedAt: new Date().toISOString(),
                        }),
                    });

                    if (!heartRateResponse.ok) {
                        console.log('Heart rate CSV upload failed:', heartRateResponse.status);
                    } else {
                        const payload = await heartRateResponse.json();
                        console.log('Heart rate CSV uploaded successfully:', payload);
                    }
                } catch (e) {
                    console.log('Error uploading heart rate CSVs', e);
                }
            }

            disconnect();

            //Update screening with completedAt in backend
            try {
                await fetch(`${BASE_URL}/screening/${screeningID}/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        completedAt: new Date().toISOString(),
                    }),
                });
                console.log(`Screening ${screeningID} marked as complete`);
            } catch (e) {
                console.log('Error updating screening completion', e);
            }

            navigation.navigate('ScreeningComplete');
        }
    };

    return (
        <View style={styles.container}>
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

            <View style={styles.headerContainer}>
                <Pressable style={styles.exitButton} onPress={() => setShowExitModal(true)}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </Pressable>

                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4, 5].map((num, index) => (
                        <View key={num} style={styles.progressItemContainer}>
                            <View style={[
                                styles.progressDot,
                                num === currentVideoNumber && styles.progressDotActive,
                                num < currentVideoNumber && styles.progressDotComplete,
                                num > currentVideoNumber && styles.progressDotPending,
                            ]}>
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
                                <View style={[styles.progressLine, num < currentVideoNumber && styles.progressLineComplete]} />
                            )}
                        </View>
                    ))}
                </View>

                <Pressable
                    style={styles.troubleshootButton}
                    onPress={() => navigation.navigate('TroubleshootingScreen', { videoNumber: currentVideoNumber })}
                >
                    <Text style={styles.troubleshootIcon}>!</Text>
                </Pressable>
            </View>

            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    source={videoSources[videoNumber]}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={isPlaying}
                    isLooping={false}
                    onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                        if (status.isLoaded && status.didJustFinish) setIsPlaying(false);
                    }}
                />
            </View>

            <View style={styles.skipButtonContainer}>
                <Pressable
                    style={({ pressed }) => [styles.skipButton, pressed && styles.buttonPressed]}
                    onPress={handleNext}
                >
                    <Text style={styles.skipButtonText}>
                        {videoNumber < totalVideos ? 'Skip →' : 'Finish →'}
                    </Text>
                </Pressable>
                {__DEV__ && (
                    <Pressable
                        style={({ pressed }) => [styles.mockButton, pressed && styles.buttonPressed]}
                        onPress={loadMockHeartRateData}
                    >
                        <Text style={styles.mockButtonText}>Load Mock HR Data</Text>
                    </Pressable>
                )}
                <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoPlaceholderText}>
                        Video {currentVideoNumber} of {totalVideos}
                    </Text>
                </View>
            </View>

            {connected && heartRate && (
                <View style={styles.heartRateContainer}>
                    <Text style={styles.heartRateLabel}>Heart Rate</Text>
                    <Text style={styles.heartRateValue}>{heartRate} BPM</Text>
                </View>
            )}

            {!isPlaying && (
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>
                            {currentVideoNumber < totalVideos ? 'Next' : 'Finish and Submit'}
                        </Text>
                    </Pressable>
                </View>
            )}

            <Modal visible={showExitModal} transparent animationType="fade" onRequestClose={() => setShowExitModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Exit Screening?</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to exit the screening process?</Text>
                        <Text style={styles.modalNote}>
                            Don't worry — your completed videos are automatically saved. You can resume from where you left off anytime.
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.cancelButton} onPress={() => setShowExitModal(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.exitConfirmButton} onPress={handleExitScreening}>
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
    container: { flex: 1, backgroundColor: '#2a2a2a' },
    hiddenCamera: { position: 'absolute', width: 10, height: 10, opacity: 0.1 },
    headerContainer: {
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 50, paddingHorizontal: 20, zIndex: 10,
    },
    progressContainer: { flexDirection: 'row', alignItems: 'center' },
    progressItemContainer: { flexDirection: 'row', alignItems: 'center' },
    progressDot: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    progressDotActive: { backgroundColor: '#5fd4d4', borderWidth: 3, borderColor: '#ffffff' },
    progressDotComplete: { backgroundColor: '#5fd4d4' },
    progressDotPending: { backgroundColor: 'transparent', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.5)' },
    progressLine: { width: 12, height: 2, backgroundColor: 'rgba(255, 255, 255, 0.3)', marginHorizontal: 2 },
    progressLineComplete: { backgroundColor: '#5fd4d4' },
    progressNumber: { fontSize: 14, fontWeight: '600' },
    progressNumberActive: { color: '#ffffff' },
    progressNumberComplete: { color: '#ffffff' },
    progressNumberPending: { color: 'rgba(255, 255, 255, 0.5)' },
    troubleshootButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e74c3c', justifyContent: 'center', alignItems: 'center' },
    troubleshootIcon: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
    videoContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 1, overflow: 'hidden', top: 100 },
    video: {
        position: 'absolute',
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width,
        transform: [{ rotate: '90deg' }],
    },
    videoPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#4a4a4a', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    videoPlaceholderText: { color: '#ffffff', fontSize: 18, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    skipButtonContainer: { position: 'absolute', bottom: 100, right: 20, zIndex: 10 },
    skipButton: { backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    skipButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    mockButton: { marginTop: 10, backgroundColor: 'rgba(95, 212, 212, 0.9)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'flex-end' },
    mockButtonText: { color: '#14313a', fontSize: 13, fontWeight: '700' },
    buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 50, paddingBottom: 80, zIndex: 10 },
    nextButton: { backgroundColor: '#f0a090', paddingVertical: 15, borderRadius: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    buttonPressed: { backgroundColor: '#e8958a', transform: [{ scale: 0.98 }] },
    buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
    exitButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContainer: { backgroundColor: '#ffffff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 340, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12 },
    modalMessage: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 12, lineHeight: 22 },
    modalNote: { fontSize: 14, color: '#7FB8C4', textAlign: 'center', marginBottom: 24, lineHeight: 20, fontStyle: 'italic' },
    modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#f0f0f0', alignItems: 'center' },
    cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
    exitConfirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#e74c3c', alignItems: 'center' },
    exitConfirmButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
    heartRateContainer: { position: 'absolute', top: 110, right: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, alignItems: 'center', zIndex: 10 },
    heartRateLabel: { color: '#ffffff', fontSize: 12, opacity: 0.8 },
    heartRateValue: { color: '#ff6b6b', fontSize: 22, fontWeight: 'bold' },
});