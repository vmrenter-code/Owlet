import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Account menu items
const accountItems = [
    { id: 'editProfile', label: 'Edit Profile', hasAvatar: true },
    { id: 'username', label: 'Username', hasArrow: true },
    { id: 'email', label: 'Email', hasArrow: true },
    { id: 'password', label: 'Change Password', hasArrow: true },
    { id: 'profile', label: 'Edit Profile', hasArrow: true },
    { id: 'switchChild', label: 'Switch Child Profile', hasArrow: true },
];

export default function Account() {
    const navigation = useNavigation<any>();

    const handleDeleteAccount = () => {
        // Handle delete account
        console.log('Delete account pressed');
    };

    const handleLogout = () => {
        // Handle logout - navigate back to Launch
        navigation.navigate('Launch');
    };

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
            <Text style={styles.title}>Account</Text>

            {/* Account Items */}
            <View style={styles.section}>
                {accountItems.map((item) => (
                    <Pressable
                        key={item.id}
                        style={({ pressed }) => [
                            styles.accountItem,
                            pressed && styles.accountItemPressed
                        ]}
                    >
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        {item.hasAvatar && (
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarEmoji}>🐻</Text>
                            </View>
                        )}
                        {item.hasArrow && (
                            <Text style={styles.itemArrow}>›</Text>
                        )}
                    </Pressable>
                ))}
            </View>

            {/* Danger Zone */}
            <View style={styles.dangerSection}>
                <Pressable
                    style={({ pressed }) => [
                        styles.dangerItem,
                        pressed && styles.dangerItemPressed
                    ]}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.dangerText}>Delete Account</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.dangerItem,
                        pressed && styles.dangerItemPressed
                    ]}
                    onPress={handleLogout}
                >
                    <Text style={styles.dangerText}>Log out</Text>
                </Pressable>
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

    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    accountItemPressed: {
        backgroundColor: '#f8f8f8',
    },

    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },

    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarEmoji: {
        fontSize: 18,
    },

    itemArrow: {
        fontSize: 22,
        color: '#ccc',
    },

    dangerSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },

    dangerItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    dangerItemPressed: {
        backgroundColor: '#fff5f5',
    },

    dangerText: {
        fontSize: 16,
        color: '#e74c3c',
    },
});
