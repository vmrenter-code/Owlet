import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import BackArrow from '../components/BackArrow';
import ImageCard from '../components/ImageCard';
import PillarCarousel from '../components/PillarCarousel';
import HomeBg from '../components/HomeBg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutUs() {
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isSmallDevice = height < 700;
    const isLargeDevice = height > 900;

    const scale = {
        title: isSmallDevice ? 18 : isLargeDevice ? 26 : 22,
        header: isSmallDevice ? 15 : isLargeDevice ? 20 : 18,
        content: isSmallDevice ? 13 : isLargeDevice ? 17 : 15,
        meta: isSmallDevice ? 12 : isLargeDevice ? 15 : 14,
        imageH: isSmallDevice ? 150 : isLargeDevice ? 260 : 200,
        padding: isSmallDevice ? 16 : isLargeDevice ? 28 : 20,
        spacingLg: isSmallDevice ? 16 : 24,
        spacingMd: isSmallDevice ? 12 : 18,
        spacingSm: isSmallDevice ? 8 : 12,
    };

    return (
        <View style={{ flex: 1 }}>
            <HomeBg />

            <ScrollView
                style={styles.container}
                contentContainerStyle={{
                    paddingHorizontal: scale.padding,
                    paddingTop: insets.top + scale.spacingLg,
                    paddingBottom: insets.bottom + scale.spacingLg,
                }}
                showsVerticalScrollIndicator={false}
            >
                <BackArrow />

                <View style={[styles.imageShadow, { marginTop: scale.spacingLg }]}>
                    <ImageCard style={[styles.imageCard, { height: scale.imageH }]} />
                </View>

                <View style={[styles.textRow, { marginTop: scale.spacingSm }]}>
                    <Text style={[styles.textStyle, { fontSize: scale.meta }]}>April 8, 2026</Text>
                    <Text style={[styles.textStyle, { fontSize: scale.meta }]}>|</Text>
                    <Text style={[styles.textStyle, { fontSize: scale.meta }]}>Owlet Team</Text>
                </View>

                <Text style={[styles.title, { fontSize: scale.title, marginTop: scale.spacingLg }]}>
                    About Us
                </Text>

                <Text style={[styles.headerStyle, { fontSize: scale.header, marginTop: scale.spacingMd }]}>
                    Our Mission
                </Text>
                <Text style={[styles.content, { fontSize: scale.content, lineHeight: scale.content * 1.6 }]}>
                    The WILD Lab (Werchan Infant Learning and Development Lab) at UCI believes that
                    understanding how children grow helps us build a better world for them. We conduct thoughtful,
                    mechanism-focused research that deepens our understanding of neurodevelopment and benefits
                    the communities we serve.
                </Text>

                <Text style={[styles.headerStyle, { fontSize: scale.header, marginTop: scale.spacingLg }]}>
                    NeuroScreen
                </Text>
                <Text style={[styles.content, { fontSize: scale.content, lineHeight: scale.content * 1.6 }]}>
                    NeuroScreen is our latest initiative, which aims to use advanced eye-tracking and physiological
                    data to spot the earliest signs of ADHD. Our goal is to provide families with easy, safe, and
                    accessible tools that work in the comfort of home, lessening challenges by acting early.
                </Text>

                <Text style={[styles.headerStyle, { fontSize: scale.header, marginTop: scale.spacingLg }]}>
                    Discovery as a Partnership
                </Text>
                <Text style={[styles.content, { fontSize: scale.content, lineHeight: scale.content * 1.6 }]}>
                    We believe discovery is a collaboration. Families are essential contributors to the knowledge we
                    build together. Everything we do is guided by our Five Pillars:
                </Text>

                <View style={{ marginTop: scale.spacingMd }}>
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
        borderWidth: 0.5,
        borderColor: '#f1f1f1',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textStyle: {
        fontFamily: 'NotoSans-Regular',
        color: '#2E3332',
    },
    title: {
        color: '#333',
        fontFamily: 'NotoSans-SemiBold',
    },
    headerStyle: {
        fontFamily: 'NotoSans-SemiBold',
        color: '#161B1A',
    },
    content: {
        color: '#161B1A',
    },
});