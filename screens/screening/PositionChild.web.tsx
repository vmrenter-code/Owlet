import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreeningCameraLayout from '../../components/ScreeningCameraLayout';

/**
 * react-native-vision-camera has no web build, so the live camera preview
 * is replaced with a message here. See PositionChild.native.tsx for the
 * mobile implementation.
 */
export default function PositionChild() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const screeningId = route.params?.screeningId;

    return (
        <ScreeningCameraLayout
            onBack={() => navigation.goBack()}
            instruction="Position your child in the center of the circle"
            showFaceGuide={false}
            footer={
                <Pressable
                    style={styles.beginButton}
                    onPress={() => navigation.navigate('ReadyToBegin', { screeningId })}
                >
                    <Text style={styles.beginButtonText}>Begin</Text>
                </Pressable>
            }
        >
            <View style={styles.permissionBox}>
                <Text style={styles.permTitle}>Camera preview unavailable</Text>
                <Text style={styles.permDesc}>Screening recording requires the iOS or Android app.</Text>
            </View>
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
