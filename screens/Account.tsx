import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeBg from '../components/HomeBg';
import { useAppState } from '../context/AppStateContext';

import { getAuth, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import userAuthServices from '../src/services/userAuthServices';

import BackArrow from '../components/BackArrow';
import { useChildProfile } from '../context/ChildProfileContext';
import CalendarPicker from '../components/CalendarPicker';
import { useChild } from '../context/ChildContext';
import { API_BASE_URL } from '../src/config/apiBaseUrl';

export default function Account() {
    const { logout } = useAppState();
    const navigation = useNavigation<any>();
    const [userName, setUserName] = useState('username');
    const [userEmail, setUserEmail] = useState('username@gmail.com');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const insets = useSafeAreaInsets();
    const [raceEthnicitySummary, setRaceEthnicitySummary] = useState<string>('Not set');
    const [editNameVisible, setEditNameVisible] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [birthDateModalVisible, setBirthDateModalVisible] = useState(false);
    const {
        activeChildId,
        activeChild,
        birthDates,
        //updateChildBirthDate,
        openSwitcher,
    } = useChildProfile();

    const activeBirthDate = birthDates[activeChildId] ?? null;

    const {selectedChild, updateChildName, updateChildBirthDate} = useChild();

    const formatBirthDate = (bday: Date | null | undefined): string => {
        if (!bday) return 'Not set';
        return new Date(bday).toLocaleDateString('en-US');
    };

    const handleChangePassword = async () => {
        if (isChangingPassword) return;
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Missing fields', 'Please fill out all password fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Password mismatch', 'New passwords do not match.');
            return;
        }

        setIsChangingPassword(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user || !user.email) {
                throw new Error('No authenticated user.');
            }

            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            Alert.alert('Password changed', 'Your password has been updated.');
            setChangePasswordVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const message = err?.message ?? 'Unable to change password.';
            Alert.alert('Error', message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const openEditName = () => {
        setNameDraft(selectedChild?.name ?? 'Set name');
        setEditNameVisible(true);
    };

    const saveChildName = async () => {
        const trimmed = nameDraft.trim();
        if (trimmed.length === 0) {
            Alert.alert('Name required', 'Please enter a name.');
            return;
        }
        const childId = selectedChild?.id ?? activeChildId;
        updateChildName(childId, trimmed);
        setEditNameVisible(false);
    };

    useFocusEffect(
        useCallback(() => {
            const parts = [selectedChild?.race, selectedChild?.ethnicity].filter(
                (v): v is string => !!v && v.length > 0,
            );
            setRaceEthnicitySummary(parts.length ? parts.join(', ') : 'Not set');
        }, [selectedChild?.race, selectedChild?.ethnicity]),
    );

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

    logout();

  navigation.getParent()?.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Launch' }],
  })
);

    return;
}

                        Alert.alert('Unable to Delete Account', result.error ?? 'Please try again.');
                    },
                },
            ]
        );
    };

    const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const result = await userAuthServices.logout();
    setIsLoggingOut(false);

    if (!result.success) {
        Alert.alert('Unable to Log Out', result.error ?? 'Please try again.');
        return;
    }

    logout();

