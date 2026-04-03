import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ViewResults() {
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
            <Text style={styles.title}>Screening Results</Text>
            <Text style={styles.subtitle}>{date}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Document Content */}
                <View style={styles.section}>
                    <View style={styles.documentContent}>
                        <Text style={styles.sectionHeader}>Summary</Text>
                        <Text style={styles.bodyText}>
                            Based on the screening conducted on {date}, your child demonstrated age-appropriate developmental milestones in several key areas.
                        </Text>

                        <Text style={styles.sectionHeader}>Areas Assessed</Text>
                        <Text style={styles.bodyText}>
                            • Motor Skills: Within normal range{'\n'}
                            • Communication: Age-appropriate responses{'\n'}
                            • Social Interaction: Positive engagement observed{'\n'}
                            • Cognitive Development: Meeting expected milestones
                        </Text>

                        <Text style={styles.sectionHeader}>Recommendations</Text>
                        <Text style={styles.bodyText}>
                            Continue with regular developmental check-ups. Engage in interactive play activities to support continued growth. No immediate concerns identified at this time.
                        </Text>

                        <Text style={styles.sectionHeader}>Next Steps</Text>
                        <Text style={styles.bodyText}>
                            We recommend scheduling your next screening in 3-6 months to continue monitoring developmental progress.
                        </Text>
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
});
