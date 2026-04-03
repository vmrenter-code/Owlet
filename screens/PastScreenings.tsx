import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';

const pastScreeningsData = [
    {
        id: 1,
        date: '03/04/2026',
        duration: '~13mins',
        status: 'In Review',
        hasResults: false,
    },
    {
        id: 2,
        date: '02/22/2026',
        duration: '~12mins',
        status: 'Complete',
        hasResults: true,
    },
    {
        id: 3,
        date: '01/12/2026',
        duration: '~13mins',
        status: 'Complete',
        hasResults: true,
    },
];

export default function PastScreenings() {
    const navigation = useNavigation<any>();
    const [hasIncompleteScreening, setHasIncompleteScreening] = useState(false);
    const [incompleteVideoNumber, setIncompleteVideoNumber] = useState(1);

    // Check for incomplete screening on mount
    // Resume button only shows if user has NOT pressed "Finish and Submit"
    useEffect(() => {
        const checkIncompleteScreening = async () => {
            try {
                const savedProgress = await AsyncStorage.getItem('screeningProgress');
                if (savedProgress) {
                    const progress = JSON.parse(savedProgress);
                    // Only show resume if screening was started but NOT completed (didn't press "Finish and Submit")
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
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            {/* Title */}
            <Text style={styles.title}>Past Screenings</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Resume Screening Card - only shows when there's an incomplete screening */}
                {hasIncompleteScreening && (
                    <Pressable 
                        style={styles.resumeCard}
                        onPress={handleResumeScreening}
                    >
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

                {/* Screenings List */}
                <View style={styles.section}>
                    {pastScreeningsData.map((screening, index) => (
                        <View 
                            key={screening.id} 
                            style={[
                                styles.screeningItem,
                                index === pastScreeningsData.length - 1 && styles.lastItem
                            ]}
                        >
                            <Text style={styles.dateText}>{screening.date}</Text>
                            <Text style={styles.durationText}>duration: {screening.duration}</Text>
                            
                            {!screening.hasResults ? (
                                <Text style={styles.statusText}>Status-{screening.status}</Text>
                            ) : (
                                <View style={styles.linksContainer}>
                                    <Pressable onPress={() => navigation.navigate('ViewResults', { screeningId: screening.id, date: screening.date })}>
                                        <Text style={styles.linkText}>View results</Text>
                                    </Pressable>
                                    <Pressable onPress={() => navigation.navigate('ClinicianNotes', { screeningId: screening.id, date: screening.date })}>
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
