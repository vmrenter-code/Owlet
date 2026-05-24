import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import ScreeningCameraLayout from '../../components/ScreeningCameraLayout';

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

    const canBegin = permission?.granted && microphoneGranted;

    return (
        <ScreeningCameraLayout
            onBack={() => navigation.goBack()}
            instruction="Position your child to the center of the circle"
            showFaceGuide={canBegin}
            footer={
                <Pressable
                    style={[styles.beginButton, !canBegin && styles.beginButtonDisabled]}
                    disabled={!canBegin}
                    onPress={() => navigation.navigate('ReadyToBegin', { screeningId })}
                >
                    <Text style={styles.beginButtonText}>Begin</Text>
                </Pressable>
            }
        >
            {renderCameraState()}
        </ScreeningCameraLayout>
    );
}

const styles = StyleSheet.create({
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
    beginButton: {
        backgroundColor: '#f0a090',
        paddingVertical: 10,
        paddingHorizontal: 36,
        borderRadius: 22,
        alignItems: 'center',
        minWidth: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    beginButtonDisabled: {
        opacity: 0.55,
    },
    beginButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
});
