import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import ScreeningCameraLayout from '../../components/ScreeningCameraLayout';

export default function PositionChild() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const screeningId = route.params?.screeningId;

    const { hasPermission: cameraGranted, requestPermission: requestCameraPermission } = useCameraPermission();
    const { hasPermission: micGranted, requestPermission: requestMicrophonePermission } = useMicrophonePermission();
    const frontDevice = useCameraDevice('front');
    const [permissionsRequested, setPermissionsRequested] = useState(false);

    useEffect(() => {
        (async () => {
            if (!cameraGranted) await requestCameraPermission();
            if (!micGranted) await requestMicrophonePermission();
            setPermissionsRequested(true);
        })();
    }, []);

    const cameraReady = cameraGranted && micGranted && !!frontDevice;
    const permissionDenied = permissionsRequested && (!cameraGranted || !micGranted);

    const renderContent = () => {
        if (cameraReady) {
            return (
                <Camera
                    style={StyleSheet.absoluteFillObject}
                    device={frontDevice!}
                    isActive={true}
                />
            );
        }
        if (permissionDenied) {
            return (
                <View style={styles.permissionBox}>
                    <Text style={styles.permTitle}>Camera access required</Text>
                    <Text style={styles.permDesc}>Enable camera and microphone access to continue.</Text>
                    <Pressable style={styles.permBtn} onPress={() => Linking.openSettings()}>
                        <Text style={styles.permBtnText}>Open Settings</Text>
                    </Pressable>
                </View>
            );
        }
        return <View style={styles.permissionBox}><Text style={styles.permTitle}>Checking permissions...</Text></View>;
    };

    return (
        <ScreeningCameraLayout
            onBack={() => navigation.goBack()}
            instruction="Position your child in the center of the circle"
            showFaceGuide={cameraReady}
            footer={
                <Pressable
                    style={styles.beginButton}
                    onPress={() => navigation.navigate('ReadyToBegin', { screeningId })}
                >
                    <Text style={styles.beginButtonText}>Begin</Text>
                </Pressable>
            }
        >
            {renderContent()}
        </ScreeningCameraLayout>
    );
}

const styles = StyleSheet.create({
    permissionBox: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#232323',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        gap: 12,
    },
    permTitle: { color: '#ffffff', fontSize: 20, fontWeight: '600', textAlign: 'center' },
    permDesc: { color: '#d6d6d6', fontSize: 15, textAlign: 'center', lineHeight: 22 },
    permBtn: {
        marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 24,
    },
    permBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    beginButton: {
        backgroundColor: '#f0a090',
        paddingVertical: 10,
        paddingHorizontal: 36,
        borderRadius: 22,
        alignItems: 'center',
        minWidth: 140,
    },
    beginButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});
