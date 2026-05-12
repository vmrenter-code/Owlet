import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackArrow from '../components/BackArrow';

// Custom Toggle Switch component
const CustomSwitch = ({ value, onValueChange }: { value: boolean; onValueChange: (val: boolean) => void }) => {
    const translateX = useSharedValue(value ? 20 : 0);
    
    const animatedThumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));
    
    const handlePress = () => {
        const newValue = !value;
        translateX.value = withTiming(newValue ? 20 : 0, { duration: 200 });
        onValueChange(newValue);
    };
    
    return (
        <Pressable onPress={handlePress}>
            <View style={[styles.switchTrack, value && styles.switchTrackOn]}>
                <Animated.View style={[styles.switchThumb, value && styles.switchThumbOn, animatedThumbStyle]} />
            </View>
        </Pressable>
    );
};

export default function PrivacyData() {
    const navigation = useNavigation<any>();
    const [acceptTerms, setAcceptTerms] = useState(true);
    const insets = useSafeAreaInsets();

    // Load saved setting on mount
    useEffect(() => {
        const loadSetting = async () => {
            try {
                const saved = await AsyncStorage.getItem('acceptTerms');
                if (saved !== null) {
                    setAcceptTerms(JSON.parse(saved));
                }
            } catch (e) {
                console.log('Error loading privacy setting');
            }
        };
        loadSetting();
    }, []);

    const handleAcceptTerms = async (value: boolean) => {
        setAcceptTerms(value);
        try {
            await AsyncStorage.setItem('acceptTerms', JSON.stringify(value));
        } catch (e) {
            console.log('Error saving privacy setting');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
            
                <BackArrow/>
           

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Privacy & Data</Text>

                {/* What We Collect Section */}
                <Text style={styles.sectionTitle}>What Information We Collect</Text>
                <View style={styles.section}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bodyText}>
                            <Text style={styles.boldText}>Video & Gaze Data:</Text> While your child engages with the app's activities, we use the device's camera to record eye movements and attention patterns.{'\n\n'}
                            <Text style={styles.boldText}>Physiological Data (ECG):</Text> If a compatible heart rate monitor is connected, we collect Electrocardiogram (ECG) data to understand your child's physiological responses and focus levels.{'\n\n'}
                            <Text style={styles.boldText}>Parent-Child Interaction Data:</Text> During specific assessments, the camera may record interactions between you and your child for analysis.{'\n\n'}
                            <Text style={styles.boldText}>Basic Demographics:</Text> Information such as your child's age and developmental milestones.{'\n\n'}
                            <Text style={styles.boldText}>Technical Data:</Text> Device type and operating system version.
                        </Text>
                    </View>
                </View>

                {/* Data Transmission Section */}
                <Text style={styles.sectionTitle}>How We Handle Video Footage</Text>
                <View style={styles.section}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bodyText}>
                            The app securely transmits raw video footage to our protected research servers for analysis.{'\n\n'}
                            <Text style={styles.boldText}>Encryption:</Text> All video is encrypted using AES-256 both during transit and at rest.{'\n\n'}
                            <Text style={styles.boldText}>Restricted Access:</Text> Only authorized members of the research team can access these files.{'\n\n'}
                            <Text style={styles.boldText}>Retention:</Text> Video files are stored only as long as necessary and are deleted or permanently de-identified.
                        </Text>
                    </View>
                </View>

                {/* Data Use Section */}
                <Text style={styles.sectionTitle}>How We Use This Data</Text>
                <View style={styles.section}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bodyText}>
                            • Refine machine learning models to detect early ADHD and neurodevelopmental risk.{'\n'}
                            • Provide researchers with objective "attention metrics" to improve screening accuracy.{'\n'}
                            • Improve the usability and performance of the app.
                        </Text>
                    </View>
                </View>

                {/* Security & Compliance Section */}
                <Text style={styles.sectionTitle}>Data Security & Compliance</Text>
                <View style={styles.section}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bodyText}>
                            <Text style={styles.boldText}>HIPAA & GDPR Compliance:</Text> We adhere to HIPAA and GDPR standards for data encryption and storage.{'\n\n'}
                            <Text style={styles.boldText}>Anonymization:</Text> We de-identify data whenever possible to protect your child's identity.{'\n\n'}
                            <Text style={styles.boldText}>Secure Storage:</Text> All data is stored on encrypted, cloud-based servers with restricted access.
                        </Text>
                    </View>
                </View>

                {/* Your Rights Section */}
                <Text style={styles.sectionTitle}>Your Rights</Text>
                <View style={styles.section}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bodyText}>
                            <Text style={styles.boldText}>Voluntary Participation:</Text> You can stop using the app and withdraw at any time.{'\n\n'}
                            <Text style={styles.boldText}>Data Access:</Text> You may request to see what data has been collected or ask for deletion.{'\n\n'}
                            <Text style={styles.boldText}>Camera Access:</Text> The app only accesses the camera during active screening sessions.
                        </Text>
                    </View>

                    <View style={[styles.toggleItem, styles.lastItem]}>
                        <Text style={styles.linkLabel}>I accept these terms</Text>
                        <CustomSwitch value={acceptTerms} onValueChange={handleAcceptTerms} />
                    </View>
                </View>

                {/* Contact Section */}
                <Text style={styles.sectionTitle}>Contact Us</Text>
                <View style={styles.section}>
                    <View style={[styles.textContainer, styles.lastItem]}>
                        <Text style={styles.bodyText}>
                            WILD Lab{'\n'}
                            University of California, Irvine{'\n'}
                            Principal Investigator: Dr. Denise Werchan, PhD{'\n'}
                            Email: uciwildlab@gmail.com{'\n'}
                            Website: https://faculty.sites.uci.edu/werchanlab/
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingBottom: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },

    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    linkItemPressed: {
        backgroundColor: '#f8f8f8',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    linkLabel: {
        fontSize: 16,
        color: '#333',
    },

    linkArrow: {
        fontSize: 22,
        color: '#ccc',
    },

    textContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    bodyText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },

    boldText: {
        fontWeight: '600',
    },

    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    switchTrack: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },

    switchTrackOn: {
        backgroundColor: '#8BC0CF',
    },

    switchThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
    },

    switchThumbOn: {
        backgroundColor: '#4A90A4',
    },
});
