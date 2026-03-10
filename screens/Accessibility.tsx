import { View, Text, StyleSheet, Pressable } from 'react-native';
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

export default function Accessibility() {
    const navigation = useNavigation<any>();
    const [screenReader, setScreenReader] = useState(true);

    // Load saved setting on mount
    useEffect(() => {
        const loadSetting = async () => {
            try {
                const saved = await AsyncStorage.getItem('screenReader');
                if (saved !== null) {
                    setScreenReader(JSON.parse(saved));
                }
            } catch (e) {
                console.log('Error loading accessibility setting');
            }
        };
        loadSetting();
    }, []);

    const handleScreenReader = async (value: boolean) => {
        setScreenReader(value);
        try {
            await AsyncStorage.setItem('screenReader', JSON.stringify(value));
        } catch (e) {
            console.log('Error saving accessibility setting');
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

            {/* Title */}
            <Text style={styles.title}>Accessibility</Text>

            {/* Settings Section */}
            <View style={styles.section}>
                <View style={styles.toggleItem}>
                    <Text style={styles.itemLabel}>Enable Screen Reader</Text>
                    <CustomSwitch value={screenReader} onValueChange={handleScreenReader} />
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

    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    itemLabel: {
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
