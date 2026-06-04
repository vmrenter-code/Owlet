import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import HomeBg from '../../components/HomeBg';
import PrimaryBlueButton from '../../components/PrimaryBlueButton';
import HeartRateChart from '../../components/HeartRateChart';
import { usePortraitLock } from '../../hooks/usePortraitLock';
import { useScreening } from '../../context/ScreeningContext';

export default function ScreeningComplete() {
    usePortraitLock();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { heartRateLog } = useScreening();

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 32, paddingBottom: Math.max(insets.bottom, 16) + 80 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.iconWrap}>
                    <View style={styles.iconCircle}>
                        <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M5 12l5 5L20 7"
                                stroke="#ffffff"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </View>
                </View>

                <Text style={styles.heading}>Screening Complete!</Text>
                <Text style={styles.subtitle}>
                    Great job. Your child's screening has been submitted successfully.
                </Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>Results will be reviewed by a clinician</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>You'll be notified when results are ready</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>View past screenings anytime in History</Text>
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Heart Rate Summary</Text>
                <HeartRateChart data={heartRateLog} />
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <PrimaryBlueButton onPress={() => navigation.navigate('MainTabs')} fullWidth>
                    Back to Home
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
    scroll: {
        flex: 1,
        zIndex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    iconWrap: { marginBottom: 28 },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: INDIGO,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 20px rgba(80,88,180,0.35)',
    } as any,
    heading: {
        fontSize: 28,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        textAlign: 'center',
        letterSpacing: -0.4,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'NotoSans-Regular',
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        gap: 14,
        borderWidth: 1,
        borderColor: 'rgba(80,88,180,0.10)',
        alignItems: 'center',
        marginBottom: 28,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        justifyContent: 'flex-start',
    },
    infoDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: INDIGO,
        flexShrink: 0,
        marginTop: 7,
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#333',
        lineHeight: 21,
        flex: 1,
    },
    sectionLabel: {
        alignSelf: 'flex-start',
        fontSize: 13,
        fontFamily: 'NotoSans-SemiBold',
        color: '#555',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 28,
        paddingTop: 12,
        paddingBottom: 28,
        backgroundColor: 'rgba(255,255,255,0.92)',
        zIndex: 2,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
});
