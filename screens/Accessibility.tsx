import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import HomeBg from '../components/HomeBg';
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

export default function Accessibility() {
    const navigation = useNavigation<any>();
    const [screenReader, setScreenReader] = useState(true);
    const insets = useSafeAreaInsets();

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
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <BackArrow />

            <View style={styles.content}>
                <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Accessibility</Text>

                <View style={styles.section}>
                <View style={styles.toggleItem}>
                    <Text style={styles.itemLabel}>Enable Screen Reader</Text>
                    <CustomSwitch value={screenReader} onValueChange={handleScreenReader} />
                </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    content: {
        flex: 1,
        zIndex: 1,
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
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.3,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },

    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    itemLabel: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
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
