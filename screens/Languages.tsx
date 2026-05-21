import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import { getAuth } from 'firebase/auth';

export default function Languages() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const languages = ['English', 'Spanish', 'Chinese', 'Vietnamese', 'Korean', 'Japanese'];
    const BASE_URL = 'http://localhost:4000';

    // Load user's selected language from backend
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const user = getAuth().currentUser;
                if (!user) return;
                const token = await user.getIdToken();

                const res = await fetch(`${BASE_URL}/settings/language`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                console.log("Loaded language:", data.language);
                if (data.language) {
                    setSelectedLanguage(data.language);
                }

            } catch (err) {
                console.error('Failed to load language:', err);
            }
        };

        loadLanguage();
    }, []);

    // Update language selection in backend when user changes it
    const updateLanguage = async (language: string) => {
        try {
            setSelectedLanguage(language);
            const user = getAuth().currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            await fetch(`${BASE_URL}/settings/language`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language }),
            });

        } catch (err) {
            console.error('Failed to update language:', err);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />

            {/* Header */}
                <BackArrow/>

            {/* Title */}
            <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Languages</Text>

            <View style={styles.section}>
                <View style={styles.selectedItem}>
                    <Text style={styles.itemLabel}>Selected Language</Text>
                    <Text style={styles.itemValue}>{selectedLanguage}</Text>
                </View>
            </View>

            {/* Language Options */}
            <View style={styles.section}>
                {languages.map((language) => (
                    <Pressable
                        key={language}
                        onPress={() => updateLanguage(language)}
                        style={({ pressed }) => [
                            styles.languageItem,
                            pressed && styles.languageItemPressed
                        ]}
                    >
                        <Text style={styles.languageLabel}>
                            {language}
                        </Text>

                        {selectedLanguage === language && (
                            <Text style={styles.checkmark}>✓</Text>
                        )}
                    </Pressable>
                ))}
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
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    backArrow: {
        fontSize: 24,
        color: '#333',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },

    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    itemLabel: {
        fontSize: 16,
        color: '#333',
    },

    itemValue: {
        fontSize: 16,
        color: '#8BC0CF',
    },

    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    languageItemPressed: {
        backgroundColor: '#f8f8f8',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    languageLabel: {
        fontSize: 16,
        color: '#333',
    },

    checkmark: {
        fontSize: 18,
        color: '#8BC0CF',
        fontWeight: '600',
    },
});
