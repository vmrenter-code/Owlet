import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import HomeBg from '../../components/HomeBg';
import PrimaryBlueButton from '../../components/PrimaryBlueButton';
import { useScreening } from '../../context/ScreeningContext';
import { usePortraitLock } from '../../hooks/usePortraitLock';

const ekgInstructionVideo = require('../../assets/videos/ekginstruction.mp4');

export default function EKGPlacement() {
    usePortraitLock();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const insets = useSafeAreaInsets();
    const { heartRate, connected, scanning, error, connectToH9, screeningId: contextScreeningId } = useScreening();
    const screeningId = contextScreeningId ?? route.params?.screeningId;
    const videoRef = useRef<InstanceType<typeof Video> | null>(null);
    const [videoReady, setVideoReady] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setVideoReady(true);
            return () => {
                setVideoReady(false);
                videoRef.current?.stopAsync().catch(() => {});
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <View style={[styles.backWrap, { paddingTop: insets.top + 8 }]}>
                <Pressable
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.5 }]}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back" size={24} color="#0a0a0a" />
                </Pressable>
            </View>

            <View style={styles.slideArea}>
                <View style={styles.imageBox}>
                    {videoReady ? (
                        <View style={styles.videoClip}>
                            <Video
                                ref={videoRef}
                                source={ekgInstructionVideo}
                                style={styles.imageFill}
                                resizeMode={ResizeMode.CONTAIN}
                                shouldPlay
                                isLooping
                                isMuted={false}
                                volume={1.0}
                                useNativeControls
                            />
                        </View>
                    ) : null}
                </View>

                <View style={styles.textBox}>
                    <Text style={styles.title} accessibilityRole="header">
                        EKG Placement
                    </Text>
                    <Text style={styles.desc}>
                        Follow the video above to place the EKG wearable on your child before beginning
                        the screening.
                    </Text>
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 28) }]}>
                <View style={styles.h9Card}>
                    {connected ? (
                        <View style={styles.connectedRow}>
                            <View style={styles.connectedDot} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.h9Title}>Polar H9 Connected</Text>
                                {heartRate ? <Text style={styles.h9Sub}>{heartRate} BPM</Text> : null}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.connectRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.h9Title}>Polar H9 Monitor</Text>
                                <Text style={styles.h9Sub}>Optional — for heart rate tracking</Text>
                            </View>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.connectBtn,
                                    pressed && { opacity: 0.8 },
                                    scanning && { opacity: 0.6 },
                                ]}
                                onPress={connectToH9}
                                disabled={scanning}
                                accessibilityRole="button"
                            >
                                <Text style={styles.connectBtnText}>
                                    {scanning ? 'Scanning…' : 'Connect'}
                                </Text>
                            </Pressable>
                        </View>
                    )}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
                <PrimaryBlueButton
                    onPress={() => navigation.navigate('PositionChild', { screeningId })}
                    fullWidth
                >
                    Begin Screening
                </PrimaryBlueButton>
            </View>
        </View>
    );
}

const INDIGO = '#5058b4';

const styles = StyleSheet.create({
    container: { flex: 1 },
    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    backWrap: {
        position: 'absolute',
        top: 0,
        left: 8,
        zIndex: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slideArea: {
        flex: 1,
        zIndex: 1,
        minHeight: 0,
    },
    imageBox: {
        flex: 3,
        width: '100%',
        backgroundColor: 'transparent',
        paddingTop: 120,
    },
    videoClip: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    imageFill: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    textBox: {
        flex: 2,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    title: {
        fontSize: 22,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        marginBottom: 8,
        letterSpacing: -0.2,
        textAlign: 'center',
    },
    desc: {
        fontSize: 15,
        fontFamily: 'NotoSans-Regular',
        color: '#2E3332',
        lineHeight: 21,
        letterSpacing: 0.1,
        textAlign: 'center',
    },
    h9Card: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.07)',
        marginBottom: 12,
    },
    connectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    connectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    connectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        flexShrink: 0,
    },
    h9Title: {
        fontSize: 14,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
    },
    h9Sub: {
        fontSize: 12,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        marginTop: 2,
    },
    connectBtn: {
        backgroundColor: INDIGO,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        flexShrink: 0,
    },
    connectBtnText: {
        color: '#ffffff',
        fontSize: 13,
        fontFamily: 'NotoSans-SemiBold',
    },
    errorText: {
        fontSize: 12,
        fontFamily: 'NotoSans-Regular',
        color: '#e74c3c',
        marginTop: 6,
    },
    footer: {
        paddingHorizontal: 28,
        paddingTop: 8,
        flexShrink: 0,
        zIndex: 1,
    },
});
