import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Modal, Animated, Dimensions, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Svg, Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import userAuthServices from '../src/services/userAuthServices';
import { useChildProfile } from '../context/ChildProfileContext';
 

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

/** Shape placeholders for child profile switcher avatars */
const HeartAvatar = () => (
    <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
        <Circle cx={28} cy={28} r={26} fill="#FDE7EC" />
        <Path
            d="M28 40s-12-7.2-12-16a7.5 7.5 0 0 1 13.5-4.5L28 21l-1.5-1.5A7.5 7.5 0 0 1 40 24c0 8.8-12 16-12 16z"
            fill="#E63956"
        />
    </Svg>
);

const StarAvatar = () => (
    <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
        <Circle cx={28} cy={28} r={26} fill="#FFF6D6" />
        <Path
            d="M28 14l3.95 8.45 9.05 1.05-6.7 6.4 1.8 9.1L28 34.7l-8.1 4.3 1.8-9.1-6.7-6.4 9.05-1.05L28 14z"
            fill="#F5B400"
        />
    </Svg>
);

const DiamondAvatar = () => (
    <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
        <Circle cx={28} cy={28} r={26} fill="#E3F4FF" />
        <Path d="M28 12l14 16-14 16-14-16z" fill="#3FB6F0" />
    </Svg>
);

const CheckMarkIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Circle cx={9} cy={9} r={9} fill="#49A3BD" />
        <Path d="M5 9l2.5 2.5L13 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const childProfiles = [
    { id: 'babyy', name: 'Babyy', Avatar: HeartAvatar },
    { id: 'baby2', name: 'Baby2', Avatar: StarAvatar },
    { id: 'baby3', name: 'Baby3', Avatar: DiamondAvatar },
] as const;

export default function Account() {
    const navigation = useNavigation<any>();
    const [userName, setUserName] = useState('username');
    const [userEmail, setUserEmail] = useState('username@gmail.com');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [switchChildModalVisible, setSwitchChildModalVisible] = useState(false);
    const [sheetMounted, setSheetMounted] = useState(false);
    const { activeChildId, setActiveChildId } = useChildProfile();

    const screenHeight = Dimensions.get('window').height;
    const sheetTranslateY = useRef(new Animated.Value(screenHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (switchChildModalVisible) {
            setSheetMounted(true);
            Animated.parallel([
                Animated.timing(sheetTranslateY, {
                    toValue: 0,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [switchChildModalVisible, sheetTranslateY, backdropOpacity, screenHeight]);

    const closeSwitchChildModal = () => {
        Animated.parallel([
            Animated.timing(sheetTranslateY, {
                toValue: screenHeight,
                duration: 240,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setSwitchChildModalVisible(false);
            setSheetMounted(false);
        });
    };

    const selectChildAndClose = (id: string) => {
        setActiveChildId(id);
        closeSwitchChildModal();
    };

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
                        <Text style={styles.itemValue}>
                            {childProfiles.find((c) => c.id === activeChildId)?.name ?? 'Babyy'}
                        </Text>
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
                    <Pressable
                        style={({ pressed }) => [styles.accountItem, styles.lastItem, pressed && styles.accountItemPressed]}
                        onPress={() => setSwitchChildModalVisible(true)}
                    >
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

            <Modal
                visible={switchChildModalVisible || sheetMounted}
                transparent
                animationType="none"
                onRequestClose={closeSwitchChildModal}
            >
                <View style={styles.modalRoot}>
                    <Animated.View
                        style={[StyleSheet.absoluteFillObject, styles.modalBackdrop, { opacity: backdropOpacity }]}
                        pointerEvents="auto"
                    >
                        <Pressable
                            style={StyleSheet.absoluteFillObject}
                            onPress={closeSwitchChildModal}
                            accessibilityRole="button"
                            accessibilityLabel="Dismiss"
                        />
                    </Animated.View>
                    <View style={styles.modalSheetWrap} pointerEvents="box-none">
                        <Animated.View style={[styles.modalSheet, { transform: [{ translateY: sheetTranslateY }] }]}>
                            <View style={styles.sheetHandle} />
                            <View style={styles.profileRow}>
                                {childProfiles.map((child) => {
                                    const selected = activeChildId === child.id;
                                    const Avatar = child.Avatar;
                                    return (
                                        <Pressable
                                            key={child.id}
                                            style={styles.profileCell}
                                            onPress={() => selectChildAndClose(child.id)}
                                        >
                                            <View style={styles.profileCircle}>
                                                <Avatar />
                                            </View>
                                            <Text style={styles.profileName}>{child.name}</Text>
                                            <View style={styles.checkArea}>
                                                {selected ? <CheckMarkIcon /> : null}
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </Modal>
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

    modalRoot: {
        flex: 1,
    },

    modalBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
    },

    modalSheetWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    modalSheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 36,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 16,
    },

    sheetHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#d9d9d9',
        alignSelf: 'center',
        marginBottom: 24,
    },

    profileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
    },

    profileCell: {
        alignItems: 'center',
        width: '30%',
        maxWidth: 110,
    },

    profileCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
    },

    profileName: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },

    checkArea: {
        marginTop: 6,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
