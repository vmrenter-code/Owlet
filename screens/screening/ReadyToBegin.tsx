import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// This screen appears when face is detected in the circle
// The Begin button is now active and ready to start the screening

export default function ReadyToBegin() {
    const navigation = useNavigation<any>();

    const handleBegin = () => {
        // Start the screening process - navigate to first video
        navigation.navigate('VideoScreen', { videoNumber: 1 });
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
                    <View style={styles.circleIndicator} />
                </View>
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
});

