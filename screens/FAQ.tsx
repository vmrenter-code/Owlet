import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const faqData = [
    {
        id: 1,
        question: 'What is the goal of the NeuroScreen research project?',
        answer: 'The goal is to help families identify early signs of ADHD and related neurodevelopmental risks in infants and toddlers. By using short, video-based assessments, we aim to spot these signs years earlier than current clinical methods, allowing for support when it can make the biggest difference.',
    },
    {
        id: 2,
        question: "What if my child won't sit still or look at the screen?",
        answer: "That's perfectly okay! We know toddlers are active. Our \"Deep Learning\" models are being designed specifically to handle the wiggles, turns, and distractions that come naturally with being a young child.",
    },
    {
        id: 3,
        question: 'Do I get a "score" or a diagnosis right away?',
        answer: 'Because NeuroScreen is currently a research tool, it is not a replacement for a professional medical diagnosis. The app helps us develop the technology that will one day be used by doctors. We will provide updates on the study\'s progress, but you should always consult your pediatrician for specific concerns about your child.',
    },
    {
        id: 4,
        question: 'What does the heart rate monitor (ECG) tell you?',
        answer: 'Focus and attention are closely linked to the body\'s nervous system. The ECG helps us see if a child is calm, excited, or over-stimulated during a task. This physiological data helps us understand the effort your child is using to pay attention.',
    },
    {
        id: 5,
        question: 'Where does my video footage go?',
        answer: 'Your video and heart rate data are encrypted and sent securely to our protected research servers. Think of it like a digital vault—only authorized researchers have the "key" to view the data for analysis. We never sell your data to third parties or advertisers.',
    },
    {
        id: 6,
        question: 'Can I change my mind and delete my data?',
        answer: 'Absolutely. Your participation is entirely voluntary. If you decide you no longer want to be part of the study, you can stop using the app at any time and request that your family\'s data be deleted from our active research records.',
    },
    {
        id: 7,
        question: 'Does the app record all the time?',
        answer: 'No. The app only accesses the camera and sensors when you explicitly start a "screening session." You will always see a recording indicator on the screen when the camera is active.',
    },
];

export default function FAQ() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            {/* FAQs Title Card */}
            <View style={styles.titleCard}>
                <Text style={styles.titleText}>FAQs</Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {/* FAQ Items */}
                {faqData.map((item) => (
                    <View key={item.id} style={styles.faqItem}>
                        <Text style={styles.question}>{item.question}</Text>
                        <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                ))}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    gradient: {
        ...StyleSheet.absoluteFillObject,
    },

    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    backArrow: {
        fontSize: 24,
        color: '#333',
    },

    titleCard: {
        backgroundColor: '#7FB8C4',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 24,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
    },

    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
    },

    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },

    faqItem: {
        marginBottom: 32,
    },

    question: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },

    answer: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
});
