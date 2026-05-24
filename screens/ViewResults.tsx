import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateRMSSD } from '../context/ScreeningContext';

export default function ViewResults() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { date, screeningId } = route.params || { date: 'N/A' };

    const [rmssd, setRmssd] = useState<number | null>(null);

    useEffect(() => {
        const loadHRV = async () => {
            try {
                const raw = await AsyncStorage.getItem(`rrLog_${screeningId}`);
                if (raw) {
                    const rrLog: number[] = JSON.parse(raw);
                    setRmssd(calculateRMSSD(rrLog));
                }
            } catch (e) {
                console.log('Error loading RR log');
            }
        };
        loadHRV();
    }, [screeningId]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#ecfffb', '#fcecfb']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient} />

            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            <Text style={styles.title}>Screening Results</Text>
            <Text style={styles.subtitle}>{date}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* HRV Section */}
                <View style={styles.section}>
                    <View style={styles.documentContent}>
                        <Text style={styles.sectionHeader}>Heart Rate Variability</Text>
                        {rmssd !== null ? (
                            <>
                                <Text style={styles.hrvValue}>{rmssd} ms <Text style={styles.hrvMetric}>RMSSD</Text></Text>
                                <Text style={styles.bodyText}>
                                    {rmssd >= 40
                                        ? 'HRV is within a healthy range for this age group.'
                                        : 'HRV is lower than typical. Consider consulting a clinician.'}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.bodyText}>No HRV data recorded for this screening.</Text>
                        )}
                    </View>
                </View>

                {/* Screening Results */}
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
    container: { flex: 1 },
    gradient: { ...StyleSheet.absoluteFillObject },
    header: { paddingTop: 50, paddingHorizontal: 20 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    backArrow: { fontSize: 24, color: '#333' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 4 },
    subtitle: { fontSize: 14, color: '#666', paddingHorizontal: 25, paddingBottom: 12 },
    section: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 8, borderRadius: 16, overflow: 'hidden' },
    documentContent: { padding: 20 },
    sectionHeader: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 },
    bodyText: { fontSize: 14, color: '#555', lineHeight: 22 },
    hrvValue: { fontSize: 28, fontWeight: 'bold', color: '#7FB8C9', marginBottom: 8 },
    hrvMetric: { fontSize: 14, color: '#aaa', fontWeight: 'normal' },
});