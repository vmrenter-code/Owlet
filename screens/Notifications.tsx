import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import HomeBg from '../components/HomeBg';
import BackArrow from '../components/BackArrow';

const INDIGO = '#5058b4';

const CustomSwitch = ({ value, onValueChange }: { value: boolean; onValueChange: (val: boolean) => void }) => {
    const translateX = useSharedValue(value ? 22 : 2);

    const animatedThumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handlePress = () => {
        const next = !value;
        translateX.value = withTiming(next ? 22 : 2, { duration: 200 });
        onValueChange(next);
    };

    return (
        <Pressable onPress={handlePress} accessibilityRole="switch" accessibilityState={{ checked: value }}>
            <Animated.View style={[styles.track, value && styles.trackOn]}>
                <Animated.View style={[styles.thumb, animatedThumbStyle]} />
            </Animated.View>
        </Pressable>
    );
};

type NotificationRow = {
    key: string;
    label: string;
    sub: string;
    value: boolean;
    onChange: (v: boolean) => void;
};

export default function Notifications() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const [screeningResult, setScreeningResult] = useState(true);
    const [updates, setUpdates]                 = useState(true);
    const [troubleshoot, setTroubleshoot]       = useState(true);
    const [customerService, setCustomerService] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('notificationSettings').then(saved => {
            if (!saved) return;
            const s = JSON.parse(saved);
            setScreeningResult(s.screeningResult ?? true);
            setUpdates(s.updates ?? true);
            setTroubleshoot(s.troubleshoot ?? true);
            setCustomerService(s.customerService ?? true);
        }).catch(() => {});
    }, []);

    const save = async (key: string, value: boolean) => {
        try {
            const raw = await AsyncStorage.getItem('notificationSettings');
            const s = raw ? JSON.parse(raw) : {};
            s[key] = value;
            await AsyncStorage.setItem('notificationSettings', JSON.stringify(s));
        } catch {}
    };

    const rows: NotificationRow[] = [
        {
            key: 'screeningResult',
            label: 'Screening Results',
            sub: 'Get notified when your child\'s results are ready',
            value: screeningResult,
            onChange: v => { setScreeningResult(v); save('screeningResult', v); },
        },
        {
            key: 'updates',
            label: 'App Updates',
            sub: 'Stay informed about new features and improvements',
            value: updates,
            onChange: v => { setUpdates(v); save('updates', v); },
        },
        {
            key: 'troubleshoot',
            label: 'Troubleshooting Tips',
            sub: 'Receive help when screening issues are detected',
            value: troubleshoot,
            onChange: v => { setTroubleshoot(v); save('troubleshoot', v); },
        },
        {
            key: 'customerService',
            label: 'Customer Support',
            sub: 'Alerts and responses from our support team',
            value: customerService,
            onChange: v => { setCustomerService(v); save('customerService', v); },
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <BackArrow />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>Choose which alerts you'd like to receive.</Text>

                <View style={styles.card}>
                    {rows.map((row, i) => (
                        <View
                            key={row.key}
                            style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
                        >
                            <View style={styles.rowText}>
                                <Text style={styles.rowLabel}>{row.label}</Text>
                                <Text style={styles.rowSub}>{row.sub}</Text>
                            </View>
                            <CustomSwitch value={row.value} onValueChange={row.onChange} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    scroll: { flex: 1, zIndex: 1 },
    scrollContent: { paddingHorizontal: 20, gap: 6 },
    title: {
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        marginBottom: 20,
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
    },
    rowText: { flex: 1 },
    rowLabel: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        marginBottom: 2,
    },
    rowSub: {
        fontSize: 13,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        lineHeight: 18,
    },
    track: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.12)',
        justifyContent: 'center',
    },
    trackOn: {
        backgroundColor: INDIGO,
    },
    thumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#ffffff',
        boxShadow: '0px 1px 4px rgba(0,0,0,0.2)',
    } as any,
});
