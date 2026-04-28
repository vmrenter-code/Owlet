import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { HeartRateDataPoint } from '../context/ScreeningContext';

const screenWidth = Dimensions.get('window').width;
const Y_MIN = 0;
const Y_MAX = 160;

export default function HeartRateGraph() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { screeningId, date } = route.params;

    const [heartRateLog, setHeartRateLog] = useState<HeartRateDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLog = async () => {
            try {
                const raw = await AsyncStorage.getItem(`heartRateLog_${screeningId}`);
                if (raw) setHeartRateLog(JSON.parse(raw));
            } catch (e) {
                console.log('Error loading heart rate log');
            } finally {
                setLoading(false);
            }
        };
        loadLog();
    }, [screeningId]);

    const getSampledData = (data: HeartRateDataPoint[]) => {
        if (data.length <= 60) return data;
        const step = Math.floor(data.length / 60);
        return data.filter((_, i) => i % step === 0);
    };

    const sampled = getSampledData(heartRateLog);
    const bpmValues = sampled.map(d => d.bpm);

    // Build time labels from actual elapsed time
   const timeLabels = sampled.map((d, i) => {
    const mins = Math.floor(d.time / 60);
    const secs = d.time % 60;
    const label = mins > 0 ? `${mins}m${secs}s` : `${secs}s`;
    
    // For short screenings show every other label, for long ones every 10th
    const interval = sampled.length <= 10 ? 1 : 
                     sampled.length <= 30 ? 5 : 10;
    
    return i % interval === 0 ? label : '';
});

    const avgBpm = bpmValues.length > 0
        ? Math.round(bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length)
        : 0;
    const maxBpm = bpmValues.length > 0 ? Math.max(...bpmValues) : 0;
    const minBpm = bpmValues.length > 0 ? Math.min(...bpmValues) : 0;

    const totalSeconds = heartRateLog.length > 0
        ? heartRateLog[heartRateLog.length - 1]?.time ?? 0
        : 0;
    const totalMins = Math.floor(totalSeconds / 60);
    const remainingSecs = totalSeconds % 60;
    const durationText = totalMins > 0
        ? `${totalMins}m ${remainingSecs}s`
        : `${totalSeconds}s`;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />

            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Heart Rate</Text>
                <Text style={styles.subtitle}>{date}</Text>

                {loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Loading...</Text>
                    </View>
                ) : bpmValues.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No heart rate data recorded for this screening.</Text>
                    </View>
                ) : (
                    <>
                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Avg</Text>
                                <Text style={styles.statValue}>{avgBpm}</Text>
                                <Text style={styles.statUnit}>BPM</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Max</Text>
                                <Text style={styles.statValue}>{maxBpm}</Text>
                                <Text style={styles.statUnit}>BPM</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Min</Text>
                                <Text style={styles.statValue}>{minBpm}</Text>
                                <Text style={styles.statUnit}>BPM</Text>
                            </View>
                        </View>

                        {/* Chart */}
                        <View style={styles.chartSection}>
                            {/* Y Axis Label */}
                            <Text style={styles.yAxisLabel}>BPM</Text>

                            <View style={styles.chartContainer}>
                                <LineChart
                                    data={{
                                        labels: timeLabels,
                                        datasets: [
                                            {
                                                data: bpmValues,
                                                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                                            },
                                            { data: [Y_MIN], withDots: false },
                                            { data: [Y_MAX], withDots: false },
                                        ],
                                    }}
                                    width={screenWidth - 80}
                                    height={280}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
                                        propsForDots: {
                                            r: '2',
                                            strokeWidth: '1',
                                            stroke: '#ff6b6b',
                                        },
                                        propsForBackgroundLines: {
                                            strokeDasharray: '',
                                            stroke: '#f0f0f0',
                                        },
                                        // Custom Y axis formatter — snaps to nearest 10
                                        formatYLabel: (value) => {
                                            const num = Math.round(parseFloat(value) / 20) * 20;
                                            return `${num}`;
                                        },
                                    }}
                                    bezier
                                    style={styles.chart}
                                    withInnerLines={true}
                                    withOuterLines={false}
                                    withVerticalLabels={true}
                                    withHorizontalLabels={true}
                                    segments={8}
                                />
                                <Text style={styles.xAxisLabel}>Time</Text>
                            </View>
                        </View>

                        <Text style={styles.chartCaption}>
                            {heartRateLog.length} data points · {durationText}
                        </Text>
                    </>
                )}

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
    title: { fontSize: 22, fontWeight: 'bold', color: '#333', paddingHorizontal: 25, paddingTop: 24, paddingBottom: 4 },
    subtitle: { fontSize: 14, color: '#888', paddingHorizontal: 25, marginBottom: 20 },
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
    statCard: {
        flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16,
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    },
    statLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: '#ff6b6b' },
    statUnit: { fontSize: 11, color: '#aaa', marginTop: 2 },
    chartSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    yAxisLabel: {
        fontSize: 11,
        color: '#aaa',
        transform: [{ rotate: '-90deg' }],
        width: 28,
        textAlign: 'center',
        marginRight: 4,
    },
    chartContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    chart: { borderRadius: 12 },
    xAxisLabel: { textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 4 },
    chartCaption: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 12 },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { fontSize: 15, color: '#aaa', textAlign: 'center' },
});