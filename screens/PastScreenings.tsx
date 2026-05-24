import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import { getAuth } from 'firebase/auth';

const BASE_URL = 'http://localhost:4000'; // Update to your backend URL
import {useChildProfile} from '../context/ChildProfileContext';

export default function PastScreenings() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [hasIncompleteScreening, setHasIncompleteScreening] = useState(false);
    const [incompleteVideoNumber, setIncompleteVideoNumber] = useState(1);
    const [latestScreeningId, setLatestScreeningId] = useState<string | null>(null);
    const [pastScreenings, setPastScreenings] = useState<any[]>([]);
    const { activeChild } = useChildProfile();

    // Check for incomplete screening on mount
    useEffect(() => {
        const checkIncompleteScreening = async () => {
            try {
                const savedProgress = await AsyncStorage.getItem('screeningProgress');
                if (savedProgress) {
                    const progress = JSON.parse(savedProgress);
                    if (progress.videoNumber && !progress.completed) {
                        setHasIncompleteScreening(true);
                        setIncompleteVideoNumber(progress.videoNumber);
                    }
                }
            } catch (e) {
                console.log('Error checking screening progress');
            }
        };
        checkIncompleteScreening();
    }, []);

    useEffect(() => {
    const getLatestId = async () => {
        try {
            // Get the most recent screening ID from screeningProgress
            const savedProgress = await AsyncStorage.getItem('screeningProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                if (progress.completed) {
                    // Check if a heart rate log exists for this specific screening
                    const keys = await AsyncStorage.getAllKeys();
                    const hrKey = keys.find(k => k.startsWith('heartRateLog_') && k !== 'heartRateLog_null');
                    
                    // Find the most recent by sorting keys by timestamp in the screening ID
                    const hrKeys = keys.filter(k => k.startsWith('heartRateLog_') && k !== 'heartRateLog_null');
                    if (hrKeys.length > 0) {
                        // Sort by timestamp embedded in screening ID (screening_TIMESTAMP_xxx)
                        hrKeys.sort((a, b) => {
    const tsA = parseInt(a.split('_')[2]) || 0;
    const tsB = parseInt(b.split('_')[2]) || 0;
    return tsB - tsA;
});
                        setLatestScreeningId(hrKeys[0].replace('heartRateLog_', ''));
                    }
                }
            }
        } catch (e) {
            console.log('Error fetching latest screening');
        }
    };
    getLatestId();
}, []);


    // Fetch past screenings from the backend
    useEffect(() => {
        const fetchPastScreenings = async () => {
            try {
                const user = getAuth().currentUser;
                if (!user || !activeChild) return;
                const token = await user.getIdToken();

                const response = await fetch(
                    `${BASE_URL}/screenings?childId=${activeChild.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) throw new Error('Failed to fetch screenings');
                const data = await response.json();
                // Assuming backend returns: { success: true, screenings: [...] }
                if (data.success && data.screenings) {
                    setPastScreenings(data.screenings);
                }
            } catch (err) {
                console.error('Error fetching past screenings:', err);
            }
        };
        fetchPastScreenings();
    }, []);

    const handleResumeScreening = () => {
        navigation.navigate('VideoScreen', { videoNumber: incompleteVideoNumber });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />

            <BackArrow />

            <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Past Screenings</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {hasIncompleteScreening && (
                    <Pressable
                        style={styles.resumeCard}
                        onPress={handleResumeScreening}
                    >
                        <View style={styles.resumeContent}>
                            <Text style={styles.resumeTitle}>Resume Screening</Text>
                            <Text style={styles.resumeSubtitle}>Continue where you left off</Text>
                        </View>
                        <View style={styles.playButton}>
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                <Path d="M8 5v14l11-7L8 5z" fill="#ffffff" />
                            </Svg>
                        </View>
                    </Pressable>
                )}

                <View style={styles.section}>
                    {pastScreenings.map((screening, index) => (
                        <View
                            key={screening.id}
                            style={[
                                styles.screeningItem,
                                index === pastScreenings.length - 1 && styles.lastItem
                            ]}
                        >
                            <View style={styles.itemHeader}>
                                <Text style={styles.dateText}>{screening.date}</Text>
                                <View style={[styles.statusBadge, screening.hasResults ? styles.statusBadgeComplete : styles.statusBadgeReview]}>
                                    <Text style={[styles.statusBadgeText, screening.hasResults ? styles.statusBadgeTextComplete : styles.statusBadgeTextReview]}>
                                        {screening.status}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.durationText}>Session length: {screening.duration}</Text>

                            {!screening.hasResults ? (
                                <Text style={styles.pendingText}>Results will appear once clinician review is complete.</Text>
                            ) : (
                                <View style={styles.linksContainer}>
                                    <Pressable
                                        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
                                        onPress={() => navigation.navigate('ViewResults', { screeningId: screening.id, date: screening.date })}
                                    >
                                        <Text style={styles.linkText}>View results</Text>
                                    </Pressable>
                                    <Pressable
                                        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
                                        onPress={() => navigation.navigate('ClinicianNotes', { screeningId: screening.id, date: screening.date })}
                                    >
                                        <Text style={styles.linkText}>Clinician notes</Text>
                                    </Pressable>
                                    <Pressable onPress={() => navigation.navigate('HeartRateGraph', { screeningId: screening.id, date: screening.date })}>
                                        <Text style={styles.linkText}>View heart rate</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
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

    title: {
        fontSize: 28,
        fontFamily: 'NotoSans-Bold',
        color: '#1f2a2f',
        paddingHorizontal: 24,
        paddingBottom: 16,
        letterSpacing: -0.5,
    },

    scrollContent: {
        paddingBottom: 140,
    },

    section: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(127, 184, 196, 0.15)',
    },

    screeningItem: {
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eef3f4',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    dateText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#223037',
        letterSpacing: -0.3,
    },

    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    statusBadgeComplete: {
        backgroundColor: '#e9f8ee',
    },

    statusBadgeReview: {
        backgroundColor: '#fff5df',
    },

    statusBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },

    statusBadgeTextComplete: {
        color: '#1f8b4d',
    },

    statusBadgeTextReview: {
        color: '#9a6b00',
    },

    durationText: {
        fontSize: 14,
        color: '#627177',
        marginBottom: 10,
    },

    pendingText: {
        fontSize: 13,
        color: '#6b7579',
        lineHeight: 18,
    },

    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 2,
    },

    actionButton: {
        backgroundColor: '#eef7f9',
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    actionButtonPressed: {
        backgroundColor: '#e2f0f3',
    },

    linkText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2f7d8f',
    },

    resumeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#5f9eac',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#2c6c78',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
        elevation: 4,
    },

    resumeContent: {
        flex: 1,
    },

    resumeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },

    resumeSubtitle: {
        fontSize: 14,
        color: '#ffffff',
        opacity: 0.9,
    },

    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentHeartRateCard: {
    backgroundColor: '#fff0f0',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffcccc',
},
recentHeartRateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
},
});