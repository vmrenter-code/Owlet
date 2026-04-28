import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { use, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { get } from 'node:http';
import { useChild } from '../context/ChildContext';
 

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
    const BASE_URL = 'http://localhost:4000';
    const navigation = useNavigation<any>();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [editingChildName, setEditingChildName] = useState('');
    const [editingChildBday, setEditingChildBday] = useState('');

    const { children, selectedChild, setSelectedChild, updateChildren } = useChild();

    const handleDeleteAccount = () => {
        console.log('Delete account pressed');
    };

    const handleLogout = () => {
        navigation.navigate('Launch');
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

    useEffect(() => {
        if (!selectedChild) return;

        setEditingChildName(selectedChild.name || '');
        setEditingChildBday(
            selectedChild.birthday
                ? new Date(selectedChild.birthday).toLocaleDateString()
                : ''
        );
    }, [selectedChild]);

    // Save child updates
    const saveChildUpdates = async () => {
        const user = getAuth().currentUser;
        if (!user || !selectedChild) return;

        const token = await user.getIdToken();
        if (!selectedChild) {
            console.error("No child selected");
            return;
        }
        await fetch(`${BASE_URL}/children/${selectedChild.id}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: editingChildName,
                birthday: editingChildBday ? new Date(editingChildBday).toISOString() : null,
            }),
        });
        await updateChildren();
    };

    // Create new child profile
    const createChildProfile = async () => {
        const user = getAuth().currentUser;
        if (!user) {
            console.log('No user logged in');
            return;
        }

        const token = await user.getIdToken();
        const res = await fetch(`${BASE_URL}/children`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'New Child',
                birthday: null,
            }),
        });
        const data = await res.json();
        const newChild = data.child;
        await updateChildren();
        if (newChild) {
            setSelectedChild(newChild);
        }
    }

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
                    <View style={styles.accountItem}>
                        <Text style={styles.itemLabel}>Name</Text>
                        <TextInput
                            style={styles.itemValue}
                            placeholder="Enter name"
                            value={editingChildName}
                            onChangeText={setEditingChildName}
                            onBlur={saveChildUpdates}
                        />
                    </View>

                    {/* Birth Date */}
                    <View style={styles.accountItem}>
                        <Text style={styles.itemLabel}>Birth Date</Text>
                        <TextInput
                            style={styles.itemValue}
                            placeholder="MM/DD/YYYY"
                            value={editingChildBday}
                            onChangeText={setEditingChildBday}
                            onBlur={saveChildUpdates}
                        />
                    </View>

                    {/* Race & Ethnicity */}
                    <Pressable style={({ pressed }) => [styles.accountItem, pressed && styles.accountItemPressed]}>
                        <Text style={styles.itemLabel}>Race & Ethnicity</Text>
                        <Text style={styles.itemArrow}>›</Text>
                    </Pressable>

                    {/* Switch Child Profile */}
                    <View style={styles.accountItem}>
                        <Text style={styles.itemLabel}>Switch Child</Text>
                    </View>

                    {children.map((child) => (
                        <Pressable
                            key={child.id}
                            onPress={() => {
                                setSelectedChild(child);
                                setEditingChildName(child.name || '');
                                setEditingChildBday(
                                    child.birthday
                                        ? new Date(child.birthday).toLocaleDateString()
                                        : ''
                                );
                            }}
                        >
                            <Text style={{ padding: 8 }}>
                                {child.name || "Unnamed Child"}
                            </Text>
                        </Pressable>
                    ))}

                    {/* Add Child */}
                    <Pressable onPress={createChildProfile} style={styles.accountItem}>
                        <Text style={styles.itemLabel}>Add New Child</Text>
                    </Pressable>
                </View>

                {/* Danger Zone */}
                <View style={styles.dangerSection}>
                    <Pressable
                        style={({ pressed }) => [styles.dangerItem, pressed && styles.dangerItemPressed]}
                        onPress={handleDeleteAccount}
                    >
                        <Text style={styles.dangerText}>Delete Account</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.dangerItem, styles.lastItem, pressed && styles.dangerItemPressed]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.dangerText}>Log out</Text>
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
