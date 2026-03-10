import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={styles.title}>Privacy & Data</Text>

                {/* Links Section */}
                <View style={styles.section}>
                    <Pressable style={({ pressed }) => [styles.linkItem, pressed && styles.linkItemPressed]}>
                        <Text style={styles.linkLabel}>Terms of Service</Text>
                        <Text style={styles.linkArrow}>›</Text>
                    </Pressable>

                    <Pressable style={({ pressed }) => [styles.linkItem, styles.lastItem, pressed && styles.linkItemPressed]}>
                        <Text style={styles.linkLabel}>Privacy Policy</Text>
                        <Text style={styles.linkArrow}>›</Text>
                    </Pressable>
                </View>

                {/* Data Practices Section */}
                <Text style={styles.sectionTitle}>Data Practices</Text>

                <View style={styles.section}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bodyText}>
                            We collect and process your data to provide screening services and improve our application. 
                            Your child's screening videos are securely stored and analyzed to provide developmental insights. 
                            We do not share your personal information with third parties without your consent. 
                            You can request deletion of your data at any time through the Account settings.
                        </Text>
                    </View>

                    <View style={[styles.toggleItem, styles.lastItem]}>
                        <Text style={styles.linkLabel}>I accept these terms</Text>
                        <CustomSwitch value={acceptTerms} onValueChange={handleAcceptTerms} />
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
