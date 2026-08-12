import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScreening } from '../../context/ScreeningContext';
import ScreeningCameraLayout from '../../components/ScreeningCameraLayout';
import { getAuth } from 'firebase/auth';
import { useChild } from '../../context/ChildContext';
import { API_BASE_URL } from '../../src/config/apiBaseUrl';

/**
 * react-native-vision-camera has no web build, so the live camera preview
 * is replaced with a message here. See ReadyToBegin.native.tsx for the
 * mobile implementation.
 */
export default function ReadyToBegin() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { screeningId: screeningIDFromContext } = useScreening();
    const screeningId = screeningIDFromContext ?? route.params?.screeningId;
    const { selectedChild } = useChild();

    const handleBegin = async () => {
        // Start the screening process & navigate to first video
        console.log('Starting screening with ID:', screeningId);
        try {
            const user = getAuth().currentUser;
            if (!user) {
                console.error("No logged-in user");
                return;
            }
            const token = await user.getIdToken();
            if (!selectedChild) {
                console.error("No child selected");
                return;
            }

            // Create a new screening in the backend
            const response = await fetch(`${API_BASE_URL}/screening`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                screeningID: screeningId,
                startedAt: new Date().toISOString(),
                childId: selectedChild.id,
            }),
        });
            const text = await response.text();
            console.log("RAW RESPONSE:", text);

            if (!response.ok) {
            throw new Error(`Failed: ${text}`);
            }

            const data = JSON.parse(text);

            if (data.success && data) {
                console.log('Screening started successfully:', data.screening);
                navigation.navigate('VideoScreen', { videoNumber: 1, screeningID: screeningId });
            } else {
                console.log('Server did not confirm screening start');
            }

        } catch (error) {
            console.error('Error starting screening:', error);
        }
    };

    return (
        <ScreeningCameraLayout
            onBack={() => navigation.goBack()}
            instruction="Face detected — tap Begin when ready"
            showFaceGuide={false}
            footer={
                <Pressable
                    style={({ pressed }) => [styles.beginButton, pressed && styles.beginButtonPressed]}
                    onPress={handleBegin}
                >
                    <Text style={styles.beginButtonText}>Begin</Text>
                </Pressable>
            }
        >
            <View style={styles.cameraFallback}>
                <Text style={styles.cameraFallbackText}>Camera preview requires the iOS or Android app</Text>
            </View>
        </ScreeningCameraLayout>
    );
}

const styles = StyleSheet.create({
    cameraFallback: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#4a4a4a',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    cameraFallbackText: { color: '#ddd', fontSize: 15, textAlign: 'center' },
    beginButton: {
        backgroundColor: '#f0a090',
        paddingVertical: 10,
        paddingHorizontal: 36,
        borderRadius: 22,
        alignItems: 'center',
        minWidth: 140,
    },
    beginButtonPressed: { backgroundColor: '#e8958a', transform: [{ scale: 0.98 }] },
    beginButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});
