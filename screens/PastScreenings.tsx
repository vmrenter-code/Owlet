import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { getAuth } from 'firebase/auth';
import { useChild } from '../context/ChildContext';

const BASE_URL = 'http://localhost:4000'; // Update to your backend URL

export default function PastScreenings() {
    const navigation = useNavigation<any>();
    const [hasIncompleteScreening, setHasIncompleteScreening] = useState(false);
    const [incompleteVideoNumber, setIncompleteVideoNumber] = useState(1);
    const [pastScreenings, setPastScreenings] = useState<any[]>([]);
    const { selectedChild } = useChild();

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

    // Fetch past screenings from the backend
    useEffect(() => {
        const fetchPastScreenings = async () => {
            try {
                const user = getAuth().currentUser;
                if (!user || !selectedChild) return;
                const token = await user.getIdToken();

                const response = await fetch(
                    `${BASE_URL}/screenings?childId=${selectedChild.id}`,
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
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            <Text style={styles.title}>Past Screenings</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {hasIncompleteScreening && (
                    <Pressable style={styles.resumeCard} onPress={handleResumeScreening}>
                        <View style={styles.resumeContent}>
                            <Text style={styles.resumeTitle}>Resume Screening</Text>
                            <Text style={styles.resumeSubtitle}>Click here to continue</Text>
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
                            <Text style={styles.dateText}>
                                {new Date(screening.createdAt).toLocaleDateString()}
                            </Text>
                            <Text style={styles.durationText}>
                                Duration: {screening.duration ?? '~12mins'}
                            </Text>
                            <Text style={styles.statusText}>
                                Status: {screening.completedAt ? 'Complete' : 'In Review'}
                            </Text>

                            {screening.status === "reviewed" && (
                                <View style={styles.linksContainer}>
                                    <Pressable onPress={() => navigation.navigate('ViewResults', { screeningId: screening.id })}>
                                        <Text style={styles.linkText}>View results</Text>
                                    </Pressable>
                                    <Pressable onPress={() => navigation.navigate('ClinicianNotes', { screeningId: screening.id })}>
                                        <Text style={styles.linkText}>View clinician notes</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    ))}
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingTop: 24,
        paddingBottom: 16,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },

    screeningItem: {
        paddingVertical: 24,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    dateText: {
        fontSize: 24,
        fontWeight: '400',
        color: '#333',
        marginBottom: 6,
        letterSpacing: -0.3,
    },

    durationText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },

    statusText: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
    },

    linksContainer: {
        marginTop: 4,
        gap: 4,
    },

    linkText: {
        fontSize: 14,
        color: '#5BA3B0',
        textDecorationLine: 'underline',
    },

    resumeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#7FB8C4',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
    },

    resumeContent: {
        flex: 1,
    },

    resumeTitle: {
        fontSize: 18,
        fontWeight: '600',
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
});
