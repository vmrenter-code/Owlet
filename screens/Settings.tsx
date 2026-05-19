import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import BackArrow from '../components/BackArrow';

// Icon components. 
const PersonIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={8} r={4} stroke="#333" strokeWidth={2} />
        <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#333" strokeWidth={2} strokeLinecap="round" />
    </Svg>
);

const BellIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" stroke="#333" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const ShieldIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" stroke="#333" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const AccessibilityIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={4} r={2} stroke="#333" strokeWidth={2} />
        <Path d="M12 8v4m0 0l-3 6m3-6l3 6M5 10h14" stroke="#333" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const HelpIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke="#333" strokeWidth={2} />
        <Path d="M9 9c0-1.5 1.5-3 3-3s3 1.5 3 3c0 2-3 2-3 4" stroke="#333" strokeWidth={2} strokeLinecap="round" />
        <Circle cx={12} cy={17} r={1} fill="#333" />
    </Svg>
);

const LanguageIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M5 8h6M8 5v3M7 8c0 3 2 6 6 8M13 5l4 9 4-9M14 11h6" stroke="#333" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Settings menu items
const settingsSection1 = [
    { id: 'account', label: 'Account &\nChild Information', IconComponent: PersonIcon, screen: 'Account' },
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
        if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

    const renderSettingsItem = (item: any) => (
        <Pressable
            key={item.id}
            style={({ pressed }) => [
                styles.settingsItem,
                pressed && styles.settingsItemPressed
            ]}
            onPress={() => handleItemPress(item)}
        >
            <View style={styles.iconContainer}>
                <item.IconComponent />
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemArrow}>›</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />

           <BackArrow />
           
            <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Settings</Text>

            {/* Section 1 */}
            <View style={styles.section}>
                {settingsSection1.map(renderSettingsItem)}
            </View>

            {/* Section 2 */}
            <View style={styles.section}>
                {settingsSection2.map(renderSettingsItem)}
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



    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    backArrow: {
        fontSize: 20,
        color: '#333',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingBottom: 20,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },

    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    settingsItemPressed: {
        backgroundColor: '#f8f8f8',
    },

    iconContainer: {
        width: 24,
        height: 24,
        marginRight: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },

    itemArrow: {
        fontSize: 22,
        color: '#ccc',
    },
});
