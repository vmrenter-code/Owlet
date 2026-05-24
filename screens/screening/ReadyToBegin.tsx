import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useScreening } from '../../context/ScreeningContext';
import ScreeningCameraLayout from '../../components/ScreeningCameraLayout';

export default function ReadyToBegin() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { screeningId: screeningIDFromContext } = useScreening();
    const screeningId = screeningIDFromContext ?? route.params?.screeningId;

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

    const cameraReady = permission?.granted && microphonePermission?.granted;

    const handleBegin = () => {
        navigation.navigate('VideoScreen', { videoNumber: 1, screeningId });
    };

    const renderCamera = () => {
        if (!cameraReady) {
            return (
                <View style={styles.cameraFallback}>
                    <Text style={styles.cameraFallbackText}>Starting camera...</Text>
                </View>
            );
        }
        return <CameraView style={StyleSheet.absoluteFillObject} facing="front" />;
    };

    return (
        <ScreeningCameraLayout
            onBack={() => navigation.goBack()}
            instruction="Face detected — tap Begin when ready"
            showFaceGuide={cameraReady}
            footer={
                <Pressable
                    style={({ pressed }) => [
                        styles.beginButton,
                        pressed && styles.beginButtonPressed,
                        !cameraReady && styles.beginButtonDisabled,
                    ]}
                    onPress={handleBegin}
                    disabled={!cameraReady}
                >
                    <Text style={styles.beginButtonText}>Begin</Text>
                </Pressable>
            }
        >
            {renderCamera()}
        </ScreeningCameraLayout>
    );
}

const styles = StyleSheet.create({
    cameraFallback: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#4a4a4a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraFallbackText: {
        color: '#888',
        fontSize: 16,
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
    beginButtonPressed: {
        backgroundColor: '#e8958a',
        transform: [{ scale: 0.98 }],
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
