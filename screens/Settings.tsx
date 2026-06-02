import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import HomeBg from '../components/HomeBg';

const INDIGO = '#5058b4';

const PersonIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={8} r={4} stroke={INDIGO} strokeWidth={2} />
        <Path
            d="M4 20c0-4 4-6 8-6s8 2 8 6"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
        />
    </Svg>
);

const BellIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ShieldIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const AccessibilityIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={4} r={2} stroke={INDIGO} strokeWidth={2} />
        <Path
            d="M12 8v4m0 0l-3 6m3-6l3 6M5 10h14"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const HelpIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke={INDIGO} strokeWidth={2} />
        <Path
            d="M9 9c0-1.5 1.5-3 3-3s3 1.5 3 3c0 2-3 2-3 4"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
        />
        <Circle cx={12} cy={17} r={1} fill={INDIGO} />
    </Svg>
);

const LanguageIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 8h6M8 5v3M7 8c0 3 2 6 6 8M13 5l4 9 4-9M14 11h6"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ChevronIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9 6l6 6-6 6"
            stroke="#bbb"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const settingsSection1 = [
    { id: 'account', label: 'Account & Child Information', IconComponent: PersonIcon, screen: 'Account' },
];

const settingsSection2 = [
    { id: 'notifications', label: 'Notifications', IconComponent: BellIcon, screen: 'Notifications' },
    { id: 'privacy', label: 'Privacy & Data', IconComponent: ShieldIcon, screen: 'PrivacyData' },
    { id: 'accessibility', label: 'Accessibility', IconComponent: AccessibilityIcon, screen: 'Accessibility' },
    { id: 'support', label: 'Support', IconComponent: HelpIcon, screen: 'Support' },
    { id: 'languages', label: 'Languages', IconComponent: LanguageIcon, screen: 'Languages' },
];

export default function Settings() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const handleItemPress = (item: { screen: string | null }) => {
        if (item.screen) navigation.navigate(item.screen);
    };

    const renderSettingsItem = (
        item: { id: string; label: string; IconComponent: () => any; screen: string | null },
        isLast: boolean,
    ) => (
        <Pressable
            key={item.id}
            style={({ pressed }) => [
                styles.row,
                !isLast && styles.rowBorder,
                pressed && styles.rowPressed,
            ]}
            onPress={() => handleItemPress(item)}
        >
            <View style={styles.iconContainer}>
                <item.IconComponent />
            </View>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <ChevronIcon />
        </Pressable>
    );

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
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>Manage your account and preferences.</Text>

                <View style={styles.card}>
                    {settingsSection1.map((item, i) =>
                        renderSettingsItem(item, i === settingsSection1.length - 1),
                    )}
                </View>

                <View style={styles.card}>
                    {settingsSection2.map((item, i) =>
                        renderSettingsItem(item, i === settingsSection2.length - 1),
                    )}
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
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 14,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
    },
    rowPressed: {
        backgroundColor: 'rgba(80, 88, 180, 0.06)',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(80, 88, 180, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabel: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
    },
});
