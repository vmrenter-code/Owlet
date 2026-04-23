import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Svg, Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
 

//avatar icon
const FoxAvatar = () => (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} fill="#FFCDD2" />
        <Path d="M8 14c0 0 1.5 2 4 2s4-2 4-2" stroke="#D32F2F" strokeWidth={1.5} strokeLinecap="round" />
        <Circle cx={9} cy={10} r={1.5} fill="#333" />
        <Circle cx={15} cy={10} r={1.5} fill="#333" />
        <Path d="M6 6l2 3M18 6l-2 3" stroke="#D32F2F" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

export default function Account() {
    const navigation = useNavigation<any>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleDeleteAccount = () => {
        if (isDeleting) {
            return;
        }

        Alert.alert(
            'Delete Account?',
            'This permanently removes your account. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        const result = await userAuthServices.deleteAccount();
                        setIsDeleting(false);

                        if (result.success) {
                            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                            navigation.reset({ index: 0, routes: [{ name: 'Launch' }] });
                            return;
                        }

                        Alert.alert('Unable to Delete Account', result.error ?? 'Please try again.');
                    },
                },
            ]
        );
    };

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);
        const result = await userAuthServices.logout();
        setIsLoggingOut(false);

        if (!result.success) {
            Alert.alert('Unable to Log Out', result.error ?? 'Please try again.');
            return;
        }

        navigation.reset({ index: 0, routes: [{ name: 'Launch' }] });
    };

    useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName ?? user.email?.split('@')[0] ?? 'User');
        setUserEmail(user.email ?? '');
      }
    });
    return unsubscribe;
  }, []);

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
                {/* Account Section */}
                <Text style={styles.sectionTitle}>Account</Text>

                <View style={styles.section}>
                    {/* Edit Profile with Avatar */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Edit Profile</Text>
                        <View style={styles.avatarContainer}>
                            <FoxAvatar />
                        </View>
                    </Pressable>

                    {/* Username */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Name</Text>
                        <Text style={styles.itemValue}>{userName}</Text>
                    </Pressable>

                    {/* Email */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Email</Text>
                        <Text style={styles.itemValue}>{userEmail}</Text>
                    </Pressable>

                    {/* Change Password */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Change Password</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    
                </View>

                {/* Child's Information Section */}
                <Text style={styles.sectionTitle}>Child's Information</Text>

                <View style={styles.section}>
                    {/* Name */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Name</Text>
                        <Text style={styles.itemValue}>Babyy</Text>
                    </Pressable>

                    {/* Birth Date */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Birth Date</Text>
                        <Text style={styles.itemValue}>03/08/2020</Text>
                    </Pressable>

                    {/* Race & Ethnicity */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Race & Ethnicity</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    {/* Switch Child Profile */}
                    <Pressable style={({ pressed }) => [styles.accountItem, styles.lastItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Switch Child Profile</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>
                </View>

                {/* Danger Zone */}
                <View style={styles.dangerSection}>
                    <Pressable
                        style={({ pressed }) => [styles.dangerItem, pressed && styles.dangerItemPressed]}
                        onPress={handleDeleteAccount}
                        disabled={isDeleting}
                    >
                        <Text style={styles.dangerText}>{isDeleting ? 'Deleting Account...' : 'Delete Account'}</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.dangerItem, styles.lastItem, pressed && styles.dangerItemPressed]}
                        onPress={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <Text style={styles.dangerText}>{isLoggingOut ? 'Logging out...' : 'Log out'}</Text>
                    </Pressable>
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

    sectionTitle: {
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

    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    accountItemPressed: {
        backgroundColor: '#f8f8f8',
    },

    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },

    itemValue: {
        fontSize: 16,
        color: '#999',
    },

    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemArrow: {
        fontSize: 22,
        color: '#ccc',
    },

    dangerSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },

    dangerItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
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
