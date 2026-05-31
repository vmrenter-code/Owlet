import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import HomeBg from '../components/HomeBg';

const faqData = [
    {
        id: 1,
        question: 'What is the goal of the NeuroScreen research project?',
        answer:
            'The goal is to help families identify early signs of ADHD and related neurodevelopmental risks in infants and toddlers. By using short, video-based assessments, we aim to spot these signs years earlier than current clinical methods, allowing for support when it can make the biggest difference.',
    },
    {
        id: 2,
        question: "What if my child won't sit still or look at the screen?",
        answer:
            'That\'s perfectly okay! We know toddlers are active. Our "Deep Learning" models are being designed specifically to handle the wiggles, turns, and distractions that come naturally with being a young child.',
    },
    {
        id: 3,
        question: 'Do I get a "score" or a diagnosis right away?',
        answer:
            "Because NeuroScreen is currently a research tool, it is not a replacement for a professional medical diagnosis. The app helps us develop the technology that will one day be used by doctors. We will provide updates on the study's progress, but you should always consult your pediatrician for specific concerns about your child.",
    },
    {
        id: 4,
        question: 'What does the heart rate monitor (ECG) tell you?',
        answer:
            "Focus and attention are closely linked to the body's nervous system. The ECG helps us see if a child is calm, excited, or over-stimulated during a task. This physiological data helps us understand the effort your child is using to pay attention.",
    },
    {
        id: 5,
        question: 'Where does my video footage go?',
        answer:
            'Your video and heart rate data are encrypted and sent securely to our protected research servers. Think of it like a digital vault — only authorized researchers have the "key" to view the data for analysis. We never sell your data to third parties or advertisers.',
    },
    {
        id: 6,
        question: 'Can I change my mind and delete my data?',
        answer:
            "Absolutely. Your participation is entirely voluntary. If you decide you no longer want to be part of the study, you can stop using the app at any time and request that your family's data be deleted from our active research records.",
    },
    {
        id: 7,
        question: 'Does the app record all the time?',
        answer:
            'No. The app only accesses the camera and sensors when you explicitly start a "screening session." You will always see a recording indicator on the screen when the camera is active.',
    },
];

export default function FAQ() {
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
                    { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 24 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <BackArrow />
                </View>

                <View style={styles.textRow}>
                    <Text style={styles.textStyle}>Help Center</Text>
                    <Text style={styles.textStyle}>|</Text>
                    <Text style={styles.textStyle}>Owlet Team</Text>
                </View>

                <Text style={styles.title}>Frequently Asked Questions</Text>

                <Text style={styles.intro}>
                    Common questions from families participating in NeuroScreen.
                </Text>

                {faqData.map((item) => (
                    <View key={item.id}>
                        <Text style={styles.headerStyle}>{item.question}</Text>
                        <Text style={styles.content}>{item.answer}</Text>
                    </View>
                ))}
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
    intro: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        lineHeight: 20,
        marginBottom: 4,
    },
    headerStyle: {
        fontSize: 17,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.2,
        marginTop: 12,
    },
    content: {
        fontSize: 15,
        color: '#2E3332',
        fontFamily: 'NotoSans-Regular',
        lineHeight: 21,
        letterSpacing: 0.1,
        marginTop: 4,
    },
});
