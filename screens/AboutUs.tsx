import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import BackArrow from '../components/BackArrow';
import ImageCard from '../components/ImageCard';
import PillarCarousel from '../components/PillarCarousel';
import HomeBg from '../components/HomeBg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutUs() {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isSmallDevice = height < 700;
    const isLargeDevice = height > 900;

    const scale = {
        title:    isSmallDevice ? 18 : isLargeDevice ? 26 : 22,
        header:   isSmallDevice ? 15 : isLargeDevice ? 20 : 18,
        content:  isSmallDevice ? 13 : isLargeDevice ? 17 : 15,
        meta:     isSmallDevice ? 12 : isLargeDevice ? 15 : 14,
        imageH:   isSmallDevice ? 150 : isLargeDevice ? 260 : 200,
        padding:  isSmallDevice ? 16 : isLargeDevice ? 28 : 20,
    };

    return (
        <View style={{ flex: 1 }}>

            <HomeBg />

            <ScrollView
                style={styles.container}
                contentContainerStyle={[
                    styles.contentContainer,
                    {
                        paddingHorizontal: scale.padding,
                        paddingTop: insets.top + 8,
                        paddingBottom: insets.bottom + scale.padding,
                    }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Back arrow — tight to top */}
                <View style={styles.backContainer}>
                    <BackArrow />
                </View>

                {/* Image */}
                <View style={styles.imageShadow}>
                    <ImageCard style={[styles.imageCard, { height: scale.imageH }]} />
                </View>

                {/* Meta row */}
                <View style={styles.textRow}>
                    <Text style={[styles.textStyle, { fontSize: scale.meta }]}>April 8, 2026</Text>
                    <Text style={[styles.textStyle, { fontSize: scale.meta }]}>|</Text>
                    <Text style={[styles.textStyle, { fontSize: scale.meta }]}>Owlet Team</Text>
                </View>

                {/* Title */}
                <Text style={[styles.title, { fontSize: scale.title }]}>About Us</Text>

                <Text style={[styles.headerStyle, { fontSize: scale.header }]}>Our Mission</Text>
                <Text style={[styles.content, { fontSize: scale.content, lineHeight: scale.content * 1.6 }]}>
                    The WILD Lab (Werchan Infant Learning and Development Lab) at UCI believes that
                    understanding how children grow helps us build a better world for them. We conduct thoughtful,
                    mechanism-focused research that deepens our understanding of neurodevelopment and benefits
                    the communities we serve.
                </Text>

                <Text style={[styles.headerStyle, { fontSize: scale.header }]}>NeuroScreen</Text>
                <Text style={[styles.content, { fontSize: scale.content, lineHeight: scale.content * 1.6 }]}>
                    NeuroScreen is our latest initiative, which aims to use advanced eye-tracking and physiological
                    data to spot the earliest signs of ADHD. Our goal is to provide families with easy, safe, and
                    accessible tools that work in the comfort of home, lessening challenges by acting early.
                </Text>

                <Text style={[styles.headerStyle, { fontSize: scale.header }]}>Discovery as a Partnership</Text>
                <Text style={[styles.content, { fontSize: scale.content, lineHeight: scale.content * 1.6 }]}>
                    We believe discovery is a collaboration. Families are essential contributors to the knowledge we
                    build together. Everything we do is guided by our Five Pillars:
                </Text>

                <PillarCarousel />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    backContainer: {
        marginBottom: 10,
    },
    imageShadow: {
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 2.5,
    },
    imageCard: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: '#f1f1f1',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    textStyle: {
        fontFamily: 'NotoSans-Regular',
        color: '#2E3332',
    },
    title: {
        fontFamily: 'NotoSans-SemiBold',
        color: '#161B1A',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    headerStyle: {
        fontFamily: 'NotoSans-SemiBold',
        color: '#161B1A',
        marginTop: 18,
        marginBottom: 6,
    },
    content: {
        color: '#161B1A',
    },
});