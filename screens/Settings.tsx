import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Settings menu items
const settingsSection1 = [
    { id: 'account', label: 'Account', icon: '👤', screen: 'Account' },
    { id: 'child', label: "Child's Information", icon: '👶', screen: null },
];

const settingsSection2 = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', screen: null },
    { id: 'privacy', label: 'Privacy & Data', icon: '🛡️', screen: null },
    { id: 'accessibility', label: 'Accessibility', icon: '♿', screen: null },
    { id: 'support', label: 'Support', icon: '❓', screen: null },
    { id: 'languages', label: 'Languages', icon: '🌐', screen: null },
];

export default function Settings() {
    const navigation = useNavigation<any>();

    const handleItemPress = (item: { screen: string | null }) => {
        if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

    const renderSettingsItem = (item: typeof settingsSection1[0]) => (
        <Pressable
            key={item.id}
            style={({ pressed }) => [
                styles.settingsItem,
                pressed && styles.settingsItemPressed
            ]}
            onPress={() => handleItemPress(item)}
        >
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemArrow}>›</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
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
            <Text style={styles.title}>Settings</Text>

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
        backgroundColor: '#f5f5f5',
    },

    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
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
        paddingTop: 25,
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

    itemIcon: {
        fontSize: 20,
        marginRight: 14,
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
