import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

// This screen instructs the parent to position their child's face in the center circle
// The Begin button is disabled until face is detected (navigates to ReadyToBegin)

export default function PositionChild() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const screeningId = route.params?.screeningId;
    const [permission, requestPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

    useEffect(() => {
        if (!permission || permission.status === 'undetermined') {
            requestPermission();
        }

        if (!microphonePermission || microphonePermission.status === 'undetermined') {
            requestMicrophonePermission();
        }
    }, [microphonePermission, requestMicrophonePermission, permission, requestPermission]);

    const microphoneBlocked = microphonePermission?.status === 'denied';
    const microphoneGranted = microphonePermission?.granted;

    const renderCameraState = () => {
        if (!permission || permission.status === 'undetermined') {
            return (
                <View style={styles.permissionStateContainer}>
                    <Text style={styles.permissionTitle}>Checking camera and microphone access...</Text>
                </View>
            );
        }

        if (!microphonePermission || microphonePermission.status === 'undetermined') {
            return (
                <View style={styles.permissionStateContainer}>
                    <Text style={styles.permissionTitle}>Checking microphone access...</Text>
                </View>
            );
        }

        if (permission.granted && microphoneGranted) {
            return <CameraView style={StyleSheet.absoluteFillObject} facing="front" />;
        }

        if (permission.status === 'denied' || microphoneBlocked) {
            return (
                <View style={styles.permissionStateContainer}>
                    <Text style={styles.permissionTitle}>Camera and microphone access are required</Text>
                    <Text style={styles.permissionDescription}>
                        Allow camera access so you can preview and align your child, and microphone access so screening video audio can be recorded.
                    </Text>

                    <View style={styles.permissionButtonsRow}>
                        <Pressable style={styles.permissionSecondaryButton} onPress={() => Linking.openSettings()}>
                            <Text style={styles.permissionSecondaryButtonText}>
                                {permission.canAskAgain || microphonePermission.canAskAgain ? 'Open Settings' : 'Go to Settings'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            );
        }

        return null;
    };

    return (
        <View style={styles.container}>
            {renderCameraState()}

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
            {permission?.granted && microphoneGranted && (
                <View style={styles.circleContainer}>
                    <View style={styles.faceCircle}>
                    </View>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Pressable 
                    style={styles.beginButtonDisabled}
                    disabled={!permission?.granted || !microphoneGranted}
                    onPress={() => {
                        navigation.navigate('ReadyToBegin', { screeningId });
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

    permissionStateContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#232323',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    permissionTitle: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
    },

    permissionDescription: {
        color: '#d6d6d6',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 24,
    },

    permissionButtonsRow: {
        width: '100%',
        marginTop: 24,
        gap: 12,
    },

    permissionSecondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: 'center',
    },

    permissionSecondaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
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
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
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

