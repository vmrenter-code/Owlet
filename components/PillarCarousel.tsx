import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

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

            {/* Text Content */}
            <Text style={styles.pillarName}>{current.name}</Text>
            <Text style={styles.pillarDesc}>{current.description}</Text>

            {/* Controls inside card */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={goPrev} style={styles.arrowButton}>
                    <Text style={styles.arrow}>‹</Text>
                </TouchableOpacity>

                <View style={styles.dots}>
                    {PILLARS.map((_, i) => (
                        <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                    ))}
                </View>

                <TouchableOpacity onPress={goNext} style={styles.arrowButton}>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F5F9F8',
        borderRadius: 16,
        padding: 24,
        marginVertical: 20,
        minHeight: 160,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
    },
    pillarName: {
        fontSize: 18,
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: 'bold',
        color: '#161B1A',
        marginBottom: 8,
    },
    pillarDesc: {
        fontSize: 15,
        lineHeight: 22,
        color: '#2E3332',
        fontFamily: 'NotoSans-Regular',
        flex: 1,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
       
    },
    arrowButton: {
        padding: 4,
    },
    arrow: {
        fontSize: 28,
        color: '#161B1A',
        lineHeight: 30,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CCC',
    },
    dotActive: {
        backgroundColor: '#161B1A',
    },
});