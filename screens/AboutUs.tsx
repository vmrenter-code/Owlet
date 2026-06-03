import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BackArrow from '../components/BackArrow';
import ImageCard from '../components/ImageCard';
import PillarCarousel from '../components/PillarCarousel';
import HomeBg from '../components/HomeBg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutUs() {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formatBg} pointerEvents="none">
                <HomeBg />
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 24 }
                ]}
                showsVerticalScrollIndicator={false}
            >

                {/* ✅ REAL STICKY HEADER (NO absolute, NO stickyHeaderIndices) */}
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <BackArrow />
                </View>


                <Text style={styles.title}>About Us</Text>

                <View style={styles.textRow}>
                    <Text style={styles.textStyle}>April 8, 2026</Text>
                    <Text style={styles.textStyle}>|</Text>
                    <Text style={styles.textStyle}>Owlet Team</Text>
                </View>

                <Text style={styles.headerStyle}>Our Mission</Text>
                <Text style={styles.content}>
                    The WILD Lab (Werchan Infant Learning and Development Lab) at UCI believes that
                    understanding how children grow helps us build a better world for them.
                </Text>

                <Text style={styles.headerStyle}>NeuroScreen</Text>
                <Text style={styles.content}>
                    NeuroScreen is our latest initiative, which uses eye-tracking and physiological data
                    to identify early developmental patterns.
                </Text>

                <Text style={styles.headerStyle}>Discovery as a Partnership</Text>
                <Text style={styles.content}>
                    Families are essential contributors to the knowledge we build together. together. Everything we do is guided by our Five Pillars:
                </Text>

                <View style={styles.pillarWrapper}>
                    <PillarCarousel />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    formatBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 8,
        zIndex: 100,
    },

    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },

    imageShadow: {
        shadowColor: '#1a1a1a',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },

    imageCard: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },

    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },

    textStyle: {
        fontFamily: 'NotoSans-Regular',
        fontSize: 13,
        color: '#2E3332',
        letterSpacing: 0.1,
    },

    title: {
        fontSize: 22,
        color: '#151515',
        fontFamily: 'NotoSans-SemiBold',
        letterSpacing: -0.2,
    },

    headerStyle: {
        fontSize: 18,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.2,
        marginTop: 8,
    },

    content: {
        fontSize: 15,
        color: '#2E3332',
        fontFamily: 'NotoSans-Regular',
        lineHeight: 21,
        letterSpacing: 0.1,
    },

    pillarWrapper: {
        marginBottom: 8,
    },
});