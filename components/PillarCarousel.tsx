import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Svg, Path } from 'react-native-svg';

const PILLARS = [
    { name: 'Impact', description: 'Research that contributes to real-world well-being.' },
    { name: 'Rigor', description: 'Prioritizing precision and clarity in every study and app we design.' },
    { name: 'Partnership', description: 'Honoring the time, trust, and individuality of every family.' },
    { name: 'Integrity', description: 'Upholding the highest ethical standards through transparent science.' },
    { name: 'Mentorship', description: 'Fostering a community of researchers who think deeply and ethically.' },
];

export default function PillarCarousel() {
    const [index, setIndex] = useState(0);

    const goNext = () => setIndex((prev) => (prev + 1) % PILLARS.length);
    const goPrev = () => setIndex((prev) => (prev - 1 + PILLARS.length) % PILLARS.length);

    const current = PILLARS[index];

    return (
        <View style={styles.card}>

            <Text style={styles.pillarName}>{current.name}</Text>
            <Text style={styles.pillarDesc}>{current.description}</Text>

            <View style={styles.controls}>
                <Pressable
                    onPress={goPrev}
                    style={styles.arrowButton}
                    accessibilityRole="button"
                    accessibilityLabel="Previous pillar"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M15 18l-6-6 6-6"
                            stroke="#ffffff"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>

                <View style={styles.dots}>
                    {PILLARS.map((_, i) => (
                        <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                    ))}
                </View>

                <Pressable
                    onPress={goNext}
                    style={styles.arrowButton}
                    accessibilityRole="button"
                    accessibilityLabel="Next pillar"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M9 18l6-6-6-6"
                            stroke="#ffffff"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#5058b4',
        borderRadius: 20,
        padding: 20,
        marginTop: 12,
        marginBottom: 20,
        shadowColor: '#1a1a1a',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },

    pillarName: {
        fontSize: 18,
        fontFamily: 'NotoSans-SemiBold',
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: -0.2,
    },

    pillarDesc: {
        fontSize: 15,
        lineHeight: 21,
        color: '#ffffff',
        fontFamily: 'NotoSans-Regular',
        letterSpacing: 0.1,
    },

    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        color: '#ffffff',
    },

    arrowButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
    },

    dots: {
        flexDirection: 'row',
        gap: 6,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },

    dotActive: {
        backgroundColor: '#ffffff',
    },
});