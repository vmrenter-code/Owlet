import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// This screen instructs the parent to position their child's face in the center circle
// The Begin button is disabled until face is detected (navigates to ReadyToBegin)

export default function PositionChild() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            {/* Placeholder for camera - in production, use expo-camera */}
            <View style={styles.cameraPlaceholder}>
                <Text style={styles.cameraText}>Camera View</Text>
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

            {/* Instruction text */}
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                    Position your child to the center of the circle
                </Text>
            </View>

            {/* Face positioning circle */}
            <View style={styles.circleContainer}>
                <View style={styles.faceCircle}>
                    <View style={styles.circleIndicator} />
                </View>
            </View>

            {/* Begin button - disabled state */}
            <View style={styles.buttonContainer}>
                <Pressable 
                    style={styles.beginButtonDisabled}
                    onPress={() => {
                        // In production, this would only be enabled when face is detected
                        // For demo, navigate to ReadyToBegin
                        navigation.navigate('ReadyToBegin');
                    }}
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
        backgroundColor: '#3a3a3a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cameraText: {
        color: '#666',
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

    instructionContainer: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 40,
        zIndex: 10,
    },

    instructionText: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
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

    beginButtonDisabled: {
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

    beginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
});

