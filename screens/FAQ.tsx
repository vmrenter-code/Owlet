import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const faqData = [
    {
        id: 1,
        question: 'What is NeuroScreen?',
        answer: 'NeuroScreen is an AI-powered tool that screens for early neurodevelopmental differences.',
    },
    {
        id: 2,
        question: 'Is this a diagnosis?',
        answer: 'No. NeuroScreen provides screening insights, not a medical diagnosis.',
    },
    {
        id: 3,
        question: 'What age is this for?',
        answer: 'Designed for infants and toddlers, typically 6 months–3 years.',
    },
    {
        id: 4,
        question: 'How long does screening take?',
        answer: 'About 5–10 minutes.',
    },
    {
        id: 5,
        question: 'How accurate are the results?',
        answer: 'Results are indicators, not definitive. Follow up with a professional if concerned.',
    },
    {
        id: 6,
        question: 'How does the AI work?',
        answer: 'It analyzes behavior patterns from guided activities.',
    },
    {
        id: 7,
        question: 'Can the AI be wrong?',
        answer: 'Yes. Development varies, and results are not conclusive.',
    },
    {
        id: 8,
        question: 'Is my data safe?',
        answer: 'Yes. All data is encrypted and private.',
    },
    {
        id: 9,
        question: 'Do you store videos?',
        answer: 'Videos may be temporarily stored for analysis. You can delete them anytime.',
    },
    {
        id: 10,
        question: 'Who can see my results?',
        answer: 'Only you, unless you choose to share them.',
    },
    {
        id: 11,
        question: 'What if I get a high-risk result?',
        answer: 'We recommend consulting a pediatrician or specialist.',
    },
    {
        id: 12,
        question: 'Can I retake the screening?',
        answer: 'Yes. You can retake it anytime.',
    },
    {
        id: 13,
        question: 'Do I need special equipment?',
        answer: 'No. Just your phone camera.',
    },
    {
        id: 14,
        question: 'Will this label my child?',
        answer: 'No. NeuroScreen provides guidance, not labels.',
    },
    {
        id: 15,
        question: 'Why use early screening?',
        answer: 'Early insights help families seek support sooner.',
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
