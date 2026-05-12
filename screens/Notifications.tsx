import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function Notifications() {
    const navigation = useNavigation<any>();
    
    const [screeningResult, setScreeningResult] = useState(true);
    const [updates, setUpdates] = useState(true);
    const [troubleshoot, setTroubleshoot] = useState(true);
    const [customerService, setCustomerService] = useState(true);

    // Load saved settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const saved = await AsyncStorage.getItem('notificationSettings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    setScreeningResult(settings.screeningResult ?? true);
                    setUpdates(settings.updates ?? true);
                    setTroubleshoot(settings.troubleshoot ?? true);
                    setCustomerService(settings.customerService ?? true);
                }
            } catch (e) {
                console.log('Error loading notification settings');
            }
        };
        loadSettings();
    }, []);

    // Save settings when they change
    const saveSettings = async (key: string, value: boolean) => {
        try {
            const saved = await AsyncStorage.getItem('notificationSettings');
            const settings = saved ? JSON.parse(saved) : {};
            settings[key] = value;
            await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
        } catch (e) {
            console.log('Error saving notification settings');
        }
    };

    const handleScreeningResult = (value: boolean) => {
        setScreeningResult(value);
        saveSettings('screeningResult', value);
    };

    const handleUpdates = (value: boolean) => {
        setUpdates(value);
        saveSettings('updates', value);
    };

    const handleTroubleshoot = (value: boolean) => {
        setTroubleshoot(value);
        saveSettings('troubleshoot', value);
    };

    const handleCustomerService = (value: boolean) => {
        setCustomerService(value);
        saveSettings('customerService', value);
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
                <BackArrow/>
            </View>

            {/* Title */}
            <Text style={styles.title}>Notifications</Text>

            {/* Notification Settings */}
            <View style={styles.section}>
                {/* Screening Result Notification */}
                <View style={styles.notificationItem}>
                    <Text style={styles.itemLabel}>Screening Result{'\n'}Notification</Text>
                    <CustomSwitch value={screeningResult} onValueChange={handleScreeningResult} />
                </View>

                {/* Updates Notification */}
                <View style={styles.notificationItem}>
                    <Text style={styles.itemLabel}>Updates Notification</Text>
                    <CustomSwitch value={updates} onValueChange={handleUpdates} />
                </View>

                {/* Troubleshoot Notification */}
                <View style={styles.notificationItem}>
                    <Text style={styles.itemLabel}>Troubleshoot{'\n'}Notification</Text>
                    <CustomSwitch value={troubleshoot} onValueChange={handleTroubleshoot} />
                </View>

                {/* Customer Service Notification */}
                <View style={[styles.notificationItem, styles.lastItem]}>
                    <Text style={styles.itemLabel}>Customer Service{'\n'}Notification</Text>
                    <CustomSwitch value={customerService} onValueChange={handleCustomerService} />
                </View>
            </View>
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

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },

    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
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
