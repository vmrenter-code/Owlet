import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';

// This screen plays videos during the screening process
// Shows 4 videos sequentially with Stop and Save / Next buttons

export default function VideoScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { screeningId, videoNumber } = route.params;
    const BASE_URL = 'http://localhost:4000';
    
    // Get current video number from params (default to 1)
    //const videoNumber = route.params?.videoNumber || 1;
    const totalVideos = 5;
    
    // Track if video is playing or finished
    const [isPlaying, setIsPlaying] = useState(true);
    
    // Track exit confirmation modal visibility
    const [showExitModal, setShowExitModal] = useState(false);
    
    const handleExitScreening = () => {
        setShowExitModal(false);
        navigation.navigate('MainTabs');
    };
    
    // Save progress when entering this screen
    useEffect(() => {
        const saveProgress = async () => {
            try {
                await AsyncStorage.setItem('screeningProgress', JSON.stringify({
                    videoNumber: videoNumber,
                    completed: false,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.log('Error saving progress');
            }
        };
        saveProgress();
    }, [videoNumber]);
    
    // Simulate video finishing after 5 seconds (replace with actual video logic)
    useEffect(() => {
        setIsPlaying(true);
        const timer = setTimeout(() => {
            setIsPlaying(false);
        }, 5000); // Video "finishes" after 5 seconds
        
        return () => clearTimeout(timer);
    }, [videoNumber]);
    
    const handleNext = async () => {
        if (videoNumber < totalVideos) {
            // Go to next video
            navigation.push('VideoScreen', { videoNumber: videoNumber + 1 });
        } else {
            // All videos complete - clear progress and navigate to completion screen
            try {
                await AsyncStorage.setItem('screeningProgress', JSON.stringify({
                    videoNumber: totalVideos,
                    completed: true,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.log('Error clearing progress');
            }
            navigation.navigate('ScreeningComplete');
        }
    };

    return (
        <View style={styles.container}>
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
                                    num === videoNumber && styles.progressDotActive,
                                    num < videoNumber && styles.progressDotComplete,
                                    num > videoNumber && styles.progressDotPending,
                                ]}
                            >
                                <Text style={[
                                    styles.progressNumber,
                                    num === videoNumber && styles.progressNumberActive,
                                    num < videoNumber && styles.progressNumberComplete,
                                    num > videoNumber && styles.progressNumberPending,
                                ]}>
                                    {num < videoNumber ? '✓' : num}
                                </Text>
                            </View>
                            {/* Connecting line (except after last dot) */}
                            {index < 4 && (
                                <View style={[
                                    styles.progressLine,
                                    num < videoNumber && styles.progressLineComplete,
                                ]} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Troubleshooting button on the right */}
                <Pressable 
                    style={styles.troubleshootButton}
                    onPress={() => navigation.navigate('TroubleshootingScreen', { videoNumber })}
                >
                    <Text style={styles.troubleshootIcon}>!</Text>
                </Pressable>
            </View>

            {/* Video placeholder */}
            <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoPlaceholderText}>
                        Video {videoNumber} of {totalVideos}
                    </Text>
                    <Text style={styles.videoStatusText}>
                        {isPlaying ? '▶ Playing...' : '✓ Finished'}
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
                            {videoNumber < totalVideos ? 'Next' : 'Finish and Submit'}
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
    },

    videoPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#4a4a4a',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    videoPlaceholderText: {
        color: '#888',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10,
    },

    videoStatusText: {
        color: '#5fd4d4',
        fontSize: 18,
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

