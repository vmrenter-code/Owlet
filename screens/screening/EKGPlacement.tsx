import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeBg from '../../components/HomeBg';
import ImageCard from '../../components/ImageCard';
import PrimaryBlueButton from '../../components/PrimaryBlueButton';
import { useScreening } from '../../context/ScreeningContext';

export default function EKGPlacement() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const insets = useSafeAreaInsets();
    const { heartRate, connected, scanning, error, connectToH9, screeningId: contextScreeningId } = useScreening();
    const screeningId = contextScreeningId ?? route.params?.screeningId;

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            {/* Back button overlaid on image */}
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

            {/* Main layout mirrors ScreeningInstructions */}
            <View style={styles.slideArea}>
                {/* Top — image area */}
                <View style={styles.imageBox}>
                    <ImageCard style={styles.imageFill}>
                        {/* Centered play icon placeholder */}
                        <View style={styles.playOverlay}>
                            <View style={styles.playCircle}>
                                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                                    <Path d="M8 5v14l11-7L8 5z" fill="rgba(80,88,180,0.5)" />
                                </Svg>
                            </View>
                        </View>
                    </ImageCard>
                </View>

                {/* Bottom — scrollable content */}
                <ScrollView
                    style={styles.textBox}
                    contentContainerStyle={styles.textContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>EKG Placement</Text>
                    <Text style={styles.desc}>
                        Follow the video above to place the EKG wearable on your child before beginning the screening.
                    </Text>

                    {/* H9 card */}
                    <View style={styles.h9Card}>
                        {connected ? (
                            <View style={styles.connectedRow}>
                                <View style={styles.connectedDot} />
                                <View>
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
                                    style={({ pressed }) => [styles.connectBtn, pressed && { opacity: 0.8 }, scanning && { opacity: 0.6 }]}
                                    onPress={connectToH9}
                                    disabled={scanning}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.connectBtnText}>{scanning ? 'Scanning…' : 'Connect'}</Text>
                                </Pressable>
                            </View>
                        )}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                </ScrollView>
            </View>

            {/* Button pinned to bottom */}
            <View style={styles.footer}>
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
    },
    imageFill: {
        width: '100%',
        height: '100%',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(80,88,180,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(80,88,180,0.2)',
    },
    textBox: {
        flex: 2,
        minHeight: 0,
    },
    textContent: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 14,
    },
    title: {
        fontSize: 22,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
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
        paddingBottom: 28,
        flexShrink: 0,
        zIndex: 1,
    },
});
