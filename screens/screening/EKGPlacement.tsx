import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useScreening } from '../../context/ScreeningContext';


const PlayIcon = () => (
    <Svg width={50} height={50} viewBox="0 0 24 24" fill="none">
        <Path 
            d="M8 5v14l11-7L8 5z" 
            fill="#d0d0d0"
        />
    </Svg>
);

export default function EKGPlacement() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { heartRate, connected, scanning, error, connectToH9, screeningId: contextScreeningId } = useScreening();
    const screeningId = contextScreeningId ?? route.params?.screeningId;

    const goToPositionChild = () => {
        navigation.navigate('PositionChild', { screeningId });
    };

    const handleBeginScreening = () => {
        if (!connected) {
            Alert.alert(
                'H9 Not Connected',
                'No Polar H9 detected. You can connect it or continue without heart rate monitoring.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Continue Without H9', onPress: goToPositionChild },
                ]
            );
            return;
        }
        goToPositionChild();
    };

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={['#e8f4f8', '#f5f5f5']}
                style={styles.gradient}
            />

            {/* Video Player Area */}
            <View style={styles.videoContainer}>
                <Pressable style={styles.playButton}>
                    <PlayIcon />
                </Pressable>
            </View>

            {/* Instructions */}
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionTitle}>EKG Placement</Text>
                <Text style={styles.instructionText}>
                    Please follow the video to place the EKG wearable on your child.
                </Text>

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
                                {scanning ? '🔍 Scanning for H9...' : ' Connect Polar H9'}
                            </Text>
                        </Pressable>
                    ) : (
                        <View style={styles.connectedBadge}>
                            <Text style={styles.connectedText}> H9 Connected</Text>
                            {heartRate && (
                                <Text style={styles.heartRatePreview}>{heartRate} BPM</Text>
                            )}
                        </View>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                {/* Begin Screening Button */}
                <Pressable 
                    style={({ pressed }) => [
                        styles.beginButton,
                        pressed && styles.beginButtonPressed
                    ]}
                    onPress={handleBeginScreening}
                >
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.buttonIcon}>
                        <Path d="M8 5v14l11-7L8 5z" fill="#ffffff" />
                    </Svg>
                    <Text style={styles.beginButtonText}>Begin Screening</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    videoContainer: {
        flex: 1,
        maxHeight: '60%',
        marginTop: 0,
        marginHorizontal: 0,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(200, 200, 200, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionContainer: {
        paddingHorizontal: 28,
        paddingTop: 30,
    },
    instructionTitle: {
        color: '#1a1a1a',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
        fontFamily: 'NotoSans-Bold',
    },
    instructionText: {
        color: '#666666',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
        fontFamily: 'NotoSans-Regular',
    },
    h9Container: {
        alignItems: 'center',
        marginBottom: 24,
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
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
        color: '#1a1a1a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 13,
        marginTop: 6,
        textAlign: 'center',
    },
    beginButton: {
        backgroundColor: '#7FB8C9',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    beginButtonPressed: {
        backgroundColor: '#6BA8B9',
        transform: [{ scale: 0.98 }],
    },
    beginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'NotoSans-SemiBold',
    },
    buttonIcon: {
        marginRight: 4,
    },
});