navigation.getParent()?.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Launch' }],
  })
);
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
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>
            <BackArrow />
           <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Account</Text>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
               

                <View style={styles.section}>
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
                    <Pressable
                        style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}
                        onPress={() => setChangePasswordVisible(true)}
                    >
                        <Text style={styles.itemLabel}>Change Password</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    
                </View>

                {/* Child's Information Section */}
                <Text style={styles.sectionTitle}>Child's Information</Text>

                <View style={styles.section}>
                    {/* Name */}
                    <Pressable
                        style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}
                        onPress={openEditName}
                    >
                        <Text style={styles.itemLabel}>Name</Text>
                        <Text style={styles.itemValue}>{selectedChild?.name ?? 'NoChild'}</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    {/* Birth Date */}
                    <Pressable
                        style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}
                        onPress={() => setBirthDateModalVisible(true)}
                    >
                        <Text style={styles.itemLabel}>Birth Date</Text>
                        <Text style={styles.itemValue}>{
                            selectedChild?.birthday ? new Date(selectedChild.birthday).toLocaleDateString('en-US') : 'Add birthdate'
                        }</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    {/* Race & Ethnicity */}
                    <Pressable
                        style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}
                        onPress={() => navigation.navigate('RaceEthnicity')}
                    >
                        <Text style={styles.itemLabel}>Race & Ethnicity</Text>
                        <Text
                            style={[styles.itemValue, styles.itemValueTrailing]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {raceEthnicitySummary}
                        </Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    {/* Switch Child Profile */}
                    <Pressable
                        style={({ pressed }) => [styles.accountItem, styles.lastItem, pressed && styles.accountItemPressed]}
                        onPress={openSwitcher}
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
                visible={editNameVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setEditNameVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.editNameRoot}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <Pressable
                        style={[StyleSheet.absoluteFillObject, styles.editNameBackdrop]}
                        onPress={() => setEditNameVisible(false)}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                    />
                    <View style={styles.editNameCard}>
                        <Text style={styles.editNameTitle}>Edit child's name</Text>
                        <TextInput
                            value={nameDraft}
                            onChangeText={setNameDraft}
                            placeholder="Name"
                            placeholderTextColor="#999"
                            style={styles.editNameInput}
                            autoFocus
                            maxLength={30}
                            returnKeyType="done"
                            onSubmitEditing={saveChildName}
                        />
                        <View style={styles.editNameActions}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.editNameButton,
                                    styles.editNameCancel,
                                    pressed && styles.editNameButtonPressed,
                                ]}
                                onPress={() => setEditNameVisible(false)}
                            >
                                <Text style={styles.editNameCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.editNameButton,
                                    styles.editNameSave,
                                    pressed && styles.editNameButtonPressed,
                                ]}
                                onPress={saveChildName}
                            >
                                <Text style={styles.editNameSaveText}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                visible={changePasswordVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setChangePasswordVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.editNameRoot}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <Pressable
                        style={[StyleSheet.absoluteFillObject, styles.editNameBackdrop]}
                        onPress={() => setChangePasswordVisible(false)}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                    />
                    <View style={styles.editNameCard}>
                        <Text style={styles.editNameTitle}>Change password</Text>
                        <TextInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Current password"
                            placeholderTextColor="#999"
                            style={styles.editNameInput}
                            secureTextEntry
                            autoCapitalize="none"
                            textContentType="password"
                        />
                        <View style={{ height: 12 }} />
                        <TextInput
                            value={newPassword}
                            onChangeText={(t) => setNewPassword(t)}
                            placeholder="New password"
                            placeholderTextColor="#999"
                            style={styles.editNameInput}
                            secureTextEntry
                            autoCapitalize="none"
                            textContentType="newPassword"
                        />
                        <View style={{ height: 12 }} />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            placeholderTextColor="#999"
                            style={styles.editNameInput}
                            secureTextEntry
                            autoCapitalize="none"
                            textContentType="password"
                        />
                        <View style={styles.editNameActions}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.editNameButton,
                                    styles.editNameCancel,
                                    pressed && styles.editNameButtonPressed,
                                ]}
                                onPress={() => setChangePasswordVisible(false)}
                            >
                                <Text style={styles.editNameCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.editNameButton,
                                    styles.editNameSave,
                                    pressed && styles.editNameButtonPressed,
                                ]}
                                onPress={handleChangePassword}
                                disabled={isChangingPassword}
                            >
                                <Text style={styles.editNameSaveText}>{isChangingPassword ? 'Saving...' : 'Save'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                visible={birthDateModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setBirthDateModalVisible(false)}
            >
                <View style={styles.editNameRoot}>
                    <Pressable
                        style={[StyleSheet.absoluteFillObject, styles.editNameBackdrop]}
                        onPress={() => setBirthDateModalVisible(false)}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                    />
                    <View style={[styles.editNameCard, styles.calendarCard]}>
                        <Text style={styles.editNameTitle}>
                            Select {selectedChild?.name}'s birth date
                        </Text>
                        <CalendarPicker
                            value={activeBirthDate}
                            minDate={new Date(2000, 0, 1)}
                            onChange={(iso) => {
                                updateChildBirthDate(selectedChild?.id ?? '', iso);
                                setBirthDateModalVisible(false);
                            }}
                        />
                        <View style={styles.editNameActions}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.editNameButton,
                                    styles.editNameCancel,
                                    pressed && styles.editNameButtonPressed,
                                ]}
                                onPress={() => setBirthDateModalVisible(false)}
                            >
                                <Text style={styles.editNameCancelText}>Close</Text>
                            </Pressable>
                        </View>
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

    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    scroll: {
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

    sectionTitle: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        paddingHorizontal: 20,
        paddingTop: 20,
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
        backgroundColor: 'rgba(80, 88, 180, 0.06)',
    },

    itemLabel: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
    },

    itemValue: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
    },

    itemValueTrailing: {
        flexShrink: 1,
        textAlign: 'right',
        marginRight: 8,
        maxWidth: '60%',
    },

    itemArrow: {
        fontSize: 22,
        color: '#ccc',
    },

    dangerSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
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
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#e74c3c',
    },

    title: {
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        paddingHorizontal: 20,
        paddingBottom: 16,
        letterSpacing: -0.3,
    },


    editNameRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },

    editNameBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
    },

    editNameCard: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },

    editNameTitle: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        marginBottom: 14,
    },

    editNameInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontFamily: 'NotoSans-Regular',
        color: '#151515',
        backgroundColor: '#fafafa',
    },

    editNameActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 16,
    },

    editNameButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },

    editNameButtonPressed: {
        opacity: 0.85,
    },

    editNameCancel: {
        backgroundColor: '#f0f0f0',
    },

    editNameCancelText: {
        fontSize: 15,
        fontFamily: 'NotoSans-Medium',
        color: '#151515',
    },

    editNameSave: {
        backgroundColor: '#5058b4',
    },

    editNameSaveText: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#ffffff',
    },

    calendarCard: {
        maxWidth: 360,
    },
});