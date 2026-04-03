import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ClinicianNotes() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { date } = route.params || { date: 'N/A' };

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

            {/* Title */}
            <Text style={styles.title}>Clinician Notes</Text>
            <Text style={styles.subtitle}>{date}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Document Content */}
                <View style={styles.section}>
                    <View style={styles.documentContent}>
                        <Text style={styles.sectionHeader}>Clinical Observations</Text>
                        <Text style={styles.bodyText}>
                            Child was alert and engaged throughout the screening session. Parent reported no concerns regarding developmental progress at home.
                        </Text>

                        <Text style={styles.sectionHeader}>Behavioral Notes</Text>
                        <Text style={styles.bodyText}>
                            • Maintained appropriate eye contact during interactions{'\n'}
                            • Responded to name consistently{'\n'}
                            • Demonstrated curiosity about objects in environment{'\n'}
                            • Showed appropriate emotional responses
                        </Text>

                        <Text style={styles.sectionHeader}>Parent Feedback</Text>
                        <Text style={styles.bodyText}>
                            Parent expressed satisfaction with child's progress. No specific concerns were raised during the post-screening discussion.
                        </Text>

                        <Text style={styles.sectionHeader}>Clinician Recommendation</Text>
                        <Text style={styles.bodyText}>
                            Development appears to be progressing normally. Recommend continued monitoring through regular check-ups. Parent was provided with age-appropriate activity suggestions to support ongoing development.
                        </Text>

                        <View style={styles.signatureSection}>
                            <Text style={styles.signatureText}>Reviewed by: Dr. Smith</Text>
                            <Text style={styles.signatureText}>Date: {date}</Text>
                        </View>
                    </View>
                </View>

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

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        color: '#666',
        paddingHorizontal: 25,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },

    documentContent: {
        padding: 20,
    },

    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },

    bodyText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },

    signatureSection: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },

    signatureText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
});
