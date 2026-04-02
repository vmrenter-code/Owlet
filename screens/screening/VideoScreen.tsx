import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';

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
    
    // Simulate video finishing after 5 seconds (replace with actual video logic)
    useEffect(() => {
        setIsPlaying(true);
        const timer = setTimeout(() => {
            setIsPlaying(false);
        }, 5000); // Video "finishes" after 5 seconds
        
        return () => clearTimeout(timer);
    }, [videoNumber]);
    
    const handleNext = async () => {
        try {
            const response = await fetch(`${BASE_URL}/screening/video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videoNumber,
                completedAt: new Date().toISOString(),
            }),
            });

            if (!response.ok) throw new Error('Failed to log video session');

            const data = await response.json();

            if (data.success) {
            console.log(`Video ${videoNumber} logged successfully`, data.videoSession);
            if (videoNumber < totalVideos) {
                navigation.push('VideoScreen', { videoNumber: videoNumber + 1 });
            } else {
                await fetch(`${BASE_URL}/screening/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completedAt: new Date().toISOString() }),
                });
                navigation.navigate('ScreeningComplete');
            }
            } else {
            console.log('Server did not confirm video logging');
            }
        } catch (error) {
            console.error('Error logging video session:', error);
        }
        };

    return (
        <View style={styles.container}>
            {/* Header with progress and troubleshooting */}
            <View style={styles.headerContainer}>
                {/* Progress indicators on the left */}
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
});

