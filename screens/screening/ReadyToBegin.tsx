import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useScreening } from '../../context/ScreeningContext';
import { usePolarH9 } from '../../src/services/polarH9Service';

// This screen appears when face is detected in the circle
// The Begin button is now active and ready to start the screening

export default function ReadyToBegin() {
    const navigation = useNavigation<any>();
    const { screeningID } = useScreening();
    const { heartRate, connected, scanning, error, connectToH9 } = usePolarH9();

    const handleBegin = () => {
        // Start the screening process - navigate to first video
        // The screeningID is passed via context, but also as route param for backup
        console.log('Starting screening with ID:', screeningID);
        navigation.navigate('VideoScreen', { videoNumber: 1, screeningId: screeningID });
    };

    return (
        <View style={styles.container}>
            {/* Placeholder for camera with face detected */}
            <View style={styles.cameraPlaceholder}>
                <Text style={styles.cameraText}>Camera View - Face Detected</Text>
            </View>

            {/* Header with back button and record indicator */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backArrow}>‹</Text>
                </Pressable>
                
                <View style={styles.recordIndicator}>
                    <View style={styles.recordDot} />
                </View>
            </View>

            {/* Face positioning circle - face is now detected */}
            <View style={styles.circleContainer}>
                <View style={styles.faceCircle}>
                </View>
            </View>

            {/* H9 Connection Section */}
            <View style={styles.h9Container}>
                {!connected ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.connectButton,
                            pressed && styles.connectButtonPressed
                        ]}
                        onPress={connectToH9}
                        disabled={scanning}
                    >
                        <Text style={styles.connectButtonText}>
                            {scanning ? '🔍 Scanning for H9...' : '🫀 Connect Polar H9'}
                        </Text>
                    </Pressable>
                ) : (
                    <View style={styles.connectedBadge}>
                        <Text style={styles.connectedText}>✅ H9 Connected</Text>
                        {heartRate && (
                            <Text style={styles.heartRatePreview}>{heartRate} BPM</Text>
                        )}
                    </View>
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>





            {/* Begin button - active state */}
            <View style={styles.buttonContainer}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.beginButtonActive,
                        pressed && styles.beginButtonPressed
                    ]}
                    onPress={handleBegin}
                >
                    <Text style={styles.beginButtonText}>Begin</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2a2a',
    },

    cameraPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#4a4a4a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cameraText: {
        color: '#888',
        fontSize: 18,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        zIndex: 10,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backArrow: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '300',
        marginTop: -2,
    },

    

    recordIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    recordDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ff4444',
    },

    circleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    faceCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 3,
        borderColor: '#8b7bc7',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },

  

    buttonContainer: {
        paddingHorizontal: 50,
        paddingBottom: 80,
        zIndex: 10,
    },

    beginButtonActive: {
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

    beginButtonPressed: {
        backgroundColor: '#e8958a',
        transform: [{ scale: 0.98 }],
    },

    beginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },


    h9Container: {
        position: 'absolute',
        bottom: 160,
        left: 50,
        right: 50,
        alignItems: 'center',
        zIndex: 10,
    },

    connectButton: {
        backgroundColor: 'rgba(95, 212, 212, 0.9)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: 'center',
    },

    connectButtonPressed: {
        backgroundColor: 'rgba(95, 212, 212, 0.7)',
    },

    connectButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },

    connectedBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        gap: 4,
    },

    connectedText: {
        color: '#5fd4d4',
        fontSize: 15,
        fontWeight: '600',
    },

    heartRatePreview: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    errorText: {
        color: '#ff6b6b',
        fontSize: 13,
        marginTop: 6,
        textAlign: 'center',
    },

    beginButtonDisabled: {
        backgroundColor: '#888888',
        opacity: 0.6,
    },
});

